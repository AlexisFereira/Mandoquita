# Product Gallery and Option Controls

Status: Complete — Platform Released

Owner: Design System Architect

Date: 2026-07-12

## Problem

The current component library can visually approximate an ordered media gallery
and grouped choices, but its public contracts do not support them correctly.

- `Carousel` owns its active index, starts autoplay, assumes promotional slide
  copy and actions, and cannot receive an externally requested item.
- `Chip` is non-interactive unless it represents removal. It does not expose
  radio-group semantics, unavailable-choice semantics, or a controlled selected
  value.
- No shared media contract governs ordered thumbnails, stable media space,
  loading, missing media, failed media, or non-interruptive status feedback.

Feature code must not duplicate these reusable interaction and accessibility
foundations.

## Decision

Open an independent Platform/Design System change that extends existing shared
components:

1. Extend `Carousel` with an explicit non-autoplay `gallery` mode and controlled
   active-item contract.
2. Extend `Chip` with an interactive `option` mode intended for composition in a
   labelled single-selection group.
3. Define shared media-state and polite-status composition contracts using
   existing tokens and native accessibility semantics.

The extensions remain domain-neutral. Product Image ordering, Variant resolution,
attribute vocabulary, and which choices exist remain feature responsibilities.

## Scope

- Controlled and uncontrolled active media selection.
- Ordered direct media controls and current-position communication.
- Optional thumbnails with text alternatives.
- Gallery loading, missing, and failed-media presentation.
- Labelled single-selection option groups with selected and unavailable-
  combination states.
- Keyboard, focus, target size, reflow, reduced-motion, and light-only behavior.
- Typed component APIs, tests, examples, and migration notes.

## Out of Scope

- Product, Product Image, or Product Variant domain models.
- Variant-combination resolution logic.
- Inventory, stock, price, cart, or transactional meaning.
- Feature-specific labels, SKU, barcode, reference, or attribute vocabulary.
- Autoplay in gallery mode.
- New palette or theme variants.

## Dependencies and Consumers

- Consumes the active light-only theme and accessibility foundations.
- Unblocks Product Content and Variants V1 UI design after contract approval.
- Frontend implementation is required before feature integration.
