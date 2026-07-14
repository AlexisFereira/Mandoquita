# Catalog Media Admin V1 — Executable Backend Contract

Status: Implemented and PostgreSQL/S3 Validated

Owner: Backend Architect

Date: 2026-07-13

## Shared boundary

Every route below requires the existing Product Admin session and managed-edge
proof. Every state change additionally requires exact Origin, session-bound
`x-csrf-token`, and an `Idempotency-Key` of 8–100 safe characters. Responses use
the existing no-store, no-index and security headers. The browser never receives
an object key, bucket name, AWS credential, internal API key or cleanup record.

Media writes are limited per administrative session to 30 uploads and 300
aggregate mutations per rolling hour. Limit exhaustion returns 429 with
`Retry-After`. The separately governed `POST /api/internal/images` remains
operator-only and unchanged.

## Temporary upload

`POST /api/admin/media-uploads?kind=product|category` accepts one raw JPEG, PNG,
WebP or AVIF body. `Content-Type`, `x-file-name` and `Idempotency-Key` are
required. JSON/base64, multipart collections, animation, mismatched signatures,
files above the configured limit, images above 40 MP or 12,000 px on either edge
are rejected. The server decodes and re-encodes the raster to normalize
orientation and remove EXIF/GPS metadata before storing an immutable UUID key.

HTTP 201 returns only:

```json
{
  "upload": {
    "id": "opaque-upload-id",
    "previewUrl": "https://approved-cdn.example/images/products/2026/07/uuid.webp",
    "contentType": "image/webp",
    "size": 48231,
    "width": 1200,
    "height": 1200,
    "checksumSha256": "hexadecimal-sha256",
    "expiresAt": "2026-07-14T12:00:00.000Z"
  }
}
```

The upload is bound to the current session and namespace, expires after 24
hours, and is not catalog media. `GET /api/admin/media-uploads/[id]` safely
inspects its status. `DELETE /api/admin/media-uploads/[id]` cancels an unused
upload and schedules idempotent cleanup.

## Product Images

`GET /api/admin/products/[id]/images` returns Product ID/slug/name/`updatedAt`
and the complete `position ASC, id ASC` collection. Each Image contains only ID,
preview URL, alternative text, zero-based position, Primary state,
Variant-reference boolean/count, validated type/dimensions/size/checksum and
`updatedAt`. Storage identity and Variant internals are excluded.

`POST /api/admin/products/[id]/images` associates one Product upload:

```json
{
  "expectedProductUpdatedAt": "ISO timestamp",
  "uploadId": "opaque-upload-id",
  "altText": "Vista lateral del reloj con correa marrón",
  "position": 0,
  "isPrimary": false
}
```

`PATCH /api/admin/products/[id]/images` atomically submits the complete order and
explicit Primary outcome; `primaryImageId: null` means no Primary:

```json
{
  "expectedProductUpdatedAt": "ISO timestamp",
  "imageIds": ["image-id-2", "image-id-1"],
  "primaryImageId": "image-id-2"
}
```

`PATCH /api/admin/products/[id]/images/[imageId]` accepts exactly one action:

```json
{ "action": "metadata", "expectedProductUpdatedAt": "ISO", "expectedImageUpdatedAt": "ISO", "altText": "..." }
```

```json
{ "action": "replace", "expectedProductUpdatedAt": "ISO", "expectedImageUpdatedAt": "ISO", "uploadId": "opaque-upload-id", "altText": "..." }
```

Replacement updates the existing Product Image row, preserving ID, position,
Primary and all Variant references. `DELETE` on the same route requires both
timestamps in its JSON body and rejects any current Variant reference. Removal
does not infer another Primary. Every successful response returns the new
complete Product media baseline.

## Category Image

`GET /api/admin/categories?q=` returns existing Categories in governed taxonomy
order with ID, slug, name, Active/Visible read-only context, optional safe Image
and `updatedAt`. `GET /api/admin/categories/[id]/image` returns one Category
baseline.

On `/api/admin/categories/[id]/image`:

- `POST` adds media with `expectedCategoryUpdatedAt`, `uploadId` and `altText`;
- `PATCH action=metadata` changes only alternative text;
- `PATCH action=replace` consumes a Category upload and replaces media;
- `DELETE` removes media using `expectedCategoryUpdatedAt`.

Category identity, version, order, Active, Visible and discovery eligibility are
never mutation inputs. A Category without an Image remains valid.

## Validation, concurrency and lifecycle

Alternative text is trimmed, 1–240 characters, non-generic and cannot equal the
normalized original filename. Unknown fields reject the whole request. Product,
Product Image and Category timestamps are mandatory optimistic baselines.

Upload and mutation idempotency is session-, key-, operation- and request-shape
bound for 24 hours. Reusing a key for a different request returns 409. Association
consumes an upload exactly once in the aggregate transaction. Product reordering
uses collision-safe temporary positions and explicit Primary clearing under the
existing unique database constraints.

Expired/cancelled uploads become cleanup work immediately. Replaced and removed
objects remain deletion-pending for seven days with restoration metadata, then
the `npm run catalog-media:cleanup` job deletes them idempotently. Failed deletion
is persisted as `FAILED` and retried; it never reverses confirmed catalog state.

## Outcomes

- 400 invalid identity, body, metadata or media;
- 401 missing/expired session;
- 403 rejected Origin/CSRF;
- 404 missing or inaccessible entity/Image/upload;
- 409 stale state, reused/consumed upload, ownership, complete-order, Primary or
  Variant-reference conflict;
- 413 encoded or processed image above the configured limit;
- 429 per-session resource limit;
- 502 storage unavailable;
- 503 missing server/edge/storage configuration;
- 500 generic unexpected failure.

Safe audit records include outcome, hashed session/upload identity, entity/Image
identity, action, changed field names, detected type, encoded size and checksum
prefix. They exclude alternative-text values, filenames, bytes, full URLs/keys,
cookies, CSRF, credentials and storage headers.
