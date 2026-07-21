/**
 * Capa de transporte compartida por todos los servicios del panel administrativo.
 * Define el cliente HTTP, los helpers de mutación y el error tipado.
 */

export class AdminApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}

export function idempotencyKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function mutationHeaders(csrfToken: string): Record<string, string> {
  return {
    "x-csrf-token": csrfToken,
    "Idempotency-Key": idempotencyKey(),
  };
}

export async function request<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
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
    const retryAfter =
      Number(response.headers.get("Retry-After")) || undefined;
    throw new AdminApiError(
      response.status,
      body?.error ?? "Request failed",
      retryAfter,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
