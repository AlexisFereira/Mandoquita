import { AdminApiError } from "../api";
/**
 * Mapea un error desconocido a un mensaje user-facing.
 * Mantiene el comportamiento exacto del helper original.
 */
export function adminErrorMessage(
  error: unknown,
  fallback: string,
): string {

  const codeText: Record<number, string> = {
    400: "Revisa los datos indicados.",
    401: "No se pudo confirmar la autorización.",
    403: "No se pudo confirmar la autorización.",
    404: "El recurso ya no está disponible.",
    409: "La información cambió en otra sesión. Recarga antes de continuar.",
    429: "La acción no está disponible temporalmente. Intenta más tarde.",
    503: "La administración no está disponible en este momento.",
  };

  if (error instanceof AdminApiError) {
    return codeText[error.status] ?? fallback;
  }

  return fallback;
}
