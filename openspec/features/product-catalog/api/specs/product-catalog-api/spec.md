Status: Active

## Product Catalog API Requirements

### Requirement: Published classified Product listing

The system SHALL expose `GET /api/products` with pagination and optional
Category, Subcategory, and public Product Search filters.

#### Scenario: Default listing

- **WHEN** a client requests the listing without filters
- **THEN** the system returns only Published Products with one approved Product
  Type in an eligible branch of the Active taxonomy and at least one Product Variant
- **AND** returns default pagination metadata

#### Scenario: Category branch filter

- **WHEN** `category` contains an eligible official Category slug
- **THEN** every returned Product inherits that Category through its Product Type
- **AND** no Product outside that branch is returned

#### Scenario: Subcategory branch filter

- **WHEN** `subcategory` contains an eligible official Subcategory slug
- **THEN** every returned Product inherits that Subcategory through its Product Type
- **AND** no Product outside that branch is returned

#### Scenario: Invalid query parameters

- **WHEN** pagination or filter parameters violate the documented contract
- **THEN** the API returns HTTP 400 without exposing implementation details

### Requirement: Canonical public Product Search

When `q` is present, the listing SHALL match case-insensitively across Product
name, short description, complete description, brand, collection, and tags.
It SHALL reuse catalog eligibility and SHALL NOT search or expose SKU, barcode,
reference, inventory, supplier, cost, warehouse, logistics, match fields, or
ranking scores.

#### Scenario: Approved public field matches

- **WHEN** a normalized non-empty `q` matches any approved public Search field
- **THEN** the eligible Product appears in deterministic `name ASC, id ASC` order

#### Scenario: Empty or invalid Search query

- **WHEN** `q` is whitespace-only, over 120 characters, or otherwise invalid
- **THEN** the API returns HTTP 400 before executing a Product query

#### Scenario: Search has no matches

- **WHEN** a valid `q` matches no eligible Product
- **THEN** the API returns HTTP 200 with an empty collection

#### Scenario: Search page is outside the valid range

- **WHEN** `page` exceeds the final page for a valid Search collection
- **THEN** the response resolves to the final valid page without fabricating Products

### Requirement: Hierarchical Product response

Every successful Product payload SHALL expose the authoritative Product Type
and its inherited Subcategory and Category using official Spanish language and
stable public slugs.

#### Scenario: Listing item classification

- **WHEN** a Product listing succeeds
- **THEN** each item includes `productType`, `subcategory`, and `category`
- **AND** those values originate from one Product Type hierarchy

#### Scenario: Commercially unavailable Product

- **WHEN** a Published Product is not Commercially Available
- **THEN** it remains eligible for discovery
- **AND** public `price` and `currency` are null

### Requirement: Product detail by public slug

The system SHALL expose `GET /api/products/[slug]` for eligible Published
Products.

#### Scenario: Eligible Product detail

- **WHEN** a client requests an eligible Product slug
- **THEN** the API returns core Product fields, Product Type, inherited
  Subcategory and Category, ordered Images, optional content, Variant-selection
  outcome, governed canonical/contact continuation URLs, and at most four related
  Products

#### Scenario: Safe canonical and contact continuation

- **WHEN** public origin and approved WhatsApp configuration are valid
- **THEN** `canonicalUrl` contains only the configured origin and current Product slug
- **AND** `whatsappUrl` contains only the approved recipient, normalized public
  Product name and canonical URL
- **AND** neither value contains price, Variant, visitor, referrer, session or
  administrative data
- **WHEN** required configuration is absent or invalid
- **THEN** the affected continuation value is null without affecting Product detail

#### Scenario: Base Variant

- **WHEN** an eligible Product has one approved non-selectable Base Variant
- **THEN** `variantSelection.mode` is `none`
- **AND** no fabricated option, SKU, barcode, or reference is exposed

#### Scenario: Meaningful Active Variants

- **WHEN** two or more Active Variants are distinguishable by approved attributes
- **THEN** `variantSelection.mode` is `selectable`
- **AND** each public Variant contains only stable identity, approved attributes,
  and optional Product Image association

#### Scenario: Commercial protection across Variants

- **WHEN** the Product is not Commercially Available
- **THEN** Product-level `price` and `currency` remain null
- **AND** no Variant exposes price, inventory, cost, supplier, or logistics data

### Requirement: Product Image integrity

Product Images SHALL follow ascending unique position, expose approved alternative
text, and designate at most one Primary Image. A Variant Image association SHALL
always reference an Image owned by the same Product. Zero Images is valid.

#### Scenario: Unavailable Product detail

- **WHEN** the slug is unknown, retired, unpublished, unclassified, or belongs
  to an ineligible taxonomy branch
- **THEN** the API returns the standard HTTP 404 result

### Requirement: Taxonomy discovery

The system SHALL expose `GET /api/categories` using the Active taxonomy.

#### Scenario: Eligible hierarchy discovery

- **WHEN** eligible Categories contain Published Products
- **THEN** Categories are ordered by ascending `sortOrder`
- **AND** eligible non-empty Subcategories are ordered by ascending `sourceOrder`
- **AND** empty or inactive branches are omitted

### Requirement: Stable response structures

Listing responses SHALL contain `items`, pagination `metadata`, and applied
`filters`. Detail responses SHALL contain `item`, `variantSelection`, and
`related`. Taxonomy
responses SHALL contain the eligible ordered hierarchy and published Product
counts.

### Requirement: Governed Product update by ID

The system SHALL expose session-authenticated `PATCH /api/admin/products/[id]` for strict
partial updates to Product-owned scalar content and lifecycle fields. It SHALL
fail closed when server credentials are absent and SHALL NOT accept relational or
operational fields owned by separate contracts.

#### Scenario: Authorized partial update

- **WHEN** a caller supplies the configured server credential, a positive Product
  ID, and one or more valid mutable fields
- **THEN** the Product is updated atomically
- **AND** the response contains the updated administrative representation

#### Scenario: Unauthorized update

- **WHEN** the signed server session is missing, expired, revoked or invalid
- **THEN** the API returns HTTP 401 before Product data is queried or changed

#### Scenario: Stale administrative edit

- **WHEN** `expectedUpdatedAt` does not match the current Product timestamp
- **THEN** the API returns HTTP 409 without overwriting the newer Product state

#### Scenario: Invalid publication transition

- **WHEN** an update would leave a Published Product without editorial approval,
  Product Type, or Product Variant
- **THEN** the API returns HTTP 409 and preserves the current Product

#### Scenario: Internal or relational update field

- **WHEN** a body includes SKU, barcode, reference, Variants, Images, tags,
  inventory, supplier, cost, warehouse, logistics, or any unknown field
- **THEN** the API returns HTTP 400 without applying a partial mutation

### Requirement: Governed S3 image upload

The system SHALL expose operator-authenticated `POST /api/internal/images` to store one
validated raster image in the configured S3 bucket. Uploading an object SHALL NOT
implicitly create or change a Product Image association.

#### Scenario: Valid image upload

- **WHEN** an authorized caller submits raw JPEG, PNG, WebP, or AVIF bytes with a
  matching content type and acceptable size
- **THEN** the service stores the object under a unique immutable key
- **AND** returns its key, delivery URL, canonical type, size, and checksum

#### Scenario: Spoofed or unsupported image

- **WHEN** the declared content type does not match the file signature or the
  format is not approved
- **THEN** the API returns HTTP 400 before S3 is called

#### Scenario: Oversized image

- **WHEN** request bytes exceed the configured maximum
- **THEN** the API returns HTTP 413 without storing a partial object

#### Scenario: Storage unavailable

- **WHEN** required S3 configuration is absent or AWS rejects the operation
- **THEN** the API returns a safe 503 or 502 response without exposing credentials

### Requirement: Governed Catalog media administration

The system SHALL expose Product Admin session-authorized temporary upload,
Product Image and Category Image routes defined in
`../../../../../changes/catalog-media-admin-v1/backend-contract.md`. State changes
SHALL require managed-edge proof in production, exact Origin, session CSRF,
optimistic aggregate baselines and request-shape-bound idempotency.

#### Scenario: Temporary upload is not catalog media

- **WHEN** one authorized valid raster is uploaded
- **THEN** it is decoded, metadata-stripped and stored under a unique immutable
  Product or Category namespace key for at most 24 hours
- **AND** no public Product or Category representation changes until association

#### Scenario: Stable Product Image replacement

- **WHEN** a valid replacement upload and current Product/Image baselines are
  confirmed for an existing Product Image
- **THEN** its stored media changes while Product Image ID, Product ownership,
  position, Primary state and valid Variant references remain unchanged

#### Scenario: Atomic order and Primary

- **WHEN** the complete current Image identity list and explicit Primary outcome
  are submitted with the current Product baseline
- **THEN** positions and at-most-one Primary are committed atomically
- **AND** stale, incomplete or duplicate lists return 409 without partial order

#### Scenario: Referenced Product Image removal

- **WHEN** any Variant currently references the requested Product Image
- **THEN** removal returns 409 and preserves Image and Variant state

#### Scenario: Category media isolation

- **WHEN** Category media is added, described, replaced or removed
- **THEN** Category identity, taxonomy version, order, Active, Visible and
  discovery eligibility remain unchanged

#### Scenario: Governed object disposition

- **WHEN** an upload expires/is cancelled or confirmed media is replaced/removed
- **THEN** persisted cleanup state schedules immediate orphan deletion or
  seven-day superseded-object retention and retries storage failures idempotently
