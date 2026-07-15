import type {
  AdminEditorValues,
  AdminAccount,
  AdminCategory,
  AdminCategoryList,
  AdminFilters,
  AdminCategoryMedia,
  AdminMediaUpload,
  AdminProduct,
  AdminProductMedia,
  AdminProductList,
  AdminProductType,
  AdminSession,
} from "./types";

export class AdminApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}

function idempotencyKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function mutationHeaders(csrfToken: string) {
  return { "x-csrf-token": csrfToken, "Idempotency-Key": idempotencyKey() };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    const retryAfter = Number(response.headers.get("Retry-After")) || undefined;
    throw new AdminApiError(
      response.status,
      body?.error ?? "Request failed",
      retryAfter,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const adminApi = {
  session: () => request<AdminSession>("/api/admin/session"),
  login: (username: string, password: string) =>
    request<AdminSession>("/api/admin/session", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  changePassword: (
    csrfToken: string,
    currentPassword: string,
    newPassword: string,
  ) =>
    request<AdminSession>("/api/admin/session", {
      method: "PATCH",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  logout: (csrfToken: string) =>
    request<void>("/api/admin/session", {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    }),
  products: (filters: AdminFilters, page: number) => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    Object.entries(filters).forEach(([key, value]) => {
      const normalized = value.trim();
      if (normalized) params.set(key, normalized);
    });
    return request<AdminProductList>(`/api/admin/products?${params}`);
  },
  product: (id: number) =>
    request<{ item: AdminProduct }>(`/api/admin/products/${id}`),
  createProduct: (csrfToken: string, body: object) =>
    request<{ item: AdminProduct }>("/api/admin/products", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(body),
    }),
  productLifecycle: (
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
  productTypes: () =>
    request<{ items: AdminProductType[] }>("/api/admin/product-types"),
  updateProduct: (
    id: number,
    csrfToken: string,
    expectedUpdatedAt: string,
    changes: Partial<AdminEditorValues>,
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
    return request<{ item: AdminProduct }>(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(payload),
    });
  },
  uploadMedia: (kind: "product" | "category", file: File, csrfToken: string) =>
    request<{ upload: AdminMediaUpload }>(
      `/api/admin/media-uploads?kind=${kind}`,
      {
        method: "POST",
        headers: {
          ...mutationHeaders(csrfToken),
          "Content-Type": file.type,
          "x-file-name": encodeURIComponent(file.name),
        },
        body: file,
      },
    ),
  cancelUpload: (id: string, csrfToken: string) =>
    request<{ cancelled: true }>(`/api/admin/media-uploads/${id}`, {
      method: "DELETE",
      headers: mutationHeaders(csrfToken),
    }),
  productMedia: (id: number) =>
    request<AdminProductMedia>(`/api/admin/products/${id}/images`),
  addProductImage: (id: number, csrfToken: string, body: object) =>
    request<AdminProductMedia>(`/api/admin/products/${id}/images`, {
      method: "POST",
      headers: mutationHeaders(csrfToken),
      body: JSON.stringify(body),
    }),
  saveProductImageOrder: (id: number, csrfToken: string, body: object) =>
    request<AdminProductMedia>(`/api/admin/products/${id}/images`, {
      method: "PATCH",
      headers: mutationHeaders(csrfToken),
      body: JSON.stringify(body),
    }),
  updateProductImage: (
    productId: number,
    imageId: string,
    csrfToken: string,
    body: object,
  ) =>
    request<AdminProductMedia>(
      `/api/admin/products/${productId}/images/${imageId}`,
      {
        method: "PATCH",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
  removeProductImage: (
    productId: number,
    imageId: string,
    csrfToken: string,
    body: object,
  ) =>
    request<AdminProductMedia>(
      `/api/admin/products/${productId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
  categories: (q = "", page = 1, retired = false) =>
    request<AdminCategoryList>(
      `/api/admin/categories?${new URLSearchParams({ page: String(page), limit: "20", retired: String(retired), ...(q.trim() ? { q: q.trim() } : {}) })}`,
    ),
  category: (id: string) =>
    request<{ item: AdminCategory }>(
      `/api/admin/categories/${encodeURIComponent(id)}`,
    ),
  createCategory: (csrfToken: string, body: object) =>
    request<{ item: AdminCategory }>("/api/admin/categories", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(body),
    }),
  updateCategory: (id: string, csrfToken: string, body: object) =>
    request<{ item: AdminCategory }>(
      `/api/admin/categories/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "x-csrf-token": csrfToken },
        body: JSON.stringify(body),
      },
    ),
  categoryLifecycle: (
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
  accounts: () => request<{ items: AdminAccount[] }>("/api/admin/accounts"),
  createAccount: (csrfToken: string, body: object) =>
    request<{ item: AdminAccount }>("/api/admin/accounts", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(body),
    }),
  updateAccount: (id: string, csrfToken: string, body: object) =>
    request<{ item: AdminAccount }>(
      `/api/admin/accounts/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "x-csrf-token": csrfToken },
        body: JSON.stringify(body),
      },
    ),
  categoryMedia: (id: string) =>
    request<{ category: AdminCategoryMedia }>(
      `/api/admin/categories/${encodeURIComponent(id)}/image`,
    ),
  addCategoryImage: (id: string, csrfToken: string, body: object) =>
    request<{ category: AdminCategoryMedia }>(
      `/api/admin/categories/${encodeURIComponent(id)}/image`,
      {
        method: "POST",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
  updateCategoryImage: (id: string, csrfToken: string, body: object) =>
    request<{ category: AdminCategoryMedia }>(
      `/api/admin/categories/${encodeURIComponent(id)}/image`,
      {
        method: "PATCH",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
  removeCategoryImage: (id: string, csrfToken: string, body: object) =>
    request<{ category: AdminCategoryMedia }>(
      `/api/admin/categories/${encodeURIComponent(id)}/image`,
      {
        method: "DELETE",
        headers: mutationHeaders(csrfToken),
        body: JSON.stringify(body),
      },
    ),
};
