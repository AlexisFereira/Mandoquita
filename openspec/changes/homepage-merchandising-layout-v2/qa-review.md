# Homepage Merchandising Layout V2 — QA Review

Status: HML-021–HML-024 Approved

Owner: QA Engineer

Date: 2026-07-14

## Rendered acceptance

The isolated production build passed the browser validator at 320, 640, 1024
and 1400 CSS px. The canonical order is Banner, Categories, Featured, Payment,
selected-Category Products, Contact and Footer. The Banner remains full-width;
all other governed regions remain centered within 1400px. Category and Product
lists render 2/3/4/6 columns, preserve one semantic DOM order and do not overflow.

The same run validates the accessibility-tree hierarchy, 44px minimum targets,
light-only presentation even under a forced dark preference, reduced-motion
transitions and stopped autoplay, the exact three informational payment methods,
canonical Product/Category links, zero CLS and 200% effective reflow without
horizontal overflow. Navigation duration in the configured production/database
environment ranged from 3.935s to 4.147s; the requirements define no numeric
load-time threshold.

## Rotation, rendering and eligibility

Repeated no-store SSR navigations for the same Bogotá day produced the same
selected Category and ordered Product links after hydration at every viewport.
Automated service coverage validates the Bogotá midnight boundary, same-day
stability, no consecutive-day repeat with unchanged multiple candidates,
repeatable-read composition, canonical public ordering and the six-Product cap.
The production response returns `Cache-Control: private, no-store`, preventing
stale eligibility exposure.

## Regression evidence

- `npm test`: 38 files, 214 tests passed.
- `npx tsc --noEmit`: passed.
- Isolated optimized production build: passed.
- Taxonomy integration: 7 Categories, 16 Subcategories, 30 Product Types and no
  published taxonomy orphans.
- Product-content integration: ownership, SKU, media, metadata, state and public
  contracts passed.
- Publication seed integration: 47 published Products, 47 exact taxonomy leaves,
  47 Base Variants/SKUs and 16 deterministic Featured Products passed.
- Public Search integration: passed.
- Browser validator: `scripts/validate-homepage-merchandising-browser.cjs`.

HML-021–HML-024 are approved. Platform MLC-010/MLC-012 and final Homepage
approval HML-026 were subsequently approved; the feature is released.
