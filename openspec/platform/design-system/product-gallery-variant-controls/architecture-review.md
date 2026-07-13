# Product Gallery and Option Controls — Architecture Review

Status: Approved

Owner: Project Architect

Date: 2026-07-12

## Decision

The Platform change is approved for implementation.

Extending the existing `Carousel` and `Chip` contracts is architecturally preferable to creating Product-specific shared components or duplicating gallery and option-control behavior inside the feature.

## Approved Boundaries

- Platform owns reusable gallery selection, option-control interaction, media states, polite status composition, keyboard behavior, focus, responsive behavior, and accessibility foundations.
- Product Content and Variants owns Product Image order, Variant identity, attribute vocabulary, valid combinations, Base Variant behavior, and every domain decision.
- Gallery mode never infers or changes a Variant.
- Option controls never infer inventory, stock, price, Commercial Availability, or transactional meaning.
- Existing promotional Carousel and presentational/removable Chip behavior remains compatible.
- Gallery mode never autoplays.
- Existing semantic tokens and deterministic light-only theme remain authoritative; no new palette is approved.

## Architecture Assessment

### Reuse

The proposed change consolidates interaction and accessibility behavior required by multiple future media and option experiences without importing Product-domain semantics into Platform.

### Compatibility

Discriminated component modes preserve existing consumers and prevent incompatible promotional, gallery, presentational, removable, and option properties from being combined. Any later deprecation requires a separate reviewed change.

### Accessibility

The proposal preserves labelled grouping, keyboard access, visible focus, 44 CSS-pixel targets, stable DOM order, 200% reflow, reduced motion, non-interruptive status updates, and selected-state communication beyond color.

### Scope control

No inventory, commercial, pricing, taxonomy, SKU, barcode, Variant resolution, or Product-specific labeling enters Platform.

## Conditions for Release

- Existing Carousel and Chip consumers pass regression validation without behavior change.
- Gallery and option modes pass their complete accessibility review.
- Product-domain logic remains outside shared components.
- Documentation includes compatibility and composition examples.
- QA passes TypeScript, automated tests, responsive validation, and production build.

## Approval Outcome

`PGOC-004` is approved. `PGOC-005` through `PGOC-010` are unblocked. Platform release remains gated by `PGOC-011` through `PGOC-015`.
