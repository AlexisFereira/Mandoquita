# Product Detail Contact and Sharing V1 — Design System Review

Status: Approved

Owner: Design System Architect

Date: 2026-07-13

## Decision

`PDS-007` is approved. The released Design System contracts are sufficient for
the complete Product gallery, WhatsApp contact, native Share, copy fallback,
manual-link recovery and non-interruptive feedback. No new Platform component,
token, Icon or feature-local visual primitive is justified.

## Approved composition

### Product gallery

- Consume the released `Carousel mode="gallery"` contract with the complete
  ordered Product Image collection and stable Image identities.
- The feature owns Primary/fallback selection and Variant-to-Image resolution;
  Carousel never infers or changes Product or Variant state.
- Gallery loading, missing media, failed media, direct controls, current
  position, 44px targets and polite failure feedback retain the released
  Product Gallery and Option Controls behavior.
- Contact and Share eligibility remain independent from gallery media outcomes.

### Contact and Share actions

- Render `Contactar por WhatsApp` with `Button` primary styling only when the
  approved destination exists. It is an external anchor with visible text;
  `Icon name="contact"` and `Icon name="external-link"` may be decorative
  supplements, never the accessible name.
- Render `Compartir producto` and `Copiar enlace` as native-action `Button`
  compositions. Share is secondary to Contact and copy is a recovery action.
- Keep every required action label visible. A new `share` or `copy` Icon is not
  approved because the current text labels communicate the action without a
  new glyph dependency.
- The manual canonical URL is a normal, readable and selectable link. It is not
  represented by Button, Chip, Input or a disabled control.
- External context and safe-link attributes are consumer responsibilities; the
  Design System does not infer destinations or delivery success.

### Feedback and recovery

- Use one persistent `PoliteStatus` for the currently meaningful Share/copy or
  external-open outcome. Status updates do not move focus.
- Copy success uses `Enlace copiado`. Clipboard failure and native Share
  non-cancel failure use the approved UX copy and reveal the manual canonical
  link in normal document flow.
- Native Share cancellation writes no status. Opening WhatsApp never produces a
  sent, delivered, availability or transaction-success message.
- Do not use a dialog, toast, alert, Badge or destructive treatment for these
  local recoverable outcomes.

## Responsive and accessibility contract

- Wide layouts may place gallery and Product information in peer columns;
  narrow layouts preserve one DOM order with gallery before Product identity,
  Variants and actions.
- The action group wraps or stacks without duplicated responsive DOM and without
  page-level horizontal overflow at 320 CSS pixels or 200% zoom.
- Every action retains a minimum 44 by 44 CSS-pixel target, visible focus and a
  complete visible label. Selected gallery state and status meaning never rely
  on color or Icon alone.
- Focus remains on the initiating control after copy outcomes and neutral native
  Share cancellation. A recovery region may receive focus only when UX/UI and
  Accessibility approve that disclosure behavior.
- All surfaces consume the released deterministic light-only theme and semantic
  tokens. No system theme behavior or feature palette is introduced.

## Compatibility and ownership

- This review introduces no changes to `Button`, `Icon`, `PoliteStatus` or
  `Carousel` public APIs.
- Canonical URL construction, WhatsApp encoding, capability detection, browser
  APIs, Product fields and error classification remain Frontend/Backend feature
  responsibilities.
- Product Image order, Primary identity and Variant association remain released
  domain contracts and are never duplicated in presentation state.

## Handoff

UX/UI may complete `PDS-008` against this composition, Accessibility may complete
`PDS-009`, and Frontend may implement `PDS-012`–`PDS-015` without a Design System
blocker. Their remaining architecture, data and review dependencies still apply.

