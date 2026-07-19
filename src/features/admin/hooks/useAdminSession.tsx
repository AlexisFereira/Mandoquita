import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api";
import type { AdminSession } from "../types";

export type UseAdminSession = {
  session: AdminSession | null;
  checking: boolean;
  notice: string;
  accessGranted: (session: AdminSession) => void;
  expired: () => void;
  logout: () => Promise<void>;
  clearNotice: () => void;
};

export function useAdminSession(): UseAdminSession {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminApi
      .session()
      .then(setSession)
      .catch(() => null)
      .finally(() => setChecking(false));
  }, []);

  const accessGranted = useCallback((next: AdminSession) => {
    setSession(next);
    setNotice("");
  }, []);

  const expired = useCallback(() => {
    setSession(null);
    setNotice("Tu sesión administrativa terminó. Ingresa nuevamente.");
  }, []);

  const logout = useCallback(async () => {
    if (!session) return;
    try {
      await adminApi.logout(session.csrfToken);
    } finally {
      setSession(null);
      setNotice("La sesión se cerró correctamente.");
    }
  }, [session]);

  const clearNotice = useCallback(() => setNotice(""), []);

  return {
    session,
    checking,
    notice,
    accessGranted,
    expired,
    logout,
    clearNotice,
  };
}
