# Merchandising Layout Contract — Tasks

Status: Complete — Platform Release Approved

## Design System and architecture

- [x] MLC-001 Audit Container, layout token, collection-grid and promotional Carousel contracts. Owner: Design System Architect.
- [x] MLC-002 Approve additive `wide` Container boundary without changing defaults or existing consumers. Owner: Project Architect with Design System Architect. — Approved by HML-006 and specified in `design.md`.
- [x] MLC-003 Define domain-neutral 2/3/4/6 `CollectionGrid`, responsive, semantic and compatibility contracts. Owner: Design System Architect.
- [x] MLC-004 Approve full-bleed promotional Carousel composition, source ratio, crop, controls, motion and content-safety rules. Owner: Design System Architect.

## Frontend implementation

- [x] MLC-005 Add the `wide: 1400` layout token and additive `Container size="wide"` API without migrating existing consumers. Owner: React Frontend Architect. — Typed/CSS tokens and the single approved API now agree; the sole explicit Admin `xxl` consumer was migrated to `wide` during removal of the unapproved alias.
- [x] MLC-006 Implement and export typed `CollectionGrid` with exact base/640/1024/1400 density, shared gaps and one DOM order. Owner: React Frontend Architect. — Exported polymorphic component uses 2/3/4/6 fluid tracks and one untouched child collection.
- [x] MLC-007 Add component tests for Container compatibility, exact Grid transitions, child order, element passthrough, narrow reflow and no responsive duplication. Owner: React Frontend Architect. — Automated component evidence passes.
- [x] MLC-008 Document the new APIs and Homepage consumption example. Owner: React Frontend Architect. — Recorded in `frontend-implementation.md`.

## Reviews and release

- [x] MLC-009 Validate 320px, 200% zoom, keyboard/focus order, semantics and reduced motion. Owner: Accessibility Review. — Code and rendered Chrome evidence approve fluid tracks, exact density, one accessibility/focus order, 44px targets, no overflow and reduced motion; independent QA is complete under MLC-011.
- [x] MLC-010 Review implementation against this Design System contract. Owner: Design System Architect. — Approved in `design-system-review.md` after MLC-DS-001–MLC-DS-003; typed/CSS tokens, the single `wide` API, CollectionGrid, exports and compatibility pass TypeScript and 18 focused tests.
- [x] MLC-011 Run TypeScript, component, regression and production-build validation. Owner: QA Engineer. — Approved in `qa-review.md`: TypeScript, 214 automated tests, isolated production build and rendered 320/640/1024/1400px plus 200% validation pass.
- [x] MLC-012 Approve Platform release before Homepage feature integration. Owner: Project Architect. — Approved in `release-approval.md`; Design System, Accessibility, QA, compatibility and current-workspace validation pass, and Homepage V2 is unblocked from its Platform dependency.

## Design System remediation

- [x] MLC-DS-001 Publish typed `DESIGN_TOKENS.layout.containers.wide = 1400` and `--container-wide: 1400px` so every shared token representation matches the approved contract. Owner: React Frontend Architect. — Interface, constant, runtime CSS and token reference are synchronized.
- [x] MLC-DS-002 Migrate the current `Container size="xxl"` consumer to `wide` and remove the unapproved duplicate `xxl` API. Owner: React Frontend Architect. — Admin migrated explicitly; production source exposes no `xxl` Container size.
- [x] MLC-DS-003 Add focused token, CSS-variable, allowed-size and existing-size compatibility tests. Owner: React Frontend Architect. — Tests lock 640/768/1120/1280/1400 values, CSS publication, default compatibility and compile-time rejection of `xxl`; TypeScript, 38 files/225 tests and production build pass.
