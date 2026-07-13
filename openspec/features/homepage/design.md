# Feature Design

Status: Approved

Finalized: 2026-07-12

## Overview

The Homepage is the primary discovery entry point for the Product Catalog Platform. It must communicate what the business sells, expose featured products, expose product categories, and provide a business contact path without introducing transactional behavior.

The interface direction is modern, premium, elegant, professional, minimal, trustworthy, and product-focused. The experience should feel closer to Apple, Stripe, Linear, Shopify, Vercel, and Notion than to Amazon, Mercado Libre, or Alibaba.

The homepage is not an e-commerce storefront. It must not include or imply authentication, account creation, cart, checkout, payment, wishlist, product comparison, or order management.

The Homepage uses the approved deterministic light presentation at every
viewport. Dark inverse surfaces may be used for roles such as Header or Contact,
but they remain parts of the light presentation and do not represent an
alternative theme. Operating-system preference, stored theme state, and user
controls must not change the Homepage presentation.

## User Flow

1. The visitor lands on the homepage and sees the business identity, navigation, and the primary business offering.
2. The visitor understands what the business sells before being asked to choose a path.
3. The visitor chooses a discovery path:
   - Explore featured products.
   - Browse product categories.
   - Contact the business.
4. The visitor scans featured products as the first concrete product proof.
5. The visitor selects a featured product to continue to product detail exploration, or continues scrolling.
6. The visitor scans available categories to understand catalog breadth.
7. The visitor selects a category to continue to category-based product exploration, or continues scrolling.
8. The visitor reaches contact and can communicate with the business without entering a transaction flow.
9. The visitor exits the homepage by navigating deeper into the catalog, using contact, using global navigation, or leaving the site.

## Information Architecture

The information hierarchy must be:

1. Business identity and primary navigation.
2. Business offering orientation.
3. Primary discovery CTAs.
4. Featured products.
5. Product categories.
6. Contact.
7. Footer support content.

The user should discover:

- First: where they are and what the business sells.
- Second: which products are highlighted.
- Third: which categories or contact paths help them continue.

The homepage must organize content by visitor intent, not by internal data structure.

## Navigation

### Navigation Hierarchy

- Header navigation: primary page-level and discovery navigation.
- Hero CTAs: direct jumps into featured products and categories.
- Product actions: navigation to product detail exploration.
- Category actions: navigation to category-based product exploration.
- Contact action: navigation to the approved business contact path.
- Footer navigation: secondary support and reorientation.

### Navigation Rules

- Navigation labels must be visitor-facing and descriptive.
- Navigation must not include cart, checkout, payment, authentication, account, wishlist, or comparison paths.
- In-page navigation must land at the start of the intended section.
- Every interactive destination must be recoverable through browser navigation or global navigation.
- Header, hero, products, categories, contact, and footer must preserve a predictable top-to-bottom focus order.

## Page Structure

The homepage must use this section order:

1. Header
2. Hero / Business Offering
3. Featured Products
4. Product Categories
5. Contact
6. Footer

This order is mandatory for the first complete homepage design. Promotional content remains out of scope unless the business proposal is updated.

## Page Flow

### First Visual Focus

The first visual focus is the business offering in the hero. The visitor must understand the catalog's purpose before engaging with product or category choices.

### Secondary Focus

The secondary focus is the pair of discovery actions: featured products and categories. These actions should be visible early and clearly subordinate to the business offering.

### Tertiary Focus

The tertiary focus is the product content itself. Featured products should receive stronger emphasis than category cards because concrete product examples communicate value quickly.

### CTA Hierarchy

1. Primary CTA: Explore featured products.
2. Secondary CTA: Browse categories.
3. Section CTAs: Product and category exploration.
4. Support CTA: Contact the business.

Contact must remain important but must not visually behave like checkout or purchase completion.

### Reading Order

Reading order must follow the page structure: header, hero, featured products, categories, contact, footer.

## Visual Hierarchy

The visual hierarchy must prioritize clarity and product discovery:

1. Business offering headline.
2. Short supporting statement.
3. Hero discovery CTAs.
4. Featured product imagery and names.
5. Featured product supporting details.
6. Category names.
7. Category supporting summaries.
8. Contact prompt and action.
9. Footer links and support content.

The page should feel spacious and composed. It should avoid dense marketplace layouts, heavy promotional stacking, competing banners, excessive decorative content, and price-first presentation.

## Layout Strategy

The homepage should use a restrained editorial layout:

- Hero: broad orientation area with business message and supporting product-focused content.
- Featured Products: structured product grid with consistent card sizing.
- Product Categories: compact discovery grid that supports quick comparison.
- Contact: focused support section separated from product/category selection.
- Footer: low-priority support area.

Large whitespace must separate major sections. Internal spacing should create clear grouping between headings, descriptions, content, and actions. Cards should align to a consistent rhythm so the page feels premium and deliberate.

## Spacing Strategy

- Use generous vertical spacing between major sections.
- Use tighter spacing within grouped content so headings, descriptions, and actions feel connected.
- Keep product cards and category cards visually consistent within their own sections.
- Avoid cramped rows, overfilled sections, and excessive nested containers.
- Preserve enough spacing around CTAs for touch and keyboard focus clarity.
- Mobile spacing should reduce travel while preserving clear section boundaries.

## Content Hierarchy

### Required Content

- Business identity.
- Business offering statement.
- Supporting business/catalog context.
- Featured products.
- Product categories.
- Contact prompt.
- Approved contact method.
- Footer support content.

### Copy Rules

- Copy must use discovery-oriented language.
- Copy must not imply purchase, checkout, cart, payment, account, wishlist, or comparison behavior.
- Product and category names must use official catalog language.
- Section descriptions must be brief and functional.
- Contact copy must position contact as assistance or business communication.

## Component Composition

Use existing platform components and compose them in this order:

- Header.
- Container.
- Hero.
- Button.
- Section.
- SectionHeader.
- ProductCard.
- CategoryCard.
- Footer.

No new reusable component is required for the approved homepage scope. If an existing component cannot satisfy the design spec, that must be escalated to Design System review before implementation.

## Section Specifications

### Header

#### Purpose

Orient visitors and provide predictable access to primary discovery areas.

#### Layout

- Stable top page region.
- Business identity on the leading side.
- Primary navigation on the opposite side or in an accessible compact pattern on smaller screens.
- No promotional content inside the header.

#### Content

- Business identity.
- Navigation to homepage or catalog entry.
- Navigation to featured products.
- Navigation to categories.
- Optional navigation to contact if approved by the UX owner.

#### Components

- Header.
- Navigation links.
- Container.

#### Desktop Layout

- Business identity and navigation share one horizontal row.
- Navigation items are visible without requiring disclosure.
- Header height remains compact to preserve hero visibility.

#### Tablet Layout

- Preserve business identity and core navigation.
- If horizontal navigation becomes crowded, use the existing compact navigation behavior.
- Do not hide all discovery paths behind unclear labels.

#### Mobile Layout

- Business identity remains visible.
- Navigation uses a compact pattern.
- Compact navigation must expose featured products, categories, and contact when opened if those destinations are part of header navigation.

#### User Interactions

- Click/tap business identity returns to homepage.
- Click/tap navigation moves to the destination.
- Hover may indicate interactivity but must not reveal required content.
- Focus must clearly identify the active navigation item.
- Scroll should keep header behavior predictable and non-obstructive.

#### Accessibility

- Header must be exposed as a navigation region.
- Link names must be descriptive.
- Focus order starts with skip/main content access if present, then header identity and navigation.
- Compact navigation must be keyboard operable and must not trap focus.

### Hero / Business Offering

#### Purpose

Explain what the business sells and provide the first discovery choices.

#### Layout

- Two-part composition on desktop: business message and product-focused supporting content.
- Single-column composition on mobile.
- Hero content must remain readable and must not compete with product content.

#### Content

- Primary page heading.
- Short supporting statement.
- Primary CTA: Explore featured products.
- Secondary CTA: Browse categories.
- Product-focused supporting content or media area.

#### Components

- Hero.
- Button.
- Container.
- Optional existing media/discovery component approved by the Design System.

#### Desktop Layout

- Business message receives primary position.
- Supporting product-focused content sits adjacent or below depending on available composition.
- CTAs appear directly after the supporting statement.

#### Tablet Layout

- Business message remains first.
- Supporting content may move below the hero copy.
- CTAs remain grouped and visible before long content.

#### Mobile Layout

- Single-column flow.
- Heading, supporting statement, and CTAs appear before supporting media.
- CTAs stack or wrap in a way that preserves clear priority.

#### User Interactions

- Primary CTA scrolls or navigates to featured products.
- Secondary CTA scrolls or navigates to categories.
- Supporting content may be static unless already approved as an interactive discovery pattern.
- Hover must not be required.
- Touch targets must be comfortable.

#### Accessibility

- Hero contains the only primary page heading.
- CTA labels must announce destination clearly.
- Supporting media must have meaningful alternative text when informative.
- Decorative supporting media must not be announced as required content.

### Featured Products

#### Purpose

Show products prioritized by the business for first exploration.

#### Layout

- Section header followed by a product grid.
- Product cards use consistent sizing and aligned content areas.
- Product imagery is the strongest content inside each card.

#### Content

- Section heading.
- Short section description.
- Eligible featured products.
- Product name.
- Product category context.
- Product summary.
- Product exploration action.

#### Components

- Section.
- SectionHeader.
- ProductCard.
- Button or the ProductCard's existing action pattern.

#### Desktop Layout

- Present no more than eight featured products, as established by BR-004.
- Show multiple product cards in one row or balanced grid.
- Keep card heights visually aligned.
- Avoid showing too many products; this section is curated, not a full listing.

#### Tablet Layout

- Present no more than four featured products, as established by BR-004.
- Use fewer cards per row if needed.
- Maintain product image prominence and readable summaries.
- Preserve clear action placement within each card.

#### Mobile Layout

- Present no more than four featured products, as established by BR-004.
- Present product cards in a vertical sequence.
- Each card must be independently understandable.
- Product action appears after the product information.
- If more eligible products exist, preserve a clear path to broader catalog
  exploration without rendering hidden duplicate card content.

#### User Interactions

- Click/tap card action opens product detail exploration.
- Product image or title may also navigate if the existing ProductCard pattern supports it.
- Hover may indicate interactivity.
- Focus must expose the product action clearly.
- Scroll continues naturally to categories.

#### Accessibility

- Product names must be programmatically associated with their actions.
- Product action labels must distinguish products from one another.
- Product cards must not rely only on imagery.
- Missing product media must use the Design System fallback pattern and must not invalidate the product card.

### Product Categories

#### Purpose

Expose eligible categories so visitors can choose a browsing direction.

#### Layout

- Section header followed by category cards.
- Category cards should be less visually dominant than featured product cards.
- Layout supports quick comparison and clear selection.

#### Content

- Section heading.
- Short section description.
- Eligible category names.
- Concise category context.
- Category exploration action.

#### Components

- Section.
- SectionHeader.
- CategoryCard.
- Button or the CategoryCard's existing action pattern.

#### Desktop Layout

- Category cards use a compact grid.
- Use three columns when the available width preserves readable category names
  and interaction targets.
- Cards align consistently.
- The section should not feel denser or louder than featured products.

#### Tablet Layout

- Use two columns when the available width preserves readability; otherwise
  reduce to one column.
- Keep category names prominent.

#### Mobile Layout

- Stack categories vertically.
- Each category entry must be easy to tap and scan.
- Render every category that satisfies the approved eligibility rule; do not
  apply a presentation-only category cap.

#### User Interactions

- Click/tap category action opens category-based product exploration.
- Hover may indicate card interactivity.
- Focus state must make the selected category clear.
- Scroll continues naturally to contact.

#### Accessibility

- Category names must be the primary accessible label.
- Category actions must identify destination.
- Category layout must not depend on position alone to communicate meaning.
- Ineligible categories must not be rendered as choices.

### Contact

#### Purpose

Provide a clear contact path for visitors who need assistance, recommendations, or availability confirmation.

#### Layout

- Focused support section after product and category discovery.
- Contact prompt and action remain grouped.
- Contact is visually distinct from product and category actions but does not behave like checkout.

#### Content

- Contact section heading.
- Short support prompt.
- Approved contact method.
- Optional supporting availability or response expectation only if provided by business requirements.

#### Components

- Section.
- SectionHeader.
- Button or link action.
- Container.

#### Desktop Layout

- Contact text and contact action may sit side by side.
- Keep the section concise and low-friction.

#### Tablet Layout

- Preserve prompt and action as a unified group.
- Avoid splitting contact details across unrelated areas.

#### Mobile Layout

- Stack prompt and action.
- Contact action must be easy to tap.

#### User Interactions

- Click/tap opens the approved contact path.
- Focus makes contact action clear.
- Visitor can continue to footer without being forced to contact.

#### Accessibility

- Contact action must announce the communication purpose.
- External contact paths must be understandable before activation.
- Contact must not require authentication.
- Contact must not be described as purchase, checkout, or payment.

### Footer

#### Purpose

Provide secondary navigation and support context after the main discovery journey.

#### Layout

- Low-priority support region.
- Group links by meaning.
- Keep visual weight lower than content sections.

#### Content

- Business identity or catalog summary.
- Secondary navigation.
- Support or trust information when available.
- No transactional-only links.

#### Components

- Footer.
- Container.
- Link actions.

#### Desktop Layout

- Footer content can be grouped horizontally.
- Link groups remain easy to scan.

#### Tablet Layout

- Groups may stack or reduce columns.
- Maintain clear relationship between headings and links.

#### Mobile Layout

- Footer groups stack vertically.
- Links remain easy to tap.

#### User Interactions

- Click/tap footer links moves to approved secondary destinations.
- Hover may indicate interactivity.
- Focus must be visible.

#### Accessibility

- Footer must be exposed as a content/support region.
- Link labels must be descriptive.
- Footer must not trap keyboard users.

## Component Specification

### Header

- **Purpose:** Business identity and primary navigation.
- **Variants:** Desktop navigation, compact navigation.
- **States:** Default, hover, focus, active/current destination, expanded compact menu.
- **Interactions:** Navigate, expand/collapse compact navigation.
- **Responsive behavior:** Horizontal on desktop; compact on mobile and constrained tablet layouts.
- **Accessibility expectations:** Named navigation region, keyboard operability, visible focus, correct expanded state for compact navigation.
- **Composition rules:** Header must not contain transactional links or promotional content.

### Hero

- **Purpose:** Business orientation and first discovery choice.
- **Variants:** With supporting media/content; without supporting media/content when unavailable.
- **States:** Default, loading supporting content, missing optional supporting content.
- **Interactions:** Primary and secondary CTA activation.
- **Responsive behavior:** Two-part composition on desktop; stacked flow on tablet/mobile.
- **Accessibility expectations:** Contains primary page heading; CTA labels are explicit.
- **Composition rules:** Hero must not include dense product listing or transactional action.

### Button

- **Purpose:** Clear action trigger for navigation or contact.
- **Variants:** Primary action, secondary action, low-emphasis action.
- **States:** Default, hover, focus, active, disabled/unavailable.
- **Interactions:** Click, tap, keyboard activation.
- **Responsive behavior:** Maintains readable label and comfortable target size.
- **Accessibility expectations:** Descriptive accessible name, visible focus, disabled state communicated.
- **Composition rules:** Use only for clear commands or navigation; do not create purchase-oriented CTAs.

### Section

- **Purpose:** Group related homepage content.
- **Variants:** Standard content section, support/contact section.
- **States:** Default, loading, empty, partial error.
- **Interactions:** Section itself is non-interactive; contained actions handle interaction.
- **Responsive behavior:** Preserves section order and grouping across breakpoints.
- **Accessibility expectations:** Section heading identifies purpose.
- **Composition rules:** Do not nest unrelated section purposes.

### SectionHeader

- **Purpose:** Provide title and short explanatory context for each content group.
- **Variants:** Standard heading, heading with section-level action if approved.
- **States:** Default.
- **Interactions:** Non-interactive unless an approved action is composed nearby.
- **Responsive behavior:** Text remains readable and does not crowd content.
- **Accessibility expectations:** Heading level follows hierarchy.
- **Composition rules:** Keep copy short and descriptive.

### ProductCard

- **Purpose:** Present one featured product and route to product detail exploration.
- **Variants:** Featured product card.
- **States:** Default, hover, focus, loading product media, missing product media, unavailable action.
- **Interactions:** Select product action; optional image/title navigation if existing pattern supports it.
- **Responsive behavior:** Grid item on desktop/tablet; stacked item on mobile.
- **Accessibility expectations:** Product action identifies product name; image alternative text follows media meaning.
- **Composition rules:** Product image and name have highest priority; avoid cart or buy actions.

### CategoryCard

- **Purpose:** Present one category and route to category-based exploration.
- **Variants:** Standard category card.
- **States:** Default, hover, focus, loading category content, missing optional media, unavailable action.
- **Interactions:** Select category action.
- **Responsive behavior:** Grid item on desktop/tablet; stacked item on mobile.
- **Accessibility expectations:** Category name is the primary label; destination is clear.
- **Composition rules:** Keep category card less visually dominant than featured products.

### Footer

- **Purpose:** Secondary navigation and support context.
- **Variants:** Standard footer with grouped links.
- **States:** Default, hover/focus on links.
- **Interactions:** Link navigation.
- **Responsive behavior:** Grouped horizontally on desktop; stacked on mobile.
- **Accessibility expectations:** Descriptive link names and clear support region.
- **Composition rules:** Footer must not introduce out-of-scope transactional paths.

## Interaction Flow

### Primary Discovery Flow

1. Visitor reads hero heading and supporting statement.
2. Visitor activates "Explore featured products" or scrolls to Featured Products.
3. Visitor reviews featured products.
4. Visitor selects a product.
5. Visitor continues to product detail exploration.

### Category Discovery Flow

1. Visitor activates "Browse categories" or scrolls to Product Categories.
2. Visitor reviews eligible categories.
3. Visitor selects a category.
4. Visitor continues to category-based product exploration.

### Contact Flow

1. Visitor reaches Contact through scroll, header navigation, or after discovery.
2. Visitor reads contact prompt.
3. Visitor activates approved contact action.
4. Visitor leaves homepage for the contact path without authentication or transaction steps.

### Scroll Behavior

- Scroll follows the section order.
- In-page links land at section starts.
- No section should depend on scroll-triggered reveal to become understandable.
- Standard browser navigation must remain predictable.

## Responsive Behavior

### Desktop

- Header navigation is visible and compact.
- Hero uses a broad composition with business message and supporting product-focused content.
- Featured products use a multi-card grid with consistent card dimensions.
- Categories use a compact grid.
- Contact uses a focused horizontal or balanced composition.
- Footer groups content into clear clusters.

### Tablet

- Preserve desktop information order.
- Reduce grid density.
- Keep CTAs grouped with their related content.
- Avoid cramped card rows.
- Keep navigation clear even if compact behavior is needed.

### Mobile

- Use a single-column flow.
- Header remains compact.
- Hero copy and CTAs appear before supporting media.
- Featured products stack vertically.
- Categories stack vertically.
- Contact action remains easy to tap.
- Footer stacks by content group.
- No required content depends on hover or horizontal scrolling.

## Accessibility Notes

### Keyboard Navigation

- Keyboard order follows page order.
- All CTAs, product actions, category actions, contact actions, and footer links are keyboard reachable.
- Compact navigation must be operable with keyboard.
- Focus must not be trapped.

### Focus Order

1. Skip/main content access if present.
2. Header identity.
3. Header navigation.
4. Hero CTAs.
5. Featured product actions.
6. Category actions.
7. Contact action.
8. Footer links.

### ARIA Expectations

- Navigation regions must be named.
- Compact navigation must communicate expanded/collapsed state.
- Current or active destinations should be communicated where applicable.
- Product and category actions must have accessible names that identify the target.

### Semantic Regions

- Header region.
- Main content region.
- Distinct content sections for hero, featured products, categories, and contact.
- Footer region.

### Heading Hierarchy

- One primary page heading in the hero.
- Section headings follow in logical order.
- Card titles must not break the page heading hierarchy.

### Alternative Text Expectations

- Product images require meaningful alternative text when they communicate product identity.
- Decorative media should be ignored by assistive technology.
- Missing image fallbacks must not announce misleading content.

### Color Contrast Requirements

- Final visual implementation must satisfy WCAG AA contrast expectations for text, controls, focus indicators, and interactive states.
- Color cannot be the only way to communicate interactivity or status.

## Loading States

### Page-Level Loading

- Preserve the expected page order.
- Avoid shifting users after content loads.
- Header and hero orientation should become available before lower-priority content when possible.

### Hero Loading

- Business orientation should remain understandable even if supporting media is delayed.
- Hero CTAs should not appear interactive until their destinations are available.

### Featured Products Loading

- Maintain the Featured Products section position.
- Product card loading should preserve card rhythm and avoid layout jumps.
- Product actions become available only when product destinations are valid.

### Categories Loading

- Maintain the Product Categories section position.
- Category loading should preserve section rhythm.
- Category actions become available only when category destinations are valid.

### Contact Loading

- If contact information is loading, the section should communicate that contact information is being prepared.
- Contact action becomes available only when the approved destination is available.

## Empty States

### No Featured Products

- Do not show empty product cards.
- Do not describe this as a business error.
- Keep categories and contact available.
- If the section remains visible, explain that no products are currently featured and provide category exploration as the next action.

### No Categories

- Do not show empty category cards.
- Do not describe this as a business error.
- Keep featured products and contact available.
- If the section remains visible, explain that category browsing is unavailable and provide featured product exploration as the next action.

### No Featured Products and No Categories

- Preserve hero/business orientation and contact.
- Do not render dead product or category destinations.
- Contact becomes the primary continuation path.

### Missing Product Image

- Product remains valid.
- Use the approved Design System fallback media pattern.
- Product name and action remain available.

### Missing Category Media

- Category remains valid if eligible.
- Use text-first category presentation or approved fallback media.

## Error States

### Failed Homepage Content Request

- Preserve header, hero orientation, and contact when available.
- Explain that catalog discovery content could not be loaded.
- Provide a recovery path such as retrying discovery or contacting the business if approved.
- Do not expose internal error details.

### Missing Products

- Treat as empty featured products if no eligible products are available.
- Do not show broken product actions.

### Missing Categories

- Treat as empty categories if no eligible categories are available.
- Do not show broken category actions.

### Missing Images

- Use approved fallback media.
- Do not block product or category discovery.

### Contact Destination Failure

- Explain that contact cannot be opened.
- Preserve product and category browsing paths.
- Provide alternative contact guidance only if approved by business requirements.

## Success States

The homepage succeeds when:

- Visitor understands what the business sells.
- Visitor can find featured products.
- Visitor can find product categories.
- Visitor can open product detail exploration from a featured product.
- Visitor can open category-based exploration from a category.
- Visitor can contact the business.
- Visitor completes these actions without authentication, account creation, cart, checkout, or payment.

Success should be represented by clear navigation and continuation, not interruptive confirmation messages.

## Animation Guidelines

- Animations should be subtle, brief, and purposeful.
- Use motion only to clarify interactivity, support orientation, or smooth state transitions.
- Avoid attention-seeking motion that competes with product content.
- Avoid required information appearing only through animation.
- Respect user motion preferences where applicable.
- Loading transitions should reduce perceived abruptness without delaying access to content.
- Hover/focus feedback should feel immediate and calm.

## Visual Consistency Rules

- Preserve the approved light-only presentation across first paint, hydration,
  navigation, and every supported viewport.
- Treat inverse surfaces as semantic component roles, not as dark mode.
- Maintain consistent section spacing.
- Maintain consistent card sizing within product and category groups.
- Maintain consistent heading hierarchy across sections.
- Keep CTA placement predictable: hero CTAs near hero copy, card CTAs inside cards, contact CTA inside contact section.
- Keep product imagery visually dominant inside product cards.
- Keep category cards simpler than product cards.
- Use balanced whitespace around major content groups.
- Avoid nested card-within-card compositions.
- Avoid dense marketplace patterns.
- Avoid transactional CTA language.
- Keep footer visually lower priority than main discovery content.

## Dependencies

- Approved homepage proposal.
- Approved homepage UX blueprint.
- Product Catalog.
- Categories.
- Featured Products.
- Product Detail.
- Business Contact Information.
- Design System.
- Navigation capability.
- Existing component library: Header, Hero, Section, SectionHeader, ProductCard, CategoryCard, Button, Container, Footer.

## Design Validation Checklist

- [x] The page communicates what the business sells before asking the visitor to browse.
- [x] The page hierarchy is clear: hero, featured products, categories, contact, footer.
- [x] Featured products are visually more prominent than categories.
- [x] Product discovery remains the primary experience.
- [x] The design avoids marketplace density.
- [x] The design avoids cart, checkout, payment, account, wishlist, and comparison patterns.
- [x] CTA hierarchy is clear and consistent.
- [x] Every section has defined purpose, layout, content, components, responsive behavior, interactions, and accessibility requirements.
- [x] Desktop layout supports scanning and product comparison.
- [x] Tablet layout remains readable and touch-friendly.
- [x] Mobile layout follows a single-column discovery journey.
- [x] Keyboard navigation and focus order are defined.
- [x] Semantic regions and heading hierarchy are defined.
- [x] Product and category image expectations are defined.
- [x] Empty states are defined for missing featured products, missing categories, and missing media.
- [x] Loading states are defined for hero, products, categories, and contact.
- [x] Error states are recoverable and do not expose internal details.
- [x] Animation guidance is subtle and usability-driven.
- [x] Visual consistency rules preserve spacing, card rhythm, CTA placement, and product focus.
- [x] No React code, HTML, CSS, Tailwind classes, backend decisions, or new business requirements are included.
