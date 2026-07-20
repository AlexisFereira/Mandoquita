// Errors
export {
  ProductTypeNotFoundError,
  ProductTypeAdminConflictError,
  ProductTypeDependenciesError,
} from "./productType.errors";

// Application services
export { listProductTypes } from "./application/list-product-types.service";
export { getProductType } from "./application/get-product-type.service";
export { createProductType } from "./application/create-product-type.service";
export { updateProductType } from "./application/update-product-type.service";
export { retireProductType } from "./application/retire-product-type.service";
export { restoreProductType } from "./application/restore-product-type.service";

// Repository
export type { ProductTypeRepository, Db } from "./productType.repository";
export { createPrismaProductTypeRepository } from "./prisma-productType.repository";

// Schemas
export {
  createProductTypeSchema,
  type CreateProductTypeInput,
} from "./schemas/create-product-type.schema";
export {
  updateProductTypeSchema,
  type UpdateProductTypeInput,
} from "./schemas/update-product-type.schema";
export {
  listProductTypesSchema,
  type ListProductTypesInput,
} from "./schemas/list-product-types.schema";
