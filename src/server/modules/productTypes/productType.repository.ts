import type { Prisma, PrismaClient, ProductType } from "@prisma/client";
import type {
  CreateProductTypeInput,
  UpdateProductTypeInput,
} from "./productType.types";

export type Db = PrismaClient | Prisma.TransactionClient;

export type ProductTypeRepository = {
  findByName(name: string): Promise<ProductType | null>;
  findBySubcategory(subcategoryId: string): Promise<ProductType[]>;
  countBySubcategory(subcategoryId: string): Promise<number>;
  maxSourceOrder(subcategoryId: string): Promise<number>;
  create(input: CreateProductTypeInput): Promise<ProductType>;
  update(name: string, input: UpdateProductTypeInput): Promise<ProductType>;
  setActive(name: string, active: boolean): Promise<ProductType | null>;
  countProducts(name: string): Promise<number>;

  findManyWithFilters(args: {
    subcategoryId?: string;
    retired: boolean;
    q?: string;
  }): Promise<ProductType[]>;

  updateWithRetiredAt(
    name: string,
    retiredAt: Date | null,
    retiredByAccountId: string | null,
  ): Promise<ProductType | null>;

};
