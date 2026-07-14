import { createHash } from "node:crypto";

import { Prisma, type PrismaClient } from "@prisma/client";

import { listFeaturedProducts, listProducts } from "@/server/catalogService";
import { listDiscoverableTaxonomy } from "@/server/taxonomyService";
import type { HomepageCategory, HomepagePayload } from "@/types/catalog";

const HOMEPAGE_FEATURED_PRODUCT_LIMIT = 8;
const SELECTED_CATEGORY_PRODUCT_LIMIT = 6;
const HOMEPAGE_TRANSACTION_TIMEOUT_MS = 15_000;
const BOGOTA_TIME_ZONE = "America/Bogota";

export function bogotaBusinessDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BOGOTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function selectionIndex(businessDate: string, candidateIds: string[]) {
  const [year, month, day] = businessDate.split("-").map(Number);
  const businessDayOrdinal = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
  const digest = createHash("sha256").update(candidateIds.join("\n")).digest();
  return (digest.readUInt32BE(0) + businessDayOrdinal) % candidateIds.length;
}

export function selectDailyHomepageCategory<T extends { id: string }>(candidates: T[], now: Date): T | null {
  if (!candidates.length) return null;
  const ordered = [...candidates].sort((left, right) => left.id.localeCompare(right.id));
  if (ordered.length === 1) return ordered[0];
  const ids = ordered.map(({ id }) => id);
  const businessDate = bogotaBusinessDate(now);
  return ordered[selectionIndex(businessDate, ids)];
}

async function selectedCategoryProjection(
  prisma: Prisma.TransactionClient,
  categories: HomepageCategory[],
  now: Date,
): Promise<HomepagePayload["selectedCategoryProducts"]> {
  const remaining = [...categories];
  while (remaining.length) {
    const selected = selectDailyHomepageCategory(remaining, now);
    if (!selected) return null;
    const catalog = await listProducts(prisma, {
      category: selected.slug,
      page: "1",
      limit: String(SELECTED_CATEGORY_PRODUCT_LIMIT),
    });
    if (catalog.items.length) {
      return {
        category: { id: selected.id, slug: selected.slug, name: selected.name },
        products: catalog.items,
        businessDate: bogotaBusinessDate(now),
      };
    }
    remaining.splice(remaining.findIndex(({ id }) => id === selected.id), 1);
  }
  return null;
}

/** Builds one repeatable-read SSR payload; React never chooses or refetches membership. */
export async function getHomepagePayload(prisma: PrismaClient, now = new Date()): Promise<HomepagePayload> {
  return prisma.$transaction(async (tx) => {
    const [featuredProducts, taxonomy] = await Promise.all([
      listFeaturedProducts(tx, HOMEPAGE_FEATURED_PRODUCT_LIMIT),
      listDiscoverableTaxonomy(tx),
    ]);
    const categories = taxonomy.map(({ subcategories: _subcategories, ...category }) => category);
    return {
      featuredProducts,
      categories,
      selectedCategoryProducts: await selectedCategoryProjection(tx, categories, now),
    };
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    timeout: HOMEPAGE_TRANSACTION_TIMEOUT_MS,
  });
}
