import React, {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from "react";

const inputSizeClasses = {
  sm: "h-10 text-sm",
  md: "h-12 text-sm",
  lg: "h-14 text-base",
} as const;

type InputSize = keyof typeof inputSizeClasses;

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "children"
> & {
  label: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: InputSize;
  invalid?: boolean;
  success?: boolean;
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    helperText,
    errorText,
    successText,
    leftIcon,
    rightIcon,
    size = "md",
    invalid = false,
    success = false,
    className = "",
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const successId = successText ? `${inputId}-success` : undefined;
  const ariaDescribedBy =
    [describedBy, helperId, errorId, successId].filter(Boolean).join(" ") ||
    undefined;
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);

  const borderColor = invalid
    ? "border-[rgb(var(--danger)/1)]"
    : success
      ? "border-[rgb(var(--success)/1)]"
      : "border-[rgb(var(--border)/1)]";

  const inputClasses = [
    "peer w-full rounded-md border bg-[rgb(var(--surface)/1)] px-4 text-[rgb(var(--foreground)/1)] transition duration-150 placeholder:text-[rgb(var(--muted)/1)] disabled:cursor-not-allowed disabled:opacity-60",
    inputSizeClasses[size],
    borderColor,
    hasLeftIcon ? "pl-10" : null,
    hasRightIcon ? "pr-16" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const message = invalid ? errorText : success ? successText : helperText;
  const messageTone = invalid
    ? "text-[rgb(var(--danger)/1)]"
    : success
      ? "text-[rgb(var(--success)/1)]"
      : "text-[rgb(var(--muted)/1)]";

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[rgb(var(--foreground)/1)]"
      >
        {label}
      </label>

      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted)/1)]">
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid || undefined}
          className={inputClasses}
          {...props}
        />

        {rightIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted)/1)]">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {message ? (
        <p
          id={invalid ? errorId : success ? successId : helperId}
          className={`text-xs leading-5 ${messageTone}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
});
