# Catalog Media Admin V1 — Accessibility Design Review

Status: Approved — Design and Implementation Validation Complete

Owner: Accessibility Review

Date: 2026-07-13

## Decision

The independent Accessibility Review approves the Product and Category media
administration design described in `ui-design.md`. Together with the UX/UI
self-review, this closes the design gate CMA-018 and authorizes Frontend handoff
once the executable Backend contract is complete.

This approval validates the specified interaction and semantic contract.
Rendered keyboard, assistive-technology, zoom/reflow, target-size, contrast and
status conformance is independently approved under CMA-038 in
`accessibility-implementation-review.md` and `qa-review.md`.

## Review evidence

### Keyboard operation and focus

- The native single-file input remains labelled and keyboard operable; any drop
  target is supplementary and cannot replace it.
- Product ordering has explicit `Mover antes` and `Mover después` controls. Drag
  is optional, never the only method, and impossible moves remain natively
  disabled with understandable names.
- Stable Image keys preserve focus after a local move while DOM order follows
  the intended order. The new position is announced without moving focus.
- Submitted blocking errors focus a linked summary. Passive loading, preview and
  progress updates do not steal focus.
- Destructive confirmation defaults to the safe outcome. A native modal pattern,
  if selected, must trap focus, cancel on Escape and restore focus; the approved
  inline alternative follows ordinary document order.

### Names, descriptions and media semantics

- Persisted meaningful images use their approved alternative text. Preview,
  filename, position or Primary state never substitutes for the visible
  `Texto alternativo` label.
- Local previews are task-supporting content identified by the upload context,
  filename and state; they do not fabricate confirmed catalog alternative text.
- Broken, empty and legacy-media states retain visible text identity and do not
  remove the associated controls from use.
- Product Images remain one native ordered list. Each list item keeps position,
  alternative text, Primary state, Variant-reference state and its actions in
  one coherent accessible unit.
- Primary selection is one native fieldset/radio group with an explicit
  `Sin imagen principal` option and text-rich labels.

### Upload, status and recovery

- A determinate transfer uses labelled native `progress` with visible percentage;
  indeterminate work uses visible text and one polite status. Repeated values are
  not required as live announcements.
- Selected, uploading, temporary, saving, confirmed, failed, referenced and
  unsaved states are expressed in visible text and programmatic semantics rather
  than color, animation or thumbnail position alone.
- Upload completion remains explicitly distinct from confirmed catalog
  association. Error and conflict recovery preserve the last confirmed baseline
  and never claim partial success.
- Session expiry removes authorized content and returns to the existing access
  gate. Storage and authorization errors expose no provider or secret detail.

### Reflow, targets, contrast and motion

- The design requires one semantic DOM for each collection and action set; no
  hidden desktop/mobile duplicate remains in the accessibility tree.
- Mobile composition stacks previews, text, states and actions at 320 CSS pixels.
  Current/replacement comparisons stack in reading order and all long content
  wraps without horizontal page scrolling at 200% zoom and supported text
  spacing.
- Every interactive target retains the released 44 by 44 CSS-pixel minimum and
  visible global focus treatment. Adjacent safe/destructive actions retain at
  least 8px separation.
- The released semantic light palette is the only approved theme. Danger,
  success, border, text and focus roles inherit the validated Design System
  contrast contract.
- Motion is nonessential, reduced-motion compatible and never carries upload or
  ordering meaning by itself.

## Binding implementation conditions

Frontend implementation SHALL preserve the reviewed native file, ordered-list,
radio, progress, confirmation, error-summary and status semantics. It SHALL not
replace keyboard ordering with drag-only behavior, hide the file input from its
accessible contract, announce unconfirmed upload as catalog success, or create
duplicated responsive action trees.

Any material departure requires renewed Accessibility Review. CMA-038 rendered
validation is complete for keyboard, screen-reader, 320px, 200% zoom,
target-size, contrast, reduced-motion and light-only checkpoints.

## Outcome

CMA-018 and CMA-038 are approved. No Accessibility design or implementation
blocker remains.
