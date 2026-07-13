# QA Visual Review — Light, Dark and Responsive

Status: Approved after final light-only revalidation

Reviewer: QA

Date: 2026-07-12

## Superseding Theme Decision

The Project Architect approved a light-only platform contract after this review. Dark-theme findings and dark-theme activation assertions are superseded. Light-theme defects remain valid until corrected, and QA must re-baseline Homepage and Product Detail using the light theme plus required standard and inverse surfaces.

## Scope

- Homepage at 320, 375, 430, 768, 1024, 1280, 1440 and 1920 CSS pixels.
- Homepage and Product Detail at 1440px in explicit light and dark themes.
- Sticky header, anchor offsets, featured-product density, horizontal overflow,
  theme activation, landmarks and visual rendering.

## Automated Evidence

The existing responsive validator passes all eight viewports:

- No horizontal overflow.
- Sticky header resolves to `position: sticky; top: 0`.
- Homepage anchors resolve to `scroll-margin-top: 88px`.
- Featured products resolve to four below 1280px and eight at or above 1280px.

The theme validator passes its structural assertions for Homepage and Product
Detail in both themes:

- Requested theme and `.dark` class agree.
- Semantic foreground, background and focus tokens change by theme.
- Main, header and footer landmarks exist.
- No horizontal overflow is reported.

## Blocking Visual Findings

### QA-VIS-001 — Header navigation lacks visual separation

Severity: High

The desktop header renders navigation labels as a visually continuous string
(`InicioDestacadosCategoríasContacto`). This weakens readability and target
differentiation in both reviewed pages.

Owner: React Frontend Architect / Design System Architect.

### QA-VIS-002 — Dark-theme header identity and navigation are not visible

Severity: Critical

The dark Homepage and Product Detail captures show an empty header bar even
though the elements remain in the DOM. A structural assertion therefore passes
while business identity and primary navigation are visually unavailable.

Owner: React Frontend Architect / Design System Architect.

### QA-VIS-003 — Hero actions have insufficient separation

Severity: High

The primary and secondary Homepage actions touch visually, reducing control
distinction and creating an unintended merged-control appearance.

Owner: React Frontend Architect.

### QA-VIS-004 — Dark carousel content is clipped or obscured

Severity: Critical

The dark Homepage capture shows the slide content region covered by a black
rectangle with title, description and action reduced to partial fragments.
The light rendering does not exhibit the same degree of obstruction.

Owner: React Frontend Architect / Design System Architect.

### QA-VIS-005 — Product Detail primary media is broken

Severity: High

Both Product Detail themes display the broken-image indicator and alternative
text instead of the required media fallback. The entity remains available, but
the approved presentation fallback is not applied on this page.

Owner: React Frontend Architect.

## Decision

Responsive structural checks pass, but visual light/dark QA fails. Do not mark
Homepage Visual Refresh task 6.7, Accessibility Review 8.5, QA Review 8.6 or
release review as complete. Stored screenshot baselines must be created only
after the blocking visual defects are corrected and the corrected captures are
approved.

## Revalidation — 2026-07-12

Frontend remediation corrected the responsive grid structure, Header spacing,
Hero action spacing, Carousel composition and Product Detail fallback in the
explicit light-theme capture. The responsive validator now records expected
one/two/four-column product grids and one/two/three-column category grids
without overflow across all eight viewports.

QA remains rejected because theme behavior regressed:

### QA-VIS-006 — Theme implementation is hardcoded to light

Severity: Critical

`src/design-system/theme.ts` resolves every `light`, `dark` and `system`
preference to `light`, removes the `.dark` class and overwrites storage with
`light`. This contradicts the active Theme System specification and Homepage
Visual Refresh task 3.5, which records light and dark as supported.

Owner: Design System Architect.

### QA-VIS-007 — Theme validator masks the regression

Severity: Critical

`scripts/validate-theme-regression.cjs` requests `light`, `dark` and `system`
but hardcodes `expectedTheme: "light"` for every case. The script therefore
passes when dark mode fails to activate and cannot serve as valid light/dark
regression evidence.

Owner: QA Engineer / Design System Architect.

### QA-VIS-008 — Requested-dark captures contain incomplete paint output

Severity: High

Although requested dark currently resolves to light, the corresponding
Homepage and Product Detail captures contain large black/unpainted regions and
intermittent missing media. These captures cannot become approved baselines.

Owner: React Frontend Architect / Design System Architect.

### Revalidation Decision

Responsive QA passes. Light-theme visual remediation is materially improved.
Light/dark QA, screenshot regression task 6.7, Accessibility Review 8.5, QA
Review 8.6 and release review remain blocked until the Design System restores
the approved theme contract and the validator independently fails incorrect
theme resolution.

## Reproduction

1. Run the application locally.
2. Start Chrome with remote debugging on port 9222.
3. Run `APP_URL=<local-url> node scripts/validate-responsive.cjs`.
4. Run `APP_URL=<local-url> node scripts/validate-theme-regression.cjs`.
5. Inspect the four generated Homepage/Product Detail light/dark captures.

## Final Revalidation — Approved

The approved light-only platform contract supersedes the historical
multi-theme expectation. QA revalidated after Design System and frontend
remediation.

- Dark operating-system preference still renders the supported light scheme.
- Live OS preference changes and stale light/dark/system storage values have no
  visual or semantic-token effect.
- No hydration error, local semantic override, overflow or clipped focus is
  detected.
- Homepage, Category and Product Detail pass standard/inverse surface review.
- Eight stored responsive baselines cover 320 through 1920 CSS pixels.
- Nine stored route/preference baselines cover the light-only compatibility
  matrix.
- Complete suite: 21 files and 105 tests pass.
- Production build and type validation pass.

QA-VIS-001 through QA-VIS-005 are resolved. QA-VIS-006 through QA-VIS-008 are
superseded by the approved light-only contract and corrected harness. Visual,
responsive and light-only QA gates are approved.
