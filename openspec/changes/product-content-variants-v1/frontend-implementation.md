# Product Content and Variants V1 — Frontend Implementation

Status: Implemented and Frontend Approved

Owner: React Frontend Architect

Date: 2026-07-12

## Delivered experience

- Product Detail renders the ordered Product Image collection through the released
  gallery contract, selects Primary media initially and preserves a stable empty or
  failed-media frame without autoplay.
- Selectable Variants use labelled controlled option groups. No Variant is selected
  by default; resolving a complete choice may update associated media without moving
  focus, while manual gallery navigation never changes Variant state.
- Earlier option groups remain navigable and clear only incompatible later choices,
  preventing dead ends while accurately communicating unavailable combinations.
- One meaningful Variant is read-only `Características`; Base, inactive and
  content-correction outcomes produce no fabricated selector or internal language.
- Short description, complete description, brand, collection, localized gender
  applicability and tags follow the approved hierarchy beneath Product identity and
  taxonomy. SEO content remains metadata-only.

## Cross-feature synchronization

- `ProductCard` is the shared listing consumer for Homepage Featured Products,
  Product Catalog, Category/Subcategory pages, Search results and Related Products.
- Cards use Backend-derived Primary/first compatibility media, approved alternative
  text, short-description priority and a stable missing-media presentation.
- Existing `ProductOffer` remains the sole visitor-facing price composition, so
  Commercial Availability continues to suppress historical price and currency.
- Featured ordering, publication, taxonomy, related discovery and deterministic
  light-only contracts remain Backend/platform-owned and unchanged.

## Boundaries

- Frontend consumes `ProductVariantSelection`; it does not infer Active/Base state,
  expose SKU, barcode or reference, or import inventory and transactional concepts.
- Gallery and Chip remain domain-neutral Platform components. Product-specific
  resolution and Image association live in `ProductVariantOptions` and Product Detail.
- No parallel Product, taxonomy, Image or Variant representation was introduced.

## Verification

- `npx tsc --noEmit`: pass.
- `npm test -- --run`: 23 files and 119 tests pass.
- `npm run build`: pass.
- Product Detail integration tests cover Primary gallery outcome, associated media,
  no preselection, unavailable combinations, compatible recovery, read-only Variant,
  missing media, metadata hierarchy and protected commercial information.

PCV-019 through PCV-023 and Platform handoff PGOC-016 are complete. QA,
documentation-wide synchronization and Project Architect Release remain downstream.
