# Solid Design Foundations with Tailwind

## Why

The current design system is fragmented across inline styles, ad-hoc component styling, and inconsistent Tailwind usage. This creates maintainability challenges, visual inconsistency, and slows feature development. A unified, well-documented Tailwind-based design foundation will provide a single source of truth for design tokens, component patterns, and theming—enabling faster development, better consistency, and easier scaling as the catalog grows.

## What Changes

- **Centralized Design Tokens**: Define comprehensive tokens for colors, spacing, typography, shadows, and borders using Tailwind's config layer
- **Component Library**: Create reusable, typed component abstractions (Button, Card, Input, Badge, etc.) with consistent styling
- **Theme System**: Implement a robust light/dark theme system with automatic color mapping
- **Design System Documentation**: Add visual storybook-style documentation and usage patterns
- **Consistent Spacing & Layout**: Enforce 4px grid, predictable gaps, and responsive breakpoints across all pages
- **Typography Scale**: Define consistent font sizes, weights, and line heights for headers, body, and utility text
- **Color Palette Management**: Establish semantic color usage (primary, secondary, success, danger, etc.) mapped to actual hex values

## Capabilities

### New Capabilities

- `tailwind-design-tokens`: System for defining and accessing design tokens (colors, spacing, typography, shadows) with Tailwind integration
- `component-library-base`: Reusable UI components (Button, Card, Input, Badge, Pill, etc.) with consistent styling and TypeScript support
- `theme-system`: Light/dark theme switching with automatic color palette application and CSS variable support
- `design-system-documentation`: Visual reference and usage guidelines for all components and tokens

### Modified Capabilities

- `homepage-carousel-autoplay`: Update carousel overlay controls to use new component library and token system for consistency

## Impact

- **Frontend**: All component files (`src/components/`) will adopt the new design system and token usage
- **Design Tokens**: New `src/design-system/tokens.ts` will export all design tokens; existing theme.ts will be enhanced
- **Pages**: All page layouts will use new spacing tokens and component library instead of inline styles
- **Styling**: Gradual migration from inline styles to utility-first Tailwind + component library pattern
- **Dependencies**: No new external dependencies; leverages existing Tailwind + Twind setup
- **Non-Goals**: This change does NOT introduce cart styling, authentication flows, or payment UI

## Non-Goals

- Authentication and user account styling (separate concern)
- Shopping cart and checkout flows (out of scope for catalog discovery)
- Payment processing UI (handled separately)
- Third-party component library adoption (custom, Tailwind-based system)
