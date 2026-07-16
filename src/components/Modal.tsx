"use client";

import React from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalRootProps = {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  children: React.ReactNode;
};

type ModalHeaderProps = {
  title: string;
  description?: string;
  onClose?: () => void;
};

type ModalBodyProps = {
  children: React.ReactNode;
};

type ModalFooterProps = {
  children: React.ReactNode;
  align?: "start" | "end" | "between";
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type ModalContextValue = {
  titleId: string;
  descriptionId: string | undefined;
  setHasDescription: (v: boolean) => void;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModalContext(): ModalContextValue {
  const ctx = React.useContext(ModalContext);
  if (!ctx) {
    throw new Error("Modal sub-components must be used inside <Modal>.");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(",");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );

  return candidates.filter((el) => {
    // Exclude hidden attribute
    if (el.hasAttribute("hidden")) return false;
    // Exclude aria-hidden
    if (el.getAttribute("aria-hidden") === "true") return false;
    // Exclude display:none / visibility:hidden
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// useModalBehavior hook
// ---------------------------------------------------------------------------

export function useModalBehavior({
  open,
  onClose,
  containerRef,
}: {
  open: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLElement>;
}): void {
  // ── Scroll lock ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // ── Escape key ─────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (event.defaultPrevented) return;

      const focused = document.activeElement as HTMLElement | null;
      if (!focused) {
        onClose();
        return;
      }

      // Skip if contenteditable
      if (focused.isContentEditable) return;
      // Skip if inside an iframe
      if (focused.tagName === "IFRAME") return;
      // Skip if data-modal-ignore-escape
      if (focused.closest("[data-modal-ignore-escape]")) return;

      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // ── Focus trap ─────────────────────────────────────────────────────────────
  const savedFocusRef = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (!open) return;

    // Save current focus
    savedFocusRef.current = document.activeElement;

    // Focus first focusable element (or the container itself)
    const container = containerRef.current;
    if (container) {
      const focusable = getFocusableElements(container);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus();
      }
    }

    return () => {
      // Restore focus on close
      if (
        savedFocusRef.current &&
        typeof (savedFocusRef.current as HTMLElement).focus === "function"
      ) {
        (savedFocusRef.current as HTMLElement).focus();
      }
    };
  }, [open, containerRef]);

  // Tab / Shift+Tab trap
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        // Shift+Tab: if on first, wrap to last
        if (active === first || active === container) {
          event.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last, wrap to first
        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, containerRef]);

  // Focus-out guard: bring focus back if it leaves the modal
  React.useEffect(() => {
    if (!open) return;

    const handleFocusOut = (event: FocusEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const relatedTarget = event.relatedTarget as Node | null;
      // If focus moved outside the modal
      if (relatedTarget && !container.contains(relatedTarget)) {
        const focusable = getFocusableElements(container);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          container.focus();
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener("focusout", handleFocusOut);
    return () => container?.removeEventListener("focusout", handleFocusOut);
  }, [open, containerRef]);
}

// ---------------------------------------------------------------------------
// Modal.Header
// ---------------------------------------------------------------------------

function ModalHeader({ title, description, onClose }: ModalHeaderProps) {
  const { titleId, setHasDescription, descriptionId } = useModalContext();

  // Register description presence so root can set aria-describedby
  React.useEffect(() => {
    setHasDescription(!!description);
  }, [description, setHasDescription]);

  return (
    <header className="p-6 border-b border-[rgb(var(--border)/1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2
            id={titleId}
            className="ds-heading ds-heading-md text-[rgb(var(--foreground)/1)] font-semibold text-lg leading-6"
          >
            {title}
          </h2>
          {description && (
            <p
              id={descriptionId}
              className="mt-1 text-sm text-[rgb(var(--muted-foreground,107_114_128)/1)]"
            >
              {description}
            </p>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-md p-1 text-[rgb(var(--muted-foreground,107_114_128)/1)] hover:bg-[rgb(var(--accent,243_244_246)/1)] hover:text-[rgb(var(--foreground)/1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring,99_102_241)/1)] transition-colors"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              className="size-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Modal.Body
// ---------------------------------------------------------------------------

function ModalBody({ children }: ModalBodyProps) {
  return (
    <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal.Footer
// ---------------------------------------------------------------------------

const FOOTER_ALIGN_CLASSES: Record<
  NonNullable<ModalFooterProps["align"]>,
  string
> = {
  start: "justify-start",
  end: "justify-end",
  between: "justify-between",
};

function ModalFooter({ children, align = "end" }: ModalFooterProps) {
  return (
    <footer
      className={`p-6 border-t border-[rgb(var(--border)/1)] flex flex-wrap items-center gap-3 ${FOOTER_ALIGN_CLASSES[align]}`}
    >
      {children}
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Size mapping
// ---------------------------------------------------------------------------

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

// ---------------------------------------------------------------------------
// Modal Root
// ---------------------------------------------------------------------------

function ModalRoot({ open, onClose, size = "md", children }: ModalRootProps) {
  const titleId = React.useId();
  const descriptionBaseId = React.useId();

  const [hasDescription, setHasDescription] = React.useState(false);
  const descriptionId = hasDescription ? descriptionBaseId : undefined;

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Stable onClose ref so effects don't re-run on every render
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });
  const stableOnClose = React.useCallback(() => onCloseRef.current(), []);

  useModalBehavior({
    open,
    onClose: stableOnClose,
    containerRef: containerRef as React.RefObject<HTMLElement>,
  });

  // Backdrop mousedown/click guard
  const mouseDownOnBackdropRef = React.useRef(false);

  const handleBackdropMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseDownOnBackdropRef.current = event.target === event.currentTarget;
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      mouseDownOnBackdropRef.current &&
      event.target === event.currentTarget
    ) {
      stableOnClose();
    }
    mouseDownOnBackdropRef.current = false;
  };

  // SSR guard
  if (typeof window === "undefined") return null;
  if (!open) return null;

  const contextValue: ModalContextValue = {
    titleId,
    descriptionId,
    setHasDescription,
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>
      {/* Outer container: positions backdrop + panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50"
          aria-hidden="true"
          onMouseDown={handleBackdropMouseDown}
          onClick={handleBackdropClick}
        />

        {/* Panel */}
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          className={[
            "relative z-10 w-full rounded-lg",
            "bg-[rgb(var(--surface,255_255_255)/1)]",
            "shadow-2xl",
            "ring-1 ring-[rgb(var(--border)/1)]",
            "focus:outline-none",
            SIZE_CLASSES[size],
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
