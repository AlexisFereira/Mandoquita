import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Container } from "./Container";
import { Icon } from "./Icon";
import { Button } from "./Button";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Destacados", href: "/#destacados" },
  { label: "Categorías", href: "/categorias" },
  { label: "Buscar", href: "/buscar?focus=1", icon: "search" as const },
  { label: "Contacto", href: "/#contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [hiddenOnMobileScroll, setHiddenOnMobileScroll] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mobileViewport = window.matchMedia("(max-width: 768px)");
    let previousScrollY = window.scrollY;

    function revealHeader() {
      setHiddenOnMobileScroll(false);
      previousScrollY = window.scrollY;
    }

    function handleViewportChange() {
      if (!mobileViewport.matches) revealHeader();
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;

      if (!mobileViewport.matches || open || currentScrollY <= 8) {
        setHiddenOnMobileScroll(false);
      } else if (delta > 6 && currentScrollY > 72) {
        setHiddenOnMobileScroll(true);
      } else if (delta < -6) {
        setHiddenOnMobileScroll(false);
      }

      previousScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    mobileViewport.addEventListener?.("change", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mobileViewport.removeEventListener?.("change", handleViewportChange);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      onFocusCapture={() => setHiddenOnMobileScroll(false)}
      data-mobile-scroll-state={hiddenOnMobileScroll ? "hidden" : "visible"}
      className={`site-header sticky z-[1000] w-full border-b border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] text-[rgb(var(--foreground)/1)] shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${hiddenOnMobileScroll ? "-translate-y-full" : "translate-y-0"}`}
    >
      <Container
        size="wide"
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
              width="685"
              height="264"
              onError={() => setLogoFailed(true)}
              className="h-[50px] w-auto object-contain"
            />
          )}
        </Link>

        <nav
          aria-label="Navegación principal"
          className="desktop-nav items-center gap-8"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11  text-primary items-center border-b-2 border-transparent px-1 text-sm font-semibold text-[rgb(var(--muted)/1)] transition-colors hover:border-[rgb(var(--primary)/1)] hover:text-[rgb(var(--foreground)/1)]"
            >
              {item.icon ? <Icon name={item.icon} className="mr-2" /> : null}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => {
              setHiddenOnMobileScroll(false);
              setOpen((value) => !value);
            }}
            className="mobile-toggle inline-flex text-primary h-11 w-11 items-center justify-center rounded-md bg-transparent text-[rgb(var(--foreground)/1)]"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
          <Link
            href="https://www.instagram.com/mandoquitawb/"
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2 justify-self-start"
          >
            <img
              src="/instagram.png"
              alt="Instagram"
              width="24"
              height="24"
              className="h-6 w-6 object-contain"
            />
          </Link>
        </div>
      </Container>

      {open ? (
        <nav
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="border-t border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)]"
        >
          <Container size="wide" padding="lg" className="grid gap-1 py-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 font-semibold text-[rgb(var(--muted)/1)] hover:bg-[rgb(var(--surface-muted)/1)] hover:text-[rgb(var(--foreground)/1)]"
              >
                {item.icon ? <Icon name={item.icon} className="mr-2" /> : null}
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
