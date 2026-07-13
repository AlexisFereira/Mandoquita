# Blocker Resolution Tasks

Status: Complete

Finalized: 2026-07-12

Coordinator: Project Architect

Source Artifacts:

- `proposal.md`
- `requirements.md`
- `design.md`
- `tasks.md`
- `ux-ui-review.md`
- `backend-implementation.md`
- `frontend-components.md`
- `../../features/homepage/proposal.md`
- `../../features/homepage/implementation-blockers.md`

## Purpose

Resolve the remaining blockers of Homepage Visual Refresh without expanding its approved visual scope or weakening the Homepage business requirements.

## Priority Model

- **P0 — Release blocker:** Required before Requirements Review or dependent work can be approved.
- **P1 — Quality gate:** Required before Accessibility, QA, or discipline reviews can be approved.
- **P2 — Release closure:** Required after P0 and P1 to synchronize evidence and obtain final approval.

## P0 — Requirements and Scope Integrity

- [x] **BRP-001 — Define atomic change requirements and acceptance criteria.** Owner: Product Requirements Architect. Outcome: completed in `requirements.md`, covering scope preservation, responsive featured-product limits, eligible categories, contact, accessibility, and traceability. Dependencies: none. Unblocks: task 8.1.

- [x] **BRP-002 — Establish independent traceability for the featured-product domain capability.** Owners: Project Architect and Product Requirements Architect. Contributor: Backend Architect. Outcome: `../../features/featured-products/proposal.md` is approved with designation authority, deterministic ordering, scope boundaries, and independent ownership. Dependencies: BRP-001. Unblocks: task 8.1 and Release Review.

- [x] **BRP-003 — Remove the unapproved six-category limit from delivered behavior.** Owner: Backend Architect. Outcome: Backend returns every eligible Category without a maximum; Frontend renders the complete collection and automated coverage verifies more than six remain discoverable. Dependencies: Homepage BR-005 and BR-007. Unblocks: tasks 7.5, 8.1, and 8.2.

- [x] **BRP-004 — Verify the approved featured-product limits.** Owner: React Frontend Architect. Reviewer: UX/UI Designer. Outcome: React renders at most eight featured products on Desktop and four on Tablet or Mobile, with no hidden duplicate content; selector and rendered-DOM tests cover both viewport outcomes. Dependencies: Homepage BR-004. Unblocks: tasks 7.5, 8.2, and 8.4.

- [x] **BRP-005 — Resolve the wider product-discovery path.** Owners: Product Requirements Architect and UX Solution Architect. Outcome: Product Requirements defers a new general destination; Product Detail and dedicated Category Page paths remain the approved discovery paths. UX-owned artifacts must synchronize this decision under BRP-009. Dependencies: Homepage BR-008. Unblocks: Design Review.

- [x] **BRP-012 — Present Featured Products without a current commercial offer correctly.** Owner: React Frontend Architect. Reviewer: QA Engineer. Outcome: ProductCard and Product Detail preserve discovery and navigation while rendering “Oferta no disponible actualmente”; unavailable products expose no historical, inferred, zero, blank, malformed, or null price, and Product JSON-LD omits `offers`. Automated component, homepage, and detail tests cover the approved outcome. Dependencies: Featured Product BR-FPC-007, BR-FPC-008, and `commercial-availability-approval.md`. Unblocks: Requirements, Frontend, and QA reviews.

## P1 — Quality Evidence

- [x] **BRP-006 — Complete WCAG AA contrast evidence.** Owner: Design System Architect. Reviewer: QA Engineer. Outcome: 28 automated contrast assertions and rendered light-only validation cover required text, status, focus, control, interaction-border, standard, and inverse-surface pairs. Dependencies: BRP-001. Unblocks: tasks 4.5 and 8.5.

- [x] **BRP-007 — Establish repeatable visual-regression coverage.** Owner: QA Engineer. Contributors: React Frontend Architect and UX/UI Designer. Outcome: eight responsive and nine route/preference baselines are stored under `tests/visual/`; component and page coverage includes a Featured Product without a current commercial offer. Dependencies: BRP-003, BRP-004, BRP-006, and BRP-012. Unblocks: tasks 6.7 and 8.6.

- [x] **BRP-008 — Resolve the missing historical baseline.** Owner: Project Architect. Contributor: QA Engineer. Outcome: the Project Architect replaces the unavailable historical comparison with a validated post-refresh reference baseline for future regression checks; task 5.7 remains a required QA deliverable under the replacement scope. Dependencies: none. Unblocks: task 5.7.

## P2 — Documentation and Approvals

- [x] **BRP-009 — Synchronize requirements and UX artifacts.** Owners: Product Requirements Architect, UX Solution Architect, and UX/UI Designer for their respective artifacts. Outcome: Product Requirements, implementation blockers, UX Solution artifacts, and `ux-ui-review.md` v4 now consistently record 8/4/4 limits, uncapped eligible Categories, deferred general discovery, and deterministic light-only presentation. Unblocks: tasks 7.5, 8.1, and 8.7.

- [x] **BRP-010 — Synchronize implementation blocker documentation.** Owner: React Frontend Architect. Outcome: `implementation-blockers.md` now records the uncapped category payload, the approved 8/4/4 behavior, the deferred general discovery destination, and only current cross-discipline validation dependencies. Dependencies: BRP-003 through BRP-005. Unblocks: tasks 7.5 and 8.4.

- [x] **BRP-011 — Record discipline approvals in lifecycle order.** Owners: Design System Architect, UX/UI Designer, React Frontend Architect, QA Engineer, and Project Architect for their respective gates. Outcome: Requirements, Design System, Design, Frontend, Accessibility, QA, and Release approvals are recorded in lifecycle order with no remaining blocker. Dependencies: BRP-001 through BRP-010. Unblocks: tasks 8.2 through 8.7.

## Validation Checklist

- [x] Every P0 task is complete before Requirements Review is reconsidered. — BRP-001 through BRP-005 and BRP-012 are complete.
- [x] Every P1 task has measurable and reproducible evidence. — Contrast and stored visual-regression evidence close BRP-006 through BRP-008.
- [x] Each owner updates only artifacts belonging to their discipline. — Final cross-discipline closure was recorded under delegated Project Architect authority.
- [x] No task expands authentication, commerce, account, payment, order, wishlist, or comparison scope. — Requirements, implementation and automated coverage preserve discovery-only behavior.
- [x] No downstream approval is recorded while an upstream dependency remains unresolved. — Requirements Review precedes Release Review and every dependency is complete.
- [x] `proposal.md`, `design.md`, `tasks.md`, and all referenced Homepage artifacts agree before Release Review. — Final synchronization audit passes.

## Recommended Execution Order

1. BRP-001 through BRP-012 are complete.
2. Requirements and Release reviews are approved.
3. No blocker-resolution work remains.
