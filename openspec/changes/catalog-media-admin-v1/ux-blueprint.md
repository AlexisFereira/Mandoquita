# Catalog Media Admin V1 — UX Solution

> **Admin V2 integration (2026-07-14):** media journeys remain valid, but their
> access/session shell is the released Admin V2 named-account experience. The
> Product Admin V1 shared-code shell described historically is not active.

Status: UX Ready — Requirements and Architecture Approved

Owner: UX Solution Architect

Date: 2026-07-13

## Experience Goal

Allow an authorized catalog maintainer to keep Product galleries and Category
discovery images accurate, ordered and meaningfully described from the isolated
Admin, without exposing storage concepts or implying that an uploaded file is
already part of the public catalog.

The experience extends Product Admin V1. It reuses its access gate, temporary
session, exit, no-index and private-navigation boundaries; it does not create a
second login or a public media destination.

## Experience Principles

1. **Entity context is always explicit.** Product gallery work and Category
   Image work are separate destinations with different ownership and rules.
2. **Upload is not save.** A temporary upload is labelled as pending and becomes
   public catalog media only after the association or replacement is confirmed.
3. **Persisted state is the baseline.** Preview, progress and local edits never
   claim success before server confirmation.
4. **Destructive consequences are named.** Removal has an explicit confirmation;
   referenced Product Images explain why removal is unavailable.
5. **Recovery preserves understanding.** Errors say what remains unchanged and
   identify the safe next action without revealing storage or security details.

## Scope Boundaries

Included:

- Review the complete ordered Image collection for an existing Product.
- Add one Product Image at a time with required alternative text and a
  deterministic position.
- Edit Product Image alternative text, order and Primary designation.
- Replace a Product Image while preserving its identity and relationships.
- Remove an unreferenced Product Image after confirmation.
- Review existing Categories and manage each Category's single optional Image.
- Upload, replace, describe or remove Category media.
- Preview, progress, validation, retry, cancellation, conflict, session-expiry
  and storage-unavailable outcomes.

Excluded:

- Product or Category creation/deletion and taxonomy editing.
- Variant creation, editing or Image-reference reassignment.
- Bulk upload, bulk removal, a reusable media library or cross-entity reuse.
- External image URLs, video, animation, SVG, documents or image editing.
- Cropping, filters, compression controls, generative media or visitor uploads.
- A maintainer-visible undo promise after confirmed removal.

## Information Architecture

```text
/admin (existing isolated access and session boundary)
├── Products
│   ├── Edit Product details (existing)
│   └── Manage Product images
│       ├── Ordered gallery
│       ├── Add Image
│       └── Edit one Image
└── Category media
    ├── Category collection
    └── Manage one Category Image
```

`Products` remains the initial authorized destination. Each Product summary and
Product editor exposes a clearly named `Administrar imágenes` action. Category
media has a separate authorized navigation item, `Imágenes de categorías`, and
never appears as a Product editor section.

All media destinations retain a visible breadcrumb or return action, the entity
name and entity kind. They are absent from public Header, Footer, Search,
Sitemap, Product Detail and Category navigation.

## Shared Orientation and State Model

Every media workspace prioritizes:

1. Return path and entity kind.
2. Entity name and stable disambiguating reference.
3. Persisted media summary.
4. Current task and editable controls.
5. Status and recovery region.
6. Save/cancel or confirmation actions.

The interface distinguishes these states in language and semantics:

- **Persisted:** confirmed catalog media.
- **Selected locally:** a file chosen in the browser but not uploaded.
- **Uploading:** bytes are being transferred and validated.
- **Uploaded temporarily:** safe preview exists, but no public association exists.
- **Saving:** the aggregate association or change is awaiting confirmation.
- **Confirmed:** the new persisted baseline returned by the server.
- **Failed or stale:** the prior persisted baseline remains authoritative.

Temporary upload identity, storage lifecycle, checksums and internal object
location are not presented as catalog concepts. Safe format, dimensions and file
size may be supporting review information when returned by the approved API.

## Product Gallery Journey — CMA-012

### Entry and gallery review

1. The maintainer selects `Administrar imágenes` for an existing Product.
2. The workspace identifies `Producto`, Product name and slug.
3. The complete persisted gallery loads in deterministic order.
4. Each Image summary exposes:
   - preview;
   - alternative text;
   - ordinal position;
   - Primary or non-Primary status;
   - whether one or more Variants reference it; and
   - actions allowed for that Image.
5. The maintainer may add an Image or choose one persisted Image to edit.

The gallery must remain manageable for any valid existing count. It may use
progressive rendering or pagination for performance, but it must not hide,
truncate, remove or invalidate Images because of their count. A Product with no
Images presents a valid empty gallery and the action `Agregar imagen`; it does
not imply that the Product is invalid.

If no Image is Primary, the workspace states `Sin imagen principal` without
automatically selecting one. If a preview cannot load, the Image identity,
alternative text, order, Primary and reference context remain operable.

### Add Product Image

1. Activate `Agregar imagen`.
2. Select one file from the approved JPEG, PNG, WebP or AVIF boundary.
3. Review a local preview when the browser can produce one.
4. Enter meaningful alternative text, 1–240 trimmed characters.
5. Choose the intended deterministic position; default placement may be the end
   of the current gallery, but is shown and may be changed before confirmation.
6. Choose whether it will be Primary. The default is not Primary; no Primary is
   inferred from being the first or only Image.
7. Activate `Subir imagen` to start the temporary upload.
8. After successful upload, show `Carga lista para guardar` and explain that the
   public Product has not changed.
9. Activate `Agregar a la galería` to request the aggregate association.
10. On server confirmation, replace the gallery baseline and announce
    `Imagen agregada a la galería`.

The confirm action remains unavailable until file and alternative-text
validation pass and the temporary upload is ready. Leaving after temporary upload
uses the unsaved-change journey; it never silently communicates publication.

### Edit alternative text

- Editing begins from one persisted Image and preserves the visible Product and
  Image context.
- The current alternative text is the baseline and the new value is validated
  as meaningful, trimmed and no longer than 240 characters.
- The preview has an accessible association with its alternative-text field.
- Save updates only after server confirmation. A failed or stale request leaves
  the previous persisted text in effect and preserves the entered correction for
  review where authorization permits.

### Reorder gallery

- Reordering is an explicit gallery-level mode, not an accidental drag action.
- Every Image exposes keyboard-operable `Mover antes` and `Mover después`
  controls, or an equivalently accessible position control. Pointer drag may be
  supplementary but never the only mechanism.
- Each successful local move announces the Image's new intended position.
- `Guardar orden` submits the complete intended order as one change.
- Until confirmation, the view labels the order as unsaved and keeps the last
  persisted order distinguishable.
- Saving is all-or-nothing. Conflict or failure restores or reloads the persisted
  order; the interface never claims a partially saved sequence.
- First/last controls are unavailable when they cannot move, with an
  understandable accessible name and state.

### Designate or demote Primary

- Each Image exposes one mutually exclusive `Imagen principal` choice within the
  Product gallery.
- Selecting one Image locally makes every other choice non-Primary in the
  intended change and clearly marks the change as unsaved.
- Demoting the current Primary is allowed and produces `Sin imagen principal`
  unless the maintainer explicitly chooses another Image in the same valid
  change.
- Adding, moving or replacing an Image never makes it Primary implicitly.
- Confirmation announces the selected Image or confirms that the Product now
  has no Primary Image.

### Replace Product Image

1. Choose `Reemplazar imagen` on one persisted Product Image.
2. Retain the Image's current alternative text, position, Primary state and
   Variant-reference context on screen.
3. Select and upload one approved replacement file.
4. Review the temporary replacement preview alongside clear `Actual` and
   `Reemplazo` labels.
5. Provide approved alternative text for the replacement. The current text may
   be prefilled for review but must not bypass validation or imply that it
   describes the new visual.
6. Confirm `Guardar reemplazo`.
7. After server confirmation, show the new persisted preview while preserving
   the same Product Image context, position, Primary and Variant references.

Replacement is available for a Variant-referenced Image because identity is
preserved. Copy must not suggest that Variants are reassigned or edited.

### Remove Product Image

- An unreferenced Image exposes `Eliminar imagen` as a destructive action.
- Confirmation identifies the Product and Image preview/alternative text,
  explains that it will immediately disappear from the catalog after save, and
  states that no user-visible undo is available.
- If the Image is Primary, confirmation additionally explains that the Product
  will have no Primary Image unless another is explicitly chosen in the same
  approved change. It never proposes silent promotion.
- A referenced Image shows `Usada por variantes` and does not present removal as
  available. The recovery is `Reemplazar imagen`; V1 provides no Variant editing.
- If the server rejects removal because a reference appeared after load, keep
  the Image, explain that it is now used by a Variant, and offer `Recargar
  galería` or `Reemplazar imagen`.
- Success removes the Image from the confirmed gallery and announces
  `Imagen eliminada`. No temporary undo control is shown.

## Category Media Journey — CMA-013

### Category collection

1. The maintainer opens `Imágenes de categorías`.
2. The page clearly identifies the `Categorías` context and provides search or
   navigation through existing Categories without mixing Product results.
3. Each Category summary prioritizes name, taxonomy context or stable reference,
   current Image preview or `Sin imagen`, current alternative-text availability,
   Active/Visible context when supplied, and `Administrar imagen`.
4. Selecting a Category opens its single-Image editor.

The collection supports loading, no Categories, no matching Categories and
request-error outcomes consistent with Product Admin. It does not offer Category
creation or taxonomy changes.

### Category editor with no Image

- Identify `Categoría`, Category name and taxonomy context.
- Explain that an Image is optional and absence does not invalidate the Category.
- Offer `Agregar imagen`.
- File selection, temporary upload, meaningful alternative text and confirmed
  association follow the shared two-phase journey.
- Success announces `Imagen de categoría agregada` and replaces `Sin imagen`
  with the confirmed persisted outcome.

### Category editor with an Image

- Show the current persisted preview and alternative text when available.
- Offer `Editar texto alternativo`, `Reemplazar imagen` and `Eliminar imagen`.
- Replacement presents current and temporary previews, requires approved
  alternative text and does not expose or change taxonomy identity, version,
  order, Active, Visible or discovery eligibility.
- Editing metadata requires valid 1–240-character alternative text.
- Legacy Category media without alternative text remains viewable and valid.
  The interface identifies `Texto alternativo pendiente` without blocking review
  or removal; replacement or text update requires a valid new value.

### Remove Category Image

- `Eliminar imagen` opens a destructive confirmation naming the Category and
  explaining that it will have no Image after confirmation while remaining a
  valid Category.
- Removal does not require fabricated alternative text.
- Success returns the editor to `Sin imagen` and announces
  `Imagen de categoría eliminada`.
- No user-visible undo is promised, and no other taxonomy value appears changed.

### Category recovery

- Failed upload or save retains the last confirmed Category outcome.
- A stale Category baseline requires reload and review; no taxonomy or Image
  state is merged automatically.
- A missing Category returns to the Category collection with a neutral message.
- An unavailable persisted preview does not remove the Category Image record or
  disable alternative-text correction, replacement or permitted removal.

## Upload, Validation and Recovery — CMA-014

### File selection validation

Before upload, the interface may reject clearly unsupported extensions or
declared types and explain the accepted JPEG, PNG, WebP and AVIF formats and the
configured file-size limit. Server validation remains authoritative for file
signature, detected type, size, dimensions and content.

Outcomes identify the corrective action:

- Unsupported or signature-mismatched file: choose an approved raster file.
- File too large: choose a file within the displayed deployment limit.
- Invalid dimensions or decoded content: choose a smaller valid image.
- Multiple files: keep the one-file task explicit and request one selection.
- Missing/invalid alternative text: describe the catalog meaning in 1–240
  characters; filename-only, filler or unrelated text is not accepted.

The rejected filename may be shown locally for correction, but must not enter a
URL, analytics event or unsafe error log.

### Upload progress

- Announce start, determinate percentage when reliable, or an indeterminate
  `Subiendo y validando imagen` status when exact progress is unavailable.
- Keep entity identity, preview and alternative text visible during progress.
- Disable duplicate upload/association submissions while the active request is
  pending without disabling unrelated reading or the explicit cancel action.
- Completion says `Carga lista para guardar`, never `Imagen guardada`.
- Progress and completion use programmatic status semantics without excessive
  repeated announcements or focus theft.

### Cancel

- Before upload, `Cancelar` clears the local selection and returns to the
  persisted editor.
- During upload, `Cancelar carga` requests cancellation when supported and shows
  `Cancelando`; it does not promise that transferred bytes were erased.
- After a temporary upload, `Descartar carga` requests cancellation of that
  unused upload and returns to the persisted editor only after a safe outcome.
- If cancellation cannot be confirmed, explain that the catalog was not changed
  and that the temporary file will be handled by the governed expiry/cleanup
  process. Do not expose storage paths or promise immediate deletion.
- Cancellation after confirmed association is not upload cancellation; the
  separate governed remove or replace journey applies.

### Retry

- A transfer or validation failure that invalidates the upload requires choosing
  or uploading a corrected file.
- A transient upload failure offers `Reintentar carga` with duplicate-submission
  protection.
- If upload succeeded but association failed, retain the temporary preview and
  offer `Reintentar guardar` while that upload remains valid and session-bound.
- Retry never creates a second visible gallery item or claims association before
  confirmation.

### Unsaved changes and navigation

Local alternative text, intended order/Primary changes, a selected file and a
temporary unassociated upload all count as unsaved work.

- Internal navigation, return actions and explicit session exit require a
  confirmation when unsaved work exists.
- `Seguir editando` preserves the current task.
- `Descartar cambios` restores the persisted baseline and cancels/discards an
  unused upload when applicable.
- Browser reload/close may use the standard warning.
- The warning distinguishes `todavía no se guardó en el catálogo` from a
  confirmed persisted change.

### Validation failure on save

- Preserve entered values and the temporary preview when safe and authorized.
- Associate field errors with their controls and provide an error summary when
  more than one issue exists.
- Focus the submitted error summary or first invalid field according to the
  established form pattern.
- Explain that the current catalog Image or gallery remains unchanged.

### Concurrent conflict

For stale Product, Product Image or Category data:

- do not overwrite or merge automatically;
- explain that media changed after this page was opened;
- offer `Recargar galería` or `Recargar categoría` as the primary recovery;
- warn that reload discards local metadata/order choices;
- after reload, require review of the new persisted state before retrying; and
- retain a still-valid temporary upload only when the authorized Backend contract
  confirms it can safely be retried against the refreshed entity. Otherwise ask
  the maintainer to upload again.

### Expired or invalid session

- Stop the media change and never claim success.
- Return to the existing Admin access gate with
  `Tu sesión administrativa terminó. Ingresa nuevamente.`
- If unsaved work existed, add `Los cambios no se guardaron.`
- Because temporary uploads are session-bound, do not promise that a prior upload
  can be reused after re-entry. Require a fresh review and selection unless the
  server returns an approved recoverable state.
- Never expose the access code, CSRF value, operator key or storage credentials.

### Storage unavailable

- During upload: state that the Image could not be uploaded, keep the persisted
  catalog unchanged and offer retry when safe.
- After upload but during association/replacement: state that the requested
  catalog change was not confirmed; keep the prior persisted outcome and offer
  safe save retry only if the temporary upload remains valid.
- During cleanup/cancel: state that the catalog was not changed by the temporary
  upload and avoid promising immediate storage deletion.
- For service configuration or general unavailability, provide a neutral
  `La administración de imágenes no está disponible en este momento` outcome
  with retry later. Do not reveal bucket, provider, object key or server detail.

### Other governed outcomes

- Throttled: explain when retry is safe using server-provided generic guidance.
- Missing entity/Image/upload: return to the nearest valid collection or reload
  the persisted entity without exposing ownership/storage details.
- Already-consumed upload: reload the entity to determine the confirmed outcome;
  do not submit it to a different target.
- Unexpected error: preserve the last confirmed baseline and provide one safe
  retry or return action.

## Responsive Priorities

### Desktop

- Gallery previews may form a scannable grid/list while order, Primary,
  reference status and actions remain associated with each Image.
- Current and replacement previews may appear side by side with explicit labels.
- Category collection and editor remain visually distinct from Product gallery
  controls.

### Tablet

- Image metadata and actions reflow below the preview before labels truncate.
- Reorder controls preserve explicit sequence and touch targets without relying
  on dense drag handles.
- Upload, alternative text and confirmation remain in one understandable task
  sequence.

### Mobile

- Use one top-to-bottom column with no horizontal scrolling.
- Product Images become ordered summaries; each preview, position, Primary,
  reference status and action remain in the same semantic group.
- Current and replacement previews stack with labels.
- Persistent actions must not obscure form errors, progress or the final gallery
  item at 320 CSS pixels.

## Accessibility Requirements

- Product and Category contexts use distinct headings, breadcrumbs and accessible
  names.
- Every persisted or temporary meaningful preview is associated with its
  alternative text or a clear pending-preview label; a broken preview retains a
  textual identity.
- Native file selection remains keyboard operable and exposes accepted formats;
  drag-and-drop, if offered, is supplementary.
- Alternative-text help describes purpose and limits without using placeholder
  text as the label.
- Reorder is fully keyboard operable, announces intended position changes and
  does not rely on spatial position or color alone.
- Primary uses a mutually exclusive semantic control; referenced status and
  removal denial use text, not icons/color alone.
- Progress, ready, saving, success and errors use suitable status/alert semantics
  with controlled announcements and no unexpected focus movement.
- Destructive confirmations receive focus, trap it while open, name the action
  and restore focus to a logical surviving control after cancel or success.
- Error summaries link to invalid fields; focus is moved only after submitted
  validation or when required for a blocking dialog.
- All controls have visible focus, understandable disabled states and at least the
  approved touch target. Content supports 200% zoom, 320px reflow, text spacing,
  contrast, reduced motion and deterministic light-only presentation.

## Security and Privacy UX Constraints

- Media Admin is available only inside the existing server-authorized Admin
  session and managed perimeter; client-side hiding is not authorization.
- Never expose storage/operator credentials, private URLs, bucket names, object
  keys, internal headers or raw server errors.
- Never place filenames, temporary upload identities, media IDs or sensitive
  request values in analytics or public navigation.
- Safe previews come only from the approved server response or local browser
  selection; arbitrary external URL entry is not offered.
- Do not represent a temporary upload, failed save or optimistic preview as a
  public catalog outcome.
- Administrative pages retain noindex, no-store and private-navigation behavior.

## UX Writing Contract

Preferred action labels:

- `Administrar imágenes`
- `Agregar imagen`
- `Subir imagen`
- `Agregar a la galería`
- `Guardar cambios`
- `Guardar orden`
- `Guardar reemplazo`
- `Reemplazar imagen`
- `Eliminar imagen`
- `Reintentar carga`
- `Reintentar guardar`
- `Descartar carga`
- `Recargar galería`
- `Recargar categoría`

Copy uses `imagen principal` for Product Primary and never calls temporary upload
`publicada`, `guardada` or `agregada` before aggregate confirmation. Product
Image, Product and Category remain distinct concepts in instructions and errors.

## UX Validation Checklist

- [x] Complete Product gallery review, empty/no-Primary and large valid gallery
  outcomes are defined.
- [x] Product add, preview, alternative text, deterministic position, Primary,
  replacement and confirmed association journeys are defined.
- [x] Reorder is atomic and keyboard operable; Primary is never inferred.
- [x] Referenced Product Image removal is denied with safe replacement/reload
  recovery; unreferenced removal has destructive confirmation and no undo claim.
- [x] Category collection, no-Image, legacy-text, upload, replacement, metadata
  update and optional removal journeys are distinct from Product media.
- [x] Temporary upload and confirmed catalog state are consistently separated.
- [x] File validation, progress, cancellation, retry, unsaved changes, conflict,
  expiry, unavailable storage and unexpected failure outcomes are complete.
- [x] Responsive, keyboard, assistive-technology, focus, progress, reflow, touch,
  contrast, motion and light-only expectations are documented.
- [x] No business, security, API route, storage or Variant rule was expanded.

## Handoff

CMA-012 through CMA-014 are UX-ready. UX/UI may use this document for
CMA-016–CMA-018 after Design System sufficiency CMA-015. React Frontend may use
the resulting approved Design and Backend contracts for CMA-027–CMA-034; this
blueprint does not prescribe React components, API schemas or storage mechanisms.
