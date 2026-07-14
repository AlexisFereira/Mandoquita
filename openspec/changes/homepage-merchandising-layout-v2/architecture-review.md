# Homepage Merchandising Layout V2 — Architecture Review

Status: Approved

Owner: Project Architect

Date: 2026-07-13

## Architecture Decisions

### Opt-in 1400px Container

- Extend the Platform Container with one explicit 1400px maximum-size option.
- Do not change the current default size, existing `sm`/`md`/`lg`/`xl` values or
  any existing consumer implicitly.
- Homepage explicitly opts into the new option for Categories, Featured,
  Payment, selected-Category Products and Contact internal content.
- Banner media/background remains outside the Container and full viewport width;
  its meaningful inner content may align to the 1400px grid.
- Existing Header 1400px behavior is compatible but migration to the shared
  option is not required by this artifact without focused regression evidence.

### Responsive Grid Contract

- Add a Homepage grid composition for six columns at ≥1400px, four at
  1024–1399px, three at 640–1023px and two at 320–639px.
- One semantic collection and one Card DOM instance serve every viewport. Grid
  behavior cannot duplicate, reorder or viewport-hide selected-Category Cards.
- The contract applies to CategoryCard and ProductCard collections. Existing
  shared Card meaning and accessibility remain unchanged.
- Categories render the complete eligible collection; selected-Category Products
  render a stable maximum six; Featured continues its released collection limit.

### Server-owned Daily Selection

- Extend Homepage server composition to return an optional
  `selectedCategoryProducts` projection containing safe Category identity/name/
  slug and an ordered Product list of maximum six.
- Build the eligible candidate set using canonical taxonomy/public Product
  predicates. Do not reproduce eligibility in React.
- Sort candidates by stable Category identity before selection. Derive the
  business-day key from `America/Bogota`; apply a stable deterministic selector
  over that key and candidate identities. If today's winner matches the prior
  day's winner and multiple candidates exist, select the next deterministic
  candidate.
- Product membership uses the canonical unsearched public order
  (`createdAt DESC`, then stable ID) and a limit of six.
- Read candidate Category and its Products in a consistent server-side
  composition. If eligibility changes concurrently, return only a fully eligible
  recomputed result or omit; never return a Category with stale/ineligible
  Products.
- React receives the selected result in SSR props and renders it directly. It
  does not call randomness, use visitor state or substitute selection during
  hydration.

### Cache and Invalidation

- The selection key and response cache interval end at the next midnight in
  `America/Bogota`; UTC date alone is not the business boundary.
- Catalog publication, Category active/visible state or taxonomy activation must
  invalidate or bypass stale Homepage selection before ineligible content is
  served. Eligibility safety overrides daily stability.
- CDN/server cache keys must include the business-day selection version or use a
  bounded expiry at the same boundary. Personalized/private cache variation is
  prohibited.
- Revalidation or uncached SSR must calculate the same result for identical
  date/candidate inputs.

### Banner and Rendering Boundary

- Keep Banner slides as presentation-owned static configuration and reuse the
  released Carousel. No database table, Admin form or public Banner API is added.
- Move Carousel out of the separate Hero composition. Zero slides omit it, one
  is static and multiple preserve the released six-second/manual/pause/reduced-
  motion contract.
- Preserve the existing three Banner assets/copy/order/actions and default media
  fallback unless a separately reviewed content change is approved.
- Reserve Banner dimensions and use released media fallback/loading policy to
  avoid layout shift. Slider controls/content stay within safe readable bounds.

## Responsibility Boundary

- Backend owns candidate eligibility, business-day key interpretation, selection,
  Product ordering/limit and safe optional Homepage projection.
- Frontend owns exact section composition, full-width Banner shell, approved grid
  classes and omission rendering; it does not own selection or eligibility.
- Design System owns the optional Container/grid API, responsive Card sufficiency
  and Carousel composition constraints without changing Product behavior.
- Product Requirements owns order, limits, methods, timezone and visitor-visible
  outcomes.

## Failure and Rollback

- Invalid/missing selection data omits only the selected-Category section.
- Missing Banner slides omit Slider without reinstating Hero.
- A failed optional Container/grid rollout can revert Homepage to its previous
  explicit width/grid while retaining server selection data; no database
  migration is required.
- A failed selection rollout can omit the new final section and restore the prior
  Homepage payload; no Product/Category business state changes.

## Review Outcome

HML-006 and HML-007 are approved. The change is a Homepage composition plus an
opt-in Platform layout extension; it does not require a new Banner domain,
personalization service or persistence migration.
