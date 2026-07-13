# Product Content and Variants V1 — QA Review

Status: Approved

Owner: QA Engineer

Date: 2026-07-12

## Decision

PCV-024 through PCV-027 are approved. PostgreSQL aggregate constraints, public
contracts, cross-feature presentation, accessibility composition, regression,
performance, TypeScript and the production build pass with no QA blocker.

This approval covers QA. Documentation-wide synchronization and final Release
approval remain owned by PCV-028 and PCV-029.

## PCV-024 — Variants and migration

`npm run test:integration:product-content` confirms:

- every Published Product owns a Variant and the approved migration inventory is empty;
- SKU is globally unique and rejects empty values;
- Variant ownership and stable identity are database-enforced;
- the approved attribute vocabulary and typed values are enforced;
- empty values and duplicate attribute concepts are rejected;
- a Base Variant never becomes a fabricated visitor option;
- inactive Variant state remains independent from Product publication and
  Commercial Availability.

Result: pass.

## PCV-025 — Product Images

PostgreSQL and public-contract validation confirms:

- Image ownership remains with one Product;
- Variant-to-Image association rejects cross-Product references;
- gallery order is ascending and deterministic;
- duplicate positions and a second Primary Image are rejected;
- URL and alternative text cannot be empty;
- Primary Image drives compatibility media;
- Products without Images remain valid and expose stable missing-media behavior.

Result: pass.

## PCV-026 — Content, taxonomy, states and price

- Short/complete descriptions, brand, collection, controlled gender
  applicability, normalized tags and SEO content preserve their independent roles.
- Non-normalized duplicate tags are rejected.
- Taxonomy regression passes with 7 Categories, 16 Subcategories, 30 Product
  Types and zero Published taxonomy orphans.
- Product Type remains the sole classification leaf.
- Commercially unavailable Products expose null price and currency.
- SKU, barcode, reference, inventory, warehouse, supplier and cost do not appear
  in the public detail contract.

Result: pass.

## PCV-027 — Cross-feature quality

- `npm test`: 23 files, 119 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed for Homepage, Catalog, Category/Subcategory, Product
  Detail and API routes.
- Product lifecycle benchmark: 10,000 Products, 1,000 detail queries,
  concurrency 20, p95 42.90 ms <= 50 ms in final release validation.
- Gallery/option accessibility and responsive contracts are covered by the
  released PGOC reviews and automated component integration tests: labelled
  groups, keyboard-native controls, visible state, polite status, long labels,
  missing/failed media, 44px targets and reduced motion.
- Shared ProductCard and Product Detail tests cover Homepage, Catalog, Search,
  Category, Featured and Related Product contract compatibility.
- Light-only Design System regression tests remain green.

Result: pass.

## QA Release Assessment

- Every migrated Product has an approved Variant: pass (approved inventory empty;
  Published-Product constraint active).
- Every SKU is globally unique: pass.
- Variant and Image ownership: pass.
- Primary Image uniqueness: pass.
- Taxonomy and independent Product states: pass.
- Deferred operational fields remain private: pass.
- Documentation-wide synchronization: passed under PCV-028.
- Final cross-discipline and Release approvals: recorded under PCV-029 and
  `release-approval.md`.
