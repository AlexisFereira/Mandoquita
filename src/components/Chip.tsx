import React, { type ReactNode, useId } from "react";

const chipSizeClasses = { sm: "px-3 py-1 text-xs", md: "px-4 py-2 text-sm" } as const;
export type ChipSize = keyof typeof chipSizeClasses;

type ChipBaseProps = {
  size?: ChipSize;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export type PresentationalChipProps = ChipBaseProps & {
  mode?: "presentational";
  selected?: boolean;
  removable?: false;
  onRemove?: never;
  value?: never;
  onSelect?: never;
  unavailable?: never;
};

export type RemovableChipProps = ChipBaseProps &
  (
    | { mode: "removable"; removable?: true }
    | { mode?: undefined; removable: true }
  ) & {
    selected?: boolean;
    onRemove?: () => void;
    value?: never;
    onSelect?: never;
    unavailable?: never;
  };

export type OptionChipProps = ChipBaseProps & {
  mode: "option";
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  unavailable?: boolean;
  unavailableText?: string;
  removable?: never;
  onRemove?: never;
};

export type ChipProps = PresentationalChipProps | RemovableChipProps | OptionChipProps;

export function Chip(props: ChipProps) {
  const descriptionId = useId();
  const { size = "md", children, icon, className = "" } = props;
  const isOption = props.mode === "option";
  const isRemovable = props.mode === "removable" || props.removable === true;
  const selected = props.selected ?? false;
  const unavailable = isOption && Boolean(props.unavailable);
  const classes = [
    "inline-flex max-w-full items-center justify-center gap-2 whitespace-normal rounded-full border text-center font-medium transition duration-150 motion-reduce:transition-none",
    isRemovable || isOption ? "min-h-11" : null,
    selected
      ? isOption
        ? "border-[rgb(var(--primary)/1)] bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--foreground)/1)]"
        : "border-[rgb(var(--primary)/0.22)] bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--foreground)/1)]"
      : "border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] text-[rgb(var(--foreground)/1)]",
    unavailable ? "cursor-not-allowed border-dashed" : null,
    isRemovable ? "pr-2" : null,
    chipSizeClasses[size],
    className,
  ].filter(Boolean).join(" ");
  const content = (
    <>
      {icon ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
      <span>{children}</span>
      {selected && isOption ? <span aria-hidden="true" className="font-bold">✓</span> : null}
      {isRemovable ? <span aria-hidden="true" className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(var(--foreground)/0.08)] text-[0.7rem] leading-none">×</span> : null}
    </>
  );

  if (isOption) {
    return (
      <>
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          aria-disabled={unavailable || undefined}
          aria-describedby={unavailable ? descriptionId : undefined}
          className={classes}
          onClick={() => { if (!unavailable) props.onSelect(props.value); }}
        >
          {content}
        </button>
        {unavailable ? <span id={descriptionId} className="sr-only">{props.unavailableText ?? "Esta combinación no está disponible."}</span> : null}
      </>
    );
  }

  if (isRemovable) {
    return (
      <button type="button" className={classes} aria-pressed={selected || undefined} aria-label={`Remove ${typeof children === "string" ? children : "chip"}`} onClick={props.onRemove}>
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}
