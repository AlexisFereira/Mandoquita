# Discovery and Trust Experience V1 — UI Design

Status: Complete — Released

Owner: UX/UI Designer

Date: 2026-07-13

## Scope and dependency status

This artifact owns DTE-012 and its UI deliverables without redefining Product,
Search, Payment Information, Icon, or Scroll-entry Motion behavior.

| Deliverable | Status | Dependency evidence |
| --- | --- | --- |
| DTE-007D Scoped Icon inventory | Complete | DTE-007B contract exists in `platform/design-system/icon-system/design.md`. |
| DTE-012A Responsive Search form and results | Complete | Consumes approved DTE-010A–C and Icon contract. |
| DTE-012B Search accessibility and interaction states | Complete | State, focus, status, keyboard, target and reflow rules are defined below. |
| DTE-012C Responsive Payment Information block | Complete | Consumes approved DTE-011A–B, payment content and Icon contract. |
| DTE-012D Informational/non-transactional states | Complete | Static, unavailable-content and contact-failure outcomes are defined below. |
| DTE-012E Approved animated-section inventory | Complete | Consumes Accessibility-approved DTE-008 and Architecture-approved DTE-009. |

## DTE-007D — Scoped Icon inventory

Icons support existing visible labels and never replace required text. Unless an
icon supplies unique approved information, it is decorative and hidden from the
accessibility tree. Interactive controls retain their existing accessible name,
focus treatment, keyboard behavior, and minimum 44 by 44 CSS-pixel target.

| Experience | UI context | Semantic Icon name | Mode | Authoritative text or accessible name |
| --- | --- | --- | --- | --- |
| Search | Search field leading cue | `search` | Decorative | Visible field label owns meaning. |
| Search | Submit Search control | `search` | Decorative | Visible `Buscar` label owns the control name. |
| Search | Clear populated query | `close` | Decorative | Parent control uses `Limpiar búsqueda`. |
| Navigation | Open mobile navigation | `menu` | Decorative | Parent control uses `Abrir navegación`. |
| Navigation | Close mobile navigation | `close` | Decorative | Parent control uses `Cerrar navegación`. |
| Navigation | Back/recovery links | `back` | Decorative | Visible `Volver…` copy remains present. |
| Carousel | Previous slide/image | `previous` | Decorative | Parent control retains its contextual previous label. |
| Carousel | Next slide/image | `next` | Decorative | Parent control retains its contextual next label. |
| External continuation | Contact Mandoquita | `contact` | Decorative | Visible WhatsApp/contact copy owns meaning. |
| External continuation | Opens a new browsing context | `external-link` | Decorative | Existing visible contact label and link behavior remain authoritative. Use only when the new-context cue is useful; do not pair it with `contact` in compact controls. |
| Payment Information | Section-level supporting cue | `payment-information` | Decorative | Visible `Medios de pago` heading owns meaning. One icon maximum for the block. |
| Payment Information | Clarification that arrangements require confirmation | `information` | Decorative | Approved supporting sentence remains complete without the icon. |
| Feedback | Informational message | `information` | Decorative | Visible message text and existing status semantics own meaning. |
| Feedback | Successful outcome | `success` | Decorative | Visible success text owns meaning. |
| Feedback | Caution or recoverable warning | `warning` | Decorative | Visible warning text owns meaning. |
| Feedback | Error or unavailable outcome | `error` | Decorative | Visible error heading/message owns meaning. |
| Product media | Missing image state | `image-unavailable` | Decorative | Visible `Sin imagen` or equivalent remains present. |
| Product metadata | Tags/labels group | `tag` | Decorative | Visible tag values remain present. |
| Location metadata | Approved business location, if later displayed | `location` | Decorative | Visible location text is required. No current V1 placement. |

### Explicit exclusions

- No Binance logo, payment-provider mark, improvised currency icon, or per-method
  icon is approved.
- Do not add icons to every Header/Footer navigation item, Category, Product card,
  payment method, or metadata row; this would compete with Product discovery.
- Do not expose arbitrary Lucide names or SVG data through Feature components.
- Do not use an icon as the only visible or accessible meaning.
- Do not replace current labels such as `Menú`, `Cerrar`, `Anterior`, `Siguiente`,
  `Buscar`, `Volver`, or `Consultar por WhatsApp` during migration.
- A loading spinner remains a progress treatment rather than a semantic Icon
  registry entry and requires an accompanying accessible loading state.

## Responsive and composition rules for Icons

- Use `sm` (16px) for inline metadata and compact supporting text.
- Use `md` (20px) for labelled controls and section-level supporting cues.
- Reserve `lg` (24px) for sparse empty/error-state composition; never enlarge an
  icon to create the control target.
- Icon and label use 8px default separation; 4px is allowed only for compact
  metadata that already meets reflow and readability requirements.
- At 200% zoom and 320 CSS-pixel width, preserve the text label and allow wrapping;
  the icon does not force truncation or horizontal scrolling.
- Inverse-surface contexts inherit the approved inverse foreground role. All other
  contexts inherit semantic foreground, muted, primary, or status roles.

## DTE-012A — Responsive Search form and results

### Entry and destination

- Global navigation exposes a visible `Buscar` destination with a decorative
  `search` Icon. Desktop retains the text label; mobile places the same labelled
  destination in the expanded navigation. It is not an icon-only control.
- Search uses one stable page destination rather than a modal, drawer, command
  palette, or expanding Header field. This preserves browser back, query context,
  pagination, SSR outcomes, zoom and small-screen predictability.
- Activating the explicit Search destination may place focus in the query field
  as the predictable result of that action. Ordinary page restoration and result
  updates do not repeatedly steal focus.
- Category and Product discovery may provide a secondary `Buscar productos` link
  near their collection heading. Search does not replace Category/Subcategory
  navigation.

### Results-page hierarchy

The visual and DOM order is:

1. Header and skip-to-content contract.
2. Eyebrow `Catálogo Mandoquita`.
3. H1 `Buscar productos` and concise supporting description.
4. Native Search form.
5. Validation, loading or request feedback associated with the form/results.
6. H2 result context and count/range when a query succeeded.
7. Shared Product-card collection.
8. Pagination for collections with more than one page.
9. General Product and Category recovery links.
10. Footer.

The main container uses the shared 1280px maximum. The page uses 32px vertical
separation on mobile, 48px on tablet and 64px on desktop. Heading and instruction
copy remain within approximately 60–75 characters per line.

### Search form

- Use a native `<form role="search">` with a persistent visible label
  `Buscar productos`.
- Field height is 48px. Its decorative `search` Icon is 20px and inherits muted
  foreground. Query text is never truncated by the Icon or clear control.
- Supporting instruction: `Busca por nombre, descripción, marca, colección o
  etiquetas.` This describes only approved public Search fields.
- Submit label is `Buscar`; the action remains text-visible at every viewport.
- The clear control appears only for a non-empty editable field, has a 44 by 44px
  target, a decorative `close` Icon, and accessible name `Limpiar búsqueda`.
  Clearing does not submit.
- The form maximum width is 800px. At 640px and above, the field group and submit
  action form an align-end row with 16px gap; the field uses `min-width: 0` and
  the action has a stable minimum width. Below 640px they stack with 12px gap and
  the submit action spans the available width.
- Long safe queries remain horizontally editable inside the native Search input;
  they never widen the page. Result headings containing the query wrap with
  `overflow-wrap: anywhere` as a last resort.

### Product collection and pagination

- Results reuse the shared `ProductCard` and canonical Product presentation; no
  Search-specific ranking badge, matched-field highlight or promotional styling
  is added.
- Preserve backend order across viewports. The grid is one column below 640px,
  two columns from 640px, and four columns from 1280px, using the existing 24px
  gap. Do not visually reorder cards.
- Result context uses `Resultados para “{query}”`. Count copy uses correct singular
  or plural; paginated outcomes may use `Mostrando {start}–{end} de {total}`.
- Pagination is a labelled navigation region adjacent to the collection. Previous
  and next controls keep visible text, 44px targets and the current query. Current
  page is exposed as text/`aria-current`, not color alone. Unavailable directions
  are omitted or semantically disabled; they are never the only page indicator.
- V1 has no infinite scroll, result-density switch, sort control, suggestions,
  facets or Variant Attribute filters.

### Responsive composition

| Viewport | Composition |
| --- | --- |
| Mobile `<640px` | 16px minimum page gutter; one top-to-bottom column; stacked field/action; one Product card per row; pagination and recovery wrap vertically. |
| Tablet `640–1023px` | 24–32px gutter; inline form; two Product cards per row; result context and count may share a row only when both remain untruncated. |
| Desktop `1024–1279px` | 48px minimum gutter within the shared Container; inline form; existing two-column Product grid; pagination directly below collection. |
| Large desktop `≥1280px` | Shared 1280px maximum; four Product cards per row; Search form remains capped at 800px rather than stretching. |

## DTE-012B — Search states and accessibility

| State | Visible presentation | Interaction and accessibility |
| --- | --- | --- |
| Initial/no submitted query | Page purpose, instruction, empty labelled field, `Buscar`, and general discovery recovery. No count or Product placeholders. | Field may receive focus only from explicit Search entry. No request runs. |
| Editing | Current text and clear control. Previous submitted outcome is not relabelled as belonging to the edited query. | Escape may clear when populated; Enter performs native form submission. |
| Whitespace-only submit | Field error: `Escribe un término para buscar productos.` | Do not request results. Set `aria-invalid`, associate the error with the field, and preserve/focus the field for correction. |
| Contract-invalid query | Specific safe correction when known; otherwise `Revisa la búsqueda e inténtalo de nuevo.` | Preserve the safe entered value. Do not expose limits or validation internals unless the public contract authorizes that guidance. |
| Loading | Visible `Buscando productos…` status and neutral media/text skeleton geometry. No fabricated names or links. | Keep page purpose, form and submitted query visible. Mark results region `aria-busy="true"`; announce loading politely once; prevent duplicate submit while the request is active. Stale Products are not presented as new-query results. |
| Results | Query heading, count/range, Product collection and pagination as applicable. | A polite result-context update is sufficient; no success toast and no forced focus movement. |
| No results | `No encontramos productos para “{query}”.` followed by refinement form and general Product/Category recovery. | Treat as a successful empty collection, not an error. No fabricated corrections or Products. |
| Request failure | `No pudimos cargar los resultados. Inténtalo de nuevo.` with `Reintentar` and general discovery recovery. | Preserve query; announce non-interruptively; do not report zero results or expose technical details. |
| Cleared query | Empty field; no automatic request and no no-result message. | Focus remains in the query field. |

The Search field, clear and submit controls follow DOM order. Product links follow
feedback, then pagination and recovery. Visible focus uses the semantic focus role
and is not clipped. All controls meet WCAG 2.2 AA contrast, 44px target and 320px/
200% reflow requirements. Search Icons are decorative because field/button text
owns meaning. Result and loading updates use the shared polite-status pattern;
field validation remains directly associated through `aria-describedby`.

## DTE-012C — Responsive Payment Information block

### Placement and visual hierarchy

- Render one `Medios de pago` section after the last available Product/Category
  discovery section and immediately before the existing Contact section.
- Use a standard semantic Section and one shared Container. Inside it, use one
  calm `surface-muted` trust region with large radius, no elevation and a subtle
  semantic border only when required for separation. It must not resemble a
  checkout panel, payment form or floating purchase prompt.
- The DOM/reading order is the exact approved order: H2 `Medios de pago`, complete
  supporting sentence, method list, then optional contact continuation.
- A single 20px decorative `payment-information` Icon may accompany the H2. No
  Icon appears beside individual methods.
- Supporting copy is exactly: `Aceptamos Binance, pago móvil y dólares en
  efectivo. Confirma los detalles del pago directamente con Mandoquita.`
- Methods use one semantic unordered list in this exact order: `Binance`, `Pago
  móvil`, `Dólares en efectivo`.
- List items use medium-weight text on the shared surface with 16px internal
  spacing and subtle dividers or tonal separation. They have no hover, focus,
  cursor, pressed, selected, checked, enabled or disabled treatment.
- The optional `Consultar por WhatsApp` continuation uses the shared labelled
  Button/link pattern and a decorative `contact` Icon when space permits. It does
  not use payment language such as pagar, comprar, reservar or finalizar.

### Responsive composition

| Viewport | Composition |
| --- | --- |
| Mobile `<640px` | 16px page gutter; trust-region padding 24px; heading, copy, one-column method list and full-width contact action; 16px list gaps and 24px major gaps. |
| Tablet `640–1023px` | 24–32px gutter; padding 32px; three list columns when labels fit without truncation, otherwise a two-plus-one wrapping grid that preserves DOM order; contact action wraps below. |
| Desktop `≥1024px` | 48px gutter within 1280px Container; padding 40px; heading/copy remain readable rather than full-width; three equal method columns; contact continuation follows the list with 24px separation. |

At 320px and 200% zoom, the section becomes a single column. The complete
supporting sentence, `Dólares en efectivo` and WhatsApp label wrap normally; no
horizontal carousel, logo strip, clipped label or ellipsis is allowed.

## DTE-012D — Payment Information states and boundaries

| State | Required UI outcome |
| --- | --- |
| Approved content available | Render the complete block, exact three-method order and optional approved continuation. |
| Contact continuation unavailable | Preserve all informational content and omit the broken action. Show unavailability guidance only when approved contact copy exists; never invent another route. |
| Payment content unavailable/withdrawn | Omit the section as one unit. Do not show a partial/stale list, placeholder or generic payment claim. |
| External contact cannot open | Preserve Homepage and payment information. Present a non-transactional contact error and allow continued Product/Category exploration; never say a payment failed. |

Methods are never controls and receive no keyboard focus. The block contains no
amount, currency conversion, fee, balance, financing, installment, security,
refund, receipt or status claim. It is not associated with a Product, Variant,
offer or visitor location. No Binance/provider logo is permitted. The Contact
section remains a separate semantic region with its broader assistance purpose.

## DTE-012E — Approved motion inventory

The following is the complete V1 opt-in inventory. A surface not listed here is
not authorized to adopt Scroll-entry Motion without a new UX/UI review.

| Surface | Approved wrapper | Configuration | Boundary |
| --- | --- | --- | --- |
| Homepage | Complete `#destacados` Featured Products Section | `distance="sm"`, `delayStep={0}` | One observed section wrapper. Never animate individual Product cards. If initially visible, render immediately in final state. |
| Homepage | Complete `#categorias` Categories Section | `distance="sm"`, `delayStep={0}` | One observed section wrapper. Never animate individual Category cards. If initially visible, render immediately in final state. |
| Product Detail | `Productos relacionados` Section when present | `distance="sm"`, `delayStep={0}` | One observed section wrapper below primary Product information. Never animate individual related Product cards. |

### Explicitly ineligible surfaces

- Header, desktop/mobile navigation, Footer navigation and skip links.
- Initial Hero content, Hero actions, Carousel slides, indicators and controls.
- Page H1, breadcrumbs and primary Category/Subcategory discovery collections.
- Search entry, form, query context, loading, validation, errors, result updates,
  Product-result collection, pagination and recovery actions.
- Product Gallery, Product identity, Variant options, offer, price, Commercial
  Availability, description and required Product metadata.
- Payment Information heading, approved payment meaning, method list and
  `Consultar por WhatsApp` continuation.
- Contact section, external-contact actions, status/live regions, empty,
  unavailable or error outcomes, and any focused/programmatically targeted group.

### Motion composition and validation handoff

- Use one wrapper per approved Section and no child stagger. The three listed
  surfaces keep the observed-element count far below the 50-element Platform
  maximum.
- SSR/default CSS remains fully visible. Preparation occurs only after JavaScript
  confirms an eligible wrapper is below the initial viewport.
- Approved values remain Platform-owned: opacity plus optional 8px vertical
  translation, 220ms shared ease-out, once per component/page-view lifetime.
- `prefers-reduced-motion: reduce`, unsupported observation, observation failure,
  current focus or programmatic targeting resolve immediately to final state.
- Motion adds no landmark or heading semantics, does not wrap or duplicate the
  existing Section landmark unnecessarily, and causes no layout shift, pointer
  blocking, tab-order change, announcement or horizontal overflow.
- Frontend may remove the opt-in wrapper as rollback without changing content,
  DOM order, destinations or Feature behavior.

## UI handoff outcome

DTE-007D and DTE-012A–E are complete. Search, Icon adoption, Payment Information
and the approved motion scope are ready for their Frontend workstreams. This
artifact introduces no Backend behavior and does not authorize additional motion,
payment capability, Search fields, Product state or taxonomy behavior.
