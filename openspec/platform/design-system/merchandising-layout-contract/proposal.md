# Merchandising Layout Contract

Status: Complete — Platform Release Approved

Owner: Design System Architect

Date: 2026-07-13

## Problem

The component library caps `Container` at 1280 CSS pixels and has no shared
collection-grid primitive for the approved 2/3/4/6 density. Homepage
Merchandising Layout V2 requires an opt-in 1400px content boundary and repeats
the same responsive collection behavior across Categories, Featured Products
and selected-Category Products.

Implementing those decisions as Homepage-local class strings would duplicate a
reusable layout pattern and make the exact 1400px transition easy to drift.
Changing existing Container defaults or global breakpoints would regress current
consumers.

## Decision

Open this independent Platform/Design System change to:

1. add an opt-in `wide` (1400px) Container size while preserving every current
   size and default;
2. add a domain-neutral `CollectionGrid` with one ordered child collection and
   exact 2/3/4/6 columns at base/640/1024/1400 CSS pixels; and
3. document full-bleed promotional Carousel composition without changing its
   released autoplay, control or slide API.

The optional Platform boundary is jointly approved by the Project Architect and
Design System Architect in Homepage Merchandising Layout V2 `HML-006`.

## Scope

- Additive Container size and layout token.
- Domain-neutral collection layout component and typed exports.
- Responsive gutters, gaps, reflow and one-DOM-order guarantees.
- Full-bleed Banner Slider composition and crop-safe media guidance.
- Light-only tokens, keyboard/focus, reduced motion and compatibility tests.

## Out of scope

- Homepage section order or selected-Category business behavior.
- Category/Product eligibility, limits, ordering or server selection.
- Banner administration, new slides, copy or destinations.
- Changes to existing Container defaults, current breakpoints or Carousel timing.
- A second Hero, feature-local Grid variant or alternate theme.

## Consumers

Homepage Merchandising Layout V2 is the first consumer. The Container and Grid
contracts remain presentation- and domain-neutral for later approved collection
layouts.
