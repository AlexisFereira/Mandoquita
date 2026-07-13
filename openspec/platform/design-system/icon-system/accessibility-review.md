# Governed Icon System — Accessibility Review

Status: Approved — Released

Owner: Accessibility Architect

Date: 2026-07-13

## Decision

The Accessibility portion of `ICON-006` is approved. The shared implementation
matches the semantic and interaction safeguards required by the reviewed contract.

## Validation

- Every public name belongs to the approved closed semantic registry; arbitrary
  glyph, SVG, brand and payment-provider names are impossible through `IconProps`.
- Decorative mode is the default and places the SVG outside the accessibility tree,
  preventing duplicate names beside visible text or inside labelled controls.
- Informative mode requires a TypeScript label and rejects an empty runtime label;
  the SVG exposes one `img` role with its approved textual equivalent.
- SVG elements always use `focusable=false` and own no tab stop, keyboard behavior,
  pointer action, disabled state or control target.
- A composed labelled control retains its visible accessible name while its icon
  remains hidden; the parent continues to own the shared focus cue and 44px target.
- The wrapper is inline-flex, non-shrinking and baseline aligned. Fixed glyph size
  does not truncate labels or introduce page overflow at 200% zoom/320px composition.
- Glyph color inherits `currentColor`; consumers remain responsible for approved
  semantic foreground/status/inverse roles, so no raw or color-only meaning enters Platform.
- Required meaning remains text-first; direction and glyph shape never replace a
  control name, message, status or visible label.

## Evidence

- Six focused component tests pass for registry closure, decorative and informative
  semantics, empty-label rejection, labelled-control composition and visual contract.
- Current complete suite: 26 files and 148 tests pass.
- TypeScript and production build pass.
- DTE-024 independently revalidates approved Feature adoption and QA completes the
  joint ICON-006 gate; Project Architecture approves ICON-008 release.
