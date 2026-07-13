# Category Taxonomy V1 — Business Design

Status: Approved and Released

Owner: Product Requirements Architect

## Business Workflow

1. The approved taxonomy is loaded as one versioned hierarchy.
2. Every existing Product receives a reviewed Product Type mapping or an explicit retirement disposition when no truthful mapping exists.
3. Each Product inherits its Subcategory and Category from that Product Type.
4. Public destination continuity is approved for existing Category URLs.
5. Taxonomy, Product mappings, discovery behavior, and documentation are validated together.
6. The hierarchy becomes active only after every release-blocking validation passes.

## Visitor Outcomes

- Visitors discover broad Categories in approved order.
- Visitors narrow a Category through eligible Subcategories.
- Visitors see only Products belonging to the selected taxonomy branch.
- Empty or inactive branches do not create dead-end destinations.
- Product Detail uses the same official classification language as discovery paths.

## Business States

- Proposed Taxonomy: supplied but not approved for release.
- Approved Taxonomy: business hierarchy and mappings approved.
- Active Taxonomy: approved hierarchy currently used for public discovery.
- Superseded Taxonomy: preserved for traceability but unavailable for new classification.

These taxonomy-version states do not replace Category Active state, public visibility, Product publication, or Commercial Availability.

## Migration Safety

- No Product is assigned by name similarity alone.
- Ambiguous Products require a Business Representative decision.
- No existing public destination disappears without an approved continuity outcome.
- Migration is rejected if any publicly discoverable Product becomes orphaned.
- Rollback restores the prior complete taxonomy and Product mappings as one coherent version.

## Dependencies

- Approved taxonomy requirements.
- Existing Product inventory review.
- URL continuity decision.
- UX design for hierarchical discovery.
- Architecture review for reusable taxonomy capability.
- QA acceptance and regression validation.
- Architecture boundaries in `architecture-review.md`.
- Existing fixture disposition and destination continuity in `migration-decision.md`.
