# Homepage Full-width Promotional Hero V1 — UX/UI Proposal

Status: Proposed — Product, UX and Architecture Review Required

Owner: UX/UI Designer

Date: 2026-07-13

## Problem

The current Homepage Hero divides the first viewport into a text column and a
nearly square Carousel column. This makes promotional media feel secondary,
reduces image impact, and leaves limited room to present launches or campaigns as
an intentional editorial story.

The proposal replaces that side-by-side composition with one edge-to-edge Hero
banner system while preserving the Homepage's discovery-only, accessible,
light-only and non-transactional boundaries.

## Recommended direction

Use one full-width promotional Carousel directly below the sticky Header. Each
slide fills the available page width, while all text and controls align to the
shared 1280px content grid.

The Hero has two content layers:

1. **Stable business orientation:** `Catálogo Mandoquita` and the single page H1
   remain visible across every slide.
2. **Rotating campaign content:** promotion/launch label, campaign heading,
   concise supporting copy and one discovery action change with the active slide.

This keeps the business purpose understandable without waiting for rotation and
allows each banner to communicate a distinct launch or promotion.

## Proposed information hierarchy

1. Optional campaign label: `Nuevo lanzamiento`, `Destacado` or another
   business-approved label.
2. Stable eyebrow: `Catálogo Mandoquita`.
3. Stable H1: one concise business-orientation statement.
4. Active-slide H2: the specific Product, Category or collection story.
5. Active-slide description: one short benefit-oriented sentence.
6. One primary discovery CTA.
7. Carousel position and previous/next controls.

Promotional price, discount, deadline, stock or availability claims require
separate Product/Business approval and an authoritative source. The UI must never
invent these from Product price, Featured state or Commercial Availability.

## Wireframe

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Full-bleed campaign image                                                   │
│  ┌──────────────────────── shared 1280px grid ────────────────────────────┐ │
│  │ Catálogo Mandoquita                                  Product focal area │ │
│  │ H1: Productos para acompañar tu día                                     │ │
│  │                                                                          │ │
│  │ [Nuevo lanzamiento]                                                      │ │
│  │ H2: Campaign or Product story                                            │ │
│  │ Concise supporting copy                                                  │ │
│  │ [Explorar lanzamiento]                                                   │ │
│  │                                                                          │ │
│  │ ● ○ ○                                           [Anterior] [Siguiente]   │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌───────────────────────────┐
│ Product focal area        │
│                           │
│ soft contrast gradient    │
│ Catálogo Mandoquita       │
│ H1 business orientation   │
│ [Nuevo lanzamiento]       │
│ H2 campaign story         │
│ Supporting copy           │
│ [Explore]                 │
│ ● ○ ○          [‹] [›]    │
└───────────────────────────┘
```

## Layout and dimensions

### Rendered Hero frame

| Viewport | Frame behavior |
| --- | --- |
| Mobile `<640px` | Full width; `min-height: 560px`; portrait composition; content anchored to lower safe area with 16px gutter. |
| Tablet `640–1023px` | Full width; `min-height: 480px`; landscape composition; 24–32px gutter. |
| Desktop `1024–1439px` | Full width; height uses `clamp(520px, 42vw, 640px)`; content aligns to shared 1280px grid. |
| Large desktop `≥1440px` | Full width; maximum 680px height; campaign background may extend beyond the 1280px content grid. |

The frame starts immediately below the Header. It has no outer Container, card
border, square media wrapper or elevated panel. A subtle bottom radius is optional
only if it does not create artificial page gutters; full-bleed square corners are
preferred for the modern editorial direction.

### Required responsive image masters per campaign

| Asset | Exact canvas | Ratio | Art direction |
| --- | --- | --- | --- |
| Large/desktop | 2560 × 1024px | 5:2 | Product focal point in right 52–88%; left 44% remains low-detail for HTML copy. |
| Tablet | 1600 × 900px | 16:9 | Product focal point in right 48–88%; preserve central crop safety. |
| Mobile | 1080 × 1350px | 4:5 | Product focal point in upper 8–52%; lower 46% remains low-detail for HTML copy and controls. |

- Deliver AVIF or WebP with an optimized JPEG/PNG fallback only when required.
- Never bake headings, prices, CTA labels, logos or legal copy into the image.
- Use `<picture>` art direction rather than forcing one desktop crop onto mobile.
- Keep key Products completely inside their focal safe area and away from controls.
- Apply a token-based directional overlay/gradient in UI so contrast is consistent
  across campaigns; do not permanently darken the source asset.
- The first image is eager/high priority; later slides are lazy-loaded without
  changing the frame height.

## Typography and content limits

- Stable H1: maximum 42 characters or two desktop lines; 32–48px responsive role.
- Campaign label: maximum 24 characters; eyebrow role, not a pill by default.
- Campaign H2: maximum 48 characters or two lines; 28–40px responsive role.
- Description: maximum approximately 100 characters and three mobile lines.
- CTA: one primary action, maximum 24 characters. An optional secondary action is
  allowed only when Product/UX demonstrates a distinct necessary destination.
- Copy column: maximum 560px desktop and full available width mobile.
- Use inverse semantic foreground roles over the overlay; no per-banner arbitrary
  text colors or uncontrolled gradients.

Illustrative campaign copy is not business approval:

- `Nuevo lanzamiento` — `Tecnología para sentirte más seguro` — `Ver cámaras`.
- `Nueva colección` — `Estilo que acompaña tu día` — `Explorar moda`.
- `Selección Mandoquita` — `Productos prácticos para tu hogar` — `Ver categoría`.

## Interaction model

- Support 3–5 active slides; use one static Hero when only one campaign exists.
- Preserve the approved 6-second autoplay interval.
- Pause autoplay on pointer hover, keyboard focus and document invisibility.
- `prefers-reduced-motion: reduce` disables autoplay and slide transition motion.
- Manual navigation uses previous/next controls and position indicators with at
  least 44 by 44px targets.
- Previous/next controls retain accessible Spanish names and visible text on
  tablet/desktop. Mobile may visually show Icons only when the parent buttons
  retain complete accessible names.
- Selecting a position or previous/next control updates the active campaign
  without moving keyboard focus.
- Swipe may supplement controls on touch screens but is never required.
- Manual interaction restarts or pauses autoplay according to the existing
  approved Carousel contract; no scroll hijacking or parallax is introduced.

## Accessibility

- The Hero owns the single Homepage H1. Slide campaign titles use H2.
- Stable orientation content remains available when JavaScript, images or
  autoplay fail.
- Only the active campaign content is exposed as current; hidden slide content is
  excluded from focus and the accessibility tree without removing the stable H1.
- Campaign changes do not generate repeated live-region announcements. A visitor
  requesting a slide through controls receives current-position context through
  the controls/indicator state.
- Text contrast meets WCAG 2.2 AA against the final image plus overlay, tested for
  every individual asset at mobile, tablet and desktop crops.
- Focus indicators use the shared semantic focus role and remain visible over
  light and dark portions of artwork.
- The frame causes zero layout shift and remains usable at 320 CSS pixels and
  200% zoom. Copy and CTA wrap; the page never scrolls horizontally.
- Image alternative text describes meaningful campaign imagery without repeating
  the adjacent H1/H2. Decorative background art uses empty alternative text.

## Content and business boundaries

- CTA destinations are limited to eligible Product Detail, Category,
  Subcategory, Featured Products or approved Contact discovery paths.
- No cart, checkout, purchase, reservation, countdown timer or payment action.
- A `Promoción` label must not imply a discount unless exact promotional terms
  are approved and publicly supportable.
- Unpublished or taxonomy-ineligible Products cannot appear in a launch banner.
- When a campaign image fails, retain stable orientation and campaign text over
  the shared intentional fallback; never collapse the Hero.
- When there are no approved campaigns, render one static business-orientation
  Hero with discovery actions rather than an empty Carousel.

## Component impact

Frontend implementation should introduce an explicit full-width promotional Hero
composition or a governed variant rather than weakening the existing generic
`Hero` contract for every consumer.

Expected affected surfaces:

- Homepage composition in `pages/index.tsx`.
- Promotional mode of `Carousel` or a dedicated `PromotionalHeroCarousel`.
- Responsive `<picture>` campaign media contract.
- Banner assets and their content data shape.
- Homepage visual, UX, accessibility and test artifacts.

Product Gallery mode remains unchanged. Scroll-entry Motion remains prohibited on
the initial Hero. Existing Category, Product, Payment Information and Contact
sections retain their order and behavior.

## Approval and implementation gates

1. Product Requirements approves promotional meaning, allowed claims, campaign
   eligibility and fallback content.
2. UX Solution Architecture approves the revised first-viewport hierarchy and
   confirms that stable business orientation remains independent of rotation.
3. Design System reviews the full-bleed Hero variant, responsive media contract,
   overlays, controls and tokens.
4. Accessibility reviews active/hidden slide semantics, autoplay, focus, contrast,
   reduced motion, zoom and reflow.
5. React Frontend Architecture defines the typed campaign data and implements the
   approved variant without changing Gallery Carousel behavior.
6. QA validates all image crops, content states, keyboard/pointer/touch behavior,
   no-script fallback, performance and cross-page regression.

