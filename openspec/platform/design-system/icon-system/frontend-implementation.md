# Governed Icon System — Frontend Implementation

Status: Complete — Released

Owner: React Frontend Architect

Date: 2026-07-13

## Delivered contract

- `lucide-react` 1.24.0 is an exact production dependency with resolved lockfile
  integrity and ISC/Feather MIT notices in `THIRD_PARTY_NOTICES.md`.
- `Icon` exposes only the 17 approved semantic names. Named imports and the local
  registry prevent arbitrary library names and full-library dynamic imports.
- Props form a discriminated union: decorative mode is the default and forbids a
  label; informative mode requires a label and rejects whitespace-only values at runtime.
- Governed sizes are 16px, 20px and 24px; stroke is 2px, fill is none, and color
  inherits `currentColor` from approved semantic roles.
- SVG nodes are never focusable. The wrapper is inline, non-shrinking and baseline
  aligned without owning control target, focus or interaction behavior.

## Compatibility

- Existing `ReactNode` icon slots remain unchanged for incremental migration.
- Features must import the shared component rather than `lucide-react` and retain
  visible labels and parent-control names.
- No Feature consumer has been migrated before DTE UI inventory and release gates.

## Verification

- `npx tsc --noEmit`: pass.
- `npm test -- --run`: 26 files and 148 tests pass, including seven Icon tests.
- `npm run build`: pass after `ICON-DS-001`; unused registry code is absent from route bundles.
- Public API, all approved names, decorative/informative semantics, non-empty label,
  control-name composition, size, fill, stroke/current color and reflow classes are covered.

ICON-005 through ICON-008 are complete. Accessibility, QA, Design System and
Project Architecture approve the released Platform implementation.

## ICON-DS-001 remediation

The `payment-information` semantic name now maps to the already approved neutral
`Info` glyph. The `CreditCard` import and visual implication were removed without
changing the public name, decorative behavior, sizing, current-color inheritance
or exact Payment Information content. Regression coverage asserts `lucide-info`
and rejects `lucide-credit-card`; TypeScript, 148 tests and production build pass.
The remediated implementation passed ICON-007 re-review and ICON-008 release.
