import React from "react";
import Link from "next/link";

import { Container } from "./Container";

const footerLinks = [
  { label: "Inicio", href: "/" },
  { label: "Destacados", href: "/#destacados" },
  { label: "Categorías", href: "/categorias" },
  { label: "Contacto", href: "/#contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] py-10">
      <Container
        size="wide"
        padding="lg"
        className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-2">
          <strong className="text-lg text-[rgb(var(--foreground)/1)]">
            Mandoquita
          </strong>
          <p className="max-w-md text-sm leading-6 text-[rgb(var(--muted)/1)]">
            Productos elegidos para acompañar tu día a día.
          </p>
          <p className="text-sm text-[rgb(var(--muted)/1)]">
            © 2026 Mandoquita
          </p>
        </div>

        <nav aria-label="Navegación del pie de página" className="flex flex-wrap gap-x-5 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[rgb(var(--foreground)/1)] underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
