import type { AdminAccount } from "../types";
import { request } from "./AdminApiClient";

export const accountsApi = {
  list: () => request<{ items: AdminAccount[] }>("/api/admin/accounts"),
  create: (csrfToken: string, body: object) =>
    request<{ item: AdminAccount }>("/api/admin/accounts", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: JSON.stringify(body),
    }),
  update: (id: string, csrfToken: string, body: object) =>
    request<{ item: AdminAccount }>(
      `/api/admin/accounts/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "x-csrf-token": csrfToken },
        body: JSON.stringify(body),
      },
    ),
};
