# Scroll-entry Motion — Frontend Implementation

Status: Complete — Released

Owner: React Frontend Architect

Date: 2026-07-13

## Delivered contract

`ScrollEntryMotion` is a domain-neutral opt-in primitive with the approved
`as`, `distance`, `delayStep` and `className` boundary. It provides:

- final visible SSR/default output and a no-script-safe CSS baseline;
- preparation only after a client confirms an eligible element is below the
  initial viewport;
- one shared `IntersectionObserver` at threshold 0.15;
- once-only reveal and immediate unobserving after entry;
- cleanup on unmount and observer teardown when no elements remain;
- a 50-element observation guard that leaves overflow consumers visible;
- immediate final state for reduced motion at mount or preference change;
- immediate final state for focus, hash targeting, unsupported observation and
  observation failure;
- opacity and optional 8px vertical translation for 220ms only, with no layout
  property, pointer blocking, continuous listener or assistive announcement.

## Feature adoption

The primitive wraps only the approved complete Homepage Featured and Categories
Sections and the Product Detail Related Products Section. Search, Payment
Information, Contact, Hero, navigation, live regions, Product Gallery, Variant,
offer and primary discovery surfaces remain outside the motion boundary.

## Verification

Automated tests cover SSR visibility, initial viewport, unsupported observers,
entry, once-only behavior, transition completion, cleanup, focus, reduced motion
at mount/change and the 50-element guard. TypeScript, 26 files/148 tests and the
optimized production build pass. Independent QA, Design System and Project
Architecture approve the released implementation.
