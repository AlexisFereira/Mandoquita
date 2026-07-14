# Admin Catalog Management V2 — QA Review

Status: Approved

Owner: QA Engineer

Date: 2026-07-13

## Decision

ACM-031 through ACM-035 are approved. Named-account security, fixed roles,
Product and Category lifecycle invariants, semantic tables, responsive and
accessibility behavior, migration state, real PostgreSQL integrations and public
regression pass with no remaining QA blocker.

QA found and corrected two release defects: the Frontend expected the invalid
role literal `SUPERADMIN` instead of the persisted/API enum `SUPER_ADMIN`, and
the Product pagination exceeded a 320 px viewport by one pixel. Regression tests
and the production-build browser matrix now protect both outcomes.

Production managed-edge activation, Superadministrator bootstrap credentials and
Deployment rollback execution remain external gates under ACM-037. Canonical
documentation synchronization is complete under ACM-036.

## ACM-031 — Account, authorization and session security

- Username normalization, Unicode handling, 12–128 character policy, blocklist,
  account-context rejection and Argon2id `m=19456,t=2,p=1` pass.
- Unknown, invalid, disabled and throttled access uses generic outcomes; no
  self-service recovery or account discovery is exposed.
- Opaque signed `HttpOnly`, `SameSite=Strict` and production `Secure` cookies,
  idle/absolute expiry, credential-version revocation, CSRF, Origin and
  managed-edge fail-closed behavior pass.
- Fixed `ADMIN`/`SUPER_ADMIN` authorization, mandatory temporary-password
  restriction and Superadministrator self-protection pass at Backend and
  rendered-Frontend levels. Administrators receive no account-management DOM.
- Account create/reset/deactivate/reactivate contracts require fresh
  authorization, revoke target sessions and retain safe audit attribution.
- Browser bundle scan contains no password hash, credential version, session
  hash, bootstrap credential, pepper, session/edge secret or AWS secret field;
  Admin code has no browser-storage persistence.

Result: approved. Deployment must still attest the real edge, independent
secrets and one-time bootstrap/emergency procedure.

## ACM-032 — Product aggregate and lifecycle

Unit and real PostgreSQL integration prove atomic Product plus exactly one Base
Variant/SKU creation, safe non-public defaults, strict editing, optimistic
concurrency, immutable historical slug alias, reversible retirement and safe
inactive/unapproved/unpublished restoration. Retirement preserves Variants and
media while removing public/commercial/Featured eligibility.

Result: approved.

## ACM-033 — Category aggregate and taxonomy continuity

Validation proves append-only creation in the single active taxonomy, safe
inactive/invisible defaults, strict edit/order behavior, immutable historical
slug alias, dependency counts, rejection without cascade and safe restoration.
Taxonomy/public regression passes with 7 Categories, 16 Subcategories, 30
Product Types and zero Published orphans. Local and managed S3/CDN Category
media references are both validated without weakening metadata requirements.

Result: approved.

## ACM-034 — Accessibility and responsive browser validation

- Chrome validates named access, Product, Category and account workspaces at
  320, 768 and 1440 px plus explicit 200% zoom.
- Each collection has exactly one native table with caption, scoped column and
  row headers and row-bound named actions. No Cards or duplicate responsive DOM
  are present.
- Wide tables remain inside labelled, described, keyboard-focusable overflow
  regions; the page itself has no horizontal overflow after the pagination fix.
- Chrome's accessibility tree exposes the Product caption and row action names.
  The protected Superadministrator has readable role/state and no self-action.
- Visible targets measure at least 46 px. Forced dark preference remains
  deterministic light-only, and reduced-motion media emulation preserves use.
- Password inputs retain labels, appropriate autocomplete, hidden initial value,
  explicit show/hide controls and no self-service recovery wording.

Result: approved with the Accessibility design review.

## ACM-035 — Integration, migration, build and regression

- `npm test`: 36 files, 198 tests passed.
- `npx tsc --noEmit`: passed.
- Isolated production build: passed; `/admin` is 14.8 kB and all account,
  Product, Category, lifecycle and media API route families are emitted.
- `npx prisma migrate status`: 14 migrations; database schema is up to date.
- Admin Catalog V2 PostgreSQL integration: Product/Category/account invariants
  and aliases pass; Product-list p95 620.96 ms <= 750 ms.
- Product Admin PostgreSQL regression: 500 concurrency-10 list reads, p95
  625.31 ms <= 750 ms; session/invariants/concurrency pass.
- Catalog Media PostgreSQL/S3 regression: five immutable objects uploaded and
  cleaned; Product/Category invariants pass; p95 342.58 ms.
- Taxonomy, Product Content/Variants and 47-Product publication regressions pass,
  including 16 deterministic Featured Products and protected public contracts.
- Migration 013 is additive and current. The documented rollback disables Admin
  first, revokes V2 sessions and preserves schema/catalog/audit data; no
  destructive rollback was executed against the configured shared database.

The legacy publication/taxonomy validators were updated to recognize fully
validated managed S3/CDN media as well as local seed assets. They still require
HTTPS, matching object key, meaningful alternative text, dimensions, size,
content type and checksum for managed objects.

Result: approved.
