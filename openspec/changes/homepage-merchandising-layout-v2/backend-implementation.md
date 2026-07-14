# Homepage Merchandising Layout V2 — Backend Implementation

Status: Complete

Owner: Backend Architect

Date: 2026-07-14

## Delivered

- `getHomepagePayload` now returns an optional `selectedCategoryProducts`
  projection with safe Category identity, Bogotá business date and at most six
  canonical public Product items.
- The entire Homepage payload is composed in one PostgreSQL `REPEATABLE READ`
  transaction. Featured, Category candidates and selected Product membership
  therefore share one consistent snapshot before SSR.
- The interactive transaction has a bounded 15-second timeout so a cold local
  database connection can complete the composed snapshot without inheriting
  Prisma's 5-second default.
- Candidate eligibility reuses `listDiscoverableTaxonomy`; selected membership
  reuses unsearched `listProducts`. No Homepage-specific Product or taxonomy
  eligibility predicate exists.
- Candidates are sorted by stable Category ID. A stable hash of the unchanged
  candidate IDs plus the Bogotá calendar-day ordinal produces one deterministic
  daily index. With at least two candidates, the modulo rotation cannot repeat
  immediately on consecutive days.
- Selected Products retain canonical `createdAt DESC, id ASC` ordering and a
  server-side limit of six. Empty/revalidated candidates are removed and safely
  recomputed; zero candidates return `null`.
- Homepage SSR sends `Cache-Control: private, no-store`, deliberately bypassing
  stale CDN/server selection so publication/taxonomy changes cannot expose
  ineligible cached content. Identical inputs still produce identical SSR props
  and hydration receives, but never recalculates, membership.

## Evidence

- Bogotá midnight boundary, same-day stability, order-independent candidates and
  consecutive-day non-repeat are covered in `tests/api/homepageService.test.ts`.
- The same test proves released Featured predicates/order/limit and selected
  Product public predicate/order/limit.
- No schema or migration was added; rollback removes the optional projection and
  selected section without touching Product or Category state.
