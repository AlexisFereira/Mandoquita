# Product Admin V1 — Design System Sufficiency Review

Status: Approved — Existing Composition Is Sufficient

Owner: Design System Architect

Date: 2026-07-13

## Decision

`ADM-011` is approved. Product Admin V1 can be implemented through existing
Design System components, semantic tokens, accessibility foundations, and native
form controls. No separate Platform change is required for V1.

The demonstrated need is feature composition, not a missing reusable Platform
capability. `Input`, `SearchInput`, `Button`, `Card`, `Badge`, `Chip`, `Icon`, and
`PoliteStatus` already cover shared identity, action, surface, status, filter, icon,
and non-interruptive feedback behavior. Native `textarea`, `select`, `checkbox`,
`fieldset`, `legend`, and error-summary semantics cover the remaining editor needs
without inventing a competing component system.

## Approved composition matrix

| Product Admin need | Approved composition |
| --- | --- |
| Six-digit access credential | Existing `Input` with native password/text behavior, numeric input mode, maxlength, associated helper/error, and an optional labelled native/Button reveal control in the existing right-icon slot |
| Access and save actions | Existing `Button` variants and disabled/loading composition; visible explanatory status remains adjacent when an action is unavailable |
| Product search | Existing `SearchInput`, with Admin-owned Spanish labels and name/slug-only behavior |
| Filter disclosure and removal | Native disclosure/labelled controls plus existing `Button` and `Chip`; selection meaning remains visible in text |
| Product/list surfaces and field groups | Existing `Card`, `Container`, `Section` where semantically appropriate; native headings, lists, forms, fieldsets, and legends own document structure |
| Text, number, decimal, slug and currency fields | Existing `Input` with approved native types/input modes and Product-owned validation rules |
| Short, complete and SEO descriptions | Native labelled `textarea` using the existing Input surface, border, radius, typography, focus, helper, invalid and disabled token contract |
| Gender and Product Type | Native labelled `select`; options and Product/taxonomy meaning remain Feature-owned |
| Independent Product states | Separate native checkboxes with visible labels and associated helper text; never one generic status selector |
| Applied statuses and read-only context | Existing `Badge`/`Chip` only for concise non-editable summaries; plain text and definition/list structures remain authoritative |
| Success/saving feedback | Existing `PoliteStatus` and visible inline status composition |
| Validation, conflict and request errors | Native error summary/alert composition plus per-field `aria-invalid` and `aria-describedby`; submitted validation may focus the summary or first invalid field according to the approved UX contract |
| Unsaved-change confirmation | Native dialog/confirmation semantics owned by the Feature; no Design System modal API is required by V1 |

## Native form-control visual contract

Native `textarea`, `select`, and checkbox composition SHALL:

- use the active light semantic surface, foreground, muted, border, danger,
  success, primary, and focus roles; no raw or Admin-only palette is permitted;
- reuse the existing medium Input rhythm: visible label, control, then helper or
  one current error/success message;
- preserve a minimum 44 CSS-pixel interactive target and the global
  focus-visible treatment;
- associate helper and error text programmatically and set `aria-invalid` only
  for invalid fields;
- keep required meaning, checked state, errors, and disabled reasons available in
  text rather than color, placeholder, icon, or position alone;
- wrap labels/help/errors at 320px and 200% zoom without horizontal page overflow;
- preserve native keyboard behavior and DOM order; appearance styling must not
  replace native semantics;
- remain deterministic under the single light theme and existing reduced-motion
  rules.

## Ownership boundaries

- Product Admin owns field labels, options, validation copy, dependencies, dirty
  state, save state, security outcomes, and Product business rules.
- Backend remains authoritative for credential, session, throttling, Product
  invariants, concurrency, and accepted persistence.
- Design System owns only the shared visual, interaction, and accessibility
  foundations described here.
- Frontend may create Product Admin composition helpers, but SHALL NOT export a
  competing shared form-control library or add feature-specific tokens.
- A future second cross-feature consumer or a demonstrated accessibility/
  consistency failure may justify a separate reviewed Form Controls Platform
  proposal. V1 does not pre-authorize that expansion.

## Accessibility and responsive handoff

This decision confirms Design System sufficiency; it does not replace independent
Accessibility Review. `ADM-012` must still validate keyboard order, native control
semantics, error-summary focus, conditional Featured-order insertion, 44px targets,
320px reflow, 200% zoom, contrast, and light-only presentation.

## Outcome

No Design System blocker remains for `ADM-012` or Frontend estimation. Frontend
implementation remains gated by the joint Design/Accessibility handoff and the
dependencies recorded in `tasks.md`.
