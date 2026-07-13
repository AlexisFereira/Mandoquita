# Icon System Specification

## ADDED Requirements

### Requirement: One governed glyph source

The system SHALL source reusable interface icons from `lucide-react` through a
local semantic registry using named imports. Feature code SHALL NOT expose the
complete library, dynamically import all icons, or copy package SVGs.

#### Scenario: Feature requests an approved icon

- **WHEN** a consumer renders a typed semantic icon name
- **THEN** the registry renders its approved glyph
- **AND** the consumer does not depend on the library glyph name

### Requirement: Icon API has explicit accessibility modes

The system SHALL make icons decorative by default and SHALL require a non-empty
textual equivalent when an icon is informative.

#### Scenario: Icon repeats adjacent label

- **GIVEN** an icon supports visible text with the same meaning
- **WHEN** the component renders
- **THEN** the icon is absent from the accessibility tree
- **AND** the visible text remains authoritative

#### Scenario: Icon contributes unique approved meaning

- **WHEN** an informative icon renders
- **THEN** it exposes its approved textual equivalent
- **AND** it is not independently focusable

### Requirement: Icons use semantic visual roles

The system SHALL render approved 16px, 20px, or 24px outline sizes, inherit
semantic `currentColor`, and preserve meaning across light-only surfaces and 200%
zoom.

### Requirement: Icons do not weaken interactive controls

An icon used inside an interactive control SHALL remain subordinate to the
control's accessible name, visible focus, keyboard behavior, and minimum 44 by 44
CSS-pixel target.

### Requirement: Brand and business meaning stay outside Platform

The system SHALL NOT use generic or unapproved brand glyphs to imply a payment
method, contact provider, Product state, availability, or commercial capability.

#### Scenario: Payment methods are listed

- **WHEN** an informational payment section uses an icon
- **THEN** the icon supports the section's generic informational purpose
- **AND** exact method support is communicated by approved text
- **AND** no provider mark is inferred from the registry

