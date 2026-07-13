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
  outcome, and at most four related Products

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
