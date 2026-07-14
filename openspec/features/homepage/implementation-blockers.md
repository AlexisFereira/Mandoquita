# Homepage Implementation Blockers

Status: Complete — Requirements and Release Approved

Owner: React Frontend Architect

Last Reviewed: 2026-07-12

> **V2 synchronization (2026-07-14):** This file remains V1 release history.
> Homepage Merchandising Layout V2 is implemented and its active Backend/
> Frontend evidence lives under
> `../../changes/homepage-merchandising-layout-v2/`. HML QA and Release gates are
> still open; this V1 completion status does not close them.

## Resolved Decisions

The following earlier blockers are implemented and no longer prevent frontend
work:

- Primary contact: WhatsApp using the approved number and message.
- Featured eligibility: active products explicitly marked `featured`.
- Featured ordering: `featuredOrder ASC`, then `createdAt DESC`.
- Featured density: maximum eight on desktop and four on tablet/mobile.
- Category exploration: dedicated `/categorias/[slug]` route.
- Empty featured and category collections: omit the complete section.

## Current Frontend Resolution

The homepage payload may contain up to eight eligible featured products. React
selects the visible subset before rendering ProductCard nodes:

- viewport below 1280 CSS pixels: maximum four;
- viewport at or above 1280 CSS pixels: maximum eight.

The server snapshot renders the compact four-item subset. Wider clients enhance
to the eight-item composition after media-query evaluation. Additional products
are not inserted as hidden duplicate DOM content, so keyboard and assistive
technology traversal only reaches visible cards.

The backend now returns every category satisfying the approved eligibility
contract (`active`, `visible`, and containing an active product). React renders
the complete category collection without applying a presentation cap. Automated
homepage coverage verifies a collection larger than six remains fully
discoverable through dedicated Category Page links.

Published Featured Products without a current commercial offer remain in the
same discovery and detail paths. Shared ProductCard and Product Detail
presentation shows “Oferta no disponible actualmente”, never interpolates null
or historical price values, and omits the structured-data `Offer` when the
public contract has no current price and currency.

The application theme is fixed to light by the approved platform contract.
Bootstrap theme selection, stored legacy preferences, operating-system
preference, and context toggle behavior have been removed. Design System,
Accessibility, and QA have approved the resulting light-only implementation.

## Resolved Dependencies

### Category Count

Resolved by the backend Category discovery extension. No maximum category count
is applied by the backend or frontend.

### Wider Product Discovery Destination

Resolved by Product Requirements: a new general discovery destination is
deferred. Product Detail and dedicated Category Page routes remain the approved
paths, so frontend does not render an unsupported “view more” action.

### Historical Performance Baseline

Resolved by Project Architect decision: the validated post-refresh state is the
reference baseline for future comparisons. QA stored and approved the repeatable
responsive and route baselines under `tests/visual/`.

## Final Approval

- Product Requirements Review: Approved.
- Project Architecture Release Review: Approved.
- No implementation or cross-discipline approval dependency remains.
