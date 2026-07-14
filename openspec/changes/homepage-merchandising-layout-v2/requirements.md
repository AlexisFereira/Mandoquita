# Homepage Merchandising Layout V2 — Approved Requirements

Status: Approved — Ready for UX and Design System

Owner: Product Requirements Architect

Date: 2026-07-13

## Purpose and Actor

Homepage Merchandising Layout V2 gives a visitor a clearer discovery path with
more visible catalog choices, a full-width promotional entrance and a stable
daily Category selection. The visitor remains a discovery actor; the experience
does not create checkout, payment selection, personalization or tracking.

## User Stories

- As a visitor, I want to see the principal catalog choices in a predictable
  order so that I can begin exploring quickly.
- As a visitor, I want Categories and Products to use the available screen width
  clearly so that I can compare more options without losing readability.
- As a returning visitor, I want to discover Products from a rotating Category
  so that the Homepage exposes more of the catalog over time.
- As the business, I want Banner and payment communication to remain editorial
  and informational so that discovery never implies an online transaction.

## Functional Requirements

- FR-HML-001: Homepage presents these primary merchandising regions in exactly
  this order: Banner Slider, Categories, Featured Products, Payment Methods
  Banner and Products from the selected Category.
- FR-HML-002: The existing Contact region follows the five merchandising regions
  and remains before the Footer. Missing optional regions do not reorder the
  remaining regions.
- FR-HML-003: Banner Slider is the first content region and replaces the separate
  Homepage Hero. The former Hero does not render as an additional region or
  fallback.
- FR-HML-004: Banner Slider spans the full viewport width. Meaningful slide
  content remains readable, operable and safe from unintended crop at every
  supported viewport.
- FR-HML-005: The existing three presentation-owned Banner slides, in their
  current business order, copy, Images and approved destinations, are the V2
  source inventory. V2 does not introduce Banner administration or a Banner
  domain/API.
- FR-HML-006: A valid slide requires a title; description, Image and action are
  optional. Missing/failed Image uses the released Banner fallback, one valid
  slide is static, multiple slides use the released Carousel behavior, and zero
  valid slides omit the region without restoring the Hero.
- FR-HML-007: Homepage content below the Banner Slider uses a centered maximum
  width of 1400 CSS pixels with responsive gutters. This opt-in maximum does not
  change other page layouts.
- FR-HML-008: Category, Featured Product and selected-Category Product grids use
  six columns at 1400px and wider, four at 1024–1399px, three at 640–1023px and
  two at 320–639px, without changing semantic order.
- FR-HML-009: Homepage exposes every Category satisfying the released Category
  eligibility and business-order rules. Grid density does not impose a Category
  presentation limit.
- FR-HML-010: Featured Products preserve the released eligibility, curated order
  and display limits: maximum eight at 1280 CSS pixels and wider and four below
  1280px. The new grid does not redefine Featured meaning.
- FR-HML-011: Payment Methods Banner presents exactly Binance, Pago móvil and
  Dólares en efectivo with the released informational/external-confirmation
  meaning and no payment selection or transaction.
- FR-HML-012: The final Product region identifies one selected Category by its
  official name and links to its canonical Category Page.
- FR-HML-013: The selected Category is chosen only from active, visible
  Categories in the active taxonomy that contain at least one publicly eligible
  Product.
- FR-HML-014: Category selection is deterministic and stable for one Bogotá
  calendar day. When at least two eligible Categories remain unchanged, the same
  Category is not selected on two consecutive days.
- FR-HML-015: The selected-Category region presents up to six publicly eligible
  Products using the released default public Product order. The same ordered
  membership reflows across grid densities; viewport changes do not add, remove
  or reorder its Products.
- FR-HML-016: If the selected Category contains fewer than six eligible Products,
  all available Products render. If no Category is eligible, the complete final
  Product region is omitted without placeholder or fabricated content.
- FR-HML-017: Category choice and selected Product membership are identical
  between server rendering and hydration for the same business-day/catalog
  state.
- FR-HML-018: Homepage changes preserve Search, Category and Product URLs,
  Product/Category public eligibility, Featured ordering, Carousel controls,
  Contact, light-only presentation, responsive behavior and discovery-only scope.

## Business Rules

- BR-HML-001: The five-region merchandising order is fixed and is not inferred
  from response time or content availability.
- BR-HML-002: Categories remain an uncapped collection. Responsive columns only
  change layout density.
- BR-HML-003: Selected-Category rotation uses the business timezone
  `America/Bogota` and changes at 00:00 local time.
- BR-HML-004: Selection is anonymous and common to all visitors for the same day
  and catalog state; it does not use cookies, profiles, history or location.
- BR-HML-005: A Category or Product that becomes publicly ineligible is removed
  at the next valid Homepage computation even if that changes the daily outcome.
  Public eligibility takes precedence over rotation stability.
- BR-HML-006: The selected-Category Product limit is six at every viewport. Cards
  wrap into additional rows on narrower widths; they are not hidden to simulate
  a single row.
- BR-HML-007: Product ordering in the selected Category follows the released
  unsearched public Catalog order and deterministic tie-breaker.
- BR-HML-008: The Banner inventory is presentation-owned static content. Changes
  to its business copy, destination or inventory require documented content
  review; they are not inferred from Product or Category records.
- BR-HML-009: The released six-second Carousel interval, pause, manual control,
  single-slide and reduced-motion rules remain unchanged.
- BR-HML-010: Payment Methods Banner remains informational and does not assert
  that payment has been selected, initiated, accepted or completed.
- BR-HML-011: The 1400px maximum is an opt-in layout capability. Existing
  Container defaults and consumers remain unchanged unless separately migrated
  and regression-tested.
- BR-HML-012: Missing optional sections leave no orphan heading, divider, control
  or spacing artifact.

## Acceptance Criteria

- AC-HML-001: Given all regions have content, their visual and programmatic order
  is Banner Slider, Categories, Featured Products, Payment Methods Banner,
  selected-Category Products, Contact and Footer.
- AC-HML-002: Given the Homepage loads, no separate Hero appears before, beside
  or after the Banner Slider.
- AC-HML-003: Given zero, one or multiple valid slides, the Banner region is
  respectively omitted, static or governed by the released Carousel controls
  without preventing access to the remaining Homepage.
- AC-HML-004: At viewport widths of 1400, 1024, 640 and 320 CSS pixels, each
  governed grid renders respectively 6, 4, 3 and 2 columns without page-level
  horizontal overflow or reordered entities.
- AC-HML-005: Given more than six eligible Categories, every Category remains
  rendered in released business order.
- AC-HML-006: Given the same eligible data and Bogotá business date, repeated
  requests, server render and hydration expose the same selected Category and
  ordered Product IDs.
- AC-HML-007: Given two or more unchanged eligible Categories, today's selected
  Category differs from yesterday's; with one Category, repetition is allowed.
- AC-HML-008: Given more than six eligible Products in the selected Category,
  exactly the first six in canonical order render at every viewport.
- AC-HML-009: Given fewer than six eligible Products, every eligible Product
  renders; given none in any Category, the final region does not render.
- AC-HML-010: Given the selected Category or Product loses public eligibility,
  no ineligible content is exposed and a safe deterministic recomputation or
  omission occurs.
- AC-HML-011: Given the viewport exceeds 1400px, non-Banner Homepage content
  remains centered at a maximum of 1400px while the Banner background/media stays
  full-width.
- AC-HML-012: Given the Payment Methods Banner, it contains the three approved
  methods and no selector, form, confirmation, amount, checkout or payment state.
- AC-HML-013: At 320px and 200% zoom, slide content, two-column Cards, headings,
  Carousel controls and payment information remain readable and operable.
- AC-HML-014: Missing Banner Image, Category media, Product media or optional
  collections use their released fallback/omission outcomes without layout shift
  or fabricated business meaning.

## Non-Functional Requirements

- NFR-HML-001 Accessibility: landmarks/headings, Carousel operation, grid reading
  order, focus, targets, 320px reflow, 200% zoom, contrast and reduced motion meet
  WCAG 2.2 AA expectations.
- NFR-HML-002 Performance: the above-the-fold Banner reserves stable dimensions;
  only justified first-slide media receives priority and below-fold media remains
  deferred under released Image behavior.
- NFR-HML-003 Rendering: daily selection is produced before the server response;
  hydration never performs a second random choice or substitutes Product IDs.
- NFR-HML-004 Reliability: selection and public Product membership are
  deterministic for the same inputs and fail by omission rather than ineligible
  or fabricated content.
- NFR-HML-005 Consistency: the optional 1400px capability and grid contract do not
  mutate existing Platform defaults or unrelated consumers.
- NFR-HML-006 Presentation: the entire Homepage remains light-only and uses shared
  Cards, Carousel, Container, Section and payment information foundations.

## Edge Cases

- A daily boundary crossed during an already loaded page does not mutate that
  page; the next navigation/refresh may receive the new business-day outcome.
- A catalog eligibility change may invalidate the daily selection before
  midnight; the next non-stale response recomputes from eligible data.
- A newly eligible Category joins the next valid candidate set without changing
  taxonomy order or receiving guaranteed selection.
- With one eligible Category, it remains selected across days. With no eligible
  Category, the final region remains absent.
- Duplicate Category names do not affect selection or destination identity;
  stable Category identity governs the outcome.
- Fewer Cards never generate empty placeholder Cards to complete a visual row.
- A Banner action whose destination is unavailable is omitted; the slide remains
  valid when its required title is present.

## Traceability and Review

- Order/Banner: FR-HML-001–006, BR-HML-001 and 008–009,
  AC-HML-001–003 and 014.
- Width/grids/collections: FR-HML-007–011, BR-HML-002, 006–007 and 010–012,
  AC-HML-004–005 and 011–013.
- Daily Category: FR-HML-012–017, BR-HML-003–007,
  AC-HML-006–010, NFR-HML-003–004.
- Preservation: FR-HML-018 and NFR-HML-001–002 and 005–006.

Requirements Review result: Approved. HML-001–HML-005 are complete and UX may
consume this contract without inventing Product behavior.
