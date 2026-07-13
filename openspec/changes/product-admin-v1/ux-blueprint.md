# Product Admin V1 — UX Solution

Status: UX Ready — Requirements and Security Architecture Approved

Owner: UX Solution Architect

Date: 2026-07-13

## Experience Goal

Allow one authorized catalog maintainer to find and update existing Products
through a small, isolated administration experience.

The experience uses one six-digit access code and no registration, user list,
profile, role management, password recovery, or public account experience. The
code is an access-control credential and must be validated on the server even
though the experience intentionally avoids a full identity system.

## V1 Scope

Included:

- One private `/admin` route.
- Six-digit numeric access gate.
- Temporary administrative session.
- Product list.
- Product search.
- Product filters.
- Editing existing Product fields supported by the governed Product update
  contract.
- Save, cancel, conflict, validation, unauthorized, and session-expired outcomes.
- Explicit session exit.

Excluded:

- Registration, named users, multiple administrators, roles, permissions, email,
  password reset, social login, or profiles.
- Creating, duplicating, deleting, archiving, or bulk-editing Products.
- Editing Product Variants, Variant Attributes, Product Images, tags, or taxonomy
  structure.
- Inventory, orders, payments, suppliers, costs, warehouses, or logistics.
- Public navigation to the administration route.
- Client-side storage or exposure of the access code or internal API key.

Product Image management is excluded from this first simple version. The existing
upload API stores a file but does not by itself govern Product Image ownership,
ordering, Primary uniqueness, alternative text, or Product association. Adding
that workflow requires a separately approved admin-media extension.

## Information Architecture

```text
/admin
├── Access gate
└── Authorized administration
    ├── Product list
    │   ├── Search
    │   ├── Filters
    │   └── Product summary
    ├── Product editor
    │   ├── Identity
    │   ├── Descriptive content
    │   ├── Merchandising metadata
    │   ├── Commercial information
    │   ├── Publication and discovery states
    │   ├── Taxonomy classification
    │   └── SEO content
    └── Exit session
```

The admin has no link from Header, Footer, Sitemap, Search, or public Product
experiences. The route must not be indexed as public catalog content.

## Primary Journey

1. The maintainer opens `/admin` directly.
2. If no valid temporary session exists, the six-digit access gate is shown.
3. The maintainer enters the code and submits it.
4. After successful server validation, the Product list is shown.
5. The maintainer searches or filters Products.
6. The maintainer selects one Product.
7. The editor displays the current persisted Product values.
8. The maintainer changes one or more fields.
9. The interface validates understandable field errors before submission.
10. The maintainer saves.
11. The system confirms the saved Product and updates the list summary.
12. The maintainer edits another Product, exits the session, closes the page, or
    allows the session to expire.

## Access Gate

### Screen structure

1. Mandoquita administrative identity.
2. Heading: `Acceso administrativo`.
3. Brief explanation that the six-digit code is required to manage Products.
4. Labelled code field.
5. Primary action: `Ingresar`.
6. Generic error/status region.

The public Header, Product navigation, payment information, contact CTA, and
Footer are not part of this focused access screen.

### Code input

- Accept exactly six numeric digits.
- Present the field as one understandable credential, not six unrelated focus
  stops.
- Support numeric keyboard input on compatible mobile devices.
- Mask the entered value while preserving a clear show/hide action only if the UI
  design demonstrates a need.
- Permit paste from a trusted password manager or secure clipboard.
- Do not submit until six digits are present and the visitor activates the
  standard submit action.
- Do not store the code in URL parameters, browser storage, logs, analytics, or
  client-visible configuration.

### Invalid code

- Use a generic message such as `No se pudo autorizar el acceso.`
- Keep the field available for correction.
- Clear the submitted credential after a failed attempt unless accessibility
  testing demonstrates that preserving it is safer for correction.
- Do not reveal whether configuration, code existence, session state, or rate
  limiting caused the rejection.
- Repeated attempts may produce a temporary wait outcome governed by Backend and
  Security Architecture.

### Access temporarily unavailable

- Explain that administration cannot be opened at this time without technical
  or configuration details.
- Do not fall back to an unprotected Product editor or expose the internal API
  key.
- Provide retry only when safe.

## Session Journey

- Successful access creates a server-issued temporary session; the six-digit code
  is not reused as the browser's ongoing API credential.
- Refreshing an authorized admin page preserves the session until expiry.
- The session is scoped only to administration capabilities.
- `Salir` invalidates the session and returns to the access gate.
- Expiry during navigation returns to the gate with the message
  `Tu sesión administrativa terminó. Ingresa nuevamente.`
- Expiry while unsaved changes exist explains that the changes were not saved and
  requires a new access before retrying.
- The experience does not present account identity, avatar, user name, role, or
  profile settings.

## Product List

### Information hierarchy

1. Heading: `Productos`.
2. Search and filters.
3. Result count or current range.
4. Product collection.
5. Pagination when required.
6. Session exit.

Each Product summary prioritizes:

- Product name.
- Slug or stable public reference for disambiguation.
- Product Type / Subcategory / Category context.
- Publication state.
- Commercial Availability.
- Featured state.
- Last update time.
- Action: `Editar`.

Price may appear as supporting information but must not become the only way to
identify a Product.

### Search

- Search supports Product name and slug in V1.
- Submission and clearing preserve a stable Product-list destination.
- Search does not change public Product state or public Search behavior.
- No suggestions, recent searches, fuzzy administrative actions, or hidden-field
  search is introduced without approval.

### Filters

V1 filters may narrow by:

- Publication: Publicado / No publicado.
- Commercial Availability: Disponible / No disponible comercialmente.
- Featured: Destacado / No destacado.
- Product Active state: Activo / Inactivo.
- Taxonomy Category and Product Type when approved list data is available.

Filters are optional and combinable. Applied filters remain visible, can be
removed individually, and provide `Limpiar filtros`. A filter with no matching
Products is a valid empty collection, not a system failure.

### Pagination

- Use explicit pages rather than infinite scroll.
- Preserve search and filters when changing page.
- Returning from Product editing restores the previous list context when
  possible.

## List States

### Loading

Keep page purpose, search, and known filters visible. Placeholder rows/cards are
not interactive and do not contain fabricated Product data.

### No Products

Explain that there are no Products to manage. Because creation is outside V1, do
not show an unimplemented `Crear producto` action.

### No filtered results

Explain that no Products match the current search and filters. Offer clearing the
query and filters as the primary recovery.

### List error

Preserve search/filter context, explain that Products could not be loaded, and
offer retry. Do not expose database or API details.

## Product Editor

### Orientation

- Identify the Product name and current public slug.
- Provide `Volver a productos` without discarding changes silently.
- Clearly separate editable groups so complex Product states are not perceived as
  one combined status.
- Indicate required fields and validation before save.

### Editable groups

#### Identity

- Name.
- Slug.

#### Descriptive content

- Short description.
- Complete description.

#### Merchandising metadata

- Brand.
- Collection.
- Gender applicability using the approved controlled vocabulary.

#### Commercial information

- Product-level price.
- Currency.
- Commercial Availability.

Commercial Availability remains independent. Turning it off must not silently
delete or rewrite stored commercial values, and public experiences continue to
protect historical price/currency according to existing rules.

#### Publication and discovery states

- Product Active state.
- Editorial Approval.
- Publication.
- Featured designation.
- Featured order when Featured is active.

These controls remain separate and use explanatory language. The interface must
not collapse them into one generic `Estado` selector.

#### Taxonomy classification

- Product Type selection from the approved active taxonomy.
- Inherited Subcategory and Category are shown as context and are not edited as
  competing independent assignments.

#### SEO content

- SEO title.
- SEO description.

SEO fields remain distinct from visible Product name and descriptions.

### Dependencies and validation

- A Product cannot be published without Editorial Approval.
- A Product cannot be published without an approved Product Type.
- A Product cannot be published without at least one governed Variant.
- A non-Featured Product cannot retain Featured order.
- Turning Featured off clears or disables Featured order in an understandable
  way before save.
- Slug, currency, lengths, price precision, and controlled values use the current
  governed Product update rules.
- Validation messages identify the field and corrective action without exposing
  implementation details.

The editor may explain a blocking dependency it cannot edit in V1, such as a
missing Variant, and must not fabricate that dependency automatically.

## Editing Interaction

### Unsaved changes

- The save action becomes available only when valid changes exist.
- `Cancelar` restores current persisted values.
- Navigating away with unsaved changes requires confirmation.
- Browser reload/close protection may use the standard browser warning when
  unsaved changes exist.

### Save

- Primary action: `Guardar cambios`.
- Prevent duplicate submissions while one save is pending.
- Preserve field values and orientation during submission.
- Do not optimistically claim success before the server confirms persistence.

### Save success

- Confirm `Cambios guardados` in a non-interruptive status region.
- Update the editor's persisted baseline and Product list summary.
- Keep the maintainer on the editor so additional review is possible.
- Provide a clear return to the Product list.

### Validation failure

- Preserve all entered values.
- Present a summary when multiple errors exist and associate each error with its
  field.
- Move focus to the error summary or first invalid field only on submitted
  validation, following established form accessibility patterns.

### Concurrent update conflict

If the Product changed after it was loaded:

- do not overwrite the newer state silently;
- explain that the Product was updated elsewhere;
- offer `Recargar producto` as the safe primary recovery;
- warn that reloading discards local unsaved changes;
- do not merge fields automatically in V1.

### Product no longer exists

Explain that the Product is no longer available for editing and return to the
Product list. Do not expose internal deletion or database details.

### Session expires during save

Do not claim that changes were saved. Return to the access gate and explain that
the maintainer must enter the code again before retrying.

## Responsive Priorities

### Desktop

- Product list supports efficient scanning without requiring a dense spreadsheet.
- Search and filters remain adjacent to the collection they control.
- Editor groups may use a readable multi-column composition where field
  relationships remain clear.
- Save/cancel actions stay discoverable without obscuring fields.

### Tablet

- List summaries retain Product identity and critical states before secondary
  metadata.
- Filters reflow without truncating labels.
- Editor groups reduce columns before fields become cramped.

### Mobile

- Access gate, list, and editor use one top-to-bottom column.
- Product rows become readable summaries/cards rather than a horizontally
  scrolling table.
- Filters use an accessible disclosure when simultaneous controls become dense.
- Editing preserves field order, errors, and actions without horizontal scroll.
- The numeric code field invokes a compatible numeric keyboard without changing
  its semantic label.

## Accessibility Requirements

- Access, list, search, filters, editor, and status regions have clear headings
  and accessible names.
- Code input is one labelled credential field and supports paste.
- Error and session messages are programmatically associated and announced
  without revealing sensitive values.
- Search and filter controls are keyboard operable and retain visible focus.
- Product summaries and Edit actions have distinguishable names.
- State values use text and semantics, not color alone.
- Editor groups use fieldset/legend semantics where a group of related controls
  requires them.
- Required fields and errors are not conveyed by placeholder or color alone.
- Save, loading, success, validation, conflict, and session-expiry feedback use
  appropriate status/error semantics without unexpected focus movement.
- Touch targets, zoom, text reflow, contrast, reduced motion, and deterministic
  light-only behavior follow Platform contracts.

## Security and Privacy UX Constraints

- Never display, log, persist, or place the six-digit code or internal API key in
  URLs or public content.
- Never distinguish “wrong code” from server configuration or credential
  existence in public error copy.
- Do not use browser local storage as authorization.
- Do not place Product administration behind a client-only condition.
- Do not expose internal fields that are outside the approved editor contract.
- Avoid sensitive Product values in notifications, URLs, or analytics events.
- Administrative pages are excluded from public indexing and public navigation.

## UX Validation Checklist

- [x] Six-digit access, invalid, unavailable, expired, and explicit-exit journeys
  are defined without creating accounts or exposing credentials.
- [x] Product list, search, filters, pagination, empty, loading, and error outcomes
  are complete.
- [x] Product editor groups preserve independent Product states and taxonomy
  ownership.
- [x] Save, validation, success, conflict, missing Product, unsaved changes, and
  expired-session recovery are defined.
- [x] Desktop, tablet, and mobile priorities avoid spreadsheet dependence and
  horizontal scrolling.
- [x] Keyboard, focus, status, forms, errors, touch targets, reflow, and light-only
  expectations are documented.
- [x] Product creation, deletion, Variants, Images, tags, taxonomy structure,
  transactions, inventory, and multi-user identity remain outside V1.
