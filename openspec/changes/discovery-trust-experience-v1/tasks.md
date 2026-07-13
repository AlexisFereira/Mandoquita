# Discovery and Trust Experience V1 Tasks

Status: Complete — Release Approved

Coordinator: Project Architect

## P0 — Product Requirements

- [x] DTE-001 Audit current Search, Header, Homepage, Design System, motion, payment, and accessibility capabilities.
- [x] DTE-002 Define coordinated scope and independent workstream boundaries.
- [x] DTE-003 Draft Search, Icon, Payment Information, and Scroll-entry Motion requirements.
- [x] DTE-004 Approve exact payment methods, official names, order, and explanatory copy. Owner: Business Representative with Product Requirements Architect. — Binance, Pago móvil, and Dólares en efectivo approved in `payment-content-decision.md` as informational content only.
- [x] DTE-005 Complete Requirements Review after DTE-004. Owner: Product Requirements Architect. — Requirements are complete, consistent, testable, implementation independent, and preserve the discovery-only boundary.

## P0 — Architecture and Platform

- [x] DTE-006 Approve umbrella architecture, ownership, dependencies, and release boundaries. Owner: Project Architect. — Approved in `architecture-review.md`; Search and Payment Information are Feature capabilities, Icons and Scroll-entry Motion are Platform capabilities.
- [x] DTE-007 Define reusable Icon Platform contract and decide source/library strategy. Owner: Design System Architect. — Design System contract completed in `openspec/platform/design-system/icon-system/`: `lucide-react` is the single wrapped glyph source, exposed through a closed semantic registry with typed decorative/informative modes, visual rules, scoped meanings, licensing/versioning rationale, and backward-compatible migration.
- [x] DTE-008 Define reusable Scroll-entry Motion Platform contract, reduced-motion behavior, progressive enhancement, and performance limits. Owner: Design System Architect with Accessibility Architect. — Joint contract complete in `openspec/platform/design-system/scroll-entry-motion/`; Design System defines progressive enhancement, lifecycle and performance limits, and Accessibility approves reduced motion, focus, semantics, reflow and assistive-technology behavior in `accessibility-review.md`.
- [x] DTE-009 Approve required Platform changes. Owner: Project Architect. Dependencies: DTE-007 and DTE-008. — Approved in `platform-approval-checklist.md`; Icon (`ICON-004`) and Scroll-entry Motion (`MOTION-004`) are reusable Platform contracts with accessible, backward-compatible implementation and rollback boundaries.

## P0 — UX and Design

- [x] DTE-010 Define Search entry, results, empty query, no-results, recovery, and responsive journeys. Owner: UX Solution Architect. — Approved in `ux-blueprint.md`: global/catalog entry, stable result context, refinement, query persistence, pagination, canonical Product results, initial/empty/invalid/no-result/loading/error outcomes, recovery, responsive priorities, and accessibility are defined without introducing suggestions, facets, personalization, or hidden-field search.
- [x] DTE-011 Define Payment Information placement, content hierarchy, contact continuation, and non-transactional interpretation. Owner: UX Solution Architect. Dependency: DTE-004. — Approved in `ux-blueprint.md`: `Medios de pago` follows Product/Category discovery and precedes Contact, preserves the exact Binance/Pago móvil/Dólares en efectivo content and order, continues through `Consultar por WhatsApp`, and defines responsive, accessible, missing-content and contact-failure outcomes without selection or transactional meaning.
- [x] DTE-012 Define accessible UI for Search, results, Icons, Payment Information, and motion-enabled sections. Owner: UX/UI Designer. Dependencies: DTE-007 through DTE-011. — Approved in `ui-design.md`: DTE-007D and DTE-012A–E define scoped Icons, responsive Search/results and states, responsive non-transactional Payment Information, and the exact eligible Homepage/Product Detail motion wrappers with explicit exclusions and accessibility boundaries.

## P1 — Backend

- [x] DTE-013 Implement canonical public Product search across approved fields and eligibility. Owner: Backend Architect. — `GET /api/products?q` now matches only name, short/complete descriptions, brand, collection, and tags while reusing canonical publication, Variant, and taxonomy eligibility.
- [x] DTE-014 Enforce query validation, deterministic matching, pagination, empty results, and public-field protection. Owner: Backend Architect. — Surrounding whitespace/case handling, pre-query invalid rejection, `name ASC, id ASC` ties, nearest-page recovery, empty successful collections, Commercial Availability protection, and hidden-field exclusion are automated.
- [x] DTE-015 Synchronize Search contracts and provide performance/rollback evidence. Owner: Backend Architect. — Canonical Search and Product Catalog contracts plus `backend-implementation.md` document migration `202607130010`, PostgreSQL evidence, a 10k/1k/concurrency-20 benchmark, and data-neutral rollback.

## P1 — Frontend and Platform Implementation

- [x] DTE-016 Implement and document the approved reusable Icon contract. Owner: React Frontend Architect. — Completed through `ICON-005`: the governed registry, discriminated component API, exact dependency, exports, notices, examples, migration guidance and automated tests are implemented in `openspec/platform/design-system/icon-system/`.
- [x] DTE-017 Implement and document the approved Scroll-entry Motion contract. Owner: React Frontend Architect. — Completed through `MOTION-005`: visible SSR defaults, shared once-only observation, cleanup, reduced-motion/focus fallbacks, bounded CSS, exports, documentation and tests are implemented.
- [x] DTE-018 Implement Search entry, stable Search Results destination, query persistence, recovery, and Product collection. Owner: React Frontend Architect. — `/buscar` provides explicit Header/Category entry, labelled validation, canonical SSR results, persisted `q`, protected empty/error/loading outcomes, responsive ProductCard collection, pagination and recovery without a competing endpoint.
- [x] DTE-019 Implement approved Icons in scoped navigation, Search, Payment Information, feedback, and metadata contexts. Owner: React Frontend Architect. — Governed decorative Icons now support Search/navigation controls, Carousel directions, Payment Information/contact, feedback, missing media and Product tags while visible text remains authoritative.
- [x] DTE-020 Implement the approved informational Payment Methods block with external-contact continuation. Owner: React Frontend Architect. — Homepage renders the exact approved heading, explanatory copy and ordered static method list immediately before Contact, with an optional labelled WhatsApp continuation, decorative governed Icons and no transactional controls or state. Covered by Homepage tests.
- [x] DTE-021 Apply Scroll-entry Motion only to approved sections without hiding required content. Owner: React Frontend Architect. — Only complete Homepage Featured/Categories Sections and Product Detail Related Products opt in; all UI-design exclusions remain immediate and visible.
- [x] DTE-022 Preserve Homepage, Catalog, Category, Product Detail, Taxonomy, Variants, Commercial Availability, discovery-only, responsive, and light-only contracts. Owner: React Frontend Architect. — Search reuses canonical Product contracts, motion excludes critical surfaces, Icons retain labels, Payment remains informational, and the post-`ICON-DS-001` suite passes with TypeScript, 26 files/148 tests and the production build.

## P2 — Validation, Documentation, and Release

- [x] DTE-023 Validate Search matching, eligibility, protection, pagination, empty/invalid queries, no results, and performance. Owner: QA Engineer. — PostgreSQL validates six public fields, eligibility, protection, pagination/recovery, invalid/empty/no-result outcomes and final-matrix p95 106.91 ms <= 150 ms; see `qa-progress.md`.
- [x] DTE-024 Validate Icon semantics, names, contrast, focus, targets, reflow, and compatibility. Owner: Accessibility Architect with QA Engineer. — Accessibility and independent QA validations pass the governed semantic, current-color, labelling and composition contracts; see Platform `accessibility-review.md` and `qa-progress.md`.
- [x] DTE-025 Validate exact Payment Information, non-transactional meaning, responsive behavior, and external contact continuation. Owner: QA Engineer. — Exact content/order, static semantics, responsive composition, decorative Icons and configured/missing contact outcomes pass; see `qa-progress.md`.
- [x] DTE-026 Validate Scroll-entry Motion, once-per-view behavior, no-script visibility, reduced motion, focus, layout stability, and performance. Owner: Accessibility Architect with QA Engineer. — Accessibility and QA browser validation pass at 320/768/1440 px with once-only reveal, no-script/reduced-motion visibility, stable focus/geometry, CLS 0, no overflow and 139–298 ms navigation; see `qa-progress.md`.
- [x] DTE-027 Run full regression, TypeScript, integration, and production-build validation. Owner: QA Engineer. — Final verification passes 26 files/148 tests, TypeScript and production build; Search, taxonomy, Product content/seed and stabilized lifecycle evidence remain approved in `qa-progress.md`.
- [x] DTE-028 Synchronize Search, Homepage, Product Catalog, Product Detail, Architecture, Design System, Accessibility, API, and project context artifacts. Owners: respective artifact owners. — Approved in `documentation-sync-review.md`; canonical Feature, Platform, architecture, accessibility and project documents agree with implementation and the 150 ms Search gate.
- [x] DTE-029 Record Requirements, Architecture, UX, Design, Backend, Frontend, Platform, Accessibility, QA, and Release approvals. Owners: respective review owners. — All discipline, Icon Platform, Motion Platform and final Project approvals are recorded in `release-approval.md` and the linked review artifacts.

## Release Gates

- [x] Search returns only eligible public Products and no internal fields.
- [x] Empty and no-result searches provide approved recovery.
- [x] Every Icon use has correct decorative or informative semantics.
- [x] Payment Information exactly matches approved business content and initiates no transaction.
- [x] Scroll-entry Motion never gates content and reduced-motion behavior passes.
- [x] Existing discovery-only, taxonomy, Variant, commercial, responsive, accessibility, and light-only contracts pass.
- [x] Documentation, tests, and implementation agree.
