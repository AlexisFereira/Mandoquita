# Homepage Implementation Blockers

Status: Complete — Requirements and Release Approved

Owner: React Frontend Architect

Last Reviewed: 2026-07-12

> **Current synchronization (2026-07-14):** This file is V1 release history and
> contains no active blocker or visual authority. Current presentation is
> governed by `merchandising-layout-v2.md` and
> `../../platform/design-system/public-catalog-visual-contract.md`. HML QA and
> Release are complete.

## Resolved Decisions

The following earlier blockers are implemented and no longer prevent frontend
work:

- Primary contact: WhatsApp using the approved number and message.
- Featured eligibility: active products explicitly marked `featured`.
- Featured ordering: `featuredOrder ASC`, then `createdAt DESC`.
- Featured density (V1 historical): maximum eight on desktop and four on
  tablet/mobile; superseded by the current responsive row and `/destacados`.
- Category exploration: dedicated `/categorias/[slug]` route.
- Empty featured and category collections: omit the complete section.

## Current Frontend Resolution

The canonical ordered Featured result feeds one responsive row: 2 items below
640px, 3 from 640px, 4 from 1024px and 6 from 1400px. The complete expanded
destination is `/destacados`; no hidden duplicate card collection is created.

The backend returns every category satisfying the approved eligibility contract
(`active`, `visible`, and containing an active product). Homepage presents the
ordered circular-link rail and guarantees access to overflow through
`/categorias` as its final `Ver todas` destination.

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
