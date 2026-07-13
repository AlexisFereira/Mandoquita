# Product Gallery and Option Controls — Design

Status: Implemented and Released

Owner: Design System Architect

## Component strategy

The library SHALL extend `Carousel` and `Chip`; it SHALL NOT add Product-specific
components. Existing promotional behavior remains the default for compatibility.

### Carousel gallery mode

`Carousel` gains a discriminated public API with two modes:

- `mode="promotional"` preserves the existing slide-content and autoplay contract.
- `mode="gallery"` accepts media items, never autoplays, and supports direct and
  externally requested selection.

The gallery API must support:

- stable item identity independent of array index;
- `activeItemId` plus `onActiveItemChange` for controlled use;
- `defaultActiveItemId` for uncontrolled use;
- an accessible region label;
- ordered direct controls, optionally rendered as thumbnails;
- current position and total count;
- a feature-provided request to focus an associated item without moving DOM focus;
- per-item loading and failure outcomes;
- a missing-media outcome when the item collection is empty.

Changing the controlled item changes presentation only. It must not infer or
change any feature selection.

### Chip option mode

`Chip` gains an interactive `option` mode while preserving its presentational and
removable modes. Option chips are composed by Frontend within a native labelled
`fieldset`/`legend` or an equivalent accessible radiogroup.

The option contract must support:

- stable value;
- selected state controlled by the parent;
- `onSelect(value)`;
- unavailable-combination state distinct from native `disabled` processing;
- explanatory accessible text supplied by the consumer;
- wrapping long labels without truncation;
- at least 44 by 44 CSS-pixel targets.

Unavailable means the choice cannot lead to a valid feature-defined combination.
It must not be labelled or styled as stock, inventory, sold out, or commercial
availability. Inactive or hidden domain choices are never passed to this control.

### Status composition

Selection resolution and media failure use a persistent or visually-hidden polite
status region (`role="status"` or `aria-live="polite"`). Updates never steal focus.
Repeated status content must not be emitted when no meaningful state changed.

## Visual contract

- Main media uses a stable aspect-ratio frame and the existing large radius.
- Thumbnail controls use existing surface, border, foreground, muted, primary,
  focus, and radius roles; no new color token is approved.
- Selected state uses at least two cues: programmatic state plus border/shape or
  indicator. Color alone is insufficient.
- Focus-visible treatment remains distinct from selected state.
- Loading skeletons use existing surface/muted roles and do not create selectable
  placeholder items.
- Missing and failed media use the shared media frame without becoming actions.
- Motion is limited to short state transitions and is removed under reduced
  motion. Gallery mode never advances on a timer.

## Responsive contract

- Semantic and DOM order remains stable across breakpoints.
- Direct controls may wrap or become a non-clipping scroll region, but the main
  image and option meaning must not require horizontal page scrolling.
- Long Spanish labels wrap at 200% zoom.
- No duplicate hidden gallery or option group may be rendered for breakpoint
  changes.

## Compatibility

The implementation should use a discriminated union so promotional-only props
cannot be combined with gallery-only props. Existing `slides` consumers continue
to compile without behavior changes during migration; deprecation, if desired,
requires a later approved change.
