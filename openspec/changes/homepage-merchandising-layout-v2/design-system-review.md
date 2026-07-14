# Homepage Merchandising Layout V2 — Design System Review

Status: Approved — Platform Implemented and Released

Owner: Design System Architect

Date: 2026-07-13

## Decision

`HML-009` and `HML-010` are approved at Design System contract level.

- The opt-in 1400px boundary and repeated 6/4/3/2 layout are governed by the
  independent Platform change `merchandising-layout-contract`.
- The released promotional Carousel is sufficient for the full-width Banner
  Slider through composition and requires no new mode or feature-specific fork.
- Existing Container defaults, Carousel behavior and unrelated pages remain
  unchanged.

## Homepage composition contract

- Banner Slider sits outside the content Container and spans the viewport.
- Categories, Featured Products, Payment Methods Banner, selected-Category
  Products and Contact use `Container size="wide"` where the approved Homepage
  layout requires the 1400px boundary.
- Categories, Featured Products and selected-Category Products use the shared
  `CollectionGrid`; data limits and omissions are resolved before children are
  created.
- Featured remains maximum eight at 1280px and wider and four below 1280px. The
  Grid reflows that already-governed membership and never hides Cards to produce
  the limit.
- The selected-Category membership remains maximum six at every width; narrower
  ranges add rows without changing membership.
- Category collections remain uncapped and preserve released business order.

## Banner review

- Preserve current presentation-owned slide order, title, optional description,
  Image and approved action. No Banner domain or administration is introduced.
- Zero valid slides omit the region, one is static, and multiple retain the
  released controls, six-second autoplay, pause and reduced-motion behavior.
- Compose visible title, description and action as HTML over/alongside decorative
  16:9 media. Required meaning cannot exist only inside the Image.
- `object-cover` is approved only with focal-safe assets; responsive crop may not
  remove meaningful content. Missing or failed media retains readable copy and
  action contrast over the released fallback.
- Controls retain visible focus, 44px targets, safe gutters and separation from
  the action. No duplicate mobile/desktop Carousel or hidden Hero is permitted.

## Responsive and theme review

- Grid transitions are exact: 2 columns below 640px, 3 at 640px, 4 at 1024px
  and 6 at 1400px.
- One DOM order serves every viewport. Cards wrap text/media within fluid tracks;
  there is no masonry, CSS reordering, placeholder Card or page overflow.
- Homepage remains deterministic light-only. Banner inverse roles are component
  surfaces, not a dark theme.
- At 320 CSS pixels and 200% zoom, Banner content/controls and two-column Cards
  must remain readable and operable; Accessibility and QA retain final validation.

## Dependencies and handoff

UX/UI may complete `HML-011` and Accessibility may complete `HML-012` using this
approved contract. Frontend may prepare feature work, but `HML-015`–`HML-017`
must not claim completion until Platform tasks `MLC-005`–`MLC-008` are
implemented and Platform release `MLC-012` is approved.
