# Homepage Merchandising Layout V2 — Canonical Feature Amendment

Status: Complete — Release Approved

Owner: Homepage / Project Architecture

Last synchronized: 2026-07-14

## Supersession

This amendment supersedes the V1 Homepage section order, separate Hero and
1280px Homepage composition. It does not replace released Product/Category
eligibility, Featured meaning/order/limits, Carousel interaction, Contact,
light-only or non-transactional contracts.

## Active Order

Surviving regions render once in this order:

1. Full-width Banner Slider.
2. Every eligible Category in canonical business order.
3. Featured Products in released order/limits.
4. Informational Payment Methods Banner.
5. Up to six Products from the server-selected daily Category.
6. Contact.
7. Footer.

Missing optional regions are omitted cleanly and never reorder the others. The
separate Hero is removed and is not a fallback.

## Banner and Payment

- The existing three presentation-owned slides remain the inventory; zero/one/
  multiple states preserve released omission/static/Carousel behavior.
- Banner media is full width with content-safe semantic copy and stable geometry.
- Payment contains exactly Binance, Pago móvil and Dólares en efectivo. It has
  no selector, amount, contact CTA or transaction state.

## Collections and Layout

- Non-Banner content explicitly uses `Container size="wide"` at a 1400px maximum.
- Category and Product collections use one `CollectionGrid` list with 2 columns
  at 320/base, 3 at 640px, 4 at 1024px and 6 at 1400px.
- Categories remain uncapped. Featured retains maximum eight at ≥1280px and four
  below. The selected Category contributes a stable maximum six Products at
  every viewport; narrower grids wrap and never hide membership.

## Daily Category

- Backend composes one optional Category plus canonical Products before SSR.
- Candidates use released active/visible/non-empty taxonomy eligibility.
- Selection is deterministic for the `America/Bogota` calendar day and does not
  immediately repeat with multiple unchanged candidates.
- Product membership uses canonical unsearched `createdAt DESC, id ASC` order.
- Server render/hydration receive identical IDs; no client reroll, cookie,
  profile, location or tracking input exists.
- Public eligibility overrides stability: ineligible data is recomputed/omitted.

## Platform Contract

The reusable `wide` Container and `CollectionGrid` are owned by
`../../platform/design-system/merchandising-layout-contract/`. They are additive
and do not migrate existing consumers or own feature collection limits.

## Evidence

- Requirements/Architecture:
  `../../changes/homepage-merchandising-layout-v2/requirements.md` and
  `architecture-review.md`.
- UX/UI/Accessibility: change `ux-blueprint.md`, `ui-design.md` and
  `accessibility-design-review.md`.
- Backend/Frontend: change `backend-implementation.md` and
  `frontend-implementation.md`.
- Platform implementation:
  `../../platform/design-system/merchandising-layout-contract/frontend-implementation.md`.

HML-021–HML-026 and Platform MLC-010–MLC-012 are complete. Final approval is
recorded in `../../changes/homepage-merchandising-layout-v2/release-approval.md`.
