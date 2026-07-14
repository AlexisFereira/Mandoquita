# Homepage Merchandising Layout V2 — Canonical Feature Amendment

Status: Complete — Release Approved

Owner: Homepage / Project Architecture

Last synchronized: 2026-07-14

Visual authority:
`../../platform/design-system/public-catalog-visual-contract.md`.

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
- Banner media is full width; semantic copy and controls align to the 1400px
  content boundary. Heights are 200/250/300/350/400px at
  base/640/768/1024/1280 and slide changes use fade only.
- Payment contains exactly Binance, Pago móvil and Dólares en efectivo. It has
  no selector, amount, contact CTA or transaction state. Title and description
  are HTML overlaid inside the 8px-radius banner, whose heights are
  160/220/300/350px at base/640/1024/1280.

## Collections and Layout

- Public section content uses `Container size="wide"` at a 1400px maximum.
- Homepage Categories remain one ordered, non-wrapping rail of 100px circular
  links with centered names, a 30px gap and no descriptions/counts. Responsive
  overflow ends in the `/categorias` `Ver todas` destination.
- Featured uses one responsive row of 2/3/4/6 cards at
  base/640/1024/1400px and exposes `/destacados` through
  `Ver más destacados`. Its server result remains canonically ordered.
- The selected Category contributes a stable maximum six Products at every
  viewport and uses the shared wrapping `CollectionGrid`.
- Product Cards use an 8px clipped radius, edge-to-edge unpadded media and omit
  card descriptions.

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
`../../platform/design-system/merchandising-layout-contract/`. The wide boundary
is canonical across public catalog pages; `CollectionGrid` remains the wrapping
collection primitive and does not own feature limits. The Homepage Category
rail is intentionally not a `CollectionGrid`.

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
