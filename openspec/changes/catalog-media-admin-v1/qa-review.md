# Catalog Media Admin V1 — QA Review

Status: Approved

Owner: QA Engineer

Date: 2026-07-13

## Decision

CMA-035 through CMA-040 are approved. Security, Product and Category aggregate
integrity, production-equivalent PostgreSQL/S3 behavior, accessibility,
responsive presentation and public regression pass with no QA blocker.

The actual production managed-edge configuration remains an external Deployment
and Release prerequisite. Documentation synchronization and final
cross-discipline approval remain owned by CMA-041 and CMA-042.

## CMA-035 — Authorization, validation and secrets

- Every media route reuses the opaque server session, exact Origin/Host, CSRF,
  no-cache, managed-edge proof and persistent throttling boundaries.
- Missing production secrets, edge proof or storage configuration fails closed.
- File bytes are decoded and re-encoded; signature/type mismatch, unsupported
  content, configured size/dimension limits and unsafe object deletion fail.
- Browser responses use explicit allowlists and expose preview URLs rather than
  object keys, reusable storage authorization, credentials or audit internals.
- The production browser bundle contains none of the administrative/storage
  secret identifiers, bucket configuration or object-key response fields.

Result: approved. Deployment must still attest the actual production edge and IAM.

## CMA-036 — Product Image integrity

The real PostgreSQL/S3 validator proves Product ownership, idempotent association,
complete collision-safe ordering, contiguous positions, at-most-one explicit
Primary, no implicit Primary promotion, optimistic concurrency, stable Image ID
on replacement, Variant-reference removal denial and safe unreferenced removal.
Temporary and retained objects are cleaned without leaving catalog residue.

Result: approved.

## CMA-037 — Category Image integrity

Real integration covers add, stable replacement, alternative-text metadata update
and optional removal. Category identity, slug, Active and Visible remain unchanged;
Taxonomy validation passes with 7 Categories, 16 Subcategories, 30 Product Types,
7 discoverable Category images and zero Published orphans. Product and Category
media remain separate contexts and namespaces.

Result: approved.

## CMA-038 — Accessibility and responsive browser validation

- Native file, button, radio, progress, list/ordered-list and heading semantics
  expose text names, contextual descriptions and polite/error status behavior.
- Keyboard-only move controls expose direction and boundary state; automated UI
  interaction confirms complete reorder and announced unsaved/saved outcomes.
- Validation and mutation outcomes return focus to the programmatically focusable
  summary; session expiry removes stale authorized content and returns to the gate.
- A production-build Chrome run at 320, 768 and 1440 px validates Product gallery
  and Category editor context, browser accessibility-tree names, meaningful image
  alternatives, ordered positions, Primary/Variant-reference state, named
  destructive actions and no horizontal overflow. An explicit 200% zoom pass is
  included separately from the 320 px reflow check.
- All visible interactive targets measure at least 44 px. Forced dark OS preference
  still renders the deterministic light-only theme.

Result: approved with the Accessibility implementation review.

## CMA-039 — Storage, lifecycle and performance

`npm run test:integration:catalog-media` passed against the configured AWS
PostgreSQL and S3 environment. It uploaded and cleaned five immutable objects in
separate Product/Category namespaces; verified normalized dimensions, checksums,
unique keys, idempotency, replacement retention, orphan/deletion cleanup and the
documented non-destructive rollback model. Versioned immutable preview URLs avoid
stale replacement identity. Concurrency-10 Product media reads measured p95
325.42 ms, below the 750 ms remote threshold, and post-run residue was zero.

Result: approved. Production CDN/IAM scheduling remains Deployment evidence.

## CMA-040 — Regression matrix

- `npm test`: 34 files, 193 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed with isolated `/admin` and all media Admin route families.
- Product Admin integration: session/invariants/concurrency passed; 500 list
  queries at concurrency 10 measured p95 528.25 ms <= 750 ms.
- Taxonomy and Product Content/Variants integrations passed.
- Product publication passed with 47 exact Published Products, leaves, Base
  Variants/SKUs, 16 deterministic Featured Products and protected public contract.
- Homepage, Catalog, Search, Categories, Product Detail, Variants, Featured,
  scalar Product Admin and discovery eligibility remain covered by the green
  functional suite and the integrations above.

The Product publication validator was rerun serially: its first concurrent run
temporarily observed the Product Admin validator's disposable published fixture
(48 instead of 47). Product Admin removed that fixture as designed, a read-only
residue check found none, and the isolated publication run passed with 47.

Result: approved.
