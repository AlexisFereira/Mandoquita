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

type possibleSections = "products" | "categories" | "accounts" | "taxonomy";

const AdminHeader: React.FC<{
  session: { account: { username: string } };
  section: possibleSections;
  superadmin: boolean;
  setSection: (section: possibleSections) => void;
  logout: () => void;
}> = ({ session, section, superadmin, setSection, logout }) => {
  const navOptions: {
    label: string;
    section: possibleSections;
  }[] = [
    { label: "Productos", section: "products" },
    { label: "Categorías", section: "categories" },
    { label: "Taxonomía", section: "taxonomy" },
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
