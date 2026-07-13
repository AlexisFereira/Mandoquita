# Discovery and Trust Experience V1 — Accessibility Review

Status: Approved — Released

Owner: Accessibility Architect

Date: 2026-07-13

## Decision

Accessibility approves the implemented Frontend composition for Search, Payment
Information and governed Icons, plus Scroll-entry Motion. Independent QA also
approves the browser/performance portion of DTE-026 and the final cross-feature
release gate.

## Search

- `/buscar` has one H1 and one native labelled `role="search"` form.
- Empty/invalid input is rejected before navigation, associated to the field and
  focused for correction; accents and punctuation remain allowed.
- Explicit Header/Category entry may focus the field through `focus=1`; direct
  restoration does not steal focus.
- Loading is announced once, disables duplicate submission and hides stale
  Product outcomes for the changing query.
- Results, counts, no-results, errors, pagination and recovery follow DOM order,
  retain visible text and use 44px interactive targets.
- Product results reuse canonical `ProductCard`; unavailable offers and missing
  media preserve their established accessible outcomes.

## Payment Information and Icons

- Methods remain one static list in approved order and never enter the tab order.
- The WhatsApp continuation remains a labelled external link and is omitted when
  unavailable without removing informational content.
- Adopted Icons are decorative alongside complete labels and are unfocusable;
  they do not duplicate accessible names or imply unapproved payment meaning.

## Scroll-entry Motion

- Server/default, no-script, unsupported/failed observer and guard overflow
  outcomes remain visible.
- Initial-viewport, reduced-motion, focused and hash-targeted content resolves
  immediately to its final state.
- Motion does not change semantics, order, layout dimensions, pointer behavior or
  accessible names and creates no announcement.
- Adoption is limited to the three complete wrappers approved by DTE-012E.

## Evidence

Automated UI tests cover form naming/validation/focus, query persistence,
pagination/recovery, static Payment semantics, Icon composition, SSR visibility,
once-only entry, cleanup, reduced-motion changes, focus and the 50-element guard.
TypeScript, 26 files/148 tests and the optimized production build pass.
Independent QA browser evidence is approved in `qa-progress.md`.
