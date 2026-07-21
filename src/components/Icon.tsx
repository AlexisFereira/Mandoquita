import React from "react";
import {
  ImageUp,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  ExternalLink,
  ImageOff,
  Info,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Tag,
  TriangleAlert,
  SquarePen,
  X,
  Trash,
  ArrowLeftRight,
  LogOut,
  type LucideIcon,
  Plus,
} from "lucide-react";

const iconRegistry = {
  arrowDown: ArrowDown,
  arrowUp: ArrowUp,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowLeftRight: ArrowLeftRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  circleCheck: CircleCheck,
  circleX: CircleX,
  externalLink: ExternalLink,
  imageOff: ImageOff,
  info: Info,
  layoutGrid: LayoutGrid,
  mapPin: MapPin,
  messageCircle: MessageCircle,
  search: Search,
  tag: Tag,
  triangleAlert: TriangleAlert,
  squarePen: SquarePen,
  x: X,
  trash: Trash,
  logOut: LogOut,
  edit: SquarePen,
  imageUp: ImageUp,
  menu: Menu,
  close: X,
  back: ArrowLeft,
  forward: ArrowRight,
  previous: ChevronLeft,
  next: ChevronRight,
  "external-link": ExternalLink,
  contact: MessageCircle,
  information: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
  "image-unavailable": ImageOff,
  "payment-information": Info,

  location: MapPin,
  categories: LayoutGrid,
  logout: LogOut,
  plus: Plus,

  switch: ArrowLeftRight,
} as const satisfies Record<string, LucideIcon>;

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export type IconName = keyof typeof iconRegistry;
export type IconSize = keyof typeof iconSizes;

type IconBaseProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
};

export type DecorativeIconProps = IconBaseProps & {
  decorative?: true;
  label?: never;
};

export type InformativeIconProps = IconBaseProps & {
  decorative: false;
  label: string;
};

export type IconProps = DecorativeIconProps | InformativeIconProps;

/**
 * Renders an approved semantic icon without exposing the underlying glyph source.
 * Required meaning should remain in visible text or the consuming control label.
 */
export function Icon({
  name,
  size = "md",
  className = "",
  ...semantics
}: IconProps) {
  const Glyph = iconRegistry[name];
  const decorative = semantics.decorative !== false;
  const label = decorative ? undefined : semantics.label.trim();

  if (!decorative && !label) {
    throw new Error("An informative Icon requires a non-empty label.");
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center align-[-0.125em] leading-none ${className}`.trim()}
      data-icon={name}
    >
      <Glyph
        size={iconSizes[size]}
        strokeWidth={2}
        fill="none"
        focusable="false"
        aria-hidden={decorative ? "true" : undefined}
        role={decorative ? undefined : "img"}
        aria-label={label}
      />
    </span>
  );
}
