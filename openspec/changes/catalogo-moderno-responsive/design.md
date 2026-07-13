## Context

The project uses Next.js with Pages Router, TypeScript, Prisma, and PostgreSQL. The main need is to provide a modern, responsive, and fast product catalog for initial discovery while keeping the scope focused on product discovery.

The proposal requires alignment between frontend, API, and data model to avoid early technical debt and enable future evolution of filters and categories.

## Goals / Non-Goals

**Goals:**

- Deliver a responsive catalog experience on desktop and mobile with clear navigation.
- Serve catalog and detail pages using server-rendered or hybrid strategies for performance and SEO.
- Define a product and category database model that supports category queries and basic filters.
- Expose listing and detail API endpoints aligned with UI needs.

**Non-Goals:**

- Cart, checkout, or payments.
- User sign-up, login, or profiles.
- Advanced personalization based on user history.

## Decisions

1. Catalog and detail rendering: use SSR or hybrid strategies with Pages Router.

- Rationale: improves SEO and Time To Content compared to a fully client-rendered approach.
- Alternatives considered:
  - Pure CSR: lower initial complexity, but weaker SEO and perceived performance.
  - Full SSG: fast, but less flexible for dynamic filters and frequent stock changes.

2. Initial data model in Prisma/PostgreSQL.

- Rationale: clear relational structure for products and categories with queryable filters.
- Proposed schema:
  - Product: id, unique slug, name, description, price, currency, imageUrl, active, categoryId, createdAt, updatedAt
  - Category: id, unique slug, name, createdAt, updatedAt
  - Indexes: Product(categoryId), Product(active), Product(slug)
- Alternatives considered:
  - Static JSON data: useful for quick mocks, but limits scalability and real filtering.

3. API in Next.js routes for listing and detail.

- Rationale: keep backend integrated in the same app and speed up iteration.
- Initial endpoints:
  - GET /api/products?category=<slug>&q=<text>&page=<n>&limit=<n>
  - GET /api/products/[slug]
- Alternatives considered:
  - Separate backend service: more decoupling, but higher initial overhead.

4. Styling with Tailwind/Twind utilities and a breakpoint-based responsive layout system.

- Rationale: implementation speed and visual consistency across components.
- Alternatives considered:
  - Fully modular CSS per component: more control, but slower delivery for the visual MVP.

## Risks / Trade-offs

- [Slow listing queries as the catalog grows] -> Mitigation: initial indexes and default pagination.
- [Scope drift toward full e-commerce] -> Mitigation: explicit non-goals in proposal and tasks.
- [Mismatch between API contract and frontend consumption] -> Mitigation: shared typing and parameter validation.
- [SSR overhead during traffic spikes] -> Mitigation: route caching and/or progressive hybridization with ISR.

## Migration Plan

- Create Prisma migration for Product and Category.
- Seed minimum data to validate catalog and detail behavior.
- Implement endpoints and then connect UI pages.
- Deploy in phases: first API + listing, then detail, then responsive refinements.
- Rollback: revert migration and keep a seed-data fallback in development if needed.

## Open Questions

- Should the initial filter include only category and text, or also price range in V1?
- Should we prioritize human-editable slugs or automatically derived slugs from product names?
- Should related products be based on same-category affinity or editorial rules?
