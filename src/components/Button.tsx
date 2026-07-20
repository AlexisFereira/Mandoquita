import React from "react";
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  PropsWithChildren,
} from "react";

const btnClassNameBase =
  "inline-flex items-center justify-center rounded-full text-sm font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed min-h-10";

const buttonClassNames = {
  primary: `${btnClassNameBase}`,
  danger: `${btnClassNameBase} `,
  secondary: `${btnClassNameBase} `,
  ghost: `${btnClassNameBase} transition-colors duration-200 hover:bg-[rgb(var(--primary)/0.08)]`,
  outline: `${btnClassNameBase} `,
  inverse: `${btnClassNameBase} `,
} as const;

const buttonSizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

const sharedProps = {
  borderStyle: "solid",
  borderWidth: "1px",
  boxShadow: "var(--shadow-md)",
};

const variantStyles = {
  primary: {
    backgroundColor: "rgb(var(--primary) / 1)",
    color: "rgb(var(--primary-foreground) / 1)",
    borderColor: "rgb(var(--primary) / 1)",
    ...sharedProps,
  },
  danger: {
    backgroundColor: "rgb(var(--danger) / 1)",
    color: "rgb(var(--primary-foreground) / 1)",
    borderColor: "rgb(var(--danger) / 1)",
    ...sharedProps,
  },
  secondary: {
    backgroundColor: "rgb(var(--surface) / 1)",
    color: "rgb(var(--foreground) / 1)",
    borderColor: "rgb(var(--border) / 1)",
    ...sharedProps,
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
    size = "sm",
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
