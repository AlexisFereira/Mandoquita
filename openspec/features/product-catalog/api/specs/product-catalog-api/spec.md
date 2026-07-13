Status: Active

## ADDED Requirements

### Requirement: Product listing API endpoint

The system SHALL expose a products listing endpoint that supports category and text filters with pagination.

#### Scenario: List products with default pagination

- **WHEN** a client requests GET /api/products without query parameters
- **THEN** the system returns active products using default page and limit values

#### Scenario: List products filtered by category

- **WHEN** a client requests GET /api/products with a valid category slug
- **THEN** the system returns only products that belong to the requested category

#### Scenario: List products filtered by query text

- **WHEN** a client requests GET /api/products with a text query parameter
- **THEN** the system returns products whose names match the query text

### Requirement: Product detail API endpoint

The system SHALL expose a product detail endpoint by slug.

#### Scenario: Get existing product detail

- **WHEN** a client requests GET /api/products/[slug] with an existing slug
- **THEN** the system returns the product detail payload with category fields

#### Scenario: Get unknown product detail

- **WHEN** a client requests GET /api/products/[slug] with a non-existing slug
- **THEN** the system returns a not found response

### Requirement: Stable API response contract

The system SHALL return predictable JSON response shapes for both listing and detail endpoints.

#### Scenario: Listing response shape

- **WHEN** a client receives a successful listing response
- **THEN** the response includes items, pagination metadata, and applied filter metadata

#### Scenario: Detail response shape

- **WHEN** a client receives a successful detail response
- **THEN** the response includes product core fields and category information
