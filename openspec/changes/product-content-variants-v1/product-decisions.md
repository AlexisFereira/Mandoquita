# Product Content and Variants V1 — Product Decisions

Status: Approved

Owner: Product Requirements Architect

Date: 2026-07-12

## Existing Product Migration Inventory

The active Taxonomy V1 seed creates no Product records. Repository validation Products are temporary test data and are not business catalog inventory.

Therefore, there is no existing business Product requiring an approved migration SKU. `PCV-004` is complete with an empty migration set. This decision does not authorize automatic SKU generation for future Products.

Every future Product requires a Business Representative-approved SKU before its first Product Variant becomes eligible under this capability.

## Initial Variant Attribute Vocabulary

The approved initial vocabulary is:

| Official attribute | Meaning | Value rule |
| --- | --- | --- |
| Talla | Garment or wearable size | Non-empty approved size label; alphabetic size codes use uppercase |
| Color | Commercial color distinction | Non-empty official display name; synonyms use one catalog-approved name |
| Material | Material or composition distinction | Non-empty official display name |
| Capacidad | Capacity or volume distinction | Non-empty value including the applicable unit when a unit is required |
| Presentación | Package, format, or commercial presentation distinction | Non-empty official display name |

Rules:

- Attribute names and values ignore surrounding whitespace.
- Equivalent concepts use one official attribute name.
- Empty values are omitted and never create a Variant choice.
- A Product Variant uses only attributes meaningful for that Product.
- New attribute concepts require Product Requirements approval before catalog use.
- This vocabulary describes Variants and never changes Category Taxonomy.

## Product with One Non-selectable Variant

The official internal business name is **Base Variant** (`Variante base` in Spanish documentation).

A Base Variant:

- belongs to a Product with no meaningful visitor-selectable option;
- has an approved unique SKU;
- has no fabricated differentiating attributes;
- is not presented as an option selector or as a selectable choice;
- may contribute non-interactive reference information only when that information is approved for visitors;
- does not imply inventory, availability, price, or purchasing capability.

If a second meaningful Variant becomes Active, the Product no longer uses the Base Variant visitor outcome and follows the approved multi-Variant experience.

## Requirements Review Outcome

The requirements are complete, internally consistent, testable, implementation independent, and aligned with:

- Category Taxonomy V1;
- independent Product business states;
- Commercial Availability price protection;
- discovery-only scope;
- light-only and accessibility contracts.

`PCV-004` through `PCV-007` are approved. Architecture, UX, Design System, implementation, and validation remain assigned to their respective owners.
