# Catalog Media Admin V1 — Design System Sufficiency Review

Status: Approved — Existing Composition Is Sufficient

Owner: Design System Architect

Date: 2026-07-13

## Decision

`CMA-015` is approved. Catalog Media Admin V1 can be designed and implemented
with released Design System components, semantic tokens, accessibility
foundations, and native file/form/progress/dialog semantics. No separate Platform
change is required for V1.

The approved experience explicitly requires keyboard-operable ordering controls
and does not depend on drag-and-drop. It manages one file at a time, does not
introduce a reusable media library, cropper, editor, bulk uploader, or visitor
upload capability, and therefore does not demonstrate a reusable Platform gap.

## Approved composition matrix

| Media administration need | Approved composition |
| --- | --- |
| Select one local file | Native labelled `input type="file"` with visible accepted-format/size guidance and associated validation; Button styling may visually support the label but must not hide the native accessible input contract |
| Local or persisted preview | Stable media frame using existing surface, border, radius, muted, image-fallback and light-only roles; meaningful persisted images retain approved alternative text |
| Product gallery inspection | `Carousel mode="gallery"` may inspect a selected persisted collection when useful, but remains non-editing and never owns order, Primary, replacement, removal, upload, or dirty state |
| Complete editable gallery | Native ordered list of `Card` summaries; every Image keeps preview, alternative text, ordinal position, Primary/reference context and actions together |
| Move before/after | Existing `Button` or labelled native buttons with text-first `Mover antes` / `Mover después`; first/last impossibility uses native disabled state plus an understandable name/reason |
| Direct position choice | Native labelled number/select composition only if UX/UI chooses the equivalent accessible position-control path |
| Primary selection | Native radio group/fieldset with an explicit `Sin imagen principal` choice when demotion is allowed; Feature owns controlled value and Product rule |
| Alternative text | Existing `Input` for the 1–240 character field, helper/error association and invalid state; filename and preview never replace the visible label |
| Replace or add actions | Existing `Button`, native file input and stable preview; replacement identity and association state remain Feature/Backend-owned |
| Removal | Existing danger `Button` followed by an inline or native-dialog confirmation with explicit entity/action text; no icon-only confirmation and no optimistic disappearance |
| Variant-reference denial | Visible inline error/explanation using semantic danger roles and native alert/error composition; disabled/removal denial is not communicated by opacity alone |
| Upload progress | Native labelled `progress` when measurable; indeterminate visible text plus `PoliteStatus` when not measurable; progress is never inferred from animation alone |
| Upload/save success | Visible inline confirmation plus `PoliteStatus`; only server-confirmed catalog association may use confirmed/success language |
| Validation, storage, conflict and authorization errors | Native alert/error summary, associated field errors and approved recovery Buttons; focus changes only for submitted blocking outcomes defined by UX/Accessibility |
| Loading and unavailable preview | Existing skeleton/media-fallback roles with reduced-motion behavior; Image identity and non-media controls remain operable |
| Unsaved changes and cancellation | Existing Product Admin dirty-state/confirmation composition; temporary upload and confirmed catalog state remain textually distinct |

## Binding visual and interaction rules

- Reuse only the active semantic light palette, spacing, typography, radius,
  border, focus, status and motion roles. No media-admin palette or one-off status
  tokens are approved.
- Every interactive target is at least 44 by 44 CSS pixels and retains the global
  focus-visible treatment.
- Preview aspect ratio and object fit may preserve source meaning; previews must
  reserve stable space and cannot become the sole control label.
- Selected, Primary, unsaved, uploading, temporary, failed and confirmed states
  require visible text and programmatic state. Color, border, thumbnail position,
  filename or animation alone is insufficient.
- Ordering controls preserve DOM/list order, keyboard focus and Image identity.
  Moving an item does not move focus unexpectedly; the new intended position is
  announced politely.
- Pointer drag may be supplementary only. It may not replace the approved buttons
  or accessible position control, and no drag-and-drop Platform primitive is
  authorized by this review.
- Upload progress uses no continuous decorative motion requirement and respects
  reduced motion. Percentage text remains readable when measurable.
- Labels, alternative text, errors, filenames and recovery actions wrap at 320px
  and 200% zoom without horizontal page overflow.
- No hidden duplicate desktop/mobile gallery, file input, Primary control or
  action set may remain in the accessibility tree.

## Destructive confirmation contract

Removal confirmation is feature composition rather than a new Modal capability.
It SHALL:

- name the Product Image or Category Image context and state that confirmed
  removal has no maintainer-visible undo promise;
- use one explicit destructive confirmation and one cancel/keep action;
- keep cancel as the safe initial outcome and never confirm on dialog dismissal;
- trap/restore focus only when a modal native-dialog pattern is selected and
  independently validated;
- leave Variant-referenced Product Image removal unavailable and explain the
  reference restriction instead of offering a confirmation that cannot succeed;
- preserve the last confirmed preview and catalog state until Backend confirms
  removal.

An inline confirmation region is equally acceptable and avoids requiring a
shared Modal component.

## Ownership boundaries

- Catalog Media Admin owns file selection, local object-URL lifecycle, progress,
  order/Primary intent, dirty state, labels, validation copy and recovery flow.
- Backend owns authorization, file verification, upload/association lifecycle,
  concurrency, identity, storage, reference protection and confirmed persistence.
- `Carousel` owns inspection only; it SHALL NOT gain admin mutation props.
- Design System owns the shared visual, interaction and accessibility foundations
  recorded here.
- Frontend may create feature composition helpers but SHALL NOT export a competing
  uploader/gallery/editor library or add feature-specific tokens.
- A future bulk uploader, reusable media library, cropper/editor, cross-feature
  drag reorder, or proven repeated upload primitive requires a separate Platform
  proposal.

## Accessibility and design handoff

This decision confirms Design System sufficiency and unblocks `CMA-016` and
`CMA-017`; it does not replace `CMA-018`. Joint Design/Accessibility Review must
still validate file-input keyboard operation, preview semantics, alternative-text
association, ordering announcements and focus, Primary radio semantics, progress,
confirmation, errors, targets, 320px reflow, 200% zoom, contrast and light-only
behavior.

## Outcome

No Design System blocker remains for responsive UX/UI design or Frontend
estimation. Frontend implementation remains dependent on the approved Design/
Accessibility and Backend handoffs recorded in `tasks.md`.

