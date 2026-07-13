# Scroll-entry Motion — Architecture Review

Status: Approved

Owner: Project Architect

Date: 2026-07-13

## Decision

The Scroll-entry Motion Platform contract is approved for implementation.

The capability remains domain-neutral, opt-in, progressive enhancement. Content
is visible and usable by default; motion can enhance only UX/UI-approved,
non-critical sections and can never gate navigation, Search outcomes, Product or
commercial state, payment meaning, focus, errors, or required actions.

## Approved Boundaries

- Platform owns the primitive, shared observation lifecycle, bounded values,
  reduced-motion bypass, cleanup, performance guard, and documentation.
- UX/UI owns the eligible-section inventory; Features only opt approved content in.
- Feature semantics, order, business state, accessible names, and interaction
  remain outside the motion primitive.
- SSR, no-script, unsupported-observer, observation-error, initial-viewport,
  focused-content, and reduced-motion outcomes resolve immediately to visible.
- Adoption is backward compatible and rollback removes wrappers without changing
  content or semantic markup.

## Implementation and Release Conditions

- One shared observer per compatible configuration; no continuous scroll or
  resize listeners and no more than 50 observed elements per page.
- Opacity and an optional 8px vertical translation are the only motion properties;
  duration, easing, stagger, and once-per-view behavior follow `design.md`.
- Implementation tests must cover SSR/default visibility, unsupported observation,
  initial viewport, entry, once-only behavior, cleanup, focus, reduced motion at
  mount and while mounted, and the observation guard.
- Accessibility and QA must validate reflow, layout stability, performance and the
  absence of hidden required content before release.
- Design System must review the implementation against the approved contract.

## Outcome

`MOTION-004` approved implementation. `MOTION-005` through `MOTION-007` later
passed implementation, Accessibility/QA and Design System review; `MOTION-008`
is approved in `release-approval.md`.

Together with the approved Governed Icon System contract, this approval satisfies
`DTE-009` and unblocks final UI definition and Platform implementation planning.
