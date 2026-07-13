# Product Admin V1 Tasks

Status: Implementation, QA and Documentation Complete — Production Release Blocked

Coordinator: Project Architect

## P0 — Product Requirements and Architecture

- [x] ADM-001 Approve Product Admin V1 scope, exact editable Product fields, and explicit exclusions. Owner: Product Requirements Architect. — Approved in `proposal.md`, `requirements.md` and `requirements-review.md`: V1 manages existing Products only through a closed scalar-field set and excludes creation/deletion, Variants, Images, tags, taxonomy structure and operational/transactional data.
- [x] ADM-002 Confirm that one six-digit code is the approved access credential and define code rotation ownership. Owner: Product Requirements Architect with Project Architect. — Final decision recorded in `requirements.md`: V1 uses exactly one cryptographically generated six-digit shared credential under the mandatory managed-edge boundary. The Business Representative authorizes activation/rotation, the Deployment Operator generates and rotates the secret, and Project Architecture owns policy.
- [x] ADM-003 Approve session lifetime, failed-attempt throttling, lockout/recovery policy, audit expectations, secret storage, and deployment boundary. Owner: Project Architect / Security Architecture. — Approved in `architecture-review.md`: slow hashed credential, separate session secret, 30-minute idle/8-hour absolute revocable session, persistent 5/15-minute client and 50/15-minute deployment throttles, same-origin protection, 90-day safe audit, fail-closed configuration and mandatory managed edge access; unrestricted Internet exposure requires stronger authentication.
- [x] ADM-004 Confirm Image editing remains excluded from V1 or open a governed Product Image admin extension. Owner: Product Requirements Architect. — Product Images remain excluded under BR-ADM-009 and AC-ADM-013; upload, association, ownership, order, Primary designation and alternative text require a separate future change.
- [x] ADM-005 Approve access, Product listing, filtering, update, and session API boundaries without exposing `PRODUCT_WRITE_API_KEY`. Owner: Project Architect with Backend Architect. — Project Architecture approves the security boundary in `architecture-review.md`; Backend confirms the executable contract in `backend-contract-review.md`, and Product Requirements now approves the field/Image boundary. Backend implementation is fully unblocked.

## P0 — UX Solution

- [x] ADM-006 Define access gate, temporary session, Product list, search, filters, editing, validation, conflict, responsive, accessibility, and recovery journeys. Owner: UX Solution Architect. — Completed in `ux-blueprint.md`.

## P0 — UX/UI Design

- [x] ADM-007 Design the six-digit access screen using existing Input, Button, status, focus, and form-error contracts. Owner: UX/UI Designer. Dependency: ADM-001 through ADM-003 and ADM-006. — Completed in `ui-design.md`: isolated responsive gate, one masked paste-compatible credential field, exact loading/invalid/denied/throttled/unavailable/expired outcomes, secure copy, focus, targets and reflow are defined.
- [x] ADM-008 Design responsive Product list presentation, search, filter disclosure, applied-filter states, pagination, loading, empty, and error outcomes. Owner: UX/UI Designer. Dependency: ADM-001 and ADM-006. — Completed in `ui-design.md`: name/slug Search, six approved filters, applied-filter removal, responsive semantic summaries, deterministic pagination, loading, empty, no-match, request and authorization outcomes are implementation-ready.
- [x] ADM-009 Design the grouped Product editor for identity, content, merchandising, commercial information, independent states, taxonomy, and SEO. Owner: UX/UI Designer. Dependency: ADM-001 and ADM-006. — Completed in `ui-design.md` and corrected under ADM-PR-UI-001: every and only FR-ADM-010 field is mapped into seven accessible responsive groups; Product-level Price and Currency are required persisted values that may be omitted only when unchanged in a partial request and can never be cleared.
- [x] ADM-010 Define save, success, field-validation, unsaved-change, concurrent-conflict, missing-Product, unauthorized, and expired-session UI states. Owner: UX/UI Designer. Dependency: ADM-006. — Completed in `ui-design.md`: action hierarchy, pristine/dirty/saving/success, accessible field and summary validation, unsaved-change protection, safe conflict reload, missing Product, unauthorized, expired-session and request-failure outcomes are implementation-ready without defining security or Product rules.
- [x] ADM-011 Verify existing Design System composition is sufficient; request a focused Platform change only for a demonstrated reusable gap. Owner: Design System Architect. — Approved in `design-system-review.md`: existing Input/SearchInput, Button, Card, Badge, Chip, Icon, PoliteStatus, semantic tokens and native textarea/select/checkbox/fieldset/error-summary composition are sufficient for V1. No reusable Platform gap is demonstrated; binding visual, accessibility, responsive and ownership boundaries are defined for ADM-012 and Frontend handoff.
- [x] ADM-012 Complete Design Review for mobile, tablet, desktop, keyboard, zoom/reflow, touch targets, contrast, and light-only behavior. Owner: UX/UI Designer with Accessibility Review. — Approved across `design-review.md`, `accessibility-design-review.md`, `design-system-review.md` and Product revalidation in `requirements-design-review.md`; ADM-PR-UI-001 is resolved and the Frontend handoff is authorized.

## P1 — Backend

- [x] ADM-013 Implement server validation for the six-digit admin code without exposing it to the client bundle or URLs. Owner: Backend Architect. — Salted scrypt accepts only the server request and server-only hash; generation/rotation remains deployment-owned.
- [x] ADM-014 Implement signed, HttpOnly, Secure, SameSite administrative session issuance, validation, expiry, and explicit revocation. Owner: Backend Architect. — Opaque signed cookies, hashed PostgreSQL records, idle/absolute expiry, rotation fingerprints and logout are implemented.
- [x] ADM-015 Implement failed-attempt throttling and the approved temporary lockout/recovery behavior. Owner: Backend Architect. — Persistent client/deployment windows and lockouts are implemented and automated.
- [x] ADM-016 Replace direct browser use of `PRODUCT_WRITE_API_KEY` with server-side session authorization for every admin endpoint. Owner: Backend Architect. — Every `/api/admin/*` route requires the server session; S3 operator upload moved to `/api/internal/images` outside V1.
- [x] ADM-017 Implement authorized Product list/read API with search, approved filters, deterministic pagination, and no unrelated internal fields. Owner: Backend Architect. — Admin list, detail and Product-Type routes implement exact allowlists, filters and deterministic page recovery.
- [x] ADM-018 Align Product update API with the exact approved editable-field contract and preserve publication, taxonomy, Variant, Featured, and Commercial Availability invariants. Owner: Backend Architect. — Strict scalar validation and merged-state domain rules reject partial invalid changes.
- [x] ADM-019 Preserve optimistic concurrency and governed 400/401/403/404/409/429/500/503 outcomes. Owner: Backend Architect. — Mandatory `expectedUpdatedAt`, safe conflict behavior and governed outcomes are implemented.
- [x] ADM-020 Add no-index/cache/security headers appropriate to admin and session responses. Owner: Backend Architect with Frontend Architect. — Backend headers cover every session/admin response; Frontend retains page-metadata ownership.
- [x] ADM-021 Provide security, rollback, configuration, secret-rotation, and performance evidence. Owner: Backend Architect. — Security, configuration, rotation and rollback evidence is in `backend-implementation.md`; migration 011 is applied to AWS PostgreSQL and the real integration run passed 500 list queries at concurrency 10 with remote p95 508.86 ms.

## P1 — React Frontend

ADM-022 through ADM-032 are complete against the approved Product, Architecture,
Backend and Design contracts and have passed independent QA.

- [x] ADM-022 Implement `/admin` as an isolated administration route with no public Header/Footer/Sitemap/Search navigation. Owner: React Frontend Architect. — Implemented in `pages/admin.tsx` and `src/features/admin/AdminApp.tsx`; page metadata is `noindex,nofollow,noarchive` and the public shell is not composed.
- [x] ADM-023 Implement access-gate form with six-digit numeric validation, server submission, generic failure, throttled, unavailable, and expired-session outcomes. Owner: React Frontend Architect. — Numeric/paste-compatible local validation and governed server-outcome copy are implemented without URL exposure.
- [x] ADM-024 Implement session-aware route loading, refresh behavior, expiry recovery, and `Salir` without storing credentials or authorization in local storage. Owner: React Frontend Architect. — Cookie-backed session probing, in-memory CSRF, expiry recovery and CSRF-protected logout are implemented; no browser storage is used.
- [x] ADM-025 Implement responsive Product list with authorized loading, Product identity/status summaries, deterministic pagination, loading, empty, and retry behavior. Owner: React Frontend Architect. — One semantic responsive list covers loading, empty, no-match, error/retry and pagination outcomes.
- [x] ADM-026 Implement Product name/slug search, approved combinable filters, applied-filter removal, clear-all, and list-context restoration. Owner: React Frontend Architect. — Search, all six filters, explicit application/removal/clear and retained mounted list context are implemented.
- [x] ADM-027 Implement Product editor populated from the authorized read contract and grouped according to the approved UX/UI hierarchy. Owner: React Frontend Architect. — The seven approved groups expose only the authorized scalar Product fields and inherited taxonomy context.
- [x] ADM-028 Implement client validation consistent with Backend rules without treating it as the security or business-rule authority. Owner: React Frontend Architect. — `validation.ts` mirrors format and prerequisite guidance while every save remains server-authoritative.
- [x] ADM-029 Implement dirty-state tracking, cancel/reset, navigation warning, duplicate-submit prevention, and server-confirmed save status. Owner: React Frontend Architect. — Baseline diffing, discard/back/beforeunload protection, saving locks and persisted-response rebasing are implemented.
- [x] ADM-030 Implement accessible field errors and 401/403/404/409/429/500/503 recovery, including safe conflict reload and session-expiry behavior. Owner: React Frontend Architect. — Focused error summary, associated field errors, governed recovery copy, conflict reload and expiry gate replacement are implemented.
- [x] ADM-031 Preserve Product Catalog, Taxonomy, Variants, Featured, Commercial Availability, public Search, discovery-only, accessibility, responsive, and light-only contracts. Owner: React Frontend Architect. — The panel reuses the light-only system, preserves independent states and excludes transactions, Images, Variants, tags and taxonomy structure editing; the public regression suite passes.
- [x] ADM-032 Add route/component tests for access, list, search, filters, editing, validation, success, conflict, expiry, logout, and responsive composition. Owner: React Frontend Architect. — `tests/ui/admin-page.test.tsx` covers the required journeys; the complete suite passes 32 files / 184 tests.

## P2 — QA and Release

- [x] ADM-033 Validate code handling, server-only secrets, session cookie properties, expiry, logout, throttling, unauthorized access, and fail-closed configuration. Owner: QA Engineer with Security/Accessibility Review. — Hash/code, opaque Secure/HttpOnly/SameSite session, expiry/revocation, CSRF logout, throttling, unauthorized/fail-closed outcomes, browser storage and bundle-secret scans pass; see `qa-review.md`.
- [x] ADM-034 Validate Product list, search, filters, pagination, empty/error outcomes, and exclusion of unapproved internal fields. Owner: QA Engineer. — Name/slug Search, six filters, deterministic pagination/recovery, states and response allowlists pass; see `qa-review.md`.
- [x] ADM-035 Validate every editable field, Product invariant, optimistic conflict, validation message, and server-confirmed persistence. Owner: QA Engineer. — All approved scalar fields, strict exclusions, invariants, conflict and persisted-response behavior pass; see `qa-review.md`.
- [x] ADM-036 Validate keyboard, screen-reader form semantics, focus, status/error announcements, touch targets, 200% zoom, 320px reflow, and light-only presentation. Owner: Accessibility Review with QA Engineer. — Semantic/focus tests and browser validation at 320/768/1440 px pass with no overflow, light-only rendering and 48–51 px gate targets; see `qa-review.md`.
- [x] ADM-037 Validate `/admin` exclusion from public navigation/indexing and regression-test Homepage, Catalog, Search, Category, Product Detail, Variants, and Featured Products. Owner: QA Engineer. — `noindex,nofollow,noarchive`, public-shell exclusion and public feature regressions pass; see `qa-review.md`.
- [x] ADM-038 Run full tests, TypeScript, integration/security checks, production build, and representative responsive validation. Owner: QA Engineer. — 32 files/184 tests, TypeScript, build, PostgreSQL Admin/public functional integrations, security and browser checks pass; see `qa-review.md`.
- [x] ADM-039 Synchronize Product Admin, Product, API, Architecture, Accessibility, Design System, deployment, and project-context documentation. Owners: respective artifact owners. — Product Requirements, Product/API, Architecture, Design System, Accessibility, Backend, Frontend, QA, deployment and project-context documentation agree; the production evidence procedure is recorded in `deployment-runbook.md`.
- [ ] ADM-040 Record Requirements, Architecture, UX, Design, Backend, Frontend, Accessibility, QA, Security, and Release approvals. Owners: respective review owners. — All discipline, implementation, Accessibility, QA and Security approvals are recorded. `release-approval.md` remains blocked only on production edge attestation and credential disposition by Deployment/Security.

## Release Gates

- [x] Six-digit code and internal API key never enter client-visible configuration, URL, logs, or browser storage.
- [x] Every admin read/write endpoint fails closed without a valid server session.
- [ ] Production admin routes are restricted by the approved managed edge-access boundary; otherwise stronger authentication is approved.
- [x] Throttling and session expiry pass the approved security contract.
- [x] Only approved Product fields can be changed.
- [x] Product publication, taxonomy, Variant, Featured, and Commercial Availability invariants remain valid.
- [x] Admin is absent from public navigation and indexing.
- [x] Responsive and accessibility validation passes.
- [x] Public catalog regression passes.
- [x] Documentation, implementation, and tests agree. — ADM-039 synchronization is complete.
- [ ] Any credential-shaped value previously placed in the local `.env.example` is confirmed inactive or revoked/rotated by Deployment/Security.
