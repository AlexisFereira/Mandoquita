import React from "react";

import { Container } from "../../components/Container";
import { PoliteStatus } from "../../components/PoliteStatus";
import { Notice } from "./components/Notice";
import AdminHeader from "./components/adminHeader";

import { AccessGate } from "./auth/AccessGate";
import { PasswordChange } from "./auth/PasswordChange";
import { ProductWorkspace } from "./products/ProductWorkspace";
import { CategoryWorkspace } from "./categories/CategoryWorkspace";
import { Accounts } from "./accounts/Accounts";
import { useAdminSession } from "./hooks/useAdminSession";
import { TaxonomyWorkspace } from "./taxonomy/TaxonomyWorkspace";

type AdminSection = "products" | "categories" | "accounts" | "taxonomy";

export function AdminApp() {
  const { session, checking, notice, accessGranted, expired, logout } =
    useAdminSession();
  const [section, setSection] = React.useState<AdminSection>("products");

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <PoliteStatus visuallyHidden={false}>Verificando acceso…</PoliteStatus>
      </main>
    );
  }

  if (!session) {
    return <AccessGate notice={notice} onAccess={accessGranted} />;
  }

  if (session.account.mustChangePassword) {
    return (
      <PasswordChange
        session={session}
        onChanged={accessGranted}
        onLogout={() => void logout()}
      />
    );
  }

  const superadmin = session.account.role === "SUPER_ADMIN";

  return (
    <>
      <a href="#admin-main" className="skip-link">
        Ir al contenido principal
      </a>
      <AdminHeader
        session={session}
        section={section}
        superadmin={superadmin}
        setSection={setSection}
        logout={() => void logout()}
      />
      <main id="admin-main" className="py-6">
        <Container size="wide" padding="lg">
          {section === "products" ? (
            <ProductWorkspace session={session} onExpired={expired} />
          ) : section === "categories" ? (
            <CategoryWorkspace session={session} onExpired={expired} />
          ) : section === "taxonomy" ? (
            <TaxonomyWorkspace />
          ) : superadmin ? (
            <Accounts session={session} onExpired={expired} />
          ) : (
            <Notice text="No tienes acceso a esta sección" variant="error" />
          )}
        </Container>
      </main>
    </>
  );
}
