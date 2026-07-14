# Admin Catalog Management V2 — UX Solution

Status: UX Ready — Account Governance Amendment Included

Owner: UX Solution Architect

Date: 2026-07-13

## Experience Goal

Give named Administrators an efficient and accountable way to maintain the
Product and Category lifecycle, and give the single protected Superadministrator
a safe way to govern Administrator access, while preserving the isolated Admin
perimeter, existing catalog invariants and public discovery behavior.

V2 replaces the shared six-digit gate. It does not add public accounts,
self-service recovery, configurable roles, additional Superadministrators or
physical deletion.

## Experience Principles

1. **Named access, generic failure.** The successful session belongs to one
   Administrator, while failed access never reveals account existence or state.
2. **Operational collections remain scannable.** Products use one semantic data
   table at every viewport, with explicit search, filters, paging and row context.
3. **Create safely, publish deliberately.** New resources begin in the approved
   non-public state and never infer eligibility transitions.
4. **Retirement is not erasure.** Destructive presentation names the immediate
   public effects and the retained data before confirmation.
5. **Dependencies are visible before action.** Category retirement never offers
   cascade or hides the relationships that block it.
6. **Server confirmation is authoritative.** Optimistic previews and local
   changes never claim persistence, retirement or restoration before confirmation.

## Scope and Continuity

Included:

- Username/password access for provisioned Administrators.
- Generic invalid, throttled, unavailable, recovery and expired-session journeys.
- Mandatory password replacement after Administrator creation, reset or
  reactivation.
- Superadministrator-only Administrator list, create, password reset,
  deactivation and reactivation.
- Product semantic table, search, filters, pagination and individual row actions.
- Product create, edit, retire and restore.
- Category collection, create, edit, dependency-protected retire and restore.
- Existing Product and Category media administration as linked, governed flows.
- Validation, duplicate, concurrency, missing-resource and service recovery.

Excluded:

- Public or self-service registration, password recovery or account discovery.
- Configurable roles/permissions, additional Superadministrators, promotion,
  demotion, MFA, social login or customer accounts.
- Browser bootstrap or emergency recovery of the protected Superadministrator.
- Bulk mutation, import/export, spreadsheet editing or physical purge.
- Variant matrix management beyond the required Base SKU at Product creation.
- Taxonomy-version management or dependency cascade.
- A second upload, Image ownership or media-library model.

## Information Architecture

```text
/admin
├── Named access
└── Authorized administration
    ├── Products
    │   ├── Product table
    │   ├── Create Product
    │   ├── Edit Product
    │   ├── Product media (released capability)
    │   ├── Retire Product
    │   └── Restore Product
    ├── Categories
    │   ├── Category collection
    │   ├── Create Category
    │   ├── Edit Category
    │   ├── Category media (released capability)
    │   ├── Retire Category
    │   └── Restore Category
    ├── Administrator accounts (Superadministrator only)
    │   ├── Account collection
    │   ├── Create Administrator
    │   ├── Reset password
    │   ├── Deactivate Administrator
    │   └── Reactivate Administrator
    ├── Mandatory password replacement (restricted temporary session)
    └── Exit session
```

`Products` remains the default authorized destination. `Categorías` is a peer
administrative destination, not a public taxonomy page. Create/edit destinations
retain a clear return path and restore the previous collection query, filters and
page when possible.

Admin routes remain absent from public Header, Footer, Search, Sitemap and
catalog navigation and preserve noindex/no-store behavior.

`Cuentas de administradores` appears only for the authenticated
Superadministrator. A regular Administrator never sees an unavailable, hidden or
disabled imitation of this destination. A temporary-password session exposes
only password replacement and `Salir`; it does not render catalog or account
navigation beneath a disabled layer.

## Named Access Journey — ACM-012 / ACM-040 Amendment

### Access screen

The isolated screen contains:

1. Mandoquita administrative identity.
2. Heading `Acceso administrativo`.
3. Brief instruction for provisioned Administrators.
4. Labelled `Usuario` field.
5. Labelled `Contraseña` field.
6. Primary action `Ingresar`.
7. Generic status/error region.
8. Non-interactive locked-out guidance to contact the Superadministrator.

The former six-digit field is absent. Legacy sessions reaching V2 return to this
screen and must not be silently upgraded.

### Username behavior

- Accept the governed 3–64-character username form and trim accidental outer
  whitespace on submission.
- Do not visually force lowercase or rewrite the Administrator's entry while
  typing; server normalization is authoritative.
- Support browser and password-manager username autofill.
- Do not reveal whether a submitted username exists, is disabled or is locked.
- Do not place username in URLs, analytics or public error content.

### Password behavior

- Use one labelled password field supporting 12–128 characters, Unicode, spaces,
  paste and password managers.
- Do not impose composition hints that contradict the approved policy.
- A show/hide control, if used by Design, has a persistent accessible name/state
  and does not alter the password value.
- Do not trim, normalize or transform the visible password client-side in a way
  that changes the submitted credential.
- Never persist the password in browser storage, URL state, notifications,
  analytics or client logs.

### Submit and loading

- `Ingresar` submits the pair through the server boundary and prevents duplicate
  submission while pending.
- Retain the username for convenient correction after a failed attempt; clear the
  password.
- Loading copy is neutral: `Verificando acceso`.
- Successful access opens `Productos` only when the account has no mandatory
  password replacement. A temporary credential opens the restricted replacement
  journey instead; the credential pair is not reused as an ongoing API credential.

### Invalid, disabled or locked account

Unknown username, incorrect password, disabled account and account-side lock use
the same outcome:

`No se pudo iniciar sesión. Revisa los datos o contacta al Superadministrador.`

The screen does not identify which field or account condition failed. Focus
returns to the password field or error summary under the approved form-error
pattern, and another attempt is permitted only when the server allows it.

### Temporary throttle

- Explain that access cannot be attempted temporarily without identifying the
  username/account condition or exact security thresholds.
- Use safe server guidance for when to retry; do not implement a client-only
  countdown as authorization.
- Keep fields operable for correction, but prevent repeated submission until the
  governed retry boundary when known.
- A client/source throttle and an account-side throttle remain visually
  indistinguishable.

### Recovery

`No puedo acceder` reveals guidance, not a reset form:

- An Administrator who lost access is directed to the Superadministrator.
- The interface may show only the approved organizational contact instruction;
  when none is configured, use `Contacta al Superadministrador de Mandoquita.`
- Never claim to email/text a reset, reveal an existing password, validate a
  username or create an account.
- Loss of access to the single protected Superadministrator is explicitly an
  emergency Deployment journey outside the application.

### Access unavailable

If required session, account, throttle, edge or audit services are unavailable,
show `El acceso administrativo no está disponible en este momento.` Provide a
safe retry when allowed and never fall back to shared code or an unprotected
catalog experience.

### Session behavior and expiry

- A successful login creates the temporary server session and may identify the
  current canonical Administrator username in the Admin header for orientation.
- `Salir` revokes the current session and returns to named access.
- Idle or absolute expiry returns to named access with
  `Tu sesión administrativa terminó. Ingresa nuevamente.`
- Expiry with local edits adds `Los cambios no se guardaron.`
- After login again, return to the last safe Admin destination only when it does
  not replay a mutation or expose stale sensitive state; otherwise open Products.
- Credential reset or account disablement produces the same ended/unauthorized
  session journey and never explains the account's private operational state.

## Mandatory Password Replacement — ACM-040

### Entry and restricted orientation

An Administrator enters this journey immediately after successful access with a
temporary password assigned during creation, reset or reactivation.

The page contains only:

1. Heading `Reemplaza tu contraseña`.
2. Explanation that the temporary password cannot be used for catalog work.
3. Approved password-policy guidance.
4. Labelled new-password and confirmation fields; re-entry of the temporary
   credential appears only if required by the approved Backend fresh-auth
   contract.
5. Primary action `Guardar nueva contraseña`.
6. `Salir`.
7. Validation/status region.

Products, Categories and Administrator accounts are absent. The interface does
not suggest that those areas are merely visually disabled or accessible through
a direct URL.

### Password behavior

- New password and confirmation accept 12–128 characters, Unicode, spaces,
  paste and password managers.
- Help states the approved length and recommends a unique password without
  imposing uppercase, number, symbol or periodic-change rules.
- Show/hide controls, when present, independently name the field and current
  visibility state.
- Confirmation mismatch is local field validation; common, compromised or
  username/service-specific rejection remains server-authoritative.
- The temporary, new and confirmation values never appear in the URL, status,
  success copy, analytics, logs or browser storage.

### Submit and outcomes

- Pending submission preserves orientation, prevents duplicates and does not
  expose catalog navigation.
- Success announces `Contraseña actualizada` and establishes the new confirmed
  session boundary before opening `Productos`.
- Validation preserves safe local input, links errors to fields and does not
  reveal the password in a summary.
- An expired, revoked or concurrently reset temporary session returns to named
  access with `Tu acceso temporal terminó. Solicita una nueva contraseña al
  Superadministrador.`
- Service failure states that the password was not confirmed and offers a safe
  retry while the temporary session remains valid.
- `Salir` revokes the restricted session and clears the form.

## Administrator Account Management — ACM-040

### Authorization and entry

- Only the authenticated Superadministrator sees `Cuentas de administradores` in
  Admin navigation.
- A regular Administrator who reaches the destination directly receives a
  neutral `No tienes acceso a esta sección` outcome and a return to `Productos`;
  no account names, counts or states are exposed.
- The destination never offers creation/promotion of another Superadministrator,
  role editing or a permission matrix.
- Account mutations require fresh Superadministrator authorization. When the
  Backend requests it, the UI inserts a focussed `Confirma tu contraseña`
  challenge before final submission, never stores that credential and returns to
  the intended confirmation only after success.

### Account collection

The destination prioritizes:

1. Heading `Cuentas de administradores`.
2. Explanation of the fixed Superadministrator/Administrator boundary.
3. Primary action `Crear administrador`.
4. One semantic account table.
5. Collection status and recovery.

Each row exposes only approved safe information:

- username as row identity;
- fixed visible role (`Superadministrador` or `Administrador`);
- access state (`Activo` or `Desactivado`);
- credential state such as `Debe reemplazar contraseña`, when applicable; and
- permitted row actions.

No current, historical or temporary password, password-change value, session
token or security implementation field is shown. The protected
Superadministrator row has no reset, deactivate, delete, demote or role-edit
action and includes visible text `Cuenta protegida` where action absence needs
explanation.

An account collection with no Administrator rows is valid; the protected
Superadministrator remains identifiable and `Crear administrador` is available.
Loading rows are non-interactive. A request failure reveals no account data and
offers safe retry. An expired/revoked Superadministrator session follows named
access.

### Responsive account table

- Preserve native table caption, headers, row headers and cell relationships at
  every viewport.
- At 320 CSS pixels and 200% zoom, place only the table in a named horizontal
  scroll region; do not convert accounts into Cards or duplicate mobile DOM.
- Row actions remain associated with their username. If grouped in a menu, each
  action has a distinguishable accessible name and focus returns to the row after
  cancel or non-removing outcomes.
- Role and state use visible text, not icon/color alone.

## Create Administrator

### Form and review

`Crear administrador` contains:

- labelled unique username;
- labelled temporary password;
- temporary-password confirmation; and
- read-only role `Administrador`.

The form explains before submission that the account will be active, the
temporary password must be replaced at first access and the role cannot be
configured. The Superadministrator must transfer the temporary credential only
through the approved private channel because the application will not display or
recover it after confirmation.

### Confirmation and outcomes

1. Validate username and password policy without account enumeration outside the
   authorized collection.
2. Complete fresh authorization when required.
3. Activate `Crear administrador` once.
4. On confirmation, announce `Cuenta creada para [usuario]` and
   `Debe reemplazar su contraseña al ingresar` without echoing the credential.
5. Return focus to the new table row or success heading.

Duplicate username or stale collection state preserves correctable username
context but clears sensitive password fields. General failure says the account
was not created. The UI never generates a different username, creates a partial
account or offers Superadministrator as a role choice.

## Reset Administrator Password

- Reset is available only for an active `Administrador`, never the protected
  Superadministrator or a deactivated account.
- The journey identifies the target username and requires a new temporary
  password plus confirmation.
- Confirmation explicitly states that every active target session will end,
  the prior credential will stop working and the target must replace the new
  temporary password before catalog access.
- Complete fresh Superadministrator authorization when required, then use
  `Restablecer contraseña`.
- Success announces `Contraseña restablecida para [usuario]` and
  `Sus sesiones anteriores terminaron`; it never displays the new credential.
- Validation/conflict clears password values, preserves the current account
  baseline and requires review before retry.
- If the account became deactivated, offer the separate reactivation journey;
  do not silently enable it through reset.

## Deactivate Administrator

- The action is `Desactivar acceso`, not physical deletion.
- Confirmation identifies the Administrator and explains that all active sessions
  end immediately, the username and audit attribution are retained, and the
  account may later be reactivated with a new temporary password.
- Complete fresh authorization when required and confirm with
  `Desactivar administrador`.
- Success announces `Acceso desactivado para [usuario]`, updates the row state and
  removes reset/deactivate actions.
- A concurrent change or stale baseline cannot deactivate an unreviewed state;
  reload the account collection.
- The protected Superadministrator never exposes this action. A server rejection
  of any self-target attempt preserves the account and returns focus to the
  protected row explanation.

## Reactivate Administrator

- Reactivation is available only for `Desactivado` Administrator rows.
- The form requires a new temporary password and confirmation; no previous
  credential or session is restored.
- Confirmation states that the account will become active but cannot access the
  catalog until it replaces the temporary password.
- Complete fresh authorization when required and activate
  `Reactivar administrador`.
- Success announces `Cuenta reactivada para [usuario]` and marks
  `Debe reemplazar contraseña` without echoing the credential.
- Duplicate, conflict, authorization or service failure leaves the account
  deactivated and clears password fields before retry.

## Account Management Recovery and Focus

- **Concurrent mutation:** never merge account state; reload the collection and
  review the current enabled/credential state.
- **Fresh authorization failure:** use a generic credential outcome, preserve the
  target/action context but clear all password fields.
- **Superadministrator session expiry:** cancel the mutation, clear credentials
  and return to named access without claiming success.
- **Target missing:** remove no other row, announce that the account is no longer
  available and focus the collection heading.
- **Throttled/unavailable service:** retain non-sensitive orientation, clear
  credentials and provide safe retry guidance.
- **Success after row-state change:** focus the updated row/status; if a filtered
  view removes it, focus the result summary.
- Destructive/credential confirmations receive focus, contain it while active,
  and restore focus to the initiating row action after cancel.

## Product Collection Journey — ACM-013

### Table hierarchy

The Products destination prioritizes:

1. Heading `Productos` and primary action `Crear producto`.
2. Search and filters.
3. Applied-filter summary and result count/current range.
4. One semantic Product data table.
5. Pagination.
6. Collection status and recovery.

The table caption identifies its purpose and current filtered context. Each row
has Product name as its row identity and exposes, subject to the approved read
contract:

- name;
- slug;
- Base SKU or disambiguating Variant reference;
- Product Type / taxonomy context;
- Product active, editorial, published, commercial and featured states;
- lifecycle state (`Vigente` or `Retirado`);
- last update;
- individual row actions.

Secondary columns may be progressively disclosed by Design, but every approved
field and row action remains reachable and retains its table relationship.
Product Cards are not used as table rows at any viewport.

### Responsive semantic-table behavior

- The `<table>` relationship, caption, column headers, row header and cells remain
  programmatic at desktop, tablet, mobile, 320 CSS pixels and 200% zoom.
- At constrained width, the table sits in a keyboard-scrollable horizontal region
  with an accessible name and concise instruction that more columns follow.
- Horizontal scrolling applies only to the table region, not the whole page.
- Product name remains the row header; actions remain in the same row and are not
  detached into Card-like summaries.
- Sticky identity/action treatment may be used only when it does not cover
  content, focus indicators or reduce the usable 320px region.
- Row actions use distinguishable names such as `Editar [producto]`; a menu, if
  used, preserves keyboard order, focus return and the row association.
- No duplicated mobile table DOM or visual-only column order may change reading
  order.

### Search and filters

- One labelled `Buscar productos` field uses only fields approved by the Backend
  contract; its help text names those fields rather than implying hidden search.
- Submission, clearing and paging preserve one stable collection destination.
- Applied filters remain visible, removable individually and resettable with
  `Limpiar filtros`.
- Filters cover the approved independent Product states and taxonomy context.
- Lifecycle defaults to `Vigentes`; `Retirados` and `Todos` are explicit choices.
- Changing search/filter returns to the first applicable page.
- Search/filter never mutates a Product or public Search behavior.

### Pagination and return context

- Use explicit bounded pages, not infinite scroll.
- Show current range and total when approved data provides it.
- Preserve search, filters and page on edit/media round trips when possible.
- If retirement removes the current page's final row, move to the nearest valid
  page and announce the updated result range.

### Collection states

- **Loading:** preserve heading and known controls; placeholder rows are
  non-interactive and contain no fabricated Product data.
- **No Products:** explain that none exist and offer `Crear producto`.
- **No matches:** preserve criteria and offer clearing search/filters.
- **Request failure:** preserve criteria, explain that Products could not load
  and offer retry without API/database detail.
- **Expired authorization:** use the shared session-expiry journey.

## Create Product

### Minimum creation form

The create destination is titled `Crear producto` and contains exactly the
required initial identity/commercial fields:

- Name.
- Unique slug.
- Positive Product-level price.
- Three-letter currency.
- Globally unique Base SKU.

Product Type, descriptions and media are presented as optional follow-up work,
not hidden requirements. The form explains before submission:

- one Base Variant will be created with the supplied SKU;
- no Variant attributes/options will be fabricated; and
- the new Product will be inactive, unapproved, unpublished, commercially
  unavailable and not featured.

### Create behavior

1. Enter the required values.
2. Review field-level validation.
3. Activate `Crear producto` once.
4. While saving, preserve entries and prevent duplicate submission.
5. On confirmation, announce `Producto creado` and open the new Product editor.
6. Present optional next actions: complete content, assign Product Type, manage
   images or return to Products.

Creation never implies publication. Product and Base Variant are one confirmed
outcome: if slug, SKU or another requirement fails, the interface says no Product
was created and retains correctable values.

### Create validation and duplicates

- Associate invalid name, slug, price, currency and Base SKU outcomes with their
  fields and summarize multiple errors after submission.
- Duplicate slug or SKU identifies the conflicting submitted field without
  exposing unrelated Product internals.
- A concurrent uniqueness conflict offers correction and resubmission; it never
  silently changes slug/SKU or creates a partial draft.
- Unexpected or service failure preserves values and states that creation was not
  confirmed.

## Edit Product

The V2 Product editor reuses the approved Product Admin V1 grouping and released
Catalog Media Admin navigation. It adds lifecycle orientation and must not merge
independent Product states into one generic status.

### Orientation and groups

- Identify Product name, current slug and `Vigente`/`Retirado` lifecycle.
- Keep identity, content, merchandising, commercial information, publication and
  discovery, taxonomy and SEO groups distinct.
- Expose `Administrar imágenes` through the released media capability.
- Explain governed dependencies the editor cannot repair, such as missing Product
  Type or invalid Variant eligibility, without fabricating them.

### Slug change

Before saving a changed slug, explain that the old public URL remains an alias
and the old slug cannot be assigned to another resource. Do not describe this as
deleting or freeing the previous URL.

### Save and recovery

- `Guardar cambios` is enabled for valid dirty values and prevents duplicate
  submission.
- `Cancelar` restores the confirmed baseline.
- Internal navigation/reload with changes requires unsaved-change confirmation.
- Success announces `Cambios guardados`, updates table summary and establishes a
  new concurrency baseline.
- Validation preserves entered values and links summary errors to fields.
- A stale baseline never merges or overwrites: offer `Recargar producto`, warn
  that local edits will be discarded, then require review before retry.
- Missing Product returns to the table with a neutral unavailable message.
- Session expiry never claims persistence.

## Retire Product

The row/editor action is labelled `Retirar producto`, not `Eliminar
definitivamente`.

### Confirmation hierarchy

The destructive confirmation identifies the Product and states that retirement:

- removes it from public discovery;
- makes it inactive, unpublished and commercially unavailable;
- removes Featured placement and clears Featured order;
- retains Product identity, content, Variants, Images, audit history and reserved
  current/historical slugs; and
- can later be explicitly restored, subject to current validation.

Actions are `Cancelar` and `Retirar producto`. The confirmation does not offer
cascade, storage deletion or physical purge.

### Outcome

- Pending state prevents duplicate confirmation and keeps focus in context.
- Success announces `Producto retirado` and removes it from default `Vigentes`
  results; provide `Ver productos retirados` as a navigation recovery.
- A conflict closes or updates the confirmation, preserves the newer state and
  requires Product reload/review.
- A failure states that the Product was not retired.
- Repeating an already completed retirement resolves to the confirmed retired
  state without presenting a second destructive effect.

## Restore Product

- Restore is available only in the retired collection/editor and is labelled
  `Restaurar producto`.
- Confirmation explains that restoration retains the Product as inactive,
  unpublished, commercially unavailable and not featured; it is not a publish
  action.
- On confirmation, the Product returns to `Vigentes` with its safe states and
  preserved content/relationships.
- Uniqueness or integrity failure identifies the condition requiring correction
  through an approved safe outcome; it never reassigns a slug or bypasses an
  invariant.
- A stale restore requires reload and review.

## Category Collection Journey — ACM-014

### Collection hierarchy

The Categories destination prioritizes:

1. Heading `Categorías` and primary action `Crear categoría`.
2. Find/filter controls.
3. Result context.
4. Category collection.
5. Pagination when required.

Each Category summary exposes, subject to the approved contract:

- Category name and slug;
- order;
- Active and Visible states;
- lifecycle state;
- protected dependency counts for Subcategories, Product Types and Products;
- current Image or `Sin imagen` context; and
- distinguishable edit/media/retire/restore actions.

The collection does not mix Product results or expose taxonomy-version controls.
Lifecycle defaults to current Categories; retired Categories require an explicit
filter. Loading, no-data, no-match, error and expired-session outcomes follow the
Product collection principles.

## Create Category

### Details

The form includes:

- required name;
- required unique slug; and
- optional description.

It explains that the Category will be appended to the active taxonomy collection
as inactive and not visible. System identity, taxonomy version and exact generated
order are not editable creation inputs.

### Confirmed flow and optional Image

1. Submit `Crear categoría`.
2. On confirmation, announce `Categoría creada` and open its editor.
3. Offer `Agregar imagen` through the released Category media capability.

The Image step is optional and follows successful creation because released media
association requires an existing Category. The experience distinguishes the two
confirmed outcomes: a media upload failure cannot falsely report that Category
creation failed, and a created Category without an Image remains valid.

Invalid/duplicate values preserve input and confirm that no Category was created.
A concurrent slug conflict requires correction; no alternate slug is generated.

## Edit Category

### Editable context

- Name.
- Slug.
- Description.
- Order within the governed collection.
- Active state.
- Visible state.
- Image via the released Category media capability.

Image management is linked/composed rather than reimplemented. Product Type,
Subcategory and Product dependencies are context only and are never edited or
reassigned from this form.

### Order and slug behavior

- A local order change identifies its intended position and is unsaved until the
  complete affected collection outcome is confirmed.
- The UI never displays duplicate confirmed order or a partially reordered
  sibling collection.
- A stale/colliding order requires reload and review.
- A slug-change warning explains permanent continuity and reservation of the old
  URL, matching the Product journey.

### Save and recovery

Save, cancel, dirty-state, validation, missing Category, conflict and session
expiry use the Product editor patterns with Category-specific copy. A save never
claims changes to taxonomy identity/version, descendants or dependent Products.

## Retire Category

The experience may use the familiar action word `Eliminar` only when it is
immediately clarified as reversible retirement. The persistent action and
confirmation title prefer `Retirar categoría` to prevent physical-deletion
expectations.

### Dependency pre-check

- Always show current counts for Subcategories, Product Types and Products near
  the retirement action.
- If any protected count is nonzero, retirement is unavailable and the page says
  `Esta categoría no se puede retirar porque tiene elementos asociados.`
- List each nonzero dependency type/count and offer safe navigation to review it
  only when such a governed destination exists.
- Do not offer cascade, automatic reassignment, descendant deletion or a bypass.

### Eligible confirmation

When all protected counts are zero, confirmation identifies the Category and
states that retirement:

- makes it inactive and not visible;
- retains identity, description, Image, order/history, audit and slug ownership;
- does not delete media or taxonomy records; and
- can later be restored subject to current rules.

Actions are `Cancelar` and `Retirar categoría`.

### Race and protected-dependency denial

If a dependency appears after the page loaded, the server denial preserves the
Category and all dependents. Close/update the confirmation, announce the refreshed
dependency context and offer `Recargar categoría`. Never frame this as a partial
retirement.

### Success and failure

- Success announces `Categoría retirada`, removes it from the default collection
  and offers `Ver categorías retiradas`.
- Conflict requires reload/review.
- General failure explicitly states the Category was not retired.
- No success outcome promises physical deletion or storage cleanup.

## Restore Category

- `Restaurar categoría` is available from retired results/editor.
- Confirmation explains that restoration keeps the Category inactive and not
  visible; public discovery requires later explicit valid transitions and
  eligible Product content.
- Restoration preserves Image and identity and validates current slug/integrity.
- A conflict or uniqueness failure leaves it retired and offers safe reload or
  correction guidance without assigning another slug automatically.

## Shared Validation and Recovery

### Form validation

- Required markers, help, errors and constraints are programmatically associated
  and do not rely on placeholders/color.
- Multiple submitted errors produce a summary linking to fields.
- Preserve correctable values after validation or duplicate outcomes.
- Do not reveal internal IDs, database constraints, stack traces or unrelated
  resource data.

### Unsaved changes

- Create/edit form values and media work governed by the released media flow count
  as unsaved independently.
- Navigation and session exit require explicit discard confirmation.
- Browser close/reload may use the standard warning.
- A destructive confirmation never silently discards a separate edit form.

### Concurrency

- Stale Product, Category or collection order never overwrites a newer baseline.
- Explain that the resource changed elsewhere and identify reload as the safe
  primary action.
- Warn before discarding local work.
- No automatic field merge, slug reassignment, dependency bypass or order repair
  occurs in V2.

### Authorization and service outcomes

- Expired/revoked sessions return to named access without claiming mutation.
- Rejected Origin/CSRF or managed-edge outcomes use neutral unavailable/access
  copy and no technical detail.
- Throttled mutations use safe retry guidance and retain local values while the
  session remains valid.
- Unexpected service failure preserves the last confirmed state and offers one
  safe retry or return action.

## Responsive Priorities

### Desktop

- Search/filter/table remain one operational region.
- Forms may use readable columns only where label, help and error relationships
  stay clear.
- Category dependency counts and lifecycle actions remain adjacent to the entity
  they affect.

### Tablet

- Filters wrap/disclose before labels truncate.
- Table remains semantic and horizontally contained.
- Form groups reduce columns before controls become cramped.

### Mobile and zoom

- Page controls use one vertical reading flow.
- Product collection remains a semantic table in its named horizontal-scroll
  region and never changes to Cards.
- Essential page actions remain outside the scroll region; row actions remain in
  their table row.
- Forms, errors and confirmations fit 320 CSS pixels without page-level
  horizontal scrolling.
- At 200% zoom, table navigation, every field/action, focus indicator and status
  remain reachable and unobscured.

## Accessibility Requirements

- Access, navigation, collections, forms and lifecycle dialogs have descriptive
  headings and landmarks.
- Username/password support password managers, paste, programmatic labels and
  understandable autocomplete without leaking values.
- Generic authentication error remains announced and associated without
  identifying account state.
- Mandatory password replacement exposes only its form and logout, keeps errors
  associated without reading password values and moves to catalog navigation
  only after confirmed replacement.
- Account table preserves caption, headers, username row identity, fixed role,
  state and row-action relationships at every viewport.
- Password reveal controls identify their target/current state; temporary,
  current, new and confirmation values are never announced in status copy.
- Account confirmations name the target and effect, receive/trap focus and return
  it to the initiating or updated row under the defined recovery outcomes.
- The protected Superadministrator and unavailable regular-Administrator account
  destination are understandable without exposing disabled controls or relying
  on color.
- Product table preserves caption, headers, row headers, cell relationships and
  keyboard-scroll instructions at every viewport.
- Search/filter changes announce updated result context without moving focus
  unexpectedly.
- Independent lifecycle states use text and semantics, never color alone.
- Destructive dialogs receive focus, contain it while open, name the consequence
  and restore focus to a logical surviving action after close/success.
- Dependency denial associates its explanation and counts with the unavailable
  retirement action.
- Status, validation, success, conflict and expiry use appropriate polite/assertive
  semantics without repeated announcements.
- Visible focus, target size, contrast, text spacing, reduced motion, 320px
  reflow, 200% zoom and deterministic light-only behavior follow Platform rules.

## Security and Privacy UX Constraints

- Browser code and UI never receive password hashes, peppers, credential versions,
  session tokens, CSRF secrets or account state beyond the approved safe account
  projection.
- Never differentiate unknown, incorrect, disabled or account-locked access.
- Never store credentials or authorization in local/session storage.
- Never restore the shared-code entry or offer both schemes after cutover.
- Account collection and mutations are absent for regular Administrators and
  server-authorized for the Superadministrator; route visibility is not the
  authorization boundary.
- Never echo or recover a temporary/current/new password after account creation,
  reset, reactivation or replacement.
- Fresh-authorization challenges clear credential values on failure, expiry,
  conflict or navigation.
- The Admin cannot create/promote another Superadministrator, change fixed roles
  or target the protected Superadministrator with reset/deactivation controls.
- Named attribution may identify the current Administrator inside Admin but must
  not enter public catalog content or unsafe notifications/analytics.
- No client-only state authorizes create, edit, retire, restore or media changes.
- Admin pages remain behind managed edge in production; username/password does
  not imply removal of that control.

## UX Writing Contract

Preferred labels:

- `Acceso administrativo`, `Usuario`, `Contraseña`, `Ingresar`, `Salir`.
- `Reemplaza tu contraseña`, `Guardar nueva contraseña`.
- `Cuentas de administradores`, `Crear administrador`, `Restablecer contraseña`,
  `Desactivar acceso`, `Reactivar administrador`.
- `Superadministrador`, `Administrador`, `Cuenta protegida`, `Activo`,
  `Desactivado`, `Debe reemplazar contraseña`.
- `Crear producto`, `Guardar cambios`, `Retirar producto`, `Restaurar producto`.
- `Crear categoría`, `Retirar categoría`, `Restaurar categoría`.
- `Administrar imágenes`, `Recargar producto`, `Recargar categoría`.
- `Vigente`, `Retirado`, `Activo`, `Publicado`, `Disponible comercialmente`,
  `Destacado`, `Visible` as distinct states.

Avoid `borrar definitivamente`, `eliminado para siempre`, `recuperar contraseña`,
`enviar enlace`, configurable-permission language, `comprar`, automatic
`publicado` language, or copy that suggests deactivation/retirement deletes audit,
Images/Variants or that restoration returns a resource to public discovery.

## UX Validation Checklist

- [x] Named username/password access, generic failure, throttle,
  Superadministrator-directed Administrator recovery, Deployment emergency
  recovery, unavailable access and expired/revoked session are defined.
- [x] Legacy shared-code entry is absent and no public/self-service recovery is
  introduced.
- [x] Temporary-password sessions expose only mandatory password replacement and
  logout, with success, validation, revocation, expiry and failure recovery.
- [x] Superadministrator-only account collection, safe projection, protected row
  and regular-Administrator authorization denial are defined.
- [x] Administrator create, reset, deactivate and reactivate journeys define
  temporary-password, fresh-authorization, session revocation, confirmation,
  conflict and focus outcomes without echoing credentials.
- [x] Product collection remains one semantic table at desktop, tablet, 320px and
  200% zoom without Card-based rows.
- [x] Product search/filter/page/empty/error/return-context journeys are complete.
- [x] Atomic Product plus Base Variant creation, exact minimum input, safe initial
  states and duplicate/failure outcomes are defined.
- [x] Product edit, slug continuity, media integration, retirement, restoration,
  conflict and recovery preserve approved invariants.
- [x] Category collection, create, edit/order/slug, media integration,
  dependency-protected retirement, restoration and recovery are defined.
- [x] No cascade, physical purge, bulk mutation, configurable roles, additional
  Superadministrator, self-service recovery, taxonomy-version management or
  duplicate media model was introduced.
- [x] Responsive, keyboard, screen-reader, focus, errors, status, target, reflow,
  zoom and light-only expectations are documented.

## Handoff

ACM-012 through ACM-014 and the ACM-040 account-governance amendment are UX-ready.
Design System, UX/UI and Accessibility may complete ACM-041 against this
blueprint and `account-management-design-system-handoff.md`. React Frontend must
consume the approved ACM-041 and Backend contracts for ACM-025–ACM-030; this
document does not prescribe React components, exact API schemas, database
mechanisms or security secrets.
