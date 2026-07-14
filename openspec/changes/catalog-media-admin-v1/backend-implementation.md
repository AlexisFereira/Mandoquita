# Catalog Media Admin V1 — Backend Implementation

Status: Implemented, Migrated and PostgreSQL/S3 Validated

Owner: Backend Architect

Date: 2026-07-13

## Delivered

- Product Admin session/managed-edge/Origin/CSRF/no-cache authorization protects
  every new media route; the operator-only `/api/internal/images` remains
  separate.
- Raw one-file uploads are session/idempotency bound for 24 hours. Sharp decodes,
  limits, orientation-normalizes and re-encodes JPEG/PNG/WebP/AVIF without
  EXIF/GPS before immutable S3 storage.
- Complete Product gallery read, add, metadata, stable-ID replacement,
  reference-protected removal, collision-safe complete reorder and explicit
  Primary/no-Primary changes are implemented.
- Category collection/read/add/metadata/replace/remove changes only its optional
  media fields and timestamp; taxonomy identity/state/order remain outside the
  mutation schema.
- Product, Image and Category optimistic timestamps reject stale writes.
  Session/request-shape idempotency prevents duplicate associations and key reuse.
- Per-session hourly limits allow 30 uploads and 300 media mutations before a
  governed 429 response.
- Cancelled/expired uploads schedule immediate cleanup. Replaced/removed objects
  retain restoration metadata for seven days; the cleanup job deletes and
  retries idempotently without reversing catalog state.
- Audit stores safe identities, action/outcome, changed field names, type/size and
  checksum prefix; it excludes bytes, filenames, alternative-text values, full
  URL/object key, cookies, CSRF and credentials.

Exact request/response schemas and outcomes are in `backend-contract.md`.

## Persistence and compatibility

Migration `202607130012_add_catalog_media_admin` is additive. It adds nullable
validated media metadata to existing Product Image and Category rows, plus
temporary upload, mutation-idempotency, per-session limit and object-cleanup
tables. Existing media remains valid with null technical metadata. The existing
public Product and Category response contracts are unchanged.

The migration was applied to the configured AWS PostgreSQL `dbmaster` database
on 2026-07-13. Prisma applied all 13 migrations successfully.

## Configuration and operations

- `S3Client` receives only `AWS_REGION`; authentication is delegated to AWS SDK
  v3's default credential chain and the attached Amplify SSR Compute role.
- Static AWS access-key/session variables are not application configuration and
  are absent from `.env.example` and `amplify.yml`.
- Bucket, delivery origin, prefixes, size and optional KMS values remain runtime
  configuration because they identify storage behavior rather than credentials.
- `AWS_S3_IMAGE_PREFIX` defaults to `images/products`.
- `AWS_S3_CATEGORY_IMAGE_PREFIX` defaults to `images/categories`.
- `npm run catalog-media:cleanup` must run on an approved schedule; normal Admin
  requests are not the only cleanup mechanism.
- Runtime IAM needs scoped Put/Delete to both prefixes and applicable KMS
  Encrypt/GenerateDataKey permissions, without bucket listing.

## Local evidence

- `npx tsc --noEmit`: passed.
- `npm test`: 33 files and 188 tests passed.
- `npm run build`: passed and emitted all nine Product Admin/media route families.
- Storage tests prove real decoding, orientation normalization, metadata removal,
  signature/type mismatch rejection, immutable namespaces and guarded deletion.
- `npm run test:integration:catalog-media` passed against AWS PostgreSQL, S3 and
  the approved Product/Category prefixes after scoped IAM was applied. It uploaded
  and cleaned five immutable objects; proved Product add/idempotency/order/
  Primary/stable replacement/Variant-reference/removal, Category add/replace/
  metadata/removal, seven-day retention cleanup and a concurrency-10 Product
  media read p95 of 327.03 ms from the remote workstation.
- Post-run verification found zero temporary Product, Category, session, upload,
  cleanup or audit rows. `prisma migrate status` confirms all 13 migrations are
  current.

## Rollback

1. Disable Catalog Media Admin routes at the managed edge and stop new uploads.
2. Restore the prior application artifact; retain currently referenced objects.
3. Continue only cleanup work whose object is proven unreferenced.
4. Preserve audit and disposition evidence for the approved retention window.
5. Drop additive tables/columns only after export and compatibility review; never
   delete a currently referenced public object as rollback.
