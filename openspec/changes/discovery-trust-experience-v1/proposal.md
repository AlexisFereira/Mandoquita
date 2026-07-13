# Discovery and Trust Experience V1

Status: Complete — Released

Owner: Product Requirements Architect

Date: 2026-07-13

## Summary

Improve catalog discovery and visitor confidence through four coordinated workstreams:

1. Public Product Search.
2. A governed icon language.
3. An informational accepted-payment-methods block.
4. Subtle scroll-entry motion.

The workstreams share one visitor-experience release but retain independent business, Platform, UX, implementation, and validation ownership.

## Business Problem

Visitors currently depend primarily on Featured Products and Category navigation. They cannot directly search the catalog, supporting actions rely mainly on text without a governed icon language, accepted payment methods are not communicated, and page progression lacks an approved scroll-entry motion pattern.

Without explicit contracts:

- Product discovery requires unnecessary navigation;
- icons may be introduced inconsistently or without accessible meaning;
- payment information may accidentally imply checkout or guaranteed payment availability;
- scroll effects may hide content, cause motion discomfort, or reduce performance.

## Business Goal

Help visitors find Products faster, understand supporting information, and experience a polished but calm catalog while preserving the project's discovery-only, accessible, responsive, and deterministic light-only boundaries.

## Actors

- Visitor searching and exploring Products.
- Business Representative communicating accepted payment methods.
- Catalog team maintaining public Product content.

## Included Scope

### Product Search

- Public search entry and results experience.
- Search over approved public Product content.
- Published and taxonomy-eligible Product filtering.
- Deterministic empty, invalid, and unavailable outcomes.
- Preservation of Commercial Availability price protection.

### Icons

- One reusable, consistent icon language for approved navigation, search, contact, payment-information, feedback, and supporting metadata contexts.
- Accessible decorative and informative icon rules.
- Responsive sizing and light-only semantic color use.

### Payment Information

- One informational block listing only business-approved accepted payment methods.
- Clear statement that payment arrangements are confirmed through the approved external contact path.
- No checkout, payment capture, card form, account, order, or transaction processing.

### Scroll-entry Motion

- One reusable progressive-enhancement pattern for approved content sections.
- Subtle entrance only when content enters the viewport.
- Immediate content availability under reduced motion or without motion support.
- Performance, focus, semantic, and layout stability requirements.

## Excluded Scope

- Search suggestions, autocomplete, recent searches, personalization, analytics-driven ranking, voice search, or faceted Variant Attribute search.
- Searching SKU, barcode, reference, supplier, inventory, cost, or other internal data.
- Icon-only actions without an accessible name.
- Custom illustration or brand-logo redesign.
- Checkout, payment gateway, payment capture, saved payment instruments, fraud handling, orders, or receipts.
- Claims about financing, installments, security, refunds, or payment availability without separate business approval.
- Parallax, autoplay scroll, scroll hijacking, mandatory smooth scrolling, or content that depends on animation.

## Success Measures

- Visitors can submit a Product search and receive only eligible public Products.
- Empty search results provide a clear recovery path without fabricating Products.
- Icons preserve text meaning and accessibility across supported viewports.
- Payment methods shown publicly exactly match approved business content.
- Scroll-entry motion never blocks reading, focus, interaction, or reduced-motion users.
- Existing Homepage, Catalog, Category, Product Detail, Featured, Taxonomy, Variants, and light-only contracts do not regress.

## Dependencies

- Product Catalog public contract.
- Category Taxonomy V1.
- Product Content and Variants V1.
- Homepage and Header navigation.
- Business Contact Information.
- Design System, Accessibility, motion, and light-only Platform contracts.
- Approved payment-method content.

## Risks

- Broad search matching may reduce relevance.
- Icons may become decorative noise or replace understandable labels.
- Payment logos may imply transactional integration that does not exist.
- Animation may create layout shifts, delayed access, focus confusion, or motion discomfort.
- Bundling four workstreams may create release coupling; each workstream requires independent evidence before coordinated release.

## Resolved Payment Content

The approved informational methods are, in order: Binance, Pago móvil, and Dólares en efectivo.

The section communicates accepted methods and directs visitors to confirm details with Mandoquita. It introduces no payment selection, validation, calculation, collection, checkout, order, or transaction behavior.

Decision record: `payment-content-decision.md`.
