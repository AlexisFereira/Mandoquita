import type {
  AdminCategory,
  AdminCategoryList,
  AdminCategoryMedia,
} from "../types";
import { mutationHeaders, request } from "./AdminApiClient";

export const categoriesApi = {
  list: (q = "", page = 1, retired = false) =>
    request<AdminCategoryList>(
      `/api/admin/categories?${new URLSearchParams({ page: String(page), limit: "20", retired: String(retired), ...(q.trim() ? { q: q.trim() } : {}) })}`,
    ),
  get: (id: string) =>
    request<{ item: AdminCategory }>(
      `/api/admin/categories/${encodeURIComponent(id)}`,
    ),
  create: (csrfToken: string, body: object) =>
    request<{ item: AdminCategory }>("/api/admin/categories", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(body),
    }),
  update: (id: string, csrfToken: string, body: object) =>
    request<{ item: AdminCategory }>(
      `/api/admin/categories/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "x-csrf-token": csrfToken },
        body: JSON.stringify(body),
      },
    ),
  lifecycle: (
    id: string,
    action: "retire" | "restore",
    csrfToken: string,
    expectedUpdatedAt: string,
  ) =>
    request<{ item: AdminCategory }>(
      `/api/admin/categories/${encodeURIComponent(id)}/${action}`,
      {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
        body: JSON.stringify({ expectedUpdatedAt }),
      },
    ),
  media: {
    get: (id: string) =>
      request<{ category: AdminCategoryMedia }>(
        `/api/admin/categories/${encodeURIComponent(id)}/image`,
      ),
    add: (id: string, csrfToken: string, body: object) =>
      request<{ category: AdminCategoryMedia }>(
        `/api/admin/categories/${encodeURIComponent(id)}/image`,
        {
          method: "POST",
          headers: mutationHeaders(csrfToken),
          body: JSON.stringify(body),
        },
      ),
    update: (id: string, csrfToken: string, body: object) =>
      request<{ category: AdminCategoryMedia }>(
        `/api/admin/categories/${encodeURIComponent(id)}/image`,
        {
          method: "PATCH",
          headers: mutationHeaders(csrfToken),
          body: JSON.stringify(body),
        },
      ),
    remove: (id: string, csrfToken: string, body: object) =>
      request<{ category: AdminCategoryMedia }>(
        `/api/admin/categories/${encodeURIComponent(id)}/image`,
        {
          method: "DELETE",
          headers: mutationHeaders(csrfToken),
          body: JSON.stringify(body),
        },
      ),
  },
};
