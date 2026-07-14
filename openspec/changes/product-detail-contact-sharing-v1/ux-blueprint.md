# Product Detail Contact and Sharing V1 — UX Solution

Status: UX Ready — Requirements and Architecture Approved

Owner: UX Solution Architect

Date: 2026-07-13

## Experience Goal

Help an anonymous visitor inspect every released Product Image, ask the business
for information through WhatsApp and share the canonical Product link, while
preserving Product/Variant meaning and never implying purchase, reservation,
availability, delivery or stored lead state.

## Experience Principles

1. **Inspection precedes continuation.** Gallery, Product identity and offer
   context remain primary; external actions support rather than replace them.
2. **Contact is an inquiry.** WhatsApp is the principal continuation action but
   never a purchase or availability confirmation.
3. **Share is a utility.** Native Share progressively enhances one canonical URL;
   copy/manual link provides recovery.
4. **External behavior is not application success.** The page never claims a
   message was sent, received or answered.
5. **Capabilities fail locally.** Missing contact, cancelled Share or denied
   Clipboard never damages Product content, gallery or Variant state.

## Product Detail Hierarchy — PDS-006

```text
Product Detail
├── Product media
│   └── Complete ordered gallery
├── Product understanding
│   ├── Name and descriptive identity
│   ├── Current governed offer/content
│   └── Variant choices and metadata
├── Continuation actions
│   ├── Contactar por WhatsApp (primary, when configured)
│   └── Compartir producto (secondary utility)
├── Local share/copy status or manual-link recovery
└── Existing supplementary Product content
```

On wide layouts, media and Product understanding may be peer columns; their
programmatic reading order remains coherent. On narrow layouts they stack with
gallery before Product identity/action context. The action group sits with the
current Product summary after the visitor can identify the Product and current
Variant/offer context; it does not displace Variant selection or masquerade as an
Add to Cart/Buy area.

## Complete Gallery Journey

### Initial state

1. Render every eligible Product Image once in released order.
2. Select the Primary Image initially when present.
3. Otherwise select the first ordered Image.
4. If no Images exist, preserve the released missing-media outcome without an
   empty Carousel or fabricated Image.

The current media, thumbnail/position controls and alternative text use released
gallery semantics. A large valid gallery remains complete and navigable; this
artifact does not impose a new Image count or loading-based truncation.

### Manual gallery interaction

- Activating a thumbnail/previous/next control changes only displayed media.
- Manual Image selection never selects or alters a Variant.
- The current Image and position are understandable without color alone.
- Missing/failed media uses the released per-Image fallback and keeps other
  Images accessible.

### Variant-associated Image

- Selecting/resolving a valid Variant may select its owned gallery Image.
- The gallery reflects that Image without creating a second copy or hiding the
  remaining collection.
- Later manual Image navigation does not unset, change or imply a different
  Variant.
- A Variant without an associated/available Image preserves the current released
  gallery outcome and never fabricates an association.

Gallery failure or absence has no effect on WhatsApp/Share eligibility when safe
canonical Product data remains available.

## Action Group and Hierarchy

- `Contactar por WhatsApp` is the primary continuation action when a safe
  server-provided destination exists.
- `Compartir producto` is visually and semantically secondary.
- Both actions remain distinct labelled controls; icon-only actions are not
  sufficient.
- Supporting copy explains external behavior once for the group or Contact:
  `WhatsApp se abrirá para que puedas enviar tu consulta.`
- Do not use `Comprar`, `Reservar`, `Ordenar`, `Confirmar disponibilidad`,
  `Finalizar` or success-like commerce language.
- Action content never displays price, currency, SKU, selected Variant,
  inventory or administrative data.

Only one local action state is announced at a time. Pending native/Clipboard
interaction does not disable gallery, Product reading or the other action beyond
what is necessary to prevent duplicate activation.

## WhatsApp Contact Journey

### Available destination

1. The visitor reviews Product identity and the external-context note.
2. The visitor activates `Contactar por WhatsApp`.
3. The approved external WhatsApp destination opens in a new safe context with
   the exact server-built inquiry.
4. Product Detail remains unchanged and available in the original context.

The visible page may explain that the prepared inquiry identifies the Product,
but it does not show/edit the recipient, reconstruct the message or expose
configuration. The exact payload remains:

`Hola, vi “{Product name}” en Mandoquita y quisiera recibir información. {canonical Product URL}`

### After activation

- Do not announce `Mensaje enviado`, `Consulta recibida`, purchase success,
  availability or response-time expectation.
- Opening the external destination is the only locally observable outcome; no
  delivery status, callback, retry loop or stored lead appears.
- Returning to Product Detail preserves the selected Variant and gallery Image
  when normal browser behavior permits.

### Missing or invalid contact configuration

- Omit the WhatsApp action and its external-context note if it would become
  orphaned.
- Keep gallery, Product content, Variants and `Compartir producto` unchanged.
- Do not display an invented phone number, arbitrary contact link, technical
  configuration error or disabled control that implies temporary visitor fault.

### External navigation failure

If the browser blocks or cannot open the approved destination, keep Product
Detail intact and state `No pudimos abrir WhatsApp. Inténtalo nuevamente.` The
retry remains an explicit visitor action and still cannot claim message delivery.

## Share Journey

### Native Share available

1. Visitor activates `Compartir producto`.
2. Invoke native Share with exactly:
   - title: `{Product name} | Mandoquita`;
   - text: `Mira “{Product name}” en Mandoquita.`; and
   - the canonical Product URL.
3. Keep Product Detail and current gallery/Variant state unchanged.

Opening or resolving the native share surface does not produce an application
claim that another person received the Product.

### Native cancellation

- Keep or restore focus safely to `Compartir producto`.
- Announce neither error nor success.
- Do not open copy fallback automatically, retry or retain a warning.

Cancellation is a completed neutral visitor choice.

### Native Share unavailable

Activation reveals or directly enters a clearly labelled fallback containing:

- action `Copiar enlace`;
- the canonical Product URL as a selectable/navigable link; and
- a concise explanation that it can be shared manually.

The fallback contains only the current canonical URL, never browser location,
incoming alias, query, fragment or tracking data.

### Native Share non-cancel failure

- Announce politely `No pudimos abrir las opciones para compartir.`
- Present the same copy/manual-link fallback.
- Do not automatically invoke Clipboard or repeat the native permission prompt.
- Preserve focus at the fallback heading or `Copiar enlace` according to the
  approved disclosure pattern.

## Copy and Manual-Link Recovery

### Copy success

1. Visitor activates `Copiar enlace`.
2. Copy only the canonical Product URL.
3. Announce politely `Enlace copiado` without moving focus.
4. Keep the manual canonical link visible for verification/use.

The status does not claim the Product was shared or opened by another person.

### Clipboard unavailable or denied

- Announce politely
  `No pudimos copiar el enlace. Selecciónalo para copiarlo manualmente.`
- Expose the full canonical URL in a readable/selectable link with an accessible
  name such as `Enlace canónico de {Product name}`.
- Do not trigger repeated permission prompts, replace the URL with instructions
  alone or select/copy without another explicit visitor action.
- Focus remains on `Copiar enlace` or moves once to the manual recovery region
  when necessary for discoverability; no blocking error dialog is used.

### Missing canonical payload

If safe canonical configuration is unavailable, omit/fail closed for Contact and
Share actions while preserving Product content and gallery. Do not guess from
the address bar, incoming alias, Host or referrer. A neutral local message may
state `Las opciones para contactar y compartir no están disponibles en este
momento` without technical detail.

## Canonical and Historical URL Interpretation

- Alias resolution completes before Product Detail actions are presented.
- Product metadata, WhatsApp, native Share, copy and manual recovery all use the
  same absolute current canonical URL.
- The UI never labels an old incoming alias as the shareable address.
- Canonical content contains no query, fragment, campaign, session, visitor or
  referrer data.
- A Product becoming retired/unpublished after page load may make the shared URL
  unavailable later; the current page makes no future availability guarantee.

## Outcome Matrix

| Action/capability | Visitor outcome | Status/recovery |
|---|---|---|
| WhatsApp configured | Opens approved external destination | No delivery/success claim |
| WhatsApp missing/invalid | Contact action omitted | Share/Product remain intact |
| WhatsApp blocked | Product page retained | Polite retry guidance |
| Native Share available | Opens OS share surface | No recipient-success claim |
| Native Share cancelled | No state change | No announcement |
| Native Share rejected | Copy/manual fallback | Polite failure |
| Native Share unsupported | Copy/manual fallback | No application error |
| Clipboard succeeds | Canonical URL copied | `Enlace copiado` |
| Clipboard denied/unavailable | Manual canonical link remains | Polite corrective guidance |
| Canonical config invalid | External actions fail closed | Product/gallery remain |

## Loading and Concurrent Interaction

- Product SSR does not wait for WhatsApp or a sharing provider and makes no
  third-party request.
- Gallery media loading uses released placeholders/fallback without delaying
  action rendering when Product/canonical data is safe.
- Prevent duplicate activation while the same native/Clipboard operation is
  pending, but do not lock unrelated Product controls.
- A second action clears/replaces stale local status only when needed; it never
  reports two contradictory success/failure messages.
- Route change/unmount clears local share/copy status and never persists it as
  Product or visitor state.

## Responsive Priorities

### Desktop

- Gallery and Product understanding may use balanced peer columns.
- Action group stays with Product identity/offer context, not overlaid on media.
- Copy/manual recovery uses readable width and does not compete with Variant
  controls.

### Tablet

- Gallery controls remain associated with media as columns narrow.
- Actions wrap before labels truncate and preserve primary Contact/secondary
  Share hierarchy.

### Mobile and zoom

- One top-to-bottom flow: gallery, Product understanding/Variants, action group,
  recovery and supplementary content.
- Actions may stack full-width; Contact remains first when present.
- Long Product names and canonical manual link wrap/break safely without
  page-level horizontal overflow.
- At 320 CSS pixels and 200% zoom, gallery controls, both actions, status and
  manual recovery remain readable, reachable and at least 44px where interactive.

## Accessibility Requirements

- Gallery exposes current Image, complete ordered controls, meaningful
  alternative text and released keyboard behavior.
- Variant-driven Image changes are understandable without implying manual Image
  changes alter the Variant.
- Contact and Share have persistent visible labels and distinguishable accessible
  names; icons are supplementary.
- WhatsApp is identified as external before activation without using the icon
  alone; safe new-context behavior does not steal focus from the original page.
- Native Share is invoked only from explicit activation. Cancellation causes no
  alert or unexpected focus movement.
- Copy success/failure uses a polite live status; repeated activation does not
  create announcement noise.
- Manual canonical link is keyboard accessible, selectable and named with Product
  context.
- Focus is visible and returns to a logical action after native cancellation,
  disclosure close or recoverable failure.
- Content supports keyboard, screen reader, 44px targets, 320px reflow, 200%
  zoom, text spacing, contrast, reduced motion and deterministic light-only
  presentation.

## Security and Privacy UX Constraints

- UI consumes only the approved server-provided canonical/contact values; it does
  not accept/edit arbitrary destinations or infer them from browser location.
- Never display hidden price/currency, SKU, Variant, inventory, visitor/session,
  referrer, Admin or analytics information in external content.
- Never load a third-party sharing/WhatsApp SDK, iframe or script for these
  actions.
- Do not store contact/share attempts, lead state, recipient choice or visitor
  identity.
- Do not expose the complete encoded WhatsApp destination in analytics, logs,
  error copy or a copy helper.
- Copy/manual recovery uses only the canonical public Product URL.

## UX Writing Contract

Approved labels/copy:

- `Contactar por WhatsApp`
- `WhatsApp se abrirá para que puedas enviar tu consulta.`
- `Compartir producto`
- `Copiar enlace`
- `Enlace copiado`
- `No pudimos abrir las opciones para compartir.`
- `No pudimos copiar el enlace. Selecciónalo para copiarlo manualmente.`

Avoid `Comprar`, `Reservar`, `Pedido`, `Mensaje enviado`, `Consulta recibida`,
`Disponible`, delivery promises, response-time promises or price/Variant content
in contact/share guidance.

## UX Validation Checklist

- [x] Complete gallery, Primary/first selection, no-Image, manual navigation and
  Variant-associated Image behavior preserve released contracts.
- [x] Product identity/offer/gallery precede one coherent Contact/Share action
  group with WhatsApp primary and Share secondary.
- [x] Configured, omitted and blocked WhatsApp outcomes use inquiry language and
  never claim external delivery or transaction.
- [x] Native Share, neutral cancellation, unsupported/rejected fallback, copy
  confirmation and manual-link recovery are defined.
- [x] One current canonical URL governs metadata/contact/share/copy/manual
  outcomes; alias, query, referrer and visitor state remain excluded.
- [x] Gallery/action failures remain independent and preserve Product/Variant
  content.
- [x] Keyboard, screen reader, focus, status, target, 320px, 200% zoom, long
  content and light-only behavior are documented.
- [x] No media model, external SDK, lead, transaction, analytics or Product
  mutation was introduced.

## Handoff

PDS-006 is UX-ready. Design System, UX/UI and Accessibility may consume this
blueprint for PDS-007–PDS-009. Backend and React Frontend must consume the
approved canonical/contact contract and final design evidence for PDS-010–PDS-016;
this document does not prescribe React components, API shapes or URL-building
mechanisms.
