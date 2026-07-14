# Public Catalog Visual Contract

Version: 1.0

Status: Active — Canonical

Owner: Design System Architect

Last synchronized: 2026-07-14

Applies to: public Homepage, Featured Products, Category, Subcategory, Search,
Product Detail, Header, Footer and shared public catalog components.

---

# Purpose and precedence

This document is the current visual and interaction contract for the public
catalog. New proposals, designs, specifications, tasks and implementations must
reference it and must not copy superseded values from completed changes or
historical feature documents.

When visual guidance conflicts, use this order:

1. Project governance and conventions.
2. This public catalog visual contract.
3. Current canonical feature amendments.
4. Active change artifacts.
5. Completed tasks, release evidence and historical designs, which are
   informative only.

A future artifact may change this contract only by recording the reason, the
affected components, accessibility impact, migration plan and explicit Design
System approval. Silent divergence is prohibited.

# Global presentation

- The public application has one deterministic light theme.
- Operating-system preference, stored state and user controls never select a
  dark theme.
- Header, mobile navigation and Footer use light semantic surfaces. A dark
  Header is not an allowed inverse-surface exception.
- Inverse roles are reserved for local contrast overlays and deliberately
  bounded content regions such as readable text over media. They do not create
  a second theme.
- Semantic tokens remain the only source for color, spacing, typography,
  radius, elevation, focus and motion.
- Interactive targets are at least 44 by 44 CSS pixels and expose visible
  keyboard focus.

# Content boundary and alignment

- The canonical public content boundary is `Container size="wide"`: width
  `100%`, maximum `1400px`, centered, with the shared large horizontal gutter
  (`24px` at its current token value).
- Header identity/navigation, Footer content, Homepage section content,
  Category, Subcategory, Search and Product Detail use that same boundary.
- A full-bleed background or media region may span the viewport, but its
  meaningful text, actions and controls remain aligned to the wide boundary.
- Use one internal content container per section. Nested page-width containers,
  page-level horizontal overflow and independent `1280px` public-page maxima
  are prohibited.
- Readable prose may be narrower inside the boundary without changing the page
  alignment contract.

# Header and Footer

- Both regions span the viewport and align their internal content to the wide
  boundary.
- Header background and foreground use the light `surface` and `foreground`
  roles. Mobile navigation preserves the same surface.
- The current logo asset is displayed at `50px` height with automatic width and
  preserved intrinsic aspect ratio. It must never be stretched into a fixed
  width/height box. A readable text identity is the failure fallback.
- Navigation remains non-transactional and contains no cart or checkout entry.
- Footer uses a flat light surface, restrained divider and wrapping links.

# Promotional carousel

- Carousel media/background spans the full viewport width. Slide copy, actions,
  indicators and previous/next controls align to the wide content boundary.
- Heights are `200px` below 640px, `250px` from 640px, `300px` from 768px,
  `350px` from 1024px and `400px` from 1280px.
- Slide changes use opacity fade only. Horizontal translation, track movement,
  parallax and other directional motion are prohibited.
- Zero slides omit the region; one slide is static; multiple slides may
  autoplay every six seconds and must pause while hovered or focused.
- Reduced-motion preference disables autoplay and non-essential transitions.
- Inactive slides are excluded from interaction and the accessibility tree;
  their actions are not keyboard focusable.
- Required meaning remains HTML. Decorative slide media uses empty alternative
  text and may be cropped with `object-cover` only when focal-safe.

# Homepage category rail

- Homepage Categories are compact circular discovery links, not cards.
- Each category image is `100px` by `100px`, circular and cropped with
  `object-cover`; its name is centered below it.
- Description and product count are absent from each category item.
- Items remain in one row with an exact `30px` gap. The row does not wrap into a
  grid.
- Responsive visibility preserves business/source order. When every category
  cannot fit, the last visible destination is `Ver todas`, linked to
  `/categorias`; hidden items are not reordered or cloned.
- From the `1280px` breakpoint, the section title/description block and the
  category rail share one row with vertical centering and `space-between`.
  The description remains on one line when space permits.
- The general Category page may use richer cards; it is not governed by the
  Homepage circular-link presentation.

# Product cards and featured collection

- Product Card outer radius is `8px`; the card clips its media and uses no
  promotional lift.
- Product media is edge-to-edge across the card width with no image padding.
  Text content retains shared internal padding.
- Cards show product identity, taxonomy/offer information and the detail
  affordance. Product descriptions are omitted to keep collection height
  compact.
- The Homepage Featured section renders one responsive row: 2 items below
  640px, 3 from 640px, 4 from 1024px and 6 from 1400px. Remaining eligible
  products are reached through `Ver más destacados` at `/destacados`.
- `/destacados` is the expanded public featured collection and uses the wide
  boundary and the shared collection grid.
- Responsive presentation must not reorder cards or produce different SSR
  business eligibility. Any client-side visual subset starts from the canonical
  ordered server result.

# Payment information banner

- The Homepage displays one static banner for Binance, Pago Móvil en Venezuela
  and dólares en efectivo. It is information, not payment initiation.
- Its title and friendly explanation are visible HTML overlaid inside the
  banner, never separate text above or below it and never required text baked
  only into pixels.
- The banner uses an `8px` radius and heights `160px` by default, `220px` from
  640px, `300px` from 1024px and `350px` from 1280px.
- The image is decorative when the visible HTML fully conveys the accepted
  methods, and therefore uses empty alternative text.
- No amount, selector, fee, payment status, checkout control or payment CTA is
  allowed in this region.

# Contact region

- Contact is a responsive content/media composition aligned to the wide
  boundary: stacked on narrow screens and two columns from the desktop range.
- Copy explains personalized assistance and the primary action is
  `Hablar por WhatsApp`.
- The supporting WhatsApp image may use empty alternative text when the visible
  heading, description and action already convey its meaning.
- Contact language never promises purchase, availability, response or payment
  completion.

# Product Detail inquiry

- Product Detail uses the wide public content boundary.
- The inquiry region heading is `¿Te interesa este producto?` and its primary
  action is `Preguntar por este producto`.
- The server builds the WhatsApp destination from server-only
  `WHATSAPP_BUSINESS_NUMBER` and the canonical URL derived from
  `PUBLIC_SITE_ORIGIN`.
- Exact prefilled message:
  `Hola, estoy interesado en este producto: “{Product name}”. {canonical Product URL}`.
- Invalid or missing governed origin/recipient fails closed: the affected action
  is omitted and arbitrary Host, referrer or browser URL data is never used.
- The inquiry remains an external continuation, not a lead, cart, checkout or
  guarantee of message delivery.

# Accessibility and media

- Decorative imagery uses `alt=""`; content imagery uses concise alternative
  text that communicates the image's purpose without duplicating adjacent text.
- Focus order follows DOM and business order at every viewport. Responsive CSS
  must not create a competing visual order.
- At 320 CSS pixels and 200% zoom, content reflows without page-level horizontal
  overflow or loss of actions.
- Meaning, state and destination are never communicated by color, position,
  motion or imagery alone.
- Loading/failure outcomes reserve stable geometry and retain readable paths.

# Required validation for future artifacts

Every future public-catalog change must verify and record:

- light-only rendering without system-theme variance;
- 320, 640, 768, 1024, 1280 and 1400 CSS-pixel behavior where affected;
- 200% zoom/reflow, keyboard order, visible focus and 44px targets;
- reduced-motion behavior for any animation or autoplay;
- semantic image alternatives and non-transactional language;
- alignment with the wide boundary and absence of horizontal overflow; and
- an explicit supersession note when changing any rule in this contract.
