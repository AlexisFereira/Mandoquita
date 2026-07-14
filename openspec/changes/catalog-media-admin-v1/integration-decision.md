# Catalog Media Admin V1 — Admin V2 Integration Decision

Status: Approved — Capability Integrated, Standalone Release Closed

Owner: Project Architect

Date: 2026-07-14

## Decision

Catalog Media Admin V1 is complete as a governed capability and is closed as a
standalone release package. Admin Catalog Management V2 integrates the released
Product and Category media administration under `ACM-029`; named Admin V2
sessions replace the former Product Admin V1 shared-code session boundary.

`CMA-042` is closed by recording this integration disposition. This does not
claim that production edge, IAM, CDN or cleanup attestations passed. Those
requirements are transferred without weakening to the active Admin V2
production gate `ACM-037` and its consolidated deployment runbook.

## Preserved contracts

- Product and Category retain their independent media aggregate ownership.
- Upload validation, immutable storage keys, alternative text, ordering,
  Primary, Variant-reference protection, retention and cleanup do not change.
- Runtime storage access still requires least-privilege temporary IAM
  credentials; static AWS credentials remain prohibited.
- Production media administration remains unavailable until the Admin V2 edge,
  named-account bootstrap, storage/CDN and cleanup attestations all pass.

## Disposition

- CMA implementation, QA, Accessibility, Security and documentation evidence is
  retained and approved.
- The standalone CMA deployment runbook is superseded by the Admin V2 runbook.
- No Product Admin V1 credential or session may be restored for media access.
- Final production activation belongs exclusively to ACM-037.

