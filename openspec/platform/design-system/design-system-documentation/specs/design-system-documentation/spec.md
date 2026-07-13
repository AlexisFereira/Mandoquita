# Specification: Design System Documentation

Theme Contract: Light-only. Documentation requirements for dark mode or theme switching are superseded by `../../light-only-theme-contract/specs/theme-system/spec.md` and shall be removed during implementation synchronization.

## ADDED Requirements

### Requirement: Component usage examples in JSDoc comments

The system SHALL include JSDoc comments in all component files with usage examples, prop descriptions, and visual variants. Each component SHALL have a comment block above the component definition that documents all props, default values, and recommended usage patterns.

#### Scenario: Developer reads component JSDoc

- **WHEN** developer opens `src/components/Button.tsx`
- **THEN** JSDoc comment block at top shows all props with descriptions
- **AND** example usage is provided (e.g., `<Button variant="primary">Click</Button>`)
- **AND** IDE shows documentation in hover tooltips

#### Scenario: Component variants are documented

- **WHEN** developer reads JSDoc for Button component
- **THEN** documentation lists available variants (primary, secondary, danger, ghost)
- **AND** each variant is described with visual intent (e.g., "primary for main actions")
- **AND** examples show typical use for each variant

### Requirement: Design token reference guide

The system SHALL create a markdown file at `src/design-system/DESIGN_TOKENS.md` that documents all supported design tokens with their values, intended use, and examples. The guide SHALL include sections for the light semantic palette, inverse surface roles, spacing scale, typography, shadows, and border radius.

#### Scenario: Developer consults design token reference

- **WHEN** developer opens `src/design-system/DESIGN_TOKENS.md`
- **THEN** document shows all available tokens organized by category
- **AND** each token displays its value(s) and CSS variable name
- **AND** use cases are provided (e.g., "use spacing.md for component padding")

#### Scenario: Color palette is visualized

- **WHEN** developer views color section of DESIGN_TOKENS.md
- **THEN** all semantic colors are listed with hex values
- **AND** standard and inverse semantic roles are identified
- **AND** contrast information is provided

### Requirement: Integration guide for new features

The system SHALL create a markdown file at `src/design-system/INTEGRATION_GUIDE.md` that explains how to adopt the design system in new features. The guide SHALL include step-by-step instructions for using design tokens, component library, and theme system in new pages and components.

#### Scenario: New developer reads integration guide

- **WHEN** developer opens `src/design-system/INTEGRATION_GUIDE.md`
- **THEN** guide provides clear steps to:
  - Import design tokens in a component
  - Use design token values in styling
  - Import and use Button, Card, Input components
  - Preserve the light-only theme contract
- **AND** code examples are provided for each step

#### Scenario: Guide includes best practices

- **WHEN** developer reads integration guide
- **THEN** guide recommends patterns (e.g., "use semantic color names, not hex")
- **AND** common mistakes are documented (e.g., "avoid inline styles for spacing")
- **AND** performance tips are provided (e.g., "CSS variables are calculated at runtime, use for theme-aware colors only")

### Requirement: In-code examples demonstrate token usage

The system SHALL include example code snippets in comment sections of key files that show how to use design tokens and components. Examples SHALL be syntactically correct and directly usable in components.

#### Scenario: Developer sees example in component file

- **WHEN** developer opens `src/components/Button.tsx`
- **THEN** comment block includes example code:
  ```typescript
  // Example:
  // import { Button } from '@/components/Button';
  // export function MyComponent() {
  //   return <Button variant="primary" size="md">Click me</Button>
  // }
  ```
- **AND** example is properly formatted and copy-paste ready

### Requirement: Design decisions are documented

The system SHALL create a markdown file at `src/design-system/DECISIONS.md` that documents key design system decisions (why certain tokens, color choices, spacing scale, component APIs). This file SHALL serve as a reference for understanding the rationale behind the system.

#### Scenario: Developer understands design rationale

- **WHEN** developer opens `src/design-system/DECISIONS.md`
- **THEN** document explains decisions such as:
  - Why 4px grid spacing was chosen
  - Why semantic color naming is used
  - Why components are simple and composable
  - Why CSS variables are used for themes
- **AND** trade-offs are acknowledged

### Requirement: Component API is consistent and documented

The system SHALL ensure all components follow a consistent prop naming convention: `variant`, `size`, `disabled`, `className`, `children`. Props SHALL be documented in TypeScript interfaces with JSDoc comments. Breaking prop changes SHALL be documented in a CHANGELOG.

#### Scenario: Developer knows what props a component accepts

- **WHEN** developer hovers over component in IDE
- **THEN** prop interface is shown with all available props
- **AND** JSDoc comments explain each prop
- **AND** type definitions prevent incorrect prop values

### Requirement: Light-only usage is documented

The system SHALL document how to ensure components use the single light semantic palette. Documentation SHALL prohibit theme-specific logic and require validation on standard and inverse surfaces.

#### Scenario: Developer learns the light-only contract

- **WHEN** developer reads integration guide
- **THEN** the section explains that `:root` owns one supported light palette
- **AND** developers are reminded to use semantic color tokens, not hardcoded hex
- **AND** testing recommendations cover standard and inverse surfaces

### Requirement: Troubleshooting guide for common issues

The system SHALL create a section in INTEGRATION_GUIDE.md that addresses common issues and solutions (e.g., "component colors not changing with theme", "CSS variables not loading", "components not rendering with design tokens").

#### Scenario: Developer encounters styling issue

- **WHEN** developer consults troubleshooting section
- **THEN** common issues are listed with solutions
- **AND** examples show what went wrong and how to fix it
- **AND** debugging tips are provided
