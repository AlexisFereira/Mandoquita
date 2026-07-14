Status: Superseded — Closed by layered Product Catalog and Product Detail feature tasks.

## 1. Backend foundation (database + seed)

- [x] 1.1 Configure Prisma schema with Product and Category models and required indexes
- [x] 1.2 Create and run the initial PostgreSQL migration for the catalog
- [x] 1.3 Create minimum category and product seed data for local environment
- [x] 1.4 Add shared backend types for product listing/detail response payloads

## 2. Backend API implementation

- [x] 2.1 Implement GET /api/products with default pagination
- [x] 2.2 Add category filtering to GET /api/products
- [x] 2.3 Add text search filtering to GET /api/products
- [x] 2.4 Implement GET /api/products/[slug] with 404 response for unknown slugs
- [x] 2.5 Standardize JSON response contract (items, metadata, applied filters)

## 3. Backend quality gates

- [x] 3.1 Add API tests for listing with and without filters
- [x] 3.2 Add API test for detail endpoint and 404 case
- [x] 3.3 Add API-level validation tests for invalid pagination and filter params
- [x] 3.4 Confirm non-goals at API level (no cart, authentication, or payments endpoints)

## 4. Backend runtime and test tooling

- [x] 4.1 Add a Dockerfile for the Next.js backend runtime
- [x] 4.2 Add docker-compose services for PostgreSQL, backend, and test execution
- [x] 4.3 Add a minimal root page so Next.js can build in Docker
- [x] 4.4 Make Vitest configuration ESM-safe for local and Docker runs
- [x] 4.5 Make backend unit tests run successfully in Docker Compose

## 5. Design system foundation

- [x] 5.1 Define the ecommerce visual direction with a warm, modern brand palette and clear semantic colors
- [x] 5.2 Establish typography choices, font fallbacks, and hierarchy for headings, body, and UI labels
- [x] 5.3 Define the spacing scale, radii, shadows, and elevation system for cards and panels
- [x] 5.4 Set responsive grid breakpoints and layout width constraints for catalog and detail pages
- [x] 5.5 Create shared design tokens or theme primitives for colors, spacing, and surfaces

## 6. Reusable component foundation

- [x] 6.1 Build a shared Button component with primary, secondary, and ghost variants
- [x] 6.2 Build a shared Header component with logo, navigation, and responsive mobile behavior
- [x] 6.3 Build a shared Footer component with ecommerce links and trust cues
- [x] 6.4 Build a reusable ProductCard component for catalog grids and related items
- [x] 6.5 Build a reusable Carousel component for featured collections or hero content

## 7. Frontend listing UI

- [x] 7.1 Verify Twind/Tailwind utility styling setup for responsive layout
- [x] 7.2 Create the main page shell with header, carousel, content sections, and footer
- [x] 7.3 Add the featured products row with three highlighted products
- [x] 7.4 Add the first category block with three product cards from one category
- [x] 7.5 Add the second category block with three product cards from a different category
- [x] 7.6 Connect the main page content to real catalog data and shared components

## 8. Frontend product detail UI

- [x] 8.1 Create product detail page by slug in Pages Router
- [x] 8.2 Display essential product information (name, price, category, image, description)
- [x] 8.3 Implement related products section by category
- [x] 8.4 Handle not found state for unknown slugs

## 9. End-to-end verification

- [x] 9.1 Add UI tests for basic responsive rendering and navigation to detail page
- [x] 9.2 Verify catalog-to-detail flow against real API responses
- [x] 9.3 Explicitly verify that cart, authentication, and payments are not implemented
