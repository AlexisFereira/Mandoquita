# Catalog Media Admin V1 — Assigned Tasks

Status: QA Approved — Deployment, Documentation and Release Pending

Coordinator: Project Architect

Date: 2026-07-13

## Priority Model

- P0: business, architecture, security and experience decisions required before
  implementation.
- P1: Backend and Frontend implementation after P0 approval.
- P2: independent validation, documentation and Release.

## P0 — Product Requirements

- [x] CMA-001 Approve the business problem, actors, included scope and explicit exclusions in `proposal.md`. Owner: Product Requirements Architect. — Approved: existing Product/Category media management only; Variant reassignment, media editing, external URLs, media library, bulk operations and non-raster media remain excluded.
- [x] CMA-002 Approve Product gallery and single Category Image ownership, validity and public-consumption requirements. Owner: Product Requirements Architect. — Product owns its complete ordered zero-or-more Image collection; Category owns one optional Image; neither entity requires an Image or Primary Image to remain valid.
- [x] CMA-003 Decide Product Image maximum count, removal behavior, Primary outcome and Variant-referenced Image rule. Owner: Product Requirements Architect with Project Architect. — No Product business maximum is introduced; referenced removal is rejected, stable replacement is allowed, and removing/demoting Primary never promotes another Image implicitly.
- [x] CMA-004 Approve alternative-text rules, Category removal scope and accepted media business boundary. Owner: Product Requirements Architect with Accessibility Review. — Category removal is included; new/replaced meaningful raster media requires 1–240 trimmed characters of contextual alternative text; legacy Category media remains valid until changed.
- [x] CMA-005 Complete Requirements Review with atomic, testable requirements, business rules, acceptance criteria, edge cases and no implementation decisions. Owner: Product Requirements Architect. — Approved in `requirements-review.md`: 16 FR, 16 BR, 13 AC, NFR, edge cases, dependencies and traceability pass the Requirements gate.

## P0 — Architecture and Security

- [x] CMA-006 Approve Product as Product Image aggregate owner and Category as its single Image owner without introducing a cross-catalog media aggregate. Owner: Project Architect. — Approved in `architecture-review.md`: Product and Category retain independent aggregate ownership; temporary Media Upload is not a public/catalog aggregate.
- [x] CMA-007 Define session-authorized media read/upload/change boundaries without exposing `PRODUCT_WRITE_API_KEY`, AWS credentials or reusable storage authorization to the browser. Owner: Project Architect with Backend Architect. — Approved capability families reuse the managed-edge Product Admin session, Origin/CSRF, throttling, audit and response headers while the operator endpoint remains separate.
- [x] CMA-008 Decide upload-to-association transaction boundaries, idempotency, stable replacement identity, orphan cleanup and storage deletion/retention. Owner: Backend Architect with Project Architect. — Approved two-phase persisted lifecycle: 24-hour session-bound temporary uploads, atomic aggregate association, stable Product Image replacement, idempotent compensation and seven-day superseded-object retention.
- [x] CMA-009 Approve S3 namespace separation, IAM least privilege, checksum/type/size verification, versioned delivery URLs and CDN/cache behavior for Product and Category Images. Owner: Backend Architect with Deployment/Security Owner. — Architecture profile approved with immutable UUID keys, Product/Category namespaces, IAM Role, bounded validated raster content, metadata stripping, encryption and immutable delivery; production evidence remains CMA-039/CMA-042.
- [x] CMA-010 Define optimistic concurrency, safe audit fields, throttling/resource limits, failure outcomes and rollback for every Media Change. Owner: Project Architect with Backend Architect. — Product/Category/Image baselines, complete-list reorder, session-bound idempotency, safe audit allowlist, governed HTTP outcomes and non-destructive rollback are approved in `architecture-review.md`.
- [x] CMA-011 Complete Architecture and Security Review and confirm the Product Admin managed-edge release dependency. Owner: Project Architect / Security Architecture. — Approved in `architecture-review.md`; managed-edge and storage deployment attestation remain mandatory Release evidence.

## P0 — UX Solution and Design

- [x] CMA-012 Define the Product gallery administration journey for add, preview, alternative text, reorder, Primary, replace, referenced-removal denial and recovery. Owner: UX Solution Architect. — Completed in `ux-blueprint.md`: complete and empty galleries, two-phase add, accessible atomic reorder, explicit Primary/no-Primary, stable replacement, referenced-removal denial, unreferenced removal and recovery are implementation-ready.
- [x] CMA-013 Define the Category collection/editor journey for current Image, upload, replacement, alternative text, optional removal and recovery. Owner: UX Solution Architect. — Completed in `ux-blueprint.md`: Category collection, no-Image, current/legacy Image, upload, replacement, alternative-text update, optional removal and recovery remain distinct from Product media and preserve taxonomy state.
- [x] CMA-014 Define upload progress, validation, retry, cancellation, unsaved change, conflict, expired-session and storage-unavailable outcomes without changing business rules. Owner: UX Solution Architect. — Completed in `ux-blueprint.md`: temporary upload versus confirmed catalog state, validation, progress, cancel/discard, idempotent retry expectations, dirty-state protection, conflict reload, session expiry and storage failure outcomes are defined without expanding Product or Architecture rules.
- [x] CMA-015 Review Design System sufficiency for file input, image preview, gallery ordering controls, Primary selection, destructive confirmation, status and error composition. Owner: Design System Architect. — Approved in `design-system-review.md`: existing Carousel inspection mode, Input, Button, Card, Icon, PoliteStatus, semantic tokens and native file/radio/progress/dialog/list/error composition are sufficient. Carousel remains non-editing; keyboard move controls, text-first Primary/progress/state rules, destructive confirmation, responsive/accessibility boundaries and future Platform-change triggers are defined with no reusable V1 gap.
- [x] CMA-016 Design responsive Product media administration using only the approved requirements and Design System contracts. Owner: UX/UI Designer. — Completed in `ui-design.md`: Product gallery review, add, alternative text, accessible ordering, explicit Primary selection, stable replacement, protected removal, responsive measurements and recovery states are implementation-ready.
- [x] CMA-017 Design responsive Category media administration and clear Product/Category context separation. Owner: UX/UI Designer. — Completed in `ui-design.md`: the separate Category collection and single optional Image editor cover add, legacy text, replacement, removal, responsive layout and taxonomy-preserving outcomes without Product controls.
- [x] CMA-018 Complete joint Design/Accessibility Review for keyboard upload, preview semantics, alternative-text association, ordering, focus, progress/status, touch targets, 320px reflow, 200% zoom and light-only presentation. Owner: UX/UI Designer with Accessibility Review. — Joint design approval is recorded in `ui-design.md` and `accessibility-design-review.md`; rendered implementation validation remains governed by CMA-038.

## P1 — Backend

- [x] CMA-019 Implement session-authorized media upload behind the existing managed-edge, Origin, CSRF, session and no-cache boundary; retain the operator-only endpoint as a separate contract. Owner: Backend Architect. — Implemented at `/api/admin/media-uploads`; `/api/internal/images` remains operator-only.
- [x] CMA-020 Implement authorized Product Image administrative read and strict add/metadata/replace/remove contracts with exact response allowlists. Owner: Backend Architect. — Implemented and published in `backend-contract.md` without object keys or related internals.
- [x] CMA-021 Implement atomic Product Image reorder and Primary designation while preserving unique positions and at-most-one Primary. Owner: Backend Architect. — Complete-list mutation uses collision-safe temporary positions and the existing partial unique Primary constraint.
- [x] CMA-022 Preserve stable Product Image identity on replacement and reject removal while referenced by a Variant. Owner: Backend Architect. — Replacement updates the existing Image row; removal checks and database RESTRICT preserve Variant references.
- [x] CMA-023 Implement authorized Category media read/upload/replace/alternative-text/remove contracts without changing taxonomy identity or eligibility. Owner: Backend Architect. — Category collection/single-Image routes expose and mutate only approved media fields.
- [x] CMA-024 Implement file signature/type/size/checksum validation, non-overwriting object keys, Product/Category namespaces and least-privilege storage behavior. Owner: Backend Architect. — Sharp decoding/re-encoding enforces type, size, 40 MP/12,000 px, metadata stripping, checksum and immutable separate namespaces.
- [x] CMA-025 Implement stale-change protection, idempotent retry, orphan cleanup, approved deletion/retention, safe audit and governed error outcomes. Owner: Backend Architect. — Mandatory baselines, 24-hour idempotency, persisted cleanup/retention, safe audit, rate limits and governed responses are implemented.
- [x] CMA-026 Add any approved persistence constraints/migration and provide rollback, storage, security and performance evidence. Owner: Backend Architect. — Migration 012 is applied and all 13 AWS PostgreSQL migrations are current. The real validator uploaded/cleaned five immutable Product/Category objects, proved aggregate/idempotency/reference/retention behavior and measured concurrency-10 p95 327.03 ms; post-run residue counts are zero.

## P1 — React Frontend

CMA-027 through CMA-034 are unblocked: Backend completed CMA-019 through CMA-026
and published the executable upload, Product media and Category media contracts
in `backend-contract.md`.

- [x] CMA-027 Add Media administration to the isolated `/admin` information architecture without exposing it in public navigation. Owner: React Frontend Architect. — The private shell now exposes Products and `Imágenes de categorías`; Product summaries/editor link to media without changing public navigation.
- [x] CMA-028 Implement Product gallery review with ordered previews, alternative text, Primary and Variant-reference context. Owner: React Frontend Architect. — One native ordered list presents persisted previews, meaningful text, position, Primary and explicit Variant-reference context.
- [x] CMA-029 Implement Product Image upload, validation, progress, retry and confirmed association. Owner: React Frontend Architect. — Native one-file selection, approved type/text validation, indeterminate labelled progress, temporary-ready state and separate confirmed association are implemented.
- [x] CMA-030 Implement accessible reorder, Primary, alternative-text, replacement and permitted removal actions with dirty-state protection. Owner: React Frontend Architect. — Text-first move controls, complete atomic order, explicit no-Primary radio, metadata/replacement and referenced-aware confirmation flows are implemented with unload/return protection.
- [x] CMA-031 Implement existing Category selection and single-Image upload/replacement/alternative-text/removal flow. Owner: React Frontend Architect. — A separate searchable Category collection and optional single-Image editor implement every approved action without taxonomy mutation controls.
- [x] CMA-032 Implement conflict, authorization expiry, invalid media, storage failure, referenced-removal denial and safe reload recovery. Owner: React Frontend Architect. — Governed 400/401/403/404/409/413/429/502/503 recovery preserves confirmed state, reloads safely and removes stale authorized UI on expiry.
- [x] CMA-033 Preserve responsive, keyboard, focus, status, reduced-motion and deterministic light-only contracts. Owner: React Frontend Architect. — Native controls, single responsive DOM, 44px shared actions, focusable summaries, polite status, wrapping grids and released light-only/reduced-motion foundations are preserved.
- [x] CMA-034 Add route/component tests for Product and Category media success, validation, replacement, ordering, Primary, conflict, expiry, failure and responsive composition. Owner: React Frontend Architect. — `tests/ui/catalog-media-admin.test.tsx` covers gallery semantics, reference denial, complete reorder/idempotency, temporary/confirmed upload, Category removal and expiry; the full suite passes 34 files / 193 tests.

## P2 — QA, Documentation and Release

- [x] CMA-035 Validate server-only secrets, managed-edge/session authorization, Origin/CSRF, file signature/type/size limits, throttling and fail-closed storage configuration. Owner: QA Engineer with Security Review. — Approved in `qa-review.md`; bundle allowlists, session/security tests and fail-closed storage behavior pass. Actual production edge/IAM attestation remains CMA-042 Deployment evidence.
- [x] CMA-036 Validate Product Image ownership, positions, Primary uniqueness, stable replacement identity, Variant-reference protection, removal and concurrency. Owner: QA Engineer. — Real PostgreSQL/S3 validation proves aggregate ownership, order/Primary invariants, stable replacement, reference denial, idempotency and concurrency.
- [x] CMA-037 Validate Category upload, replacement, alternative text, removal, taxonomy preservation and public Category discovery. Owner: QA Engineer. — Real Category media mutations and Taxonomy/public discovery regression pass without identity or eligibility changes.
- [x] CMA-038 Validate keyboard, screen-reader names/descriptions/status, focus recovery, progress, ordering controls, 320px reflow, 200% zoom, touch targets and light-only presentation. Owner: Accessibility Review with QA Engineer. — Accessibility implementation review and independent production-build Chrome validation at 320/768/1440 px pass; named semantics, status/focus contracts, no overflow and targets >=44 px are recorded in `qa-review.md`.
- [x] CMA-039 Validate real or production-equivalent storage upload, checksum, unique keys, orphan cleanup, deletion/retention, CDN freshness, rollback and representative performance. Owner: QA Engineer with Backend and Deployment Owners. — Configured AWS PostgreSQL/S3 validation uploaded/cleaned five immutable objects, proved lifecycle/rollback invariants and measured concurrency-10 p95 325.42 ms; production CDN/IAM scheduling remains Deployment evidence.
- [x] CMA-040 Regression-test Homepage, Catalog, Search, Categories, Product Detail, Variants, Featured Products, Product Admin scalar editing and public discovery eligibility. Owner: QA Engineer. — Full 193-test suite, build/typecheck, Taxonomy, Product Content/Variants, 47-Product publication and Product Admin integrations pass.
- [ ] CMA-041 Synchronize Product, Category, API, storage, Architecture, Accessibility, Design System, deployment and project-context documentation. Owners: respective artifact owners. — Frontend and Accessibility artifacts are synchronized; remaining owners must complete their release documentation.
- [ ] CMA-042 Record Requirements, Architecture, UX/UI, Design System, Backend, Frontend, Accessibility, Security, QA, Deployment and Release approvals. Owners: respective review owners; final gate by Project Architect. — Frontend, Accessibility and QA approval evidence are recorded; Security, Deployment and final Release approval remain pending.

## Release Gates

- [x] Requirements and Architecture decisions are complete before implementation. — Approved in `requirements-review.md` and `architecture-review.md`.
- [x] Browser code, URLs, storage and logs expose no administrative or storage secret. — Bundle scan, exact response allowlists and safe-audit tests pass.
- [ ] Production media administration remains behind the approved managed edge and temporary server session.
- [x] Invalid or failed Media Changes never partially mutate catalog state. — Atomicity, stale-write and idempotency validation pass.
- [x] Product ownership, unique order, Primary uniqueness and Variant references remain valid. — Real aggregate validation passes.
- [x] Category taxonomy identity and discovery eligibility remain unchanged by media administration. — Media mutation and Taxonomy regression pass.
- [x] New/replaced meaningful media has approved alternative text. — Server validation and accessible UI association pass.
- [x] Storage objects have approved orphan, replacement, deletion and rollback behavior. — Real S3 lifecycle validation and cleanup pass.
- [x] Responsive and Accessibility validation passes. — Accessibility review and independent Chrome matrix pass.
- [x] Public catalog and existing Product Admin regression passes. — Functional and PostgreSQL integration matrix passes.
- [ ] Documentation, implementation, storage evidence and tests agree.

## Current Critical Path

1. Respective owners synchronize remaining documentation in CMA-041.
2. Deployment attests the production managed edge, IAM/CDN and cleanup schedule.
3. Project Architect records CMA-042 cross-discipline and final Release approval.
