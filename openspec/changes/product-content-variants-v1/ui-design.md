# Product Content and Variants V1 — UI Design

Version: 1.0

Status: Approved and Released

Owner: Senior UI/UX Designer

Approved inputs:

- `requirements.md`
- `product-decisions.md`
- `architecture-review.md`
- `ux-blueprint.md`
- `openspec/platform/design-system/product-gallery-variant-controls/`
- Platform Accessibility and deterministic light-only Design System

## UX Analysis

The Product Detail page must help visitors inspect a Product and understand its
meaningful options without resembling a purchase configurator. Product identity,
taxonomy and Product-level commercial information remain stable. A Variant is
subordinate inspection context and selection is always optional.

The main UI risks are confusing Variant Active state with stock, using imagery or
color as the only distinction, overwhelming mobile visitors with thumbnails and
option groups, and allowing optional metadata to compete with Product identity.
The approved presentation avoids those risks through progressive hierarchy,
explicit text labels, controlled gallery behavior and non-transactional writing.

## Information Hierarchy

The visual priority is:

1. Product identity and official taxonomy context.
2. Main Product Image or stable missing-media presentation.
3. Product name and short description.
4. Eligible Product-level commercial information.
5. Meaningful Variant choices, only when required.
6. Selected Variant attributes and gallery association feedback.
7. Complete description and merchandising metadata.
8. Related Product discovery and recovery navigation.

SKU, barcode, reference, internal Base Variant terminology and SEO content are not
visitor-facing in V1.

## Layout Proposal

### Product with multiple meaningful Variants

1. Shared Header and skip-navigation contract.
2. Breadcrumb with Category, Subcategory, Product Type and Product orientation.
3. Primary Product region.
   - Product gallery.
   - Product identity, short description and Product-level commercial information.
   - Variant option groups.
   - Selected Variant context.
4. Complete Product description.
5. Optional merchandising metadata.
6. Related Products.
7. Shared Footer.

On desktop, gallery and Product information share a two-column primary region.
They remain parts of one reading sequence rather than separate floating cards.

### Product with one Base Variant

Use the same Product Detail composition without the option region or selected-
Variant panel. Do not display “Variante base”, an empty option group, a single
selected Chip or any internal reference merely to prove the Variant exists.

### One meaningful Active Variant

Do not render a selector. Approved meaningful attributes may appear as read-only
Product information under `Características`, provided they do not expose internal
identity or imply inventory.

### Multiple indistinguishable Active Variants

Omit the selector. Keep Product content and gallery useful. Present no duplicate
options, SKU choices or arbitrary default. A catalog-content correction remains an
internal concern and does not become a visitor error banner.

### Product without Images

Preserve the gallery footprint with the approved non-interactive media fallback.
Render no previous, next, thumbnail or position controls. Product identity,
options, descriptions and discovery paths remain fully available.

## Components

| UI need | Approved contract | Feature responsibility |
| --- | --- | --- |
| Ordered media gallery | `Carousel mode="gallery"` | Supply ordered stable Image identities, Primary/first initial item and Variant-associated active item. |
| Direct Image controls | Gallery thumbnails/direct controls | Supply distinguishable accessible names and approved alt text. |
| Option value | `Chip mode="option"` | Supply official attribute value, controlled selected state and valid-combination outcome. |
| Option group | Native `fieldset` and `legend` or equivalent radiogroup composition | Supply official label: Talla, Color, Material, Capacidad or Presentación. |
| Selection/media feedback | Shared polite status composition | Supply concise Product/Variant-specific message without moving focus. |
| Media fallback | Shared media state inside gallery frame | Supply missing or failed outcome; never fabricate alt text. |
| Product price | Existing `ProductOffer` | Preserve Product-level Commercial Availability rules. |
| Metadata | Existing section, text, `Badge` or non-interactive `Chip` only where semantically appropriate | Keep metadata optional, read-only and subordinate to taxonomy. |
| Related discovery | Existing `ProductCard` grid | Preserve current eligibility and detail destinations. |

No feature-specific shared component is approved. Product Variant resolution stays
outside Carousel and Chip.

## Gallery Presentation

### Main media

- Use a stable `1:1` frame for the current catalog unless approved media guidance
  for a Product category requires `4:5`.
- Use the existing large radius, surface, border and fallback tokens.
- Use `object-fit: contain` when cropping could remove Product meaning; use cover
  only for media approved for that crop behavior.
- The current Image occupies the strongest visual area in the primary region.
- Gallery mode never autoplays and never advances on a timer.

### Direct controls

- One Image: render the main media without direct controls or position UI.
- Two or more Images: render ordered direct controls and `Imagen n de total`.
- Thumbnail controls are square, at least `44px × 44px`, and use a visible selected
  indicator plus programmatic current state.
- Selected and focus-visible styles remain visually distinct.
- Thumbnails retain source order at every breakpoint.
- A thumbnail's accessible name identifies the Image or its position even when
  the thumbnail pixels are not self-describing.

### Variant-associated Image

Selecting a resolved Variant may request its associated gallery item. The main
media and current-position text update; keyboard focus stays on the initiating
option. The gallery never selects or clears a Variant in response to manual media
browsing.

## Variant Option Presentation

### Group structure

- Each official attribute uses one labelled single-selection group.
- Group order follows the approved content contract; do not infer importance from
  the attribute name.
- The `legend` is the official Spanish attribute label.
- Option Chips wrap within the group using 8px gaps and never require horizontal
  page scrolling.
- Long values wrap to multiple lines without ellipsis.

### Visual states

| State | Visual and semantic treatment |
| --- | --- |
| Default | Standard surface, persistent border, readable text and minimum 44px target. |
| Hover | Subtle primary border/surface emphasis; no required information appears only on hover. |
| Focus-visible | Shared focus ring, distinct from selected border and never clipped. |
| Selected | Primary interaction border plus persistent selected indicator and programmatic selected state. |
| Unavailable combination | Reduced emphasis plus explanatory accessible text such as `Esta combinación no está disponible`; never use “sin stock” or “agotado”. |
| Loading resolution | Preserve existing choices and selection; status announces progress only if perceptible. Do not replace options with skeleton Chips. |
| Error resolving | Preserve understandable choices, explain that option information cannot be completed and allow another choice. |

Inactive Variants are omitted rather than passed as disabled options. A full
Variant becomes selected only after the chosen values identify exactly one Active
Variant. No Variant is preselected merely to produce a default state.

### Selected Variant context

After complete resolution, present a compact read-only summary close to the option
groups. Use meaningful pairs such as `Color: Azul` and `Talla: M`. Do not expose SKU,
barcode, reference, price difference, stock or delivery. The summary is supporting
context and must not visually resemble an order configuration panel.

## Merchandising Metadata

- Short description belongs immediately after Product name.
- Complete description belongs in a later readable section.
- Brand and collection may appear as labelled text pairs.
- Gender applicability uses visitor-facing Spanish text and never internal enum
  values.
- Tags may use non-interactive Chips, but do not look like filters or links.
- Product Type, Subcategory and Category remain the authoritative classification
  context and receive stronger semantic placement than merchandising metadata.
- Omit every absent field and its label; never render an empty metadata container.
- SEO title and description never duplicate visible page content.

## Responsive Behavior

### Mobile — below 640px

- Use one column in semantic order: orientation, gallery, identity, price when
  eligible, Variant groups, selected context, details, related Products.
- Main media uses full available width without viewport-height sizing.
- Direct Image controls form a wrapping grid or bounded non-clipping scroll region;
  the page itself never scrolls horizontally.
- Variant Chips wrap and may occupy the full row for long labels.
- Touch targets remain at least `44px × 44px` with 8px minimum separation.
- No sticky purchase or Variant bar is introduced.

### Tablet — 640px to 1023px

- Preserve the same DOM and focus order.
- Gallery and identity may remain stacked or use a balanced two-column composition
  only when each column preserves readable labels and 44px controls.
- Direct controls and Variant groups wrap without truncation.
- Related Products use the approved two-column grid.

### Desktop — 1024px and above

- Use a two-column primary region: gallery approximately `55–60%`, Product
  information approximately `40–45%`.
- Keep columns aligned at the top and separated by the shared 32–48px layout gap.
- Variant groups remain with Product information and do not become a detached
  commerce sidebar.
- Metadata and complete description span the readable content width below.
- Related Products follow the approved three/four-column platform grid.

### Large desktop — above 1440px

- Keep the existing maximum container width; do not enlarge media indefinitely.
- Preserve body text at `60–75` characters per line.

## Interaction States

### Loading

- Preserve known Product name and taxonomy context.
- Reserve the stable main-media frame with a non-interactive skeleton.
- Thumbnail skeletons are not buttons and do not enter the accessibility tree as
  Image choices.
- Never render placeholder Variant options.
- Do not interpret unresolved collections as missing or empty.

### Image failure

- Keep the current Image position and use the shared error presentation.
- Announce a concise polite status without URL or technical details.
- Keep other direct Image controls operable.
- When no valid Image remains, use the missing-media presentation.

### Variant-associated Image failure

- Keep the Variant selection and its text summary.
- Do not silently associate a different Image.
- Keep the remaining gallery available and announce the media issue politely.

### Variant resolution error

- Preserve selections that remain understandable.
- Display: `No pudimos completar esta combinación. Prueba otra opción.`
- Do not use inventory, price or commercial-availability language.
- Do not select an arbitrary Variant or clear focus.

### Product unavailable

Use the existing unavailable-Product outcome. Gallery or option errors never create
a separate Product availability state.

### Success

Do not show a toast. Successful inspection is visible through selected option
state, compact Variant summary, current gallery item and polite status when useful.

## Accessibility Considerations

- Follow WCAG 2.2 AA and the Platform accessibility contract.
- Gallery uses a labelled region and exposes current position and total count.
- Direct Image controls have unique names and programmatic current state.
- Every Image uses approved alternative text; fallback decoration is not announced
  redundantly.
- Option groups expose one label and controlled single-selection semantics.
- Selected, unavailable and focus states never rely on color alone.
- Keyboard focus stays on the control that initiated Image or Variant changes.
- Polite status messages announce meaningful changes without interruption or
  repeated unchanged content.
- DOM order remains stable across breakpoints; no hidden duplicate gallery or
  option groups exist.
- All controls support keyboard activation and visible focus.
- Labels and values remain complete at 200% zoom and support text reflow without
  clipping.
- Motion is optional, brief and removed under `prefers-reduced-motion`.
- Base, inactive and indistinguishable Variants are absent from both visual and
  accessibility trees.

## UX Writing

Use specific, non-transactional labels:

- `Elige una opción para conocer sus características.`
- `Imagen 2 de 5.`
- `Color seleccionado: Azul.`
- `Esta combinación no está disponible.`
- `No pudimos mostrar esta imagen.`
- `No pudimos completar esta combinación. Prueba otra opción.`

Avoid:

- `Comprar`, `Agregar`, `Configurar pedido`, `Disponible`, `Sin stock`, `Agotado`.
- Generic actions such as `Continuar`, `Aceptar` or `Enviar`.
- Internal terms such as `Variante base`, SKU, barcode or Variant Active state.

## UX Rationale

The gallery is controlled and non-autoplay because visitors are inspecting Product
evidence, not consuming promotional content. Text-labelled option groups make
Variants understandable across disability, device and media quality conditions.
Keeping choices beside Product identity preserves context while avoiding the visual
language of checkout. Optional content is progressively disclosed so a Product
remains understandable even without Images, metadata or selectable Variants.

## UI Validation Checklist

- [x] Gallery layout, controls, position, Primary/first outcome and no-media state are defined.
- [x] Variant-associated media changes presentation without moving focus or changing domain state.
- [x] Single and multi-attribute option groups and every visual state are defined.
- [x] Base, one meaningful, inactive and indistinguishable Variant outcomes are defined.
- [x] Mobile, tablet, desktop and large-desktop behavior preserve one DOM order.
- [x] Metadata hierarchy remains subordinate to Product identity and taxonomy.
- [x] Loading, missing, media failure, resolution error, unavailable Product and success states are defined.
- [x] Keyboard, semantics, status, alt text, 200% reflow, target size, contrast and reduced motion are defined.
- [x] Approved Carousel gallery and Chip option contracts are used without feature-specific shared components.
- [x] Product price, taxonomy, Commercial Availability and discovery-only boundaries remain unchanged.

## Approval

`PCV-010` is approved for implementation planning. Final rendered UI approval is
separate and will occur under `PGOC-012` after Platform implementation tasks
`PGOC-005` through `PGOC-010` are complete.
