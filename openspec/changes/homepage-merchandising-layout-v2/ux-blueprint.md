# Homepage Merchandising Layout V2 — UX Solution

Status: UX Ready — Requirements and Architecture Approved

Owner: UX Solution Architect

Date: 2026-07-13

## Experience Goal

Give every visitor one predictable, visually rich discovery path from editorial
Banner content into Categories, curated Products, payment information, a shared
daily Category discovery and Contact, without introducing personalization,
transactional behavior or unstable client-side selection.

## Experience Principles

1. **Order is meaning.** Regions retain the approved sequence regardless of data
   arrival, viewport or omitted optional content.
2. **Density never changes membership.** Responsive columns only reflow the same
   ordered entities.
3. **Daily discovery is shared, not personalized.** The selected Category is one
   server-confirmed editorial outcome for the Bogotá business day.
4. **Absence is clean.** Missing optional content leaves no orphan heading,
   control, divider or spacing artifact.
5. **Payment remains information.** The Banner explains accepted methods without
   selection, amounts, confirmation or checkout language.

## Canonical Homepage Hierarchy — HML-008

```text
Homepage
├── 1. Banner Slider (full viewport width; optional)
├── 2. Categories (1400px content maximum; optional)
├── 3. Featured Products (1400px content maximum; optional)
├── 4. Payment Methods Banner (1400px content maximum)
├── 5. Products from selected Category (1400px maximum; optional)
├── 6. Contact (existing region, 1400px internal maximum)
└── 7. Footer
```

The former separate Hero does not exist in V2, including when Banner content is
absent. Omission closes the region completely; every surviving region keeps its
relative position and Contact always follows the five merchandising slots.

## Primary Visitor Journey

1. The visitor reaches Homepage through the canonical root destination.
2. When valid Banner content exists, the first content region communicates the
   current presentation-owned editorial messages.
3. The visitor explores every eligible Category in released business order.
4. The visitor reviews the released curated Featured Product collection.
5. The visitor reads the three informational payment methods.
6. When an eligible daily Category exists, the visitor sees its official name,
   up to six canonically ordered Products and a path to its Category Page.
7. The visitor may continue to the existing Contact region.

Each Category/Product Card retains its canonical link and released accessible
meaning. Homepage never changes entity eligibility, order or visitor state.

## Banner Slider Journey

### Region hierarchy

1. Full-width Banner media/background shell.
2. Meaningful inner content aligned safely with the Homepage content grid.
3. Required slide title.
4. Optional description.
5. Optional approved action.
6. Released Carousel position/manual controls when more than one valid slide.

The current three slides retain their business order, copy, Images and approved
destinations. The region neither discovers catalog content nor exposes Banner
administration.

### Zero, one and multiple slides

- **Zero valid slides:** omit the complete Slider. Do not restore Hero, render a
  blank shell, leave Carousel controls or reserve unexplained vertical space.
- **One valid slide:** present static Banner content without autoplay, position
  indicators or next/previous controls.
- **Multiple valid slides:** use the released six-second Carousel, pause/manual
  controls and reduced-motion behavior without changing interval or semantics.

### Image and action outcomes

- Missing or failed Image uses the released Banner fallback while preserving
  readable title/description and action.
- Content-safe alignment prevents meaningful text/action from depending on an
  image crop.
- An absent action leaves the slide informative and fully valid.
- An unavailable/invalid action destination omits only that action; it does not
  remove a valid titled slide or invent another destination.
- Media loading reserves stable geometry so later content does not jump.

### Interaction and transition

- Manual navigation establishes the currently perceived slide without moving
  focus into content unexpectedly.
- Pause-on-interaction, focus/hover behavior and reduced-motion follow the
  released Carousel contract.
- Slide transitions never alter the location/order of following Homepage
  regions or block their keyboard access.

## Categories Journey

### Hierarchy

- Heading `Categorías`.
- Complete eligible Category collection in released business order.
- Each Category Card exposes released Image/fallback, official name and canonical
  Category destination.

There is no presentation cap, `Ver más` truncation or viewport-based hiding.
More Categories create additional rows while semantic order remains unchanged.

### Outcomes

- Missing Category media uses the released Category fallback and does not remove
  an otherwise eligible Category.
- Zero eligible Categories omits the complete region, including heading and
  spacing; Featured remains the next surviving region after Banner.
- Unsafe/unavailable collection data never produces fabricated Categories. The
  server-safe omission/error boundary preserves access to later regions and a
  page refresh remains the recovery.

## Featured Products Journey

### Hierarchy and membership

- Heading `Productos destacados`.
- Released Product Cards in curated Featured order.
- Maximum eight Products at 1280 CSS pixels and wider and four below 1280px.

Grid density does not redefine the collection limit or Featured meaning. At
1024–1279px, four Cards occupy the approved four-column grid; at narrower widths,
the same maximum four wrap through three/two columns without hiding or reordering.

### Outcomes

- Missing Product media uses the released Product fallback without changing
  Product eligibility.
- Zero Featured Products omits the complete region without placeholder Cards or
  a false empty-catalog statement.
- Invalid/ineligible items are not displayed. A safe collection failure affects
  only this region and does not shift Payment ahead of Categories.

## Payment Methods Banner Journey

### Content hierarchy

1. Heading `Medios de pago`.
2. Binance.
3. Pago móvil.
4. Dólares en efectivo.
5. Existing external-confirmation/informational guidance.

The methods retain this exact meaning and order. Presentation may become a
Banner, but it contains no selection controls, radio/check states, amount,
checkout action, success state or claim that a method is currently available for
an online transaction.

The region sits after Featured (or its omitted slot) and before the daily
Category region. It does not become a Contact action; the existing Contact region
remains later in the page.

If the static content cannot be safely rendered, omit the region without
inventing a method or payment error workflow. No other region changes order.

## Selected-Category Products Journey

### Visitor interpretation

The region is an editorial discovery section, not a personalized recommendation.
It must not use copy such as `Para ti`, `Según tus intereses` or `Recomendado por
tu actividad`.

### Hierarchy

1. Heading using the official Category name, for example
   `Productos de {Category name}`.
2. Optional supporting copy stating that this is today's Category discovery
   without implying a countdown or live random draw.
3. Up to six released Product Cards in canonical unsearched Catalog order.
4. Labelled canonical continuation `Ver categoría {Category name}`.

The Category name/link distinguishes duplicate names through their canonical
destination, not by exposing internal identity.

### Stable daily behavior

- Render exactly the server-provided Category and Product membership.
- Do not animate a random choice, reroll, personalize, persist a visitor choice or
  recompute after hydration.
- A viewport change only reflows the same ordered maximum-six Cards.
- Crossing Bogotá midnight does not mutate an already loaded page; the next
  navigation/refresh may show the newly confirmed selection.
- A public-eligibility change may safely alter/omit a later response before
  midnight; no explanation of internal eligibility is shown.

### Empty and failure outcomes

- Fewer than six eligible Products: show every supplied Product, with no empty
  placeholder Cards.
- No eligible Category: omit heading, Cards, CTA and region spacing.
- Missing/invalid selected projection: omit only this region; preserve Payment,
  Contact and Footer.
- Missing Product media: use released fallback and retain eligible membership.
- A Category with data that becomes unsafe/ineligible is never shown as a stale
  empty shell; safe recomputation or total region omission is authoritative.

## Section Transition and Omission Matrix

| Region | Valid content | Empty/invalid outcome | Next surviving region |
|---|---|---|---|
| Banner Slider | Full-width first region | Omit; never restore Hero | Categories or next available |
| Categories | Complete eligible collection | Omit heading/spacing | Featured or next available |
| Featured | Released bounded collection | Omit heading/spacing | Payment Methods |
| Payment Methods | Exact informational Banner | Omit safely; no substitute | Selected Category or Contact |
| Selected Category | Official Category + ≤6 Products | Omit complete region | Contact |
| Contact | Released experience | Released outcome | Footer |

Omission never promotes a later region into a different semantic role. Adjacent
surviving sections use the normal section spacing once; no doubled divider or
empty landmark remains.

## Loading and Error Recovery

- Homepage SSR supplies the section membership before rendering. Do not show a
  client-side randomization/loading state for the selected Category.
- Above-fold Banner reserves dimensions; its fallback retains readable content.
- Below-fold Images use released deferred-loading behavior; Cards remain stable
  while media resolves.
- A failed optional region cannot block navigation to already rendered regions.
- A page-level safe-render failure offers the existing Homepage reload recovery
  and never exposes cache, timezone, eligibility or API details.
- Hydration mismatch must not be reframed as a visitor-facing change of Category;
  the implementation must retain the server outcome or fail safely.

## Responsive Composition

All Category and Product grids use one semantic collection and one Card instance
per entity:

| Viewport | Columns |
|---|---:|
| ≥1400px | 6 |
| 1024–1399px | 4 |
| 640–1023px | 3 |
| 320–639px | 2 |

- Non-Banner content is centered at a maximum 1400px with responsive gutters.
- Banner media/background remains viewport-wide; meaningful content aligns within
  safe readable bounds.
- At 320px and 200% zoom, two Card columns remain usable without page-level
  horizontal overflow, clipped identity or inaccessible targets.
- Cards wrap into additional rows; no responsive branch adds/removes/reorders
  selected Products or Categories.
- Headings, payment methods and Contact use natural text wrapping rather than
  truncation or horizontal scrolling.

## Accessibility Requirements

- Homepage has one clear primary heading contract and ordered labelled sections;
  omitted content creates no empty landmark/heading.
- Carousel controls have persistent accessible names/state, keyboard operation,
  pause support and visible focus under the released contract.
- Current slide is understandable without announcements on every autoplay tick;
  manual changes use controlled status semantics.
- Grid DOM/reading/tab order equals visual/business order at every viewport.
- Category/Product Card links remain distinguishable and retain 44px targets.
- Payment methods use semantic text/list structure and are not presented as
  interactive options.
- Daily Category copy does not imply personalization and its CTA names the
  Category destination.
- Missing/broken Images retain meaningful text/fallback identity.
- Content passes 320px reflow, 200% zoom, text spacing, contrast, visible focus,
  reduced motion and deterministic light-only presentation.

## UX Writing Contract

Preferred labels:

- `Categorías`
- `Productos destacados`
- `Medios de pago`
- `Productos de {Category name}`
- `Ver categoría {Category name}`
- Existing Banner/Contact copy without unapproved alteration.

Avoid `Para ti`, `Recomendado según tu actividad`, `Categoría aleatoria`, payment
selection/completion language, inventory guarantees or placeholder eligibility
claims.

## UX Validation Checklist

- [x] Exact Banner, Categories, Featured, Payment, selected Category, Contact and
  Footer hierarchy is defined.
- [x] Zero/one/multiple Banner, fallback, action omission and no-Hero outcomes are
  defined without changing Carousel behavior.
- [x] Complete Categories, released Featured limits and stable maximum-six daily
  Products retain business order across 6/4/3/2 grids.
- [x] Daily selection is interpreted as shared server-owned discovery, not
  personalization or client randomness.
- [x] Section omission/error outcomes preserve relative order and remove orphan
  headings, controls, dividers and spacing.
- [x] Payment remains exact informational content without interaction/state.
- [x] 1400px/full-width boundaries, 320px, 200% zoom, keyboard, reading order,
  motion, focus, media fallback and light-only behavior are documented.
- [x] No Banner domain, new ranking, visitor tracking, payment or duplicated Card
  model was introduced.

## Handoff

HML-008 is UX-ready. Design System and UX/UI may consume this blueprint for
HML-009–HML-012. Backend and React Frontend must consume the approved Product,
Architecture, Design and Accessibility contracts for HML-013–HML-020; this
document does not prescribe component APIs, selection algorithms or cache code.
