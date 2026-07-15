// ─── CSS variables snippet ────────────────────────────────────────────────────
// Paste this block into your global stylesheet (e.g. globals.css):
//
// :root {
//   --color-info:    59 130 246;   /* blue-500   */
//   --color-success: 34 197 94;    /* green-500  */
//   --color-warning: 234 179  8;   /* yellow-500 */
//   --color-danger:  239 68  68;   /* red-500    */
// }
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NoticeVariant = "info" | "success" | "warning" | "error";

interface VariantConfig {
  /** Tailwind classes for border + background tint */
  containerClasses: string;
  /** ARIA role */
  role: "status" | "alert";
  /** aria-live politeness level */
  ariaLive: "polite" | "assertive";
  /** Rendered icon (inline SVG) */
  icon: React.ReactElement;
}

// ─── Variant map (single source of truth) ────────────────────────────────────

const InfoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className="h-5 w-5 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253l-.286 1.826A2.751 2.751 0 0 0 11.75 15H12a.75.75 0 0 0 0-1.5h-.25a1.25 1.25 0 0 1-1.243-1.37l.286-1.826A.75.75 0 0 0 10 9H9Z"
      clipRule="evenodd"
    />
  </svg>
);

const SuccessIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className="h-5 w-5 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className="h-5 w-5 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className="h-5 w-5 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
      clipRule="evenodd"
    />
  </svg>
);

export const VARIANTS = {
  info: {
    containerClasses: "border-info bg-info/8 text-info",
    role: "status",
    ariaLive: "polite",
    icon: InfoIcon,
  },
  success: {
    containerClasses: "border-success bg-success/8 text-success",
    role: "status",
    ariaLive: "polite",
    icon: SuccessIcon,
  },
  warning: {
    containerClasses: "border-warning bg-warning/8 text-warning",
    role: "alert",
    ariaLive: "polite",
    icon: WarningIcon,
  },
  error: {
    containerClasses: "border-danger bg-danger/8 text-danger",
    role: "alert",
    ariaLive: "assertive",
    icon: ErrorIcon,
  },
} as const satisfies Record<NoticeVariant, VariantConfig>;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NoticeProps {
  /** Controls styling, icon, and ARIA semantics. */
  variant: NoticeVariant;
  /** Primary message text rendered inside a <p>. */
  text: string;
  /** Optional secondary content rendered below the text. */
  children?: React.ReactNode;
  /** Additional Tailwind classes appended after variant classes. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Notice({
  variant,
  text,
  children,
  className = "",
}: NoticeProps): React.ReactElement {
  const config = VARIANTS[variant];
  const isFocusable = variant === "error" || variant === "warning";

  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      tabIndex={isFocusable ? -1 : undefined}
      className={[
        "flex items-start gap-3 rounded-lg px-4 py-3 shadow-sm",
        config.containerClasses,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Decorative icon — color inherits from the text class wrapper */}
      <span className={["mt-0.5"].join(" ")} aria-hidden="true">
        {config.icon}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={["text-sm font-medium leading-5"].join(" ")}>{text}</p>
        {children !== undefined && (
          <div className="mt-1 text-sm text-gray-600">{children}</div>
        )}
      </div>
    </div>
  );
}
