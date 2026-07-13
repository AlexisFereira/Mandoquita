# Product Admin V1 — Requirements-to-Design Review

Status: Approved after ADM-PR-UI-001 Resolution

Owner: Product Requirements Architect

Date: 2026-07-13

## Review Decision

ADM-007 through ADM-010 preserve the approved Product Requirements contract.
Product Requirements verified the ADM-PR-UI-001 correction in `ui-design.md`
and `ui-design-review-response.md`; no Product-field contradiction remains.

## Passed Boundaries

- The six-digit access experience does not create accounts or expose the
  credential.
- Product list Search and filters match FR-ADM-005 through FR-ADM-008.
- The editor contains only the closed FR-ADM-010 field set.
- Product states remain separate and Publication prerequisites are preserved.
- Product Type remains the only classification assignment.
- Variants, Images, tags, creation/deletion, bulk operations and transactional or
  operational fields remain excluded.
- Atomic save, conflict, expiry, missing Product and unsaved-change outcomes agree
  with the approved business behavior.

## Required Correction

### ADM-PR-UI-001 — Price and currency cannot be cleared

`ui-design.md` currently labels Product-level Price and Currency as optional
editor fields. This is ambiguous and could authorize an invalid persisted Product.

Approved interpretation:

- including Price or Currency in an individual Product Change is optional because
  Product Changes are partial;
- the persisted Product-level Price and Currency values are not optional;
- Price must remain positive and within FR-ADM-011 precision/range;
- Currency must remain exactly three uppercase letters;
- clearing either field is invalid;
- disabling Commercial Availability preserves both stored values and only
  protects them from public current-offer exposure.

UX/UI Designer must remove the `Optional` field guidance and define both as
required persisted values. This correction changes no layout, architecture,
Backend mechanism or Product scope.

## Resolution Verification

Product Requirements confirms that the corrected UI contract:

- defines Price as a required persisted positive decimal within the approved
  precision and range;
- defines Currency as a required persisted value of exactly three uppercase
  letters;
- rejects clearing either value and blocks the complete atomic Product Change;
- permits omission only when a partial Product Change leaves the field unchanged;
- preserves and displays both stored values when Commercial Availability is off;
  and
- agrees with FR-ADM-011, FR-ADM-012, FR-ADM-017, AC-ADM-006 and AC-ADM-010.

## Outcome

ADM-PR-UI-001 is resolved and closed. Product Requirements approves the corrected
design contract. Together with the completed UX/UI, Design System and
Accessibility reviews, this completes ADM-012 and authorizes the Frontend
ADM-022 through ADM-032 implementation handoff.
