# Admin Catalog Management V2 — Accessibility Design Review

Status: Catalog and Account Accessibility Approved — Implementation QA Passed

Owner: Accessibility Review

Date: 2026-07-13

## Decision

The independent Accessibility Review approves the catalog design described in
`ui-design.md` and closes the Accessibility gate ACM-018. The specified Product
and Category collections, lifecycle forms, confirmations and recovery behavior
can satisfy WCAG 2.2 AA without a new Platform component.

The Accessibility portion of ACM-041 is also approved against
`account-management-ui-design.md`, `account-management-design-system-handoff.md`
and the amended UX contract. Design System recorded final conformance in
`account-management-design-system-review.md`; ACM-041 is complete.

The design approval is now complemented by rendered keyboard, browser
accessibility-tree, 320px, 200% zoom, target-size and light-only validation.
ACM-034 is complete; evidence is recorded in `qa-review.md`.

## Catalog review evidence — ACM-018

### Tables, keyboard and reflow

- Product and Category collections use one native table at every viewport, with
  caption, column headers, one meaningful row header and row-bound actions.
- Native table semantics are not replaced with ARIA grids, Cards or duplicated
  mobile DOM. Natural reading and Tab order remain stable across breakpoints.
- Horizontal overflow is limited to a visibly named and instructed table region.
  The region becomes keyboard focusable when it overflows and retains a visible
  focus indicator; the page itself does not scroll horizontally.
- At 320 CSS pixels and 200% zoom, all page controls reflow in document order and
  every table cell/action remains reachable inside the table exception. Sticky
  columns cannot obscure content or focus.
- Row actions contain the affected Product or Category name, maintain 44 by 44
  CSS-pixel targets and do not depend on hover, drag or a fine pointer.

### Forms, errors and status

- Persistent labels, helper and error associations, native fieldsets and linked
  error summaries preserve understandable field ownership. Placeholder, color
  and position are never the only source of meaning.
- Submitted multi-error summaries receive focus and link to invalid fields;
  ordinary loading and result updates do not steal focus.
- Pending operations prevent duplicate submission and never claim optimistic
  persistence. Success is announced only from the confirmed server baseline.
- Conflict, missing-resource, dependency, service and session-expiry outcomes
  each expose a distinct safe recovery without automatic merge or mutation
  replay.

### Lifecycle and destructive confirmation

- Product and Category retirement is named as reversible retirement rather than
  physical deletion, identifies the target and explains both public effects and
  retained data.
- Safe Cancel precedes and initially receives focus before a destructive action;
  dismissal never confirms. Cancel/failure returns focus to the invoker, while a
  confirmed removal moves focus to a surviving collection status.
- Category dependency denial exposes the current nonzero counts and associates
  the reason with the unavailable action. It never relies on disabled opacity or
  performs a cascade.
- Restoration describes the confirmed safe inactive/unpublished state and never
  implies automatic public visibility.

## Account review evidence — ACM-041 Accessibility portion

### Authorization and restricted sessions

- Regular Administrators never receive account navigation, account data or
  privileged controls in the DOM. Direct denial exposes no cached table shell or
  account projection.
- A temporary-password session renders only the replacement form and logout;
  catalog/account navigation is absent from the accessibility tree.
- The protected Superadministrator row has a visible textual explanation and no
  self-target, reset, deactivate, delete, demote or role-edit action.
- Fixed roles and access/credential states use readable text and semantics, not
  color, iconography or action absence alone. Backend authorization remains the
  enforcement boundary.

### Credentials and account mutations

- Username and password inputs have persistent labels, appropriate autocomplete,
  paste and password-manager support. Passwords are never trimmed, echoed in
  status, placed in URLs/storage, or revealed by default.
- Independent show/hide controls name their target and current action, preserve
  value/focus and retain 44px targets.
- Generic access and fresh-authorization failures prevent account enumeration.
  Governed failures clear sensitive fields without reading values in summaries.
- Account create, reset, deactivate and reactivate confirmations identify the
  target, consequences, session effect and reversibility without displaying any
  current, temporary or new credential.
- The account collection is one native table with username row headers and
  row-specific actions inside the same labelled overflow pattern approved for
  catalog tables.

### Focus, zoom and visual behavior

- Validation focuses a linked summary after submission; confirmed mutations move
  focus to the updated/new row or a surviving result status.
- Inline confirmation is sufficient. Any native modal implementation must contain
  focus, treat Escape/dismissal as Cancel and restore focus predictably.
- Forms and confirmations stack at 320px and remain usable at 200% zoom and with
  supported text spacing. Only the named account table region may overflow.
- All interactions use the released visible-focus, target-size, semantic status,
  contrast, reduced-motion and deterministic light-only contracts.

## Binding implementation conditions

Frontend SHALL preserve the reviewed native table, form, password, error-summary,
status, confirmation and focus contracts. Client visibility SHALL NOT authorize a
role, mutation or confirmed session, and sensitive credential values SHALL NOT be
persisted or echoed.

Product or account Cards, duplicated responsive collections, drag-only behavior,
self-service recovery, configurable roles, physical purge, dependency cascade,
optimistic persistence or duplicated media ownership require renewed review.

## Outcome

ACM-018, ACM-034 and the Accessibility portion of ACM-041 are approved and
complete with no open Accessibility blocker. The joint Design System
confirmation and independent production-build QA evidence pass.
