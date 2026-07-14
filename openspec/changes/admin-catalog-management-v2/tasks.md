# Admin Catalog Management V2 — Assigned Tasks

Status: Release Candidate Approved — Production Activation Pending

Coordinator: Project Architect

## P0 — Product Requirements

- [x] ACM-001 Scope, actors, value and explicit exclusions approved in `proposal.md` and `requirements.md`. Owner: Product Requirements Architect.
- [x] ACM-002 Named-account, username-normalization and disablement baseline approved, then superseded for account ownership by ACM-038. Owner: Product Requirements Architect with Project Architect/Security.
- [x] ACM-003 Product minimum fields, explicit Base SKU/Variant and safe initial states approved. Owner: Product Requirements Architect.
- [x] ACM-004 Reversible Product retirement, restoration, retained relations/media and slug continuity approved. Owner: Product Requirements Architect with Project Architect.
- [x] ACM-005 Active-taxonomy Category create/edit/retire/restore, ordering, dependency and slug rules approved. Owner: Product Requirements Architect with Project Architect.
- [x] ACM-006 Requirements Review approved with FR, BR, AC, NFR, edge cases and traceability in `requirements-review.md`. Owner: Product Requirements Architect.

## P0 — Architecture and Security

- [x] ACM-007 Hard cutover to named username/password accounts and legacy-session invalidation approved. Owner: Project Architect / Security Architecture.
- [x] ACM-008 Hash, password, throttle, session, rotation, bootstrap and safe-audit boundaries approved in `architecture-review.md`; Superadministrator management is amended by ACM-039. Owner: Project Architect with Backend Architect.
- [x] ACM-009 Product and Category aggregate/command/API boundaries approved. Owner: Project Architect with Backend Architect.
- [x] ACM-010 Additive persistence/migration, integrity, reserved slug aliases and rollback approved. Owner: Backend Architect with Project Architect.
- [x] ACM-011 Managed edge remains mandatory; stronger authentication requires separate approval. Owner: Project Architect / Security Architecture.

## P0 — UX, Design System and Accessibility

- [x] ACM-012 Define the original username/password access, invalid/locked/recovery/expired journeys. Owner: UX Solution Architect. — Original baseline completed in `ux-blueprint.md`; its Deployment-managed account portions are superseded and require ACM-040 revision. Generic security outcomes and legacy-code exclusion remain valid.
- [x] ACM-013 Define Product table, search/filter/page, create/edit/retire and dependency/recovery journeys. Owner: UX Solution Architect. — Completed in `ux-blueprint.md`: the Product collection remains one semantic table at every viewport, including 320px/200% zoom, with search/filter/page context, atomic Product/Base-Variant creation, governed editing/media integration, reversible retirement/restoration, slug continuity, validation and conflict recovery.
- [x] ACM-014 Define Category collection, create/edit/delete, protected-dependency and recovery journeys. Owner: UX Solution Architect. — Completed in `ux-blueprint.md`: Category discovery, safe inactive/invisible creation, edit/order/slug/media composition, reversible retirement/restoration, explicit Subcategory/Product-Type/Product dependency denial, no cascade and validation/conflict/session recovery are implementation-ready.
- [x] ACM-015 Review reusable data-table, form, destructive-confirmation and responsive composition sufficiency. Owner: Design System Architect. — Approved in `design-system-review.md`: native semantic tables, released form/status components, existing tokens and inline/native-dialog confirmation are sufficient. One table persists across viewports in a labelled keyboard-scrollable region; Card rows, duplicate mobile DOM, bulk affordances and an unjustified generic DataTable/Modal are prohibited.
- [x] ACM-016 Design the responsive semantic Product table without Card-based Product rows. Owner: UX/UI Designer. — Completed in `ui-design.md`: one native table preserves caption, column/row headers, cells and row actions at every viewport; a named keyboard-scrollable region contains horizontal overflow at 320px/200% zoom without Product Cards or duplicate mobile DOM.
- [x] ACM-017 Design Product and Category create/edit/delete flows and original username/password access. Owner: UX/UI Designer. — Catalog design remains approved in `ui-design.md`; superseded account access behavior is now revised in `account-management-ui-design.md` under the ACM-041 amendment.
- [x] ACM-018 Complete joint Accessibility Design Review for table semantics, keyboard navigation, 320px reflow, zoom, errors, focus, destructive confirmation and light-only behavior. Owner: UX/UI Designer with Accessibility Review. — Approved in `accessibility-design-review.md`: native table relationships, contained keyboard overflow, 320px/200% zoom, errors, focus recovery, lifecycle confirmation, dependency denial, targets, contrast and deterministic light-only behavior have no unresolved design blocker.

## P1 — Backend

- [x] ACM-019 Implement the bootstrapped single Superadministrator, Administrator accounts, fixed role enforcement, secure password verification, temporary-password replacement and legacy-code migration. Owner: Backend Architect. — Implemented with Argon2id, one-way legacy-session revocation and Deployment bootstrap/emergency-reset command. Migration 013 is active; provisioning the named Superadministrator remains the documented Deployment credential operation.
- [x] ACM-020 Implement Superadministrator-only account list/create/reset/deactivate/reactivate, named sessions, throttling, revocation, self-protection and safe audit. Owner: Backend Architect. — Implemented with fixed roles, fresh password authorization, credential versions and named audit attribution.
- [x] ACM-021 Implement Product create/read/update/retire contracts with strict allowlists, invariants and concurrency. Owner: Backend Architect. — Implemented with paged/default-hidden retirement reads, strict writes, safe lifecycle commands and immutable slug aliases.
- [x] ACM-022 Implement the approved minimum Variant/SKU Product-creation outcome. Owner: Backend Architect. — Product and exactly one explicit Base SKU/Variant are created transactionally with safe defaults.
- [x] ACM-023 Implement Category create/read/update/delete contracts with taxonomy/dependency protection and concurrency. Owner: Backend Architect. — Implemented with paged dependency-aware reads, active-taxonomy append, collision-safe reorder and non-cascading retire/restore.
- [x] ACM-024 Provide migration, rollback, security, integration and performance evidence. Owner: Backend Architect. — Migration 013 is applied to `dbmaster`; all 14 migrations are current. Security/type/build evidence and rollback procedure are recorded in `backend-implementation.md`; the real PostgreSQL aggregate/alias probe passed with Product-list p95 520.24 ms against the 750 ms remote evidence limit.

## P1 — React Frontend

- [x] ACM-025 Implement username/password access without self-service recovery, mandatory temporary-password replacement and Superadministrator-only Administrator management. Owner: React Frontend Architect. — Implemented with named safe session projection, restricted temporary session, credential-safe replacement, fixed-role navigation and account lifecycle/fresh-authorization flows.
- [x] ACM-026 Replace Product Card collection with the approved semantic Product data table and responsive behavior. Owner: React Frontend Architect. — One native table with caption, scoped headers, Product row headers, Base SKU, row actions and named keyboard-scrollable overflow persists at every viewport.
- [x] ACM-027 Implement Product create/edit/retire journeys, validation, conflict and confirmed persistence. Owner: React Frontend Architect. — Minimum Product/Base-SKU creation, concurrency-aware editing and confirmed reversible retirement/restoration are connected to the executable V2 routes.
- [x] ACM-028 Implement Category collection and create/edit/delete journeys with dependency protection. Owner: React Frontend Architect. — Semantic collection, create/edit/order/state, dependency counts, protected retirement and restoration are implemented without cascade.
- [x] ACM-029 Integrate existing Product/Category media management without duplicating ownership or upload logic. Owner: React Frontend Architect. — Released `MediaAdmin` and Image/upload routes are reused as the only media boundary.
- [x] ACM-030 Add route/component tests for access, role denial, account lifecycle, mandatory password replacement, table, CRUD, conflict, dependency, expiry and responsiveness. Owner: React Frontend Architect. — Admin V2 and Media component tests plus Backend V2 service/route tests pass; evidence is summarized in `frontend-implementation.md`.

## P2 — QA, Documentation and Release

- [x] ACM-031 Validate password/account/session security, fixed role authorization, Superadministrator self-protection, account lifecycle, no-recovery behavior, legacy migration, throttling, audit and fail-closed configuration. Owner: QA Engineer with Security Review. — Approved in `qa-review.md`; fixed-role/session restrictions, credential lifecycle, safe projection/audit, bundle secrecy and fail-closed tests pass. Production edge/bootstrap attestation remains Deployment evidence.
- [x] ACM-032 Validate Product create/edit/retire, minimum Variant/SKU, invariants, concurrency and public continuity. Owner: QA Engineer. — Atomic Product/Base-SKU, safe state, alias, concurrency, retirement/restoration and public continuity pass in unit and real PostgreSQL validation.
- [x] ACM-033 Validate Category create/edit/delete, ordering, dependency protection and taxonomy/public continuity. Owner: QA Engineer. — Safe create/edit/order, dependency denial without cascade, alias/lifecycle and Taxonomy/public regression pass.
- [x] ACM-034 Validate semantic table, keyboard, screen reader, 320px, 200% zoom, touch, focus and light-only behavior. Owner: Accessibility Review with QA Engineer. — Production-build Chrome at 320/768/1440 px and 200% zoom passes native table/accessibility-tree semantics, contained overflow, targets >=46 px, fixed-role protection and light-only rendering.
- [x] ACM-035 Run full integration, migration/rollback, performance, build and public regression. Owner: QA Engineer. — 198-test suite, typecheck/build, 14-migration status, Admin V2/Product Admin/Catalog Media real integrations and public Taxonomy/Content/47-Product regressions pass; rollback procedure is non-destructive and reviewed.
- [x] ACM-036 Synchronize Admin, Product, Variant, Category, taxonomy, API, security, accessibility, deployment and project-context documentation. Owners: respective owners. — Approved in `documentation-sync-review.md`; canonical feature/context, V2 API supersession, security, QA and the production runbook agree without claiming Deployment attestation.
- [ ] ACM-037 Record Deployment and final production Release approvals. Owner: Project Architect with Deployment Owner. — The complete release candidate is approved in `release-candidate-approval.md`; waiting only on the consolidated `deployment-runbook.md` production edge/bootstrap/IAM/CDN/cleanup/rollback attestation and final production approval.

## Account Governance Amendment

- [x] ACM-038 Approve Superadministrator/Administrator actors, permissions, no-recovery rule, account lifecycle and acceptance outcomes. Owner: Product Requirements Architect. — Approved in `requirements.md` and `requirements-review.md`.
- [x] ACM-039 Approve single-Superadministrator bootstrap, role enforcement, temporary-password, revocation, self-protection, persistence and API boundaries. Owner: Project Architect / Security Architecture. — Approved in `architecture-review.md` and `architecture-handoff.md`.
- [x] ACM-040 Revise access UX and define Superadministrator account list/create/reset/deactivate/reactivate plus mandatory password-replacement journeys. Owner: UX Solution Architect. — Completed in revised `ux-blueprint.md`: access now directs locked-out Administrators to the Superadministrator without discovery or self-service recovery; restricted temporary-password replacement, Superadministrator-only semantic account collection, protected self row, create/reset/deactivate/reactivate, fresh authorization, credential clearing, conflict/session/focus recovery and responsive/accessibility outcomes are implementation-ready without configurable roles or credential echo.
- [x] ACM-041 Review and design Superadministrator account-management UI, permissions visibility, confirmations, errors, keyboard/reflow and light-only accessibility. Owner: Design System Architect with UX/UI Designer and Accessibility Review. — Joint review approved: revised UX (`ACM-040`), responsive UI and independent Accessibility evidence conform to the Design System handoff. `account-management-design-system-review.md` confirms native table/form composition, role-based DOM omission, restricted temporary sessions, credential safety, protected Superadministrator behavior, confirmations, focus/reflow and light-only contracts with no new Platform component.

## Release Gates

- [x] Named-account and destructive lifecycle decisions are approved.
- [x] Legacy shared-code removal and one-way migration contract are approved; implementation evidence remains ACM-019/031.
- [x] Passwords and session/storage secrets are never returned or persisted in browser-visible state or logs. — Safe projections, credential clearing and bundle/storage scans pass.
- [x] Product and Category lifecycle invariants pass. — Unit and real PostgreSQL aggregate validation pass.
- [x] No deletion cascades across protected relationships. — Category dependency denial and retained Product relations pass.
- [x] Product collection is a semantic, accessible table rather than Card rows. — Independent Chrome DOM/accessibility-tree validation passes.
- [x] Public discovery and media regressions pass. — Taxonomy, Content/Variants, publication and real Catalog Media regression pass.
- [ ] Managed-edge/Deployment approval passes. — Documentation and the release candidate are approved; production edge/bootstrap/IAM/CDN/cleanup/rollback attestation remains.
- [x] Superadministrator/Administrator business and architecture contracts are approved.
- [x] Superadministrator account-management UX, implementation and authorization tests pass. — The corrected `SUPER_ADMIN` contract, protected self row, Administrator-only actions and Backend role enforcement pass.
