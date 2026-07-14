# Homepage Merchandising Layout V2 — Release Approval

Status: Approved — Feature Released

Owner: Project Architect

Date: 2026-07-14

## Decision

`HML-026` is approved. Homepage Merchandising Layout V2 is complete and released
as the canonical Homepage composition. All Requirements, Architecture, UX/UI,
Design System, Backend, Frontend, Accessibility, QA, documentation and Platform
dependencies have objective approval evidence.

## Released capability

- Exact order: Banner Slider, Categories, Featured Products, Payment Information
  Banner, daily selected-Category Products, Contact and Footer.
- Full-width Banner Slider replacing the separate Hero while preserving the
  released Carousel interaction and reduced-motion contracts.
- Opt-in 1400px content boundary and one semantic 2/3/4/6 collection layout.
- Server-owned deterministic Bogotá-day Category selection with stable SSR and
  hydration identity, canonical eligibility and a maximum of six Products.
- Informational-only Binance, Pago móvil and Dólares en efectivo content with no
  payment transaction behavior.
- Deterministic light-only presentation, responsive reflow and accessible focus,
  reading order, targets and status behavior.

## Approval evidence

- `HML-001`–`HML-025` are complete.
- Platform `MLC-001`–`MLC-012` are complete and the shared merchandising layout
  contract is released.
- Independent QA approved HML-021–HML-024 with 214 automated tests, an isolated
  production build, rendered 320/640/1024/1400px and effective 200% evidence,
  public integration checks and CLS 0.
- Project Architecture revalidated the current workspace on 2026-07-14:
  TypeScript passed and 46 focused Homepage, server selection, Carousel and
  Container/CollectionGrid tests passed.
- Documentation synchronization is approved under HML-025.

## Governance after release

- Homepage business ordering, eligibility, limits and daily selection remain
  feature-owned; shared Platform components remain domain-neutral.
- Payment Information remains editorial and cannot acquire transactional logic
  through this release.
- Banner inventory remains presentation-owned and static until a separate
  governed administration change is approved.
- Any change to the 1400px boundary, 2/3/4/6 density, Carousel behavior,
  selection algorithm or light-only policy requires a new governed change.

