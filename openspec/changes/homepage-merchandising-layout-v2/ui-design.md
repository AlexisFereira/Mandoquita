# Homepage Merchandising Layout V2 — UI Design

Status: Feature UX/UI and Accessibility Design Approved — Implemented

Owner: UX/UI Designer

Date: 2026-07-13

## Dependency and task status

This artifact translates approved Requirements, Architecture, UX Solution and
Design System contracts into an implementation-ready Homepage composition. It
does not change Banner inventory, Category/Product eligibility, Featured limits,
daily selection, payment meaning, Carousel behavior or public URLs.

| Deliverable | UX/UI status | Dependency |
| --- | --- | --- |
| HML-011 Complete merchandising composition | Complete | Approved HML-001–HML-010 contracts. |
| HML-012 joint Accessibility Design Review | Approved | Independent approval recorded in `accessibility-design-review.md`. |
| Feature integration | Released | HML-015–HML-026 and Platform MLC-001–MLC-012 are complete. |

## Canonical page composition

Use exactly one DOM flow in this order:

1. Banner Slider, when valid slides exist.
2. Categories, when eligible Categories exist.
3. Featured Products, when released Featured membership exists.
4. Payment Methods Banner, when its exact static content renders safely.
5. Products from the server-selected Category, when supplied.
6. Existing Contact region.
7. Existing Footer.

The former separate Hero is removed completely. It is not retained beside the
Slider and is not restored when Banner content is absent. Omitted optional
regions render no heading, landmark, controls, divider, skeleton or residual
section margin. Surviving regions keep their relative semantic and visual order.

The Banner sits outside every content Container and spans the viewport. All
remaining merchandising regions use `Container size="wide"`; Contact uses the
same wide internal alignment without changing its released behavior. The
Container retains Platform-owned responsive padding and centered 1400px maximum.
Footer retains its released width contract.

### Page rhythm

- Banner to first surviving content region: 48px below 640px, 56px at
  640–1023px and 64px from 1024px.
- Between surviving merchandising sections: 40px below 640px, 48px at
  640–1023px and 64px from 1024px.
- Selected Category to Contact: use the same section rhythm once.
- Section heading to collection/banner: 20px below 640px and 24px from 640px.
- H2 and supporting copy: 8px separation; supporting copy to collection: 20px
  below 640px and 24px from 640px.

Spacing belongs to each rendered section wrapper. Do not stack both previous and
next section margins or insert an empty-slot spacer after omission.

## Full-width Banner Slider — HML-011

### Slide composition

The Banner is the first Homepage content region and uses the released
promotional Carousel only when at least two valid slides exist. Each slide
contains, in DOM order:

1. Decorative/fallback media layer using the approved 16:9 source ratio.
2. Contrast-supporting semantic overlay/gradient.
3. Internal `Container size="wide"` alignment wrapper.
4. Slide content group: required title, optional description and optional action.
5. Carousel controls outside the content/action collision zone when applicable.

Title, description and action are real HTML. Required meaning, logos or action
text never exist only in image pixels. The title is the slide heading within the
Homepage heading hierarchy, not an additional page H1. The action uses its
approved destination and distinguishable text; an invalid destination omits the
action without invalidating a titled slide.

### Media frame and crop safety

- Preserve the released 16:9 Banner source frame before image load to avoid
  layout shift. Media is positioned as a background/decorative layer with
  `object-fit: cover` only for focal-safe assets.
- The visual shell uses `min-height: 360px` below 640px, `420px` at
  640–1023px and `clamp(480px, 50vw, 720px)` from 1024px. Content may increase
  height rather than overlap or clip.
- At narrow widths, align content to the lower safe area with at least 24px top,
  16px horizontal and 72px bottom clearance when controls exist. From 640px use
  at least 32px horizontal safe padding and the Container gutter thereafter.
- Meaningful focal content remains within the asset's center-safe area. Crop
  cannot be relied upon to convey offer copy, dates, prices or action meaning.
- Missing/loading/failed media uses the released fallback surface and gradient;
  title, description, action and controls retain contrast and stable placement.
- Only the justified first slide image may load eagerly. Later slide media uses
  released deferred behavior.

### Content hierarchy

The copy group is `min(100%, 600px)` from 1024px and full available width below.
Use the released inverse-on-media text roles. Recommended hierarchy:

- Title: Homepage display/H2-equivalent style, maximum readable line length
  approximately 22 characters per line where natural wrapping permits.
- Description: body-large, maximum 60 characters per line, up to a comfortable
  readable block without CSS truncation.
- Action: primary promotional Button/link, minimum 44px target, content-width on
  desktop and full available width only when needed below 480px.

Use 12px between title/description, 20px before action and no decorative text
animation. Long approved copy wraps; it does not shrink below released readable
type or overlap controls.

### Zero, one and multiple slide states

| Valid slides | Rendering |
| ---: | --- |
| 0 | Omit complete Banner region and spacing. Never render Hero or Carousel shell. |
| 1 | Render one static Banner; no autoplay, indicators, pause or previous/next controls. |
| 2–3 | Render released Carousel in business order with six-second behavior, manual controls, pause and reduced-motion rules. |

Manual controls use persistent names such as `Banner anterior`, `Banner
siguiente` and the released pause/resume label/state. Position indicators, when
part of the released Carousel, expose the destination slide position/title and
44px effective targets. Controls sit within viewport-safe gutters and never
cover the primary action or meaningful text.

Manual navigation changes the perceived slide without moving keyboard focus into
slide content. Autoplay ticks do not repeatedly announce full slide content.
Focus/hover pauses under the released contract. With reduced motion, automatic
advancement and transition motion are disabled while content and manual controls
remain operable.

## Categories section — HML-011

### Composition

Use a labelled `<section>` only when one or more eligible Categories exist:

1. H2 `Categorías`.
2. One semantic list using `CollectionGrid as="ul"`.
3. One released Category Card per list item in server business order.

There is no presentation cap, `Ver más`, Carousel, horizontal scroller, masonry,
responsive hiding or fabricated placeholder. Every eligible Category renders
once; additional Categories create more rows.

Category Cards retain their released image/fallback, official name, canonical
link and accessible name. The grid owns layout only. At 320px, with existing
Container gutters and the 16px gap, each fluid track may be approximately 136px;
the Card must wrap its identity and preserve its link target rather than impose a
larger minimum width.

Missing Category media uses the released fallback. Zero/unsafe collection data
omits the full section. No error Card or visitor-facing catalog-system message is
inserted between Banner and Featured; later sections remain available.

## Featured Products section — HML-011

Render only when the Backend supplies released Featured membership:

1. Labelled section with H2 `Productos destacados`.
2. One semantic ordered/list collection using `CollectionGrid`.
3. Released Product Cards in curated Featured order.

Membership is resolved before Card creation: maximum eight at viewport widths
of 1280px and wider, maximum four below 1280px. The grid never hides children to
simulate this limit. Consequently:

- At 1400px and wider, up to eight Cards use six columns and wrap remaining
  Cards to a second row.
- At 1280–1399px, up to eight Cards use four columns.
- At 1024–1279px, up to four Cards use four columns.
- At 640–1023px, the same maximum four use three columns and wrap.
- Below 640px, the same maximum four use two columns.

Do not stretch a final short row into invented equal-width entities. Product
Cards retain released media fallback, identity, canonical link, price/status
meaning and accessible target. Zero Featured membership omits the heading and
complete section; it does not claim that the catalog is empty.

## Payment Methods Banner — HML-011

### Visual composition

Use one non-interactive informational `<section>` inside
`Container size="wide"`. The Banner uses the released light semantic accent or
muted surface, medium/large radius, semantic border and no promotional dark
theme. Internal padding is 24px below 640px, 32px at 640–1023px and 40px from
1024px.

DOM and reading order:

1. H2 `Medios de pago`.
2. Existing informational/external-confirmation guidance.
3. Semantic list containing exactly:
   1. Binance.
   2. Pago móvil.
   3. Dólares en efectivo.

At 1024px and wider, the three methods form three equal columns with 24px gaps.
At 640–1023px they may use three columns only while each retains readable text;
otherwise use one vertical list. Below 640px use one column with 16px separation.
This internal layout is not a governed Product/Category `CollectionGrid`.

Each method may use an existing decorative icon followed by a text heading and
released supporting description. Icons use `aria-hidden` when text supplies the
meaning. The Banner contains no checkbox, radio, selector, amount, checkout CTA,
availability state, success status or interaction that suggests payment has
started. It is visually distinct from the later Contact region and never becomes
the contact action.

If exact static content cannot render safely, omit the complete Payment section.
Do not substitute another method, expose an empty Banner or move the selected
Category ahead of Featured/Categories.

## Selected-Category Products — HML-011

### Composition and writing

Render only from the server-confirmed projection:

1. Labelled section.
2. H2 `Productos de {nombre oficial de la categoría}`.
3. Optional supporting copy: `Descubre una selección de esta categoría para
   hoy.`
4. One semantic list using `CollectionGrid` with up to six Product Cards in
   canonical unsearched Catalog order.
5. Text-visible continuation link `Ver categoría {nombre oficial}`.

The continuation action appears after the complete grid in DOM and visual order,
uses the canonical Category destination, has a 44px target and aligns left below
640px/right or left according to the released section action pattern at larger
widths. Duplicate Category names remain distinguished by link destination, not
internal IDs.

Do not use `Para ti`, `Recomendado`, `Categoría aleatoria`, countdown, reroll or
activity/history language. Do not animate the selection. The copy describes one
shared editorial discovery for the current Bogotá day.

The same maximum-six ordered Cards persists across every breakpoint: 6 in one
row at 1400px, 4+2 at 1024–1399px, 3+3 at 640–1023px and 2+2+2 below 640px.
Fewer Products render only supplied Cards without placeholders or stretching.

No selected Category, invalid projection or zero eligible Products omits the
heading, copy, grid, CTA and section spacing. Missing Product media uses the
released fallback without changing membership. Hydration never substitutes,
rerolls or briefly displays another Category.

## Shared CollectionGrid and Card contract

Categories, Featured and selected-Category Products use the approved Platform
component with exact density:

| CSS viewport | Columns | Gap |
| --- | ---: | ---: |
| 320–639px | 2 | 16px |
| 640–1023px | 3 | 24px |
| 1024–1399px | 4 | 24px |
| ≥1400px | 6 | 24px |

- Tracks are fluid `minmax(0, 1fr)` and remain inside the wide Container.
- Source, visual, reading and Tab order remain identical.
- One Card instance exists per entity. No desktop/mobile duplicate, CSS order,
  masonry, placeholder, horizontal Card scroller or viewport-specific entity
  removal is permitted.
- Cards keep released image ratios and use stable media geometry. Names, prices,
  labels and actions wrap within the assigned track; meaningful content is not
  clipped to make two columns fit.
- Fewer items leave unused grid tracks; they do not grow into a different Card
  design or create fake entries.
- Layout introduces no entrance/reorder animation and never changes server-owned
  membership.

## Loading, omission and failure matrix

| Region/outcome | Visible behavior | Layout behavior |
| --- | --- | --- |
| Banner image loading/failure | Stable frame, fallback, readable HTML content. | Preserve Banner geometry; no shift in following sections. |
| Zero valid slides | Nothing rendered. | Categories or next surviving region receives normal single section spacing. |
| Categories unavailable/empty | Nothing rendered; no fabricated Cards/error landmark. | Featured or next surviving region keeps canonical order. |
| Featured unavailable/empty | Nothing rendered; no catalog-empty claim. | Payment remains in its fixed slot after surviving Categories. |
| Payment static render failure | Nothing rendered; no substitute payment UI. | Selected Category or Contact follows canonical relative order. |
| Selected projection unavailable/empty | Nothing rendered; no random/client loading state. | Contact follows Payment or previous surviving region. |
| Card media failure | Released entity fallback and text/link remain. | Membership/order and Card geometry remain stable. |
| Page-level safe-render failure | Existing Homepage recovery and reload. | Never expose API, cache, timezone or eligibility details. |

SSR supplies every section membership before initial render. Do not create a
selected-Category skeleton that later changes identity. Optional below-fold
Images use released lazy loading; only the justified initial Banner asset may be
prioritized.

## Responsive layouts

### Mobile: 320–639px

- Platform Container gutters remain active; page has no horizontal overflow.
- Page headings and supporting copy use natural wrapping.
- Banner shell has at least 360px content-safe height; action and Carousel
  controls do not overlap.
- All governed collections use two columns with 16px gap, including 320px and
  zoom/reflow validation.
- Payment methods stack; selected-Category CTA remains after its grid.
- Contact and Footer retain released mobile behavior.

### Tablet: 640–1023px

- Collections use three columns with 24px gap.
- Banner content remains within a 600px readable maximum and at least 420px shell
  height.
- Payment methods use columns only when all text remains readable; otherwise
  preserve one semantic vertical list.

### Desktop: 1024–1399px

- Collections use four columns with 24px gap.
- Banner content aligns to wide Container gutters while media remains full
  viewport width.
- Payment methods use three equal informational columns.

### Wide: 1400px and above

- Non-Banner merchandising content remains centered at maximum 1400px.
- Collections use six columns and 24px gap.
- Banner background continues beyond the 1400px content alignment to viewport
  edges; no max-width is placed on its media shell.

## Accessibility self-review — HML-012

- Homepage preserves one H1 contract and uses ordered H2 section headings. An
  omitted section creates no empty heading, landmark, controls or status.
- Banner copy/action is HTML and independent from pixels/crop. Missing media has
  a stable fallback; decorative background media does not duplicate title text.
- Zero/one/multiple slide behavior removes inapplicable controls. Multiple-slide
  controls retain names, 44px targets, visible focus, pause and logical DOM order.
- Autoplay changes are not fully re-announced on each tick. Manual change uses
  controlled status without moving focus. Reduced motion disables automatic and
  transition motion while preserving manual access.
- Category and Product collections use native list semantics. DOM, visual,
  screen-reader and Tab order match server business order at 2/3/4/6 columns.
- At 320px and 200% zoom, two fluid columns, headings, Card content, Carousel
  controls, payment list and CTA remain reachable with no page-level horizontal
  scrolling. Text is not truncated to preserve density.
- Category/Product links and all Carousel/CTA controls retain at least 44 by 44px
  effective targets and the released focus-visible style.
- Payment methods use heading/list/text semantics and contain no interactive
  selection role or transactional live status.
- Daily discovery names the official Category and canonical destination without
  personalization, randomness or internal identity language.
- Released light-only surface/text/border/focus/inverse roles meet contrast;
  Banner inverse treatment is a component surface, not a dark theme.
- Text spacing, browser zoom and broken Images do not remove entity identity or
  action meaning. No content depends on hover, animation or fine pointer use.

The UX/UI self-review is complete with no design blocker. Accessibility Review
independently approved the specification in `accessibility-design-review.md`;
HML-012 and rendered browser evidence HML-023 are complete.

## Frontend handoff boundary

Frontend implemented HML-015 through HML-020 from this artifact using the shared
`Container size="wide"` and `CollectionGrid`, without feature-local width/grid
primitives. Backend remains authoritative for membership, order, daily Bogotá
selection and SSR/cache identity. The implementation removes the separate Hero,
preserves exact section order and avoids client randomization, responsive
duplication and payment interaction. Platform MLC-010–MLC-012 and Homepage
HML-021–HML-024 were completed as independent validation/release gates; final
Homepage approval HML-026 is complete and recorded in `release-approval.md`.
