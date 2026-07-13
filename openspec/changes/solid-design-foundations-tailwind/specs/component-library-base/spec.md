# Specification: Component Library Base

## ADDED Requirements

### Requirement: Button component with variants

The system SHALL export a typed `Button` component from `src/components/Button.tsx` that accepts props for variant (primary, secondary, danger, ghost), size (sm, md, lg), and disabled state. The component SHALL render as HTML `<button>` and apply design tokens for colors, spacing, and typography. The component SHALL support className extension and keyboard interactions (Enter, Space).

#### Scenario: Render primary button

- **WHEN** component renders `<Button variant="primary">Click me</Button>`
- **THEN** button displays primary color background with white text
- **AND** on hover, button shows darker shade of primary color
- **AND** on focus, button shows focus ring using design token shadow

#### Scenario: Button responds to disabled state

- **WHEN** component renders `<Button disabled>Disabled</Button>`
- **THEN** button appears grayed out with reduced opacity
- **AND** click events are not fired
- **AND** cursor displays as `not-allowed`

#### Scenario: Size variants scale correctly

- **WHEN** component renders buttons with sizes sm, md, lg
- **THEN** padding scales using design tokens (sm: 0.5rem, md: 1rem, lg: 1.5rem)
- **AND** text size adjusts (sm: 0.875rem, md: 1rem, lg: 1.125rem)

### Requirement: Card component with elevation

The system SHALL export a `Card` component from `src/components/Card.tsx` that wraps content with padding, background color, and shadow from design tokens. The component SHALL accept elevation prop (none, sm, md, lg) and className for customization. Card SHALL use semantic background color from design tokens.

#### Scenario: Render card with default elevation

- **WHEN** component renders `<Card>Content</Card>`
- **THEN** card displays with padding (design token md: 1rem)
- **AND** background color uses primary surface color from tokens
- **AND** shadow is applied using design token

#### Scenario: Card elevation increases shadow

- **WHEN** component renders `<Card elevation="lg">`
- **THEN** shadow is larger than default (elevated visual hierarchy)
- **AND** elevation="none" produces no shadow

### Requirement: Input component with validation styling

The system SHALL export an `Input` component from `src/components/Input.tsx` that renders `<input>` with design token styling. The component SHALL support size (sm, md, lg), validation state (default, success, error), and placeholder text. Input SHALL show visual feedback for focus and error states.

#### Scenario: Input displays error state

- **WHEN** component renders `<Input state="error" />`
- **THEN** border color changes to danger token color (red)
- **AND** background shows subtle error background
- **AND** optional error message text is displayed

#### Scenario: Input responsive to focus

- **WHEN** user focuses input field
- **THEN** border color changes to primary token color
- **AND** focus ring shadow is applied
- **AND** cursor is visible

### Requirement: Badge component for tags and labels

The system SHALL export a `Badge` component from `src/components/Badge.tsx` that displays small, semantic labels. The component SHALL accept variant (primary, secondary, success, danger, warning, info) and size (sm, md). Badge SHALL render compact with no interactive behavior.

#### Scenario: Render badge with variant

- **WHEN** component renders `<Badge variant="success">Active</Badge>`
- **THEN** badge displays with success color background and white text
- **AND** badge size is compact (padding: 0.25rem 0.75rem)
- **AND** border radius is fully rounded using design token

#### Scenario: Badge supports semantic variants

- **WHEN** component renders badges with variants (success, danger, warning, info)
- **THEN** each badge displays appropriate semantic color from design tokens
- **AND** color contrast is WCAG AA compliant

### Requirement: Components export TypeScript types

The system SHALL export TypeScript interfaces for all component props from their respective modules. Each component SHALL use `React.FC<Props>` or `React.ReactNode` for proper type checking. Props interface SHALL be documented with JSDoc comments explaining each prop.

#### Scenario: Component props are properly typed

- **WHEN** developer imports Button component
- **THEN** TypeScript autocomplete shows all available props (variant, size, disabled, className, etc.)
- **AND** type checking catches invalid prop values at compile time

### Requirement: Components support className extension

The system SHALL allow all components to accept a `className` prop that merges with base styles. Component classNames SHALL be composed using template strings or clsx utility to prevent conflicts. Base styles SHALL NOT be overridden unintentionally.

#### Scenario: Extend component with custom class

- **WHEN** component renders `<Button className="custom-class">Text</Button>`
- **THEN** both base Button styles and custom-class are applied
- **AND** custom-class properties override Button defaults if specified

### Requirement: All components support keyboard navigation

The system SHALL ensure all interactive components (Button, Input) respond to keyboard events (Enter, Space, Tab). Components SHALL have proper tabindex, ARIA attributes, and focus ring styling. Tab order SHALL follow visual left-to-right, top-to-bottom flow.

#### Scenario: Button responds to keyboard Enter key

- **WHEN** user tabs to Button and presses Enter
- **THEN** onClick handler fires
- **AND** focus ring is visible

#### Scenario: Input responds to Tab key

- **WHEN** user presses Tab on Input
- **THEN** focus moves to next interactive element
- **AND** focus ring is visible on Input
