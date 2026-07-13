# Product Admin V1 — Architecture and Security Review

Status: Architecture, Backend Contract and Product Requirements Approved

Owner: Project Architect / Security Architecture

Date: 2026-07-13

## Decision

Product Admin V1 is approved as an isolated, single-maintainer administration
Feature. It is not a reusable identity Platform and does not create public
accounts, roles, permissions, registration, recovery, or multi-user attribution.

The six-digit code is accepted only as the V1 access credential. Its low entropy
is compensated by slow server-side verification, persistent throttling, short
revocable sessions, fail-closed configuration, same-origin request protection and
audit evidence. It is not sufficient as the only control on an unrestricted
Internet-facing management endpoint; production must also enforce the approved
edge-access boundary below. The code is never the browser's ongoing authorization
token.

This approval completes `ADM-002` and `ADM-003`. Backend subsequently approved
the executable API contract in `backend-contract-review.md`, completing `ADM-005`.
Product Requirements subsequently approved the business field/scope contract
under `ADM-001`, recorded the credential decision and confirmed the Image
exclusion under `ADM-004` in `requirements.md` and `requirements-review.md`.

## Credential and Rotation Boundary

- Exactly one six-digit numeric code exists in V1. It identifies an authorized
  maintainer class, not a named person; individual attribution is explicitly
  unavailable in this version.
- Production stores only a salted slow hash in `PRODUCT_ADMIN_CODE_HASH`. Raw
  code, reversible encryption, `NEXT_PUBLIC_*` configuration and committed
  defaults are prohibited.
- The Deployment Operator generates the code with a cryptographically secure
  random source and rejects common, repeated or sequential values. The Business
  Representative authorizes activation/rotation. Project Architecture owns the
  policy; application code never exposes a rotation endpoint.
- Rotation invalidates every active administrative session. Recovery is rotation
  through the deployment secret process, never email, security questions, a
  public reset flow or fallback to `PRODUCT_WRITE_API_KEY`.
- `PRODUCT_ADMIN_SESSION_SECRET` is a separate random server secret of at least
  32 bytes. It may not equal the access code, its hash, or
  `PRODUCT_WRITE_API_KEY`.

## Session Contract

- Successful verification issues a cryptographically random opaque session token
  with a server-side hashed record. The cookie is signed/tamper-evident but the
  server record remains authoritative for revocation.
- Production cookie: `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, no
  `Domain`, and a `__Host-` name. A documented local-development cookie exception
  is allowed only outside production and cannot weaken production configuration.
- Idle lifetime: 30 minutes. Absolute lifetime: 8 hours. Authorized activity may
  extend the idle deadline but never the absolute deadline.
- Explicit `Salir`, access-code rotation, expiry, missing secrets, invalid
  signature, missing/revoked record or failed server storage invalidates access.
- Session identifiers, access codes and signing secrets never enter URLs,
  local/session storage, client logs, analytics, HTML or API response bodies.

## Production Deployment Boundary

- `/admin` and `/api/admin/*` must be protected before the application by one
  approved managed-access proxy, VPN/private network, or explicit operator-network
  allowlist. Absence or failure of that control denies administration.
- Merely omitting links, adding `noindex`, using an obscure path, checking the
  six-digit code or trusting client JavaScript does not satisfy this boundary.
- TLS is mandatory end to end through the trusted application edge. Proxy identity
  and source-network headers are trusted only from configured proxy hops.
- If the deployment cannot guarantee the edge boundary, release is blocked until
  a separately approved stronger authentication design (preferably MFA-capable)
  replaces the six-digit-only access contract.

## Throttling and Recovery

- Access attempts are persisted in PostgreSQL or an equivalently shared store;
  process memory alone is not an approved production boundary.
- Per normalized client-network key: at most 5 failed attempts in 15 minutes,
  followed by a 15-minute lockout.
- Deployment-wide protection: at most 50 failed attempts in 15 minutes, followed
  by a 30-minute access-gate lockout. Existing valid sessions continue unless a
  separate security event requires revocation.
- Successful access clears the client's failure counter. Responses remain generic;
  HTTP 429 may include `Retry-After` but cannot reveal code/configuration state.
- Trusted-proxy handling must be explicitly configured. Untrusted forwarded IP
  headers cannot choose the throttle key.

## Same-origin and Audit Requirements

- Every state-changing session/admin request validates the exact production
  `Origin`/`Host` boundary and a session-bound CSRF token or equivalent approved
  same-origin proof in addition to `SameSite=Strict`.
- Audit records include timestamp, request/correlation ID, outcome, throttling or
  revocation reason, session ID hash, Product ID, expected/current version and
  changed field names. They exclude code, cookie/token, secrets and before/after
  field values.
- Failed and successful access, logout, expiry, rotation revocation, unauthorized
  requests, validation/conflict outcomes and successful Product updates are
  auditable. Minimum retention is 90 days unless a stricter deployment policy is
  approved.

## Approved API Boundary

All routes are same-origin, server-only authorized and return `Cache-Control:
no-store` plus admin-appropriate security and indexing headers.

| Method and route | Purpose | Public boundary |
| --- | --- | --- |
| `POST /api/admin/session` | Validate code and issue session | Generic 401/429/503 outcomes; never returns code/token secrets. |
| `GET /api/admin/session` | Resolve current session | Returns only authorized/expiry state required by the UI. |
| `DELETE /api/admin/session` | Revoke current session | Idempotently clears cookie and server record. |
| `GET /api/admin/products` | Authorized list/search/filter/page | Admin summary allowlist only; no Variant internals, SKU, barcode, reference, Image internals or operational fields. |
| `GET /api/admin/products/[id]` | Load approved editor representation | Exact editable fields, taxonomy context and `updatedAt`. |
| `PATCH /api/admin/products/[id]` | Strict partial update | Requires `expectedUpdatedAt`; preserves all Product invariants. |
| `GET /api/admin/product-types` | Approved active taxonomy options | Product Type plus inherited Subcategory/Category context only. |

The browser never sends `x-admin-api-key`. Product Admin routes authorize the
server session and call the governed domain service directly; they do not proxy a
client-provided `PRODUCT_WRITE_API_KEY`. Any future machine-to-machine write
contract must use a separate internal route and review.

Image upload and Product Image association are excluded. The existing operator
upload endpoint cannot appear in the V1 UI and does not become session-authorized
Product Image editing by implication.

## Editable-field Architecture Boundary

Subject to Product Requirements approval, the existing strict Product update
allowlist is the maximum V1 boundary: `slug`, `name`, `description`,
`shortDescription`, `brand`, `collection`, `genderApplicability`, `seoTitle`,
`seoDescription`, Product-level `price`/`currency`, `active`,
`editorialApproved`, `published`, `commerciallyAvailable`, `featured`,
`featuredOrder`, and `productTypeId`.

`expectedUpdatedAt` is concurrency input, not an editable Product field. Product
ID and `updatedAt` are read-only. Variants, Variant Attributes, Images, tags,
taxonomy structure, inventory, costs, suppliers, warehouses, logistics, orders,
payments and all unknown fields remain rejected.

## Release Conditions

- Product Requirements approval is complete in `proposal.md`, `requirements.md`
  and `requirements-review.md`.
- Backend approves and implements the API/session contract, persistence,
  invariants, audit and deployment evidence before Frontend integration.
- Design System confirms whether existing form/list primitives compose the admin;
  no Platform capability is assumed in advance.
- Security, Accessibility and QA independently validate every release gate.
- Deployment evidence proves the managed edge-access boundary; otherwise the
  six-digit credential architecture is not releasable.

## Security Basis

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): generic authentication failures and login throttling.
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html): strong protection for Internet-accessible management endpoints.
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html): rate limiting plus inactivity and overall session timeouts.
- [MDN secure cookie guidance](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies): host-only `Secure`, `HttpOnly`, `SameSite` cookie restrictions.

Backend `ADM-013` through `ADM-021` and final UX/UI Design are unblocked by the
approved Requirements and Architecture contracts. Frontend remains sequenced
after its corresponding UI and Backend contracts.
