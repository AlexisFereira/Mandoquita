# Frontend Design System Cleanup Tasks

Version: 1.0

Status: Complete

Requested By: Design System Architect

Implementation Owner: React Frontend Architect

Validation Owners: Design System Architect and QA Engineer

Source: `design-system-pending-validation.md`

---

# Objective

Resolve platform validation tasks 14.3, 14.4, 15.3, and 15.4 without redesigning pages or changing business behavior.

---

# P1 — Remove Component Hardcodes

- [x] CLEAN-01 Replace the literal selected background in `Chip.tsx` with the semantic primary token and approved opacity composition.
- [x] CLEAN-02 Replace the literal removable-indicator background in `Chip.tsx` with a semantic foreground or inverse role and approved opacity composition.
- [x] CLEAN-03 Audit page `theme-color` metadata and define one documented metadata-color constant or theme-aware strategy.
- [x] CLEAN-04 Classify the selection and page-background gradient literals as authoritative global decorative tokens or migrate them to reusable semantic variables.
- [x] CLEAN-05 Add automated assertions preventing new hexadecimal and numeric RGB color literals inside shared component implementation.

Acceptance:

- Shared components contain no static color literals.
- Global decorative primitives have one documented owner.
- Metadata color is not independently duplicated across pages.
- Calculated Carousel values remain allowed.

---

# P1 — Product Detail Inline-Style Migration

- [x] CLEAN-06 Replace the Product Detail skip-link inline implementation with the shared `.skip-link` contract.
- [x] CLEAN-07 Replace static page padding, breadcrumb spacing, grid, gap, and section spacing inline values with existing layout utilities or shared components.
- [x] CLEAN-08 Replace the product-media gradient, radius, sizing, and object-fit inline values with semantic utilities or a documented shared media variant.
- [x] CLEAN-09 Replace static product information typography and spacing inline values with typography and spacing contracts.
- [x] CLEAN-10 Preserve Product Detail content, routes, data, structured data, and responsive behavior unchanged.
- [x] CLEAN-11 Add an assertion that Product Detail contains no static `style={{ ... }}` blocks after migration.

Acceptance:

- Product Detail retains no static inline visual styles.
- No business, content, route, data, or backend behavior changes.
- Mobile and desktop layout remain usable in light and dark themes.

---

# P1 — Public Component APIs

- [x] CLEAN-12 Complete API-01 through API-05 in `component-api-remediation-tasks.md`.
- [x] CLEAN-13 Include `ProductOfferProps` in the public type export validation.

Acceptance:

- Every configurable reusable component exports a named props type.
- The component barrel exposes those types.
- Runtime behavior remains unchanged.

---

# P2 — Cascade Integration Evidence

- [x] CLEAN-14 Add a browser-level or equivalent integration test mounting nested standard and inverse surfaces.
- [x] CLEAN-15 Verify computed foreground, muted, primary, focus, status, and inverse values in light and dark resolved themes.
- [x] CLEAN-16 Verify nested components do not install local semantic palette overrides.
- [x] CLEAN-17 Verify focus remains visible and unclipped inside nested Card, Header, Carousel, and ProductCard surfaces.

Acceptance:

- Computed values demonstrate inheritance from the resolved root theme.
- Standard and inverse nested states pass contrast requirements.
- No component creates a competing local palette.

---

# Required Verification

- [x] CLEAN-18 Run `npx tsc --noEmit`.
- [x] CLEAN-19 Run the complete automated test suite.
- [x] CLEAN-20 Run the production build.
- [x] CLEAN-21 Hand off changed-file evidence and test output to Design System and QA.

## Frontend evidence — 2026-07-12

- Hardcode and metadata ownership: `Chip.tsx`, `globals.css`, `theme.css`, and `metadata.ts`; guarded by `visual-hardcodes.test.ts`.
- Product Detail: static inline styles removed, shared skip link and Container adopted, and media fallback added.
- Component APIs: eight named props contracts are exported through `src/components/index.ts`; guarded by `public-component-api.test.ts`.
- Cascade harness: `validate-theme-regression.cjs` records inherited standard/inverse semantic values, local overrides, and unclipped keyboard-focus evidence. It now requests `light`, `dark`, and `system` and requires every case to resolve to the supported light runtime.
- Browser evidence: the responsive validator covers eight viewports and asserts card columns, container/card padding, grid gaps, Button height, Header spacing, Footer spacing, and absence of overflow.
- Verification: 22 test files / 123 tests passed, TypeScript passed, and the production build passed.

---

# Non-Goals

- Homepage or Product Detail redesign.
- New components without reusable justification.
- New business requirements or routes.
- Backend or database changes.
- Changes to featured-product or category eligibility.
