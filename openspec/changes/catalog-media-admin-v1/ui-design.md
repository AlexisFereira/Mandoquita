# Catalog Media Admin V1 — UI Design

Status: Approved — Frontend Design Handoff Ready

Owner: UX/UI Designer

Date: 2026-07-13

## Dependency status

This artifact translates the approved Requirements, Architecture, UX Solution
and Design System contracts into responsive interface specifications. It does
not change catalog ownership, upload/storage behavior, authorization, media
limits or API outcomes.

| Deliverable | Status | Dependency |
| --- | --- | --- |
| CMA-016 Product media administration | Complete | Uses the approved Product gallery and two-phase upload contracts. |
| CMA-017 Category media administration | Complete | Uses the approved single optional Category Image contract. |
| CMA-018 joint Design/Accessibility Review | Approved | Independent decision recorded in `accessibility-design-review.md`; implementation validation remains CMA-038. |

## Shared administrative composition

Media administration extends the existing isolated `/admin` shell. It adds the
authorized destinations `Productos` and `Imágenes de categorías`; neither is
exposed in public navigation. Every workspace keeps the entity kind, name and
stable disambiguating reference above media content and uses one semantic DOM
for all viewports.

The interface uses existing light-only semantic tokens and released `Button`,
`Card`, `Input`, `Icon` and `PoliteStatus` foundations with native file, list,
radio, progress and confirmation semantics. No media-specific palette, reusable
uploader, editor, cropper, bulk action or mutation-enabled Carousel is added.

### Shared measurements

- The authorized shell uses 16px horizontal gutters below 640px, 24px from
  640px and 32px from 1024px, within the existing 1280px maximum container.
- Editable media forms use a 720px readable maximum. Product gallery review may
  use the full container width.
- All controls have a minimum 44 by 44 CSS-pixel target and the global visible
  focus treatment. Adjacent destructive and safe actions keep at least 8px
  separation.
- Preview frames are square, use `object-fit: contain`, a muted surface, semantic
  border and medium radius. They never crop source meaning and never act as the
  sole label or control.
- Gallery summary previews are 160 by 160px on desktop and tablet. Below 640px
  they are `min(100%, 320px)` and remain left aligned. Add/replace review frames
  are `min(100%, 320px)` each.
- Text, filenames, errors and actions wrap without horizontal page scrolling at
  320px, 200% zoom and supported text spacing. Long technical-looking names use
  `overflow-wrap: anywhere` only as a final fallback.

### Shared upload panel

The upload panel is a labelled region with this visual and DOM order:

1. Heading naming `Agregar` or `Reemplazar` and its Product/Category context.
2. Visible format guidance: `JPEG, PNG, WebP o AVIF. Máximo permitido: {límite
   configurado}. Una imagen por carga.` The server-returned deployment limit is
   authoritative; the UI must not hard-code the architecture ceiling as the
   ordinary limit.
3. Native single-file input with the approved `accept` hints.
4. Stable preview frame and safe filename/format/size details when available.
5. `Texto alternativo` Input, helper `Describe lo importante de la imagen en el
   contexto del catálogo.`, visible `0/240` counter and associated field error.
6. Entity-specific position/Primary controls where applicable.
7. Status/progress region.
8. Contextual actions.

The alternative-text value is required, trimmed, 1–240 characters and remains
subject to server meaning validation. Filename and preview do not populate it.
For replacement, current text may be prefilled but the helper states `Revisa que
el texto describa el reemplazo.`

`Subir imagen` begins only the temporary upload. Measurable transfer uses a
labelled native `progress` plus visible percentage; otherwise it shows
`Subiendo y validando imagen` and one polite status. Duplicate submit and file
replacement are unavailable while a transfer is active. After upload, the panel
states `Carga lista para guardar` and `La imagen todavía no forma parte del
catálogo.` The final entity action is then enabled.

`Cancelar` before upload clears local selection. `Cancelar carga` is offered
only when the API supports it and never promises deletion. A ready temporary
upload uses `Descartar carga`; discarding returns to the persisted baseline.
Local selection, entered text, intended order/Primary and temporary upload all
participate in the existing Admin dirty-state exit confirmation.

## CMA-016 — Product media administration

### Entry and page hierarchy

Product summaries and the Product editor expose `Administrar imágenes`. The
destination uses:

1. `Volver a productos` or breadcrumb.
2. Eyebrow `Producto`, H1 `{nombre del producto}` and supporting slug/reference.
3. Read-only Variant reference context when supplied.
4. Gallery-level status/error region.
5. H2 `Galería del producto`, count and Primary summary.
6. `Agregar imagen` and `Reordenar galería` actions.
7. Complete ordered gallery.

A zero-image Product shows `Este producto no tiene imágenes.` and `Agregar
imagen`; it is not presented as invalid. A gallery with no Primary explicitly
shows `Sin imagen principal`. Loading reserves stable summaries; a failed
preview shows `Vista previa no disponible` while keeping identity, alternative
text, position, Primary/reference state and actions operable.

### Ordered gallery summary

Use one native ordered list. Each keyed `Card` keeps these elements together:

1. Preview and text identity `Imagen {position} de {count}`.
2. Alternative text, or the governed pending label for compatible legacy data.
3. Visible state: `Principal` or `No principal`.
4. Visible reference state: `Usada por variantes` or `Sin referencias de
   variantes` when that information is supplied.
5. Actions: `Editar texto alternativo`, `Reemplazar imagen` and, only when
   permitted, `Eliminar imagen`.

Desktop uses a four-area grid: 160px preview, flexible description, minimum
180px state column and wrapping actions. Tablet uses preview plus one flexible
content column with states/actions below the description. Mobile stacks preview,
description, states and full-width/wrapping actions. The ordered list is never a
horizontally scrolling table and is not duplicated per breakpoint.

The released Carousel may inspect the persisted gallery in a separate labelled
region, but it cannot edit, reorder, select Primary or own dirty state.

### Add Product Image

`Agregar imagen` opens an inline task panel or route within Product context. In
addition to the shared upload controls it contains:

- `Posición en la galería`, a labelled select containing positions 1 through
  `n + 1`; the visible default is `Al final — posición {n + 1}`.
- A fieldset `Imagen principal` with `No, mantener la selección actual` and
  `Sí, usar esta imagen como principal`. Default is No, including an empty
  gallery.

The sequence is `Subir imagen` followed by `Agregar a la galería`. The latter is
disabled until a temporary upload is ready and all fields are valid. Confirmed
success refreshes the persisted ordered list, moves focus to the new summary
heading and announces `Imagen agregada a la galería` without exposing upload or
storage identifiers.

### Edit alternative text

Editing retains the persisted preview beside a labelled `Texto alternativo`
field. `Guardar texto alternativo` is unavailable when unchanged or locally
invalid. Server confirmation replaces the baseline and announces `Texto
alternativo actualizado`; failure preserves the entered correction while the
persisted value remains identified as current.

### Reorder gallery

`Reordenar galería` enters an explicit mode. Each list item adds text-visible
`Mover antes` and `Mover después` buttons. The first/last impossible action is
natively disabled and retains an understandable name such as `Mover antes no
disponible: ya es la primera imagen`.

After a local move, the DOM order changes to match the intended order while the
same stable Image key preserves focus on the activated move control. A polite
status announces `Imagen movida a la posición {x} de {n}. Orden sin guardar.`
The region exposes `Guardar orden` and `Cancelar reordenación`; cancellation
restores the persisted list. Save submits one complete order. Conflict/failure
does not display a partial result and offers `Recargar galería` after explaining
that a newer confirmed order exists.

Pointer drag may supplement these controls but is omitted from the required V1
design. No pagination may make part of an active complete reorder ambiguous.

### Primary designation

Primary editing uses one gallery-level fieldset `Imagen principal`, with one
radio per stable Image and an explicit `Sin imagen principal` radio. Radio
labels include position and alternative-text context, not thumbnail alone.
Changing selection is local and shows `Selección principal sin guardar`.
`Guardar imagen principal` confirms one atomic outcome; moving, adding or
replacing never changes it implicitly. Success announces the selected Image or
`El producto no tiene imagen principal`.

### Replace Product Image

The replacement task keeps Image position, Primary and Variant-reference
context visible and non-editable. Above the shared controls, two labelled square
frames show `Actual` and `Reemplazo`; desktop/tablet place them in two equal
columns with a 24px gap, while mobile stacks them in that reading order.

`Guardar reemplazo` is enabled only after the temporary replacement and valid
alternative text are ready. Confirmation preserves stable Image identity,
position, Primary and Variant references. Success returns focus to the same
gallery summary and announces `Imagen reemplazada`. The UI never suggests that
Variants were reassigned.

### Product Image removal

Referenced Images do not expose an actionable delete. They show an inline
explanation `No puedes eliminar esta imagen porque está usada por variantes.`
and the recovery `Reemplazar imagen`.

For an unreferenced Image, `Eliminar imagen` opens an inline confirmation or an
independently validated native modal dialog. It names the Product and Image,
states `La imagen desaparecerá del catálogo y esta acción no ofrece deshacer`,
and provides `Conservar imagen` followed by danger `Eliminar imagen`. The safe
action receives initial focus. If Primary, add `El producto quedará sin imagen
principal, salvo que selecciones otra explícitamente.` The persisted Card stays
visible until server confirmation. Success returns focus to the gallery heading
and announces `Imagen eliminada`.

If a reference appears after load, retain the Image and show `La imagen ahora
está usada por una variante y no se eliminó`, with `Recargar galería` and
`Reemplazar imagen`.

## CMA-017 — Category media administration

### Category collection

`Imágenes de categorías` is a separate authorized destination with H1
`Imágenes de categorías` and copy stating that each existing Category may have
one optional image. It contains a labelled Category search/navigation control
and one semantic list; it never mixes Product results or exposes Category
creation, deletion, ordering or taxonomy editing.

Each Category summary shows name, stable taxonomy context/reference, a 96px
square preview or `Sin imagen`, alternative-text availability, read-only
Active/Visible context when supplied and `Administrar imagen de {categoría}`.
Desktop/tablet use preview plus flexible identity/status/action columns; mobile
stacks them without horizontal overflow. Loading, no Categories, no matches and
request failure reuse Product Admin collection patterns and safe retry copy.

### Single-Image editor

The editor identifies eyebrow `Categoría`, H1 `{nombre}` and read-only taxonomy
context before H2 `Imagen de la categoría`. It never renders Product gallery,
order, Primary or Variant-reference controls.

With no Image, show a stable empty preview and `Esta categoría no tiene imagen.
La imagen es opcional.` followed by `Agregar imagen`. The shared upload flow ends
with `Agregar imagen a la categoría`; success focuses the persisted media
heading and announces `Imagen de categoría agregada`.

With an Image, show one persisted square preview, its alternative text and the
actions `Editar texto alternativo`, `Reemplazar imagen` and `Eliminar imagen`.
Compatible legacy media without text shows `Texto alternativo pendiente`; it
remains viewable, but editing metadata or replacement requires a valid 1–240
character value.

Replacement uses the same `Actual`/`Reemplazo` comparison and two-phase language
as Product replacement, without order/Primary controls. `Guardar reemplazo`
must preserve Category identity, taxonomy version, order, Active, Visible and
discovery eligibility. Success announces `Imagen de categoría reemplazada`.

Removal confirmation names the Category, states that it will remain valid with
no Image and that no maintainer-visible undo exists, and offers `Conservar
imagen` then danger `Eliminar imagen`. The persisted preview remains until
confirmation. Success replaces it with `Sin imagen`, restores focus to the media
heading and announces `Imagen de categoría eliminada`.

## Status, validation and recovery matrix

| State | Visible contract | Recovery/focus contract |
| --- | --- | --- |
| Local invalid file | Approved format/limit message next to file input; no catalog change. | Preserve other valid values; focus error summary on submitted blocking validation. |
| Uploading | Labelled progress or indeterminate text; `La imagen todavía no forma parte del catálogo.` | Prevent duplicate upload; optional supported cancellation only. |
| Temporary ready | `Carga lista para guardar`; explicit unsaved state. | Final association/replacement action or `Descartar carga`. |
| Association saving | `Guardando cambios en el catálogo…`; persisted baseline stays visible. | Disable duplicate final submit; do not announce success early. |
| Confirmed | Entity-specific success plus refreshed server baseline. | Move focus only to the affected summary/heading as specified above. |
| Upload failed | `No pudimos subir y validar la imagen. El catálogo no cambió.` | `Reintentar carga` when the same authorized selection can safely retry, otherwise choose again. |
| Save failed | `La carga no se pudo guardar en el catálogo. El catálogo no cambió.` | Preserve ready temporary upload when server permits; use `Reintentar guardado`, not upload copy. |
| Conflict | `Hay cambios más recientes. Tus cambios no se guardaron.` | `Recargar` is the primary recovery; no automatic merge. |
| Session expired | `Tu sesión administrativa terminó. Los cambios no se guardaron.` | Return to access gate; never promise reuse of local/temporary data. |
| Storage unavailable | `No pudimos procesar la imagen en este momento. El catálogo no cambió.` | Safe retry only when authorized by the response; no provider detail. |
| Referenced removal denial | Image remains; explicit Variant-use explanation. | `Recargar galería` or `Reemplazar imagen`; never offer forced deletion. |

Errors use a native alert/error summary plus field association. Focus moves to
the summary only after a submitted blocking outcome; passive loading/status does
not steal focus. Error copy never exposes credentials, object keys, checksums,
private URLs, provider/bucket data or internal authorization distinctions.

## Responsive and accessibility self-review — CMA-018

- Native file input remains labelled, keyboard-operable and single-file. Any
  visual drop region is supplementary and invokes the same input.
- Persisted previews use their approved alternative text. Local previews are
  described by their task label and filename/status; broken/empty states have
  visible textual identities. The visible alternative-text field is associated
  with the preview it describes.
- Ordered Product media is a native ordered list. Move controls are keyboard
  reachable, preserve stable identity/focus and announce position. No drag-only
  interaction exists.
- Primary selection is one native radio group including `Sin imagen principal`.
  State is expressed in text and programmatically, never by color or location
  alone.
- Native progress exposes name, value and maximum when determinate. Indeterminate
  work has visible text and a polite live region. Repeated progress values are
  not redundantly announced.
- Modal confirmation, if selected, traps focus, supports Escape as cancel and
  restores focus to its invoking control; inline confirmation follows document
  order. Dismissal never confirms deletion.
- All actions meet 44 by 44px targets; focus remains visible; semantic danger,
  success, border and text roles meet the released light-only contrast contract.
- Layouts reflow at 320px, 200% zoom and supported text spacing with one DOM,
  wrapping controls and no horizontal page scroll. Current/replacement previews
  stack on mobile. No content relies on hover.
- Motion is nonessential and respects reduced motion. Upload understanding never
  depends on animation.
- Unsaved, uploading, temporary, failed, Primary, referenced and confirmed
  states all have visible text and programmatic semantics.

The UX/UI self-review and independent Accessibility Design Review are complete
with no design blocker. CMA-018 is approved against this implementation-ready
design specification. Rendered implementation validation remains CMA-038.

## Frontend handoff boundary

Frontend may implement CMA-027 through CMA-034 from this artifact once the
executable Backend contract supplies authorized routes, baselines, progress and
error outcomes. Frontend must not infer storage lifecycle, file validity,
reference safety or persistence from client state. Independent Accessibility
approval remains a release/design gate and may require corrections without
expanding V1 scope.
