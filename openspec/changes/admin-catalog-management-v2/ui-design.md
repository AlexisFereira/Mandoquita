# Admin Catalog Management V2 — UI Design

Status: Catalog UX/UI and Accessibility Design Approved — Account Access Amended in Companion Artifact

Owner: UX/UI Designer

Date: 2026-07-13

## Dependency and task status

This artifact translates the approved Requirements, Architecture and UX Solution
into an implementation-ready responsive interface. Architecture explicitly
authorizes ACM-015 through ACM-018 to proceed in parallel. This design therefore
does not assume approval of a new shared component and uses native semantics plus
the released Admin, form, Button, status, media and light-only foundations.

| Deliverable | UX/UI status | Remaining external approval |
| --- | --- | --- |
| ACM-016 Responsive semantic Product table | Complete | ACM-015 is approved. |
| ACM-017 Access and Product/Category lifecycle flows | Complete with account amendment | Revised access/account behavior is authoritative in `account-management-ui-design.md`. |
| ACM-018 UX/UI accessibility self-review | Approved | Independent Accessibility Review completed in `accessibility-design-review.md`. |

## Global Admin composition

V2 preserves the isolated `/admin` shell, managed-edge boundary, `noindex` and
`no-store` behavior. The public Header, Footer, Search, catalog navigation and
contact actions never appear inside Admin. After authorization, the header uses:

1. `Mandoquita · Administración` as non-public product identity.
2. Primary navigation `Productos` and `Categorías`.
3. Optional orientation `Sesión: {usuario canónico}` when returned by the safe
   session representation.
4. `Salir` as a text-visible action.

`Productos` is the default destination. Current navigation uses text plus
programmatic current-page state, not color alone. Page content sits within the
existing 1280px maximum container with 16px horizontal gutters below 640px,
24–32px from 640px and 32px from 1024px. Forms use a 960px maximum, with a 720px
readable column for long help and validation.

All controls have a minimum 44 by 44 CSS-pixel target, use the global visible
focus treatment and preserve at least 8px separation between adjacent actions.
The interface is light-only and uses released semantic surface, text, border,
focus, status and danger roles. `Vigente`, `Retirado`, `Activo`, `Publicado`,
`Disponible comercialmente`, `Destacado` and `Visible` remain independent
textual states; no combined green/red status is introduced.

## Named username/password access — ACM-017

> Account-governance amendment: the measurements and generic security behavior
> below remain valid, but recovery wording, temporary-password restriction and
> authenticated destinations are superseded by
> `account-management-ui-design.md`. Frontend must not implement the former
> Deployment-managed recovery wording from this section.

### Access screen

The unauthenticated shell contains no authorized navigation or stale catalog
content. A standard surface of `min(100%, 480px)` contains:

1. Mandoquita administrative identity.
2. H1 `Acceso administrativo`.
3. `Ingresa con tu cuenta administrativa.`
4. Labelled `Usuario` field.
5. Labelled `Contraseña` field and optional show/hide control.
6. Primary full-width-on-mobile action `Ingresar`.
7. One persistent status/error region when an outcome exists.
8. Disclosure/action `No puedo acceder` with Superadministrator guidance.

The surface uses 24px padding below 640px and 32px from 640px. It remains in
normal document flow and scrolls when the viewport, keyboard, zoom or errors
reduce available height.

### Credential controls

- `Usuario` uses `autocomplete="username"`, supports paste and accepts the
  governed 3–64-character character boundary. Outer whitespace may be trimmed
  only on submission; typing is not rewritten or forced to lowercase.
- `Contraseña` uses one native password input with
  `autocomplete="current-password"`. It supports Unicode, spaces, paste,
  password managers and the governed 12–128-character range. It is never
  trimmed, normalized or transformed client-side.
- If included, the adjacent 44px text button alternates `Mostrar contraseña`
  and `Ocultar contraseña`, exposes pressed/state semantics, preserves the value
  and returns focus predictably. It does not reveal content by default.
- Enter submits the native form. Completion of either field never auto-submits.
- Credentials never enter a URL, browser storage, analytics, notifications,
  logs or error copy. The interface never offers remembered-login, registration,
  email/SMS reset, roles, legacy six-digit access or account discovery.

### Access state matrix

| State | Visible outcome | Interaction and focus |
| --- | --- | --- |
| Initial | Empty labelled fields and `Ingresar`. | Direct navigation may focus `Usuario`; password-manager population remains supported. |
| Locally incomplete | `Ingresa tu usuario y contraseña.` | Associate required field errors without evaluating account existence. |
| Verifying | `Verificando acceso`; button `Ingresando…`. | Form is busy; prevent duplicate submit; preserve username and masked password until response. |
| Generic denial | `No se pudo iniciar sesión. Revisa los datos o contacta al Superadministrador.` | Preserve username, clear password and focus password or the error summary under the released form-error pattern. |
| Temporary throttle | `No se puede intentar el acceso temporalmente. Intenta nuevamente más tarde.` | Follow safe server retry guidance; no client-authoritative countdown or threshold. |
| Access unavailable | `El acceso administrativo no está disponible en este momento.` | Fail closed; offer `Reintentar` only when server guidance permits it. |
| Session expired/revoked | `Tu sesión administrativa terminó. Ingresa nuevamente.` | Remove protected content, preserve no credentials and focus the access heading or username field. |
| Expiry with edits | Expiry copy plus `Los cambios no se guardaron.` | Do not claim recovery or replay of a mutation after sign-in. |
| Authorized | Open `Productos`. | Credentials disappear and are not reused as API credentials. |

`No puedo acceder` reveals: `Solicita al Superadministrador que restablezca tu
acceso.` It shows only a separately approved organizational contact; otherwise
it says `Contacta al Superadministrador de Mandoquita.` Loss of access to the
protected Superadministrator remains an emergency technical procedure outside
the application. This region contains no username check or reset form.

## ACM-016 — Responsive semantic Product table

### Page hierarchy

The authorized Products page uses this DOM and visual order:

1. H1 `Productos` with primary `Crear producto`.
2. Search region.
3. `Filtros` region/disclosure.
4. Applied-filter summary and `Limpiar filtros`.
5. Result count/current range and collection status.
6. Named horizontal table region containing one native Product table.
7. Pagination navigation.

Search uses the visible label `Buscar productos`; helper text must list only the
fields supported by the executable Backend contract. Submission and clearing
return to page 1. Filters retain the released independent Product states and
taxonomy context, plus `Ciclo de vida` with `Vigentes` as default and explicit
`Retirados` and `Todos`. Mobile/tablet use an `aria-expanded` filter disclosure;
desktop may keep the same explicit `Aplicar filtros` behavior to avoid
breakpoint-dependent submission.

Applied filters appear as removable text-labelled Chips in stable order. Each
remove action names field and value. Search, filters and page are retained on
edit/media round trips when still valid.

### Native table contract

Use exactly one native `<table>` at every viewport. Do not render Product Cards,
CSS grid rows, a duplicated mobile table or detached mobile action summaries.
The containing region has a visible heading/label, `tabindex="0"` when it
overflows, and associated instruction:

`Desplázate horizontalmente dentro de la tabla para consultar todas las columnas.`

Do not add `role="table"`, `role="row"` or `role="cell"` to native table
elements. The table provides:

- A caption such as `Productos vigentes. {x} resultados.`; dynamic filter
  context may be included concisely.
- One column-header row using `<th scope="col">`.
- Product name as `<th scope="row">` for each data row.
- Data and actions in cells belonging to that same row.
- No row-selection checkbox and no bulk action toolbar.

Column order and sizing:

| Column | Minimum width | Content |
| --- | ---: | --- |
| Producto | 224px | Name as row header; slug beneath as supporting text. |
| SKU base | 144px | Base SKU or approved disambiguating Variant reference. |
| Clasificación | 192px | Product Type plus inherited taxonomy context supplied by the read contract. |
| Estados | 248px | Separate wrapping text Badges for active, editorial, publication, commercial and featured outcomes. |
| Ciclo de vida | 120px | `Vigente` or `Retirado`. |
| Actualización | 168px | Understandable localized date/time. |
| Acciones | 200px | Row-bound text actions. |

The ordinary table minimum width is approximately 1,296px; the exact rendered
width may grow for translated content. Row cells use 12–16px vertical and 16px
horizontal padding, top alignment and visible row separators. Names, slugs, SKU
and taxonomy wrap; no meaningful value is ellipsized without an accessible way
to obtain it.

Row actions remain text-visible: `Editar {producto}`, `Administrar imágenes de
{producto}` and either `Retirar {producto}` or `Restaurar {producto}` according
to lifecycle. They may wrap vertically inside the cell. V2 does not require an
overflow menu; if Frontend proposes one later, Design System and Accessibility
must review its keyboard/focus behavior and row association.

### Responsive behavior

| Viewport | Composition |
| --- | --- |
| Mobile `<640px` | Page controls stack in one column. The table region is `width: 100%`, contains its own horizontal overflow and receives a visible focus indicator. No page-level horizontal scrolling occurs. The full table and row actions remain intact. |
| Tablet `640–1023px` | Search/actions may use two columns; filters disclose before labels compress. The same table scroll region remains available. |
| Desktop `≥1024px` | Search/filter/result context form one operational region. The table may fit or scroll within the container; no column disappears solely because of width. |
| 320px / 200% zoom | At least the named scroll region and a usable portion of the current cell are visible. Keyboard and pointer scrolling reach every cell/action; focus is never clipped or covered. |

Sticky Product or action columns are deliberately not required in V2 because at
320px they can cover usable content and focus. If implemented after validation,
they must disengage before overlap, preserve reading order and never obscure the
focused cell. Horizontal overflow belongs only to the labelled table region;
the H1, filters, results and pagination remain stationary in page flow.

### Collection states and pagination

| State | Presentation |
| --- | --- |
| Loading | Keep page purpose and known criteria visible; table body may show stable non-interactive rows with no fabricated Product data/actions and the collection marked busy. |
| Results | Caption, range, complete current page and bounded pagination. |
| No Products | `No hay productos para administrar.` plus `Crear producto`. |
| No matches | `No hay productos que coincidan con los criterios actuales.` Preserve criteria and offer clearing them. |
| Request failure | `No pudimos cargar los productos.` Preserve criteria and offer `Reintentar`. |
| Expired session | Replace protected table content with the named access journey. |

Pagination is a labelled navigation region with visible `Anterior`/`Siguiente`,
44px targets, current-page text/`aria-current` and retained valid criteria. If a
retirement removes the last row on a page, use the closest valid page and
announce the new result range without moving focus unexpectedly.

## Product create, edit, retire and restore — ACM-017

### Create Product

The route uses `Volver a productos`, eyebrow `Nuevo producto`, H1 `Crear
producto`, one explanatory panel and one form. The panel appears before fields:

`Al crear el producto también se creará una variante base con el SKU indicado.
El producto quedará inactivo, sin aprobar, sin publicar, no disponible
comercialmente y no destacado.`

The form contains exactly these initial inputs:

| Field | UI contract |
| --- | --- |
| Nombre | Required text Input; helper and maximum from the executable Product contract. |
| Slug | Required text Input; visible public-path context and approved format guidance; uniqueness is server-confirmed. |
| Precio del producto | Required decimal input with numeric keyboard hint; value must be positive and remains Product-level, not Variant price. |
| Moneda | Required three-letter currency input or approved select; display the canonical three-letter value without silently choosing one. |
| SKU base | Required text Input; helper `Identifica la variante base y debe ser único.` Never derive it from name or slug. |

There is no Product Type, description, media, Variant attributes, publication or
Featured control in the minimum creation form. Those are optional follow-up
work after the atomic Product/Base Variant result.

Actions are `Cancelar` and primary `Crear producto`. While saving, preserve all
values, mark the form busy, change the label to `Creando…` and prevent duplicate
submission. Confirmed success announces `Producto creado`, opens its editor and
offers `Completar contenido`, `Asignar tipo de producto`, `Administrar imágenes`
and `Volver a productos` as non-automatic next actions.

Field validation appears inline and a submitted multi-error summary links to the
first invalid field. Duplicate slug and SKU identify only the corresponding
submitted field. Failure says `No se creó el producto` and preserves correctable
values; it never displays a partial Product or Base Variant.

### Edit Product

The V2 editor extends the released Product Admin grouping instead of replacing
or duplicating it. Page orientation is:

1. `Volver a productos` with retained collection context.
2. Eyebrow `Editar producto`, Product H1 and slug.
3. Separate lifecycle Badge `Vigente` or `Retirado`.
4. Read-only Product/Variant readiness and last-update context.
5. Form error/status summary.
6. Released identity, content, merchandising, commercial, publication,
   discovery, taxonomy and SEO groups.
7. Link `Administrar imágenes` to the released media capability.
8. Sticky-within-page action region only when it does not cover content/focus.
9. Separate `Ciclo de vida` region after ordinary editing actions.

`Guardar cambios` is available only for valid dirty values; `Cancelar` restores
the confirmed baseline. A changed slug adds an inline warning before save:
`La URL anterior seguirá funcionando como alias y el slug anterior permanecerá
reservado.` Save never frees or silently rewrites a slug.

Success announces `Cambios guardados`, updates the confirmed baseline and
returns focus to the editor status/heading without resetting scroll arbitrarily.
Validation preserves values. Conflict shows `Este producto cambió en otra
sesión. Tus cambios no se guardaron.` and primary recovery `Recargar producto`;
warn that reload discards local edits and never merge automatically.

Media remains a separate released flow. Leaving the Product form for media
triggers the ordinary unsaved-change decision if scalar edits exist; media work
does not silently save or discard Product form values.

### Retire Product

Use `Retirar producto`, never `Eliminar definitivamente`. The danger action is
outside `Guardar cambios` and opens an inline confirmation or independently
validated native dialog titled `Retirar {producto}`. Its impact list states:

- `Dejará de aparecer en experiencias públicas.`
- `Quedará inactivo, no publicado y no disponible comercialmente.`
- `Dejará de estar destacado y se eliminará su orden destacado.`
- `Se conservarán su identidad, contenido, variantes, imágenes, auditoría y
  slugs actuales e históricos.`
- `Podrá restaurarse después, sujeto a las validaciones vigentes.`

Actions are safe `Cancelar` then danger `Retirar producto`. Cancel receives
initial focus; dismissal never confirms. The Product remains visible until
server confirmation. Pending state prevents duplication. Success announces
`Producto retirado`, returns to the nearest valid `Vigentes` page and offers
`Ver productos retirados`. Failure says `El producto no fue retirado`; conflict
requires reload/review.

### Restore Product

`Restaurar producto` appears only for a retired Product. Its confirmation says:
`El producto volverá a Vigentes, pero permanecerá inactivo, no publicado, no
disponible comercialmente y no destacado.` Actions are `Cancelar` and
`Restaurar producto`. Success announces `Producto restaurado` and uses the
confirmed safe states. Uniqueness/integrity failure leaves it retired and names
only the safe correctable condition; stale restoration requires reload.

## Category collection and lifecycle — ACM-017

### Category collection

`Categorías` is a peer Admin destination with primary `Crear categoría`, a
labelled search/find region, lifecycle filter defaulting to current Categories,
result context and bounded pagination when required. It never mixes Products or
offers taxonomy-version controls.

Use one native Category table because name, order and dependency counts are
relational operational data. It follows the same labelled overflow-region and
native header/row-header rules as Products, but is not constrained to the
Product column contract. Recommended columns are:

| Column | Minimum width | Content |
| --- | ---: | --- |
| Categoría | 208px | Name as row header; slug and taxonomy context beneath. |
| Orden | 96px | Confirmed collection position. |
| Estados | 176px | Independent Active, Visible and lifecycle text states. |
| Dependencias | 240px | Explicit Subcategories, Product Types and Products counts. |
| Imagen | 144px | 64px preview or `Sin imagen`; image is not the row identity. |
| Acciones | 224px | Edit, media and eligible retire/restore actions. |

The same table persists at mobile and zoom; only its named region scrolls. A
dependency-blocked row does not offer an enabled retire action. It exposes text
`No se puede retirar: tiene elementos asociados` plus the nonzero counts.

Loading, no Categories, no matches, request failure, expiry and pagination use
the Product collection patterns with Category-specific copy. `No hay categorías`
offers creation; empty public discovery is never represented as an Admin error.

### Create Category

The form contains required `Nombre`, required `Slug` and optional multiline
`Descripción`. A pre-submit information panel states:

`La categoría se agregará al final de la taxonomía activa como inactiva y no
visible. Podrás agregar una imagen después de crearla.`

System identity, taxonomy version and generated order are not inputs. Actions
are `Cancelar` and `Crear categoría`. Saving preserves values and prevents
duplicates. Success announces `Categoría creada`, opens the editor and offers
`Agregar imagen` through released Category media. Media failure can never change
the already confirmed creation result.

Duplicate/invalid slug associates with its field and states that no Category was
created. No alternative slug is generated automatically.

### Edit Category

The editor identifies Category name, slug and `Vigente`/`Retirada`, then contains:

1. `Información`: Name, slug and description.
2. `Organización`: labelled `Posición en la colección` control and current
   position/context; the server's governed range is authoritative.
3. `Estado y visibilidad`: separate Active and Visible controls with explanatory
   text; neither infers the other.
4. `Imagen`: current preview/`Sin imagen` and `Administrar imagen` link to the
   released media capability.
5. `Dependencias`: read-only counts for Subcategories, Product Types and
   Products.
6. Standard save/cancel and a separate lifecycle region.

The order field presents one intended position; it does not display or permit a
duplicate confirmed order. It remains `Orden sin guardar` until the complete
affected collection outcome is server-confirmed. Collision/stale response offers
`Recargar categoría`; no client-side reorder repair occurs.

A slug edit uses the same permanent-alias/reservation warning as Product. Save
cannot claim changes to taxonomy identity/version, descendants or dependents.
Validation, dirty-state, missing resource, service failure, conflict and session
expiry follow the Product patterns with Category-specific copy.

### Retire Category

Always render a `Retiro de categoría` region with the three current dependency
counts. When any count is nonzero, show an associated danger explanation:

`Esta categoría no se puede retirar porque tiene elementos asociados.`

List each nonzero count. The retire control is absent or disabled with the reason
programmatically associated; do not open an impossible confirmation. Governed
review links may be shown, but no cascade, reassignment or bypass exists.

When all counts are zero, `Retirar categoría` opens confirmation titled
`Retirar {categoría}`. It states that the Category becomes inactive and not
visible while retaining identity, description, Image, order/history, audit and
slug ownership; no media or taxonomy record is physically deleted; later
restoration remains subject to current rules. Actions are `Cancelar` then danger
`Retirar categoría`.

If a dependency appears during confirmation, keep the Category, close or update
the confirmation, focus the dependency explanation and announce `La categoría
no fue retirada porque ahora tiene elementos asociados.` Offer `Recargar
categoría`. Success announces `Categoría retirada` and offers `Ver categorías
retiradas`.

### Restore Category

Only a retired Category exposes `Restaurar categoría`. Confirmation explains:
`La categoría volverá a Vigentes, pero permanecerá inactiva y no visible.` It
also states that identity and Image are preserved. Success uses the confirmed
safe state. Slug/integrity failure leaves it retired; no slug is reassigned and
no public visibility is inferred.

## Shared form, confirmation and recovery contracts

### Forms and dirty state

- Every field has a persistent visible label; required state, helper and error
  are programmatically associated. Placeholder is never the label.
- Use one semantic fieldset/legend for related state choices. A Switch is not
  required; native checkbox/select composition may express approved booleans.
- Short related fields may use two columns only from 768px while each retains at
  least 280px. All fields stack below that threshold.
- Submitted multiple errors produce a focused error summary with links to fields.
  Client validation improves correction but never authorizes a mutation.
- Save/submit status uses one polite region; blocking server errors use alert
  semantics once. Success is announced only after the returned baseline.
- Dirty navigation offers `Seguir editando` and `Descartar cambios`. Browser
  close/reload may use its standard warning. A lifecycle confirmation cannot
  silently discard a separate dirty form.

### Destructive confirmation and focus

Inline confirmation is the default composition and avoids depending on a new
shared Modal. If a native/modal dialog is approved, it must receive focus, keep
focus within it, support Escape as Cancel and return focus to the invoker when
the invoker survives. The safe action has initial focus; overlay click or dialog
dismissal never confirms. Pending mutation preserves context and prevents a
second submit.

After confirmed retirement, focus moves to the collection result heading/status
because the invoking row may no longer exist. After cancellation/failure, focus
returns to the invoking lifecycle action. Restoration follows the same rule.

### Outcome matrix

| Outcome | Message principle | Recovery |
| --- | --- | --- |
| Validation/duplicate | Identify only submitted fields; no internal constraint names. | Preserve values and link summary to fields. |
| Saving | Neutral entity-specific progress; no optimistic persistence. | Prevent duplicate mutation and guard navigation. |
| Confirmed | Announce exact created/saved/retired/restored result. | Establish returned baseline and logical focus destination. |
| Conflict | Resource changed elsewhere; local outcome not saved. | Warn, then explicit reload/review; no automatic merge. |
| Dependency denial | Category and dependents unchanged; show current safe counts. | Reload or governed review destination; no cascade. |
| Missing resource | Neutral unavailable message. | Return to the relevant collection preserving safe criteria. |
| Throttled mutation | Safe temporary retry guidance. | Preserve values while authorization remains valid. |
| Service failure | Last confirmed state remains authoritative. | One safe retry or return action; no API/database detail. |
| Session expiry | Session ended; changes not saved. | Named access; do not replay mutation. |

## Responsive and accessibility self-review — ACM-018

- One native Product table exists at all widths. Caption, column headers, Product
  row headers, cells and row actions preserve programmatic relationships; no
  Card-based Product row or duplicate mobile DOM exists.
- The table overflow container, not the page, is keyboard scrollable and named.
  Its instruction precedes it, its focus ring is visible and every cell/action
  remains reachable at 320 CSS pixels and 200% zoom.
- Natural Tab order reaches page controls, overflow region, row actions and
  pagination. Arrow keys are not hijacked to simulate a grid; native reading and
  scrolling behavior remains available.
- Username/password fields have programmatic labels, correct autocomplete,
  paste/password-manager support and generic failure. Values never appear in
  status or persistent browser state.
- Submitted error summaries link to invalid fields. Passive loading and result
  updates do not steal focus. Conflict/reload and destructive outcomes have
  explicit surviving focus destinations.
- Retirement confirmation names immediate public effects and retained data,
  distinguishes retirement from physical deletion, gives safe Cancel initial
  focus and never confirms on dismissal.
- Category dependency denial is visible, programmatically associated and names
  nonzero counts; it never relies on disabled opacity or color alone.
- Every interactive target is at least 44 by 44px. Focus, text, border, status
  and danger colors use the released light-only AA roles; state always includes
  text or semantics.
- Forms, summaries, dialogs, errors and page actions reflow without page-level
  horizontal scrolling at 320px, 200% zoom and supported text spacing. Only the
  explicitly named data-table region may scroll horizontally under the approved
  table exception.
- No content or action requires hover, drag or fine pointer control. Reduced
  motion removes nonessential transitions without hiding status.
- Current Administrator orientation never leaks into public content. No secret,
  password, session/CSRF value, hash, pepper or internal account state is
  rendered.

UX/UI self-review is complete with no unresolved design decision. Accessibility
independently approved this specification and the Design System decision in
`accessibility-design-review.md`; ACM-018 is complete.

## Handoff and approval boundary

This artifact, Requirements, Architecture, UX Solution,
`account-management-ui-design.md` and the approved Design System/Accessibility
reviews authorized ACM-025 through ACM-030. Frontend and Backend implementation
are now recorded complete; ACM-031 through ACM-035 remain the independent
Security, QA and post-implementation Accessibility gates. Any requested Product
Cards, bulk actions, self-service recovery, physical purge, cascade,
configurable role management or duplicated media ownership requires a new
approved scope decision.
