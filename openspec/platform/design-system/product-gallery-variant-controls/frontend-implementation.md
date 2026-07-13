# Product Gallery and Option Controls — Frontend Implementation

Status: Implemented

Owner: React Frontend Architect

Date: 2026-07-12

## Delivered contracts

- `Carousel` exports a discriminated promotional/gallery API while preserving
  `<Carousel slides={slides} />` behavior.
- Gallery mode supports stable identity, controlled and uncontrolled selection,
  direct media controls, current position, loading, missing media and per-item
  failure without autoplay or feature-domain inference.
- `Chip` preserves presentational and legacy removable behavior and adds a
  controlled option mode with programmatic selected/unavailable states.
- `PoliteStatus` provides reusable atomic polite announcements without focus movement.
- All public props and supporting item types are exported through the component barrel.
- Unavailable option controls use a dashed shape and programmatic explanation
  without whole-control opacity, preserving the focus token at full contrast.

## Compatibility and boundaries

- Homepage promotional Carousel behavior remains unchanged.
- Existing removable and presentational Chip consumers remain source compatible.
- Platform components contain no Product, Variant, taxonomy, SKU, inventory,
  pricing or commercial-availability resolution.
- Feature consumers retain responsibility for stable media order, selection,
  option vocabulary and valid-combination resolution.

## Verification

- `npx tsc --noEmit`: pass.
- `npm test`: 23 files and 119 tests pass after Product feature integration.
- `npm run build`: pass.
- Examples and migration guidance are synchronized in `docs/COMPONENT_EXAMPLES.md`,
  `INTEGRATION_GUIDE.md` and `MIGRATION_PLAN.md`.
- `PGOC-UI-001` is remediated and guarded by an automated assertion that a
  focusable unavailable option never receives a whole-control opacity utility.

PGOC-005 through PGOC-010 and the released feature handoff PGOC-016 are complete.
Product Detail consumes gallery, option and polite-status contracts while keeping
Variant resolution, Product Image association and content hierarchy in its feature layer.
