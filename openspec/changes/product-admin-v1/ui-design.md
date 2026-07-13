# Product Admin V1 — UI Design

Status: Approved for Frontend Implementation

Owner: UX/UI Designer

Date: 2026-07-13

## Dependency status

This artifact consumes the approved `ux-blueprint.md` without approving Product
scope, editable fields, access policy, session behavior, API outcomes or security
architecture.

| Deliverable | Status | Dependency |
| --- | --- | --- |
| ADM-007 Six-digit access screen | Complete | Consumes approved ADM-001 through ADM-003 and ADM-006. |
| ADM-008 Responsive Product list | Complete | Consumes approved collection, search and filter contract. |
| ADM-009 Grouped Product editor | Complete | Uses only the closed FR-ADM-010/011 field set. |
| ADM-010 Save and recovery UI states | Complete | ADM-006 UX Solution is complete. |
| ADM-012 Responsive/accessibility Design Review | Complete | UX/UI, Design System, Accessibility and Product Requirements approvals are recorded in the review artifacts. |

## ADM-007 — Six-digit access screen

### Composition

`/admin` uses an isolated light-only shell with no public Header, Footer, Search,
Product navigation, payment content or contact CTA. The screen contains:

1. Mandoquita administrative identity, without a link into public navigation.
2. H1 `Acceso administrativo`.
3. Explanation: `Ingresa el código de seis dígitos para administrar productos.`
4. One credential field labelled `Código de acceso`.
5. Primary action `Ingresar`.
6. One persistent status/error region when an outcome exists.

The form sits in a standard surface with medium radius, semantic border and no
promotional elevation. Width is `min(100%, 440px)`. The page uses at least 16px
mobile gutters, 24px surface padding below 640px and 32px from 640px. It is
vertically composed within the viewport but remains normally scrollable when
zoom, keyboard or error content reduces available height.

### Credential field

- Use one password-style input, not six individual boxes. Set `inputmode="numeric"`,
  accept paste and limit the understandable value to six digits.
- Helper text is `Ingresa los seis dígitos.` The placeholder is not the label and
  must not display a sample credential.
- Do not add a custom show-code control in V1; this keeps the gate compact and
  avoids an additional shoulder-surfing state. Browser/password-manager behavior
  remains available where supported.
- Do not silently submit or automatically advance when the sixth digit is typed.
  Submission requires `Ingresar` or native form Enter.
- Client correction rejects non-numeric or non-six-digit input with `Ingresa un
  código de seis dígitos.` It improves input quality but is never authorization.
- The value never appears in URL, page copy, status text, analytics, logs or
  browser storage. After an unsuccessful server authorization, clear the field
  and return focus to it without announcing the value.

### Access states

| State | Visible outcome | Interaction/accessibility |
| --- | --- | --- |
| Initial | Empty labelled field, helper and `Ingresar`. | Predictable focus may enter the credential field after direct `/admin` navigation. |
| Locally incomplete/invalid | `Ingresa un código de seis dígitos.` | Associate through `aria-describedby` and `aria-invalid`; do not contact the server. |
| Verifying | Button label `Verificando…`; form remains oriented. | Disable duplicate submit, set form `aria-busy`, announce one polite status and preserve masked field until outcome. |
| Generic denial | `No se pudo autorizar el acceso.` | Clear and focus the field. Never distinguish wrong code, configuration, revocation or secret existence. |
| Temporary denial | `No se pudo autorizar el acceso. Espera antes de intentarlo de nuevo.` | Follow server retry availability without exposing attempt counts. Do not create a client-authoritative lockout. |
| Administration unavailable | `La administración no está disponible en este momento.` | Keep the surface fail-closed; show `Reintentar` only when the server contract permits it. |
| Session expired | `Tu sesión administrativa terminó. Ingresa nuevamente.` | Place message before the form and focus the field as the recovery destination. |
| Authorized | Replace the gate with the authorized Product administration shell. | Do not announce or display the credential; page purpose changes to Products. |

All actions meet a 44px target, focus uses the semantic focus role, and messages
wrap at 320px/200% zoom. The gate has no decorative animation, account avatar,
registration, password reset, remembered-session checkbox or alternate login.

## ADM-008 — Responsive Product list

### Authorized shell and hierarchy

The authorized `/admin` shell is distinct from the public site:

1. Compact administrative header: `Mandoquita · Administración` and `Salir`.
2. H1 `Productos` and supporting result context.
3. Search by Product name or slug.
4. Filter disclosure/region.
5. Applied filters and `Limpiar filtros` when applicable.
6. Count or current range.
7. Product collection.
8. Pagination.

There is no `Crear producto`, bulk action, row-selection checkbox, delete action,
Image tool, Variant tool or public-site navigation.

### Search and filters

- Search uses a persistent visible label `Buscar productos`, helper `Busca por
  nombre o slug`, a text-visible `Buscar` action and `Limpiar búsqueda` control.
- Whitespace-only submission does not change the collection and shows `Escribe
  un nombre o slug para buscar.` Search and filters return to page 1.
- The filter region is labelled `Filtros`. On mobile/tablet it uses an accessible
  disclosure button with `aria-expanded`; on desktop it is visible beside/above
  the collection. Closing the disclosure never clears applied values.
- Use labelled single-value selects with an `Todos` option for:
  `Publicación`, `Disponibilidad comercial`, `Destacado`, `Estado del producto`,
  `Categoría` and `Tipo de producto`.
- The four state filters expose exact paired values: Publicado/No publicado,
  Disponible/No disponible comercialmente, Destacado/No destacado and
  Activo/Inactivo. Editorial Approval is not an approved list filter.
- Category and Product Type options use official taxonomy names. Product Type
  labels include inherited context when needed to disambiguate identical names.
- Applied filters appear after the disclosure as removable, text-labelled Chips
  in deterministic filter order. Each removal action names the filter and value;
  `Limpiar filtros` removes all filters but does not silently clear the submitted
  search query.
- Apply changes through one text-visible `Aplicar filtros` action on compact
  layouts; filter selection alone does not unexpectedly navigate. Desktop may use
  the same explicit action for consistent behavior.

### Product summary collection

Use one semantic list with one coherent Product summary per item. CSS changes its
composition without duplicating desktop/mobile DOM.

Each summary presents in this order:

1. Product name and supporting slug.
2. Product Type, inherited Subcategory and Category.
3. Text badges for Active state, Publication, Commercial Availability and
   Featured designation. Each badge communicates its full state beyond color.
4. Last-updated context using an understandable localized date/time.
5. Optional stored Product-level price as low-priority authorized context.
6. `Editar {product name}` action with a distinguishable accessible name.

Do not show SKU, reference, barcode, Variant values, Image operations, tags,
inventory, cost, suppliers or audit details. Editorial Approval and Variant
readiness belong to the editor context rather than dense list badges.

### Responsive behavior

| Viewport | Composition |
| --- | --- |
| Mobile `<640px` | 16px gutters; one-column summaries/cards; identity, classification and state badges stack; Search action full width; filters collapsed by default; actions remain after content. |
| Tablet `640–1023px` | 24–32px gutters; list items use a two-area grid with identity/context left and states/action right; filters use disclosure when six controls would become cramped. |
| Desktop `≥1024px` | Shared 1280px maximum; Search and filter region remain adjacent to the collection; list items use a readable multi-column grid, not a horizontally scrolling spreadsheet. |

Long names, slugs and taxonomy labels wrap with `overflow-wrap: anywhere` only as
a last resort. No horizontal table scroll is introduced at 320px or 200% zoom.
State badges wrap and remain subordinate to Product identity.

### Collection states

| State | Required presentation |
| --- | --- |
| Loading | Keep H1, Search and known filters visible; show stable non-interactive summary skeletons without fabricated text or Edit links; mark collection busy. |
| Products available | Show count/range, deterministic collection and pagination when required. |
| No Products | `No hay productos para administrar.` No creation CTA. |
| No matches | `No hay productos que coincidan con la búsqueda y los filtros actuales.` Primary recovery clears applied search/filters; do not imply a system error. |
| Request error | `No pudimos cargar los productos.` Preserve query/filter context and offer `Reintentar`; no API/database detail. |
| Unauthorized/expired | Replace authorized shell content with the access gate and approved expiry message; do not leave list data interactable. |

Pagination uses a labelled navigation region, visible Previous/Next text, 44px
targets, current page text/`aria-current`, and preserves valid Search/filter
context. An out-of-range page resolves to server-approved nearest context.

## ADM-009 — Grouped Product editor

### Page hierarchy

1. Guarded `Volver a productos`.
2. Eyebrow `Editar producto` and H1 using the current Product name.
3. Read-only administration context: Product ID, public slug, last update and
   governed Variant readiness.
4. Validation/conflict/status region.
5. Editable groups in the order below.
6. Save/cancel action region defined by ADM-010.

The form maximum readable width is 960px within the 1280px admin Container.
Related fields use two columns only from 768px when both retain usable label,
helper and error widths; otherwise they stack. Every group uses a visible H2 or
`fieldset`/`legend` where controls form a related choice set.

### Group 1 — Identity

| Field | Control and guidance |
| --- | --- |
| Name | Required text Input; maximum 200; visible remaining/used character count that is not a live announcement. |
| Slug | Required text Input; maximum 160; helper: lowercase letters, digits and single hyphens; show public-path context separately without making the entire URL editable. Uniqueness remains server-confirmed. |

### Group 2 — Descriptive content

| Field | Control and guidance |
| --- | --- |
| Short description | Optional multiline text area; maximum 500; visible character count. Clearing stores absence, not meaningful empty text. |
| Complete description | Optional multiline text area; maximum 5,000; comfortable minimum height and visible character count. |

No rich-text toolbar, HTML editor, generated copy or preview is introduced.

### Group 3 — Merchandising metadata

| Field | Control and guidance |
| --- | --- |
| Brand | Optional text Input; maximum 160. |
| Collection | Optional text Input; maximum 160. |
| Gender applicability | Labelled select with `Sin especificar`, `Mujer`, `Hombre`, `Unisex`, `No aplica`, mapped only to the approved stored vocabulary. |

Tags and Images are not displayed as editable placeholders.

### Group 4 — Commercial information

| Field | Control and guidance |
| --- | --- |
| Price | Required persisted decimal value; positive, maximum two decimals and 99,999,999.99. Do not auto-round an invalid value. Clearing is invalid. |
| Currency | Required persisted text value constrained to exactly three uppercase letters; do not invent an unapproved currency list. Clearing is invalid. |
| Commercial Availability | Independent checkbox labelled `Disponible comercialmente` with helper explaining that disabling public availability preserves the stored price and currency. |

The editor always loads and displays the persisted Price and Currency baseline.
An individual partial Product Change may omit either unchanged field from its
request, but the resulting persisted Product must retain both required values.
Explicitly clearing either field produces associated validation — `Ingresa un
precio válido` or `Ingresa una moneda de tres letras` — and prevents the entire
atomic save. Price and Currency remain visible to the authorized maintainer when
Commercial Availability is off. Disabling it never clears, masks or silently
rewrites them.

### Group 5 — Publication and discovery states

Use separate native checkboxes, not one generic Status selector:

- `Producto activo`.
- `Aprobación editorial`.
- `Publicado`.
- `Producto destacado`.

Each has concise helper text. Checked state, visible label and semantics communicate
meaning beyond color. No control silently changes another state.

When Publication is requested, show a read-only prerequisite summary for Editorial
Approval, approved Product Type and governed Variant. A missing prerequisite is
explained and blocks the atomic save; UI does not create or repair it.

When Featured is enabled, reveal `Orden destacado`, an optional positive-integer
input. When Featured is disabled, explain `El orden destacado se eliminará al
guardar.` and include that removal in the same change. Cancel restores baseline.

### Group 6 — Taxonomy classification

- Provide one required/optional-as-rules-permit Product Type select populated by
  the approved active taxonomy contract.
- Each option shows `Categoría / Subcategoría / Tipo de producto` so the leaf is
  unambiguous.
- After selection, render inherited Category and Subcategory as read-only context.
- Do not provide separate editable Category or Subcategory controls.
- If the current assignment cannot satisfy Publication, show its status and
  correction without inventing or editing taxonomy structure.

### Group 7 — SEO content

| Field | Control and guidance |
| --- | --- |
| SEO title | Optional text Input; maximum 200; distinct from Product name. |
| SEO description | Optional multiline text area; maximum 500; distinct from visible descriptions. |

No search ranking score, keyword stuffing indicator or generated metadata is
introduced.

### Editor exclusions and responsive behavior

- Product ID, last-change and Variant readiness are read-only; Variant details,
  Images, tags and all excluded operational data remain absent.
- Mobile uses one column, 16px gutters and 24px between field groups. Group
  surfaces use 20px padding. Action controls stack without covering fields.
- Tablet uses 24–32px gutters and two columns only for paired short fields.
- Desktop uses 48px outer rhythm, a 960px form measure and 32px group separation.
  A sticky action region is optional under ADM-010 safeguards; no sticky side
  panel duplicates state or actions.
- Text areas resize vertically, labels/errors never truncate, and controlled
  vocabulary selects wrap through adjacent help text rather than widening the
  viewport.
- Tab order follows DOM group order. Checkbox helpers are programmatically
  associated. Focus never jumps because a dependent field appears; Featured order
  enters the normal order immediately after Featured when revealed.

## ADM-007–009 self-review

- [x] Access uses one paste-compatible masked credential field and generic secure
  outcomes with no public-shell content.
- [x] Product list supports only approved name/slug Search and six combinable
  filters, with applied-state removal and deterministic pagination.
- [x] Mobile uses summaries instead of a horizontally scrolling table.
- [x] Product editor includes every and only FR-ADM-010 editable field.
- [x] Product-level Price and Currency are required persisted values: partial
  changes may omit unchanged values, but neither field can be cleared.
- [x] Independent Product states remain separate; Publication, Featured,
  Commercial Availability and taxonomy consequences are explained, not inferred.
- [x] Images, Variants, tags, creation/deletion, bulk actions and operational/
  transactional fields remain excluded.
- [x] Loading, empty, no-match, error, validation and responsive outcomes are
  specified without exposing secrets or technical internals.
- [x] Keyboard order, labels, help/error association, focus, 44px targets, 320px
  reflow, 200% zoom, reduced motion and deterministic light-only constraints are
  ready for independent Accessibility verification.

## ADM-010 — Editor action hierarchy

The editor has one coherent action region following the editable groups in DOM
order. Frontend may make the same region visually sticky on desktop only when it
does not cover fields, error messages, browser UI or 320px/200% reflow content.

Action priority:

1. Primary: `Guardar cambios`.
2. Secondary: `Cancelar` when there are unsaved changes.
3. Navigation: `Volver a productos`, guarded when changes are unsaved.

`Guardar cambios` is unavailable when there are no changes, when known client
validation fails, or while a save is already pending. Disabled appearance is not
the only explanation: the action region exposes concise text such as `No hay
cambios para guardar` or directs the maintainer to the validation summary.

## State model

| State | Visible presentation | Focus and announcement | Available recovery |
| --- | --- | --- | --- |
| Pristine | Current persisted values; `Guardar cambios` unavailable; no success/error message. | Normal field order; no announcement on load solely for being pristine. | Edit a field or return to Products. |
| Dirty and valid | Persistent `Cambios sin guardar` text near actions; primary Save enabled; Cancel enabled. | No live announcement on every keystroke. Dirty meaning never relies on color alone. | Save, cancel, or guarded navigation. |
| Dirty and client-invalid | Preserve every value; affected fields show associated errors after interaction/submission; Save remains unavailable or submission resolves to validation state. | Do not announce on every keystroke. Submitted validation focuses the summary or first invalid field. | Correct fields or cancel. |
| Saving | Primary label becomes `Guardando…`; Save and duplicate state-changing actions are unavailable; entered values and editor orientation remain visible. | Form/action region uses `aria-busy="true"`; one polite `Guardando cambios…` status. Do not move focus or show optimistic success. | Wait for server outcome. Navigation that could discard changes remains guarded. |
| Saved | Non-interruptive inline message `Cambios guardados`; persisted baseline and list summary update; Save returns to unavailable until another edit. | Shared polite status; keep focus on the initiating Save control or logical action region. No toast that disappears before it can be reviewed. | Continue editing or return to Products. |
| Server validation | Visible error summary above the first editor group plus inline field messages; preserve values. | Summary receives programmatic focus only after submitted validation, uses a heading and links to invalid fields; each field uses `aria-invalid` and associated description. | Correct fields and resubmit. |
| Concurrent conflict | Blocking inline conflict region before editor groups: `Este producto fue actualizado en otra sesión. Recarga la información antes de guardar.` Local values remain visible but cannot overwrite silently. | Focus the conflict heading after the server outcome; announce as an error without technical/version identifiers. | Primary `Recargar producto`; secondary `Continuar revisando`. Reload warning states that local unsaved changes will be discarded. No automatic merge. |
| Product missing | Replace the editor form with `Este producto ya no está disponible para editar.` | Main outcome heading receives normal navigation focus through the page/skip contract; no database/deletion detail. | Primary `Volver a productos`. No retrying the stale save. |
| Unauthorized before editor load | Show the access gate, not a partially rendered editor. | Generic authorization outcome; no indication of credential/configuration existence. | Enter the approved code again. |
| Session expired during navigation | Access gate message: `Tu sesión administrativa terminó. Ingresa nuevamente.` | Polite-to-assertive treatment according to the access contract; focus the access heading or code field as the predictable recovery destination. | Re-enter approved access code. |
| Session expired during save | Access gate states `Tu sesión terminó y los cambios no se guardaron. Ingresa nuevamente para continuar.` Never claim success. | Announce the unsaved outcome once; do not include Product values or credential data in the message. | Reauthorize. Preservation/replay of local values remains subject to Security Architecture and cannot use URL or browser storage. |
| Save request failure | Inline editor-level error: `No pudimos guardar los cambios. Inténtalo de nuevo.` Preserve values and dirty state. | Announce once without stack, API, database or configuration detail; focus remains predictable. | `Reintentar` when safe, continue reviewing fields, cancel. |

## Field validation composition

- Required meaning uses a visible label plus text; placeholder and color are never
  the only cues.
- Inline error text appears directly after its control and is associated through
  `aria-describedby`. Invalid controls set `aria-invalid="true"`.
- A submitted form with multiple invalid fields renders one summary titled
  `Revisa los campos indicados` before the first editor group. Summary entries use
  the public field label and correction, and link/focus the corresponding field.
- Do not render a summary for a single field error until submission unless the
  existing shared form contract requires it.
- Server validation replaces or supplements the relevant client message without
  duplicating identical text. Backend remains authoritative.
- Dependency failures the editor cannot fix in V1 use an editor-level explanation
  rather than attaching an error to an unrelated field. The UI does not fabricate
  missing Variants, taxonomy approval or other governed state.
- On correction, remove an obsolete inline message without repeatedly announcing
  each valid keystroke.

## Unsaved-change protection

### Cancel/reset

Activating `Cancelar` with dirty values reveals an inline confirmation region in
the action area rather than requiring a new modal primitive:

- Prompt: `¿Descartar los cambios sin guardar?`
- Destructive confirmation: `Descartar cambios`.
- Safe continuation: `Seguir editando`.

Focus moves into the confirmation only because the maintainer explicitly invoked
Cancel. Confirming restores the current persisted baseline, clears validation and
save feedback, then returns focus to a predictable editor heading/action.
Continuing returns focus to the Cancel trigger.

### In-app navigation

`Volver a productos`, Product switching, session exit and other in-app navigation
use the same explicit discard warning while dirty. The requested destination is
remembered only in component memory for that confirmation interaction; it is not
written to a public URL or browser storage.

### Browser navigation

Reload, close and browser-level navigation may use the native `beforeunload`
warning only while dirty. The browser owns its wording. Remove the guard after a
confirmed save, explicit discard, session-expiry resolution or unmount.

## Conflict behavior

- A concurrent conflict never overwrites the newer persisted Product and never
  automatically merges fields in V1.
- `Recargar producto` requires an explicit second confirmation when local changes
  exist: `Recargar descartará tus cambios sin guardar.`
- `Continuar revisando` keeps local values visible for manual reference but does
  not re-enable unsafe Save against the stale baseline. The maintainer must reload
  before a later update attempt unless Backend defines another approved recovery.
- Do not expose revision IDs, timestamps used as concurrency tokens, internal
  actor identity or changed-field diffs unless separately approved.

## Status and visual treatment

- Success uses the semantic success role; validation/request/conflict outcomes
  use the semantic danger role; neutral dirty/saving guidance uses foreground or
  muted roles. Text and semantics remain authoritative.
- Feedback is inline and persistent until resolved, superseded by a newer
  submitted outcome, or dismissed through an approved action. Do not rely on
  ephemeral toast-only communication.
- Error and conflict regions may use the governed `error` Icon decoratively;
  success may use `success`. Icons never replace headings or messages.
- Action targets are at least 44 by 44 CSS pixels, visible focus is not clipped,
  and button labels wrap without horizontal overflow.
- At mobile widths and 200% zoom, actions stack in DOM order: Save, Cancel/confirm,
  then return navigation. A sticky treatment must become non-sticky if it obscures
  content or consumes excessive viewport height.

## Security and privacy boundary

- Feedback never echoes the six-digit code, internal API key, session token,
  sensitive Product values, raw request payload or internal error message.
- No unsaved form value, authorization state or recovery destination is persisted
  in query parameters, local storage, analytics or public notifications.
- UI validation improves correction but is not authorization or Product-rule
  enforcement.
- Unauthorized and expired outcomes fail closed to the access gate; the editor is
  not left interactable behind a client-only overlay.

## ADM-010 handoff checklist

- [x] Pristine, dirty, saving and server-confirmed success are distinct.
- [x] Field and multi-field validation preserve values and provide focus recovery.
- [x] Cancel, in-app navigation and browser navigation protect unsaved changes.
- [x] Conflict prevents silent overwrite and provides safe reload behavior.
- [x] Missing Product, unauthorized and expired-session outcomes fail closed.
- [x] Request failure preserves editable values and offers safe retry.
- [x] Status, Icons, focus, keyboard, touch target, zoom/reflow and light-only
  expectations are defined.
- [x] No security policy, Product field, Backend outcome or business invariant is
  invented by UI Design.

## ADM-012 approval

UI composition and its mobile, tablet, desktop, keyboard, zoom/reflow, touch
target, contrast-role and light-only expectations are now fully specified.
The UX/UI portion is approved in `design-review.md`, ADM-011 confirms existing
Design System composition is sufficient, Accessibility approval is recorded in
`accessibility-design-review.md`, and Product Requirements closed ADM-PR-UI-001
in `requirements-design-review.md`. ADM-012 is complete and this document is an
approved Frontend implementation handoff. Implementation evidence remains due
under ADM-032 and ADM-036.
