import type { AdminSession } from "../types";
import { request } from "./AdminApiClient";

export const authApi = {
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
};
