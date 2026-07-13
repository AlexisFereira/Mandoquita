import React, { useState } from "react";
import Link from "next/link";

import { Container } from "./Container";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Destacados", href: "/#destacados" },
  { label: "Categorías", href: "/categorias" },
  { label: "Contacto", href: "/#contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="site-header sticky z-[1000] w-full border-b border-[rgb(var(--inverse-border)/1)] bg-[rgb(var(--inverse-surface)/1)] text-[rgb(var(--inverse-foreground)/1)] shadow-sm">
      <Container
        size="xl"
        padding="lg"
        className="flex min-h-[72px] items-center justify-between gap-6"
      >
        <Link
          href="/"
          aria-label="Mandoquita, ir al inicio"
          className="inline-flex min-h-11 items-center rounded-md"
        >
          {logoFailed ? (
            <strong className="text-xl tracking-[-0.02em]">Mandoquita</strong>
          ) : (
            <img
              src="/images/logo.png"
              alt="Mandoquita"
              width="1024"
              height="672"
              onError={() => setLogoFailed(true)}
              className="h-[50px] w-auto object-contain"
            />
          )}
        </Link>

        <nav aria-label="Navegación principal" className="desktop-nav items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center border-b-2 border-transparent px-1 text-sm font-semibold text-[rgb(var(--inverse-muted)/1)] transition-colors hover:border-[rgb(var(--inverse-foreground)/1)] hover:text-[rgb(var(--inverse-foreground)/1)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="mobile-toggle min-h-11 min-w-11 rounded-md border border-[rgb(var(--inverse-border)/1)] bg-transparent px-3 text-sm font-semibold text-[rgb(var(--inverse-foreground)/1)]"
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </Container>

      {open ? (
        <nav
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="border-t border-[rgb(var(--inverse-border)/1)] bg-[rgb(var(--inverse-surface)/1)]"
        >
          <Container size="xl" padding="lg" className="grid gap-1 py-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 font-semibold text-[rgb(var(--inverse-muted)/1)] hover:bg-[rgb(var(--inverse-foreground)/0.1)] hover:text-[rgb(var(--inverse-foreground)/1)]"
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
