# Product Admin V1 — UI Design Review Response

Status: ADM-PR-UI-001 Resolved and Product-Verified

Owner: UX/UI Designer

Date: 2026-07-13

## Review item

`requirements-design-review.md` identified ADM-PR-UI-001: the Product Admin UI
incorrectly described Product-level Price and Currency as optional editor values.

## Correction applied

`ui-design.md`, Group 4 — Commercial information now defines:

- Price as a required persisted decimal value that must remain positive, have no
  more than two decimals and not exceed 99,999,999.99.
- Currency as a required persisted value of exactly three uppercase letters.
- Clearing either field as invalid and blocking the complete atomic save.
- Omission only as partial-change behavior for an unchanged field; omission never
  removes the current persisted value.
- Both values remain visible and preserved when Commercial Availability is off.
- Disabling Commercial Availability never clears, masks or rewrites either value.

Associated field correction copy is defined without weakening Backend authority:

- `Ingresa un precio válido`.
- `Ingresa una moneda de tres letras`.

## Contract alignment

The correction explicitly aligns the UI handoff with FR-ADM-011,
FR-ADM-012 and FR-ADM-017. It changes no layout, editable-field scope, API,
security behavior, Product invariant or ownership boundary.

ADM-009 is complete from the UX/UI discipline. Product Requirements verified the
correction in `requirements-design-review.md`; ADM-011 Design System sufficiency
and independent Accessibility review are also complete, closing ADM-012 and
authorizing the Frontend handoff.
