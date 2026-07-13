# Specification: Tailwind Design Tokens

Theme Contract: Light-only. Requirements for dark palettes, system theme detection, or theme switching are superseded by `../../light-only-theme-contract/specs/theme-system/spec.md`.

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

The system SHALL define CSS custom properties for all supported design tokens in the browser's `:root` pseudo-element. Each token SHALL map directly to a Tailwind-compatible value. The light semantic variables SHALL be available before any component rendering.

#### Scenario: CSS variables are applied on load

- **WHEN** the page loads
- **THEN** all `--color-*`, `--spacing-*`, `--typography-*` CSS variables are defined in `:root`
- **AND** components can access them via `var(--color-primary)` in inline styles or Tailwind classes

#### Scenario: System preference cannot override the palette

- **WHEN** the operating system prefers dark colors or contains a stale theme preference
- **THEN** `:root` retains the approved light semantic values
- **AND** all components retain the supported presentation

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

### Requirement: Tokens support the light-only contract

The system SHALL provide one supported light semantic color scheme. The `DESIGN_TOKENS` object SHALL expose the supported palette and semantic decisions without enabling an alternative runtime theme.

#### Scenario: Token references the supported color

- **WHEN** a component consumes a semantic token
- **THEN** it resolves to the approved light value
- **AND** operating-system or stored preferences do not change it
