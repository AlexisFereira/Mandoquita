# Scroll-entry Motion — Accessibility Review

Status: Approved — Released

Owner: Accessibility Architect

Date: 2026-07-13

## Decision

Accessibility approves `MOTION-003`, the accessibility portion of `DTE-008`, and
the Accessibility portion of `MOTION-006`/`DTE-026` for the implemented primitive.
The contract is progressive enhancement: server-rendered and default content is
visible, meaningful and operable without JavaScript, observation support or motion.

## Approved safeguards

- Reduced-motion preference produces the immediate final state without delay,
  opacity transition or transform, including preference changes while mounted.
- Visual preparation never changes semantic structure, accessible names, reading
  order, tab order, pointer availability, layout dimensions or screen-reader access.
- Focus is never moved. Focused or programmatically targeted content resolves to
  its final visible state immediately and cannot wait for viewport intersection.
- Viewport entry creates no live-region announcement or other assistive-technology
  event solely because content became visually animated.
- Initial-viewport, unsupported-observer, observation-error and no-script outcomes
  remain visible and usable, preventing hidden required content or hydration flash.
- Eight-pixel vertical translation and opacity are bounded, compositor-friendly
  and introduce no horizontal movement, overflow or layout shift at 200% zoom.
- Critical navigation, headings, forms, status/error content, Search updates,
  availability outcomes and required task actions remain outside the opt-in boundary.

## Implementation validation

The implementation preserves default/SSR visibility, initial-viewport content,
unsupported/failed observation, once-only behavior, cleanup, the 50-element guard,
reduced motion at mount and during observation, focus/hash targeting and semantic
order. CSS uses only opacity and an 8px vertical transform, keeps pointer events,
removes transient `will-change`, and registers no scroll/resize or live-region
behavior. Focused content resolves immediately without focus movement.

Independent QA completes the joint `MOTION-006`/`DTE-026` gate, including browser
reflow, layout-stability and performance evidence; Project Architecture approves
MOTION-008 release.
