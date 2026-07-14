# Homepage Shared Component Contracts

Version: 1.1

Status: Active

Owner: Design System Architect

---

# Purpose

This document records the approved visual and interaction contracts for shared components changed or consumed by the homepage refresh. Feature content and business behavior remain outside this document.

It is subordinate to `public-catalog-visual-contract.md`, which governs the
complete public catalog and supersedes conflicting historical patterns.

---

# Header

## Purpose

Provide persistent business identity and primary discovery navigation without competing with page content.

## Contract

- Uses the light standard surface and foreground token family.
- Remains compact and sticky.
- Aligns identity and navigation to the centered 1400px wide boundary.
- Displays the logo at 50px height with automatic width and preserved aspect
  ratio.
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
- Uses opacity fade only; horizontal translation and track motion are prohibited.
- Uses heights 200/250/300/350/400px at base/640/768/1024/1280.
- Media spans the viewport while meaningful content and controls align to the
  centered 1400px boundary.
- Inactive slides are hidden from interaction and accessibility navigation.
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
- Outer radius is 8px and clips its contents.
- Media spans the complete card width without image padding.
- Featured state affects loading priority where justified, not position, elevation, or promotional styling.
- Image ratio remains stable before media loads.
- Image failure uses the shared fallback without layout shift.
- Category is supporting metadata.
- Collection cards omit product description and leave no empty visual slot.
- Focus is visible around the coherent interactive surface.
- Hover image movement is subtle and disabled under reduced motion.

## Avoid

- Multiple competing actions.
- Discount or promotional implications from featured status.
- Arbitrary lift or shadow for featured products.

---

# Homepage CategoryLink

## Purpose

Represent a catalog category as a compact Homepage discovery destination
distinct from both ProductCard and the richer general Category card.

## Contract

- Requires title, approved destination and a 100px circular media/fallback area.
- Description and active-product count are not rendered.
- The title is centered below media.
- Items form one non-wrapping row with a 30px gap.
- Responsive overflow ends in the `Ver todas` destination without reordering
  source items.
- Image failure uses the shared fallback.
- The complete link provides one coherent destination and visible focus.

## Avoid

- Embedded product grids.
- Product-price or purchase language.
- Card chrome, count badges and category descriptions on the Homepage rail.
- Rendering a destination that has not been approved.

---

# Footer

## Purpose

Provide low-priority reorientation and approved business information after primary content.

## Contract

- Uses a flat standard surface with a restrained divider.
- Aligns content to the centered 1400px wide boundary.
- Contains only valid destinations and approved information.
- Wraps without horizontal overflow.
- Link focus follows the shared focus contract.
- Contrast remains valid in the light theme across standard and inverse surfaces.

## Avoid

- Floating-card treatment.
- Transactional claims or destinations.
- Dense multi-column navigation without a demonstrated need.

---

# Wide Container and CollectionGrid

The public catalog consumes the Platform contract in
`merchandising-layout-contract/`:

- `Container size="wide"` provides the canonical public-page centered 1400px
  maximum without changing other component sizes/defaults;
- `CollectionGrid` preserves one semantic child collection and source/focus order;
- collection density is 2/3/4/6 columns at base/640/1024/1400px;
- the layout primitive never caps, hides, clones, sorts or reorders entities; and
- feature contracts retain ownership of eligibility, limits and Card meaning.

# Payment and Contact compositions

- Payment is an 8px-radius static media banner with title and explanatory copy
  overlaid as HTML inside it. Its responsive heights are
  160/220/300/350px at base/640/1024/1280. Decorative media uses empty alt text.
- Contact is stacked on narrow screens and a content/media split on desktop.
  Its primary label is `Hablar por WhatsApp`; redundant decorative media uses
  empty alt text.
- Neither composition introduces a transaction, payment state or delivery
  guarantee.

---

# Shared Acceptance Criteria

All components in this document must:

- consume authoritative semantic tokens;
- contain no static color, spacing, radius, shadow, typography, or duration literals;
- support keyboard navigation and visible focus;
- preserve at least 44 by 44 CSS-pixel targets where applicable;
- support mobile, tablet, and desktop layouts;
- preserve readable semantic output when styling or optional media fails;
- support the authoritative light theme and bounded inverse overlays where
  explicitly required for contrast;
- respect reduced-motion preferences;
- document any future contract change before implementation.
