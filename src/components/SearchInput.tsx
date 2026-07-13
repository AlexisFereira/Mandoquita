import React, { useMemo, useState, type FormEvent } from "react";

import { Input, type InputProps } from "./Input";

export type SearchInputProps = Omit<
  InputProps,
  "type" | "label" | "leftIcon" | "rightIcon"
> & {
  label?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  autoFocus?: boolean;
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M8.5 14a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12.5 12.5 16 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchInput({
  value,
  defaultValue,
  onChange,
  onKeyDown,
  onSearch,
  onClear,
  loading = false,
  size = "md",
  label = "Search products",
  placeholder = "Search products",
  autoFocus = false,
  disabled = false,
  className = "",
  ...props
}: SearchInputProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const currentValue = isControlled ? value : internalValue;
  const showClearButton = Boolean(currentValue) && !disabled;

  const rightIcon = useMemo(() => {
    if (loading) {
      return <Spinner />;
    }

    if (!showClearButton) {
      return null;
    }

    return (
      <button
        type="button"
        aria-label="Clear search"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[rgb(var(--muted)/1)] transition hover:text-[rgb(var(--foreground)/1)]"
        onClick={() => {
          if (!isControlled) {
            setInternalValue("");
          }
          onClear?.();
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="none"
        >
          <path
            d="M5 5l10 10M15 5 5 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    );
  }, [isControlled, loading, onClear, showClearButton]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }

    onChange?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.(String(currentValue ?? ""));
    }

    if (event.key === "Escape" && showClearButton) {
      event.preventDefault();

      if (!isControlled) {
        setInternalValue("");
      }

      onClear?.();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(String(currentValue ?? ""));
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <Input
        {...props}
        type="search"
        label={label}
        placeholder={placeholder}
        size={size}
        autoFocus={autoFocus}
        disabled={disabled}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        leftIcon={<SearchIcon />}
        rightIcon={rightIcon}
      />
    </form>
  );
}
