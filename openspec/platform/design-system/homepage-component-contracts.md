# Homepage Shared Component Contracts

Version: 1.0

Status: Active

Owner: Design System Architect

---

# Purpose

This document records the approved visual and interaction contracts for shared components changed or consumed by the homepage refresh. Feature content and business behavior remain outside this document.

---

# Header

## Purpose

Provide persistent business identity and primary discovery navigation without competing with page content.

## Contract

- Uses the inverse surface token family.
- Remains compact and sticky.
- Desktop navigation uses text links without pill containers.
- Mobile exposes one control with explicit open and closed accessible names.
- Logo failure produces a readable text identity.
- Focus remains visible for identity, navigation links, and menu control.
- Open mobile navigation remains part of the Header surface.

## Avoid

- Decorative gradient marks as the approved identity.
- Floating-card elevation.
- Unsupported or transactional destinations.
- Hover-only navigation cues.

---

# Carousel

## Purpose

Present a small sequence of supporting editorial messages and media while keeping all required content accessible without autoplay.

## Contract

- Zero slides render no carousel.
- One slide renders a static composition without navigation controls or autoplay.
- Multiple slides expose previous, next, and direct-selection controls.
- Slide title remains required; description, media, and action remain optional.
- Controls provide accessible names and minimum 44 by 44 CSS-pixel targets.
- Hover and focus within pause autoplay.
- Reduced-motion preference disables autoplay and non-essential transitions.
- Static inline values are prohibited except calculated track width, item width, and active transform.
- Overlay and controls use inverse semantic roles.

## Avoid

- Image-only slides.
- Controls whose state is communicated only by color.
- Required information that is revealed only through automatic movement.

---

# ProductCard

## Purpose

Provide one coherent path to an existing product detail while prioritizing product imagery and identity.

## Contract

- Entire card uses one product-detail destination.
- Default elevation is none.
- Featured state affects loading priority where justified, not position, elevation, or promotional styling.
- Image ratio remains stable before media loads.
- Image failure uses the shared fallback without layout shift.
- Category is supporting metadata.
- Missing description leaves no empty visual slot.
- Focus is visible around the coherent interactive surface.
- Hover image movement is subtle and disabled under reduced motion.

## Avoid

- Multiple competing actions.
- Discount or promotional implications from featured status.
- Arbitrary lift or shadow for featured products.

---

# CategoryCard

## Purpose

Represent a catalog category as a discovery destination distinct from a product.

## Contract

- Requires title and approved destination.
- Description, image, and active-product count remain optional.
- Count is supporting metadata and has no promotional meaning.
- Image and no-image states preserve coherent spacing.
- Image failure uses the shared fallback.
- Visual proportion and information density differ from ProductCard.
- The complete card provides one coherent destination and visible focus.

## Avoid

- Embedded product grids.
- Product-price or purchase language.
- Rendering a destination that has not been approved.

---

# Footer

## Purpose

Provide low-priority reorientation and approved business information after primary content.

## Contract

- Uses a flat standard surface with a restrained divider.
- Contains only valid destinations and approved information.
- Wraps without horizontal overflow.
- Link focus follows the shared focus contract.
- Contrast remains valid in the light theme across standard and inverse surfaces.

## Avoid

- Floating-card treatment.
- Transactional claims or destinations.
- Dense multi-column navigation without a demonstrated need.

---

# Shared Acceptance Criteria

All components in this document must:

- consume authoritative semantic tokens;
- contain no static color, spacing, radius, shadow, typography, or duration literals;
- support keyboard navigation and visible focus;
- preserve at least 44 by 44 CSS-pixel targets where applicable;
- support mobile, tablet, and desktop layouts;
- preserve readable semantic output when styling or optional media fails;
- support the authoritative light theme and required inverse-surface states;
- respect reduced-motion preferences;
- document any future contract change before implementation.
