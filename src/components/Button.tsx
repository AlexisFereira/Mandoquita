import React from "react";
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  PropsWithChildren,
} from "react";

const buttonClassNames = {
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 hover:bg-[rgb(var(--primary)/0.08)] disabled:cursor-not-allowed disabled:opacity-60",
  outline:
    "inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-60",
  inverse:
    "inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-60",
} as const;

const buttonSizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

const variantStyles = {
  primary: {
    backgroundColor: "rgb(var(--primary) / 1)",
    color: "rgb(var(--primary-foreground) / 1)",
    borderColor: "rgb(var(--primary) / 1)",
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: "var(--shadow-md)",
  },
  danger: {
    backgroundColor: "rgb(var(--danger) / 1)",
    color: "rgb(var(--primary-foreground) / 1)",
    borderColor: "rgb(var(--danger) / 1)",
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: "var(--shadow-sm)",
  },
  secondary: {
    backgroundColor: "rgb(var(--surface) / 1)",
    color: "rgb(var(--foreground) / 1)",
    borderColor: "rgb(var(--border) / 1)",
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: "var(--shadow-sm)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "rgb(var(--foreground) / 1)",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px",
  },
  outline: {
    backgroundColor: "transparent",
    color: "rgb(var(--foreground) / 1)",
    borderColor: "rgb(var(--primary) / 1)",
    borderStyle: "solid",
    borderWidth: "1px",
  },
  inverse: {
    backgroundColor: "rgb(var(--inverse-foreground) / 1)",
    color: "rgb(var(--inverse-surface) / 1)",
    borderColor: "rgb(var(--inverse-foreground) / 1)",
    borderStyle: "solid",
    borderWidth: "1px",
  },
} as const;

export type ButtonVariant = keyof typeof buttonClassNames;
export type ButtonSize = keyof typeof buttonSizeClasses;

type CommonButtonProps = PropsWithChildren<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  style?: CSSProperties;
}>;

type NativeButtonProps = CommonButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = CommonButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    style,
    onKeyDown,
    ...rest
  } = props;
  const sharedClassName = [
    buttonClassNames[variant],
    buttonSizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const sharedStyle: CSSProperties = {
    ...variantStyles[variant],
    ...style,
  };

  if ("href" in rest && rest.href) {
    const { href, onClick, ...linkProps } = rest;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      const keyDownHandler = onKeyDown as
        | React.KeyboardEventHandler<HTMLAnchorElement>
        | undefined;

      keyDownHandler?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.currentTarget.click();
      }
    };

    return (
      <Link
        href={href}
        className={sharedClassName}
        style={sharedStyle}
        data-variant={variant}
        onKeyDown={handleKeyDown}
        {...linkProps}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={buttonProps.type ?? "button"}
      className={sharedClassName}
      style={sharedStyle}
      data-variant={variant}
      onKeyDown={
        onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined
      }
      {...buttonProps}
    >
      {children}
    </button>
  );
}
