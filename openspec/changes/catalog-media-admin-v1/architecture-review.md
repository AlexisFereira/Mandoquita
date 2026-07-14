# Catalog Media Admin V1 — Architecture and Security Review

Status: Approved — Requirements Gate Complete

Owner: Project Architect / Security Architecture

Date: 2026-07-13

## Decision

Catalog Media Admin V1 is approved as an extension of the isolated Product Admin
capability. It introduces no public upload surface and no generic reusable media
library. Product remains the aggregate boundary for Product Images; Category
remains the aggregate boundary for its single discovery Image.

Architecture tasks CMA-006 through CMA-011 are complete. Product Requirements
CMA-001 through CMA-005 are approved in `requirements-review.md`. UX Solution,
Design System and Backend contract design may proceed; Backend implementation
remains sequenced after its executable contract review.

## Aggregate and Ownership Boundaries

### Product media

- Product owns Product Image identity, ownership, order and Primary uniqueness.
- Product Image replacement changes the underlying immutable Media Asset while
  preserving Product Image identity and therefore valid Variant references.
- Product Image removal changes aggregate structure and is prohibited while a
  Variant references the Image under the recommended V1 Product rule.
- Reorder and Primary changes are one Product aggregate mutation and cannot be
  implemented as unrelated best-effort writes.

### Category media

- Category owns one optional media outcome through its existing Image path and
  alternative-text boundary.
- Media administration cannot change Category identity, taxonomy version,
  sequence, Active, Visible or discovery eligibility.
- A Category media change and Product media change never share a transaction or
  infer state from one another.

### Media Upload

Media Upload is a temporary technical resource, not a catalog aggregate or public
Image. It records enough server-side evidence to validate, associate, expire and
clean one uploaded object. It cannot appear in public Product or taxonomy
responses before successful association.

## Authorization and API Boundary

All new `/api/admin/*` media reads and changes consume the existing Product Admin
security boundary:

- production managed-edge proof;
- signed, revocable, HttpOnly, Secure, SameSite session;
- exact Origin/Host validation and session-bound CSRF for every state change;
- persistent throttling, safe audit and fail-closed configuration;
- no-store/no-cache, noindex and existing administrative security headers; and
- optimistic concurrency for aggregate mutations.

The browser never receives or sends `PRODUCT_WRITE_API_KEY`, AWS credentials,
KMS material or a reusable storage credential. The existing
`POST /api/internal/images` endpoint remains operator-only and outside Catalog
Media Admin. New Admin upload behavior is implemented through a separately
authorized contract and must not proxy a client-provided internal API key.

Approved API capability families are:

1. create and inspect a session-owned temporary Media Upload;
2. list the administrative Product Image representation;
3. add, replace, describe, reorder, designate Primary or remove Product Images;
4. read and change the single Category media outcome; and
5. cancel an unused Media Upload.

Backend owns exact routes and schemas in CMA-019 through CMA-026. Response
allowlists expose only media identity, safe preview/delivery URL, validated type,
size, dimensions, checksum, alternative text, order/Primary/reference context,
timestamps and recovery information required by the approved UX. Bucket,
credentials, private headers and internal storage configuration remain hidden.

## Approved Upload and Association Lifecycle

### Phase 1 — Temporary upload

1. An authorized CSRF-protected request streams one file to the application; JSON
   base64 and unrestricted multipart collections are prohibited.
2. The server enforces request and decoded-image limits before accepting the
   object, validates signature/type, removes unsafe embedded metadata and records
   checksum and dimensions.
3. The server writes a new immutable UUID-keyed object into the Product or
   Category namespace and creates a session-bound temporary Media Upload record.
4. The response returns an opaque upload identity and safe preview metadata. It
   grants no storage authority and creates no public catalog association.

Temporary upload creation requires a session-bound idempotency key. Repeating the
same completed request returns the same result; it cannot create unbounded
duplicates. An upload expires after 24 hours if not associated.

### Phase 2 — Aggregate association

1. A JSON Product or Category change identifies one valid temporary upload and
   supplies the approved metadata plus the current aggregate timestamp.
2. The transaction verifies ownership, session binding, unused status, target
   entity, Image rules and optimistic concurrency.
3. On success it associates the immutable object, consumes the upload exactly
   once and returns the confirmed aggregate representation.
4. On failure the catalog aggregate remains unchanged and the upload remains
   safely retryable until expiry unless its content is invalidated.

No distributed transaction is claimed across S3 and PostgreSQL. Consistency uses
persisted lifecycle state plus idempotent compensation. A worker or approved
deployment job deletes expired/orphaned objects; normal Admin traffic may assist
cleanup but cannot be the only production mechanism.

## Replacement, Removal and Retention

- Replacement always uploads a new immutable object key; public bytes are never
  overwritten at an existing cacheable URL.
- Product replacement atomically updates the existing Product Image media
  reference and preserves its ID, position, Primary state and Variant references.
- Category replacement atomically swaps the Category media outcome without
  changing taxonomy fields.
- The superseded or removed object becomes deletion-pending only after the
  aggregate transaction commits.
- Deletion-pending objects are retained for seven days to support operational
  rollback, then deleted idempotently. Public catalog contracts cease referencing
  them immediately after the confirmed change.
- A failed deletion never reverses the confirmed catalog mutation; it remains a
  monitored cleanup item and cannot be silently forgotten.
- Rollback during retention restores both the prior aggregate reference and its
  retained object. After retention, rollback uses the approved backup/re-upload
  procedure rather than a broken URL.

## Storage and Delivery Profile

- Separate governed namespaces are required for Product and Category media,
  rooted under `images/products/` and `images/categories/` or an equivalent
  reviewed deployment mapping.
- Object keys are non-overwriting UUID paths with normalized extensions.
- JPEG, PNG, WebP and AVIF are the only approved formats unless Product
  Requirements narrows them.
- Default encoded limit remains 5 MiB; deployments may lower it but cannot exceed
  the existing 20 MiB hard ceiling without a new Security review.
- Security limits decoded content to at most 40 megapixels and 12,000 pixels on
  either edge. Backend may propose a stricter compatible limit.
- Embedded GPS and unnecessary EXIF metadata are removed before public storage;
  orientation is normalized without exposing original metadata.
- Checksum, detected type, encoded size and dimensions are recorded server-side.
- Objects use server-side encryption, restrictive content type, inline
  disposition and immutable one-year cache headers.
- Production uses an IAM Role. The runtime receives only scoped Put/Delete access
  to the approved namespaces and required KMS Encrypt/GenerateDataKey permissions
  when KMS is enabled. Bucket listing and static repository credentials are not
  required by the approved flow.
- Public delivery uses the approved asset/CDN origin; upload storage origin and
  private bucket details are not inferred from browser input.

Deployment must prove bucket public-access policy, CORS, CDN behavior, cleanup
schedule, IAM scope and secret management before CMA-042 Release approval.

## Concurrency and Idempotency

- Product media changes require current Product `updatedAt`; individual metadata
  or replacement changes also require the current Product Image `updatedAt`.
- Category media changes require current Category `updatedAt`.
- A stale baseline returns conflict without automatic merge or overwrite.
- Reorder submits the complete intended ordered Image identity list for the
  Product and applies it in one transaction using collision-safe temporary
  positions or an equivalent mechanism.
- Primary change and reorder may be combined only when validated as one Product
  aggregate mutation.
- Upload and mutation idempotency records are session-bound, request-shape-bound,
  expire after 24 hours and never authorize a different target or operation.

## Validation and Failure Contract

- Invalid identity, metadata, file, type, signature, size, dimensions, ownership,
  order or request shape: HTTP 400 with safe field/global evidence.
- Missing/expired session: HTTP 401; rejected Origin/CSRF: HTTP 403.
- Missing Product, Category, Product Image or Media Upload: HTTP 404 without
  cross-tenant/storage disclosure.
- Ownership, Primary, Variant reference, already-consumed upload or stale
  concurrency conflict: HTTP 409.
- Encoded request beyond the configured limit: HTTP 413.
- Throttled upload/change: HTTP 429 with safe retry guidance.
- Storage unavailable: HTTP 502; missing/invalid server or edge configuration:
  HTTP 503; unexpected failures: generic HTTP 500.

No failure response includes credentials, bucket names, object keys, raw file
bytes, database detail, signed URLs or internal exception text.

## Audit and Retention

Safe audit records include request ID, hashed session identity, target entity
kind/ID, Product Image or Category identity where applicable, Media Upload hash,
action, outcome, reason, changed metadata field names, detected type, encoded
size and checksum prefix. They exclude alternative-text values, filenames, full
URLs/keys, file bytes, credentials, cookies, CSRF values and storage headers.

Administrative audit follows the existing 90-day minimum. Media Upload lifecycle
and deletion-pending records remain until cleanup succeeds plus the approved
audit window needed to prove disposition.

## Migration and Compatibility

- Existing Product Images and Category image fields remain authoritative and do
  not require fabricated media metadata.
- Any new Media Upload/lifecycle persistence is additive.
- Existing public Product and Category response shapes remain compatible.
- Existing Images with absent legacy Category alternative text remain readable;
  Product Requirements decides when correction becomes mandatory for a change.
- The operator-only upload endpoint is not renamed or repurposed during this
  change; future retirement requires a separate compatibility review.

## Rollout and Rollback

1. Apply additive persistence and cleanup capability while Admin media UI remains
   disabled.
2. Validate storage/IAM/CDN, managed edge and temporary-upload cleanup in the
   target environment.
3. Enable Backend media routes, then Frontend media navigation.
4. On rollback, disable Admin media routes at the edge, stop new uploads, restore
   the prior application, retain associated objects and process only safely
   identified temporary/deletion-pending cleanup records.
5. Never roll back by deleting currently referenced public objects.

## Architecture Outcome

- CMA-006 aggregate boundaries: Approved.
- CMA-007 authorization/API boundary: Approved.
- CMA-008 lifecycle, idempotency and cleanup: Approved.
- CMA-009 storage/IAM/CDN profile: Approved; deployment evidence remains P2.
- CMA-010 concurrency, audit, failures and rollback: Approved.
- CMA-011 Architecture/Security Review: Approved.

No Architecture or Product Requirements decision blocks UX Solution, Design
System or Backend contract design. Backend implementation remains gated only by
its executable contract review and applicable approved UX/Design handoffs.
