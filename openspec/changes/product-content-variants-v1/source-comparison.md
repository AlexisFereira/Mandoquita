# Product Schema Source Comparison

Status: Reviewed

Owner: Product Requirements Architect

## Adopted in V1

- Product Variants.
- Globally unique Variant SKU.
- Flexible approved Variant attributes.
- Optional Variant reference and barcode.
- Ordered Product Images with alternative text and Primary designation.
- Optional Variant Image association.
- Short description.
- Brand, collection, gender applicability, and tags.
- SEO title and description.

## Preserved from Current Product Model

- Product Type as the only persisted leaf classification.
- Inherited Subcategory and Category.
- Independent Active, Editorial Approval, Publication, Commercial Availability, and Featured dimensions.
- Featured ordering.
- Product-level current price and currency.
- Historical price protection when Commercial Availability is false.
- Stable public Product slug.

## Explicitly Deferred

- Variant price and compare-at price.
- Inventory, reserved quantity, tracking, backorder, and warehouse.
- Product or Variant cost.
- Taxable state and tax calculation.
- Supplier, source document, batch, and procurement content.
- Weight, shipping units, and logistics.

## Rejected Source Patterns

- Persisting `category_id`, `subcategory_id`, and `product_type` independently on Product, because this permits conflicting hierarchy assignments.
- Collapsing Draft, Active, Out of Stock, and Archived into one Product status, because these values mix editorial, publication, commercial, and inventory concerns.
- Requiring at least one Image, because missing optional media does not invalidate a Product.
- Treating tags, brand, collection, gender, or Variant attributes as parallel taxonomy.
