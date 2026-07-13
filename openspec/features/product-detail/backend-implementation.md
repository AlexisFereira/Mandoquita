# Backend Implementation Notes

Status: Implemented and validated

Owner: Backend Architect

## Traceability

- Tasks 1, 2 and 5: `getProductDetail` resolves by public slug and requires
  `published = true`. Missing and unpublished products share the same `null`
  business result, which API and SSR adapters translate to a uniform 404
  without internal metadata.
- Task 3: media remains a presentation reference and is not part of the detail
  eligibility predicate. The existing response accepts an empty media
  reference and delegates fallback rendering to the UI.
- Task 4: `editorialApproved`, `published`, and
  `commerciallyAvailable` are persisted as independent product dimensions.
  Public visibility depends only on `published`.
- Tasks 6 and 7: related products require the same primary category and
  `published = true`, exclude the current identifier, and may return an empty
  array.
- Tasks 8 and 10: automated tests cover published detail, unavailable detail,
  category affinity, self-exclusion, and empty related results.

## Persistence

Migration `202607120003_add_product_lifecycle_dimensions` adds the three
independent lifecycle flags. Existing `active` values initialize `published`
so previously inactive products do not become public during migration. A
composite index supports published-product lookup by primary category.

## Lifecycle Semantics

- `published` is the canonical public-visibility flag. The legacy `active`
  field remains stored for operational compatibility but is not a public-read
  predicate.
- `editorialApproved` is a publication prerequisite. PostgreSQL rejects
  `published = true` when `editorialApproved = false`.
- `commerciallyAvailable` controls whether a current offer and price may be
  exposed. Published products remain discoverable when it is false, but public
  `price` and `currency` are returned as `null`.

## Related Ordering

Related products remain constrained to the same primary category, exclude the
current Product, and return at most four records. Commercially available
Products are ordered first, followed by `updatedAt DESC` and `id ASC` for
deterministic ties. Homepage `featured` ranking is not reused for contextual
recommendations. The already validated Category from the main detail query is
reused to avoid a redundant relation join.

## Validation

- Prisma schema formatting: passed.
- Prisma client generation: passed.
- Full Vitest suite: 21 files and 105 tests passed.
- Next.js production build and type validation: passed.
- Migrations through 005: applied successfully to PostgreSQL.
- Real PostgreSQL lifecycle integration validation: passed.
- Reliability: repeated detail queries produced byte-equivalent serialized
  business results against PostgreSQL.
- Approved performance validation: 10,000 persisted Products, 1,000 detail
  queries, concurrency 20, p95 12.94 ms against a maximum of 50 ms. Zero
  errors, deterministic results, and temporary-data cleanup passed.
- Traceability: Product Detail tasks 1-8 and 10 map to the service, migration,
  public contract, automated tests, and PostgreSQL validation documented here.
