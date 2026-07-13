# Category Taxonomy V1 — Frontend Implementation

Status: Implemented and Frontend Approved

Owner: React Frontend Architect

## Delivered Routes

- `/categorias` is the canonical general Category discovery and recovery destination.
- `/categorias/[slug]` presents official Category context, eligible Subcategories and branch Products.
- `/categorias/[slug]/[subcategory]` presents official parent context and Products restricted by the approved Backend filter.
- Invalid or newly unavailable Category and Subcategory destinations use one recovery outcome leading to `/categorias`.

## Cross-feature Language

- Header and Footer use the canonical general Category destination.
- Product cards preserve Category, Subcategory and Product Type language.
- Product Detail breadcrumbs and metadata preserve the inherited Category → Subcategory → Product Type hierarchy.
- Product Type remains classification text and is never exposed as a public filter destination.

## Contract Preservation

- The implementation consumes Backend taxonomy services and does not keep a parallel hierarchy.
- Eligible collections retain Backend order and are not capped or visually reordered.
- Existing Design System components, light-only semantics, responsive grids, visible focus, skip navigation and discovery-only scope remain intact.
- Unknown branches provide recovery without fabricating or exposing inactive taxonomy entities.

## Verification

- TypeScript: `npx tsc --noEmit` passes.
- Automated tests: 23 files and 108 tests pass, including taxonomy hierarchy and accessibility scenarios.
- Production: `next build` passes with general Category, Category, Subcategory and Product Detail routes.

Frontend tasks CT-016 through CT-020 are complete and QA has approved CT-021 through CT-024. Frontend approval is recorded in `frontend-review.md`, Accessibility approval in `accessibility-review.md`, and Project Architect Release approval in `release-approval.md`.
