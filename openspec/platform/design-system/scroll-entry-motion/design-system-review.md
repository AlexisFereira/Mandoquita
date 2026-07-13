# Scroll-entry Motion — Design System Review

Status: Approved

Owner: Design System Architect

Date: 2026-07-13

## Decision

`MOTION-007` is approved. Implementation and scoped adoption conform to the
approved Design System and Accessibility Platform contract. No Design System
blocker remains for `MOTION-008`.

## Contract validation

- SSR/default output is final and visible; unsupported observation, initial
  viewport, reduced motion, focus, hash targeting, observer failure, and the
  50-element overflow guard resolve immediately to final state.
- One shared observer owns threshold `0.15`; revealed elements are unobserved and
  do not replay during the same component/page-view lifetime.
- Cleanup removes observation, media-query, focus, hash, and completion-timer
  resources.
- Public props expose only approved semantic wrapper elements, `none`/`sm`
  distance, `0`/`40` delay, and class composition.
- CSS uses only opacity and optional 8px vertical translation for 220ms ease-out;
  default layout is stable, pointer interaction remains enabled, and reduced
  motion removes transition, transform, opacity preparation, and `will-change`.
- Adoption is limited to the complete Homepage Featured/Categories sections and
  Product Detail Related Products. Navigation, Hero, Search, Payment Information,
  Contact, gallery, Variant, commercial, status, and required-action surfaces
  remain immediate.
- The primitive contains no Product, Search, payment, taxonomy, availability, or
  other feature state.

## Evidence

- Accessibility review: approved.
- Independent QA: approved at 320px, 768px, and 1440px with CLS 0, no overflow,
  once-only reveal, no-script visibility, reduced-motion bypass, stable focus and
  acceptable navigation performance.
- TypeScript passed on 2026-07-13.
- Icon, Motion, and Homepage focused suites passed: 3 files and 25 tests.
- Current complete evidence records 26 files/148 tests and production build passing.
