# Product Content and Variants V1

Status: Complete — Released

Owner: Product Requirements Architect

Source: Product JSON Schema example supplied by the Project Architect on 2026-07-12.

## Summary

Extend the Product Catalog with structured Product Variants, Product Images, merchandising metadata, and SEO content while preserving the project's discovery-only boundary, Category Taxonomy V1, and independent Product states.

## Business Problem

The current Product model supports one name, description, image, price, currency, and taxonomy classification. It cannot represent Products offered in distinguishable options such as size, color, material, capacity, or presentation. It also lacks structured gallery media, concise listing copy, brand, collection, gender applicability, tags, and search metadata.

Without these capabilities:

- option-specific Product references cannot be governed consistently;
- one image cannot describe Products with multiple relevant views or option-specific media;
- merchandising vocabulary is mixed into free-form names and descriptions;
- search and sharing metadata cannot be managed independently from visible content;
- future catalog growth would require repeated structural changes.

## Business Goal

Establish a reusable Product-content model that represents option-bearing Products accurately and improves discovery content without introducing inventory, fulfillment, checkout, or other transactional behavior.

## Actors

- Visitor exploring Products.
- Business Representative maintaining catalog content.
- Catalog teams consuming Product information.

## Included Scope

- One or more Product Variants per Product.
- Globally unique SKU per Product Variant.
- Flexible, non-empty Variant attributes such as size, color, material, capacity, or presentation.
- Optional Variant reference and barcode.
- Ordered Product Image gallery with alternative text and at most one primary image.
- Optional Variant association with one Product Image.
- Optional short description.
- Optional brand and collection.
- Controlled gender applicability.
- Unique Product tags.
- Optional SEO title and SEO description.
- Migration rules for current Products.
- Synchronization of Product listing, Product Detail, search, Featured Products, and related Products.

## Excluded Scope

- Inventory quantity, reservation, tracking, warehouse, or backorder.
- Product cost or supplier cost.
- Tax calculation or taxable state.
- Supplier, source document, batch, or procurement data.
- Weight, shipping, or logistics.
- Cart, checkout, payments, orders, or authentication.
- Automatic Variant generation from Product text.
- Automatic tags, SEO content, or image alternative text.
- Changes to Category Taxonomy V1 hierarchy or classification ownership.

## Compatibility Decisions

- Product Type remains the only authoritative leaf classification. Category and Subcategory remain inherited.
- Editorial Approval, Publication, Commercial Availability, Active state, and Featured designation remain independent.
- Product Variant Active state does not replace Product publication or Commercial Availability.
- Current price and currency remain Product-level commercial information in V1. Variant-specific pricing requires a separate approved business change.
- A Product Image may be absent without invalidating the Product.
- Existing Product public slugs remain stable.

## Success Measures

- Every Product has at least one valid Product Variant after migration.
- Every Product Variant has one globally unique SKU.
- No Product exposes conflicting Category, Subcategory, or Product Type data.
- Product Images have deterministic order and accessible alternative text.
- Visitor-facing experiences distinguish Product identity from Variant attributes.
- No inventory or transactional behavior is introduced.

## Dependencies

- Category Taxonomy V1.
- Product Catalog.
- Product Detail.
- Search.
- Featured Products.
- Platform Accessibility and Design System.
- Approved migration inventory and SKU assignment.

## Risks

- Existing Products do not currently have approved SKUs.
- Flexible attributes may develop inconsistent names or values without governance.
- Variant selection could be confused with commercial availability or inventory.
- Moving media from one URL to an ordered collection may create incorrect primary-image outcomes.
- Brand, collection, and tags may be misused as parallel taxonomy.

## Resolved Business Inputs

- The current business migration inventory is empty; validation fixtures are excluded and no migration SKU is required.
- The initial approved Variant Attribute vocabulary is Talla, Color, Material, Capacidad, and Presentación.
- A Product without meaningful options owns one non-selectable Base Variant and never presents a fabricated option choice.

Decision record: `product-decisions.md`.
