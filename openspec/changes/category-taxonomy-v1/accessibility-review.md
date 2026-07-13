# Category Taxonomy V1 — Accessibility Review

Status: Approved

Owner: Accessibility Review

Date: 2026-07-12

## Decision

Category Taxonomy V1 is approved against the project's WCAG 2.2 AA contract.
General Category, Category, Subcategory and Product Detail experiences preserve
semantic hierarchy, understandable branch context, keyboard access, visible
focus, reflow, target size and the verified light-only contrast system.

This approval covers Accessibility only. Final Release approval remains owned by
the Project Architect.

## Evidence

### Structure and meaning

- Every taxonomy page exposes one `main` landmark and exactly one `h1`.
- General discovery now introduces its card collection with an `h2`; Category
  and Subcategory results use sequential `h2` sections.
- Breadcrumbs use a labelled `nav`, ordered-list semantics, hidden visual
  separators and plain-text `aria-current="page"` items.
- Category, Subcategory and Product Type remain distinguishable through text and
  hierarchy, never color alone.
- Product Type is definition-list or supporting text and is not presented as an
  unsupported interactive destination.

### Keyboard, focus and targets

- Skip navigation moves directly to `#main-content`.
- DOM order follows context, branch choices, Products, recovery actions and Footer.
- Omitted and inactive branches do not remain as disabled or hidden focus targets.
- Breadcrumb and recovery destinations expose the shared 44 CSS-pixel minimum
  target contract; cards and controls meet or exceed it through shared components.
- The global `:focus-visible` contract provides a 3px semantic focus outline and
  offset without relying on color alone.

### Reflow, motion and contrast

- Breadcrumbs wrap, grids use `minmax(0, 1fr)`, and official Spanish labels are
  not truncated, preserving reflow without horizontal navigation strips.
- Mobile, Tablet and Desktop retain the same DOM and heading order.
- Existing reduced-motion rules disable non-essential transforms and transitions.
- Taxonomy pages consume the single verified light palette; the automated
  standard and inverse surface contrast suite remains green.

### States and recovery

- Empty general discovery and invalid or newly unavailable branches provide
  specific human-readable recovery actions.
- Empty Subcategory regions are omitted from the DOM instead of leaving an orphan
  heading or inaccessible hidden choices.
- Legacy continuity and retired Product behavior remain consistent with the
  approved migration decision.

## Verification

- `npx tsc --noEmit`: pass.
- `npm test`: 23 files and 108 tests pass.
- `npm run build`: pass for all taxonomy and existing catalog routes.
- Taxonomy UI coverage asserts heading sequence, breadcrumb meaning,
  `aria-current`, minimum target classes, omitted branches and recovery states.
- Existing contrast, focus, reduced-motion and responsive regression contracts pass.

Accessibility has no remaining owner action for CT-025 or CT-026.
