import type { AdminSubcategory, AdminSubcategoryList } from "../types";
import { mutationHeaders, request } from "./AdminApiClient";

export const subcategoriesApi = {
  list: (q = "", page = 1, categoryId?: string, active?: boolean, limit?: number) => {
    const params = new URLSearchParams({ page: String(page), limit: limit ? String(limit) : "40" });
    const trimmed = q.trim();
    if (trimmed) params.set("q", trimmed);
    if (categoryId) params.set("categoryId", categoryId);
    if (typeof active === "boolean") params.set("active", String(active));
    return request<AdminSubcategoryList>(`/api/admin/subcategories?${params}`);
  },
  get: (id: string) =>
    request<{ item: AdminSubcategory }>(
      `/api/admin/subcategories/${encodeURIComponent(id)}`,
    ),
  create: (
    csrfToken: string,
    body: {
      name: string;
      slug: string;
      categoryId: string;
      active?: boolean;
    },
  ) =>
    request<{ item: AdminSubcategory }>("/api/admin/subcategories", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(body),
    }),
  update: (
    id: string,
    csrfToken: string,
    body: {
      name?: string;
      slug?: string;
      categoryId?: string;
      active?: boolean;
      sourceOrder?: number;
      expectedUpdatedAt: string;
    },
  ) =>
    request<{ item: AdminSubcategory }>(
      `/api/admin/subcategories/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
  remove: (id: string, csrfToken: string, body: { expectedUpdatedAt: string }) =>
    request<{ item: AdminSubcategory }>(
      `/api/admin/subcategories/${encodeURIComponent(id)}/retire`,
      {
        method: "POST",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
};





