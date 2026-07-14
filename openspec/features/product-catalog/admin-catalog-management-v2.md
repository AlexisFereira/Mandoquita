# Admin Catalog Management V2 — Canonical Feature Contract

Status: Release Candidate Approved — Production Activation Pending

Owner: Product Catalog / Project Architecture

Last synchronized: 2026-07-14

## Capability

The isolated `/admin` supports accountable catalog maintenance through exactly
one protected Superadministrator and multiple fixed-role Administrators. This is
an operational capability; it does not add public/customer authentication.

The former shared six-digit credential and its sessions are not accepted.
Production access requires managed-edge proof in addition to named
username/password authentication, an opaque server-side session, exact Origin
and session-bound CSRF protection.

## Account Governance

- Deployment bootstraps the single Superadministrator and owns emergency reset.
- Superadministrator can list, create, reset, deactivate and reactivate
  Administrators and cannot target itself or create another Superadministrator.
- Administrators cannot access account-management data or commands.
- Temporary credentials require replacement before catalog work.
- Reset/deactivation/reactivation increments credential version and revokes every
  target session. There is no self-service recovery.
- Passwords are Argon2id hashes; credentials/secrets never enter projections,
  browser storage or audit payloads.

## Product Administration

- Product collection is a paged, searchable/filterable semantic table, never
  Product Card rows.
- Creation atomically produces a safe non-public Product and exactly one explicit
  Base SKU/Variant.
- Strict update preserves Product/Variant/public eligibility invariants and uses
  optimistic concurrency.
- Delete means reversible retirement: public, commercial and Featured outcomes
  are removed atomically while Product, Variants, Images and audit remain.
- Restore returns an inactive, unapproved, unpublished, commercially unavailable
  and non-featured Product.
- Old and retired slugs remain reserved; an old URL redirects permanently only
  while its canonical Product is publicly eligible.

## Category Administration

- Creation appends an inactive/invisible Category to the active taxonomy.
- Update supports approved identity/content/order/state fields with optimistic
  concurrency and collision-safe sibling ordering.
- Retirement is rejected while Subcategory, Product Type or Product dependencies
  exist and never cascades.
- Restore retains inactive/invisible state. Historical slugs remain reserved and
  obey current public eligibility.

## Media Boundary

Product and Category media actions reuse Catalog Media Admin V1. Admin Catalog
Management V2 does not introduce another upload, storage or Image ownership
model.

## Active Evidence

- Requirements and decisions:
  `../../changes/admin-catalog-management-v2/requirements.md` and
  `../../changes/admin-catalog-management-v2/architecture-review.md`.
- Executable API contract:
  `../../changes/admin-catalog-management-v2/backend-api-contracts.md`.
- Backend/Frontend evidence:
  `backend-implementation.md` and `frontend-implementation.md` in the change.
- Independent QA/accessibility evidence:
  `../../changes/admin-catalog-management-v2/qa-review.md`.
- Production procedure:
  `../../changes/admin-catalog-management-v2/deployment-runbook.md`.

## Exclusions

Public accounts, configurable roles, multiple Superadministrators, self-service
recovery, Variant matrices, bulk mutation, taxonomy-version management, physical
purge, cart, checkout, payment and orders remain outside V2.
