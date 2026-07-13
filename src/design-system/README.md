# Mandoquita Design System

This directory contains the typed foundations, fixed light theme, layout values, governed Icon and Motion contracts, documentation, decisions, and migration guidance for the shared visual system.

## Start here

- [Design token reference](./DESIGN_TOKENS.md)
- [Integration guide](./INTEGRATION_GUIDE.md)
- [Design decisions](./DECISIONS.md)
- [Migration plan](./MIGRATION_PLAN.md)
- [Changelog](./CHANGELOG.md)
- [Component examples](../../docs/COMPONENT_EXAMPLES.md)

## Platform contracts

- [Homepage visual foundations](../../openspec/platform/design-system/homepage-visual-foundations.md)
- [Homepage component contracts](../../openspec/platform/design-system/homepage-component-contracts.md)
- [Current Design System review](../../openspec/platform/design-system/homepage-design-system-review.md)
- [Frontend remediation handoff](../../openspec/platform/design-system/homepage-frontend-remediation-tasks.md)
- [Governed Icon System](../../openspec/platform/design-system/icon-system/proposal.md)
- [Scroll-entry Motion](../../openspec/platform/design-system/scroll-entry-motion/proposal.md)
- [Product Gallery and Option Controls](../../openspec/platform/design-system/product-gallery-variant-controls/proposal.md)

## Source files

- `tokens.ts`: typed primitive palettes and semantic theme decisions.
- `layout.ts`: shared layout values.
- `index.ts`: public Design System exports.

## Current status

The runtime is fixed to one light semantic palette with no theme selector,
preference persistence, or system-theme behavior. Product Gallery, Scroll-entry
Motion, and Governed Icon System have passed Design System review. The neutral
payment-information glyph remediation recorded as `ICON-DS-001` is complete.

New work must use semantic roles, governed component APIs, preserve accessibility
behavior, and follow the migration plan. Do not add deprecated `--color-*` aliases,
feature-specific token families, direct `lucide-react` feature imports, or local
viewport-observation logic.
