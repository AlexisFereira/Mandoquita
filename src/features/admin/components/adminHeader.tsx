import React from "react";
import { Button } from "../../../components/Button";
import { Container } from "../../../components/Container";

function LinkNav({
  label,
  onClick,
  current,
}: {
  label: string;
  onClick: () => void;
  current?: boolean;
}) {
  return (
    <a
      type="button"
      className={`text-sm inline-block rounded-sm content-center cursor-pointer p-2 ${current ? "bg-gray-200 text-amber-700 font-black" : "hover:bg-gray-100"} text-[rgb(var(--muted)/1)]`}
      onClick={onClick}
      aria-current={current ? "page" : undefined}
    >
      {label}
    </a>
  );
}

const AdminHeader: React.FC<{
  session: { account: { username: string } };
  section: "products" | "categories" | "accounts";
  superadmin: boolean;
  setSection: (section: "products" | "categories" | "accounts") => void;
  logout: () => void;
}> = ({ session, section, superadmin, setSection, logout }) => {
  const navOptions: {
    label: string;
    section: "products" | "categories" | "accounts";
  }[] = [
    { label: "Productos", section: "products" },
    { label: "Categorías", section: "categories" },
  ];

  if (superadmin) {
    navOptions.push({
      label: "Cuentas de administradores",
      section: "accounts",
    });
  }

  return (
    <header className="border-b bg-[rgb(var(--surface)/1)]">
      <Container
        size="wide"
        padding="lg"
        className="flex min-h-20 flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="font-semibold">Mandoquita · Administración</p>
          <p className="text-sm text-[rgb(var(--muted)/1)]">
            Sesión: {session.account.username}
          </p>
        </div>
        <nav aria-label="Administración" className="flex flex-wrap gap-3">
          {navOptions.map((option) => (
            <LinkNav
              key={option.section}
              label={option.label}
              onClick={() => setSection(option.section)}
              current={section === option.section}
            />
          ))}
          <LinkNav label="Salir" onClick={() => void logout()} />
        </nav>
      </Container>
    </header>
  );
};

export default AdminHeader;
