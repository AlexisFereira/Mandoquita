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
  description, optional governed media path/alternative text, business order,
  Active state, and Visible state.
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
- `q`: non-empty public Product search text, maximum 120 characters. Surrounding
  whitespace is removed and matching ignores case across Product name, short
  description, complete description, brand, collection, and tags only.

Category filtering returns the complete selected branch. Subcategory filtering
returns only the selected Subcategory branch. Results never cross the selected
branch.

Search results use deterministic `name ASC, id ASC` order. A requested page
above the valid range resolves to the final valid page. Invalid or
whitespace-only `q` returns HTTP 400 before Product data is queried; a valid
query with no matches returns an empty successful collection.

The response contains `items`, pagination `metadata`, and normalized `filters`.
Every Product item exposes its official Product Type plus inherited
Subcategory and Category; ordered Images; optional merchandising/SEO content;
and a temporary `imageUrl` compatibility value derived from the Primary Image,
or otherwise the first ordered Image. SKU, barcode, reference, Variant Active
state, matched-field identity, ranking scores, and deferred operational data are
not exposed or searched.

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

Category `imageUrl` is a deployment-neutral relative path persisted as
`Category.imagePath`; `imageAltText` carries the approved accessible description.
Frontend resolves relative paths with `NEXT_PUBLIC_ASSET_BASE_URL`, which may be
empty for Next.js `public/` assets or point to a CDN/application asset prefix.

### `PATCH /api/admin/products/[id]`

Updates one Product by positive numeric ID. This is a Product Admin V1 contract,
not a public catalog endpoint. Every request requires the signed, revocable
server-side Product Admin session plus exact Origin and session-bound CSRF proof.
The browser never sends `PRODUCT_WRITE_API_KEY`. Missing configuration fails
closed with HTTP 503; missing/invalid sessions return 401 and rejected
Origin/CSRF proof returns 403 before Product mutation.

In production, the application also requires managed-edge proof. The trusted
edge strips any caller-provided `x-product-admin-edge` value, enforces the
approved proxy, VPN/private-network or operator-allowlist policy, and only then
injects its independent secret. Direct or unproved access fails closed with HTTP
503. The six-digit credential does not authorize unrestricted Internet access.

The JSON body is partial, strict, and must contain at least one mutable field:
`slug`, `name`, descriptions, brand, collection, gender applicability, SEO
content, Product-level price/currency, `active`, `editorialApproved`, `published`,
`commerciallyAvailable`, `featured`, `featuredOrder`, or `productTypeId`.
Unknown fields are rejected. SKU, barcode, reference, Variants, Images, tags,
inventory, supplier, cost, warehouse, and logistics are outside this endpoint.

`expectedUpdatedAt` is a required ISO timestamp for optimistic concurrency. A
stale value returns HTTP 409 instead of overwriting a newer edit.
The service also rejects publication without editorial approval, Product Type,
or an existing Variant, and rejects an editorial order on a non-Featured Product.
Setting `featured=false` atomically clears `featuredOrder`.

Success returns HTTP 200 with `{ "item": ... }` containing the updated
administrative Product representation and new `updatedAt`. Unlike the public
catalog representation, this authenticated response returns stored price and
currency even when Commercial Availability is false. Invalid bodies/IDs return
400, missing Products return 404, state/uniqueness/concurrency conflicts return
409, and unexpected failures return a generic 500 response.

### `POST /api/internal/images`

Uploads one image to the configured S3 bucket. This separately governed
operator-only endpoint uses server-only `PRODUCT_WRITE_API_KEY`; Product Admin
never receives or sends that credential. The
request body is the raw file bytes, `Content-Type` declares the image type, and
`x-file-name` carries the original file name. It does not accept multipart form
data or base64 JSON.

JPEG, PNG, WebP, and AVIF are allowed. SVG and all other formats are rejected.
The service compares the declared type with the file signature, enforces the
configured byte limit before S3 access, creates a non-overwriting UUID key under
the configured prefix/year/month, and sends SHA-256 checksum, immutable cache
headers, inline disposition, and server-side encryption. AES-256 is the default;
an optional KMS key changes encryption to `aws:kms`.

Success returns HTTP 201 with S3 `key`, public/CDN `url`, canonical content type,
byte size, and hexadecimal SHA-256 checksum. Invalid files return 400, oversized
files return 413, missing server configuration returns 503, and S3 failures return
a generic 502 without leaking AWS details.

This route is outside Product Admin V1 and never accepts its browser session.
The endpoint stores the object only. Associating its URL with `ProductImage`
requires a separate governed operation containing Product ownership, position,
Primary status, and approved alternative text.

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

Migration `202607130010_optimize_public_product_search` enables `pg_trgm` and
adds GIN indexes only to the six approved Search fields. It changes no Product
data or response shape and may be rolled back by dropping those indexes after
the prior compatible application artifact is restored.

## Non-Goals

- Cart, checkout, payment, authentication, profiles, inventory, orders, cost,
  supplier, warehouse, tax, shipping, or Variant-level pricing.
- Automatic Product classification.
- Product Type public pages or Product Type filters.
- Free-form taxonomy synonyms or parallel flat Category fields.
