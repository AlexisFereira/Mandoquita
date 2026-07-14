# Catalog Media Admin V1 — Architecture Handoff

Status: Requirements and Architecture Ready — UX/Design and Backend Contract Active

Coordinator: Project Architect

Date: 2026-07-13

## Handoff by Area

### Product Requirements Architect

CMA-001 through CMA-005 are approved in `requirements-review.md`. Product gallery
count remains uncapped by Product rules, referenced removal is rejected, Primary
is never inferred, Category removal is included and new/replaced meaningful
media requires approved 1–240-character alternative text. Expanding this closed
business boundary requires a new Requirements and Architecture review.

### UX Solution Architect

CMA-012 through CMA-014 may begin against the approved two-phase model:
temporary upload does not change public catalog state, and only confirmed
association/replacement does. UX must keep Product gallery and Category single-
Image journeys distinct, include approved Category/unreferenced-Product removal,
reject referenced removal and never invent automatic Primary selection.

### Design System Architect and UX/UI Designer

Design System sufficiency CMA-015 and CMA-016 through CMA-018 design may begin
against approved Product Requirements. File input, previews,
alternative text, order, Primary, progress and destructive actions require
keyboard and status semantics but do not automatically require new Platform
components.

### Backend Architect

Backend CMA-019 through CMA-026 is complete. `backend-contract.md` publishes the
Product Admin-authorized upload, Product and Category media schemas; migration
012 is applied and real PostgreSQL/S3 aggregate, cleanup and performance evidence
is recorded in `backend-implementation.md`.

### React Frontend Architect

Frontend CMA-027 through CMA-034 is unblocked by the approved Product
Requirements, UX/UI and executable Backend contracts. The browser receives an
opaque temporary upload identity, never storage or operator credentials.

### QA, Security and Deployment

QA may prepare the CMA-035 through CMA-040 matrix. Deployment must prepare IAM,
namespace, CDN, cleanup-worker, managed-edge and rollback evidence; production
attestation remains a Release gate and is not implied by Architecture approval.

## Critical Path

1. UX Solution CMA-012–CMA-014, Design System CMA-015 and Backend executable
   contract design in parallel.
2. UX/UI CMA-016–CMA-018.
3. Backend CMA-019–CMA-026 after executable contract approval.
4. Frontend CMA-027–CMA-034.
5. QA/Deployment CMA-035–CMA-042 and final Project Architect Release approval.
