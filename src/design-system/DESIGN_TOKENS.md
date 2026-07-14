# Design Tokens Reference

Source of truth: `src/design-system/tokens.ts`.

Public catalog composition and component usage are governed by
`openspec/platform/design-system/public-catalog-visual-contract.md`.

The approved runtime contains one light semantic palette. Component styling must use semantic CSS variables. Do not copy hexadecimal values into components or introduce alternative theme palettes.

## Semantic surfaces

| Role | Value | CSS variable | Use |
| --- | --- | --- | --- |
| Background | `#FAFAFA` | `--background` | Page canvas and media fallback |
| Surface | `#FFFFFF` | `--surface` | Cards and content surfaces |
| Foreground | `#181818` | `--foreground` | Primary text and icons |
| Muted | `#6B7280` | `--muted` | Supporting text |
| Border | `#EAEAEA` | `--border` | Dividers and boundaries |
| Primary action | `#A8583D` | `--primary` | Accessible brand action |
| Primary hover | `#874632` | `--primary-hover` | Primary action hover |
| Focus | `#0F766E` | `--focus` | Universal focus cue |
| Inverse surface | `#18120F` | `--inverse-surface` | Bounded contact and media overlays; never the public Header |
| Inverse foreground | `#FFFFFF` | `--inverse-foreground` | Content on inverse surfaces |

White text on primary action `#A8583D` has a contrast ratio of 5.09:1 and is the approved normal-text action pair.

## Primitive color scales

The typed primitive reference exports steps `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, and `950` for:

- `primary`
- `secondary`
- `success`
- `danger`
- `warning`
- `info`
- `neutral`

Primitive steps support token construction and documentation. Feature components consume semantic roles, not palette steps.

### Primary scale

| Step | Value |
| --- | --- |
| 50 | `#FDF7F4` |
| 100 | `#F6ECE7` |
| 200 | `#EDD6CB` |
| 300 | `#DEB29D` |
| 400 | `#D08A6B` |
| 500 | `#C46A4A` |
| 600 | `#A8583D` |
| 700 | `#874632` |
| 800 | `#653426` |
| 900 | `#47241B` |
| 950 | `#331812` |

The supported primitive values are inspectable through `DESIGN_TOKENS.colors.light` with TypeScript autocomplete. Any historical dark reference is deprecated and must not be consumed by application code.

## Spacing

The scale follows a 4 CSS-pixel grid.

| Token | Pixels | Typical use |
| --- | ---: | --- |
| `spacing.xs` | 4 | Tight icon or indicator gap |
| `spacing.sm` | 8 | Compact internal gap |
| `spacing.md` | 16 | Standard component padding |
| `spacing.lg` | 24 | Card padding and grid gap |
| `spacing.xl` | 32 | Layout grouping |
| `spacing.2xl` | 48 | Section rhythm |

```ts
import { DESIGN_TOKENS } from "./tokens";

const standardGap = DESIGN_TOKENS.spacing.md;
```

## Typography

### Heading

Family: `Manrope, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

| Size | Font size | Line height | Weight |
| --- | --- | --- | ---: |
| `sm` | `1.125rem` | `1.3` | 600 |
| `md` | `1.5rem` | `1.25` | 700 |
| `lg` | `2rem` | `1.15` | 700 |
| `xl` | `2.5rem` | `1.1` | 800 |

### Body

Family: `Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

| Size | Font size | Line height | Weight |
| --- | --- | --- | ---: |
| `sm` | `0.875rem` | `1.5` | 400 |
| `md` | `1rem` | `1.55` | 400 |
| `lg` | `1.125rem` | `1.6` | 400 |

Caption uses the body family at `0.75rem`, line height `1.4`, weight 500.

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `radii.sm` | `10px` | Compact controls |
| `radii.md` | `16px` | Standard cards; ProductCard uses its governed 8px component radius |
| `radii.lg` | `24px` | Hero media and large surfaces |
| `radii.xl` | `32px` | Exceptional high-emphasis surfaces |

Full radius is reserved for circular controls and intentional pills.

## Shadows

| Token | Value | Use |
| --- | --- | --- |
| `shadows.sm` | `0 1px 2px rgba(31, 26, 23, 0.08)` | Subtle interactive separation |
| `shadows.md` | `0 8px 24px rgba(31, 26, 23, 0.1)` | Elevated navigation or overlay |
| `shadows.lg` | `0 18px 48px rgba(31, 26, 23, 0.14)` | Modal/floating overlay only |

## Layout

| Role | sm | md | lg | xl | wide |
| --- | ---: | ---: | ---: | ---: | ---: |
| Containers | 640 | 768 | 1120 | 1280 | 1400 |
| Breakpoints | 640 | 768 | 1024 | 1280 | — |

Values are CSS pixels. `wide` is exposed as
`DESIGN_TOKENS.layout.containers.wide` and `--container-wide`; it is not a
viewport breakpoint. It is the canonical boundary for public catalog page
content while remaining an explicit component size for unrelated consumers.
