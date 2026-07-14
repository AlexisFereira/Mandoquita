# UX Blueprint

Status: Approved

Finalized: 2026-07-12

> **Active UX amendment (2026-07-14):** All V1 visual, responsive and component
> composition guidance below is historical. `merchandising-layout-v2.md` and
> `../../platform/design-system/public-catalog-visual-contract.md` govern the
> active journey and presentation: Banner Slider, Categories, Featured Products,
> Payment Methods, daily selected-Category Products and Contact.

## Feature Goal

From the visitor's perspective, the homepage must quickly answer four questions:

- What does this business sell?
- What product categories can I explore?
- Which products are being highlighted?
- How can I contact the business?

The homepage should encourage product discovery and guide visitors deeper into the catalog without introducing transactional behavior. A visitor must be able to explore products, explore categories, or contact the business without authentication, account creation, cart usage, checkout, or payment.

## User Journey

1. The visitor lands on the homepage.
2. The visitor identifies the business and understands the product offering.
3. The visitor chooses an exploration path:
   - Continue to featured products.
   - Continue to categories.
   - Continue to contact if they need assistance.
4. The visitor reviews featured products if they want immediate recommendations.
5. The visitor selects a featured product if one matches their intent.
6. The visitor navigates to product detail exploration.
7. If featured products are not enough, the visitor reviews available categories.
8. The visitor selects a category to continue category-based exploration.
9. If the visitor needs help, availability clarification, or business communication, the visitor accesses the contact path.
10. The visitor leaves the homepage by navigating deeper into the catalog, contacting the business, using global navigation, or exiting the site.

The journey must remain discovery-first. No step may require a login, account, cart, checkout, or payment.

## Information Architecture

The homepage information hierarchy follows user decision priority:

1. **Business orientation**
   The visitor first needs to know where they are and what the business sells.

2. **Primary discovery paths**
   The visitor then needs clear options to explore featured products, categories, or contact.

3. **Featured product discovery**
   Featured products receive early priority because they provide concrete product examples and support fast browsing.

4. **Category discovery**
   Categories help visitors broaden exploration once they understand the offering.

5. **Contact**
   Contact appears after product and category context so visitors can ask informed questions.

6. **Secondary support information**
   Footer-level information supports trust and wayfinding but should not compete with discovery.

Users should discover first what the business sells, second which products are highlighted, and third which categories or contact paths help them continue.

## Page Structure

### 1. Header

- **Purpose:** Orient visitors and provide stable access to primary discovery areas.
- **Why it exists:** Visitors need to know where they are and how to move through the catalog.
- **Information displayed:** Business identity and primary navigation destinations.
- **Expected user action:** Navigate to homepage discovery areas or return to the homepage identity point.
- **Navigation destination:** Homepage, featured products section, categories section, contact section, or approved catalog destinations.

### 2. Hero / Business Orientation

- **Purpose:** Explain what the business sells and present the main discovery choices.
- **Why it exists:** Visitors need immediate orientation before deciding what to explore.
- **Information displayed:** Business offering statement, short supporting context, and primary discovery actions.
- **Expected user action:** Choose to explore featured products, browse categories, or continue scrolling.
- **Navigation destination:** Featured products section or categories section.

### 3. Featured Products

- **Purpose:** Highlight products prioritized by the business for initial attention.
- **Why it exists:** Featured products provide concrete examples and reduce the effort required to begin browsing.
- **Information displayed:** Featured products that are eligible for visitor discovery.
- **Expected user action:** Select a featured product for deeper exploration or continue to categories.
- **Navigation destination:** Product detail exploration for the selected product.

### 4. Product Categories

- **Purpose:** Show available categories so visitors can choose a browsing direction.
- **Why it exists:** Categories help visitors understand the catalog breadth and narrow their intent.
- **Information displayed:** Eligible category names and concise category context.
- **Expected user action:** Select a category to continue browsing related products.
- **Navigation destination:** Category-based product exploration.

### 5. Contact

- **Purpose:** Provide a way to reach the business for questions or assistance.
- **Why it exists:** The platform encourages external communication instead of transactional checkout.
- **Information displayed:** Contact prompt and approved contact method.
- **Expected user action:** Use the contact method or return to product/category exploration.
- **Navigation destination:** Approved business contact path.

### 6. Footer

- **Purpose:** Provide secondary navigation and support context.
- **Why it exists:** Visitors may need supporting links or a final way to reorient after reaching the end of the page.
- **Information displayed:** Secondary navigation and supporting business/catalog information.
- **Expected user action:** Navigate to secondary destinations or return to catalog discovery.
- **Navigation destination:** Approved secondary pages or discovery areas.

## Wireframe

```text
----------------------------------------------------
Header
  Business Identity
  Primary Navigation

Hero / Business Orientation
  What the business sells
  Supporting context
  Primary action: Explore featured products
  Secondary action: Browse categories

Featured Products
  Section heading
  Featured product entries
  Product exploration actions

Product Categories
  Section heading
  Category entries
  Category exploration actions

Contact
  Contact prompt
  Approved contact method

Footer
  Secondary navigation
  Supporting business/catalog information
----------------------------------------------------
```

This wireframe defines order and hierarchy only. It does not define visual styling, layout measurements, colors, typography, or implementation.

## Navigation Flow

### In-Page Navigation

- Header navigation can move visitors to featured products, categories, and contact.
- Hero primary action moves to featured products.
- Hero secondary action moves to categories.
- Scrolling moves through the page in the same order as the information hierarchy.

### Deeper Catalog Navigation

- Featured product selection moves to product detail exploration.
- Category selection moves to category-based product exploration.
- Global navigation may move to approved catalog areas.

### Contact Navigation

- Contact action moves to the approved business contact path.
- Contact must not require authentication, account creation, cart usage, checkout, or payment.

### Excluded Navigation Paths

The homepage must not navigate to:

- Cart.
- Checkout.
- Payment.
- Authentication.
- Account creation.
- User profile.
- Wishlist.
- Product comparison.

## Content Hierarchy

Highest priority belongs to the business offering because visitors need immediate orientation.

Second priority belongs to discovery actions because the homepage exists to move visitors into catalog exploration.

Third priority belongs to featured products because concrete products communicate catalog value faster than abstract descriptions.

Fourth priority belongs to categories because categories help visitors broaden or narrow their browsing path.

Fifth priority belongs to contact because it supports decision-making after visitors understand the business and catalog.

Footer content receives the lowest priority because it supports navigation and trust but is not the primary discovery path.

## Interaction Model

### Click / Tap

- Select navigation destinations.
- Move to featured products.
- Move to categories.
- Open product detail exploration.
- Open category-based exploration.
- Access the approved contact method.

### Scroll

- Progress through the homepage section order.
- Review discovery content from general orientation to specific product/category paths.

### Hover

- May provide affordance feedback for interactive elements.
- Must not reveal required information.
- Must not be the only way to access content.

### Swipe

- May be available only if an approved existing pattern uses it.
- Required homepage discovery must remain accessible without swipe.

### Keyboard Interaction

- All navigation and discovery actions must be reachable by keyboard.
- Focus movement must follow the page hierarchy.
- No interaction may trap focus.

## Responsive Strategy

### Desktop

- Prioritize fast scanning and comparison.
- Business orientation and discovery actions should be available early.
- Featured products and categories may appear in grouped layouts that support comparison.
- Contact should remain visually separate from product/category exploration.

### Tablet

- Preserve the same content order as desktop.
- Reduce density so product and category choices remain readable.
- Present no more than four featured products, following the approved business
  rule.
- Use a two-column category composition when width permits; otherwise preserve a
  single-column flow.
- Keep touch targets comfortable.
- Avoid compressing navigation or section actions into ambiguous groups.

### Mobile

- Use a single-column journey.
- Order remains: header, business orientation, featured products, categories, contact, footer.
- Primary discovery actions should appear before long content.
- Present no more than four featured products, following the approved business
  rule.
- Product and category entries should be easy to evaluate one at a time.
- Horizontal movement must not be required for core discovery.
- Hover-dependent behavior must not be required.

## Accessibility Strategy

### Keyboard Navigation

- Keyboard order follows the document order.
- Header links come before hero actions.
- Hero actions come before featured products.
- Featured product actions come before category actions.
- Category actions come before contact.
- Footer links come last.

### Focus Order

- Focus must never jump unexpectedly between sections.
- Every interactive element must show a visible focus state in the final design.
- The contact action must be reachable without navigating through transactional elements.

### Semantic Regions

- The page should have identifiable regions for header, main homepage content, section groups, contact, and footer.
- The main content should include one primary heading.
- Section headings should describe their purpose clearly.

### Screen Reader Expectations

- The visitor should understand the page purpose from the primary heading and first section.
- Product and category actions should announce meaningful destinations.
- Contact action should announce the contact purpose.
- Empty or unavailable optional content should not be announced as a system failure.

## UX Risks

### Risk: Homepage Feels Like A Storefront

The page may drift into marketplace or checkout-oriented patterns.

Mitigation:

- Keep language focused on discovery and contact.
- Exclude cart, checkout, payment, account, wishlist, and comparison paths.
- Avoid dense product-listing behavior on the homepage.

### Risk: Too Many Equal-Priority Choices

Visitors may not know whether to choose products, categories, or contact.

Mitigation:

- Prioritize business orientation first.
- Present featured products before categories.
- Keep contact available but secondary to discovery.

### Risk: Featured Products Are Ambiguous

Visitors may not understand why products are featured.

Mitigation:

- Use the approved visitor-facing label "Productos destacados".
- Keep featured product content concise.
- Present only products that satisfy the approved featured-product eligibility
  rule; do not imply discount or promotion.

### Risk: Category Discovery Lacks Context

Categories may feel like labels without enough meaning.

Mitigation:

- Provide concise category context.
- Ensure category names are visitor-facing.
- Avoid showing ineligible or unavailable categories.

### Risk: Contact Is Mistaken For Checkout

Visitors may interpret contact as a buying flow.

Mitigation:

- Present contact as assistance or business communication.
- Avoid transactional language.
- Keep contact separate from product selection actions.

### Risk: Mobile Flow Becomes Too Long

Visitors may miss categories or contact if the page is too dense.

Mitigation:

- Keep sections concise.
- Preserve clear section headings.
- Keep primary actions available early.

## Resolved UX Decisions

- WhatsApp is the primary contact path. It is presented as assistance, not as a
  purchase or checkout action.
- Contact is reachable from the header and from the dedicated in-page contact
  section so visitors can access help without completing the discovery journey.
- The homepage presents one responsive 2/3/4/6-item Featured row and continues
  the expanded collection through `Ver más destacados`.
- Categories appear before Featured Products under the active merchandising
  hierarchy.
- The visitor-facing label is "Productos destacados". Supporting copy describes
  a selection by Mandoquita and does not imply a discount or promotion.
- Promotional content remains outside the homepage until explicitly approved in
  product scope.
- When no featured products are eligible, the section is omitted without leaving
  an orphan heading, divider, or spacing artifact.
- When no categories are eligible, the section is omitted without leaving an
  orphan heading, divider, or spacing artifact.
- Every eligible category remains reachable. The compact one-row rail may hide
  overflow visually only when its final visible item is `Ver todas`.
- The Homepage uses the approved deterministic light presentation at every
  viewport. Header/navigation remain light; bounded inverse overlays are
  component roles, not an alternative theme. Operating-system preference,
  stored state, and user controls do not change the experience.

## UX Validation Checklist

- [x] The blueprint explains the homepage goal from the visitor's perspective.
- [x] The user journey starts at landing and ends with deeper catalog navigation, contact, or exit.
- [x] The information hierarchy prioritizes business orientation before discovery details.
- [x] The page structure includes every required section in order.
- [x] Every section includes purpose, reason for existing, displayed information, expected user action, and navigation destination.
- [x] The textual wireframe communicates hierarchy without visual styling.
- [x] Navigation paths include in-page movement, product exploration, category exploration, contact, and excluded transactional destinations.
- [x] Content hierarchy explains why each information group receives its priority.
- [x] Interaction model covers click, tap, hover, scroll, swipe, and keyboard behavior without animation details.
- [x] Responsive strategy covers desktop, tablet, and mobile without implementation details.
- [x] Accessibility strategy covers keyboard navigation, focus order, semantic regions, and screen reader expectations.
- [x] UX risks are identified with friction-reduction strategies.
- [x] Remaining uncertainty is explicitly separated from approved decisions without inventing a business rule.
- [x] The blueprint does not introduce authentication, cart, checkout, payment, account, wishlist, or comparison functionality.
- [x] The blueprint does not define code, markup, styles, colors, typography, tokens, or implementation details.
