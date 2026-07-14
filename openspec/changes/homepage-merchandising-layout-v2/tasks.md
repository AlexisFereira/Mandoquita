# Homepage Merchandising Layout V2 — Assigned Tasks

Status: Complete — Release Approved

Coordinator: Project Architect

## P0 — Product Requirements and Architecture

- [x] HML-001 Exact order, retained Contact/Footer, scope, exclusions and success criteria approved in `requirements.md`. Owner: Product Requirements Architect.
- [x] HML-002 6/4/3/2 ranges, uncapped Categories, released Featured limits and stable six-Product selected section approved. Owner: Product Requirements Architect.
- [x] HML-003 Eligible Category, daily Bogotá rotation, no immediate repeat, canonical maximum-six Products and omission approved. Owner: Product Requirements Architect with Project Architect.
- [x] HML-004 Existing static three-slide source/fallback and permanent separate-Hero supersession approved. Owner: Product Requirements Architect.
- [x] HML-005 Requirements Review completed in `requirements-review.md`. Owner: Product Requirements Architect.
- [x] HML-006 Optional opt-in Platform 1400px Container approved without changing defaults/consumers. Owner: Project Architect with Design System Architect.
- [x] HML-007 Server-owned deterministic selection, SSR/hydration/cache boundary and Backend responsibility approved in `architecture-review.md`. Owner: Project Architect with Backend Architect.

## P0 — UX, Design System and Accessibility

- [x] HML-008 Define complete Homepage journey, hierarchy, section transitions and empty/error recovery. Owner: UX Solution Architect. — Completed in `ux-blueprint.md`: exact Banner/Categories/Featured/Payment/selected-Category/Contact/Footer hierarchy, zero/one/multiple Banner, clean omission matrix, shared daily discovery interpretation, stable collection membership, responsive 6/4/3/2 priorities, accessibility and safe error recovery are implementation-ready without personalization or payment behavior.
- [x] HML-009 Review/add optional 1400px Container and 6/4/3/2 responsive grid contracts without changing existing consumers. Owner: Design System Architect. — Approved in `design-system-review.md`; the independent Platform `merchandising-layout-contract` completed MLC-005–MLC-012 and is released.
- [x] HML-010 Review full-width Banner Slider composition, image ratios, crop, controls, autoplay, motion and content safety. Owner: Design System Architect. — Approved in `design-system-review.md`; the released promotional Carousel is sufficient through full-bleed composition with 16:9 focal-safe media, HTML meaning, safe controls and unchanged motion behavior.
- [x] HML-011 Design Banner Slider, Categories, Featured, Payment Banner and random-Category section in exact order. Owner: UX/UI Designer. — Completed in `ui-design.md`: exact section hierarchy, full-width content-safe Banner, wide Container rhythm, uncapped Categories, governed Featured membership, informational Payment Banner, shared daily Category discovery, 6/4/3/2 layouts, omission and responsive states are implementation-ready.
- [x] HML-012 Complete Accessibility Review for landmarks/headings, Carousel controls, grid reading order, 320px, zoom, targets, contrast, reduced motion and light-only behavior. Owner: UX/UI Designer with Accessibility Review. — Approved in `accessibility-design-review.md`; rendered evidence is complete under HML-023.

## P1 — Backend and Frontend

- [x] HML-013 Implement deterministic eligible-Category rotation and Product projection with stable SSR/cache behavior. Owner: Backend Architect. — `homepageService` composes one repeatable-read SSR projection, uses the Bogotá day, stable IDs, consecutive-day modulo rotation, maximum six canonical Products and no-store eligibility-safe SSR; evidence is in `backend-implementation.md`.
- [x] HML-014 Preserve Category/Featured/Product eligibility and deterministic ordering contracts. Owner: Backend Architect. — Candidate and membership reads reuse canonical taxonomy/catalog services; released Featured predicates/order/limit and selected `createdAt DESC, id ASC` order are automated.
- [x] HML-015 Implement Homepage 1400px composition and exact section order. Owner: React Frontend Architect. — Implemented with opt-in wide Containers and one canonical DOM flow.
- [x] HML-016 Replace separate Hero with full-width Banner Slider using the approved Carousel contract. Owner: React Frontend Architect. — Hero removed; released Carousel is full-width with semantic HTML content and stable responsive frame.
- [x] HML-017 Implement approved 6/4/3/2 Category and Product grids without duplicate responsive DOM. Owner: React Frontend Architect. — All governed collections use one semantic `CollectionGrid` list.
- [x] HML-018 Restyle Payment Information as the approved Banner without changing content or adding payment logic. Owner: React Frontend Architect. — Exact three-method informational Banner has no transaction/contact controls.
- [x] HML-019 Implement the identified random-Category Product section and omit/recovery outcomes. Owner: React Frontend Architect. — Server-selected projection, canonical continuation and clean null/empty omission are implemented without client reroll.
- [x] HML-020 Add component/page tests for order, width, grid density, rotation stability, empty state, Carousel and payment meaning. Owner: React Frontend Architect. — Homepage, layout, Carousel and backend rotation tests pass.

## P2 — QA, Documentation and Release

- [x] HML-021 Validate exact section order, 1400px maximum and 6/4/3/2 outcomes at representative widths. Owner: QA Engineer. — Approved in `qa-review.md`; the exact order, full-width Carousel, 1400px boundary and 2/3/4/6 grids pass in production Chrome.
- [x] HML-022 Validate deterministic Category rotation across SSR/hydration/cache interval and eligible Product membership. Owner: QA Engineer. — Same-day SSR navigations and hydration retain Category/Product IDs; Bogotá rollover, consecutive-day rotation, canonical order, maximum six and eligibility pass automated and database-backed checks.
- [x] HML-023 Validate Carousel, accessibility, responsive/reflow, visual hierarchy, light-only and reduced-motion behavior. Owner: Accessibility Review with QA Engineer. — Accessibility and QA approve 320/640/1024/1400px, effective 200% reflow, semantic tree/order, 44px targets, light-only presentation, reduced motion and stopped autoplay.
- [x] HML-024 Regression-test Search, Category, Product Detail, Featured, Payment Information and performance/layout shift. Owner: QA Engineer. — 214 tests plus taxonomy, Product content, publication and Search integrations pass; Payment meaning is exact, CLS is 0 and the isolated production build succeeds.
- [x] HML-025 Synchronize Homepage, Carousel, Container/Grid, Payment, Category/Product and project-context documentation. Owners: respective owners. — Approved in `documentation-sync-review.md`; canonical V2 amendment, V1 supersession notices, Platform layout, Carousel placement, Architecture and project context agree with implementation.
- [x] HML-026 Record discipline and final Release approvals. Owner: Project Architect with review owners. — Approved in `release-approval.md`; all discipline, Platform, QA and documentation evidence passes, including current TypeScript and 46 focused tests.

## Release Gates

- [x] Requirements define stable daily selection and grid applicability.
- [x] 1400px capability is approved as opt-in and does not silently change existing pages; implementation evidence remains HML-009/021/024.
- [x] Exact Homepage order passes.
- [x] Banner Slider is full-width, accessible and motion-safe.
- [x] Category/Product grids pass 6/4/3/2 and 320px/200% validation.
- [x] Payment Banner remains informational and exact.
- [x] Public eligibility, SSR/hydration and performance regressions pass.
