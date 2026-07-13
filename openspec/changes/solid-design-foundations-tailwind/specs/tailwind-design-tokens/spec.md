# Specification: Tailwind Design Tokens

## ADDED Requirements

### Requirement: Export centralized design tokens

The system SHALL export a `DESIGN_TOKENS` constant from `src/design-system/tokens.ts` containing all semantic design tokens with full TypeScript definitions. The tokens SHALL include colors (semantic: primary, secondary, success, danger, warning, info, neutral), spacing (xs, sm, md, lg, xl, 2xl), typography (heading, body, caption), shadows (sm, md, lg), and border radius values. All tokens SHALL be accessible in components via named imports.

#### Scenario: Access color token in component

- **WHEN** a component imports `{ DESIGN_TOKENS }` from `src/design-system/tokens.ts`
- **THEN** the component can access `DESIGN_TOKENS.colors.primary` and TypeScript autocomplete works
- **AND** the token resolves to a semantic CSS variable reference like `var(--color-primary)`

#### Scenario: Token types are inferred

- **WHEN** a developer accesses any token (e.g., `DESIGN_TOKENS.spacing.md`)
- **THEN** TypeScript infers the correct type (string for colors/sizes, number for z-index)
- **AND** IDE provides autocomplete for all available tokens

### Requirement: CSS Variables defined in theme layer

The system SHALL define CSS custom properties for all design tokens in the browser's `:root` pseudo-element and media query for `@media (prefers-color-scheme: dark)`. Each token SHALL map directly to a Tailwind-compatible value. The CSS variables SHALL be injected on page load and available before any component rendering.

#### Scenario: CSS variables are applied on load

- **WHEN** the page loads
- **THEN** all `--color-*`, `--spacing-*`, `--typography-*` CSS variables are defined in `:root`
- **AND** components can access them via `var(--color-primary)` in inline styles or Tailwind classes

#### Scenario: Dark mode variables override light mode

- **WHEN** system prefers dark color scheme or user toggles dark mode
- **THEN** `:root` variables update to dark mode values (e.g., `--color-primary` → lighter hex)
- **AND** all components automatically reflect the new colors

### Requirement: Spacing scale follows 4px grid

The system SHALL define spacing tokens based on a 4px base unit: xs (0.25rem/4px), sm (0.5rem/8px), md (1rem/16px), lg (1.5rem/24px), xl (2rem/32px), 2xl (3rem/48px). All page layouts, component padding, and gap utilities SHALL reference these tokens for consistency.

#### Scenario: Spacing token scales consistently

- **WHEN** a developer uses `DESIGN_TOKENS.spacing.md` (1rem)
- **THEN** it equals 16px on the browser
- **AND** the next scale `lg` equals 24px (1.5x increment)

### Requirement: Typography scale is defined

The system SHALL define typography tokens for heading (size 2rem, weight 700), body (size 1rem, weight 400), and caption (size 0.875rem, weight 500). Each typography token SHALL include font-size, font-weight, and line-height for consistent text rendering.

#### Scenario: Typography token applied to component

- **WHEN** a component applies typography token `DESIGN_TOKENS.typography.heading`
- **THEN** text renders at 2rem, weight 700, with appropriate line-height
- **AND** visual hierarchy is maintained across all pages

### Requirement: Tokens support light and dark modes

The system SHALL provide separate token values for light and dark color schemes. The `DESIGN_TOKENS` object SHALL export color tokens that resolve to CSS variables which are theme-aware. When dark mode is active (via `@media (prefers-color-scheme: dark)` or explicit toggle), colors SHALL invert appropriately.

#### Scenario: Token references correct color for theme

- **WHEN** a component renders in light mode using `DESIGN_TOKENS.colors.secondary`
- **THEN** it shows the light theme color (e.g., `#f3f4f6`)
- **AND** when dark mode activates, the same token reference shows dark theme color (e.g., `#1f2937`)
