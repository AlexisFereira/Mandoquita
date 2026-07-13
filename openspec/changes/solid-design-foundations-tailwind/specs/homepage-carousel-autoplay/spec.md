# Specification: Homepage Carousel Autoplay (Updated for Design System)

## MODIFIED Requirements

### Requirement: Carousel displays banner images with full-width responsive layout

The carousel SHALL render full-width banner images using the new design system's layout components and spacing tokens. The carousel container SHALL use `max-width: 1400px` with `margin: 0 auto` to constrain content while maintaining full viewport width. The carousel SHALL apply design token spacing (`md` for padding, `lg` for gaps) instead of hardcoded pixel values.

#### Scenario: Carousel renders full-width with constrained content

- **WHEN** carousel component renders on homepage
- **THEN** carousel container spans full viewport width
- **AND** internal content uses max-width 1400px
- **AND** spacing uses design tokens (e.g., `padding: var(--spacing-md)`)
- **AND** layout respects responsive breakpoints from design system

#### Scenario: Carousel overlay controls use design system Button

- **WHEN** carousel displays navigation controls (prev, next, indicators)
- **THEN** controls are styled using Button component from component library
- **AND** button colors use design tokens (primary color for active state)
- **AND** button size uses design token scale (sm for indicators, md for prev/next)

### Requirement: Carousel overlay colors use semantic design tokens

The carousel overlay background gradient and text colors SHALL use semantic colors from design tokens instead of hardcoded hex values. The overlay background SHALL use `rgba(var(--color-neutral-dark), 0.5)` or similar CSS variable references. Text color SHALL use `var(--color-text-light)` for readability.

#### Scenario: Overlay gradient uses design tokens

- **WHEN** carousel overlay is rendered
- **THEN** background gradient uses semantic color variables
- **AND** gradient remains readable in light and dark themes
- **AND** colors update automatically when theme changes

### Requirement: Carousel supports theme-aware styling

The carousel SHALL automatically adapt to light and dark themes via CSS variables. Images, borders, and text overlays SHALL remain readable and visually consistent in both themes. The design system's theme context SHALL be available to carousel component if needed.

#### Scenario: Carousel appearance changes with theme

- **WHEN** user toggles theme to dark mode
- **THEN** carousel overlay adjusts opacity/colors for readability in dark
- **AND** text remains legible (light text on dark overlay)
- **AND** no theme flash occurs during transition
