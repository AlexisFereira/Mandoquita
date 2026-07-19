import React, { useRef, useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Container } from "../../../components/Container";
import { Input } from "../../../components/Input";
import { Notice } from "../components/Notice";
import { AdminApiError, adminApi } from "../api";
import type { AdminSession } from "../types";
import { PasswordInput } from "../components/PasswordInput";
import { adminErrorMessage } from "../utils/error-messages";

export function AccessGate({
  notice,
  onAccess,
}: {
  notice?: string;
  onAccess: (session: AdminSession) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(notice ?? "");
  const [busy, setBusy] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Ingresa tu usuario y contraseña.");
      passwordRef.current?.focus();
      return;
    }
    setBusy(true);
    setError("");
    try {
      onAccess(await adminApi.login(username.trim(), password));
      setPassword("");
    } catch (cause) {
      setPassword("");
      setError(
        cause instanceof AdminApiError && [401, 403].includes(cause.status)
          ? "No se pudo iniciar sesión. Revisa los datos o contacta al Superadministrador."
          : adminErrorMessage(cause, "No se pudo iniciar sesión."),
      );
      requestAnimationFrame(() => passwordRef.current?.focus());
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="admin-main" className="flex min-h-screen items-center py-10">
      <Container size="sm" padding="lg">
        <Card
          as="section"
          padding="lg"
          className="mx-auto max-w-[480px] space-y-6"
          aria-labelledby="access-title"
        >
          <div className="space-y-3">
            <span className="ds-eyebrow">Mandoquita · Administración</span>
            <h1 id="access-title" className="ds-heading ds-heading-lg">
              Acceso administrativo
            </h1>
            <p>Ingresa con tu cuenta administrativa.</p>
          </div>
          {error ? <Notice text={error} variant="error" /> : null}
          <form onSubmit={submit} noValidate className="space-y-5">
            <Input
              id="admin-username"
              label="Usuario"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={busy}
            />
            <PasswordInput
              ref={passwordRef}
              id="admin-password"
              label="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
            />
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>
          <details>
            <summary className="min-h-11 cursor-pointer py-2 font-medium">
              No puedo acceder
            </summary>
            <p className="pt-2 text-sm text-[rgb(var(--muted)/1)]">
              Solicita al Superadministrador que restablezca tu acceso. Si el
              Superadministrador perdió el acceso, el responsable técnico debe
              seguir el procedimiento de emergencia.
            </p>
          </details>
        </Card>
      </Container>
    </main>
  );
}
