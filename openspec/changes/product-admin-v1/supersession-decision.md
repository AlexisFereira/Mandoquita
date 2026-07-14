# Product Admin V1 — Supersession Decision

Status: Approved — Superseded, Production Release Prohibited

Owner: Project Architect

Date: 2026-07-14

## Decision

Product Admin V1 is closed without production release. Admin Catalog Management
V2 supersedes its shared six-digit access, temporary legacy sessions, scalar-only
editing scope and production activation path.

This is a governed supersession, not a claim that the unresolved V1 production
edge attestations passed. They are no longer applicable because V1 must not be
activated.

## Basis

- Admin V2 requires named username/password accounts with exactly one protected
  Superadministrator and fixed-role Administrators.
- The V2 cutover rejects the shared six-digit credential, revokes legacy
  sessions and removes legacy configuration.
- V2 includes Product create/edit/retire/restore, Category lifecycle, semantic
  table administration and account governance beyond V1.
- Running V1 and V2 access paths together would violate the approved hard
  cutover, audit attribution and no-legacy-entry contracts.

## Disposition

- `ADM-040` is closed by recording a final **do not release** decision.
- The V1 deployment runbook is cancelled and must not be executed.
- V1 implementation/review documents remain as historical evidence only.
- Production readiness belongs exclusively to Admin Catalog Management V2
  `ACM-037` and its named-account deployment runbook.

