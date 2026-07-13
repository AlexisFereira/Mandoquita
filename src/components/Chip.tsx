import React, { type ReactNode } from "react";

const chipSizeClasses = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
} as const;

export type ChipSize = keyof typeof chipSizeClasses;

export type ChipProps = {
  selected?: boolean;
  removable?: boolean;
  size?: ChipSize;
  onRemove?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function Chip({
  selected = false,
  removable = false,
  size = "md",
  onRemove,
  children,
  icon,
  className = "",
}: ChipProps) {
  const classes = [
    "inline-flex items-center gap-2 rounded-full border font-medium transition duration-150",
    removable ? "min-h-11" : null,
    selected
      ? "border-[rgb(var(--primary)/0.22)] bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--foreground)/1)]"
      : "border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] text-[rgb(var(--foreground)/1)]",
    removable ? "pr-2" : null,
    chipSizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {removable ? (
        <span
          aria-hidden="true"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(var(--foreground)/0.08)] text-[0.7rem] leading-none"
        >
          ×
        </span>
      ) : null}
    </>
  );

  if (removable) {
    return (
      <button
        type="button"
        className={classes}
        aria-pressed={selected || undefined}
        aria-label={`Remove ${typeof children === "string" ? children : "chip"}`}
        onClick={onRemove}
      >
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}
