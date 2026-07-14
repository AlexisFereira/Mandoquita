# Feature Proposal

Status: Approved

Finalized: 2026-07-12

> **Active structural amendment (2026-07-14):** Homepage Merchandising Layout V2
> supersedes the V1 section order, separate Hero and 1280px Homepage composition.
> The active contract is `merchandising-layout-v2.md`. V1 business scope,
> eligibility, Featured limits, uncapped Categories, Contact and non-transactional
> boundaries remain authoritative where the amendment does not supersede them.

## Summary

The Homepage feature defines the primary entry point for the Product Catalog Platform.

Its purpose is to help visitors quickly understand what the business sells, which product categories are available, which products are featured, and how to contact the business.

The homepage must encourage product exploration without introducing transactional behavior.

## Business Context

The Product Catalog Platform helps businesses present products professionally without requiring a full e-commerce system.

Visitors often arrive without prior knowledge of the business, its product range, or the available ways to continue the conversation. The homepage must provide immediate orientation so visitors can decide whether to browse categories, inspect featured products, or contact the business.

The homepage supports the platform vision by making product discovery simple, fast, and clear while keeping authentication, carts, checkout, and account flows outside the current scope.

## Business Problem

Without a formal homepage capability, visitors may not quickly understand:

- What the business sells.
- Which product categories are available.
- Which products deserve immediate attention.
- How to contact the business.

This creates friction in product discovery and can reduce engagement with product detail pages or external contact channels.

## Problem Statement

Visitors need a clear first point of orientation for the catalog.

The system must present the business offering, available categories, featured products, and contact options in a way that supports exploration while preserving the platform boundary: the homepage is for discovery and contact, not transactions.

## Business Goal

Provide a homepage that introduces the product catalog, guides visitors toward categories and featured products, and makes business contact available without requiring authentication, cart usage, checkout, or account creation.

## Business Objectives

- Help visitors immediately understand what the business sells.
- Make available product categories discoverable.
- Highlight featured products for initial exploration.
- Encourage movement from homepage discovery to product browsing.
- Provide a clear path for contacting the business.
- Preserve the platform focus on product discovery rather than online transactions.

## Users

- Visitors browsing products for the first time.
- Returning visitors exploring available categories or featured products.
- Potential customers who want to contact the business before making a decision.

## Scope

### Included

- Business introduction.
- Product category discovery.
- Featured product discovery.
- Navigation toward catalog exploration.
- Navigation toward product detail exploration.
- Business contact availability.
- Static accepted-payment information with external contact continuation.
- Homepage content that supports product discovery.

### Excluded

- User authentication.
- Account creation.
- User profile management.
- Shopping cart.
- Checkout.
- Online payments.
- Order management.
- Wishlist.
- Product comparison.

## Functional Requirements

### FR-001: Business Offering Orientation

The homepage shall communicate what the business sells.

### FR-002: Category Discovery

The homepage shall expose available product categories for visitor exploration.

### FR-003: Featured Product Discovery

The homepage shall expose featured products for initial visitor exploration.

### FR-004: Product Exploration Path

The homepage shall allow visitors to continue from featured products to product detail exploration.

### FR-005: Category Exploration Path

The homepage shall allow visitors to continue from visible categories to category-based product exploration.

### FR-006: Contact Availability

The homepage shall provide at least one way for visitors to contact the business.

### FR-007: Discovery-Only Behavior

The homepage shall not require authentication, account creation, cart usage, checkout, or payment to support product discovery.

### FR-008: Valid Content Only

The homepage shall present only products and categories that are eligible for visitor discovery.

### FR-009: Informational Payment Methods

The homepage may present only the approved Binance, Pago móvil, and Dólares en
efectivo methods as static information and may continue to the existing external
contact path without initiating a transaction.

## Business Rules

### BR-001: Discovery Scope

The homepage exists to support product discovery and business contact.

### BR-002: No Transactional Behavior

The homepage shall not initiate or require cart, checkout, payment, authentication, or account creation behavior.

Informational payment-method content is not transactional behavior: it cannot
select, validate, calculate, capture, confirm, or complete payment.

### BR-003: Category Eligibility

Only categories eligible for visitor discovery may appear on the homepage.

### BR-004: Product Eligibility

Only products eligible for visitor discovery may appear on the homepage.

### BR-005: Featured Product Meaning

Featured products represent products prioritized by the business for initial visitor attention.

### BR-006: Missing Optional Content

Missing optional homepage content shall not create a new business state.

### BR-007: Contact Independence

Visitors shall be able to access business contact information without creating an account or completing a transaction.

## Non Functional Requirements

- The homepage must be accessible to visitors using supported assistive technologies.
- The homepage must support responsive product discovery across supported device categories.
- Homepage content must be understandable without requiring user registration.
- Homepage behavior must remain deterministic for the same eligible catalog content.
- The homepage must preserve SEO discoverability for the business and catalog.
- Homepage content must load fast enough to support low-friction discovery.
- The homepage must remain maintainable as categories and featured products evolve.

## Acceptance Criteria

```gherkin
Scenario: Visitor understands the business offering
  Given a visitor opens the homepage
  When the homepage content is available
  Then the visitor can identify what the business sells
```

```gherkin
Scenario: Visitor discovers categories
  Given eligible categories exist
  When a visitor opens the homepage
  Then the homepage presents those categories for exploration
```

```gherkin
Scenario: Visitor discovers featured products
  Given eligible featured products exist
  When a visitor opens the homepage
  Then the homepage presents featured products for exploration
```

```gherkin
Scenario: Visitor continues to product exploration
  Given a featured product is presented on the homepage
  When the visitor selects that product
  Then the visitor can continue to product detail exploration
```

```gherkin
Scenario: Visitor continues to category exploration
  Given a category is presented on the homepage
  When the visitor selects that category
  Then the visitor can continue to category-based product exploration
```

```gherkin
Scenario: Visitor contacts the business
  Given a visitor opens the homepage
  When the visitor needs assistance or product information
  Then the visitor can access a business contact method
```

```gherkin
Scenario: Visitor explores without transactional requirements
  Given a visitor opens the homepage
  When the visitor explores homepage content
  Then the visitor is not required to authenticate
  And the visitor is not required to create an account
  And the visitor is not required to use a cart
  And the visitor is not required to complete checkout or payment
```

## Success Metrics

- Visitors can understand the business offering from the homepage.
- Visitors can find category exploration paths from the homepage.
- Visitors can find featured product exploration paths from the homepage.
- Visitors can access a business contact method from the homepage.
- No transactional behavior appears in the homepage scope.

## Dependencies

- Product Catalog.
- Categories.
- Featured Products.
- Product Detail.
- Business Contact Information.
- Design System.
- Navigation capability.

## Risks

- Homepage scope may drift toward full e-commerce behavior.
- Featured products may be ambiguous without a clear business definition.
- Category visibility rules may be inconsistent if eligibility is not defined centrally.
- Contact expectations may vary by business and require clarification.

## Open Questions

- Should the homepage support promotional content in the initial scope?

## Business Rules

### BR-001

The primary contact method is WhatsApp.

All primary CTAs shall navigate to the business WhatsApp contact.

---

### BR-002

A Featured Product is any product where:

- status = Active
- featured = true

---

### BR-003

Featured Products shall be ordered by:

featuredOrder ASC

---

### BR-004

The Homepage shall display a maximum of:

- 8 Featured Products on Desktop
- 4 Featured Products on Tablet
- 4 Featured Products on Mobile

---

### BR-005

A Category is visible when:

- status = Active
- visible = true
- contains at least one Active Product

---

### BR-006

Selecting a Category navigates to the Category Page.

The Category Page displays all products belonging to that category.

---

### BR-007

The Homepage shall expose every Category that satisfies BR-005.

No maximum Category count applies unless a future approved business requirement defines one.

---

### BR-008

A new general product-discovery destination is not required by the current Homepage scope.

Featured Product Detail and dedicated Category Page paths remain the approved discovery destinations.
