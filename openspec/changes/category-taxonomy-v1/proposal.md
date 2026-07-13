# Category Taxonomy V1

Status: Complete — Released

Owner: Product Requirements Architect

Source: Category schema version 1.0.0, locale `es`, supplied by the Project Architect.

## Summary

Replace the current flat Category classification with an official Spanish taxonomy composed of Category, Subcategory, and Product Type.

The taxonomy contains seven Categories, sixteen Subcategories, and thirty Product Types. It becomes the shared business vocabulary for catalog discovery, Category navigation, Product classification, filtering, and future catalog growth.

## Business Problem

The current catalog classifies a Product only under one flat Category. This is insufficient for the supplied assortment because broad areas such as clothing, fashion accessories, motorcycle accessories, beauty, home, food, and security contain distinct discovery groups and Product Types.

Without an approved hierarchy:

- visitors cannot narrow exploration consistently;
- similar Products may use inconsistent category names;
- filters and Category pages cannot distinguish broad and specific intent;
- future Products may be classified using improvised terminology;
- existing Products cannot be migrated deterministically.

## Business Goal

Establish one stable, reusable, Spanish-language Product taxonomy that improves catalog discovery while preserving the platform's discovery-only scope.

## Users

- Visitors exploring the Product Catalog.
- Business Representatives classifying Products.
- Product and engineering teams maintaining catalog behavior.

## Scope

### Included

- Seven official Categories with stable identifiers, names, slugs, descriptions, order, and Active state.
- Sixteen official Subcategories with stable identifiers, names, and slugs.
- Thirty official Product Types as leaf-level classification vocabulary.
- Category → Subcategory → Product Type hierarchy.
- Classification and migration rules for existing and future Products.
- Category and Subcategory discovery behavior.
- Synchronization of Homepage, Catalog, filtering, Category Page, Product Detail, seed data, validation, and documentation.

### Excluded

- Authentication or catalog-administration UI.
- Cart, checkout, payments, orders, or inventory.
- Promotions, discounts, or pricing changes.
- Multi-language taxonomy.
- Automatic classification based on Product text or images.
- Creation of additional Categories, Subcategories, or Product Types outside the supplied schema.

## Success Metrics

- Every publicly discoverable Product has one valid leaf classification.
- Every Product Type traces to exactly one Subcategory and Category.
- Visitors can explore the hierarchy without encountering duplicate or orphan terms.
- Category ordering is deterministic.
- No existing published Product disappears because of an undocumented migration decision.
- Homepage and catalog eligibility rules remain consistent.

## Dependencies

- Product Catalog.
- Homepage Category discovery.
- Category Page.
- Product Detail.
- Existing Product data and an approved migration mapping.
- QA validation of hierarchy, navigation, filtering, and regression.

## Risks

- Existing Products may not have enough information for deterministic leaf classification.
- Renaming current Categories may break stored or shared URLs without continuity rules.
- Product Types may be confused with free-form tags or Product names.
- A hierarchy change may cause inconsistent results if Homepage, Catalog, and Product Detail migrate at different times.

## Resolved Decisions

- The current English-language seed records are demonstration fixtures and are retired rather than assigned to semantically incorrect Product Types.
- The former `audio`, `computing`, and `home-living` Category destinations permanently redirect to general Category discovery.
- Former demonstration Product destinations use the standard unavailable-Product outcome and never redirect to an unrelated Product.
- Every future real Product requires an approved Product Type before public discovery.

Decision record: `migration-decision.md`.
