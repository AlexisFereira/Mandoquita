# Product Content and Variants V1 — Accessibility Review

Status: Approved

Owner: Accessibility Review

Date: 2026-07-13

## Decision

The Product Content and Variants V1 feature composition is approved against the project's WCAG 2.2 AA, responsive, reduced-motion, and deterministic light-only contracts.

## Evidence

- Product gallery uses the released labelled, keyboard-operable, non-autoplay Platform contract.
- Direct media controls expose unique names, current state, ordered position, visible focus, and at least 44 CSS-pixel targets.
- Missing and failed media preserve Product access without creating invalid controls.
- Variant choices use labelled single-selection groups and native keyboard behavior.
- Selected, focus and unavailable-combination outcomes never rely on color alone.
- Base, inactive and indistinguishable Variants remain absent from visual and accessibility trees as choices.
- Variant-associated Image changes do not move focus.
- Polite status communicates meaningful selection and media outcomes without interruption.
- Long Spanish labels wrap at 200% zoom and semantic order remains stable across viewports.
- Optional metadata leaves no empty headings or inaccessible hidden content.
- Platform PGOC Accessibility, UX/UI, Design System and QA approvals are released.

## Verification

- Automated Product Detail and Platform component accessibility scenarios pass.
- Existing contrast, focus, reduced-motion, semantic and light-only regression tests pass.
- TypeScript and production build pass.

Accessibility has no remaining blocker for `PCV-029`.
