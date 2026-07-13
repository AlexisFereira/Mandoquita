# Feature Design

Status: Approved

Finalized: 2026-07-12

## Overview

The refreshed homepage must feel calm, deliberate, warm, and product-led. The interface should use a restrained visual language: strong typography, generous whitespace, large product imagery, subtle separation between sections, and a limited number of high-emphasis actions.

The design must avoid a marketplace appearance and avoid looking like a gallery of generic UI components. Decorative gradients, pills, borders, shadows, and nested cards should be used only when they clarify hierarchy or interaction.

The implementation must establish one visual source of truth before individual homepage components are restyled.

## User Flow

1. The visitor sees a compact header with a clear Mandoquita identity and discovery navigation.
2. The hero communicates what the business offers in Spanish and presents the primary exploration paths.
3. Supporting hero media or carousel content reinforces the offering with visible, readable content.
4. Featured products provide the first concrete catalog proof.
5. Category cards communicate catalog breadth without repeating full product grids.
6. A focused contact section offers assistance through the approved WhatsApp destination.
7. A restrained footer provides reorientation and valid secondary information.

## Information Architecture

The homepage preserves this hierarchy:

1. Header and business identity.
2. Hero and business offering.
3. Featured products.
4. Product categories.
5. Contact.
6. Footer.

Each section must have a distinct visual role:

- Hero: orientation and primary action.
- Featured products: product proof.
- Categories: catalog breadth.
- Contact: human assistance.
- Footer: low-priority support.

## Navigation

- Header navigation uses short Spanish labels and valid destinations.
- The hero primary CTA moves to featured products.
- The hero secondary CTA moves to categories.
- Product cards navigate to the existing product detail route.
- Category cards use only an approved category destination.
- The contact CTA uses the approved WhatsApp destination.
- No navigation element exposes cart, checkout, authentication, account, payment, wishlist, comparison, shipping, or unsupported routes.

## Page Structure

### Styling Foundation

- Keep one authoritative semantic variable family for background, surface, foreground, muted text, border, brand, focus, and interaction states.
- Map Tailwind semantic utilities to that variable family.
- Remove duplicate `:root`, body background, `.ds-surface`, and `.ds-card` definitions.
- Use one spacing scale, one radius scale, and one shadow scale.
- Prefer Tailwind utilities and component variants over large inline-style objects.
- Inline styles remain acceptable only for calculated values such as carousel transforms and dynamic widths.
- Apply the authoritative light theme at every viewport; system preference and stored theme state must not alter the Homepage palette.

### Header

- Use a compact, quiet surface with a subtle divider or transparency treatment.
- Replace the temporary gradient letter mark with the approved logo when available.
- Remove the descriptive subtitle from compact/mobile presentations.
- Use text navigation without pill backgrounds by default.
- Provide a clear, accessible mobile menu control with visible open/closed state.
- Maintain sticky behavior without visually overpowering the hero.

### Hero and Carousel

- Use a full-width section with a single internal content container.
- Avoid nested `Container` components and duplicated horizontal padding.
- Use an editorial two-column composition on wide screens and a single-column flow on mobile.
- Display the active slide title, description, and supported CTA instead of image-only slides.
- Use stable media proportions across breakpoints and avoid excessive vertical height.
- Integrate controls into the component's visual language.
- Previous, next, and indicator controls must have accessible names, visible focus, adequate targets, and strong contrast.
- Respect `prefers-reduced-motion` by disabling or reducing automatic transitions and non-essential movement.

### Featured Products

- Prioritize product image, name, and concise supporting information.
- Render no more than eight featured products on desktop and four on tablet and
  mobile, following the approved homepage business rule.
- Use one clear navigation affordance per card.
- Reduce decorative badge, border, shadow, and button competition.
- Avoid translating “featured” into discount or promotional language.
- Keep cards visually consistent without lifting featured items through arbitrary transforms.

### Categories

- Render a category-oriented grid using `CategoryCard` or an approved equivalent.
- Do not repeat three-product grids under each category on the homepage.
- Use category name, optional short description, optional image, and optional active-product count.
- Visually distinguish categories from product cards through proportion and content density.
- Use a three-column desktop composition, two columns on tablet, and one column
  on narrow mobile viewports when content width supports those arrangements.
- Render every category satisfying the approved eligibility rule. Do not apply a
  presentation-only category cap.

### Contact

- Add a focused full-width or high-contrast section after categories.
- Position WhatsApp as assistance and conversation, not purchase completion.
- Include one primary contact action and brief supporting copy.
- Do not introduce forms or account requirements.

### Footer

- Use a flat, low-emphasis structure rather than a large floating card.
- Include only valid links and approved business information.
- Remove transactional or unsupported language such as “Trusted shopping,” shipping, or ecommerce purchasing claims.
- Preserve clear contrast and simple responsive wrapping.

## Interaction Flow

- Hover styles supplement, but never replace, persistent interaction cues.
- Focus-visible styles use the shared focus token and remain visible against all surfaces.
- Product cards provide a single coherent clickable destination.
- Carousel manual navigation resets or continues autoplay according to the existing approved carousel behavior.
- Section anchors account for the sticky header so headings are not obscured.
- Motion is subtle, short, and disabled or reduced when the user requests reduced motion.

## Empty States

- Featured Products is not rendered when no eligible products exist.
- Categories is not rendered when no eligible categories exist.
- Carousel is omitted when no slides exist and becomes static when one slide exists.
- Contact remains available when its approved destination exists, independent of catalog content.
- Empty sections must not leave unexplained spacing, dividers, or headings.

## Error States

- Product and banner image failures display an intentional placeholder without layout shift.
- Missing logo media falls back to a text-based business identity without decorative gradients.
- Missing optional descriptions do not leave broken spacing.
- Unsupported or missing destinations must not render as active links.
- Styling failures must degrade to readable semantic HTML with usable navigation.

## Success States

- The visitor immediately understands the business offering and available exploration paths.
- Product imagery becomes the strongest content after the hero message.
- Categories are identifiable as navigation choices rather than duplicate product sections.
- Contact is prominent without resembling checkout.
- The entire page feels visually coherent across all supported viewports in the approved light theme.

## Responsive Behavior

### Mobile

- Use one content column and compact horizontal padding.
- Keep the business identity and menu control visible.
- Stack hero copy before media unless usability testing supports another order.
- Use stable media ratios and avoid viewport-height carousel frames.
- Product and category cards use full available width.
- All controls meet touch-target requirements without causing overflow.

### Tablet

- Preserve clear section spacing and use two-column grids where content width allows.
- Avoid three-column product layouts when card content becomes cramped.
- Render no more than four featured products.
- Keep hero media and text balanced without overlap.

### Desktop

- Use full-width section backgrounds with a centered internal content width.
- Use available width to create hierarchy, not oversized cards or media.
- Featured products may use three or four columns, up to the approved maximum of
  eight items, according to minimum card width.
- Maintain readable line lengths for hero and section descriptions.

## Accessibility Notes

- Meet WCAG AA text and interactive contrast requirements.
- Provide visible keyboard focus for every link, button, menu control, and carousel control.
- Use semantic header, navigation, main, section, and footer landmarks.
- Make the skip link visible when focused.
- Maintain logical heading order and DOM reading order.
- Provide meaningful image alternative text; decorative fallback media remains hidden from assistive technology.
- Ensure carousel controls have at least 44 by 44 CSS-pixel targets where applicable.
- Respect reduced motion and do not rely on automatic animation to expose required information.
- Do not hide active slide content in a way that causes confusing assistive-technology reading order.

## Dependencies

- Tailwind configuration and semantic CSS-variable mapping.
- `styles/globals.css` and the current theme stylesheet.
- Existing design-system token definitions.
- Header, Hero, Carousel, ProductCard, CategoryCard, Button, Container, Section, SectionHeader, and Footer.
- Existing homepage server-side data.
- Approved Mandoquita brand assets, Spanish copy, and WhatsApp destination.
- Existing carousel behavior tests and component tests.
