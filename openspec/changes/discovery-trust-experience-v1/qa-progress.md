# Discovery and Trust Experience V1 — QA Progress

Status: Approved — Released

Owner: QA Engineer

Date: 2026-07-13

## Approved scope

### DTE-023 — Public Search

PostgreSQL integration validates all six approved public fields, surrounding
whitespace and case handling, canonical publication/Variant/taxonomy eligibility,
protected price behavior, deterministic ordering, nearest-page recovery, empty
results, invalid-query rejection before database access and exclusion of SKU,
reference and barcode. All six Search indexes are installed.

Performance result: 10,000 Products, 1,000 queries, concurrency 20, p95 131.51 ms
against the corrected 150 ms release threshold.

Result: approved.

### DTE-024 / ICON-006 — Governed Icons

Independent QA confirms the closed semantic registry, decorative hidden mode,
informative labelled mode, empty-label rejection, no duplicated control name,
unfocusable SVG behavior, governed sizes, `currentColor` inheritance and reflow-safe
wrapper composition. Accessibility approval is recorded separately in the Platform
artifact.

Result: approved.

### DTE-025 — Payment Information

The Homepage renders exactly `Binance`, `Pago móvil`, and `Dólares en efectivo` in
approved order with the approved heading and explanatory copy. The section is a
semantic static list, contains no selection/payment controls, precedes Contact,
uses decorative Icons, provides the labelled external WhatsApp continuation when
configured, and remains complete without an available contact URL. Responsive
single-column and wrapping contracts are encoded in the reviewed component and
shared layout classes.

Result: approved.

## Verification

- Intermediate Icon gate: 24 files, 136 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run test:integration:search`: passed at p95 131.51 ms <= 150 ms.

## DTE-026 / MOTION-006 — Scroll-entry Motion

Browser validation at 320, 768 and 1440 CSS pixels confirms:

- content is server-rendered visible and remains visible with JavaScript disabled;
- eligible nodes reveal once and the same node does not replay after scrolling away/back;
- reduced motion resolves every node immediately with opacity 1, no transform,
  effectively zero transition and `will-change: auto`;
- layout geometry is unchanged, CLS is 0 and horizontal overflow is absent;
- observed nodes remain below the 50-element guard;
- navigation measured 139–298 ms and pointer interaction remains enabled.

Component tests additionally cover unsupported observation, observer failure,
cleanup, focus, hash targeting, live preference changes and shared observation.

Result: approved.

## DTE-027 — Final regression

- `npm test`: 26 files, 148 tests passed in the final release verification.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed, including `/buscar` and all existing public routes.
- Search integration: p95 106.91 ms <= 150 ms in the final matrix.
- Taxonomy: 7 Categories, 16 Subcategories, 30 Product Types, 7 Category images,
  zero Published orphans.
- Product content/Variants and 73-Product publication seed validations pass.
- Lifecycle performance was stabilized with explicit PostgreSQL planner statistics
  after its temporary 10,000-row dataset; three consecutive p95 results were
  47.01, 41.63 and 38.86 ms <= 50 ms.

Result: approved.

## Final decision

DTE QA is approved with no remaining QA blocker. Documentation synchronization
and final cross-discipline Release approval remain owned by DTE-028 and DTE-029.
