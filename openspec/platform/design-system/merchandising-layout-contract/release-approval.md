# Merchandising Layout Contract — Platform Release Approval

Status: Approved — Platform Released

Owner: Project Architect

Date: 2026-07-14

## Decision

`MLC-012` is approved. The additive Merchandising Layout Platform contract is
released for Homepage Merchandising Layout V2 and later governed consumers.
There is no remaining Platform architecture, Design System, Accessibility or QA
blocker in this package.

The release includes:

- the opt-in `Container size="wide"` 1400px boundary;
- the domain-neutral `CollectionGrid` with one ordered DOM collection and exact
  2/3/4/6 density at base/640/1024/1400 CSS pixels; and
- the full-bleed promotional Carousel composition guidance without a Carousel
  API or behavior change.

## Approval basis

- `MLC-001`–`MLC-009` are complete.
- Design System approved `MLC-010` after remediation `MLC-DS-001`–`MLC-DS-003`.
- Independent QA approved `MLC-011`, including TypeScript, 214 automated tests,
  an isolated production build and rendered responsive/accessibility evidence.
- Project Architecture revalidated the current workspace on 2026-07-14 with
  `npx tsc --noEmit` and 13 focused Container/CollectionGrid tests; both passed.

## Compatibility and governance

- `wide` remains opt-in; the default and existing `sm`, `md`, `lg` and `xl`
  Container contracts do not change.
- The rejected `xxl` alias remains absent.
- `CollectionGrid` owns layout only and cannot inspect, limit, sort, hide, clone
  or reorder feature children.
- Homepage continues to own section order, eligibility, limits and daily
  Category selection.
- This approval introduces no dark theme, transaction behavior, new Carousel
  timing or feature-local layout fork.

## Downstream handoff

Homepage Merchandising Layout V2 is unblocked from the Platform dependency.
Its final feature approval remains the separate `HML-026` Project Architecture
gate and is not implicitly granted by this Platform release.

