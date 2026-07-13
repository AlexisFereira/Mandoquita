# Product Content and Variants V1 — UI Design Readiness

Status: Superseded by `ui-design.md`

Owner: Senior UI/UX Designer

Dependency reviewed: 2026-07-12

## Ready Inputs

The following inputs are approved and sufficient for UI work once the Design
System dependency is resolved:

- Product remains the primary identity; Variant is subordinate inspection context.
- Gallery order, Primary Image behavior, Variant-associated Image behavior and
  missing-media outcomes are defined.
- A selector appears only for two or more Active Variants distinguishable through
  approved non-empty attributes.
- Base, inactive and indistinguishable Variants do not appear as visitor choices.
- Talla, Color, Material, Capacidad and Presentación are the only approved initial
  attribute labels.
- Selection never changes Product-level price, commercial availability, taxonomy
  or transactional state.
- Metadata remains optional and visually subordinate to taxonomy and Product
  identity.
- Responsive, keyboard, focus, alternative-text, reflow, target-size,
  reduced-motion and light-only expectations are approved in `ux-blueprint.md`.

## Blocking Design System Decision

`PCV-011` must determine whether existing component composition is sufficient or
whether a separate Platform change is required. UI Design cannot finalize component
selection, state styling or interaction composition before these questions are
answered:

1. Does the current Carousel contract support a Product gallery with direct Image
   selection, current position, ordered thumbnails and Variant-driven gallery
   focus without inheriting autoplay semantics?
2. Is an existing Button, Chip, radio-group or other control contract approved for
   grouped Variant values with selected, focus, unavailable-combination and long-
   label states?
3. Which existing component communicates selected Variant context without turning
   attributes into badges, filters, inventory state or transactional controls?
4. Which skeleton and media-fallback contracts apply to an ordered gallery and its
   direct Image controls?
5. Is an accessible status pattern already approved for Variant resolution and
   Image failure feedback that must not move focus?
6. Are thumbnail dimensions, gallery aspect ratio, focus treatment and selected-
   state contrast already governed by tokens, or do they require new component
   contracts?

## UI Work Unblocked After PCV-011

Once the decision exists, the Senior UI/UX Designer will finalize:

- Product Detail visual hierarchy for multi-Variant, Base Variant and no-Image
  outcomes;
- gallery layout and direct Image controls across mobile, tablet and desktop;
- grouped Variant option presentation for one or multiple attributes;
- selected Variant context and optional metadata hierarchy;
- loading, missing, error and recovery presentation;
- keyboard, focus, screen-reader status, 200% reflow and 44px target rules;
- a component/state matrix that uses only approved Design System contracts;
- the final UI validation checklist and Design approval.

## Non-negotiable UI Constraints

- Do not design color-only swatches as the sole Variant label.
- Do not display inactive choices as sold out, unavailable stock or inventory.
- Do not expose Base Variant, SKU, barcode or reference without an independent
  public-content approval.
- Do not preselect a Variant to simulate a commerce configuration default.
- Do not introduce autoplay into the Product gallery.
- Do not create hidden duplicate Images or Variant controls across breakpoints.
- Do not let optional media or metadata block access to a valid Product.
- Do not introduce new reusable components from the feature layer.

## Readiness Decision

Product Requirements, Architecture and UX Solution inputs pass review. There is no
business or UX ambiguity blocking presentation. The only blocker is the explicit
Design System dependency `PCV-011`. Final `PCV-010` approval before that decision
would violate the execution order recorded in `tasks.md` and the authority boundary
recorded in `architecture-review.md`.

PCV-011 was subsequently approved through the independent Platform change at
`openspec/platform/design-system/product-gallery-variant-controls/`. Final UI
decisions are recorded in `ui-design.md`; this artifact remains as dependency
history only.
