# Product Admin V1 — QA Review

Status: Approved

Owner: QA Engineer

Date: 2026-07-13

## Decision

ADM-033 through ADM-038 are approved. Security behavior, administrative Product
contracts, every editable scalar field, concurrency/invariants, accessibility,
responsive isolation and public regression pass with no QA blocker.

The production managed-edge deployment control remains an external Release
prerequisite. Documentation synchronization and final cross-discipline approval
remain owned by ADM-039 and ADM-040.

## ADM-033 — Authorization and security

- Only the exact six-digit code passes the slow salted-hash check.
- Production configuration fails closed when secrets or the managed-edge proof
  configuration are absent.
- Session cookies are opaque, signed, `HttpOnly`, `SameSite=Strict`, and `Secure`
  in production; the credential is absent from cookies and URLs.
- Idle expiry revokes the persisted session; logout sends CSRF and returns to the gate.
- Persistent five-attempt client throttling and deployment throttling pass.
- Unauthorized, expired and missing-configuration outcomes expose no internals.
- Client bundle scan contains none of `PRODUCT_ADMIN_CODE_HASH`,
  `PRODUCT_ADMIN_SESSION_SECRET`, `PRODUCT_ADMIN_EDGE_SECRET`, or
  `PRODUCT_WRITE_API_KEY`; Admin code has no browser-storage use.

Result: approved. The actual production edge/VPN/proxy configuration must still
be attested by Deployment/Release owners.

## ADM-034 — Administrative collection

Tests validate name/slug-only Search, all approved combinable filters,
deterministic `name ASC, id ASC` ordering, pagination and nearest-page recovery,
empty/no-match/error/expiry outcomes and exact administrative summary mapping.
SKU, barcode, reference, Images, tags, inventory, supplier, cost and operational
fields are excluded.

Result: approved.

## ADM-035 — Product editing

The allowlist test submits and verifies every approved scalar field: slug, name,
short/complete descriptions, brand, collection, gender applicability, SEO title
and description, price, currency, Active, Editorial Approval, Publication,
Commercial Availability, Featured, Featured order and Product Type. Tests also
cover trimming/normalization, nullable content, invalid formats, strict rejection
of relational/internal fields, optimistic conflict, server-confirmed persistence,
publication prerequisites, Variant readiness, taxonomy and Featured invariants,
and preservation of stored price when Commercial Availability is disabled.

Result: approved.

## ADM-036 — Accessibility and responsive presentation

- Forms expose labels, field descriptions, `aria-invalid`, associated errors,
  error summary, status messages and predictable recovery focus.
- Native controls, keyboard flows, logout, conflict recovery and session expiry pass.
- Browser validation at 320, 768 and 1440 px confirms no horizontal overflow,
  light-only rendering under dark OS preference, visible input focus and 48–51 px
  gate targets.
- `/admin` remains isolated from the public Header/Footer/navigation.

Result: approved with the existing Accessibility design review.

## ADM-037 — Isolation and public regression

`/admin` has `noindex,nofollow,noarchive`, no public shell and no public navigation
link. Homepage, Catalog, Search, Category/Subcategory, Product Detail, Variants,
Featured, Taxonomy and Product publication functional regressions pass.

Result: approved.

## ADM-038 — Final QA matrix

- `npm test`: 32 files, 184 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed with isolated `/admin` and four protected Admin APIs.
- `npm run test:integration:product-admin`: passed against PostgreSQL; session,
  updates, conflicts and invariants pass; 500 list queries at concurrency 10,
  remote p95 646.59 ms <= 750 ms.
- Taxonomy: 7/16/30 hierarchy, 7 Category images and zero Published orphans.
- Product Content/Variants integration: passed.
- Product publication regression: 47 Published Products, exact leaves/Base
  Variants/SKUs, 16 deterministic Featured Products, public protection passed.
- Browser Admin navigation: 119–239 ms across representative viewports.

The co-located Search performance gate was not reinterpreted against the current
remote-database RTT; Search functional regression remains green and its existing
DTE performance approval remains unchanged.

Result: approved.
