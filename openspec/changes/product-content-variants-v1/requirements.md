# Product Content and Variants V1 Requirements

Status: Approved and Released

Owner: Product Requirements Architect

## Domain Language

- **Product:** catalog identity that owns shared descriptive, taxonomy, editorial, publication, and commercial information.
- **Product Variant:** a distinct catalog option of one Product, identified by one SKU and zero or more differentiating attributes.
- **SKU:** globally unique business reference for one Product Variant.
- **Variant Attribute:** approved name-value characteristic that differentiates or describes a Product Variant.
- **Product Image:** ordered media record belonging to one Product.
- **Primary Image:** the single preferred Product Image for discovery when one is designated.
- **Merchandising Metadata:** optional brand, collection, gender applicability, and tags used to describe and discover a Product without redefining taxonomy.
- **SEO Content:** optional metadata used for Product discovery and sharing without replacing visitor-visible Product content.

## User Stories

### US-PCV-001

As a Visitor, I want to understand the available Product options, so that I can identify the variation relevant to me.

### US-PCV-002

As a Visitor, I want meaningful Product imagery and concise information, so that I can evaluate a Product efficiently.

### US-PCV-003

As a Business Representative, I want stable SKUs and governed Variant attributes, so that Product options remain consistent across catalog experiences.

## Functional Requirements

### FR-PCV-001 — Product Variant ownership

Every Product shall own at least one Product Variant before it becomes publicly discoverable under this capability.

### FR-PCV-002 — Unique Variant identity

Every Product Variant shall have one immutable identifier and one globally unique, non-empty SKU.

### FR-PCV-003 — Variant attributes

A Product Variant shall support approved attribute name-value pairs. Attribute names shall not be used to redefine Category Taxonomy.

### FR-PCV-004 — Product without meaningful options

A Product with no meaningful visitor-selectable option shall use one migration Variant so that SKU identity remains consistent without fabricating option choices.

### FR-PCV-005 — Product Image gallery

A Product shall support an ordered collection of zero or more Product Images. Each Product Image shall have a stable identity, URL, alternative text, and non-negative position.

### FR-PCV-006 — Primary Product Image

A Product may designate at most one Product Image as Primary Image. Absence of a Primary Image shall not invalidate the Product.

### FR-PCV-007 — Variant Image association

A Product Variant may reference one Product Image owned by the same Product. The association shall not transfer image ownership to the Variant.

### FR-PCV-008 — Product descriptive content

A Product shall support an optional short description distinct from its optional complete description.

### FR-PCV-009 — Merchandising metadata

A Product shall support optional brand, optional collection, controlled gender applicability, and a unique collection of tags.

### FR-PCV-010 — SEO content

A Product shall support optional SEO title and SEO description independently from its public name and descriptions.

### FR-PCV-011 — Stable taxonomy

Product Type remains the authoritative Product classification. Category and Subcategory shall continue to be inherited and shall not be duplicated as independent Product assignments.

### FR-PCV-012 — Independent states

Variant Active state shall remain independent from Product Active state, Editorial Approval, Publication, Commercial Availability, and Featured designation.

### FR-PCV-013 — Commercial information compatibility

Product price and currency shall remain Product-level commercial information for this version. Variant creation shall not silently create Variant-specific prices or inventory meaning.

### FR-PCV-014 — Safe migration

Existing Products shall not activate the new capability until each has an approved migration Variant, unique SKU, and media disposition.

## Business Rules

### BR-PCV-001 — One Variant, one Product

A Product Variant belongs to exactly one Product.

### BR-PCV-002 — SKU uniqueness

No two Product Variants may share the same SKU.

### BR-PCV-003 — No fabricated choices

A migration Variant for a Product without meaningful options shall not be presented as a visitor choice.

### BR-PCV-004 — Attribute consistency

Equivalent Variant Attribute concepts use one approved name and value format within the catalog.

### BR-PCV-005 — Attribute value types

A Variant Attribute value may be text, number, or boolean. Missing and empty values shall not be treated as meaningful options.

### BR-PCV-006 — Image ownership

A Variant may reference only an Image owned by its Product.

### BR-PCV-007 — Image order

Product Image position is unique within its Product and determines ascending gallery order.

### BR-PCV-008 — Primary Image uniqueness

At most one Product Image per Product is Primary.

### BR-PCV-009 — Metadata is not taxonomy

Brand, collection, gender applicability, tags, and Variant Attributes shall not change or override Product Type, Subcategory, or Category.

### BR-PCV-010 — Tags

Tags are unique within one Product, use an approved normalized form, and do not create public taxonomy destinations in V1.

### BR-PCV-011 — Gender applicability

Gender applicability uses only `mujer`, `hombre`, `unisex`, or `no_aplica` when present.

### BR-PCV-012 — Optional content

Missing short description, complete description, brand, collection, tags, SEO content, or Product Images shall not invalidate a Product.

### BR-PCV-013 — Public price protection

The existing Commercial Availability rule continues to govern public price and currency. When a Product is not Commercially Available, historical values remain internal and public price and currency remain null.

### BR-PCV-014 — Initial attribute vocabulary

The initial approved Variant Attribute concepts are Talla, Color, Material, Capacidad, and Presentación. A new attribute concept requires Product Requirements approval before use.

### BR-PCV-015 — Base Variant

A Product without meaningful visitor-selectable options owns one Base Variant with an approved SKU and no fabricated differentiating attributes. The Base Variant is not presented as an option selector.

## Non-functional Requirements

- Product and Variant outcomes shall remain deterministic for the same approved data.
- Public content shall preserve the project's accessibility and light-only contracts.
- Visitor experiences shall support long Spanish attribute names and values without loss of meaning.
- Public contracts shall not expose cost, supplier, inventory, or internal source data.
- Migration shall preserve existing Product slugs and taxonomy classification.

## Acceptance Criteria

```gherkin
Scenario: AC-PCV-001 Product owns a valid Variant
  Given a Product is eligible for public discovery
  When its Variant collection is evaluated
  Then it has at least one Product Variant
  And every Variant has a globally unique SKU
```

```gherkin
Scenario: AC-PCV-002 Product without options avoids a fabricated choice
  Given a Product has one migration Variant and no meaningful option attributes
  When a Visitor explores the Product
  Then the migration Variant is not presented as an option choice
```

```gherkin
Scenario: AC-PCV-003 Variant exposes approved attributes
  Given a Product Variant has approved size and color attributes
  When its public option information is requested
  Then the approved attribute names and values are available
  And no attribute changes Product taxonomy classification
```

```gherkin
Scenario: AC-PCV-004 Product gallery follows approved order
  Given a Product has multiple Product Images
  When its gallery is requested
  Then Images follow ascending position
  And at most one Image is Primary
```

```gherkin
Scenario: AC-PCV-005 Variant Image belongs to its Product
  Given a Product Variant references a Product Image
  When image ownership is validated
  Then the Image belongs to the same Product
```

```gherkin
Scenario: AC-PCV-006 Product without Images remains valid
  Given a Product has no Product Images
  When Product validity is evaluated
  Then the Product remains valid
```

```gherkin
Scenario: AC-PCV-007 Metadata does not replace taxonomy
  Given a Product has brand, collection, gender applicability, and tags
  When classification is evaluated
  Then Product Type remains its only authoritative leaf classification
```

```gherkin
Scenario: AC-PCV-008 Variant state remains independent
  Given a Product Variant is inactive
  When Product publication and Commercial Availability are evaluated
  Then neither Product dimension is silently changed
```

```gherkin
Scenario: AC-PCV-009 Commercially unavailable Product protects historical price
  Given a Published Product is not Commercially Available
  When its public contract is requested
  Then public price and currency are null
  And its Variants and taxonomy do not expose historical commercial values
```

```gherkin
Scenario: AC-PCV-010 Existing Product migration is incomplete
  Given an existing Product lacks an approved migration Variant or unique SKU
  When capability activation is evaluated
  Then activation remains blocked for that Product
  And no SKU or option attribute is fabricated automatically
```

## Edge Cases

- Duplicate SKU across different Products.
- Two Primary Images for one Product.
- Duplicate Image position within one Product.
- Variant referencing another Product's Image.
- Empty attribute name or value.
- Attribute values with different formats for the same concept.
- Product with one non-selectable migration Variant.
- Product with multiple Variants but no differentiating attributes.
- Inactive Variant under a Published Product.
- Product Image URL becomes unavailable.
- Duplicate tags with case or spacing differences.
- SEO content present while visible description is absent.

## Resolved Product Decisions

- No current business Product requires migration; the active seed contains taxonomy only and test fixtures are excluded.
- The initial attribute vocabulary and normalization rules are approved in `product-decisions.md`.
- A Product without meaningful options uses one non-selectable Base Variant.

## Pending Cross-discipline Decisions

- Architecture capability boundaries.
- Visitor journey and presentation behavior for meaningful multi-Variant Products.
- Design System reuse or extension decision.
