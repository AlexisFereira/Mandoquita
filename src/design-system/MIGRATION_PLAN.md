# Design System Migration Plan

## Goal

Move existing consumers to one semantic token and theme contract without breaking the homepage, Product Detail, or shared component states.

## Phase 1 — Inventory and compatibility

- Record every consumer of channel variables, legacy `--color-*` aliases, and `--ds-*` aliases.
- Record duplicate global selectors and hardcoded visual values.
- Keep compatibility aliases for Product Detail until it is migrated.
- Establish screenshot baselines for shared pages and component states.

Exit condition: every legacy contract has a known consumer and target replacement.

## Phase 2 — Authoritative foundation

- Make one stylesheet the owner of semantic root declarations.
- Make `:root` the only supported palette owner.
- Add all approved semantic roles, including focus and inverse surfaces.
- Map Tailwind semantic utilities to those variables.
- Preserve temporary aliases without allowing new consumption.

Exit condition: new work needs no static semantic visual values.

## Phase 3 — Shared primitives

Migrate in dependency order:

1. Button and Input focus/state treatments.
2. Card, Badge, and Chip.
3. Container, Section, and SectionHeader.
4. Header and Footer.
5. Hero, Carousel, ProductCard, and CategoryCard.

Verify every documented variant and state in light, standard/inverse surfaces, keyboard, and reduced-motion conditions.

Exit condition: shared primitives consume only authoritative roles.

## Phase 4 — Feature consumers

- Migrate homepage composition and application metadata.
- Migrate Product Detail legacy classes and `--ds-*` fallbacks.
- Audit catalog and category pages.
- Remove large static inline styles except calculated runtime values.

Exit condition: feature code contains no deprecated visual contracts.

## Phase 5 — Removal and validation

- Remove unused legacy aliases and duplicate selectors.
- Run functional, accessibility, contrast, responsive, and visual-regression checks.
- Confirm no color flash or layout shift during hydration.
- Update the changelog and task artifacts through their owners.

Exit condition: one light token source, no theme-selection path, no undocumented compatibility layer, and final Design System approval.

## Rollback

Each phase must remain independently reversible. Compatibility aliases are removed only in the final phase. If a shared-component regression appears, restore its last compatible mapping without reintroducing a new token family.

## Gallery and option API migration

- Promotional Carousel consumers require no change; omitted `mode` retains the existing `slides` behavior.
- New galleries use `mode="gallery"` with stable media IDs. Do not translate promotional slides into gallery items unless the consuming feature owns that content decision.
- Presentational Chip and legacy `removable` consumers require no change.
- New single-selection choices use `mode="option"` inside a labelled group. Selection and unavailable-combination resolution stay in the consuming feature.
- Status announcements migrate to `PoliteStatus`; updates must be concise and must not trigger focus movement.
- Removing the compatibility forms requires a separate approved deprecation change.
