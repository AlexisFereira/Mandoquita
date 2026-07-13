# Governed Icon System — Design System Review

Version: 1.1

Status: Approved after remediation

Owner: Design System Architect

Date: 2026-07-13

## Decision

`ICON-007` is approved. The component API, registry boundary, sizing,
current-color behavior, accessibility modes, exports, dependency pinning,
documentation, migration compatibility, and remediated payment-information glyph
conform to the approved Design System contract.

## Blocking finding

### ICON-DS-001 — Payment information implies an unapproved card method

Status: Resolved and revalidated

Original severity: Release blocking

Owner: React Frontend Architect

`payment-information` currently maps to Lucide `CreditCard` and is rendered beside
the public heading `Medios de pago`. The approved methods are Binance, Pago móvil,
and Dólares en efectivo; no card method or card brand is approved.

Decorative accessibility treatment prevents duplicate screen-reader output but
does not remove the visual implication. This conflicts with:

- the Icon contract prohibition on using a generic glyph to imply an unapproved
  payment method;
- the approved Payment Information decision, which allows only domain-neutral
  supporting icons that imply no other payment method or transactional integration;
- the Design System rule that text remains authoritative and icon semantics may
  not introduce conflicting meaning.

Required remediation was:

1. Replace the `CreditCard` glyph mapping with the already approved neutral `Info`
   glyph while preserving the public semantic name `payment-information`.
2. Remove the unused `CreditCard` named import.
3. Add a regression assertion proving the semantic name no longer renders the
   `credit-card` glyph.
4. Preserve decorative behavior, current color, sizes, dependency boundary, and
   exact visible payment content.

No new public Icon name, token, brand asset, or business content was introduced.

### Remediation evidence

- `payment-information` now maps to the already approved neutral `Info` glyph.
- The `CreditCard` named import is removed.
- Regression coverage asserts `lucide-info`, rejects `lucide-credit-card`, and
  preserves decorative treatment.
- Public semantic name, sizes, current-color behavior, visible payment copy, and
  consuming APIs remain unchanged.

## Passed evidence

- Exact `lucide-react` dependency and third-party notices are present.
- Public registry contains only the 17 approved semantic names.
- Decorative/informative discriminated modes, non-empty informative labels,
  unfocusable SVG, sizes, stroke/fill, current color, wrapping, and parent-control
  ownership conform.
- TypeScript passed after remediation on 2026-07-13.
- Icon, Homepage, and public-API focused suites passed after remediation: 3 files
  and 21 tests.
- Post-remediation project evidence records 26 files/148 tests and production
  build passing.
- Accessibility and QA approvals remain valid; the corrected glyph does not
  weaken semantics, contrast, focus, target, or reflow behavior.

## Handoff

No Design System blocker remains. Project Architecture may complete `ICON-008`;
coordinated documentation and release gates remain independently owned.
