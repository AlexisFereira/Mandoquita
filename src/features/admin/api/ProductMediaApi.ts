import type {
  AdminMediaUpload,
  AdminProductMedia,
} from "../types";
import { mutationHeaders, request } from "./AdminApiClient";

export const productMediaApi = {
  upload: (
    kind: "product" | "category",
    file: File,
    csrfToken: string,
  ) =>
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
  cancel: (id: string, csrfToken: string) =>
    request<{ cancelled: true }>(`/api/admin/media-uploads/${id}`, {
      method: "DELETE",
      headers: mutationHeaders(csrfToken),
    }),
  list: (id: number) =>
    request<AdminProductMedia>(`/api/admin/products/${id}/images`),
  add: (id: number, csrfToken: string, body: object) =>
    request<AdminProductMedia>(`/api/admin/products/${id}/images`, {
      method: "POST",
      headers: mutationHeaders(csrfToken),
      body: JSON.stringify(body),
    }),
  saveOrder: (id: number, csrfToken: string, body: object) =>
    request<AdminProductMedia>(`/api/admin/products/${id}/images`, {
      method: "PATCH",
      headers: mutationHeaders(csrfToken),
      body: JSON.stringify(body),
    }),
  update: (
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
  remove: (
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
};
