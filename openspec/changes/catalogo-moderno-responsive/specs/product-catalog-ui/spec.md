## ADDED Requirements

### Requirement: Responsive catalog listing

The system SHALL render a responsive product catalog page that adapts to mobile and desktop layouts while preserving visual hierarchy and product discoverability.

#### Scenario: Catalog loads with responsive grid

- **WHEN** a user opens the main catalog page on any supported viewport
- **THEN** the system displays products in a grid that adapts column count by breakpoint without clipping product cards

#### Scenario: Catalog preserves key information

- **WHEN** the catalog page displays each product card
- **THEN** each card includes image, name, category, and price in a readable and consistent layout

### Requirement: Category-based filtering

The system SHALL allow users to filter catalog results by category from the catalog interface.

#### Scenario: User applies category filter

- **WHEN** a user selects a category filter
- **THEN** the catalog updates results to include only products in the selected category

#### Scenario: User clears category filter

- **WHEN** a user removes the selected category filter
- **THEN** the catalog returns to the default unfiltered result set

### Requirement: Basic search on catalog

The system SHALL provide text search on the catalog to narrow visible products by product name.

#### Scenario: User searches products

- **WHEN** a user enters a search term in the catalog search input
- **THEN** the catalog displays products whose names match the search term
