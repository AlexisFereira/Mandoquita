## Why

We need a modern, responsive catalog page to explore multiple products clearly across desktop and mobile, improving discoverability and early conversion without increasing functional complexity.

## What Changes

- Create a responsive catalog experience with an adaptive grid, clear visual hierarchy, and category filters.
- Add a product detail page with essential information, images, and related products.
- Expose API endpoints for product listing and detail, optimized for basic filters.
- Define explicit non-goals to keep the scope focused on product discovery.

Non-goals of this proposal:

- No shopping cart.
- No user authentication.
- No payments or checkout.

## Capabilities

### New Capabilities

- `product-catalog-ui`: Responsive web interface for product exploration with listing, filters, and category navigation.
- `product-detail-page`: Detail view with product information and contextual navigation.
- `product-catalog-api`: Endpoints to list products and fetch detail by id or slug with basic filters.

### Modified Capabilities

- None.

## Impact

- Next.js Pages Router frontend: catalog, category, and detail pages.
- Next.js API routes: listing and detail endpoints.
- Prisma/PostgreSQL: product model and category/filter queries.
- Twind/Tailwind: utility-based styling for responsive layouts and visual components.
