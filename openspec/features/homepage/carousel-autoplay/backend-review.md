# Backend Review

Status: Approved

Owner: Backend Architect

## Scope Reviewed

- Homepage featured-product eligibility and ordering.
- Homepage category eligibility.
- Public catalog listing and product detail eligibility.
- Related-product eligibility.
- Empty homepage payload behavior.
- Transactional non-goals.

## Findings

### Product Eligibility

All public product queries require `Product.published = true`. Listing, detail,
related-product, and featured-product queries also require the owning Category
to be active and visible. The legacy Product `active` flag is operational and
does not control public visibility.

### Featured Products

Featured products require `published = true` and `featured = true` in an
active, visible category. The query returns at most eight records and orders
them by:

1. `featuredOrder ASC`, with null values last.
2. `createdAt DESC`.
3. `id ASC`.

Regular products are not mixed into the featured collection.

### Categories

Homepage categories require `active = true`, `visible = true`, and at least one
  published product. Every eligible category is returned; no unapproved category
cap is applied. Counts and representative media are derived only from active
products.

### Empty Content

The homepage backend returns empty `featuredProducts` and `categories` arrays
when no eligible content exists. Optional category media is omitted safely.
Banner and carousel-slide availability is presentation-owned and does not
require a backend state or endpoint.

### Security and Scope

Input validation for catalog filters remains centralized in the catalog
service. No cart, checkout, payment, authentication, profile, wishlist, or
comparison endpoint exists.

## Validation Evidence

- Vitest: 19 files and 114 tests passed.
- Next.js production build and type validation passed.
- All migrations through `202607120004_enforce_product_lifecycle_semantics`
  are applied to the configured local PostgreSQL database.
- Real PostgreSQL lifecycle validation passed for publication, editorial
  approval, commercial availability, price suppression, and deterministic
  repeated detail queries.

## Decision

Backend tasks 3.1 through 3.5 and Backend Review task 9.4 are approved.
