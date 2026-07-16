import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZE_CLASS: Record<SpinnerSize, string> = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-12",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Spinner({
  size = "md",
  label,
  className = "",
}: SpinnerProps): React.JSX.Element {
  const sizeClass = [SIZE_CLASS[size], className].filter(Boolean).join(" ");

  const svg = (
    <svg
      className={sizeClass}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={label ? undefined : true}
      role={label ? "status" : undefined}
      aria-live={label ? "polite" : undefined}
    >
      {/* Full ring at low opacity — acts as the track */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="3"
      />
      {/* Active arc that spins */}
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="origin-center animate-spin motion-reduce:animate-none"
      />
    </svg>
  );

  if (!label) return svg;

  return (
    <span className="inline-flex items-center">
      {svg}
      <span className="sr-only">{label}</span>
    </span>
  );
}

// ─── Usage examples ───────────────────────────────────────────────────────────
//
// Decorative inside a button (no announcement):
//   <Button disabled>
//     <Spinner size="sm" />
//     Guardando…
//   </Button>
//
// Accessible — screen reader announces the label:
//   <div className="flex items-center gap-2">
//     <Spinner size="md" label="Cargando productos" />
//     <span className="text-muted">Cargando productos…</span>
//   </div>
//
// Inherits color from parent:
//   <div className="text-danger">
//     <Spinner size="lg" label="Error al guardar" />
//   </div>
