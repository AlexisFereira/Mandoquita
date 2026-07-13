# Homepage Visual Refresh

Status: Complete

Finalized: 2026-07-12

Owner: Product Requirements Architect

## Summary

The homepage is functionally usable, but its current visual presentation does not communicate the premium, modern, minimal, and product-focused experience defined for Mandoquita.

This change establishes a focused visual refresh of the homepage. Its first priority is to consolidate the styling foundation so the page has one source of truth for color, typography, spacing, surfaces, borders, radii, shadows, and responsive behavior. Once that foundation is stable, the homepage composition and its existing components will be refined to create a clearer, more intentional discovery experience.

## Business Problem

The current homepage mixes multiple styling systems, duplicated CSS variables, Tailwind utilities, legacy helper classes, and inline styles. This produces visual inconsistency and makes the experience resemble a generic design-system demonstration instead of a deliberate Mandoquita catalog.

The page also uses repeated card patterns, excessive borders and rounded surfaces, inconsistent typography, and transactional language that weakens the platform's discovery-only positioning.

Without a coherent visual foundation:

- Visitors receive an unclear or generic first impression of the business.
- Product imagery and catalog discovery do not receive enough visual priority.
- Responsive behavior is harder to control consistently.
- Future visual changes remain expensive and prone to regression.
- Components can appear different depending on which token family or styling technique they use.

## Business Goal

Create a coherent, premium, and recognizable homepage that makes the business offering, featured products, categories, and contact path easy to understand while preserving the catalog's non-transactional scope.

## Users

- First-time visitors deciding whether the catalog is relevant to them.
- Returning visitors browsing highlighted products or categories.
- Potential customers looking for a direct business contact path.
- Engineers and designers maintaining the homepage and shared components.

## Scope

### Included

- Consolidation of homepage design tokens and CSS variables into one authoritative styling source.
- Removal of conflicting homepage theme and legacy style definitions.
- A consistent typography system with explicitly loaded fonts or reliable local fallbacks.
- A restrained homepage color palette aligned with the Mandoquita identity.
- Refined responsive layout, spacing, section rhythm, and full-width section composition.
- Visual redesign of Header, Hero, Carousel, ProductCard, CategoryCard, Contact, and Footer as used by the homepage.
- Rendering category discovery as category content rather than repeated product groups.
- Visible slide content and actions in the hero/carousel where supported by existing data.
- Reduction of unnecessary borders, shadows, pills, gradients, and nested containers.
- Discovery-oriented Spanish content and labels.
- Accessible focus states, contrast, touch targets, and reduced-motion support.
- Visual and responsive regression coverage for the homepage.

### Excluded

- Authentication, accounts, cart, checkout, payments, orders, wishlist, or product comparison.
- Changes to featured-product or category eligibility business rules.
- Database migrations or catalog domain changes.
- Creation of category-detail functionality that does not already have an approved route.
- Content-management or banner-management functionality.
- A complete redesign of product detail or administrative pages.
- Adoption of a third-party component library.
- New promotional or transactional behavior.

## Success Metrics

- The homepage uses one authoritative set of semantic visual tokens.
- No homepage component depends on conflicting legacy color or theme variables.
- Header, hero, products, categories, contact, and footer are visually distinct but cohesive.
- The homepage preserves a clear reading order on mobile, tablet, and desktop without horizontal overflow.
- Product imagery and discovery paths are visually prioritized over decorative UI chrome.
- All interactive controls meet WCAG AA contrast and visible-focus expectations.
- Carousel and navigation controls provide at least a 44 by 44 CSS-pixel interaction target where applicable.
- Homepage copy does not imply cart, checkout, payment, account, or completed online purchasing behavior.
- Existing functional tests remain green and the visual refresh adds coverage for critical responsive and interaction states.

## Dependencies

- Approved Homepage requirements.
- Featured Product Curation capability approval.
- Existing Tailwind configuration.
- Existing design-system tokens and theme implementation.
- Header, Hero, Carousel, ProductCard, CategoryCard, Button, Container, Section, and Footer components.
- Existing homepage catalog data and banner assets.
- Approved business identity assets and copy.
- Approved WhatsApp contact destination for the contact action.

## Risks

- Consolidating tokens may affect components outside the homepage if shared variables are changed without an impact audit.
- A visual-only change may accidentally alter established navigation or carousel behavior.
- Missing final brand assets or product photography may limit the perceived quality of the redesign.
- Stale dark-theme behavior may override the approved light presentation unless removed and regression-tested.
- Category and contact sections may require temporary non-linked presentation if approved destinations are not available.
- Large visual snapshots can become brittle if tests assert incidental implementation details.

## Open Questions

None.

## Project Architect Decisions

- `public/images/logo.png` is the approved business identity asset for this release. A text identity remains the required fallback when the asset is unavailable.
- The carousel remains within the Hero as supporting discovery media. It shall not replace the complete Hero because the business offering and primary discovery paths must remain immediately understandable without depending on slide rotation.
- Featured Product Curation is approved as an independent capability in `../../features/featured-products/proposal.md`.
- Because no historical pre-refresh baseline exists, performance task 5.7 shall use the validated post-refresh state as the reference baseline for future regression comparisons. The quality gate is replaced, not waived.
- The Homepage always uses the platform light theme. Operating-system preference, stored theme state, and user controls shall not activate dark mode.

## Requirements Review Decision

The change was held from release until its artifacts and implementation were synchronized with the approved Homepage business requirements. Those conditions are now resolved.

The following decisions are authoritative for this review:

- The visual refresh remains a presentation-only change. It does not authorize Product domain extensions, eligibility-rule changes, or data migrations.
- The featured-product domain extension recorded in `backend-implementation.md` is traced to the independently approved Featured Product Curation capability. It remains outside this visual-refresh scope.
- The approved featured-product presentation limit remains eight products on Desktop and four products on Tablet and Mobile.
- No category presentation cap is approved. The Homepage must expose every category that satisfies the approved category eligibility rule. The recommended six-category cap is rejected unless a future business requirement explicitly authorizes it.
- WhatsApp remains the approved primary contact method, and category selection continues to the dedicated Category Page as defined by the Homepage requirements.
- The light-only platform contract is authoritative. Inverse surfaces remain component roles, not an alternative theme.
- A new general product-discovery destination is deferred. Existing Product Detail and dedicated Category Page paths satisfy the approved scope of this visual change.

Requirements Review confirms that:

- the featured-product viewport limits are implemented and validated;
- the unapproved category cap is absent from requirements and delivered behavior;
- resolved questions and obsolete blockers are synchronized by their artifact owners.

## Final Approval

Requirements Review: Approved by Product Requirements Architect on 2026-07-12.

Release Review: Approved by Project Architect on 2026-07-12.

All business, Design System, Design, Frontend, Backend, Accessibility, QA, light-only, responsive, regression, and documentation gates are complete. The change preserves the discovery-only Product Catalog scope and introduces no transactional capability.
