# Admin Catalog Management V2 — Design System Sufficiency Review

Status: ACM-015 Approved — Existing Composition Is Sufficient

Owner: Design System Architect

Date: 2026-07-13

## Decision

`ACM-015` is approved. Admin Catalog Management V2 can use the released Design
System, Product Admin form composition, Catalog Media Admin composition and native
table/form/dialog semantics. No separate Platform change is required.

A generic `DataTable` component is not justified. Product, Category and account
collections have different columns, row identities, dependency/lifecycle rules
and actions, while their shared need is semantic HTML and token styling rather
than reusable sorting, selection, bulk mutation or column-management behavior.
Native tables preserve those relationships with less abstraction risk.

## Approved composition matrix

| V2 need | Approved composition |
| --- | --- |
| Product and Category collections | One native table per collection with caption, column headers, row header and row-bound cells/actions |
| Constrained viewport | Named, instructed, keyboard-scrollable region around the same table; no duplicated mobile DOM or Card rows |
| Search and filters | Existing `SearchInput`, native labelled controls, `Button` and removable `Chip` composition |
| Result and lifecycle states | Existing text-first `Badge`, visible result text and `PoliteStatus`; no color-only state |
| Pagination | Native labelled navigation with existing `Button`/link composition, visible current-page text and `aria-current` where applicable |
| Product/Category create and edit | Released Product Admin `Input`, native textarea/select/checkbox/fieldset/error-summary composition and grouped `Card` surfaces |
| Product/Category media | Link to the released Catalog Media Admin capability; no duplicate uploader, preview ownership or gallery mutation API |
| Retirement/restoration | Existing danger/secondary Buttons plus inline or independently validated native-dialog confirmation |
| Dependency-blocked Category retirement | Visible dependency counts and reason; absent or disabled destructive action is never explained by opacity alone |
| Loading, empty, no-match and failure | Stable native table/collection region, visible state copy and approved retry/recovery Buttons |
| Success, conflict and session expiry | Visible inline outcome plus `PoliteStatus` for non-interruptive updates; native alert/error-summary and governed focus for blocking outcomes |

## Native data-table contract

Every Product, Category or account table SHALL:

- use native `table`, `caption`, `thead`, `tbody`, `tr`, `th` and `td` elements;
  no redundant ARIA table/row/cell roles are added;
- use `scope="col"` for column headers and one meaningful `scope="row"` identity
  per row;
- keep actions in the row they affect and give every action a distinguishable
  text label including the entity or account context;
- remain one table at desktop, tablet, mobile, 320 CSS pixels and 200% zoom;
- place horizontal overflow only on a visible-labelled/instructed region that is
  keyboard focusable when it overflows and uses the shared focus token;
- preserve wrapping for names, slugs, SKU, taxonomy, status and actions; no
  required value is silently ellipsized;
- use existing surface, foreground, muted, border, primary, status, focus,
  spacing and typography roles with no Admin-only palette or table token family;
- preserve at least 44 by 44 CSS-pixel action targets and visible focus without
  sticky cells covering focused content;
- contain no row-selection checkbox or bulk-action affordance in V2;
- mark collection loading/busy state without fabricating Product, Category,
  account or action content;
- announce confirmed range/page changes politely without moving focus
  unexpectedly.

Product/Card responsive conversion, duplicated mobile summaries, detached row
actions and breakpoint-dependent semantic order are prohibited.

## Form and validation contract

The released Product Admin sufficiency decision remains authoritative:

- `Input` handles text, password, decimal, slug, currency and SKU inputs.
- Native textarea/select/checkbox/fieldset composition reuses the Input visual,
  helper, invalid, disabled and focus roles.
- Submitted multi-field errors use one focusable summary with field links plus
  associated inline messages; client validation never replaces Backend authority.
- Required meaning, dirty state, disabled reason and validation cannot rely on
  placeholder, color, icon or opacity alone.
- Save/create preserves values while pending, prevents duplicates and claims
  success only from the confirmed server baseline.
- Product/Category business rules, aliases, lifecycle, Variant/SKU creation,
  dependencies and concurrency remain outside Design System.

## Destructive and restorative actions

Retirement, restoration and account lifecycle confirmation SHALL:

- use action-specific language rather than generic `Eliminar` when the operation
  is reversible retirement/deactivation;
- identify the affected Product, Category or Administrator and list the approved
  impact before confirmation;
- present safe cancel/keep before the destructive or state-changing confirmation;
- never confirm on dismissal and never remove the current row/state before server
  confirmation;
- restore focus predictably to the initiating control or confirmed destination;
- expose dependency or self-protection denial as text and omit/disable actions
  that cannot succeed;
- use the danger role only for destructive confirmation, not ordinary cancel,
  restore or navigation.

An inline confirmation is sufficient. A shared Modal component is not required
or authorized by V2.

## Responsive and visual boundaries

- The isolated Admin shell remains light-only and consumes the same semantic
  palette, focus and reduced-motion contracts as public surfaces.
- Page controls may stack, but table relationships and row action ownership do
  not change across breakpoints.
- At 320px/200% zoom, page content does not scroll horizontally; only the labelled
  table region may do so.
- Sticky actions/columns are optional and must disengage before covering content,
  focus, messages or browser UI.
- Loading motion is non-essential and reduced-motion safe.
- Text, validation, dependency counts, passwords guidance and confirmation impact
  wrap without truncation.

## Ownership and future Platform trigger

- Features own columns, labels, queries, filters, fields, lifecycle rules,
  permissions, row actions and recovery journeys.
- Backend/Security own authorization, role enforcement, password policy,
  concurrency, aggregate commands and audit.
- Design System owns the presentation/accessibility foundations recorded here.
- Frontend may build feature composition helpers but SHALL NOT export a competing
  generic DataTable/form/dialog library or add Admin-only tokens.
- A future reusable table capability requires at least one shared behavior beyond
  native semantics—such as governed sorting, selection, virtualization or column
  management—plus a separate Platform proposal and accessibility review.

## Outcome

No Design System blocker remains for catalog UI Design or Frontend estimation.
`ACM-018` still requires independent Accessibility approval.

