# Design System Decisions

## Application metadata and decorative color ownership

Browser `theme-color` metadata is owned by `metadata.ts` through
`APPLICATION_THEME_COLOR`; pages must not declare independent literals.
Selection and page-background decoration are global-only treatments owned by
`globals.css` and `theme.css`, and compose the authoritative semantic primary
role with opacity rather than introducing component palettes.

## DSD-001 — Four-pixel spacing grid

Status: Active.

Spacing uses a four-pixel base because it produces predictable component rhythm across compact and spacious layouts. The scale is intentionally limited to reduce arbitrary decisions.

Trade-off: exceptional calculated layouts may require values outside the named scale, but static component spacing may not.

## DSD-002 — Semantic color naming

Status: Active.

Components express intent through roles such as background, surface, foreground, muted, border, primary, danger, and focus. This allows themes to change without redefining component APIs.

Trade-off: primitive palette colors remain necessary to construct semantic themes, but feature components cannot consume them as stable contracts.

## DSD-003 — CSS variables for the semantic palette

Status: Active.

CSS variables keep semantic styling independent from component APIs. The root light palette is the only supported runtime palette. Historical dark values are deprecated migration residue and must be removed rather than consumed.

Trade-off: duplicate variable families create ambiguity, so the legacy hex aliases are deprecated and require staged migration.

## DSD-004 — Typed token export

Status: Active.

`DESIGN_TOKENS` provides compile-time structure and autocomplete for tooling, calculated values, and theme generation. CSS variables remain the preferred component styling interface.

Trade-off: TypeScript primitives and browser variables must be kept synchronized until token generation is automated.

## DSD-005 — Simple composable components

Status: Active.

Shared components have one responsibility, predictable variants, typed props, and `className` extension. Composition is preferred over adding feature-specific flags.

Trade-off: consumers sometimes need a small wrapper, but the shared API remains stable and easier to understand.

## DSD-006 — Fixed light application theme

Status: Active.

The application always renders light. Theme selection, stored preference, operating-system listeners, toggles, and alternative runtime palettes are not supported.

Trade-off: removing the compatibility context may require consumer migration. Reintroducing another theme requires a new approved platform change and QA cycle.

## DSD-007 — Restrained visual language

Status: Active.

Hierarchy, whitespace, typography, and product imagery take priority over borders, gradients, shadows, pills, and motion. Elevation communicates real layering rather than decoration.

## DSD-008 — Accessibility is a component contract

Status: Active.

Keyboard behavior, visible focus, semantic output, contrast, touch targets, and reduced motion are mandatory states. Aesthetic preference cannot override them.

## DSD-009 — Primary action contrast correction

Status: Active for migration.

White on primary 500 (`#C46A4A`) fails normal-text WCAG AA at 3.81:1. Primary 600 (`#A8583D`) with white passes at 5.09:1 and is the preferred action pair until the consolidated semantic action token is implemented.
