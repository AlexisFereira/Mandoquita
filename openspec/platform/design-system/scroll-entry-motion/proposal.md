# Scroll-entry Motion

Status: Complete — Released

Owner: Design System Architect with Accessibility Architect

Date: 2026-07-13

## Decision

Introduce one domain-neutral, opt-in Scroll-entry Motion Platform contract. It is
progressive enhancement: server-rendered content is visible and usable by default,
and unsupported observation, disabled JavaScript, errors, or reduced-motion
preference leave content immediately in its final state.

## Scope

- One reusable viewport-entry primitive for approved non-critical sections.
- Once-per-page-view reveal behavior.
- Shared duration, distance, easing, stagger, observation, cleanup, and performance
  limits.
- Reduced-motion bypass, focus stability, semantic stability, and no-layout-shift
  behavior.

## Exclusions

- Navigation, Header, focus targets, alerts, errors, Product availability, Search
  results status, payment meaning, or other critical outcomes waiting for motion.
- Parallax, scroll hijacking, mandatory smooth scroll, loops, exit animations, or
  repeated animation on re-entry.
- Feature-specific observation logic or business state.
