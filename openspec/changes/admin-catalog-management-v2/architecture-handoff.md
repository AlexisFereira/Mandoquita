# Admin Catalog Management V2 — Architecture Handoff

Status: Account Governance Amendment Ready for Downstream Revision

Date: 2026-07-13

## UX and Design System

- Revise access to show no recovery mechanism: a locked-out Administrator is
  directed to the Superadministrator without account discovery.
- Design a Superadministrator-only account collection and create, reset,
  deactivate and reactivate confirmations. Regular Administrators never see
  these capabilities.
- A temporary-password session permits password replacement/logout only and must
  explain that catalog access remains unavailable until replacement succeeds.
- Design Products as a semantic table at all viewports, including a deliberate
  320px responsive behavior that preserves table relationships and row actions.
- Make retirement/restore distinct from physical deletion. Confirm the exact
  public-state effects before retirement.
- Show Category dependency counts and block retirement when any protected count
  is nonzero. Do not offer cascade.
- Preserve light-only appearance and non-color status cues.

## Backend

- Produce executable request/response/error contracts from the approved account,
  Product and Category command boundaries before implementation.
- Use additive schema, database uniqueness/referential constraints, concurrency
  tokens, atomic retirement and immutable slug aliases.
- Provide Deployment bootstrap/emergency recovery for the single
  Superadministrator and Superadministrator-only application contracts for
  Administrator lifecycle, plus the one-way legacy cutover.
- Preserve existing managed-edge, origin, CSRF, audit, media, Product/Variant,
  taxonomy and public-discovery ownership.

## QA and Release Evidence Required

- Named access, role enforcement, generic failures, password policy/hash,
  independent throttles, mandatory temporary-password replacement, reset/
  deactivate/reactivate revocation, Superadministrator self-protection and legacy
  rejection.
- Atomic Product plus Base Variant creation; retirement/restore state effects;
  slug continuity; concurrency and duplicate protection.
- Category append/reorder; dependency-protected retirement; no cascade; restore;
  slug continuity and empty-category discovery.
- Semantic table accessibility at keyboard, screen reader, 320px and 200% zoom.
- Migration, rollback, managed-edge, safe audit and public/media regressions.

## Unblocked Tasks

ACM-040–ACM-041 may start immediately. ACM-019–ACM-024 must consume this
amendment before implementation; ACM-025–ACM-030 wait for revised UX/UI account
evidence. Any proposed additional Superadministrator, configurable permission,
physical purge, self-service recovery, bulk mutation, taxonomy-version management
or removal of managed-edge protection requires a new decision.
