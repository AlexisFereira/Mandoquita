# Product Inventory V1 — Backend Seed Review

Status: Published and Validated

Owner: Backend Architect

Date: 2026-07-13

## Source Review

The replacement JSON contains 47 unique Product IDs and 47 unique public slugs. All
records use USD and are explicitly Active but not Editorially Approved and not
Published. All Category/Subcategory hints resolve to an Active Taxonomy V1 branch
after one documented source correction: `comunicacion-para-casco` was supplied
under `electronica-y-seguridad`, while the authoritative hierarchy owns it under
`accesorios-para-moto`.

The replacement source consolidates stock variants into one Product per supplied
SKU grouping, but does not expose the original SKU as a structured field. It uses
three Product Type labels outside the authoritative leaf vocabulary (`Camiseta rib`,
`Camiseta estampada`, and `Conjunto de bermuda y camiseta`) and provides media URLs
without approved alternative text.

## Seed Decision

`prisma/data/products-v1.json` preserves the supplied source unchanged.
`prisma/seed.ts` validates its version, currency, shape, uniqueness and taxonomy
branches, then inserts the 47 records idempotently as non-public Product drafts.

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

- The 47 supplied consolidated rows become the authoritative Product set.
- Every Product owns one unique deterministic `MDQ-<source ID>` SKU.
- Explicit mapping rules assign one exact Product Type leaf per Product.
- Each supplied URL becomes one Primary Image using the complete Product name as
  approved alternative text only when its governed local file exists.
- Delegated editorial/commercial approval authorizes publication while preserving
  the source prices and `commerciallyAvailable=true` state.

## Publication Decision

On 2026-07-13 the user delegated the remaining implementation decision to Backend.
The replacement inventory supplies the approved Product grouping, so its 47 rows
replace the former 73-row set. Each owns one non-selectable Base Variant
with deterministic SKU `MDQ-<source ID>`. A supplied local Image becomes Primary
with the complete Product name as alternative text only when the media file exists;
currently all 47 files are absent and the approved no-media outcome applies.
Explicit name/subcategory rules normalize every Product to one official Taxonomy
V1 leaf. All 47 records are Editorially Approved, Published and Commercially
Available; 16 receive the separately governed Featured curation below.

This preserves the replacement source identity while keeping internal SKU and
supplier references outside the public contract.

## Featured Curation

The replacement inventory consolidates the former Acid Wash variants into one
Product. Sixteen Products are Featured: 1 Acid Wash, all 8 Relojes, all 4 Lentes,
and all 3 Café Products. Homepage priorities 1–8 contain the Acid Wash, 3 Relojes,
3 Café Products and 1 Lentes Product, preserving visible category variety.
Featured status does not change price, Commercial Availability or imply a promotion.

## Verification

The former 73 Products were removed from AWS `dbmaster`; the replacement seed then
inserted 47 drafts and `npm run prisma:publish-products-v1` activated all records
in one transaction. `npm run test:integration:product-seed` verifies all 47 identities,
prices and published states, exact taxonomy branches, 47 unique Base Variant SKUs,
safe missing-media disposition, public discovery, hidden internal SKU and synchronized Product
ID sequence.

Post-publication performance initially exposed the missing related-discovery index
from the former flat Category model. Migration 008 adds the equivalent composite
index keyed by authoritative `productTypeId`; the final 10,000-Product benchmark
passes at p95 35.24 ms against the approved 50 ms limit.
