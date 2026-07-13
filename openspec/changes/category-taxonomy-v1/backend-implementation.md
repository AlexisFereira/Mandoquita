# Category Taxonomy V1 — Backend Implementation

Status: Implemented

Owner: Backend Architect

## Domain Model

- `TaxonomyVersion` owns version `1.0.0`, locale `es`, and lifecycle state.
- `Category` uses the seven supplied stable IDs and slugs plus business order.
- `Subcategory` uses the sixteen supplied stable IDs and slugs plus source order.
- `ProductType` uses the thirty official names as stable leaf identifiers and
  preserves source sequence.
- `Product.productTypeId` is the only persisted Product classification.
  Subcategory and Category are inherited through the hierarchy.

PostgreSQL prevents publication when `productTypeId` is null. Foreign keys,
unique slugs, unique source positions, positive-order checks, and restrictive
deletes prevent orphan or silently reordered taxonomy data.

## Migration

Migration `202607120006_activate_category_taxonomy_v1` atomically:

1. Retires the ten approved demonstration Products.
2. Removes the former flat Category relation.
3. Creates and activates taxonomy version 1.0.0.
4. Loads 7 Categories, 16 Subcategories, and 30 Product Types.
5. Adds the Product leaf-classification relation and publication invariant.

No demonstration Product is assigned to an unrelated Product Type.

## Discovery Contracts

- Product listing supports `category` and `subcategory` branch filters.
- Public Products require an active Product Type and Subcategory inside an
  active, visible Category of the active taxonomy version.
- Category discovery returns only non-empty eligible branches in `sortOrder`.
- Subcategories return only non-empty eligible branches in `sourceOrder`.
- Product contracts expose official Product Type, Subcategory, and Category.
- Homepage Category discovery consumes the same taxonomy service.
- Related Products remain Category-affine using inherited classification.

## Category Media

Migration `202607130009_add_category_media` assigns the seven approved PNG files
and alternative texts to `Category.imagePath` and `Category.imageAltText`.
PostgreSQL enforces an all-or-none media pair and a normalized relative
`/images/categories/<slug>.png` path. The public contract exposes that relative
path as `imageUrl`; `CategoryCard` resolves it through
`NEXT_PUBLIC_ASSET_BASE_URL`, keeping database content independent from the local
host, application prefix or CDN origin.

## Continuity

Next.js permanent redirects send `/categorias/audio`, `/categorias/computing`,
and `/categorias/home-living` to `/categorias`. Retired demonstration Product
slugs resolve through the standard unavailable outcome.

## Rollback

Taxonomy activation is one release boundary. Operational rollback requires:

1. Stop writes and preserve a database backup immediately before activation.
2. Redeploy the prior application/schema artifact.
3. Restore that pre-activation database backup as one unit.
4. Verify the prior migration status and legacy destinations before reopening
   traffic.

Partial rollback of taxonomy rows, Product mappings, or routes is prohibited.
Because the reviewed repository contained demonstration fixtures only, local
rollback can additionally be validated through a database reset at the prior
artifact revision; production rollback must use the coordinated backup.

## Evidence

- Prisma schema and client generation pass.
- Unit/component suite: 21 files, 99 tests pass.
- PostgreSQL lifecycle/performance validation: p95 29.81 ms <= 50 ms with
  10,000 Products, 1,000 queries, and concurrency 20.
- Taxonomy PostgreSQL validation covers version uniqueness, 7/16/30 counts,
  ordering, seven existing Category media assets, retired fixtures, publication
  invariant, and zero public orphans.
