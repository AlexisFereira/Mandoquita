import React from "react";
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  PropsWithChildren,
} from "react";

const btnClassNameBase =
  "rounded-full transition-all duration-200 flex flex-none items-center justify-center";

const buttonSizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-md",
  lg: "px-8 py-3 text-base",
} as const;

const variantStyles = {
  primary:
    "bg-[rgb(var(--primary)/1)] text-white hover:bg-primary-800 hover:text-secondary-500",
  danger: "bg-[rgb(var(--danger)/.7)] hover:bg-[rgb(var(--danger-hover)/0.9)]",
  secondary:
    "bg-secondary-100 text-primary-700 hover:bg-secondary-300 hover:text-primary-700",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  outline:
    "bg-transparent border border-primary-700 text-gray-700 hover:bg-gray-100",
  inverse: "bg-white text-gray-700 hover:bg-gray-100",
} as const;

const buttonClassNames = {
  primary: `${btnClassNameBase} ${variantStyles.primary}`,
  danger: `${btnClassNameBase} ${variantStyles.danger}`,
  secondary: `${btnClassNameBase} ${variantStyles.secondary}`,
  ghost: `${btnClassNameBase} ${variantStyles.ghost}`,
  outline: `${btnClassNameBase} ${variantStyles.outline}`,
  inverse: `${btnClassNameBase} ${variantStyles.inverse}`,
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

  const myClass = `${className} disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400`;

  const sharedClassName = [
    buttonClassNames[variant],
    buttonSizeClasses[size],
    myClass,
  ]
    .filter(Boolean)
    .join(" ");
  const sharedStyle: CSSProperties = {
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
        onClick={onClick}
        {...linkProps}
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
