Status: Approved

Finalized: 2026-07-12

# Product Catalog API Design

## Context

The API uses Next.js Pages Router, TypeScript, Prisma, and PostgreSQL. Category
Taxonomy V1 replaces the former flat Product-to-Category relation with the
official hierarchy Category → Subcategory → Product Type.

## Domain Model

- `TaxonomyVersion` owns locale, version, and lifecycle state. Exactly one
  version is Active for public discovery.
- `Category` owns a supplied stable ID, official Spanish name and slug,
  description, business order, Active state, and Visible state.
- `Subcategory` owns a supplied stable ID, official Spanish name and slug,
  source sequence, Active state, and exactly one Category.
- `ProductType` is the authoritative leaf classification, preserves source
  sequence, and belongs to exactly one Subcategory.
- `Product.productTypeId` is the only persisted Product classification.
  Category and Subcategory are inherited and are never independently assigned.
- `Product` owns one or more `ProductVariant` records. Each Variant has an
  immutable stable ID, globally unique non-empty SKU, independent Active state,
  optional reference/barcode, and approved typed attributes.
- `Product` owns zero or more ordered `ProductImage` records. Image position is
  unique per Product, at most one Image is Primary, and the database prevents a
  Variant from referencing an Image owned by another Product.
- Product also owns optional short/complete descriptions, brand, collection,
  controlled gender applicability, normalized unique tags, and SEO content.

PostgreSQL rejects a Published Product without a Product Type or Product Variant. Foreign keys,
unique identifiers/slugs, positive order constraints, and restrictive deletes
protect hierarchy integrity.

## Public Eligibility

A Product returned through public catalog contracts must be Published and have
an active Product Type inside an active Subcategory and an Active, Visible
Category of the Active taxonomy version.

Commercial Availability does not control discovery. When it is false, the
Product remains discoverable but public `price` and `currency` are `null`.

## API Contracts

### `GET /api/products`

Supported query parameters:

- `page`: positive integer, default 1.
- `limit`: integer from 1 through 50, default 12.
- `category`: official eligible Category slug.
- `subcategory`: official eligible Subcategory slug.
- `q`: non-empty Product-name search text, maximum 120 characters.

Category filtering returns the complete selected branch. Subcategory filtering
returns only the selected Subcategory branch. Results never cross the selected
branch.

The response contains `items`, pagination `metadata`, and normalized `filters`.
Every Product item exposes its official Product Type plus inherited
Subcategory and Category; ordered Images; optional merchandising/SEO content;
and a temporary `imageUrl` compatibility value derived from the Primary Image,
or otherwise the first ordered Image. SKU, barcode, reference, Variant Active
state, and deferred operational data are not exposed.

### `GET /api/products/[slug]`

Returns one eligible Published Product and up to four related Products from the
same inherited Category. Unknown, retired, unpublished, unclassified, or
ineligible Products use the same 404 response without exposing internal state.

Detail adds `variantSelection`. Its mode is `none` for a Base Variant,
`read_only` for one meaningful Active Variant, `selectable` for two or more
distinguishable Active Variants, or `content_correction` when Active Variants
cannot form meaningful public choices. Public Variant entries contain only the
stable Variant ID, approved attributes, and optional Product Image ID.

### `GET /api/categories`

Returns every non-empty eligible Category in ascending business order. Each
Category includes its eligible non-empty Subcategories in source sequence and
published Product counts. Empty taxonomy branches remain valid data but are
omitted from visitor discovery.

## Migration and Continuity

Migration `202607120006_activate_category_taxonomy_v1` atomically retires the
ten approved demonstration Products, removes flat classification, activates
taxonomy 1.0.0, and installs the leaf-classification invariant.

The discontinued `/categorias/audio`, `/categorias/computing`, and
`/categorias/home-living` destinations permanently redirect to `/categorias`.
Former demonstration Product slugs use the standard unavailable result.

Rollback is coordinated at the release boundary by restoring the
pre-activation database backup and prior application artifact together.

Migration `202607120007_add_product_content_variants_v1` activates Product
Variants, Images, content, and integrity constraints. Because the approved
business migration inventory is empty, it refuses to run if Product rows exist;
it never fabricates SKUs, attributes, or media dispositions.

## Non-Goals

- Cart, checkout, payment, authentication, profiles, inventory, orders, cost,
  supplier, warehouse, tax, shipping, or Variant-level pricing.
- Automatic Product classification.
- Product Type public pages or Product Type filters.
- Free-form taxonomy synonyms or parallel flat Category fields.
