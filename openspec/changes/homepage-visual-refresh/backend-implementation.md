# Backend Implementation Notes

Status: Implemented

Owner: Backend Architect

Related Tasks:

- 2.1 Existing homepage eligibility
- 2.2 Category presentation contract
- 2.3 No domain or database changes
- 2.4 Optional presentation content

## Implementation

The homepage SSR data assembly is isolated in `src/server/homepageService.ts`.
The service consumes the existing catalog service and returns a typed
`HomepagePayload` containing:

- `featuredProducts`: at most eight products satisfying `active = true`,
  `published = true`, and `featured = true`, ordered by
  `featuredOrder ASC`.
- `categories`: category `slug`, `name`, optional representative `imageUrl`,
  and the count of active products in the loaded catalog result.

Catalog public visibility remains enforced by `listProducts`, whose Prisma
query requires `published: true`. Featured eligibility is enforced
independently by `listFeaturedProducts`, which additionally requires the
approved Active and Featured designation states. A category is included only
when at least one published product belongs to it.

No public API route was added. The Pages Router SSR function calls the service
directly and receives the same data required by the refreshed presentation.

## Empty and Optional Content

The service returns empty arrays when no eligible products exist. Category
media is optional in the homepage response and is omitted when no non-empty
product image is available. Empty product descriptions remain serializable and
the presentation contract already permits the UI to omit their rendering.

The current Prisma catalog schema requires product `description` and
`imageUrl`, so database `null` values are outside the existing contract. This
change does not relax those domain constraints.

## Featured Ranking Domain Extension

Following explicit approval after the visual-refresh backend work, the Product
domain was extended with:

- `featured Boolean @default(false)` for editorial eligibility.
- `featuredOrder Int?` for curated ranking.
- A database check requiring a positive ranking when present.
- A composite index on `(active, featured, featuredOrder)` for the homepage
  query.

Products with a numeric rank are ordered first. Unranked featured products are
placed last, followed by deterministic `createdAt DESC` and `id ASC`
tie-breakers. Duplicate ranks are allowed so editorial updates do not require
renumbering an entire collection.

The initial seed marks eight products as featured with ranks 1 through 8. The
migration and seed were applied successfully to the configured local database.

## Category Discovery Domain Extension

The separately approved Homepage BR-005 and BR-007 rules are now implemented
by the homepage backend. `Category` owns explicit `active` and `visible`
flags, both defaulting to `true` for backwards-compatible migration of the
existing catalog.

Homepage categories are queried directly rather than inferred from a capped
product page. The query returns every active, visible category containing at
least one published product, together with a published-product count and
optional representative image. Featured homepage products also require an
active, visible category so their navigation targets remain eligible.

## Validation

- Full Vitest suite: 19 files, 114 tests passed before this synchronization.
- Next.js production build: passed.
- Dedicated homepage backend tests cover Featured Active and Published
  predicates, empty
  payloads, featured eligibility, the eight-product limit, curated ordering,
  minimal category fields, active-product counts, and empty optional values.

The standalone `tsc --noEmit` command continues to report existing mock typing
errors in `tests/api/productsRoutes.test.ts`; the production Next.js type check
and build pass.
