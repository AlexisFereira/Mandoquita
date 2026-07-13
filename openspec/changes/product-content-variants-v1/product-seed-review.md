# Product Inventory V1 — Backend Seed Review

Status: Published and Validated

Owner: Backend Architect

Date: 2026-07-13

## Source Review

The supplied JSON contains 73 unique Product IDs and 73 unique public slugs. All
records use USD and are explicitly Active but not Editorially Approved and not
Published. All Category/Subcategory hints resolve to an Active Taxonomy V1 branch
after one documented source correction: `comunicacion-para-casco` was supplied
under `electronica-y-seguridad`, while the authoritative hierarchy owns it under
`accesorios-para-moto`.

The source predates Product Content and Variants V1: it represents each inventory
row as a separate Product, provides no approved SKU, uses broad Product Type labels
instead of the authoritative leaf values, and provides media URLs without approved
alternative text.

## Seed Decision

`prisma/data/products-v1.json` preserves the supplied source unchanged.
`prisma/seed.ts` validates its version, currency, shape, uniqueness and taxonomy
branches, then inserts the 73 records idempotently as non-public Product drafts.

The seed intentionally does not create Product Variants, Product Images or
Product-Type assignments. Doing so would fabricate approved SKU, alternative text
or leaf classification and would violate PCV requirements. The supplied media and
classification hints remain preserved in the versioned source for the subsequent
Business/Product content decision.

The seed recognizes the documented branch correction only for validation; it does
not rewrite the source or persist a classification before exact leaf approval.
The legacy `featuredOrder: 0` value is normalized to `null` because every source
record has `featured: false` and the active domain permits only positive editorial
ranking positions.

Explicit source IDs are retained. After insertion, the PostgreSQL Product sequence
is advanced safely beyond the maximum ID. Existing matching IDs are accepted only
when their slugs also match; conflicting identity causes the transaction to fail.

## Activation Inputs Resolved

- The 73 rows remain separate Products until an authoritative grouping key exists.
- Every Product owns one unique deterministic `MDQ-<source ID>` SKU.
- Explicit mapping rules assign one exact Product Type leaf per Product.
- Each supplied URL becomes one Primary Image using the complete Product name as
  approved alternative text.
- Delegated editorial/commercial approval authorizes publication while preserving
  the source prices and `commerciallyAvailable=true` state.

## Publication Decision

On 2026-07-13 the user delegated the remaining implementation decision to Backend.
To avoid irreversible false merges without a supplied master Product identity, the
73 source rows remain separate Products. Each owns one non-selectable Base Variant
with deterministic SKU `MDQ-<source ID>`. A supplied local Image becomes Primary
with the complete Product name as alternative text only when the media file exists;
currently all 73 files are absent and the approved no-media outcome applies.
Explicit name/subcategory rules map
every Product to one official Taxonomy V1 leaf. All 73 records are Editorially
Approved, Published and Commercially Available; none is Featured.

This preserves source identity and permits a later separately reviewed Product
consolidation if Business provides authoritative grouping keys.

## Featured Curation

The latest authorized business correction keeps only 4 Camiseta Acid Wash
Oversize Products Featured. Homepage priorities 1–8 contain 4 Acid Wash, 2 Relojes
and 2 Café Products. All 7 Lentes and the remaining Featured Relojes/Café continue
after the Homepage limit, while the other 4 Acid Wash records are no longer
Featured. Featured status does not change price, Commercial Availability or imply
a promotion.

## Verification

The draft seed was executed twice successfully against PostgreSQL to prove
idempotency. `npm run prisma:publish-products-v1` then activated all records in one
transaction. `npm run test:integration:product-seed` verifies all 73 identities,
prices and published states, exact taxonomy branches, 73 unique Base Variant SKUs,
safe missing-media disposition, public discovery, hidden internal SKU and synchronized Product
ID sequence.

Post-publication performance initially exposed the missing related-discovery index
from the former flat Category model. Migration 008 adds the equivalent composite
index keyed by authoritative `productTypeId`; the final 10,000-Product benchmark
passes at p95 35.24 ms against the approved 50 ms limit.
