# Merchandising Layout Contract — Design System Review

Status: Approved

Owner: Design System Architect

Date: 2026-07-14

## Decision

`MLC-010` is approved. The `Container`, `CollectionGrid`, token, responsive,
compatibility and export implementations conform to the approved Platform
contract. The three deviations from the initial review are resolved, and no
Design System blocker remains for Platform release review `MLC-012`.

## Conforming implementation

### CollectionGrid

- The component is domain-neutral and passes through the consumer-selected
  element, attributes and children without inspecting, limiting, cloning, hiding,
  sorting or reordering them.
- Its base, 640px and 1024px classes provide 2/3/4 columns with 16/24px shared
  gaps. The shared `.collection-grid` rule owns the exact 1400px six-column
  transition after the arbitrary-variant ordering defect found by QA.
- Tracks remain fluid through CSS Grid `minmax(0, 1fr)` behavior and the component
  adds no interaction, motion or feature semantics.
- The component and its props type are exported from the shared component barrel.
- Unit and rendered QA evidence cover element passthrough, source order, one DOM
  collection, exact density, 320px, 200% zoom and lack of horizontal overflow.

### Promotional Carousel compatibility

- No promotional Carousel public API, autoplay interval, pause, controls,
  reduced-motion or existing consumer behavior was changed by this Platform
  implementation.
- Full-bleed Banner composition remains a feature-level consumer decision as
  approved; no second Carousel or Banner-specific component was introduced.

## Remediation verification

### MLC-DS-001 — Approved layout token published

`DesignTokens.layout.containers` and `DESIGN_TOKENS.layout.containers` now expose
`wide: 1400`. The runtime theme publishes `--container-wide: 1400px`, so typed,
numeric and CSS representations agree.

### MLC-DS-002 — Unapproved alias removed

`ContainerSize` exposes the single approved `wide` name. The duplicate `xxl`
entry is absent, and its Admin consumer now explicitly uses `wide`. Existing
`sm`, `md`, `lg`, `xl` and default behavior remain unchanged.

### MLC-DS-003 — Compatibility tests complete

Focused assertions now verify that:

- `DESIGN_TOKENS.layout.containers.wide` equals `1400`;
- the CSS theme publishes `--container-wide: 1400px`;
- `ContainerSize` accepts `wide` while the unapproved `xxl` alias is absent; and
- existing default and `sm`/`md`/`lg`/`xl` values remain unchanged.

The remediation changed only token publication, the duplicate alias and its
consumer, so the existing rendered density and Accessibility evidence remains
valid.

## Evidence reviewed

- `src/components/Container.tsx`
- `src/components/CollectionGrid.tsx`
- `src/components/index.ts`
- `src/design-system/tokens.ts`
- `src/styles/theme.css`
- `styles/globals.css`
- `tests/ui/container-section.test.tsx`
- `frontend-implementation.md`
- `qa-review.md`

QA records the full TypeScript, automated, production-build and rendered
validation as passing. Design System revalidation on 2026-07-14 additionally
passed `npx tsc --noEmit` and 18 focused tests across the token and
Container/CollectionGrid suites.

## Handoff

`MLC-DS-001`–`MLC-DS-003` and `MLC-010` are complete. Project Architect may
perform `MLC-012` Platform release approval. Homepage feature integration must
continue to preserve the approved opt-in and no-regression boundaries.
