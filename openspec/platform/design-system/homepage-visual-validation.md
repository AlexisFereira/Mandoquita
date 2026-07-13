# Homepage Visual Validation

Version: 1.0

Status: Superseded

Owner: Design System Architect

Reviewed Against: Current implementation before token consolidation

Superseded By: `homepage-design-system-review.md`

---

# Purpose

This artifact records the Design System validation that can be completed before the frontend token migration. It identifies verified values, failures, regression risks, and the conditions required for final approval.

---

# Contrast Audit

Ratios were calculated using WCAG relative luminance. Normal text requires at least 4.5:1. Large text and essential graphical or focus cues require at least 3:1.

| Foreground | Background | Ratio | Result |
| --- | --- | ---: | --- |
| Light foreground `#181818` | Light background `#FAFAFA` | 17.01:1 | Pass |
| Light muted `#6B7280` | Light background `#FAFAFA` | 4.63:1 | Pass for normal text |
| Light foreground `#181818` | Surface `#FFFFFF` | 17.76:1 | Pass |
| Dark foreground `#FAFAFA` | Dark background `#111111` | 18.09:1 | Pass |
| Dark muted `#9CA3AF` | Dark background `#111111` | 7.44:1 | Pass |
| Dark foreground `#FAFAFA` | Dark surface `#181818` | 17.01:1 | Pass |
| White `#FFFFFF` | Current primary `#C46A4A` | 3.81:1 | Fail for normal text |
| White `#FFFFFF` | Inverse surface `#18120F` | 18.55:1 | Pass |
| Legacy text `#1F1A17` | Legacy background `#FFFAF5` | 16.62:1 | Pass |
| Legacy muted `#6D5F56` | Legacy background `#FFFAF5` | 5.92:1 | Pass |
| Legacy brand `#B45309` | White `#FFFFFF` | 5.02:1 | Pass |
| Legacy brand strong `#92400E` | White `#FFFFFF` | 7.09:1 | Pass |
| Legacy accent `#0F766E` | White `#FFFFFF` | 5.47:1 | Pass |

## Required correction

The current primary `#C46A4A` must not be used behind normal-sized white text.

Approved options are:

1. Use primary `#A8583D` with white text, producing 5.09:1.
2. Retain `#C46A4A` only for large text or non-text graphical emphasis where the 3:1 threshold applies.
3. Use a sufficiently dark foreground on `#C46A4A` after verifying the selected pair.

The preferred action treatment is `#A8583D` with white foreground because it preserves the established terracotta family and passes normal-text contrast.

## Focus validation condition

The current implementation uses several semi-transparent, component-specific focus rings. Their effective contrast changes with the underlying surface, so they cannot receive platform approval as a consistent focus system.

Final validation requires a shared opaque or predictably composited focus token that achieves at least 3:1 against both standard and inverse adjacent surfaces.

---

# Product Detail Regression Audit

Product Detail currently consumes shared Header, Footer, and ProductCard components, so changes to those components directly affect it.

It also consumes legacy or undefined design-system contracts:

- `.ds-layout-container`
- `.ds-text`
- `.ds-stack`
- `.ds-eyebrow`
- `.ds-heading`
- `.ds-heading-lg`
- `.ds-heading-md`
- `.ds-text-muted`
- `--ds-radius-lg` with a hardcoded fallback
- `--ds-color-primary` with a hardcoded fallback

The page also contains static inline spacing, typography, gradient, radius, and layout values.

## Migration constraint

Legacy aliases and classes must not be deleted during homepage consolidation until Product Detail is migrated or receives compatibility aliases. Removing them first would create visual regressions outside the homepage.

## Required regression states

After frontend migration, Design System review must inspect:

- Product Detail in the light theme, including standard and inverse surfaces.
- Breadcrumb text and link contrast.
- Product image fallback and radius.
- Product name, price, and description hierarchy.
- Related ProductCard appearance and focus state.
- Shared Header and Footer appearance.
- Mobile layout at 320 CSS pixels.
- Desktop layout at 1280 CSS pixels or greater.

---

# Shared Component State Audit

The following states require revalidation after token consolidation:

| Component | Required states |
| --- | --- |
| Button | Primary, secondary, outline, ghost, danger, hover, focus-visible, disabled, link rendering |
| Card | None/small/medium elevation, interactive hover, focus-within |
| Badge | Neutral, primary, success, warning, danger, info |
| Header | Desktop, mobile closed, mobile open, logo fallback, sticky state, keyboard focus |
| Carousel | Empty, single slide, multiple slides, paused, reduced motion, focus, image fallback |
| ProductCard | Featured, standard, missing description, image failure, focus, hover, reduced motion |
| CategoryCard | Image, no image, count, no count, compact, standard, focus |
| Footer | Mobile wrapping, desktop layout, focus, light theme and inverse-surface adjacency |

---

# Current Review Result

Design System approval is conditional and cannot yet satisfy the final Design System Review.

Completed without blockers:

- Current semantic text contrast audit.
- Identification of the failing primary action pair.
- Product Detail dependency and regression audit.
- Definition of required shared-component validation states.

Pending frontend implementation:

- Consolidation of token declarations.
- Replacement of hardcoded visual values.
- Shared focus token implementation.
- Complete reduced-motion styling.
- Product Detail compatibility or migration.

Final approval must be performed against the rendered implementation, not against token documentation alone.
