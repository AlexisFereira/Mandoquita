import { useState } from "react";
import { AdminApiError, adminApi } from "../../api";
import type { AdminProduct, AdminSession } from "../../types";
import { adminErrorMessage } from "../../utils/error-messages";

export type UseProductLifecycle = {
  confirming: boolean;
  setConfirming: (value: boolean) => void;
  status: string;
  busy: boolean;
  run: () => Promise<void>;
};

export function useProductLifecycle(
  session: AdminSession,
  product: AdminProduct | null,
  onProductChange: (next: AdminProduct) => void,
  onExpired: () => void,
): UseProductLifecycle {
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!product) return;
    setBusy(true);
    try {
      const action = product.retiredAt ? "restore" : "retire";
      const result = await adminApi.productLifecycle(
        product.id,
        action,
        session.csrfToken,
        product.updatedAt,
      );
      onProductChange(result.item);
      setConfirming(false);
      setStatus(
        action === "retire" ? "Producto retirado." : "Producto restaurado.",
      );
    } catch (cause) {
      if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
        onExpired();
      else setStatus(adminErrorMessage(cause, "No se cambió el ciclo de vida."));
    } finally {
      setBusy(false);
    }
  }

  return { confirming, setConfirming, status, busy, run };
}
