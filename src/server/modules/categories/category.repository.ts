import type { Category, Prisma, PrismaClient } from "@prisma/client";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

export type CategoryRepository = {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findByVersion(versionId: string): Promise<Category[]>;
  countByVersion(versionId: string): Promise<number>;
  maxSortOrder(versionId: string): Promise<number>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: string, input: UpdateCategoryInput): Promise<Category>;
  retire(
    id: string,
    actorAccountId: string,
    expectedUpdatedAt: Date,
  ): Promise<Category | null>;
  restore(id: string, expectedUpdatedAt: Date): Promise<Category | null>;
  countDependencies(categoryId: string): Promise<{
    subcategories: number;
    productTypes: number;
    products: number;
  }>;
  findManyWithFilters(args: {
    versionId: string;
    retired: boolean;
    q?: string;
    skip: number;
    take: number;
  }): Promise<Category[]>;
};

/**
 * Tipo que el repositorio acepta como "db". Puede ser PrismaClient
 * o un Prisma.TransactionClient, para soportar transacciones.
 */
export type Db = PrismaClient | Prisma.TransactionClient;


