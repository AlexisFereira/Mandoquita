import React, { useEffect, useState } from "react";

import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Notice } from "../components/Notice";
import { table, tableRegion } from "../utils/table-styles";
import { adminErrorMessage } from "../utils/error-messages";
import { PasswordInput } from "../components/PasswordInput";

import { AdminApiError, adminApi } from "../api";
import type { AdminAccount, AdminSession } from "../types";

export function Accounts({
  session,
  onExpired,
}: {
  session: AdminSession;
  onExpired: () => void;
}) {
  const [items, setItems] = useState<AdminAccount[]>([]);
  const [task, setTask] = useState<{
    action: "create" | "reset" | "deactivate" | "reactivate";
    item?: AdminAccount;
  }>();
  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporary] = useState("");
  const [confirm, setConfirm] = useState("");
  const [currentPassword, setCurrent] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    try {
      setItems((await adminApi.accounts()).items);
    } catch (cause) {
      if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
        onExpired();
      else
        setStatus(
          adminErrorMessage(
            cause,
            "No pudimos cargar las cuentas de administradores.",
          ),
        );
    }
  }

  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      task?.action !== "deactivate" &&
      (temporaryPassword.length < 12 || temporaryPassword !== confirm)
    ) {
      setStatus(
        "La contraseña temporal debe tener entre 12 y 128 caracteres y coincidir.",
      );
      return;
    }
    try {
      if (task?.action === "create")
        await adminApi.createAccount(session.csrfToken, {
          username,
          temporaryPassword,
          currentPassword,
        });
      else if (task?.item)
        await adminApi.updateAccount(task.item.id, session.csrfToken, {
          action: task.action,
          expectedUpdatedAt: task.item.updatedAt,
          currentPassword,
          ...(task.action !== "deactivate" ? { temporaryPassword } : {}),
        });
      setStatus("Acción de cuenta confirmada.");
      setTask(undefined);
      setTemporary("");
      setConfirm("");
      setCurrent("");
      await load();
    } catch (cause) {
      setTemporary("");
      setConfirm("");
      setCurrent("");
      setStatus(
        adminErrorMessage(cause, "La acción de cuenta no se completó."),
      );
    }
  }

  if (task)
    return (
      <div className="mx-auto max-w-[720px] space-y-6">
        <Button variant="ghost" onClick={() => setTask(undefined)}>
          ← Volver a cuentas
        </Button>
        <h1 className="ds-heading ds-heading-lg">
          {
            {
              create: "Crear administrador",
              reset: `Restablecer contraseña de ${task.item?.username}`,
              deactivate: `Desactivar acceso de ${task.item?.username}`,
              reactivate: `Reactivar ${task.item?.username}`,
            }[task.action]
          }
        </h1>
        {status ? <Notice text={status} variant="error" /> : null}
        <form onSubmit={submit} className="space-y-5">
          <Card className="space-y-5">
            {task.action === "create" ? (
              <Input
                id="account-username"
                label="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : null}
            {task.action !== "deactivate" ? (
              <>
                <PasswordInput
                  id="temporary-password"
                  label="Contraseña temporal"
                  autoComplete="new-password"
                  value={temporaryPassword}
                  onChange={(e) => setTemporary(e.target.value)}
                />
                <PasswordInput
                  id="confirm-temporary"
                  label="Confirmar contraseña temporal"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </>
            ) : (
              <p>
                Las sesiones activas terminarán. La cuenta y su atribución
                histórica se conservarán.
              </p>
            )}
            <PasswordInput
              id="fresh-password"
              label="Confirma tu contraseña"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </Card>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTask(undefined)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={task.action === "deactivate" ? "danger" : "primary"}
            >
              Confirmar y continuar
            </Button>
          </div>
        </form>
      </div>
    );

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="ds-heading ds-heading-lg">
            Cuentas de administradores
          </h1>
          <p>Los roles son fijos y no se pueden cambiar.</p>
        </div>
        <Button onClick={() => setTask({ action: "create" })}>
          Crear administrador
        </Button>
      </div>
      {status ? <Notice text={status} variant="error" /> : null}
      <p id="accounts-help">
        Desplázate horizontalmente dentro de la tabla para consultar todas las
        columnas.
      </p>
      <div
        className={tableRegion}
        tabIndex={0}
        aria-label="Tabla de cuentas de administradores"
        aria-describedby="accounts-help"
      >
        <table className={table}>
          <caption className="sr-only">Cuentas administrativas</caption>
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Rol</th>
              <th scope="col">Acceso</th>
              <th scope="col">Credencial</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <th scope="row" className="p-4">
                  {a.username}
                </th>
                <td>
                  {a.role === "SUPER_ADMIN"
                    ? "Superadministrador"
                    : "Administrador"}
                </td>
                <td>{a.enabled ? "Activo" : "Desactivado"}</td>
                <td>
                  {a.mustChangePassword
                    ? "Debe reemplazar contraseña"
                    : "Lista para usar"}
                </td>
                <td>
                  {a.role === "SUPER_ADMIN" ? (
                    <span>Cuenta protegida</span>
                  ) : (
                    <div className="flex flex-col items-start gap-2">
                      {a.enabled ? (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setTask({ action: "reset", item: a })
                            }
                          >
                            Restablecer contraseña de {a.username}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              setTask({ action: "deactivate", item: a })
                            }
                          >
                            Desactivar acceso de {a.username}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() =>
                            setTask({ action: "reactivate", item: a })
                          }
                        >
                          Reactivar {a.username}
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
