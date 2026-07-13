# Category Taxonomy V1 Requirements

Status: Approved and Released

Owner: Product Requirements Architect

## Domain Language

- **Category:** highest taxonomy level used for broad catalog discovery.
- **Subcategory:** second taxonomy level belonging to exactly one Category.
- **Product Type:** leaf classification belonging to exactly one Subcategory.
- **Leaf Classification:** the Product Type assigned to a Product; its Subcategory and Category are inherited through the hierarchy.
- **Active:** business state indicating whether a taxonomy entity is eligible for current catalog use.
- **Visible:** independent visitor-discovery state governed by existing catalog rules.

## User Stories

### US-CT-001

As a Visitor, I want to explore Products through a predictable Category hierarchy, so that I can narrow the catalog according to my intent.

### US-CT-002

As a Business Representative, I want one official classification vocabulary, so that Products are organized consistently.

### US-CT-003

As a returning Visitor, I want existing catalog destinations to remain understandable after migration, so that taxonomy changes do not create dead ends.

## Functional Requirements

### FR-CT-001 — Official hierarchy

The system shall recognize Category, Subcategory, and Product Type as three distinct taxonomy levels in that order.

Acceptance Criteria: AC-CT-001.

### FR-CT-002 — Category ownership

Every Subcategory shall belong to exactly one Category.

Acceptance Criteria: AC-CT-002.

### FR-CT-003 — Subcategory ownership

Every Product Type shall belong to exactly one Subcategory.

Acceptance Criteria: AC-CT-003.

### FR-CT-004 — Product classification

Every publicly discoverable Product shall have exactly one approved Product Type and shall inherit one Subcategory and one Category through that Product Type.

Acceptance Criteria: AC-CT-004 and AC-CT-005.

### FR-CT-005 — Category discovery

Visitors shall be able to discover Active and Visible Categories that contain at least one publicly discoverable Product.

Acceptance Criteria: AC-CT-006.

### FR-CT-006 — Subcategory discovery

Within an eligible Category, visitors shall be able to discover Subcategories that contain at least one publicly discoverable Product.

Acceptance Criteria: AC-CT-007.

### FR-CT-007 — Taxonomy filtering

Visitors shall be able to restrict catalog discovery by an eligible Category or Subcategory without exposing Products outside the selected branch.

Acceptance Criteria: AC-CT-008 and AC-CT-009.

### FR-CT-008 — Deterministic Category order

Eligible Categories shall use the approved ascending business order from one through seven.

Acceptance Criteria: AC-CT-010.

### FR-CT-009 — Stable public language

Public experiences shall use the approved Spanish names and slugs without introducing synonyms for the same taxonomy entity.

Acceptance Criteria: AC-CT-011.

### FR-CT-010 — Safe migration

Existing publicly discoverable Products shall not be migrated until each has an approved leaf classification and applicable public URL continuity is defined.

Acceptance Criteria: AC-CT-012 and AC-CT-013.

## Business Rules

### BR-CT-001 — One concept, one name

Each Category, Subcategory, and Product Type has one official Spanish name.

### BR-CT-002 — Stable identifiers

Supplied Category and Subcategory identifiers and slugs are stable business identifiers and shall not be silently regenerated or reassigned.

### BR-CT-003 — Unique identifiers

Category identifiers and slugs shall be unique across Categories. Subcategory identifiers and slugs shall be unique across Subcategories.

### BR-CT-004 — Leaf classification

A publicly discoverable Product belongs to one Product Type. It shall not be assigned independently to conflicting Categories or Subcategories.

### BR-CT-005 — Independent states

Active state, public visibility, publication eligibility, and existence of Products are independent dimensions. A state change in one dimension shall not silently rewrite another.

### BR-CT-006 — Inactive Category effect

An inactive Category and its descendants shall not be available for new public classification or visitor discovery. Existing Product records require an explicit migration or reactivation decision; they shall not be reassigned automatically.

### BR-CT-007 — Empty branches

An empty Category or Subcategory remains a valid taxonomy entity but is not presented as a visitor discovery destination.

### BR-CT-008 — Source sequence

Categories use `sort_order` ascending. Subcategories and Product Types preserve the supplied schema sequence until a separate approved ordering rule exists.

### BR-CT-009 — Product Type semantics

Product Type is classification vocabulary. It does not imply brand, variant, promotion, inventory, price, or commercial availability.

### BR-CT-010 — Atomic migration

Taxonomy data, Product classification, discovery rules, navigation continuity, and documentation must become valid together before release.

### BR-CT-011 — Truthful migration

An existing Product shall not be assigned to a Product Type whose approved meaning does not describe it. A demonstration fixture with no truthful classification is retired through an explicit catalog-content decision.

### BR-CT-012 — Destination continuity

A discontinued Category destination shall lead to general Category discovery when no successor Category has the same business meaning. It shall not redirect to a semantically different Category.

### BR-CT-013 — Unavailable former Product

A former demonstration Product shall use the standard unavailable-Product outcome after retirement and shall not redirect to an unrelated Product.

## Non-functional Requirements

- Taxonomy behavior shall remain deterministic for the same approved data.
- Public taxonomy navigation shall meet project accessibility standards.
- Category and Subcategory discovery shall remain responsive and understandable.
- The hierarchy shall support catalog growth without redefining existing identifiers.
- Migration shall preserve referential integrity and public navigation continuity.
- Spanish taxonomy labels shall preserve accents and official spelling.

## Acceptance Criteria

```gherkin
Scenario: AC-CT-001 Complete hierarchy is available
  Given the approved taxonomy version 1.0.0
  When the taxonomy is made active
  Then it contains 7 Categories
  And it contains 16 Subcategories
  And it contains 30 Product Types
```

```gherkin
Scenario: AC-CT-002 Subcategory has one parent
  Given an approved Subcategory
  When its hierarchy is evaluated
  Then it belongs to exactly one Category
```

```gherkin
Scenario: AC-CT-003 Product Type has one parent
  Given an approved Product Type
  When its hierarchy is evaluated
  Then it belongs to exactly one Subcategory
```

```gherkin
Scenario: AC-CT-004 Published Product has a leaf classification
  Given a Product is eligible for public discovery
  When its taxonomy is evaluated
  Then it has exactly one approved Product Type
  And one Subcategory is inherited
  And one Category is inherited
```

```gherkin
Scenario: AC-CT-005 Missing classification blocks publication
  Given a Product has no approved Product Type
  When public discovery eligibility is evaluated
  Then the Product is not newly published through this taxonomy change
  And the missing classification is reported for business resolution
```

```gherkin
Scenario: AC-CT-006 Eligible Category is discoverable
  Given a Category is Active and Visible
  And its branch contains a publicly discoverable Product
  When a Visitor explores Categories
  Then the Category is available as a discovery destination
```

```gherkin
Scenario: AC-CT-007 Empty Subcategory is omitted from discovery
  Given a Subcategory contains no publicly discoverable Products
  When a Visitor explores its Category
  Then the Subcategory is not presented as a discovery destination
  And the Subcategory remains a valid taxonomy entity
```

```gherkin
Scenario: AC-CT-008 Category branch filter
  Given a Visitor selects an eligible Category
  When catalog results are available
  Then every result belongs to a Product Type within that Category branch
```

```gherkin
Scenario: AC-CT-009 Subcategory branch filter
  Given a Visitor selects an eligible Subcategory
  When catalog results are available
  Then every result belongs to a Product Type within that Subcategory branch
```

```gherkin
Scenario: AC-CT-010 Approved Category ordering
  Given multiple eligible Categories exist
  When Categories are presented for discovery
  Then they follow ascending approved sort order
```

```gherkin
Scenario: AC-CT-011 Official public language
  Given a taxonomy entity is presented publicly
  When its name and destination are exposed
  Then the approved Spanish name and slug are used
```

```gherkin
Scenario: AC-CT-012 Existing Product lacks a migration decision
  Given an existing Product has no approved Product Type or retirement disposition
  When taxonomy migration is evaluated
  Then that Product is not reassigned automatically
  And release remains blocked until its disposition is resolved
```

```gherkin
Scenario: AC-CT-013 Existing Category destination changes
  Given an existing public Category destination will change
  When the taxonomy migration is approved
  Then an explicit continuity decision exists before release
```

## Edge Cases

- Duplicate Category or Subcategory identifier.
- Duplicate Category or Subcategory slug.
- Product Type without a Subcategory.
- Subcategory without a Category.
- Product without an approved Product Type.
- Empty Category or Subcategory.
- Inactive Category with existing Products.
- Existing Product that could match multiple Product Types.
- Existing public Category URL without an approved destination.
- Missing optional Category description.

## Resolved Migration Decisions

- The reviewed repository contains ten demonstration Products and no approved production inventory.
- All ten demonstration Products are retired because the official taxonomy contains no truthful Product Type for them.
- The three discontinued demonstration Category destinations lead to general Category discovery.
- The complete disposition and continuity record is defined in `migration-decision.md`.

## Validation Outcome

- QA approved hierarchy, navigation, filtering, regression, documentation synchronization, and release evidence.
