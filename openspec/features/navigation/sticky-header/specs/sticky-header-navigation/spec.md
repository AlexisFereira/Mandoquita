Status: Active

## ADDED Requirements

### Requirement: Sticky header persistence

The system SHALL keep the primary header always visible and pinned to the top edge of the viewport.

#### Scenario: Header remains visible on downward scroll

- **WHEN** a user scrolls down from the initial page position
- **THEN** the header remains pinned to the top edge of the viewport

#### Scenario: Header remains pinned at initial position

- **WHEN** a user opens the page before any scrolling
- **THEN** the header is already anchored to the top edge and remains visible

### Requirement: Sticky visual state

The system SHALL apply a stable sticky visual style that preserves readability and hierarchy at all times.

#### Scenario: Sticky style is consistently applied

- **WHEN** the header is rendered in any scroll position
- **THEN** it keeps a stable background and elevation appropriate for continuous readability

### Requirement: Responsive sticky behavior

The system SHALL provide consistent sticky behavior on mobile, tablet, and desktop layouts.

#### Scenario: Sticky header on mobile

- **WHEN** a user scrolls on a mobile viewport
- **THEN** the sticky header remains usable without clipping navigation controls

#### Scenario: Sticky header on tablet

- **WHEN** a user scrolls on a tablet viewport
- **THEN** sticky layout preserves spacing and avoids overlap with page content

#### Scenario: Sticky header on desktop

- **WHEN** a user scrolls on a desktop viewport
- **THEN** sticky header remains aligned with desktop navigation and actions

### Requirement: Full-width header with constrained inner layout

The system SHALL render the header as a full-width top bar without card framing while constraining internal content to a maximum width of 1400px.

#### Scenario: Header spans full viewport width

- **WHEN** the page is rendered on any viewport size
- **THEN** the header background spans edge-to-edge across the viewport width

#### Scenario: Inner content respects max width

- **WHEN** viewport width exceeds 1400px
- **THEN** header internal content remains centered with a maximum width of 1400px

### Requirement: Catalog-only navigation links

The system SHALL exclude purchase-oriented navigation links from the header.

#### Scenario: No cart or buy links in header navigation

- **WHEN** a user views header navigation
- **THEN** links related to cart, checkout, or buy actions are not present

### Requirement: Accessible sticky navigation

The system SHALL preserve keyboard and assistive navigation semantics when header is sticky.

#### Scenario: Keyboard navigation while sticky

- **WHEN** keyboard focus moves across header links/buttons in sticky mode
- **THEN** focus order and visibility remain clear and operable

### Requirement: Content offset safety

The system SHALL prevent top-content occlusion caused by sticky header height.

#### Scenario: Main content remains visible below sticky header

- **WHEN** sticky mode is active
- **THEN** top sections are not hidden beneath the header and remain readable
