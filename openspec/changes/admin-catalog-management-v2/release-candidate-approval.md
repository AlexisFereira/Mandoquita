# Admin Catalog Management V2 — Release Candidate Approval

Status: Approved — Production Activation Withheld

Owner: Project Architect

Date: 2026-07-14

## Decision

Admin Catalog Management V2 is approved as the complete release candidate. No
Product, Architecture, UX/UI, Design System, Backend, Frontend, Accessibility,
Security, QA or documentation task remains unfinished in the repository.

Production activation is intentionally withheld. `ACM-037` remains the single
operational gate because the external production environment has not supplied
the required non-secret Deployment attestation.

## Included release candidate

- Named username/password access with one protected Superadministrator and
  fixed-role Administrators.
- No self-service recovery; Superadministrator-owned create, reset, deactivate
  and reactivate lifecycle with mandatory temporary-password replacement.
- Product semantic table and Product/Category create, edit, reversible retire
  and restore behavior with protected dependencies and no cascades.
- Integrated Product and Category media administration under the same Admin V2
  session and managed-edge boundary.
- Legacy shared-code rejection and session invalidation.
- Deterministic light-only, responsive and accessible Admin presentation.

## Current verification

- Full automated suite: 38 files and 225 tests passed on 2026-07-14.
- Optimized production build and TypeScript validation passed.
- Existing QA evidence covers real PostgreSQL catalog/account behavior,
  production-equivalent storage lifecycle, rendered Admin accessibility and
  public regressions.
- Product Detail and Homepage releases pass in the same current suite.

## Required production attestation

Deployment must complete every item in `deployment-runbook.md`, including:

- managed-edge direct-access rejection and trusted proof injection;
- independent secret/origin/proxy configuration;
- single Superadministrator bootstrap and forced password replacement;
- legacy rejection, role/session revocation and safe audit;
- disposable Product/Category and media lifecycle probes;
- least-privilege runtime IAM, storage encryption and absence of static keys;
- CDN/public-access/cache and cleanup-schedule verification; and
- rollback rehearsal plus operator/date/evidence-location record.

Until that evidence exists, `/admin` must remain disabled at the production edge
and Project Architecture must not mark ACM-037 complete.

