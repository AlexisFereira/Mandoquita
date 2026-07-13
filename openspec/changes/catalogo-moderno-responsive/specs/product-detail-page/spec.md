## ADDED Requirements

### Requirement: Product detail page content

The system SHALL provide a dedicated product detail page with essential product information for decision support.

#### Scenario: User opens valid product detail

- **WHEN** a user navigates to a product detail URL with an existing product slug
- **THEN** the system displays product name, price, category, image, and description

#### Scenario: Product detail for unknown slug

- **WHEN** a user navigates to a product detail URL with a non-existing product slug
- **THEN** the system returns a not found response for that product route

### Requirement: Contextual navigation from catalog to detail

The system SHALL allow users to navigate from catalog cards to product detail pages.

#### Scenario: User opens detail from catalog card

- **WHEN** a user selects a product card from the catalog listing
- **THEN** the system opens the corresponding product detail page

### Requirement: Related product suggestions

The system SHALL display related products on the product detail page using category affinity.

#### Scenario: Detail page shows related products

- **WHEN** a user views a product detail page
- **THEN** the system displays a list of related active products from the same category excluding the current product
