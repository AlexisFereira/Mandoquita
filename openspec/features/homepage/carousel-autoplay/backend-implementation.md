# Backend Implementation Notes

Status: Implemented

Owner: Backend Architect

Related Tasks:

- 3.1 Homepage product and category eligibility
- 3.2 Featured product ordering
- 3.3 Unavailable product exclusion
- 3.4 Missing-content degradation
- 3.5 Transactional-scope exclusion

## Eligibility

`getHomepagePayload` exposes only:

- Active, featured products belonging to active, visible categories.
- Active, visible categories containing at least one active product.

Featured products preserve the approved curated ordering: `featuredOrder ASC`
with unranked items last, then deterministic creation-date and identifier
tie-breakers.

Category discovery is loaded directly from `Category`; it is not inferred from
a capped product page. Consequently every category satisfying Homepage BR-005
is exposed, as required by BR-007.

## Safe Degradation

The homepage payload returns empty arrays when eligible products or categories
do not exist. Category media remains optional and is omitted when the selected
active representative product has no usable image value. No banner or slide
domain was introduced by this backend change.

## Scope Protection

No public endpoint or transactional behavior was added. The backend continues
to expose only catalog product listing and detail endpoints; cart, checkout,
payments, authentication, profile, wishlist, and comparison remain absent.

## Persistence

Migration `202607120002_add_category_discovery_status` adds `Category.active`
and `Category.visible`, with backwards-compatible `true` defaults and an index
supporting homepage eligibility queries. The seed explicitly preserves both
flags for the initial categories.

## Validation

- Prisma schema formatting and client generation pass.
- Homepage backend tests cover eligibility predicates, featured ordering,
  complete category selection, active-product counts, empty payloads, and
  optional media.
- The full automated test suite passes.
