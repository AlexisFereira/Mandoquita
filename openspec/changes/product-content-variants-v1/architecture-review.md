# Product Content and Variants V1 — Architecture Review

Status: Approved

Owner: Project Architect

Date: 2026-07-12

## Decision

Product Content and Variants V1 is approved as an evolution of the reusable Product Catalog domain.

Product remains the aggregate identity and consistency boundary. Product Variant, Product Image, merchandising metadata, and SEO content belong to Product and shall not become page-specific structures or independent Platform capabilities.

## Capability Classification

### Product domain capabilities

- Product Variant identity, ownership, SKU, Active state, reference, barcode, and approved attributes.
- Product Image identity, ownership, ordering, alternative text, Primary designation, and optional Variant association.
- Product short description and merchandising metadata.
- Product SEO content.
- Migration and compatibility rules for existing Product consumers.

### Existing shared capabilities consumed

- Category Taxonomy V1.
- Product editorial and publication states.
- Commercial Availability and public price protection.
- Featured Product designation and ordering.
- Search and related-Product behavior.
- Platform Accessibility, light-only Theme, and Design System contracts.

### Not Platform capabilities

Variant, Image, merchandising metadata, and SEO are reusable inside the Product domain, but they do not belong to the visual or technical Platform layer. Platform owns only the reusable presentation, interaction, accessibility, and frontend foundations consumed by Product experiences.

## Aggregate and Ownership Boundaries

- Product owns its Product Variants and Product Images.
- A Product Variant belongs to exactly one Product and cannot exist as public catalog content independently.
- A Product Image belongs to exactly one Product.
- A Variant may reference only an Image owned by the same Product.
- Product owns Primary Image uniqueness and Image order consistency.
- Product owns merchandising metadata and SEO content.
- Product Type remains the authoritative classification leaf owned by Category Taxonomy V1; Product Content and Variants does not duplicate or redefine taxonomy.

## Lifecycle Boundaries

- Product Variant Active state is independent from every Product state.
- An inactive Variant remains historical Product data but is not an eligible visitor option.
- Product publication does not activate or deactivate Variants automatically.
- Commercial Availability does not activate or deactivate Variants and remains the only approved authority for current public price exposure.
- Image presence, Primary Image presence, metadata, or SEO content never determine Product validity or publication.
- A Base Variant is an internal Product-domain outcome and never becomes a fabricated visitor choice.

## Attribute Governance

Variant Attributes remain part of Product Variant rather than becoming a separate shared taxonomy capability in V1.

Product Requirements owns the official attribute vocabulary and semantic normalization rules. Architecture and implementation may enforce integrity but shall not introduce new attribute concepts or silently reinterpret values.

If future features require cross-Product faceted navigation, comparable units, or hierarchical attribute vocabularies, that behavior requires a separate reviewed catalog capability. V1 attributes shall not be promoted into public filters by implementation inference.

## Contract Compatibility

The change is additive from the visitor's business perspective:

- existing Product identity and public slug remain stable;
- existing taxonomy classification remains stable;
- current Product-level price and currency behavior remains stable;
- Product contracts may add Variants, Images, metadata, and SEO outcomes;
- consumers shall migrate to the Product Image collection as one coordinated change;
- a temporary single-image compatibility outcome may be derived from the Primary Image, or otherwise the first ordered Image, only during coordinated migration;
- no consumer may maintain a competing Variant, Image, or taxonomy source after activation.

The precise public contract representation remains owned by Backend and Frontend architecture. It must preserve these business outcomes and compatibility boundaries.

## Migration Boundary

The capability activates as one coordinated catalog release:

1. Every business Product has at least one approved Variant and unique SKU.
2. Existing media has an approved Product Image disposition.
3. Product, Variant, Image, and public contract integrity is validated together.
4. All affected consumers adopt the same active capability boundary.
5. Rollback restores the prior Product representation and public contracts as one coherent release.

Partial activation that exposes some Products or pages with competing Product representations is prohibited.

The current business migration set is empty. Test and validation fixtures are not migration inventory and must be updated independently as implementation evidence.

## Deferred Capability Boundary

The following remain prohibited in V1:

- Variant-specific price or compare-at price.
- Inventory, reservation, availability quantity, backorder, and warehouse.
- Cost, supplier, procurement, batch, and source documents.
- Tax, shipping weight, and logistics.
- Cart, checkout, payment, order, or authentication behavior.

Introducing any deferred capability requires a separate proposal, requirements review, architecture review, and migration decision.

## Cross-layer Dependencies

- UX Solution defines the visitor journey for gallery and meaningful Variant choices.
- Design System Architect decides whether existing composition supports gallery and option patterns.
- UX/UI may finalize presentation only after UX Solution and Design System decisions.
- Backend owns domain integrity and public data contracts without redefining Product semantics.
- Frontend consumes approved Backend, UX, and Design System contracts without maintaining parallel Product state.
- QA validates aggregate integrity, compatibility, accessibility, regression, and absence of deferred operational behavior.

## Architecture Risks and Controls

- **Parallel Product representations:** prohibited after coordinated activation.
- **Variant treated as inventory:** prevented by explicit scope and independent Variant Active state.
- **Attribute vocabulary drift:** controlled by Product Requirements ownership.
- **Image inconsistency:** controlled at the Product ownership boundary.
- **Taxonomy duplication:** prohibited; Product Type remains the sole leaf classification.
- **Hidden commerce expansion:** controlled through separate-change requirements for every deferred capability.

## Approval Outcome

`PCV-008` is approved.

This decision unblocks `PCV-009` and `PCV-011`. Backend domain planning may begin, but implementation remains gated by approved UX and Design System contracts where visitor-facing behavior is affected. Frontend remains gated by `PCV-009` through `PCV-018`.
