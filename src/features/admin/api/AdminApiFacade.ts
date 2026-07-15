/**
 * Fachada pública del API administrativo.
 *
 * Mantiene la forma del objeto monolítico original (`adminApi`) para que los
 * consumidores existentes (AdminApp.tsx, hooks, etc.) sigan funcionando sin
 * cambios. Internamente delega a los servicios por dominio.
 *
 * Las llamadas que antes se veían así:
 *   adminApi.products(filters, page)
 *   adminApi.categoryMedia(id)
 * Siguen funcionando idénticas. Los nuevos servicios como `subcategoriesApi`
 * se exponen también en la fachada bajo nombres consistentes.
 */

import { accountsApi } from "./AccountsApi";
import { authApi } from "./AuthApi";
import { categoriesApi } from "./CategoriesApi";
import { productMediaApi } from "./ProductMediaApi";
import { productsApi } from "./ProductsApi";
import { subcategoriesApi } from "./SubcategoriesApi";
export { AdminApiError } from "./AdminApiClient";

// ────────────────────────────────────────────────────────────────
// Auth & session
// ────────────────────────────────────────────────────────────────
const session = () => authApi.session();
const login = (username: string, password: string) =>
  authApi.login(username, password);
const changePassword = (
  csrfToken: string,
  currentPassword: string,
  newPassword: string,
) => authApi.changePassword(csrfToken, currentPassword, newPassword);
const logout = (csrfToken: string) => authApi.logout(csrfToken);

// ────────────────────────────────────────────────────────────────
// Products
// ────────────────────────────────────────────────────────────────
const products = (filters: Parameters<typeof productsApi.list>[0], page: number) =>
  productsApi.list(filters, page);
const product = (id: number) => productsApi.get(id);
const createProduct = (csrfToken: string, body: object) =>
  productsApi.create(csrfToken, body);
const updateProduct = (
  id: number,
  csrfToken: string,
  expectedUpdatedAt: string,
  changes: Parameters<typeof productsApi.update>[3],
) => productsApi.update(id, csrfToken, expectedUpdatedAt, changes);
const productLifecycle = (
  id: number,
  action: "retire" | "restore",
  csrfToken: string,
  expectedUpdatedAt: string,
) => productsApi.lifecycle(id, action, csrfToken, expectedUpdatedAt);
const productTypes = () => productsApi.types();

// ────────────────────────────────────────────────────────────────
// Product media
// ────────────────────────────────────────────────────────────────
const uploadMedia = (
  kind: "product" | "category",
  file: File,
  csrfToken: string,
) => productMediaApi.upload(kind, file, csrfToken);
const cancelUpload = (id: string, csrfToken: string) =>
  productMediaApi.cancel(id, csrfToken);
const productMedia = (id: number) => productMediaApi.list(id);
const addProductImage = (id: number, csrfToken: string, body: object) =>
  productMediaApi.add(id, csrfToken, body);
const saveProductImageOrder = (id: number, csrfToken: string, body: object) =>
  productMediaApi.saveOrder(id, csrfToken, body);
const updateProductImage = (
  productId: number,
  imageId: string,
  csrfToken: string,
  body: object,
) => productMediaApi.update(productId, imageId, csrfToken, body);
const removeProductImage = (
  productId: number,
  imageId: string,
  csrfToken: string,
  body: object,
) => productMediaApi.remove(productId, imageId, csrfToken, body);

// ────────────────────────────────────────────────────────────────
// Categories
// ────────────────────────────────────────────────────────────────
const categories = (
  q = "",
  page = 1,
  retired = false,
) => categoriesApi.list(q, page, retired);
const category = (id: string) => categoriesApi.get(id);
const createCategory = (csrfToken: string, body: object) =>
  categoriesApi.create(csrfToken, body);
const updateCategory = (id: string, csrfToken: string, body: object) =>
  categoriesApi.update(id, csrfToken, body);
const categoryLifecycle = (
  id: string,
  action: "retire" | "restore",
  csrfToken: string,
  expectedUpdatedAt: string,
) => categoriesApi.lifecycle(id, action, csrfToken, expectedUpdatedAt);

// ────────────────────────────────────────────────────────────────
// Category image
// ────────────────────────────────────────────────────────────────
const categoryMedia = (id: string) => categoriesApi.media.get(id);
const addCategoryImage = (id: string, csrfToken: string, body: object) =>
  categoriesApi.media.add(id, csrfToken, body);
const updateCategoryImage = (id: string, csrfToken: string, body: object) =>
  categoriesApi.media.update(id, csrfToken, body);
const removeCategoryImage = (id: string, csrfToken: string, body: object) =>
  categoriesApi.media.remove(id, csrfToken, body);

// ────────────────────────────────────────────────────────────────
// Accounts
// ────────────────────────────────────────────────────────────────
const accounts = () => accountsApi.list();
const createAccount = (csrfToken: string, body: object) =>
  accountsApi.create(csrfToken, body);
const updateAccount = (id: string, csrfToken: string, body: object) =>
  accountsApi.update(id, csrfToken, body);

// ────────────────────────────────────────────────────────────────
// Subcategories (NEW)
// ────────────────────────────────────────────────────────────────
const subcategories = (
  q = "",
  page = 1,
  categoryId?: string,
  active?: boolean,
) => subcategoriesApi.list(q, page, categoryId, active);
const subcategory = (id: string) => subcategoriesApi.get(id);
const createSubcategory = (
  csrfToken: string,
  body: Parameters<typeof subcategoriesApi.create>[1],
) => subcategoriesApi.create(csrfToken, body);
const updateSubcategory = (
  id: string,
  csrfToken: string,
  body: Parameters<typeof subcategoriesApi.update>[2],
) => subcategoriesApi.update(id, csrfToken, body);
const removeSubcategory = (
  id: string,
  csrfToken: string,
  body: Parameters<typeof subcategoriesApi.remove>[2],
) => subcategoriesApi.remove(id, csrfToken, body);

/**
 * Objeto `adminApi` con la misma forma que la versión monolítica anterior.
 * Todos los consumidores existentes pueden seguir usando
 * `adminApi.products(...)`, `adminApi.login(...)`, etc. sin cambios.
 */
export const adminApi = {
  // Auth
  session,
  login,
  changePassword,
  logout,

  // Products
  products,
  product,
  createProduct,
  updateProduct,
  productLifecycle,
  productTypes,

  // Product media
  uploadMedia,
  cancelUpload,
  productMedia,
  addProductImage,
  saveProductImageOrder,
  updateProductImage,
  removeProductImage,

  // Categories
  categories,
  category,
  createCategory,
  updateCategory,
  categoryLifecycle,

  // Category image
  categoryMedia,
  addCategoryImage,
  updateCategoryImage,
  removeCategoryImage,

  // Accounts
  accounts,
  createAccount,
  updateAccount,

  // Subcategories
  subcategories,
  subcategory,
  createSubcategory,
  updateSubcategory,
  removeSubcategory,
};
