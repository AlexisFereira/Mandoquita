# Discovery and Trust Experience V1 — Backend Implementation

Status: Complete — Released

Owner: Backend Architect

Date: 2026-07-13

## Decision

Canonical Search evolves `GET /api/products?q=...`. This preserves the existing
Product Catalog source and response, while broadening matching from Product name
to the six approved public fields. No new Search persistence, endpoint, Product
state, ranking contract, or operational-field exposure was introduced.

## Implementation

- `src/server/catalogService.ts` owns query normalization, approved-field
  matching, shared public eligibility, deterministic ordering, pagination
  recovery, and public Product mapping.
- Matching is case-insensitive for name, short/complete descriptions, brand,
  collection, and tags.
- Search order is `name ASC, id ASC`. The initially requested page and count run
  concurrently; only an out-of-range request performs a second read at the
  resolved final page.
- Existing Commercial Availability mapping keeps matching unavailable Products
  discoverable while returning null price and currency.
- The existing API error boundary returns a safe HTTP 400 for invalid Search
  inputs and never exposes validation or database internals.

## Database and Performance Evidence

Migration `202607130010_optimize_public_product_search` was applied successfully
to PostgreSQL `mandoquita_catalog` at `localhost:5433`. It enables `pg_trgm` and
adds GIN trigram indexes to the six approved fields.

`npm run test:integration:search` creates and removes a 10,000-Product temporary
dataset and validates:

- all six approved fields and surrounding-whitespace/case normalization;
- exclusion of SKU, reference, and barcode matches;
- publication and taxonomy eligibility;
- Commercial Availability price protection;
- nearest-page recovery and deterministic concurrent responses;
- all six indexes installed;
- 1,000 searches at concurrency 20 against a 150 ms p95 release threshold.

The gate intentionally measures the complete service operation, including count,
public relations, and connection-pool contention. Runs above 150 ms fail; the
final coordinated QA matrix passed at p95 106.91 ms.

## Rollback

Restore the prior application artifact first; its Product-name-only `q` remains
compatible with the unchanged API response. Then, if database rollback is
required, drop these non-data indexes concurrently during an approved operation:

- `Product_search_name_trgm_idx`
- `Product_search_short_description_trgm_idx`
- `Product_search_description_trgm_idx`
- `Product_search_brand_trgm_idx`
- `Product_search_collection_trgm_idx`
- `ProductTag_search_value_trgm_idx`

Leave `pg_trgm` installed because it may be shared. Rollback changes neither
Product records nor catalog eligibility.
