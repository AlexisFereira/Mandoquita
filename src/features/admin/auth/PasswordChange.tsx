import React, { useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Container } from "../../../components/Container";
import { Notice } from "../components/Notice";
import { adminApi } from "../api";
import type { AdminSession } from "../types";
import { PasswordInput } from "../components/PasswordInput";
import { adminErrorMessage } from "../utils/error-messages";

export function PasswordChange({
  session,
  onChanged,
  onLogout,
}: {
  session: AdminSession;
  onChanged: (session: AdminSession) => void;
  onLogout: () => void;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (next.length < 12 || next.length > 128 || next !== confirmation) {
      setStatus(
        next !== confirmation
          ? "La confirmación no coincide con la nueva contraseña."
          : "Usa entre 12 y 128 caracteres.",
      );
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      onChanged(
        await adminApi.changePassword(session.csrfToken, current, next),
      );
    } catch (cause) {
      setCurrent("");
      setNext("");
      setConfirmation("");
      setStatus(
        adminErrorMessage(cause, "No se pudo confirmar la nueva contraseña."),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="admin-main" className="py-10">
      <Container size="sm" padding="lg">
        <Card className="mx-auto max-w-[560px] space-y-6">
          <div className="space-y-3">
            <span className="ds-eyebrow">Mandoquita · Administración</span>
            <h1 className="ds-heading ds-heading-lg">
              Reemplaza tu contraseña
            </h1>
            <p>
              Tu contraseña temporal no permite administrar el catálogo. Crea
              una nueva contraseña para continuar.
            </p>
            <p className="text-sm text-[rgb(var(--muted)/1)]">
              Usa entre 12 y 128 caracteres. Puedes usar espacios y caracteres
              Unicode.
            </p>
          </div>
          {status ? <Notice text={status} variant="error" /> : null}
          <form className="space-y-5" onSubmit={submit}>
            <PasswordInput
              id="current-password"
              label="Contraseña temporal"
              autoComplete="current-password"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
            />
            <PasswordInput
              id="new-password"
              label="Nueva contraseña"
              autoComplete="new-password"
              value={next}
              onChange={(event) => setNext(event.target.value)}
            />
            <PasswordInput
              id="confirm-password"
              label="Confirmar nueva contraseña"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={busy}>
                {busy
                  ? "Guardando nueva contraseña…"
                  : "Guardar nueva contraseña"}
              </Button>
              <Button type="button" variant="secondary" onClick={onLogout}>
                Salir
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </main>
  );
}
