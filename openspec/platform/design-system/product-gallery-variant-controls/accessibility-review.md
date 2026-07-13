# Product Gallery and Option Controls — Accessibility Review

Status: Approved

Owner: Accessibility Review

Date: 2026-07-12

## Decision

PGOC-011 is approved against the Platform WCAG 2.2 AA contract. Gallery and
option controls preserve keyboard operation, visible focus, programmatic state,
distinguishable names, minimum targets, stable DOM order, text reflow, reduced
motion and non-interruptive status feedback.

## Evidence

- Gallery is a labelled region; direct controls form a labelled group.
- Each media control uses a unique accessible name and `aria-pressed`, with a
  persistent non-color selected indicator.
- Native buttons preserve Enter/Space activation and focus after updates.
- Controlled external media updates cause no callback loop and invoke no focus API.
- Option mode exposes `role="radio"`, `aria-checked`, and focusable
  `aria-disabled` recovery context with an accessible explanation.
- Option labels wrap without ellipsis; option and media controls meet the shared
  44 CSS-pixel minimum and use wrapping containers at 200% reflow.
- Missing media is non-interactive; failed media leaves remaining controls operable.
- `PoliteStatus` uses `role="status"`, `aria-live="polite"`, and `aria-atomic`.
- Motion classes and gallery media transitions respect reduced motion; gallery
  mode contains no timer.
- Existing global focus and verified light semantic contrast contracts remain authoritative.

## Verification

- Automated compatibility and accessibility coverage passes within 23 files and 116 tests.
- TypeScript and the production build pass.

This approval covers Accessibility only. Visual, Design System, QA and Project
Architecture release approvals remain separate gates.
