# Product Content and Variants V1 Tasks

Status: Complete — Release Approved

Coordinator: Project Architect

## P0 — Product Requirements

- [x] PCV-001 Compare the supplied Product schema with the current Product domain.
- [x] PCV-002 Define adopted, preserved, deferred, and rejected capabilities.
- [x] PCV-003 Draft Product Variant, Image, metadata, SEO, compatibility, and migration requirements.
- [x] PCV-004 Approve one unique migration SKU for every existing Product. Owner: Business Representative with Product Requirements Architect. — Complete with an empty business migration set; active seed contains no Products and test fixtures are excluded.
- [x] PCV-005 Approve the initial Variant Attribute vocabulary and value normalization rules. Owner: Product Requirements Architect. — Talla, Color, Material, Capacidad, and Presentación approved in `product-decisions.md`.
- [x] PCV-006 Decide the business label and public behavior for a Product with one non-selectable migration Variant. Owner: Product Requirements Architect. — Base Variant approved; it has a unique SKU and is never presented as an option selector.
- [x] PCV-007 Complete Requirements Review after PCV-004 through PCV-006. Owner: Product Requirements Architect. — Requirements are complete, consistent, testable, and implementation independent.

## P0 — Architecture, UX, and Design

- [x] PCV-008 Approve Product, Product Variant, Product Image, and SEO capability boundaries. Owner: Project Architect. — Approved in `architecture-review.md`; Product remains the aggregate boundary and deferred operational capabilities remain excluded.
- [x] PCV-009 Define Variant and gallery visitor journeys, including a Product with one non-selectable Variant. Owner: UX Solution Architect. — Approved UX contract recorded in `ux-blueprint.md`, covering Product Detail hierarchy, ordered gallery behavior, Variant-associated Images, meaningful multi-Variant choices, one non-selectable Base Variant, indistinguishable and inactive outcomes, metadata, responsive priorities, accessibility, and error/recovery behavior without transactional expansion.
- [x] PCV-010 Define accessible responsive gallery, Variant options, metadata, and error/recovery presentation. Owner: UX/UI Designer. — Approved in `ui-design.md` using the authorized Carousel gallery, Chip option and polite-status contracts. Responsive layouts, media and option states, metadata hierarchy, error/recovery behavior, UX writing and WCAG requirements are implementation-ready without changing Product rules.
- [x] PCV-011 Review whether existing Design System composition is sufficient or a separate Platform change is required. Owner: Design System Architect. — Existing composition is insufficient as a supported contract. Independent Platform change opened at `openspec/platform/design-system/product-gallery-variant-controls/`; it extends `Carousel` with a controlled non-autoplay gallery mode and `Chip` with grouped option semantics while keeping Product domain logic outside Platform.

Execution order: PCV-008 first; PCV-009 and PCV-011 may proceed after Architecture approval; PCV-010 depends on PCV-009 and PCV-011.

## P1 — Backend

- [x] PCV-012 Implement Product Variant ownership, stable identity, unique SKU, attributes, reference, barcode, and Active state. Owner: Backend Architect. — Implemented with database-enforced ownership, unique SKU and approved typed attribute vocabulary.
- [x] PCV-013 Implement ordered Product Image ownership, Primary uniqueness, alternative text, and Variant Image integrity. Owner: Backend Architect. — Ordered positions, partial Primary uniqueness and composite same-Product Image reference are enforced in PostgreSQL.
- [x] PCV-014 Implement short description, brand, collection, gender applicability, tags, and SEO content. Owner: Backend Architect. — Optional content and normalized Product-owned tags are persisted and exposed through safe public contracts.
- [x] PCV-015 Preserve taxonomy inheritance and independent Product state contracts. Owner: Backend Architect. — Product Type remains the only classification leaf; Variant Active is independent and Commercial Availability still protects price/currency.
- [x] PCV-016 Migrate every existing Product using only approved SKUs, attributes, and media dispositions. Owner: Backend Architect. — Migration 007 activated against the approved empty inventory without fabrication; the approved replacement 47-row inventory seed and publication are recorded in `product-seed-review.md`.
- [x] PCV-017 Synchronize public Product listing and detail contracts without exposing deferred operational data. Owner: Backend Architect. — Gallery, metadata, SEO and visitor-safe Variant outcomes are additive; SKU, barcode, reference and operational fields remain internal.
- [x] PCV-018 Provide migration rollback, integrity, and performance evidence. Owner: Backend Architect. — See `backend-implementation.md` and `backend-review.md`; PostgreSQL validations and post-publication p95 35.24 ms benchmark pass.

Backend implementation is assigned but blocked until PCV-008 is approved. Visitor-facing contract work also depends on PCV-009 through PCV-011.

## P1 — Frontend

- [x] PCV-019 Present Product gallery using approved order, Primary outcome, and missing-media behavior. Owner: React Frontend Architect. — Product Detail uses the released non-autoplay gallery with Backend order, Primary initial media, approved alternative text, direct controls and stable missing/failed-media outcomes.
- [x] PCV-020 Present meaningful Variant choices without fabricating a choice for a single migration Variant. Owner: React Frontend Architect. — Selectable outcomes use labelled controlled groups, dependent valid-combination states, read-only single meaningful characteristics and no UI for Base or content-correction outcomes.
- [x] PCV-021 Present approved short description and merchandising metadata without competing with taxonomy. Owner: React Frontend Architect. — Short and complete descriptions, brand, collection, localized applicability and non-interactive tags follow the approved hierarchy while taxonomy remains primary.
- [x] PCV-022 Preserve Product-level Commercial Availability, public price protection, Featured behavior, and light-only contracts. Owner: React Frontend Architect. — Existing `ProductOffer`, Backend-protected price fields, Featured consumers, semantic tokens and deterministic light-only presentation remain unchanged.
- [x] PCV-023 Synchronize Homepage, Product Catalog, Product Detail, Search, Featured Products, and Related Products. Owner: React Frontend Architect. — Shared `ProductCard` consumes Primary/first media, approved alt text, short-description priority and missing-media behavior across every listing consumer; Product Detail consumes the additive detail contract.

Frontend implementation is assigned but blocked until PCV-008 through PCV-018 provide approved architecture, UX, Design System, and Backend contracts.

## P2 — QA, Documentation, and Release

- [x] PCV-024 Validate SKU uniqueness, Variant ownership, attribute consistency, and migration completeness. Owner: QA Engineer. — PostgreSQL validates ownership, global/non-empty SKU, approved typed attributes, Base behavior, state independence and zero incomplete Published Products; see `qa-review.md`.
- [x] PCV-025 Validate Image ownership, order, Primary uniqueness, alternative text, missing media, and Variant association. Owner: QA Engineer. — PostgreSQL and public-contract checks cover ordering, uniqueness, ownership, non-empty media, cross-Product rejection and missing media; see `qa-review.md`.
- [x] PCV-026 Validate metadata, SEO, taxonomy preservation, state independence, and price protection. Owner: QA Engineer. — Content/SEO, normalized tags, Taxonomy V1, independent states, null protected prices and forbidden public fields pass; see `qa-review.md`.
- [x] PCV-027 Run cross-feature regression, accessibility, responsive, performance, and production-build validation. Owner: QA Engineer. — 23 files/119 tests, TypeScript, build, PGOC contracts and PostgreSQL p95 42.26 ms <= 50 ms pass; see `qa-review.md`.
- [x] PCV-028 Synchronize canonical Product, Catalog, Detail, Search, API, Architecture, Accessibility, and Design System artifacts. Owners: respective artifact owners. — Approved in `documentation-sync-review.md`; canonical artifacts agree with implementation and tests.
- [x] PCV-029 Record Requirements, Architecture, UX, Design, Backend, Frontend, Accessibility, QA, and Release approvals. Owners: respective review owners. — All discipline approvals and Project Architect Release approval are recorded; see `release-approval.md`.

QA begins after Backend and Frontend implementation evidence is available. Documentation synchronization and Release approval remain final gates.

## Release Gates

- [x] Every migrated Product has at least one approved Product Variant.
- [x] Every SKU is globally unique.
- [x] No Variant or Image violates Product ownership.
- [x] No Product has more than one Primary Image.
- [x] Taxonomy and independent Product states remain unchanged.
- [x] No inventory, cost, tax, supplier, warehouse, or logistics data is exposed.
- [x] Documentation, tests, and implementation agree. — PCV-028 synchronization approved.
