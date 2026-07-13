Status: Active

## Product Catalog API Requirements

### Requirement: Published classified Product listing

The system SHALL expose `GET /api/products` with pagination and optional
Category, Subcategory, and Product-name filters.

#### Scenario: Default listing

- **WHEN** a client requests the listing without filters
- **THEN** the system returns only Published Products with one approved Product
  Type in an eligible branch of the Active taxonomy
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
  Subcategory and Category, and at most four related Products

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
`filters`. Detail responses SHALL contain `item` and `related`. Taxonomy
responses SHALL contain the eligible ordered hierarchy and published Product
counts.
