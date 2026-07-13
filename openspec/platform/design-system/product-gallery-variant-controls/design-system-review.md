# Product Gallery and Option Controls — Design System Review

Status: Approved

Owner: Design System Architect

Date: 2026-07-12

## Decision

`PGOC-013` is approved. The implementation conforms to the approved Platform
Design System proposal, design, and component-library delta. No Design System
blocker remains for QA validation.

## Contract validation

### Carousel

- The public TypeScript API is a discriminated union between backward-compatible
  promotional behavior and explicit `gallery` behavior.
- Gallery items use stable string identities and support controlled and
  uncontrolled active selection.
- Consumer-driven `activeItemId` updates presentation without moving focus or
  emitting a reciprocal selection callback.
- Gallery mode contains no autoplay timer and preserves direct ordered controls,
  current position, stable media space, loading, missing-media, and failed-media
  outcomes.
- Direct controls retain 44px minimum targets, programmatic selected state,
  distinguishable accessible names, wrapping layout, and reduced-motion handling.

### Chip and status composition

- `Chip` uses discriminated presentational, removable, and option contracts;
  option-only props cannot leak into legacy modes.
- Option mode remains parent-controlled and exposes stable value, radio state,
  unavailable-combination explanation, long-label wrapping, 44px target size,
  and a selected indicator that does not rely on color alone.
- Unavailable options avoid whole-control opacity and inventory or commercial
  semantics.
- `PoliteStatus` provides atomic polite feedback without any focus-management API.

### Visual foundations and ownership

- The implementation reuses the active semantic light palette, focus, border,
  surface, spacing, radius, and motion contracts. No feature-local palette or new
  theme behavior was introduced.
- Product Image ordering, Variant resolution, vocabulary, inventory, pricing,
  taxonomy, and commercial decisions remain outside Platform components.
- Documentation and examples describe labelled group composition and preserve
  existing Carousel and Chip migration compatibility.

## Evidence

- Accessibility review: approved.
- UX/UI review v1.1: approved after unavailable-option contrast remediation.
- `npx tsc --noEmit`: passed on 2026-07-12.
- Focused component suite: 2 files and 19 tests passed on 2026-07-12.
- Existing QA evidence records the complete 23-file, 116-test suite and production
  build as passing; formal QA closure remains independently owned by QA.

## Handoff

QA may complete `PGOC-014`. Platform release approval (`PGOC-015`) and feature
integration (`PGOC-016`) remain owned by their assigned roles and dependencies.

