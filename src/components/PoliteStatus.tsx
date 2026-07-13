import React, { type ReactNode } from "react";

export type PoliteStatusProps = {
  children: ReactNode;
  visuallyHidden?: boolean;
  className?: string;
};

export function PoliteStatus({ children, visuallyHidden = true, className = "" }: PoliteStatusProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={[visuallyHidden ? "sr-only" : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
