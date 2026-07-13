# Category Taxonomy V1 — Architecture Review

Status: Approved

Owner: Project Architect

Date: 2026-07-12

## Decision

Category Taxonomy is approved as a reusable catalog-domain capability shared by Homepage, Product Catalog, Category exploration, Product Detail, Search, Featured Products, and Related Products.

The capability owns the official classification vocabulary and hierarchy. Consuming features may decide where and how taxonomy information participates in their user journey, but they shall not redefine Category, Subcategory, Product Type, hierarchy ownership, eligibility, ordering, or migration meaning.

## Architectural Classification

The taxonomy is a shared business-domain contract, not a visual component and not a page-specific feature.

The active change remains under `openspec/changes/category-taxonomy-v1` until validation and release are complete. At completion, its canonical business specification belongs with the Product Catalog feature domain; reusable presentation and accessibility rules remain owned by their Platform specifications.

## Capability Boundaries

### Owned by Category Taxonomy

- Versioned Category, Subcategory, and Product Type vocabulary.
- Category → Subcategory → Product Type ownership hierarchy.
- Stable supplied identifiers, slugs, names, source order, and Active state.
- Product leaf-classification rule.
- Branch eligibility and empty-branch business outcomes.
- Taxonomy migration and supersession decisions.

### Consumed but not owned

- Product editorial and publication states.
- Commercial Availability and current commercial information.
- Featured Product designation and ordering.
- Search ranking.
- Related Product ordering.
- Page composition, interaction, responsive behavior, and visual presentation.
- Platform accessibility and light-only theme contracts.

### Explicitly excluded

- Authentication and administration experiences.
- Inventory, cart, checkout, payment, and order capabilities.
- Automatic Product classification.
- Free-form tags, brands, variants, promotions, and personalization.

## Contract Impact

The change affects every public contract that currently treats Category as a flat Product attribute. Those consumers must adopt the same hierarchy and must derive Category and Subcategory from the Product's single Product Type.

`Categoria Primaria` in the existing Product Detail contract remains a single business concept. Under taxonomy version 1.0.0 it corresponds to the Product's inherited Category; Product Type remains the authoritative leaf classification.

No consuming feature may keep a parallel flat Category source after activation. During migration, old and new contracts may coexist only behind one coordinated release boundary; mixed visitor-facing taxonomy outcomes are prohibited.

## Lifecycle Boundaries

Taxonomy versions use the business states Proposed, Approved, Active, and Superseded.

- Only one version may be Active for public discovery at a time.
- Approval does not activate a taxonomy.
- Activation requires complete Product dispositions, destination continuity, integration validation, and release approval.
- A Superseded version remains traceable for historical decisions and rollback evidence but cannot classify new public Products.
- Changes to an Active identifier, slug, ownership relationship, or Product Type meaning require a new reviewed taxonomy change; silent mutation is prohibited.

## Compatibility Decision

- Demonstration Products are retired according to `migration-decision.md`.
- Discontinued demonstration Category destinations preserve visitor continuity without pretending that a semantically equivalent successor exists.
- Product destinations never redirect to unrelated Products.
- Activation is atomic from the visitor's perspective.

## Required Downstream Reviews

- UX Solution defines the Category → Subcategory → Product exploration flow and the general Category discovery destination.
- UX/UI defines responsive, accessible hierarchy presentation using existing Platform rules or requests a separate Platform change.
- Backend defines implementation contracts without changing taxonomy semantics.
- Frontend consumes approved business and UX contracts without maintaining a competing hierarchy.
- QA validates cross-feature consistency and rollback evidence.

## Approval Outcome

`CT-006` is approved. Architecture introduces no new transactional scope and requires no change to the light-only Platform contract. Implementation remains gated by `CT-007` and `CT-008` for visitor-facing behavior.
