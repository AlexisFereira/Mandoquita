import type { Prisma, PrismaClient, Subcategory } from "@prisma/client";

export type Db = PrismaClient | Prisma.TransactionClient;

export type SubcategoryRepository = {
  findById(id: string): Promise<Subcategory | null>;
  findBySlug(slug: string): Promise<Subcategory | null>;
  findByCategory(categoryId: string): Promise<Subcategory[]>;
  findManyWithFilters(args: {
    categoryId?: string;
    retired: boolean;
    q?: string;
  }): Promise<Subcategory[]>;
  countByCategory(categoryId: string): Promise<number>;
  maxSourceOrder(categoryId: string): Promise<number>;
  create(input: {
    slug: string;
    name: string;
    categoryId: string;
    sourceOrder: number;
    active?: boolean;
  }): Promise<Subcategory>;
  update(
    id: string,
    input: {
      slug?: string;
      name?: string;
      categoryId?: string;
      sourceOrder?: number;
      active?: boolean;
    },
  ): Promise<Subcategory>;
  retire(id: string, actorAccountId: string): Promise<Subcategory | null>;
  restore(id: string): Promise<Subcategory | null>;
  countProductTypes(subcategoryId: string): Promise<number>;
  countProductsBySubcategory(subcategoryId: string): Promise<number>;

  findManyWithFiltersPaginated(args: {
    categoryId?: string;
    retired: boolean;
    q?: string;
    skip: number;
    take: number;
  }): Promise<{ items: Subcategory[]; totalItems: number }>;

};
