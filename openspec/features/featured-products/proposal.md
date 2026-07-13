# Featured Product Curation

Status: Approved

Owner: Product Requirements Architect

Approved By: Project Architect

## Summary

Featured Product Curation defines how the business designates and orders Products that receive prioritized discovery placement.

## Business Problem

The Homepage requirements depend on a deterministic definition of Featured Products. Without an independently governed capability, designation and ordering may be inferred from incidental Product data or introduced inside unrelated visual changes.

## Business Goal

Provide a reusable and traceable business capability for designating eligible Products as Featured Products and ordering them for prioritized discovery.

## Users

- Business representatives responsible for product prioritization.
- Visitors discovering prioritized Products.

## Scope

### Included

- Featured Product designation.
- Featured Product eligibility.
- Curated Featured Product ordering.
- Deterministic ordering when Products share the same priority.
- Reuse by Homepage and future approved discovery experiences.

### Excluded

- Promotional pricing.
- Discounts.
- Paid placement.
- Product availability changes.
- Category eligibility.
- Authentication, cart, checkout, payment, or ordering behavior.
- Presentation limits belonging to a consuming feature.

## Business Rules

### BR-FPC-001 — Featured designation

A Product is a Featured Product only when it is Active and explicitly designated as Featured by the business.

### BR-FPC-002 — Curated order

Featured Products with an assigned business priority shall be ordered by ascending priority.

### BR-FPC-003 — Unranked Featured Products

An Active Product explicitly designated as Featured remains eligible when no priority is assigned and follows all ranked Featured Products.

### BR-FPC-004 — Deterministic ties

When multiple Featured Products share the same priority, the most recently created Product shall appear first.

If creation time is also equal, the stable Product identifier in ascending order shall determine the final order.

### BR-FPC-005 — Independence from promotion

Featured designation shall not imply a discount, promotion, paid placement, or commercial availability state.

### BR-FPC-006 — Designation authority

Only a Business Representative authorized to manage the Product Catalog may designate or reorder Featured Products.

This approval does not introduce a visitor-facing administration capability.

### BR-FPC-007 — Commercial Availability independence

An Active, Published, and Featured Product remains eligible for Featured discovery when it is not Commercially Available.

Commercial Availability shall not change Featured designation or Featured ordering.

### BR-FPC-008 — Current commercial offer protection

When a Featured Product is not Commercially Available, no historical price or currency shall be exposed as a current commercial offer.

The visitor-facing experience must communicate the absence of a current commercial offer without invalidating Product discovery or detail navigation.

## Success Metrics

- Every Featured Product can be traced to an explicit business designation.
- Featured ordering is deterministic for the same eligible Products.
- Consuming features do not redefine Featured Product meaning.
- Featured designation introduces no transactional behavior.

## Dependencies

- Product Catalog.
- Product editorial state.
- Authorized Business Representative.

## Risks

- Featured designation may be confused with discounts or promotions.
- Consuming features may introduce conflicting ordering rules.
- Missing priority may create ambiguity unless deterministic fallback behavior is approved.

## Approval Decision

The Project Architect approves Featured Product Curation as an independent reusable business capability.

The capability is a dependency of Homepage discovery and is not part of the Homepage Visual Refresh scope. Consuming features may define presentation limits, but they shall not redefine Featured Product designation or ordering.

The approved Commercial Availability behavior and acceptance criteria are recorded in `commercial-availability-approval.md`.
