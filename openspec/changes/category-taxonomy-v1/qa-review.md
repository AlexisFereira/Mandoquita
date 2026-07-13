# Category Taxonomy V1 — QA Review

Status: Approved

Owner: QA Engineer

Date: 2026-07-12

## Decision

CT-021 through CT-024 are approved. The persisted hierarchy matches
`taxonomy.md`, public discovery excludes invalid branches, and the affected
catalog experiences pass regression validation.

This approval covers QA only. Cross-discipline synchronization and the final
release approval record remain owned by CT-025 and CT-026.

## Evidence

### CT-021 — Canonical hierarchy

`npm run test:integration:taxonomy` validates the active PostgreSQL taxonomy
against the complete canonical hierarchy rather than counts alone:

- exactly 7 Categories, 16 Subcategories, and 30 Product Types;
- exact Category and Subcategory identifiers and slugs;
- exact Product Type names, parent ownership, and source sequence;
- Category business order 1 through 7 and Active state;
- no Category or Subcategory identifier or slug collision.

Result: pass.

### CT-022 — Product classification

The same PostgreSQL validation confirms zero published Products without an
approved Product Type. It also verifies that the ten demonstration fixtures
listed for retirement are absent and that the database rejects an attempted
published Product without a leaf classification.

Result: pass, zero publicly discoverable orphan Products.

### CT-023 — Discovery and recovery

Automated service and page coverage validates:

- Category and Subcategory filters remain inside the selected hierarchy branch;
- discovery queries require an Active taxonomy version, Active Category,
  Visible Category, Active Subcategory, Active Product Type, and a published
  Product;
- empty and inactive branches are omitted instead of fabricated;
- invalid or unavailable Category and Subcategory identifiers resolve to the
  approved `/categorias` recovery experience;
- eligible collections preserve deterministic Backend order and official
  Spanish labels.

Result: pass.

### CT-024 — Regression

- `npm test`: 23 files, 108 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed, including `/`, `/categorias`, Category,
  Subcategory, Product Detail, and API routes.
- Homepage featured Products and Categories share the active published
  classification constraints used by Catalog.
- Product Detail preserves inherited Category, Subcategory, Product Type, and
  related-Product behavior.
- Existing discovery-only and light-only automated contracts remain green.

Result: pass.

## QA Release Assessment

- No publicly discoverable Product is orphaned: pass.
- No taxonomy identifier or slug collision exists: pass.
- Legacy Category continuity and retired-Product outcomes are implemented and
  regression-covered: pass.
- Homepage and Catalog use consistent Category eligibility: pass.
- Discovery-only and light-only contracts remain intact: pass.
- Global documentation/specification synchronization: passed under CT-025.
- Final cross-discipline and Release approvals: recorded under CT-026 and
  `release-approval.md`.
