# Product Admin V1 — Backend Contract Review

Status: Backend Contract Approved — Implementation Unblocked

Owner: Backend Architect

Date: 2026-07-13

## Review outcome

Backend approves the executable API and security boundary established by
`architecture-review.md`. This completes the Backend portion of ADM-005. The
contract is implementable without exposing `PRODUCT_WRITE_API_KEY`, the six-digit
code, session tokens, Product internals, or unrelated operational data.

ADM-002 is a final Product Architecture decision. Product Requirements now
approves ADM-001/ADM-004 in `proposal.md`, `requirements.md` and
`requirements-review.md`. ADM-013 through ADM-021 may proceed against the approved
security, collection, field and Image-exclusion contracts.

## Executable route contract

Every `/api/admin/*` response uses the common security headers defined below and
authorizes the server-side administrative session. The browser never sends an
internal API key.

| Method and route | Request | Successful response |
| --- | --- | --- |
| `POST /api/admin/session` | JSON `{ code }`; exactly six numeric digits; exact Origin/Host validation | HTTP 200 session state plus session-bound CSRF value; opaque session only in cookie |
| `GET /api/admin/session` | Cookie | HTTP 200 authorized state and idle/absolute expiry plus CSRF value |
| `DELETE /api/admin/session` | Cookie, exact Origin/Host, CSRF | HTTP 204; idempotently revokes server record and expires cookie |
| `GET /api/admin/products` | `page`, `limit`, `q`, approved boolean/taxonomy filters | Paginated administrative Product summaries |
| `GET /api/admin/products/[id]` | Positive numeric ID | Exact editor representation, taxonomy context, Variant readiness and `updatedAt` |
| `PATCH /api/admin/products/[id]` | Positive ID, required `expectedUpdatedAt`, strict approved partial body, Origin/Host and CSRF | HTTP 200 persisted editor representation with new `updatedAt` |
| `GET /api/admin/product-types` | Cookie | Active Product Types with inherited Subcategory/Category context |

`POST /api/admin/images` is not part of Product Admin V1. Before session routes are
released, the existing operator-only upload route must move outside
`/api/admin/*` to a separately reviewed machine/operator namespace or remain
undeployed. It cannot accept the browser session or appear in the V1 UI.

## Administrative response allowlists

Product list summary contains only:

- `id`, `slug`, `name`;
- stored Product-level `price` and `currency`;
- `active`, `editorialApproved`, `published`, `commerciallyAvailable`,
  `featured`, `featuredOrder`;
- Product Type and inherited Subcategory/Category identity and public names;
- `updatedAt`.

Editor read/update response adds only the approved scalar update fields:
descriptions, brand, collection, gender applicability and SEO content. It may
include `hasVariant` as a publication-readiness boolean but no Variant identity,
SKU, reference, barcode, attributes or Image internals.

List Search matches name and slug only, case-insensitively after surrounding
whitespace normalization. Approved filters are exact and combinable. Pagination
uses `page=1`, `limit=20`, maximum `limit=50`; ordering is deterministic by
`name ASC, id ASC`. An out-of-range page resolves to the nearest valid page.

Unknown request fields and array-shaped scalar query values are rejected. Tags,
Variants, Variant Attributes, Images, taxonomy structure, inventory, cost,
supplier, warehouse, logistics, orders and payment data never enter these
responses or mutation inputs.

## Credential and session persistence

Three PostgreSQL-owned records are required:

### `ProductAdminSession`

- opaque token SHA-256 hash as unique identity; raw token is never stored;
- session-secret/credential fingerprint for rotation invalidation;
- session-bound CSRF hash;
- creation, last-activity, idle-expiry, absolute-expiry, revocation and update
  timestamps;
- indexes on token hash, active expiry and retention-cleanup timestamps.

The cookie contains a random opaque token plus HMAC-SHA-256 signature using
`PRODUCT_ADMIN_SESSION_SECRET`. The database record remains authoritative. The
production cookie name is `__Host-mandoquita_admin`; attributes are `HttpOnly`,
`Secure`, `SameSite=Strict`, `Path=/`, no `Domain`. Development may use the
documented non-`__Host-` cookie only when `NODE_ENV != production`.

Idle expiry is 30 minutes and is extended by authorized activity. Absolute expiry
is eight hours and never extends. Logout, expiry, revocation, secret/hash rotation,
missing configuration or invalid signature denies access and expires the cookie.

### `ProductAdminThrottle`

- normalized non-reversible client-network key hash or deployment-wide key;
- scope, rolling-window start, failed count, lock-until and update timestamp;
- unique `(scope, keyHash)` and lock/cleanup indexes.

Updates use a transaction and row lock/upsert so concurrent processes cannot
bypass limits. Client scope permits five failures in 15 minutes then locks for 15
minutes. Deployment scope permits 50 failures in 15 minutes then locks the access
gate for 30 minutes. Success clears only the client counter. Existing valid
sessions are unaffected.

### `ProductAdminAuditEvent`

- timestamp, request/correlation ID, safe event/outcome/reason codes;
- session-ID hash when available, Product ID, expected/current timestamps and
  changed field-name array;
- no code, cookie/token, secret, raw IP, Product before/after values or request
  body;
- index supporting the minimum 90-day retention/cleanup policy.

Access success/failure, throttling, logout, expiry, revocation, unauthorized,
origin/CSRF rejection, validation/conflict and successful update are recorded.
Audit failure on an authorization or write path fails the operation closed.

## Code verification and secrets

`PRODUCT_ADMIN_CODE_HASH` stores a salted slow hash in a documented scrypt format;
the application accepts no raw-code environment fallback. Verification performs
the slow hash even for a malformed/absent configured credential where practical,
then returns one generic unauthorized outcome. The request code is never logged.

`PRODUCT_ADMIN_SESSION_SECRET` is independent random material of at least 32
bytes. Configuration rejects equality with the code hash or
`PRODUCT_WRITE_API_KEY`. Rotation invalidates sessions through the stored
credential fingerprint. Generation/rotation is deployment-only; there is no API.

Required production configuration is fail-closed:

- `PRODUCT_ADMIN_CODE_HASH`;
- `PRODUCT_ADMIN_SESSION_SECRET`;
- `PRODUCT_ADMIN_ORIGIN` exact HTTPS origin;
- explicit trusted-proxy/network-key policy;
- approved managed edge-access evidence/configuration;
- PostgreSQL persistence and TLS.

## Origin, CSRF, proxy and edge boundary

- Login validates exact `Origin` and `Host`; every other state-changing request
  additionally validates a session-bound `x-csrf-token` using constant-time
  comparison.
- Missing Origin is rejected outside an explicitly documented same-origin
  server-to-server test harness. No wildcard origin or CORS credential sharing is
  permitted.
- Client throttling uses the socket address by default. Forwarded headers are
  ignored unless an explicit trusted-proxy mode and hop count are configured;
  arbitrary `x-forwarded-for` input never selects the key.
- Production administration fails closed unless the approved managed proxy,
  private network/VPN or operator allowlist evidence is configured. An
  application-only six-digit gate is not releasable on unrestricted Internet.

## Product invariants and concurrency

`expectedUpdatedAt` is mandatory for PATCH and participates in the write
predicate. A mismatch returns 409 with no mutation or automatic merge.

The domain service validates the merged final Product state before persistence:

- Published requires Editorial Approval, an approved Product Type and at least
  one governed Variant;
- disabling Featured atomically clears `featuredOrder`;
- a non-Featured Product cannot retain a positive order;
- Commercial Availability never deletes or rewrites stored price/currency;
- Product Type is the only assigned taxonomy leaf;
- database constraints remain the final integrity backstop.

The current strict update allowlist is the maximum possible V1 contract, not
authorization to finalize it before ADM-001. Backend will remove any field that
Product Requirements excludes; it will not add fields implicitly.

## Governed outcomes and headers

- 400 invalid ID/query/body;
- 401 invalid code or missing/invalid/expired/revoked session;
- 403 valid session lacking approved Origin/CSRF/edge proof;
- 404 missing Product;
- 409 stale version, uniqueness or Product-state conflict;
- 429 throttle lock with safe `Retry-After`;
- 500 unexpected internal failure;
- 503 missing secrets, persistence or mandatory edge configuration.

All outcomes remain generic where security state could be inferred. Admin/session
responses set:

- `Cache-Control: no-store` and `Pragma: no-cache`;
- `X-Robots-Tag: noindex, nofollow, noarchive`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: no-referrer`;
- `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` for JSON;
- `Vary: Cookie, Origin` where applicable.

## Migration, performance and rollback plan

One additive migration creates session, throttle and audit tables plus cleanup and
lookup indexes. It changes no Product data or public API schema. Rollback order is:

1. disable `/admin` and `/api/admin/*` at the managed edge;
2. restore the prior application artifact;
3. revoke/delete active session rows;
4. retain audit evidence for the approved 90-day period;
5. drop session/throttle tables only after the old artifact is active and audit
   retention obligations are satisfied.

Implementation evidence must measure code verification cost, session lookup and
refresh, throttle contention, admin list/filter pagination and optimistic update
latency against representative data/concurrency. It must also prove secrets never
enter build output, responses, URLs or logs and that public catalog regressions
continue to pass.

## Implementation reconciliation

The former incompatibilities are resolved in code: Product Admin uses the server
session rather than `PRODUCT_WRITE_API_KEY`, `expectedUpdatedAt` is mandatory,
session/throttle/audit persistence and authorized read routes exist, common
security headers are applied, and S3 upload moved to `/api/internal/images`
outside V1.

Migration 011 is applied to AWS PostgreSQL and `prisma migrate status` confirms
all 12 migrations are current. The real integration run verified sessions,
invariants and concurrency, then completed 500 admin-list queries at concurrency
10 with remote p95 508.86 ms (750 ms workstation-to-AWS limit). The co-located
production target remains 250 ms and must be confirmed with deployment telemetry.
Production managed-edge evidence remains an external release gate; application
code correctly fails closed without it.
