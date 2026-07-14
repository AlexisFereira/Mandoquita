# Catalog Media Admin V1

> **Admin V2 integration (2026-07-14):** this capability is complete and is
> consumed through Admin Catalog Management V2 named accounts. Product Admin V1
> access references below are historical; production activation is governed by
> ACM-037 and `integration-decision.md`.

Status: Approved — Requirements and Architecture Complete

Coordinator: Project Architect

Date: 2026-07-13

## Summary

Extend the isolated administration capability so an authorized maintainer can
upload and manage media for existing Products and existing Categories without
receiving storage credentials or the internal operator API key.

This is a new governed change because Product Admin V1 explicitly excludes
Product Image upload, ownership, association, order, Primary designation and
alternative text.

## Business Problem

Public Product and Category discovery depends on meaningful current imagery, but
the existing Admin can update only Product scalar fields. A maintainer cannot
upload, replace, describe, order or designate Product media, and cannot replace
or describe Category media. Media changes therefore require direct database,
seed or operator intervention and cannot follow the approved administrative
review, validation, concurrency and audit workflow.

## Business Goal

Allow an authorized maintainer to keep Product galleries and Category imagery
accurate and accessible through one controlled administrative experience while
preserving Product ownership, Category taxonomy integrity, Variant references,
public discovery behavior and the managed-edge security boundary.

## Users

- Authorized Maintainer: uploads and manages media for existing catalog entities.
- Visitor: receives accurate, ordered and meaningfully described public imagery.
- Deployment/Operations Owner: governs storage, delivery, lifecycle and secrets.

## Approved Scope

### Included

- Upload a new approved raster image through the authorized Admin.
- Manage the ordered Product Image collection of an existing Product.
- Add or update Product Image alternative text.
- Reorder Product Images and designate at most one Primary Image.
- Replace the stored media of an existing Product Image without silently losing
  its Product ownership, position, Primary status or valid Variant references.
- Remove a Product Image only under an approved reference and storage-lifecycle
  rule.
- Upload, replace, describe or remove the single image of an existing Category.
- Preview the persisted media outcome and expose recoverable upload, validation,
  conflict and storage failure behavior.
- Preserve existing Product Admin session, managed-edge, audit, no-cache,
  no-index and optimistic-concurrency boundaries.

### Excluded

- Product or Category creation/deletion.
- Subcategory or Product Type media.
- Variant creation/editing or reassignment of Variant-to-Image relationships.
- Video, animation, SVG, documents or arbitrary file storage.
- Image editing, crop, filters, compression controls or generative media.
- A reusable media library, cross-Product Image reuse or arbitrary external URL
  entry.
- Bulk upload, bulk reassignment or bulk deletion.
- Visitor uploads, public authentication, cart, checkout, payments or orders.

## Architectural Direction

- Product remains the aggregate owner of Product Images; Category remains the
  owner of its single discovery image.
- The browser uses the Product Admin session and never receives
  `PRODUCT_WRITE_API_KEY`, AWS credentials or a reusable storage credential.
- The implemented S3 object-storage capability may be reused behind a new
  session-authorized association contract; its current operator-only endpoint is
  not exposed to the browser by implication.
- Upload, association and replacement must fail safely without corrupting the
  current persisted media state. Orphan cleanup and seven-day superseded-object
  retention follow the approved Architecture lifecycle.
- Existing public Product and taxonomy representations remain compatible.

## Expected Value

- Removes direct database/seed intervention from routine media maintenance.
- Preserves accessible alternative text and deterministic public Image order.
- Reduces broken or stale Product and Category media.
- Keeps media writes within the approved administration and audit boundary.

## Success Measures

- An authorized maintainer can complete one Product Image upload/association and
  one Category Image replacement without infrastructure credentials.
- Invalid files, invalid alternative text, stale changes and storage failures do
  not partially change the catalog entity.
- Product Primary uniqueness, Image position uniqueness, Product ownership and
  valid Variant references remain intact.
- Public Homepage, Catalog, Category, Search and Product Detail consumers display
  the confirmed persisted media outcome without contract regression.
- Security, accessibility, storage lifecycle and responsive QA gates pass.

## Dependencies

- Product Admin V1 session, authorization, managed-edge and audit contracts.
- Product Content and Variants V1 Image ownership/order/Primary contracts.
- Category Taxonomy V1 Category media fields and public discovery contracts.
- Existing S3 image-storage implementation and deployment configuration.
- Design System Image/gallery, Input, Button, status and focus contracts.

## Risks

- A two-step upload and association flow can leave orphaned storage objects.
- Removing a Product Image can break a Variant reference.
- Reordering or Primary updates can violate uniqueness under concurrent edits.
- Replacing a public asset at a reused URL can produce stale CDN/browser caches.
- File content can disagree with declared type or exceed resource limits.
- Storage or edge credentials can leak if the internal operator boundary is
  reused incorrectly.
- Missing or low-quality alternative text can create an accessibility regression.

## Resolved Decisions

1. Product gallery count remains uncapped by Product business rules, preserving
   the released zero-or-more Image contract. Technical request, storage and
   performance controls do not create a catalog count rule.
2. Removal of a Product Image referenced by a Variant is rejected; replacement
   is permitted because it preserves the stable Product Image identity.
3. Removing or demoting a Primary Image does not silently promote another Image.
   A Product without a Primary Image remains valid.
4. Category Image removal is included. A Category without an Image remains valid
   and retains its identity, state, order and discovery eligibility.
5. Every newly associated or replaced meaningful Product/Category Image requires
   trimmed, catalog-meaningful alternative text of 1–240 characters. Existing
   legacy Category media without alternative text remains valid until changed.
6. Product removal is immediate in the confirmed catalog outcome. Operational
   object retention is not a maintainer-visible undo capability.
7. Architecture approves immutable URLs, temporary upload cleanup, seven-day
   superseded-object retention, storage controls and deployment evidence in
   `architecture-review.md`.
