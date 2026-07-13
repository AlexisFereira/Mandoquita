# Design System Changelog

## 2026-07-13 — Scroll-entry Motion

- Added an opt-in, visible-by-default `ScrollEntryMotion` primitive.
- Added shared once-only observation, cleanup and a 50-element guard.
- Added reduced-motion, focus, hash-target and unsupported-observer fallbacks.
- Added bounded opacity/8px translation CSS and approved feature adoption.

## 2026-07-13 — Governed Icon System

- Added a closed semantic `IconName` registry backed by named `lucide-react` imports.
- Added discriminated decorative and informative accessibility modes.
- Added governed 16px, 20px and 24px sizes, current-color inheritance and an
  unfocusable inline composition contract.
- Preserved existing arbitrary icon slots during incremental migration.

All notable Design System contract and documentation changes are recorded here.

## Unreleased

### Added

- Authoritative homepage visual-foundations contract.
- Shared Header, Carousel, ProductCard, CategoryCard, and Footer contracts.
- WCAG contrast and Product Detail regression audit.
- Token reference, integration guide, design decisions, component examples, and migration plan.
- Approved light-only platform contract and migration guidance.

### Decisions

- Channel-based semantic CSS variables are the target source of truth.
- Light is the only supported application theme; theme selection and system-theme behavior are removed from the contract.
- Deterministic local sans-serif fallback chains are approved.
- Primary 600 is preferred behind normal-sized white action text.

### Deprecated

- New consumption of legacy `--color-*` aliases.
- Static visual values inside homepage components.
- Independent component-level theme resolution.
- ThemeProvider, useTheme, ThemeMode, ThemePreference, toggle, and stored theme-selection behavior.

### Pending

- Consolidation of duplicate root, body, surface, and card declarations.
- Semantic Tailwind mapping.
- Shared focus-visible implementation.
- Product Detail compatibility migration.
