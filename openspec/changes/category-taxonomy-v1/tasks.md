# Category Taxonomy V1 Tasks

Status: Complete — Release Approved

Coordinator: Project Architect

## Priority Model

- **P0:** required before implementation planning is approved.
- **P1:** implementation and integration.
- **P2:** validation, synchronization, and release.

## P0 — Product Requirements

- [x] CT-001 Validate supplied taxonomy structure, counts, identifiers, slugs, locale, order, and Active states. — 7 Categories, 16 Subcategories, and 30 Product Types pass structural validation.
- [x] CT-002 Define hierarchy, ownership, eligibility, ordering, empty-branch, and migration rules.
- [x] CT-003 Review every existing Product and approve its migration disposition. Owner: Product Requirements Architect with Project Architect. — Ten demonstration fixtures have no truthful Product Type and are explicitly retired; no production inventory was found.
- [x] CT-004 Approve continuity outcomes for existing public Category destinations. Owner: Product Requirements Architect with Project Architect. — Three legacy Category destinations lead to general Category discovery; unrelated Category redirects are prohibited.
- [x] CT-005 Complete Requirements Review after CT-003 and CT-004. Owner: Product Requirements Architect. — Complete, consistent, testable, implementation-independent, and recorded in `migration-decision.md`.

## P0 — Architecture and UX

- [x] CT-006 Architecture Review confirms the taxonomy is a reusable domain capability and approves its lifecycle boundaries. Owner: Project Architect. — Approved in `architecture-review.md`; implementation remains gated by UX reviews.
- [x] CT-007 UX Solution defines Category → Subcategory → Product exploration and empty-branch behavior. Owner: UX Solution Architect. — Approved UX contract recorded in `ux-blueprint.md`, including the general Category discovery destination, hierarchy navigation, branch filtering, empty and invalid outcomes, legacy continuity, responsive priorities, and accessibility expectations.
- [x] CT-008 UX/UI defines responsive, accessible hierarchy presentation without changing business rules. Owner: UX/UI Designer. — Approved in `ui-design.md`; the artifact defines visual hierarchy, existing-component composition, responsive grids, states, breadcrumbs, keyboard/focus behavior, reflow, touch targets, light-only presentation, and preserves all taxonomy business rules.

## P1 — Backend

- [x] CT-009 Implement the approved hierarchy and stable business identifiers. Owner: Backend Architect. — Taxonomy version 1.0.0 is active with the supplied Category/Subcategory identifiers and official Product Type leaves.
- [x] CT-010 Apply the approved existing-Product classification mapping atomically. Owner: Backend Architect. — The ten demonstration fixtures are explicitly retired; none is assigned an untruthful Product Type.
- [x] CT-011 Enforce hierarchy integrity and prevent orphan classifications. Owner: Backend Architect. — Foreign keys, uniqueness/order constraints, restrictive deletes, and the published-Product leaf check are active in PostgreSQL.
- [x] CT-012 Support Category and Subcategory discovery using published Product eligibility. Owner: Backend Architect. — Shared taxonomy and catalog services expose eligible non-empty branches and category/subcategory filters.
- [x] CT-013 Apply deterministic Category ordering and source-sequence descendant ordering. Owner: Backend Architect. — Categories use `sortOrder`; Subcategories and Product Types use `sourceOrder` with stable ID ties.
- [x] CT-014 Preserve or redirect existing public destinations according to CT-004. Owner: Backend Architect. — Permanent redirects send the three retired Category slugs to `/categorias`; former Product slugs use the standard unavailable result.
- [x] CT-015 Provide rollback and migration validation evidence. Owner: Backend Architect. — See `backend-implementation.md`; PostgreSQL validation passes 1 active version, 7/16/30 counts, ordering, retirement, invariants, and zero published orphans.

## P1 — Frontend

- [x] CT-016 Present the complete eligible Category collection in approved order. Owner: React Frontend Architect. — `/categorias` renders the uncapped service collection in supplied order and provides an empty recovery state.
- [x] CT-017 Present eligible Subcategories within their Category. Owner: React Frontend Architect. — Category pages render the eligible ordered subcategory collection before branch products.
- [x] CT-018 Preserve Product Type, Subcategory, and Category language across catalog and Product Detail. Owner: React Frontend Architect. — Product cards and Product Detail expose the inherited official hierarchy; Product Type remains non-interactive.
- [x] CT-019 Support approved Category and Subcategory destinations without dead links. Owner: React Frontend Architect. — General, Category and nested Subcategory routes are active; invalid branches recover to general Category discovery and legacy redirects remain Backend-owned.
- [x] CT-020 Preserve light-only, responsive, keyboard, focus, and semantic contracts. Owner: React Frontend Architect. — Shared layout/components, semantic breadcrumbs, one `h1`, sequential sections, 44px targets, wrapped responsive grids and existing focus/light contracts are preserved.

## P2 — QA and Documentation

- [x] CT-021 Validate all 7 Categories, 16 Subcategories, and 30 Product Types against `taxonomy.md`. Owner: QA Engineer. — PostgreSQL validation matches the complete canonical hierarchy, identifiers, slugs, ownership, sequence, order, and Active state; see `qa-review.md`.
- [x] CT-022 Validate every migrated Product has exactly one valid leaf classification. Owner: QA Engineer. — Zero published orphans, all ten approved demonstration retirements are absent, and an orphan publication attempt is rejected; see `qa-review.md`.
- [x] CT-023 Validate Category and Subcategory filtering, navigation, empty branches, inactive branches, and invalid identifiers. Owner: QA Engineer. — Service and page tests cover branch filters, eligibility, omission, ordering, and canonical recovery; see `qa-review.md`.
- [x] CT-024 Run regression validation for Homepage, Catalog, Category Page, Product Detail, Featured Products, and related Products. Owner: QA Engineer. — 23 files/108 tests, TypeScript, PostgreSQL integration, and production build pass; see `qa-review.md`.
- [x] CT-025 Synchronize Product Requirements, UX, architecture, implementation notes, tests, and canonical feature specifications. Owners: respective artifact owners. — Product, UX, architecture, Backend/API, Frontend, QA and Platform Accessibility artifacts agree with taxonomy version 1.0.0.
- [x] CT-026 Record Requirements, Architecture, Design, Frontend, Backend, Accessibility, QA, and Release approvals. Owners: respective review owners. — All discipline approvals and Project Architect Release approval are recorded; see `release-approval.md`.

## Release Gate

- [x] No publicly discoverable Product is orphaned.
- [x] No taxonomy identifier or slug collision exists.
- [x] No public destination changes without an approved continuity outcome.
- [x] Homepage and Catalog expose consistent Category eligibility.
- [x] The project remains discovery-only and light-only.
- [x] All documentation and tests agree with taxonomy version 1.0.0. — CT-025 synchronization is complete and 23 files/108 tests pass.
