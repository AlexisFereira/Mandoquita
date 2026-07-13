# Component Library Delta: Gallery and Option Controls

## ADDED Requirements

### Requirement: Carousel provides a non-autoplay gallery mode

The system SHALL extend `Carousel` with a typed `gallery` mode that presents an
ordered collection of media, never autoplays, and exposes direct item selection.

#### Scenario: Visitor selects an image directly

- **GIVEN** a gallery with multiple ordered items
- **WHEN** the visitor activates a direct item control
- **THEN** that item becomes current
- **AND** current position and total count remain programmatically available
- **AND** keyboard focus remains on the activated control

#### Scenario: Feature requests associated media

- **GIVEN** a controlled gallery
- **WHEN** its consumer changes `activeItemId` to an existing item identity
- **THEN** the requested item becomes current
- **AND** the gallery does not move keyboard focus
- **AND** the gallery emits no reciprocal feature selection

#### Scenario: Gallery receives no media

- **GIVEN** an empty media collection
- **WHEN** gallery mode renders
- **THEN** it preserves the stable media region
- **AND** presents the approved non-interactive missing-media outcome
- **AND** renders no gallery navigation controls

#### Scenario: Current media fails

- **GIVEN** one gallery item fails to load
- **WHEN** other valid items exist
- **THEN** the failed item uses the approved media-error presentation
- **AND** navigation to other items remains available
- **AND** failure feedback is polite and does not move focus

### Requirement: Gallery media controls are accessible and responsive

The system SHALL give every direct media control a distinguishable accessible
name, expose its current state, provide a minimum 44 by 44 CSS-pixel target, and
preserve order and meaning under responsive reflow and 200% zoom.

#### Scenario: Thumbnail is not self-describing

- **GIVEN** a thumbnail whose pixels do not communicate its destination
- **WHEN** assistive technology reads its control
- **THEN** the accessible name identifies the media item or position
- **AND** current state is not communicated by color or position alone

### Requirement: Chip provides a controlled option mode

The system SHALL extend `Chip` with a typed interactive option mode for use within
a labelled single-selection group. The parent SHALL own the selected value and
feature-specific combination resolution.

#### Scenario: Visitor chooses an option

- **GIVEN** a labelled option group with selectable option chips
- **WHEN** the visitor activates one option
- **THEN** the parent receives its stable value
- **AND** exactly the parent-controlled selected option is communicated
- **AND** the option remains operable by keyboard

#### Scenario: Choice cannot resolve a valid combination

- **GIVEN** a choice that cannot lead to a valid feature-defined combination
- **WHEN** it is presented for recovery context
- **THEN** it is programmatically unavailable
- **AND** explanatory text avoids inventory and commercial language
- **AND** selected, unavailable, and focus states remain distinguishable

### Requirement: Gallery and option status updates do not steal focus

The system SHALL support polite status composition for meaningful media and option
state changes without programmatic focus movement.

#### Scenario: External selection updates media

- **WHEN** a consumer selection causes gallery media to change
- **THEN** a concise status may announce the resulting context
- **AND** focus remains on the visitor's initiating control
- **AND** reduced-motion preference is respected

## MODIFIED Requirements

### Requirement: Existing promotional Carousel behavior remains compatible

The existing `slides`-based promotional Carousel SHALL remain supported while the
new gallery API is introduced. Gallery-only behavior SHALL not alter promotional
consumers.

### Requirement: Existing Chip modes remain compatible

Presentational and removable Chip behavior SHALL remain supported. Option-only
props SHALL be unavailable to those modes through the public TypeScript contract.

