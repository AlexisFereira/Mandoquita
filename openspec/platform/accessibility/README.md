# Accessibility Platform

Reserved for cross-cutting accessibility specifications and standards.

Use this area for reusable accessibility rules that apply across all features.

## Feature Evidence

- Category Taxonomy V1: semantic hierarchy, breadcrumb meaning, keyboard order,
  focus visibility, reflow, target size, light-only contrast, omitted branches
  and recovery states are approved in
  `../../changes/category-taxonomy-v1/accessibility-review.md`.
- Product Gallery and Option Controls: gallery/option semantics, keyboard focus,
  accessible names, 44px targets, reflow, reduced motion and polite status are
  approved in `../design-system/product-gallery-variant-controls/accessibility-review.md`.
- Product Content and Variants V1: feature composition for ordered gallery,
  meaningful Variant options, Base and inactive outcomes, metadata hierarchy,
  media failure and missing media is approved in
  `../../changes/product-content-variants-v1/accessibility-review.md`.
- Scroll-entry Motion: the implemented visible-by-default progressive enhancement,
  immediate reduced-motion/focus/hash resolution, semantic stability, shared
  observation cleanup and assistive-technology independence is approved in
  `../design-system/scroll-entry-motion/accessibility-review.md`; independent QA
  browser/performance validation also passes.
- Governed Icon System: the implemented Platform component's decorative and
  informative semantics, names, focus exclusion, current-color behavior, labelled
  control composition and reflow contract are approved in
  `../design-system/icon-system/accessibility-review.md`; independent QA validation passes.
- Discovery and Trust Experience V1: Search form/results, static Payment
  Information, governed Icon adoption and the Accessibility portion of motion
  integration are reviewed in
  `../../changes/discovery-trust-experience-v1/accessibility-review.md`.
- Product Admin V1: access-gate, Product-list, editor, validation/status, focus,
  keyboard, target, reflow, zoom and light-only design contracts are approved at
  design level in
  `../../changes/product-admin-v1/accessibility-design-review.md`; implementation
  and joint QA validation are approved in
  `../../changes/product-admin-v1/qa-review.md`.
- Catalog Media Admin V1: native file input, meaningful preview and alternative-
  text association, ordered-list keyboard movement, Primary radio semantics,
  upload progress/status, destructive confirmation, focus recovery, 44px targets,
  320px/200% reflow, reduced motion and light-only design contracts are approved
  at design level in
  `../../changes/catalog-media-admin-v1/accessibility-design-review.md`; code and
  automated implementation review passes in
  `../../changes/catalog-media-admin-v1/accessibility-implementation-review.md`,
  while independent browser/screen-reader validation remains governed by CMA-038.
