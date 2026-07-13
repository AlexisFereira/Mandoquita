# Specification: Light-Only Theme System

Status: Active

## MODIFIED Requirements

### Requirement: Single light semantic palette

The system SHALL provide one complete light semantic color palette containing background, surface, surface-muted, foreground, muted, border, primary, primary-hover, primary-foreground, accent, success, warning, danger, focus, and inverse surface roles.

#### Scenario: Application loads

- **WHEN** any supported page loads
- **THEN** the light semantic palette is available before content renders
- **AND** the document declares a light color scheme
- **AND** every shared component consumes semantic roles from that palette

### Requirement: Theme remains independent of system preference

The system SHALL NOT change application colors in response to `prefers-color-scheme` or operating-system theme changes.

#### Scenario: Operating system prefers dark colors

- **GIVEN** the operating system reports a dark color preference
- **WHEN** the application loads
- **THEN** the application renders the approved light palette
- **AND** no dark palette is activated

#### Scenario: Operating-system preference changes

- **WHEN** the operating-system color preference changes while the application is open
- **THEN** application semantic colors remain unchanged

### Requirement: No user theme preference

The system SHALL NOT expose a manual light/dark/system theme preference, theme toggle, or persistent theme-selection behavior.

#### Scenario: Stale stored preference exists

- **GIVEN** browser storage contains a previous theme preference
- **WHEN** the application loads
- **THEN** the stored value is ignored or removed
- **AND** the application renders the light palette

### Requirement: Stable first paint and hydration

The system SHALL make the complete light semantic palette available before application hydration and SHALL preserve identical semantic values after hydration.

#### Scenario: JavaScript hydrates

- **WHEN** server-rendered content hydrates
- **THEN** no theme class or inline semantic palette changes
- **AND** no color-scheme flash occurs
- **AND** layout remains stable

### Requirement: Light semantic contrast

The system SHALL ensure supported light semantic text combinations meet at least 4.5:1 for normal text and supported graphical, focus, border, and large-text cues meet at least 3:1 where applicable.

#### Scenario: Semantic content renders

- **WHEN** text, controls, status, focus, or inverse-surface content renders
- **THEN** the applicable WCAG AA contrast threshold is satisfied

### Requirement: Semantic color naming consistency

The system SHALL use one semantic channel-based variable family. Components SHALL NOT introduce theme-specific palettes, deprecated color aliases, or static color literals.

#### Scenario: Component consumes a semantic color

- **WHEN** a shared or feature component requires color
- **THEN** it references an approved semantic role
- **AND** the role resolves to the single light palette

## REMOVED Requirements

### Requirement: Light and dark theme color palettes

Reason: the product contract now supports only the approved light presentation.

### Requirement: Automatic theme switching via system preference

Reason: system preference must not alter the approved application presentation.

### Requirement: Manual theme toggle functionality

Reason: theme selection is no longer a supported user preference.

### Requirement: Theme context available to all components

Reason: component styling consumes semantic CSS roles and no supported behavior depends on theme selection.
