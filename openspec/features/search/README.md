# Public Product Search

Status: Implemented

Owner: Backend Architect

Implemented: 2026-07-13

## Canonical Contract

Public Search evolves the existing `GET /api/products` collection through its
optional `q` parameter. It does not introduce a second Product source or a
competing Search endpoint.

`q` is trimmed, must contain at least one non-whitespace character, and has a
maximum length of 120 characters. Matching is case-insensitive and evaluates
only these public Product fields:

- `name`
- `shortDescription`
- `description`
- `brand`
- `collection`
- Product tag `value`

SKU, barcode, reference, inventory, cost, supplier, warehouse, logistics,
Variant Attributes, SEO fields, slugs, and taxonomy labels are not searchable.
The response never explains which field matched and exposes no rank or internal
identifier.

## Eligibility and Presentation

Search reuses the canonical catalog rule: a result must be Published, own at
least one Product Variant, and inherit an active Product Type and Subcategory
inside an Active, Visible Category of the Active taxonomy version.

Product `active` and `editorialApproved` remain authoring/publication inputs;
`published` is the public discovery state enforced by the database lifecycle
invariants. Commercial Availability does not hide a result. When false, public
`price` and `currency` are `null`.

## Pagination and Outcomes

Search uses the collection defaults (`page=1`, `limit=12`, maximum `limit=50`).
Results are ordered by Product name ascending and Product ID ascending, making
ties deterministic. A requested page above the valid range resolves to the last
valid page; an empty collection resolves to page 1 with `totalPages=1`.

Whitespace-only, overlong, or otherwise invalid query parameters return HTTP
400 before a Product database query executes. A valid query with no matches
returns HTTP 200 with an empty `items` collection.

Search V1 has no autocomplete, suggestions, personalization, facets, matched
field highlights, ranking scores, Variant Attribute filters, or operational
field search. Any such capability requires a separately approved contract.

## Performance and Rollback

Migration `202607130010_optimize_public_product_search` enables PostgreSQL
`pg_trgm` and installs GIN indexes for the six approved fields. The automated
PostgreSQL validation uses 10,000 temporary Products, 1,000 searches at
concurrency 20, and a p95 release threshold of 150 ms. It also verifies field
boundaries, eligibility, price protection, deterministic results, pagination,
and index presence, then removes all temporary records.

Application rollback restores the previous application artifact, which retains
compatible `q` behavior against Product name. Database rollback may drop the
six Search indexes after the old artifact is active; `pg_trgm` is intentionally
left installed because extensions can be shared. Index removal does not alter
Product data or the public response shape.
