import type {
  AdminEditorValues,
  AdminFilters,
  AdminProduct,
  AdminProductList,
  AdminProductType,
  AdminCreateProductValues
} from "../types";
import { request } from "./AdminApiClient";

export const productsApi = {
  list: (filters: AdminFilters, page: number) => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    Object.entries(filters).forEach(([key, value]) => {
      const normalized = value.trim();
      if (normalized) params.set(key, normalized);
    });
    return request<AdminProductList>(`/api/admin/products?${params}`);
  },
  get: (id: number) =>
    request<{ item: AdminProduct }>(`/api/admin/products/${id}`),
  create: (csrfToken: string, body: object) =>
    request<{ item: AdminProduct }>("/api/admin/products", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(body),
    }),
  update: (
    id: number,
    csrfToken: string,
    expectedUpdatedAt: string,
    changes: Partial<AdminCreateProductValues>,
  ) => {
    const payload: Record<string, unknown> = { expectedUpdatedAt };
    Object.entries(changes).forEach(([key, value]) => {
      if (
        [
          "shortDescription",
          "description",
          "brand",
          "collection",
          "seoTitle",
          "seoDescription",
        ].includes(key)
      ) {
        payload[key] =
          typeof value === "string" && value.trim() ? value.trim() : null;
      } else if (key === "genderApplicability" || key === "productTypeId") {
        payload[key] = value || null;
      } else if (key === "featuredOrder") {
        payload[key] = value === "" ? null : Number(value);
      } else {
        payload[key] = typeof value === "string" ? value.trim() : value;
      }
    });

    if (!payload.feature) {
      delete payload.featuredOrder;
    }

    return request<{ item: AdminProduct }>(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(payload),
    });
  },
  lifecycle: (
    id: number,
    action: "retire" | "restore",
    csrfToken: string,
    expectedUpdatedAt: string,
  ) =>
    request<{ item: AdminProduct }>(`/api/admin/products/${id}/${action}`, {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify({ expectedUpdatedAt }),
    }),
  types: () =>
    request<{ items: AdminProductType[] }>("/api/admin/product-types"),
};
