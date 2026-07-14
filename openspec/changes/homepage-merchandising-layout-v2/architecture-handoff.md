# Homepage Merchandising Layout V2 — Architecture Handoff

Status: Fulfilled — Feature Release Approved

Date: 2026-07-13

## UX

- Use the exact merchandising order and retain Contact/Footer afterward.
- Define transitions and omission outcomes without moving remaining regions.
- Treat the selected Category as one daily shared editorial discovery outcome,
  not personalization or a live random animation.
- Preserve complete Categories, released Featured limits and six stable selected
  Products that wrap across responsive grids.

## Design System and UX/UI

- Specify one opt-in 1400px Container option without default/global migration.
- Specify 6/4/3/2 at the approved ranges for both Card types, including two usable
  columns at 320px and 200% zoom.
- Compose full-width Banner media with content-safe inner alignment, stable ratio,
  existing controls and released motion behavior.
- Restyle Payment Information as a Banner without adding selection or transaction
  semantics.

## Backend

- Extend Homepage projection with one optional selected Category and maximum six
  Products using canonical public predicates/order.
- Calculate deterministic daily selection using `America/Bogota`, stable Category
  identities and no immediate repeat when multiple unchanged candidates exist.
- Keep SSR/hydration membership identical; React receives but never chooses.
- Bound cache at the business-day boundary and invalidate ineligible catalog
  content. No Banner persistence/API is authorized.

## Frontend

- Wait for HML-008–HML-012 design evidence, then implement HML-015–HML-020.
- Remove the separate Hero, not just its copy, and place Slider first/full-width.
- Render one semantic Card collection per region without duplicate responsive DOM
  or viewport-based hiding of selected Products.

## Required Evidence

- Exact order and omission matrix.
- Width/columns at 1400, 1024, 640 and 320px plus 200% zoom.
- Same selected IDs across repeated SSR/hydration and a change at Bogotá midnight.
- No immediate daily repeat with multiple unchanged Categories.
- Catalog invalidation, zero-candidate omission and canonical Product order.
- Carousel/fallback/reduced-motion, Payment meaning, light-only, layout-shift and
  public Search/Category/Product regressions.
