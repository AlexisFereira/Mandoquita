# Product Detail Contact and Sharing V1 — UI Design

Status: Feature UX/UI Complete — Independent Accessibility Review Pending

Owner: UX/UI Designer

Date: 2026-07-14

## Dependency and task status

This artifact maps the approved Requirements, Architecture, UX Solution and
Design System contracts into responsive Product Detail composition. It does not
change Product, Variant, Image, canonical URL, WhatsApp configuration, sharing
payload or public eligibility ownership.

| Deliverable | UX/UI status | Dependency |
| --- | --- | --- |
| PDS-008 Responsive gallery/action relationship | Complete | Approved PDS-001–PDS-007 contracts. |
| PDS-009 UX/UI accessibility self-review | Complete | Independent Accessibility Review remains pending. |
| PDS-022 UX/UI documentation portion | Synchronized | Full completion waits for Frontend, Accessibility and QA evidence. |

## Product Detail hierarchy

Use one stable DOM order at every viewport:

1. Existing Product Detail orientation/breadcrumb.
2. Product media region with complete released gallery.
3. Product understanding: name, released descriptive/offer context and Variants.
4. Continuation action group.
5. Share/copy status and manual-link recovery when present.
6. Existing supplementary Product content.

At desktop, media and Product understanding are peer visual columns, but media
remains first in DOM/reading order. Contact/Share stays within the Product
understanding column after identity, current offer context and Variant choices.
It is never overlaid on media, inserted before Variants or styled as cart/
checkout completion.

The page uses the released Product Detail Container and light-only spacing/
typography. It does not introduce a wider page contract. Main content uses 16px
gutters below 640px, released 24–32px tablet gutters and the existing desktop
maximum. Vertical section rhythm is 32px below 640px, 40px at 640–1023px and
48px from 1024px.

## Complete Product gallery — PDS-008

### Composition

Consume the released `Carousel mode="gallery"` with the complete server-provided
ordered Image collection and stable Image keys. The media region contains:

1. Accessible region heading/label `Imágenes de {Product name}`.
2. Stable main-media frame using the released Product gallery aspect ratio.
3. Current Image alternative text/fallback identity.
4. Previous/next and position status from the released gallery contract.
5. Complete ordered thumbnail/position controls when more than one Image exists.

Do not create a second image array, hide Images by viewport, limit a large valid
gallery or duplicate gallery DOM. Thumbnail controls may use a contained
horizontal scroller when the released gallery requires it; the page itself never
scrolls horizontally. First/last behavior, 44px targets, focus, selected state
and image fallback remain released Carousel responsibilities.

### Initial and linked selection

- When a Primary Image exists, it is the initial current Image.
- Otherwise the first ordered Image is current.
- With no Images, render the released missing-media outcome without an empty
  Carousel, thumbnails or fabricated image.
- A resolved Variant with a valid owned `imageId` may change the current gallery
  Image while leaving all Images available.
- A Variant without a valid associated Image preserves the current released
  gallery state.
- Manual gallery navigation changes only the visible Image. It never selects,
  deselects or implies a different Variant.

Variant-driven selection uses the same current-state indicator as manual
selection and may announce the newly displayed Image through the released
controlled gallery status. Copy must not say that the Image itself changed the
Variant. Missing/failed media retains its Image position/control so other Images
remain reachable.

### Gallery measurements

- Mobile: main frame uses full available width; controls wrap or remain in their
  released contained scroller. Gallery precedes all Product content.
- Tablet: gallery remains full-width above Product understanding to protect media
  and Variant/action readability.
- Desktop from 1024px: use a two-column grid with `minmax(0, 1.1fr)` media and
  `minmax(320px, 0.9fr)` Product understanding, 40–48px gap. Main media is capped
  by the available media column, never stretched beyond released quality rules.
- Large galleries retain complete access through the released thumbnail
  navigation; page height or width does not silently truncate membership.

Gallery loading reserves its frame. Gallery absence/failure never disables safe
Contact or Share when Product identity and canonical data remain valid.

## Continuation action group — PDS-008

### Placement and visual hierarchy

The group follows Product identity, descriptive/current offer context and
Variant controls, separated by 24px. It uses a labelled region with an optional
visually modest heading `¿Quieres más información?` only when needed by the
existing Product Detail heading structure. Do not create a second primary page
heading.

Order:

1. Primary `Contactar por WhatsApp`, only when a safe server destination exists.
2. External-context guidance, only with WhatsApp:
   `WhatsApp se abrirá para que puedas enviar tu consulta.`
3. Secondary `Compartir producto`.
4. One local status/recovery region.

WhatsApp is a primary external anchor with visible label. The released contact
and external-link Icons may supplement it with `aria-hidden="true"`; neither
Icon is the accessible name. Share is a native Button with secondary styling and
a full visible label. Do not add a new Share Icon.

Every action is at least 44px high. Desktop uses a vertical group so the primary
and secondary hierarchy remains unambiguous; both actions may use full column
width up to a 440px action maximum. Tablet may use two equal columns only when
each label remains intact. Below 640px, or whenever text/zoom would compress,
actions stack full-width with WhatsApp first and 12px gap.

The group contains no price, currency, SKU, selected Variant, stock, inventory,
availability promise, recipient number, prepared-message editor or purchase
language. It does not use `Comprar`, `Reservar`, `Pedido`, `Disponible` or
checkout styling.

### WhatsApp outcomes

| Outcome | UI behavior |
| --- | --- |
| Safe destination | Show primary action and external-context guidance. Open in approved safe external context. |
| Missing/invalid configuration | Omit action and its guidance completely. Share and Product content remain. |
| Activation | Preserve current Product/Variant/gallery state in the original page. Do not announce message delivery. |
| Browser open failure | Polite status `No pudimos abrir WhatsApp. Inténtalo nuevamente.` Keep explicit action available for retry. |

The UI consumes the approved server-built destination; it never displays,
rebuilds, edits, logs or offers to copy the complete WhatsApp URL/message. New
context behavior uses approved external-link safety and does not transfer opener
or referrer information.

## Share and copy journey — PDS-008

### Default Share action

`Compartir producto` is one explicit native Button. Activation uses the exact
server-provided canonical Product URL with the approved title/text. It never
uses the address bar, incoming alias, query, fragment, referrer or Admin URL.

While the browser operation is pending, mark only the Share control busy and
prevent duplicate Share activation. Gallery, Product reading, Variant controls
and safe Contact remain usable. No spinner-only communication is used; a concise
pending label such as `Abriendo opciones…` may replace the Button text while
preserving its accessible purpose.

Native cancellation restores/retains focus on `Compartir producto` and produces
no status, error, fallback, retry or success. A native success resolution also
does not claim that another person received/opened the Product.

### Native unavailable or failed

Reveal one inline recovery region immediately after the action group. It has:

1. Heading `Compartir enlace`.
2. Explanation `Puedes copiar o abrir el enlace canónico del producto.`
3. Recovery Button `Copiar enlace`.
4. Visible selectable canonical link named
   `Enlace canónico de {Product name}`.
5. Shared polite status region.

Unsupported native Share may reveal this region without an error announcement.
A non-cancel failure first announces `No pudimos abrir las opciones para
compartir.` then reveals the same region. It never automatically invokes
Clipboard or opens a blocking dialog.

The recovery surface uses the released neutral/muted surface, border and medium
radius with 16px padding below 640px and 20–24px from 640px. It is
`min(100%, 640px)`. The URL is a normal anchor, not an Input, disabled Button,
Chip or code-only control. Display the full canonical URL and allow safe wrapping
with `overflow-wrap: anywhere`; do not truncate the meaningful destination.

### Copy outcomes

| Outcome | Visible/status behavior | Focus |
| --- | --- | --- |
| Pending | Prevent duplicate copy; no optimistic success. | Remains on `Copiar enlace`. |
| Confirmed | Polite `Enlace copiado`. Manual link remains visible. | Remains on Button. |
| Denied/unavailable | Polite `No pudimos copiar el enlace. Selecciónalo para copiarlo manualmente.` | Remains on Button; recovery link follows in normal Tab order. |
| Missing canonical URL | Omit Contact/Share or show neutral unavailability once. | Product/gallery remain fully usable. |

Only the canonical URL is copied. The UI never auto-selects/copies repeatedly,
opens permission prompts without explicit action or claims `Producto compartido`.

## Status and concurrent interaction

Use one persistent `PoliteStatus` for the currently meaningful contact/share/
copy outcome. Do not use toast, dialog, Badge or danger alert for these local
recoverable states. Status is visible text and programmatic; it does not move
focus.

- Starting a new relevant action clears/replaces stale conflicting status.
- Repeated values are not re-announced without a meaningful new outcome.
- Native Share cancellation writes nothing.
- WhatsApp activation writes no success.
- Route change/unmount clears local status and recovery; nothing persists as
  Product, visitor, analytics or lead state.
- Pending state disables only duplicate activation of the same capability.

When canonical configuration is unsafe, omit both external actions and their
orphan guidance. A single neutral message may say `Las opciones para contactar y
compartir no están disponibles en este momento.` It contains no origin,
configuration, recipient or API detail.

## Responsive composition

### Mobile below 640px

- One column: gallery, Product understanding/Variants, actions, recovery,
  supplementary content.
- Gallery and actions use full available width.
- WhatsApp and Share stack with complete labels and 12px gap.
- Manual canonical URL wraps within the page; no horizontal scrolling.
- Long Product names and status text wrap without overlapping media/controls.

### Tablet 640–1023px

- Preserve gallery above Product understanding.
- Action group may use two columns only while each target remains at least 44px
  and labels/guidance retain readable width; otherwise stack.
- Recovery remains below both actions and never beside Variant controls.

### Desktop from 1024px

- Gallery and Product understanding use peer columns while retaining media-first
  DOM order.
- Action group remains in Product column after Variants, normally vertical and
  no wider than 440px.
- Recovery expands only within the Product column and never overlays gallery.

At 320 CSS pixels and 200% zoom, the page maintains a single flow, controls stay
at least 44px, gallery navigation remains reachable and no page-level horizontal
overflow occurs. The layout does not duplicate/reorder DOM at breakpoints.

## State and omission matrix

| State | Required composition |
| --- | --- |
| Complete gallery | Every Image once; Primary/first current; controls and alt text released. |
| No Images | Released missing-media outcome; no empty Carousel. Actions remain based on safe canonical/contact data. |
| Image failure | Per-Image fallback; other gallery positions remain reachable. |
| Variant Image resolution | Current Image may change; all Images remain; Variant state stays authoritative. |
| WhatsApp missing | WhatsApp action/guidance omitted; Share retained. |
| Share unsupported | Inline copy/manual recovery; no error. |
| Share cancelled | No visible/programmatic change; focus safe. |
| Share failed | Polite failure plus inline copy/manual recovery. |
| Clipboard failed | Polite manual-copy instruction plus canonical link. |
| Canonical unsafe | Contact/Share fail closed; Product, Variants and gallery remain. |

## Accessibility self-review — PDS-009

- Gallery region names the Product context, exposes complete ordered controls,
  meaningful alt/fallback and current position. Selected state is not color-only.
- Media remains first in DOM at every breakpoint. CSS columns never change
  reading or focus order.
- Variant-driven Image changes use controlled gallery feedback without implying
  that manual Image navigation mutates Variant state.
- Contact, Share and Copy have persistent visible labels and distinguishable
  accessible names. Decorative Icons are hidden from assistive technology.
- External WhatsApp behavior is explained before activation. New context safety
  preserves the original page and never claims delivery.
- Native Share is invoked only from explicit activation. Cancellation creates no
  live announcement and focus stays/returns to Share.
- The manual canonical link is readable, selectable, keyboard accessible and
  named with Product context. Long URLs wrap without page overflow.
- Copy/share failures and confirmed copy use one polite live region. Repeated or
  contradictory outcomes do not create announcement noise.
- All actions/gallery controls retain 44 by 44px targets, visible focus and
  released light-only contrast/status roles.
- At 320px, 200% zoom and supported text spacing, gallery, Product name,
  Variants, actions, statuses and manual link remain readable and operable with
  no page-level horizontal scrolling.
- No interaction depends on hover, color, motion, fine pointer or icon alone.
  Reduced motion retains all gallery/actions without nonessential animation.
- External payload values, recipient/configuration, visitor/session/referrer,
  hidden commercial and Admin information never appear in the interface.

The UX/UI self-review is complete with no design blocker. PDS-009 remains open
until Accessibility Review independently validates this specification and
records the joint decision.

## Frontend and documentation handoff

Frontend may implement PDS-012–PDS-016 from this artifact after joint PDS-009
approval. It must reuse the released Gallery, Button, Icon and PoliteStatus
contracts and the Backend canonical/contact projection; it must not create a
second media model, infer URLs, load a third-party SDK, persist lead/share state
or add transaction language.

The UX/UI portion of PDS-022 is synchronized by this artifact. PDS-022 cannot be
closed until Frontend, Accessibility, QA and canonical project documentation
record their evidence. PDS-023 remains a Project Architect release decision
after PDS-008–PDS-022 are objectively complete.
