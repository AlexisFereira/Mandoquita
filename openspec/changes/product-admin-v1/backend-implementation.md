# Product Admin V1 — Backend Implementation

Status: Implemented and PostgreSQL Validated

Owner: Backend Architect

Date: 2026-07-13

## Implemented scope

- `POST/GET/DELETE /api/admin/session` validates the approved six-digit code,
  issues/resolves/revokes a signed opaque server session and never returns the
  credential or session token.
- `GET /api/admin/products` lists all Product states with name/slug search,
  combinable approved filters, finite pagination and `name ASC, id ASC` order.
- `GET /api/admin/products/[id]` returns the closed editor baseline, inherited
  taxonomy, Variant-readiness boolean and `updatedAt` without related internals.
- `PATCH /api/admin/products/[id]` requires `expectedUpdatedAt`, exact Origin,
  session-bound CSRF and the closed scalar allowlist. Product mutation and success
  audit share one transaction.
- `GET /api/admin/product-types` exposes only active eligible taxonomy leaves and
  inherited context.
- S3 operator upload moved to `POST /api/internal/images`; it remains excluded
  from Product Admin V1 and retains its separate server API key.

## Security implementation

- The code uses salted scrypt (`N=16384`, `r=8`, `p=1`, 64-byte result). Only
  `PRODUCT_ADMIN_CODE_HASH` is accepted at runtime.
- Sessions use 32-byte random opaque tokens, HMAC-SHA-256 cookie signatures,
  SHA-256 database token hashes and session-bound CSRF proof.
- Production cookie: `__Host-mandoquita_admin`, `HttpOnly`, `Secure`,
  `SameSite=Strict`, `Path=/`, no `Domain`. Development uses a local exception
  only outside production.
- Idle expiry is 30 minutes; absolute expiry is eight hours. Logout, expiry,
  revocation, session-secret rotation and code-hash fingerprint rotation deny the
  session.
- Persistent PostgreSQL throttling enforces 5 failures/15 minutes with a
  15-minute client lock and 50 failures/15 minutes with a 30-minute deployment
  lock. Success clears only the client counter.
- Origin/Host are exact on login; session writes additionally require
  constant-time CSRF verification. Forwarded addresses are ignored unless
  trusted-proxy mode and hop count are explicit.
- Production fails closed without managed-edge proof. The trusted edge must strip
  caller-supplied `x-product-admin-edge` and inject its configured value only after
  enforcing managed access.
- Audit records contain safe outcome metadata and changed field names, never
  credentials, tokens, raw Product values or request bodies.

## Persistence

Migration `202607130011_add_product_admin_security` adds
`ProductAdminSession`, `ProductAdminThrottle` and `ProductAdminAuditEvent` with
lookup, lock, cleanup and 90-day-retention-supporting indexes. It is additive and
changes no Product, Variant or taxonomy data.

The migration was applied to the configured AWS PostgreSQL `dbmaster` database
on 2026-07-13. `npx prisma migrate status` reports all 12 migrations applied and
the schema up to date.

## Configuration and rotation

```env
PRODUCT_ADMIN_CODE_HASH="scrypt$16384$8$1$..."
PRODUCT_ADMIN_SESSION_SECRET="independent random value of at least 32 bytes"
PRODUCT_ADMIN_ORIGIN="https://approved-admin-origin.example"
PRODUCT_ADMIN_TRUST_PROXY="true|false"
PRODUCT_ADMIN_TRUSTED_PROXY_HOPS="1"
PRODUCT_ADMIN_EDGE_SECRET="independent edge-injected value of at least 32 bytes"
```

`npm run admin:generate-secrets` generates a nontrivial six-digit code once plus
its hash, session secret and edge secret. The raw code is transferred securely to
the Business Representative and is not stored by the application.

Replacing the code hash invalidates sessions through their credential fingerprint.
Replacing the session secret invalidates cookie signatures. Edge-secret rotation
must be coordinated at the managed edge so no unprotected interval exists.

## Product and response protection

- Unknown/read-only/related fields reject the complete request.
- Published requires Editorial Approval, an eligible active Product Type and at
  least one Variant.
- `featured=false` atomically clears `featuredOrder`.
- Commercial Availability preserves stored price/currency and infers no state.
- Product Type remains the only assigned taxonomy leaf.
- Mandatory timestamp predicates prevent stale overwrite and automatic merge.
- Every admin/session response sets no-store/no-cache, noindex/nofollow,
  `nosniff`, no-referrer, frame-denying JSON CSP and `Vary: Cookie, Origin`.
- Governed 400/401/403/404/409/429/500/503 outcomes expose no internals.

## Verification completed

- `npx tsc --noEmit`: passed.
- `npm test`: 31 files, 173 tests passed.
- `npm run build`: passed with all approved admin routes and separated
  `/api/internal/images`.
- Unit evidence covers slow hash, fail-closed production config, edge proof,
  signed/HttpOnly cookies, session resolution/expiry, five-attempt lockout,
  security headers, admin search/filter/order, hidden-field exclusion, page
  recovery, strict updates, Product invariants and optimistic conflicts.

- `npm run test:integration:product-admin`: passed against AWS PostgreSQL. It
  verified real sessions, authorized reads, Product invariants, stale writes and
  500 list queries at concurrency 10 with p95 508.86 ms from the remote operator
  workstation, below its 750 ms remote-validation limit.
- The admin list now selects only its response projection rather than loading
  editor-only fields and Variant counts. The production p95 target remains
  250 ms when the application and PostgreSQL are co-located; deployment telemetry
  must confirm that environment-specific target.

## Rollback

1. Disable `/admin` and `/api/admin/*` at the managed edge.
2. Restore the prior application artifact.
3. Revoke/delete active Product Admin sessions.
4. Retain audit evidence for at least 90 days.
5. Drop session/throttle tables only after the old artifact is active; retain or
   export audit data before its table is removed.

Public Product data and APIs require no rollback because the migration and admin
read/session contracts are additive.
