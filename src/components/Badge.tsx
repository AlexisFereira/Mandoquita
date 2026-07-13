import React, { type ReactNode } from "react";

const badgeVariantClasses = {
  neutral: "bg-[rgb(var(--foreground)/0.06)] text-[rgb(var(--foreground)/1)]",
  primary: "bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary-hover)/1)]",
  success: "bg-[rgb(var(--success)/0.12)] text-[rgb(var(--success)/1)]",
  danger: "bg-[rgb(var(--danger)/0.12)] text-[rgb(var(--danger)/1)]",
  warning: "bg-[rgb(var(--warning)/0.12)] text-[rgb(var(--warning)/1)]",
  info: "bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent)/1)]",
} as const;

const badgeSizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2 text-sm",
} as const;

export type BadgeVariant = keyof typeof badgeVariantClasses;
export type BadgeSize = keyof typeof badgeSizeClasses;

export type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function Badge({
  variant = "neutral",
  size = "sm",
  children,
  icon,
  className = "",
}: BadgeProps) {
  const classes = [
    "inline-flex items-center gap-1 rounded-full font-medium",
    badgeVariantClasses[variant],
    badgeSizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </span>
  );
}
