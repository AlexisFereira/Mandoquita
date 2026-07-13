# Mandoquita Design System

This directory contains the typed foundations, theme runtime, layout values, documentation, decisions, and migration guidance for the shared visual system.

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

## Source files

- `tokens.ts`: typed primitive palettes and semantic theme decisions.
- `layout.ts`: shared layout values.
- `index.ts`: public Design System exports.

## Current status

The frontend runtime is fixed to light and normalizes legacy dark/system preferences. Final homepage Design System approval remains pending QA evidence for responsive visual regression, keyboard focus traversal, hydration, and contrast review in the supported light theme.

New work must use semantic roles, preserve accessibility behavior, and follow the migration plan. Do not add deprecated `--color-*` aliases or feature-specific token families.
