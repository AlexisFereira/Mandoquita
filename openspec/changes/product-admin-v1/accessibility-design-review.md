# Product Admin V1 — Accessibility Design Review

Status: Approved — Design and Implementation Validation Complete

Owner: Accessibility Review

Date: 2026-07-13

## Decision

Accessibility approves its portion of the joint `ADM-012` Design Review. The
approved composition can satisfy WCAG 2.2 AA without a new Platform component.
This decision validates the design contract. The implemented behavior and the
independent QA portion of ADM-036 are approved in `qa-review.md`.

Product Requirements has revalidated the resolved ADM-PR-UI-001 Price/Currency
correction, so ADM-012 is complete. Accessibility implementation validation
remains independently required by ADM-036.

## Access gate

- One persistent label owns one masked, paste-compatible native input; six
  separate focus stops are prohibited.
- Numeric input mode and six-digit client validation improve entry without
  claiming authorization or exposing the submitted credential.
- Local errors use `aria-invalid` and associated text. Server denial remains
  generic, clears the secret and returns focus to the field without echoing it.
- Verifying state keeps orientation, disables duplicate submission, exposes one
  polite status and never places the credential in a URL, log or browser store.
- Expiry and unavailable outcomes precede the recovery form and provide a
  predictable focus destination without revealing configuration state.

## Product list

- Search, filter disclosure, controls, applied-filter removal, Product summaries,
  pagination and session exit follow one stable DOM order.
- The collection remains one semantic list across breakpoints; responsive CSS
  cannot duplicate desktop/mobile content or alter Product order.
- Every filter has a persistent label and explicit apply behavior. Applied Chips,
  current page and Product states expose complete text rather than color alone.
- Loading, no Products, no matches, request failure and authorization loss remain
  distinguishable, with status announcements limited to submitted outcomes.

## Product editor

- Seven visible groups preserve logical heading/fieldset order and contain every
  approved editable field without exposing excluded Images, Variants or secrets.
- Native text, textarea, select and checkbox semantics retain labels, keyboard
  behavior, checked state and programmatic helper/error association.
- Independent Product states remain independent controls. Conditional Featured
  order enters immediately after Featured without moving focus.
- Product Type is the only editable taxonomy assignment; inherited Category and
  Subcategory remain readable context rather than disabled competing controls.
- Required persisted Price and Currency remain visible when Commercial
  Availability is off; clearing either produces an associated error and blocks
  the atomic submission.

## Validation, status and focus

- Normal typing does not trigger live announcements or focus movement.
- Submitted multi-field validation creates a focusable summary with a heading and
  links to associated invalid controls; inline errors use `aria-describedby`.
- Saving is one polite, atomic status and prevents duplicate mutation. Confirmed
  success remains inline without stealing focus from the initiating action.
- Conflict receives focus only after the server response, prevents unsafe save
  and offers explicit reload/discard recovery without exposing concurrency IDs.
- Cancel and in-app navigation open an explicit inline discard confirmation;
  browser `beforeunload` exists only while dirty and is removed after resolution.
- Session expiry fails closed to the access gate and never leaves an operable
  editor behind a visual overlay.

## Responsive, target and visual contract

- Controls and actions have a 44 by 44 CSS-pixel minimum target with unclipped
  semantic focus.
- At 320 CSS pixels and 200% zoom, gate, summaries, filters, field groups, errors
  and actions become one column; labels and long values wrap without a table or
  horizontal page overflow.
- Sticky actions are optional and must be disabled whenever they obscure content
  or consume excessive zoomed viewport height.
- Semantic foreground, muted, border, primary, focus, success, warning and danger
  roles preserve the released light-only contract. Meaning never depends on raw
  color, icon, placeholder, position or animation.
- Loading remains text-readable under reduced motion; no essential content or
  recovery waits for animation.

## Implementation handoff

The complete `ADM-012` gate is closed, so Frontend `ADM-022`–`ADM-032` may begin.
Implementation must provide automated semantics/focus/state coverage and
browser evidence for keyboard operation, 320px reflow, 200% zoom, target size,
computed contrast and light-only presentation. Accessibility and QA will then
complete `ADM-036` independently.
