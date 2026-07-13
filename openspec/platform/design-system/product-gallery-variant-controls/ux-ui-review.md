# Product Gallery and Option Controls — UX/UI Review

Version: 1.1

Status: Approved

Owner: Senior UI/UX Designer

Date: 2026-07-12

Reviewed against:

- Approved Platform proposal, design and component-library delta.
- Product Content and Variants V1 `ui-design.md`.
- `Carousel` gallery implementation.
- `Chip` option implementation.
- `PoliteStatus` implementation.
- Component examples, integration guide and migration plan.
- 23-file, 116-test automated suite.

## Review Outcome

Gallery presentation, responsive composition, long-label behavior, loading,
missing media, failed media, selected states and the remediated unavailable Option
state satisfy the approved visual contract. `PGOC-012` is approved.

## Passed Visual States

### Gallery structure and responsive behavior

- The main media frame uses a stable square aspect ratio, existing surface roles
  and the approved large visual treatment.
- Media uses `object-contain`, preserving Product meaning without forced crop.
- Direct controls wrap instead of producing horizontal page overflow.
- Controls use stable order, minimum 44px targets and distinct selected state.
- Thumbnail imagery is decorative within a control whose accessible name remains
  feature-provided or position-based.
- One Image omits unnecessary navigation; no Images preserve a stable,
  non-interactive media frame.
- DOM structure does not duplicate gallery instances across breakpoints.

### Long labels and Option layout

- Option Chips use `max-w-full` and `whitespace-normal`.
- Content wraps instead of truncating with an ellipsis.
- Option controls retain a minimum 44px height.
- The parent composition can wrap groups with shared spacing without changing
  source or focus order.

### Loading, missing and failed media

- Loading reserves the main media frame and uses a non-interactive skeleton.
- Reduced motion removes skeleton animation and media transition.
- Missing media renders no direct controls.
- Failed current media keeps remaining controls available.
- Failure text is visible and repeated in a polite status region without focus
  movement.

### Selected state

- Gallery selection uses a 3px primary border plus `aria-pressed` and hidden
  current-state text.
- Option selection uses primary border, supporting surface tint, check indicator
  and `aria-checked`.
- Selected and focus-visible cues are structurally different.
- Primary against surface exceeds the required 3:1 interaction-cue threshold.

### Regression and compatibility

- Promotional Carousel retains its previous behavior.
- Presentational and removable Chip modes remain available.
- Gallery mode contains no timer or autoplay behavior.
- Automated suite passes: 23 files and 116 tests.

## Blocking Finding

### PGOC-UI-001 — Unavailable Option opacity weakens focus below WCAG AA

Status: Resolved and revalidated.

Original severity: Release blocking for PGOC-012.

The unavailable Option class applies `opacity-60` to the complete button:

`border-dashed opacity-60`

Because the unavailable Option intentionally remains keyboard focusable for
recovery context, opacity also composites its global focus outline and border
against the underlying surface.

Calculated effective contrast on white surface:

| Cue after 60% opacity | Effective color | Contrast | Requirement | Result |
| --- | --- | ---: | ---: | --- |
| Foreground text | `rgb(116 116 116)` | 4.67:1 | 4.5:1 | Pass, marginal |
| Focus token | `rgb(111 173 168)` | 2.56:1 | 3:1 | Fail |
| Primary interaction border | `rgb(203 155 139)` | 2.44:1 | 3:1 | Fail |

Required correction:

- Do not apply opacity to the complete focusable Option control.
- Preserve the shared focus token at full opacity.
- Preserve readable text at 4.5:1 or higher.
- Communicate unavailable state using dashed shape/border plus text/programmatic
  explanation; color or fading alone is insufficient.
- If reduced emphasis is required, apply an approved semantic color separately to
  non-focus content and verify its effective contrast.
- Add an automated assertion preventing whole-control opacity on focusable Option
  states or directly validating effective unavailable focus contrast.

Owner: React Frontend Architect.

### Remediation evidence

Frontend removed whole-control `opacity-60` and retained:

- full-opacity foreground and focus tokens;
- dashed unavailable shape cue;
- `aria-disabled` and an accessible explanatory description;
- non-inventory language;
- minimum 44px target and long-label wrapping.

Revalidated contrast on the white surface:

| Cue | Contrast | Requirement | Result |
| --- | ---: | ---: | --- |
| Foreground text | 17.76:1 | 4.5:1 | Pass |
| Focus token | 5.47:1 | 3:1 | Pass |
| Primary interaction cue when applicable | 5.09:1 | 3:1 | Pass |

The component test now asserts that unavailable Options retain the dashed cue and
receive no whole-control opacity utility.

## Revalidation Completed

Senior UI/UX Designer verified:

1. Unavailable default, hover and focus-visible states on the light surface.
2. Selected, unavailable and focus cues remain distinguishable from one another.
3. Long unavailable labels still wrap at 200% zoom.
4. The 44px target and programmatic unavailable explanation remain intact.
5. Existing gallery, promotional Carousel and other Chip modes do not regress.

## Decision

`PGOC-012` is approved. Responsive gallery states, long labels, loading, missing
and failed media, selected/unavailable distinction and contrast satisfy the
Platform contract. The complete automated suite passes with 23 files and 116 tests.
No UX/UI blocker remains for Design System Review or QA validation.
