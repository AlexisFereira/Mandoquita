# Implementation Tasks

Status: Complete

Finalized: 2026-07-12

Owner: Project Architect

Source Artifacts:

- proposal.md
- requirements.md
- design.md
- blocker-resolution-tasks.md

## Frontend

- [x] 1.1 Capture the current homepage at representative mobile, tablet, and desktop widths as a review baseline. — Omitted by Project Architect decision; no historical pre-refresh baseline is available.
- [x] 1.2 Refactor the homepage into full-width sections with one internal container per section.
- [x] 1.3 Remove the nested homepage/Hero container and duplicated horizontal padding.
- [x] 1.4 Update homepage copy and navigation labels to approved discovery-oriented Spanish language.
- [x] 1.5 Redesign the Header with the approved identity treatment, simplified navigation, and compact mobile behavior.
- [x] 1.6 Redesign the Hero so the business offering and primary discovery actions remain the first visual focus.
- [x] 1.7 Render carousel slide title, description, and supported action within the visual composition.
- [x] 1.8 Refine carousel proportions and controls for mobile, tablet, and desktop.
- [x] 1.9 Simplify ProductCard hierarchy and provide one coherent detail-navigation affordance.
- [x] 1.10 Replace repeated category product groups with category-oriented cards using existing eligible category data.
- [x] 1.11 Add the approved WhatsApp contact section without transactional language.
- [x] 1.12 Replace the floating-card Footer with a restrained footer containing only valid destinations.
- [x] 1.13 Prevent empty featured, category, carousel, and contact UI from leaving headings or spacing artifacts.
- [x] 1.14 Add intentional product, banner, and logo fallback treatments without layout shift.

## Backend

- [x] 2.1 Confirm the visual refresh can use the existing homepage payload without changing eligibility rules.
- [x] 2.2 Expose only already-available category information required by the category presentation.
- [x] 2.3 Avoid database migrations and domain-rule changes as part of this visual change.
- [x] 2.4 Confirm missing optional media and descriptions are represented safely in the existing response contracts.

## Design System

- [x] 3.1 Inventory every CSS variable and token used by homepage components. — Documented in `platform/design-system/homepage-visual-foundations.md`.
- [x] 3.2 Select one authoritative semantic token family for color, typography, spacing, radii, shadows, and focus. — The channel-based semantic family is the approved source of truth.
- [x] 3.3 Remove or migrate duplicate `:root`, body, `.ds-surface`, and `.ds-card` declarations across `globals.css` and `theme.css`. — `theme.css` is the sole owner; automated assertions prevent regression.
- [x] 3.4 Map Tailwind semantic colors and component utilities to the authoritative CSS variables.
- [x] 3.5 Decide and document theme support for the homepage refresh. — Superseded by Project Architect decision: the platform and Homepage are light-only; inverse surfaces remain supported component roles.
- [x] 3.6 Load the approved heading and body fonts explicitly or define deterministic local fallbacks. — Deterministic local fallback chains are defined for this release.
- [x] 3.7 Define restrained elevation, radius, border, and motion rules for homepage components. — Rules and duration roles are documented in the visual-foundations contract.
- [x] 3.8 Replace large static inline-style objects with shared utilities or variants; preserve inline styles only for calculated runtime values. — Homepage components now retain inline styles only for carousel dimensions, transforms, loading opacity, and active-indicator state.
- [x] 3.9 Add shared focus-visible and reduced-motion behavior.
- [x] 3.10 Verify light-only token changes do not visually regress Product Detail or reusable component states. — Stored QA baselines cover Homepage, Category and Product Detail standard/inverse surfaces.

## Accessibility

- [x] 4.1 Make the skip link visible on keyboard focus.
- [x] 4.2 Verify landmark structure, heading order, link names, and DOM reading order.
- [x] 4.3 Verify keyboard operation of header navigation, mobile menu, carousel, product cards, categories, and contact CTA.
- [x] 4.4 Ensure carousel controls and other compact actions meet the 44 by 44 CSS-pixel target requirement where applicable.
- [x] 4.5 Verify WCAG AA contrast for text, muted text, borders used as cues, focus rings, and controls. — Completed in `ux-ui-review.md` v3 and protected by 28 automated assertions. Required text, action, status, focus, control, and primary interaction-border pairs pass; low-contrast generic borders are documented as supplemental decoration only.
- [x] 4.6 Implement and test `prefers-reduced-motion` behavior for carousel autoplay and transitions.
- [x] 4.7 Verify image alternatives and decorative fallback media semantics.

## Responsive and Performance

- [x] 5.1 Validate the homepage at 320, 375, and 430 CSS-pixel mobile widths. — Verified with exact CDP device metrics.
- [x] 5.2 Validate the homepage at representative tablet widths in portrait and landscape. — Verified at 768×1024 and 1024×768.
- [x] 5.3 Validate the homepage at 1280, 1440, and 1920 CSS-pixel desktop widths. — Verified with exact CDP device metrics.
- [x] 5.4 Confirm there is no horizontal overflow, clipped content, or sticky-header anchor obstruction. — Automated validation confirms equal client/scroll widths, sticky `top: 0`, and 88px anchor offsets.
- [x] 5.5 Confirm carousel and product media preserve stable aspect ratios without layout shift.
- [x] 5.6 Use responsive images, lazy loading below the fold, and priority loading only for critical above-the-fold media.
- [x] 5.7 Establish and document the validated post-refresh homepage load and layout-shift reference baseline for future regression comparisons. — Eight responsive and nine route/preference baselines are stored; isolated browser validation reports stable layout and no horizontal overflow.

## QA

- [x] 6.1 Preserve all existing homepage, catalog, product-detail, and carousel functional tests.
- [x] 6.2 Add tests for empty featured-product, category, carousel, and optional-content states.
- [x] 6.3 Add tests for Spanish navigation labels and valid destinations.
- [x] 6.4 Add tests for category-oriented rendering without repeated product-group sections.
- [x] 6.5 Add tests for the approved contact CTA and absence of transactional paths.
- [x] 6.6 Add tests for carousel slide content, manual controls, autoplay, pause behavior, single-slide fallback, and reduced motion.
- [x] 6.7 Add visual or screenshot regression checks for representative mobile, tablet, and desktop states. — Eight responsive and nine route/preference baselines are stored under `tests/visual/`.
- [x] 6.8 Add automated checks or review assertions preventing conflicting legacy token usage in homepage components.
- [x] 6.9 Verify invalid footer and unsupported navigation destinations are absent.

## Documentation

- [x] 7.1 Document the final homepage palette, typography, spacing, surface, and motion decisions. — See `platform/design-system/homepage-visual-foundations.md`.
- [x] 7.2 Document the authoritative CSS-variable and Tailwind mapping. — The semantic roles and required Tailwind mappings are documented in the visual-foundations contract.
- [x] 7.3 Record the theme decision and supported behavior. — Light-only is authoritative; system preference, stored state, and theme controls cannot alter presentation.
- [x] 7.4 Update shared component documentation for any changed Header, Carousel, ProductCard, CategoryCard, or Footer contract.
- [x] 7.5 Synchronize the homepage proposal, design, UX blueprint, blockers, and this change after final decisions are approved. — UX-owned artifacts now expose every eligible category without a presentation cap and record the deterministic light-only contract, including inverse surfaces as component roles rather than an alternative theme. Product Requirements and implementation-blocker artifacts are synchronized.
- [x] 7.6 Mark completed tasks in this artifact as implementation progresses.

## Validation Checklist

- [x] 8.1 Requirements Review confirms the change improves visual coherence without expanding business scope. — Approved by Product Requirements Architect: requirements, business rules, 8/4/4 limits, uncapped eligible Categories, commercial-availability behavior, discovery-only scope, light-only presentation, UX artifacts, implementation, and validation evidence are synchronized.
- [x] 8.2 Design Review confirms the page is premium, restrained, product-led, and recognizably Mandoquita. — Final approval recorded in `ux-ui-review.md` v4. Responsive density, uncapped eligible Categories, contrast, light-only presentation, and repeatable viewport evidence are synchronized; no UX/UI blocker remains.
- [x] 8.3 Design System Review confirms one authoritative token source and no conflicting homepage theme definitions. — Light-only Design System Review v1.1 approves one `:root` palette, semantic inverse roles, and removal of multi-theme runtime behavior.
- [x] 8.4 Frontend Review confirms component composition, responsive behavior, and styling patterns follow project conventions. — Productive source audit, responsive validation, public API assertions, TypeScript, tests, and production build pass.
- [x] 8.5 Accessibility Review confirms WCAG AA contrast, focus, keyboard, semantics, touch targets, and reduced motion. — Contrast, focus, component and responsive evidence pass.
- [x] 8.6 QA Review confirms functional, responsive, empty-state, navigation, and visual-regression coverage passes. — 105 tests, build, isolated browser validation and stored baselines pass.
- [x] 8.7 Release Review confirms no unsupported routes, transactional language, horizontal overflow, empty sections, or documentation drift remain. — Approved by Project Architect after Requirements Review. All discipline gates pass; TypeScript, 21 test files with 105 tests, production build, responsive baselines, light-only validation, and documentation synchronization are complete.
