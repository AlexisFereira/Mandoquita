# Merchandising Layout Contract — Frontend Implementation

Status: Complete — Design System and Platform Release Approved

Owner: React Frontend Architect / Accessibility Review

Date: 2026-07-14

## Delivered

- `Container size="wide"` is an additive centered 1400px boundary published as
  `DESIGN_TOKENS.layout.containers.wide` and `--container-wide`. Existing
  defaults and `sm`, `md`, `lg` and `xl` values remain unchanged; the unapproved
  `xxl` alias was removed and its sole Admin consumer migrated explicitly.
- `CollectionGrid` is exported as a typed, polymorphic layout component. It uses
  one ordered DOM collection, fluid tracks, 16/24px gaps and exact 2/3/4/6
  columns at base/640/1024/1400px; its shared `.collection-grid` contract owns
  the six-column transition because the current Tailwind build does not emit a
  custom 1400px responsive variant.
- The component passes through element semantics and attributes and never limits,
  clones, hides, sorts or reorders children.
- Component tests cover compatibility, element passthrough, density classes,
  source order and absence of responsive duplication.
- Focused remediation tests lock the typed/CSS `wide` token, all approved
  Container values and compile-time rejection of `xxl`.

## Accessibility review — MLC-009

The implementation preserves native consumer-selected semantics and one focus/
reading order. Fluid `minmax(0, 1fr)` tracks, two narrow columns, wrapping Cards
and contained Container gutters introduce no page overflow contract or focus
movement. The layout adds no motion, hidden breakpoint content or keyboard
interaction; reduced-motion behavior therefore remains unchanged.

Rendered Chrome evidence now confirms 320px reflow, the 2/3/4/6 transitions,
44px targets, one accessibility-tree order, reduced motion and the effective
700px viewport produced by 200% zoom on a 1400px window. Independent MLC-011 QA
confirmation is recorded in `qa-review.md`.

## Usage

```tsx
<Container size="wide" padding="lg">
  <CollectionGrid as="ul">
    {items.map((item) => <li key={item.id}>{/* Card */}</li>)}
  </CollectionGrid>
</Container>
```

## Design System remediation evidence

MLC-DS-001–003 synchronize the typed `wide: 1400` value, runtime
`--container-wide: 1400px`, public documentation and the sole `wide` Container
API. Admin was explicitly migrated before removing `xxl`; a negative TypeScript
fixture prevents that alias from returning. TypeScript, 38 test files / 225
tests and the production build pass after remediation.
