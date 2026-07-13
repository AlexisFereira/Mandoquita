# Product Content and Variants V1 — Backend Implementation

Status: Implemented and Validated

Owner: Backend Architect

Date: 2026-07-12

## Delivered Boundary

Migration `202607120007_add_product_content_variants_v1` adds Product-owned
Variants, approved typed attributes, ordered Images, normalized tags, optional
merchandising content and SEO. Product Type remains the sole classification leaf;
Product lifecycle, Featured behavior and Product-level price remain independent.

PostgreSQL enforces globally unique non-empty SKU, one Product owner, one attribute
per approved name, exactly one correctly typed attribute value, unique Image
position, non-empty URL/alt text, at most one Primary Image, and same-Product
Variant/Image association. Deferred constraint triggers prevent a committed
Published Product from having zero Variants while permitting atomic nested writes.

## Public Contract

Listing and detail expose ordered Images, optional content and a compatibility
`imageUrl` derived from Primary/first Image. Detail exposes `variantSelection` as
`none`, `read_only`, `selectable`, or `content_correction`. Only Active Variants
participate, and public Variant data contains stable ID, approved attributes and
optional Image association. SKU, reference, barcode, Variant Active, inventory,
cost, supplier, tax, warehouse, shipping and Variant pricing are never exposed.

## Migration and Rollback

Product Requirements approved an empty business migration inventory. Migration
007 begins with a guard that aborts if any Product exists, preventing fabricated
SKU, attributes or media disposition. Test fixtures are created only after schema
activation with explicit SKUs.

Rollback is coordinated: stop writes, restore the pre-007 PostgreSQL backup and
deploy the prior application artifact together. Because the approved activation
inventory is empty, a structural down migration is also safe before new business
Products exist: remove PCV triggers/functions and child tables, remove PCV enums
and Product content columns, restore legacy `imageUrl`, then deploy the prior
artifact. After real Product creation, backup restoration is mandatory because a
down migration would discard governed Variant/Image identity.

## Evidence

- Migration status: 8 migrations applied; schema current.
- PCV PostgreSQL validation: ownership, duplicate SKU, Primary uniqueness,
  cross-Product Image rejection, Base Variant, gallery order, content, public
  price protection and forbidden-field exclusion passed.
- Taxonomy regression: 7 Categories, 16 Subcategories, 30 Product Types and zero
  Published taxonomy orphans passed.
- Lifecycle/performance: 10,000 Products, 1,000 detail queries, concurrency 20,
  p95 35.80 ms <= 50 ms; deterministic results and cleanup passed.
- TypeScript, 23 test files / 116 tests and production build pass.

PCV-012 through PCV-018 are complete. Frontend and QA remain downstream owners.
