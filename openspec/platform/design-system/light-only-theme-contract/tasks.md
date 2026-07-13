# Implementation Tasks

Status: Complete

## Frontend

- [x] 1.1 Audit every consumer of `ThemeProvider`, `useTheme`, `ThemeMode`, `ThemePreference`, `theme-preference`, `.dark`, `dark:`, and `prefers-color-scheme`. — No productive consumers remain; regression coverage scans `pages/` and `src/`.
- [x] 1.2 Remove theme preference state, system-theme listeners, toggle behavior, persistence, and bootstrap theme selection. — `_app.tsx` now renders the page without a provider or bootstrap script.
- [x] 1.3 Remove the active dark semantic palette and `.dark` selector. — Removed from CSS and typed token exports.
- [x] 1.4 Preserve one complete light `:root` semantic palette and `color-scheme: light`.
- [x] 1.5 Remove dead dark variants and theme-specific branches after the consumer audit. — Removed Tailwind class-based dark configuration and runtime branches.
- [x] 1.6 Preserve inverse Header, contact, Carousel, and focus surface roles. — Semantic inverse and focus variables remain mapped and consumed.
- [x] 1.7 Remove or deprecate unused public theme APIs without breaking undocumented consumers silently. — Removed the unused runtime module and barrel export under the approved API deprecation contract.
- [x] 1.8 Ensure stale localStorage preference values cannot affect presentation. — Application code no longer reads or writes theme storage; visual regression script covers stale values under an emulated dark OS preference.

## Backend

- [x] 2.1 Confirm no backend or response contract change is required. — Backend review confirms the light-only presentation contract changes no domain model, persistence, API route, service predicate, or response payload.

## Design System

- [x] 3.1 Define the light-only proposal, design, and specification delta.
- [x] 3.2 Preserve semantic token, focus, inverse-surface, spacing, typography, radius, elevation, and motion contracts.
- [x] 3.3 Replace dark-mode guidance in active Design System documentation after architecture approval.
- [x] 3.4 Reclassify homepage and platform validation matrices from light/dark to light plus standard/inverse surfaces.
- [x] 3.5 Review the implemented single palette and approve token ownership. — `:root` is the sole palette owner; no runtime selector, dark palette, storage, or alternative theme API remains.

## QA

- [x] 4.1 Verify initial render remains light when the operating system prefers dark. — Browser automation confirms `color-scheme: light`.
- [x] 4.2 Verify a live operating-system preference change has no visual effect. — Scheme and semantic tokens remain stable.
- [x] 4.3 Verify stale stored preferences have no effect. — Light, dark and system stale values preserve the light contract.
- [x] 4.4 Verify no theme flash or hydration mismatch. — Isolated browser runs detect no hydration error.
- [x] 4.5 Validate homepage, category, Product Detail, and shared components in light mode. — Nine stored route/preference baselines pass.
- [x] 4.6 Validate standard and inverse surface contrast, focus, keyboard, reduced motion, and responsive states. — Runtime, contrast, component and eight-viewport evidence pass.
- [x] 4.7 Add assertions preventing reintroduction of `.dark`, `dark:`, system-theme listeners, and theme persistence. — Source-wide regression coverage rejects dark selectors and variants, color-scheme media behavior, theme storage, root theme mutation, and removed runtime APIs.

## Documentation

- [x] 5.1 Update `DESIGN_TOKENS.md`, `INTEGRATION_GUIDE.md`, `DECISIONS.md`, `CHANGELOG.md`, and Design System README.
- [x] 5.2 Update homepage visual foundations, validation, review, and remediation artifacts.
- [x] 5.3 Update or supersede the active theme-system and Tailwind token specifications after approval.
- [x] 5.4 Document removal or deprecation of public theme APIs.

## Validation Checklist

- [x] 6.1 Architecture Review approves replacement of the active multi-theme platform contract. — Light-only is the authoritative platform contract.
- [x] 6.2 Design System Review confirms a single complete light semantic palette. — Approved in `design-system-review.md` v1.1.
- [x] 6.3 Frontend Review confirms dead theme behavior and code are removed safely. — Productive source audit and automated regression assertions pass.
- [x] 6.4 Accessibility Review confirms WCAG AA for standard and inverse surfaces. — Automated contrast and runtime focus evidence pass.
- [x] 6.5 QA confirms light-only behavior, hydration stability, responsiveness, and regression coverage. — Final QA revalidation approved.
- [x] 6.6 Documentation contains no active promise of dark/system/manual theme support. — Remaining mentions are superseded history, deprecation guidance, or negative regression criteria.
- [x] 6.7 TypeScript, complete tests, and production build pass. — `tsc --noEmit`, 105 tests, and `next build` pass; homepage, category, and Product Detail return HTTP 200.
