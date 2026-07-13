# Scroll-entry Motion Specification

## ADDED Requirements

### Requirement: Content is visible without enhancement

The system SHALL render opted-in content visible and operable by default. Missing
JavaScript, unsupported observation, failure, or reduced-motion preference SHALL
leave it immediately in its final state.

### Requirement: Entry motion runs at most once per page view

The system SHALL reveal an eligible below-viewport element at most once during its
page-view lifetime and SHALL stop observing it after reveal.

#### Scenario: Visitor scrolls away and returns

- **GIVEN** an eligible element has completed entry motion
- **WHEN** it leaves and re-enters the viewport
- **THEN** it remains in its final state
- **AND** no new entry animation starts

### Requirement: Reduced motion bypasses the effect

The system SHALL omit delay, opacity transition, and transform whenever reduced
motion is preferred, including when the preference changes while content is
prepared.

### Requirement: Motion preserves interaction and layout

Scroll-entry Motion SHALL NOT move focus, reorder semantics or tab sequence, block
pointer or keyboard access, create horizontal overflow, or cause layout shift.

#### Scenario: Prepared content receives focus

- **WHEN** focus targets an element within prepared content
- **THEN** the content resolves immediately to its final visible state
- **AND** focus remains on the target

### Requirement: Motion values and scope are bounded

The system SHALL use only opacity and optional vertical translation up to 12px,
duration up to 250ms, ease-out, and optional stagger up to 160ms. Only explicitly
approved non-critical sections may opt in.

### Requirement: Observation is efficient and cleaned up

The system SHALL share compatible observers, use no continuous scroll listener,
observe at most 50 elements per page, unobserve revealed elements, and remove
observation and transient state on unmount.

