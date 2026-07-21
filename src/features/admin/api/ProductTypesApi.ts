import type { AdminProductType, AdminProductTypeList } from "../types";
import { mutationHeaders, request } from "./AdminApiClient";

export const productTypesApi = {
  list: (q = "", page = 1, subcategoryId?: string, active?: boolean, extraParams?: Record<string, string>) => {
    const params = new URLSearchParams({ page: String(page), limit: "40" });
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    const trimmed = q.trim();
    if (trimmed) params.set("q", trimmed);
    if (subcategoryId) params.set("subcategoryId", subcategoryId);
    if (typeof active === "boolean") params.set("active", String(active));
    return request<AdminProductTypeList>(`/api/admin/product-types?${params}`);
  },

  get: (name: string) =>
    request<{ item: AdminProductType }>(
      `/api/admin/product-types/${encodeURIComponent(name)}`,
    ),

  create: (
    csrfToken: string,
    body: { name: string; subcategoryId: string; sourceOrder?: number },
  ) =>
    request<{ item: AdminProductType }>("/api/admin/product-types", {
      method: "POST",
      headers: mutationHeaders(csrfToken),
      body: JSON.stringify(body),
    }),

  update: (
    name: string,
    csrfToken: string,
    body: {
      subcategoryId?: string;
      active?: boolean;
      sourceOrder?: number;
      expectedUpdatedAt: string;
    },
  ) =>
    request<{ item: AdminProductType }>(
      `/api/admin/product-types/${encodeURIComponent(name)}`,
      {
        method: "PATCH",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),

  remove: (name: string, csrfToken: string, body: { expectedUpdatedAt: string }) =>
    request<{ item: AdminProductType }>(
      `/api/admin/product-types/${encodeURIComponent(name)}/retire`,
      {
        method: "POST",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
};
