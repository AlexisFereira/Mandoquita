# Homepage Merchandising Layout V2

Status: Approved — Requirements and Architecture Complete

Coordinator: Project Architect

Date: 2026-07-13

## Summary

Recompose Homepage around a full-width Banner Slider, a 1400px maximum content
layout, denser responsive Category/Product grids and this fixed merchandising
order:

1. Banner Slider.
2. Categories.
3. Featured Products.
4. Payment Methods Banner.
5. Products from one daily selected Category.

The existing Contact region follows these five regions before the Footer.

## Business Goal

Increase Product visibility and catalog exploration while keeping Homepage
clear, light-only, discovery-oriented, anonymous and non-transactional.

## Approved Scope

- Replace the separate Hero with the existing presentation-owned Banner Slider
  as the first Homepage content region.
- Render Banner media/background full-width with safe readable content.
- Add an opt-in 1400px Platform Container capability for Homepage content without
  changing current Container defaults or unrelated consumers.
- Apply 6/4/3/2 columns to Category, Featured Product and selected-Category
  Product grids at the approved ranges.
- Preserve all eligible Categories without a presentation cap and preserve the
  released Featured collection contract.
- Present Payment Methods as the approved informational Banner.
- Add up to six canonically ordered Products from one anonymously and
  deterministically selected eligible Category per Bogotá business day.
- Preserve Search, taxonomy, public eligibility, Carousel, Contact, media,
  accessibility, responsive, performance and light-only contracts.

## Excluded Scope

- Payment logic, checkout or method selection.
- Personalized recommendations, visitor tracking or behavioral profiling.
- New Product ranking, Featured meaning or Category taxonomy.
- Admin Banner management or a Banner persistence/API model.
- Changes to the released six-second Carousel behavior.
- Homepage-specific duplication of shared Product/Category Cards.
- Global migration of existing Container consumers to 1400px.

## Resolved Decisions

1. The five merchandising regions have a fixed order; Contact and Footer remain
   after them. Missing optional content never reorders remaining regions.
2. 6/4/3/2 applies to all Category and Product grids at ≥1400, 1024–1399,
   640–1023 and 320–639 CSS pixels respectively.
3. Categories remain uncapped. Featured eligibility/order/limits remain released.
   The selected Category contributes at most six Products at every viewport.
4. Category selection is anonymous, deterministic per Bogotá calendar day and
   avoids an immediate repeat when at least two unchanged candidates exist.
5. Selected Products use the canonical public Catalog order and stable maximum
   six membership; narrower grids wrap rather than hide Products.
6. The existing three static slides and default Banner fallback remain
   authoritative. Banner Slider replaces Hero and no Banner backend is added.
7. The 1400px Container is a new optional Platform capability used explicitly by
   Homepage. Existing defaults and consumers do not change.
8. Backend Homepage composition owns the eligible daily selection and Product
   projection before SSR. The browser does not randomize or refetch a choice
   during hydration.

## Dependencies

- Released Homepage Carousel, Category, Featured Product, Payment Information
  and Contact capabilities.
- Product Catalog/Taxonomy eligibility and deterministic ordering.
- Design System Container, grid, Card, Carousel and responsive contracts.
- Public Product/Category Image and fallback behavior.

## Risks and Controls

- Cross-page width regression: optional Container size with no default change.
- Hydration/cache drift: server-owned deterministic business-day selection.
- Dense Cards: fixed responsive ranges plus 320px/200% accessibility review.
- Banner crop/layout shift: reserved media geometry and content-safe composition.
- Accidental payment behavior: exact informational methods and no controls/state.
- Eligibility drift: public eligibility overrides daily stability and recomputes
  or omits safely.

## Approval Outcome

Product Requirements and Project Architecture decisions are approved. UX,
Design System, UI and Backend work are unblocked by the attached reviews and
handoff.
