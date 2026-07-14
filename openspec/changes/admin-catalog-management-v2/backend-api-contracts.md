# Admin Catalog Management V2 — Backend API Contracts

Status: Implemented and activated in configured PostgreSQL

Date: 2026-07-13

All routes retain the released managed-edge check, opaque `HttpOnly` session,
same-origin validation, CSRF header on mutations and `no-store` response policy.
Unknown request properties are rejected. Passwords, hashes, cookie values and
CSRF values are never included in account or audit projections.

## Session and account contracts

- `POST /api/admin/session`: `{ username, password }`. Returns the named safe
  session projection with `account: { id, username, role, mustChangePassword }`.
  Unknown, disabled, invalid and locked accounts share a generic response.
- `GET /api/admin/session`: returns the current safe session. This is one of the
  two operations available while `mustChangePassword=true`.
- `PATCH /api/admin/session`: `{ currentPassword, newPassword }`. Replaces a
  temporary/permanent password, increments `credentialVersion`, revokes all old
  sessions and issues one replacement session.
- Passwords accept 12–128 Unicode characters after NFC normalization and remain
  subject to common, compromised, service-specific and username-specific
  blocklists. A correct credential clears account/client failure state; only a
  deployment-wide protection event can temporarily reject all credentials.
- `DELETE /api/admin/session`: CSRF-protected logout; also permitted to a
  temporary-password session.
- `GET /api/admin/accounts`: Superadministrator-only safe account collection.
- `POST /api/admin/accounts`: Superadministrator-only
  `{ username, temporaryPassword, currentPassword }`; `currentPassword` provides
  fresh authorization and the new credential is never echoed.
- `PATCH /api/admin/accounts/:id`: Superadministrator-only
  `{ action, expectedUpdatedAt, currentPassword, temporaryPassword? }`, where
  `action` is `reset`, `deactivate` or `reactivate`. Reset/reactivate require a
  new temporary password. Every action increments the target credential version
  and revokes its sessions. The protected Superadministrator is never a valid
  target.

## Product contracts

- `GET /api/admin/products`: paged `page`/`limit`, `q`, state, taxonomy and
  explicit `retired` filters. Retired Products are excluded by default.
- `POST /api/admin/products`: `{ name, slug, price, currency, baseSku,
  productTypeId? }`. In one transaction it creates the generated Product ID and
  exactly one attribute-free Base Variant with the explicit globally unique SKU.
  Every public/editorial/commercial/featured state starts false.
- `GET /api/admin/products/:id`: complete editable projection, Base Variant
  identity/SKU, lifecycle and concurrency timestamp.
- `PATCH /api/admin/products/:id`: released strict scalar/content/taxonomy
  allowlist plus mandatory `expectedUpdatedAt`. Slug changes reserve the old slug
  as an immutable alias in the same transaction.
- `POST /api/admin/products/:id/retire`: `{ expectedUpdatedAt }`; atomically sets
  `active`, `published`, `commerciallyAvailable`, `featured` false, clears
  `featuredOrder` and records retirement attribution.
- `POST /api/admin/products/:id/restore`: `{ expectedUpdatedAt }`; clears
  retirement and returns the Product as inactive, unapproved, unpublished,
  commercially unavailable and non-featured.

## Category contracts

- `GET /api/admin/categories`: paged `page`/`limit`, `q` and explicit `retired`
  filter. Items include order, lifecycle, Image context, concurrency timestamp
  and exact Subcategory/Product-Type/Product dependency counts.
- `POST /api/admin/categories`: `{ name, slug, description? }`; appends one
  generated-ID Category to the single active taxonomy as inactive/invisible.
- `GET /api/admin/categories/:id`: editable, media, dependency and concurrency
  projection.
- `PATCH /api/admin/categories/:id`: strict `{ expectedUpdatedAt, name?, slug?,
  description?, sortOrder?, active?, visible? }`. Reordering uses a collision-safe
  whole-sibling transaction. A slug change atomically reserves the old slug.
- `POST /api/admin/categories/:id/retire`: `{ expectedUpdatedAt }`; rejected with
  all three dependency counts when any count is nonzero. No cascade exists.
- `POST /api/admin/categories/:id/restore`: `{ expectedUpdatedAt }`; restores as
  inactive/invisible.
- Released Product/Category Image routes remain the only media ownership and
  upload boundary and now attribute successful mutations to the named account.

Historical Product and Category URLs issue permanent redirects only when the
current canonical resource remains publicly eligible. Retirement/unavailability
continues to return the released unavailable behavior.

## Governed outcomes

- `400`: strict validation or password-policy rejection.
- `401`: generic authentication/fresh-authorization failure.
- `403`: role, temporary-password restriction, origin or CSRF denial.
- `404`: missing aggregate without account enumeration.
- `409`: stale baseline, duplicate/reserved identity/SKU/order, invalid state or
  protected dependencies. Dependency rejection includes safe counts.
- `429`: persistent account/client/deployment throttle with `Retry-After`.
- `503`: fail-closed security/configuration/audit store failure.
