# Homepage UX/UI Review

Version: 4.0

Status: Visual Design Approved

Owner: Senior UI/UX Designer

Reviewed Artifacts:

- `openspec/features/homepage/proposal.md`
- `openspec/features/homepage/ux-blueprint.md`
- `openspec/features/homepage/design.md`
- `openspec/changes/homepage-visual-refresh/design.md`
- Current rendered homepage composition in `pages/index.tsx`
- Current homepage payload rules in `src/server/homepageService.ts`

Re-reviewed after the UX Solution Architect synchronized responsive density,
category composition, empty-state behavior, and navigation hierarchy on
2026-07-12.

## UX Solution Requirements Adopted

The UI review now uses the following UX Solution requirements as its source of
truth:

| Area | UX Solution requirement | UI consequence |
| --- | --- | --- |
| Featured products | Maximum 8 on desktop and 4 on tablet/mobile | Desktop uses a balanced grid of up to four columns; smaller viewports render only the four eligible items, without visually or semantically hidden duplicates. |
| Categories | Three columns on desktop, two on tablet, one on narrow mobile | Cards preserve readable names, a minimum 44px interaction target, and lower visual emphasis than product cards. |
| Category quantity | Every eligible category remains discoverable; there is no presentation cap | The responsive grid expands naturally and never creates placeholder cards or hides eligible categories. |
| Content order | Hero, featured products, categories, contact, footer | Section styling must reinforce this priority without reordering the document at any breakpoint. |
| Empty collections | Omit the complete optional section | No orphan heading, divider, skeleton, or vertical gap remains after omission. |
| Contact | WhatsApp assistance from header and contact section | The action uses conversational language and must not resemble checkout or purchase completion. |
| Wider discovery | General catalog discovery is deferred until an approved destination exists | Do not invent a route or CTA; smaller viewports present the approved four-item featured subset without hidden duplicates. |

## UI Specification Delta

These requirements supersede any earlier UI interpretation that treated the
same number of featured cards as valid at every breakpoint.

### Featured product presentation

- Desktop: up to four columns and two balanced rows for the approved maximum of
  eight products.
- Tablet: two columns and no more than two rows, for a maximum of four products.
- Mobile: one column and no more than four product cards.
- Product imagery remains the dominant card element; name, category context, and
  one detail affordance follow in that order.
- Do not add a general catalog CTA until Product Requirements and UX Solution
  approve its destination.

### Category presentation

- Desktop: three equal columns with consistent card height.
- Tablet: two columns when names and targets remain readable; otherwise one.
- Narrow mobile: one column, full available width.
- Category cards use less elevation, metadata, and visual weight than featured
  product cards so the established hierarchy remains visible.
- Render every eligible category returned by the approved contract. The grid must
  remain valid at any collection size without empty positions or placeholders.

### Responsive acceptance points

- Validate featured-item count and category columns at 320, 375, 430, 768, 1024,
  1280, 1440, and 1920 CSS pixels.
- No breakpoint may require horizontal scrolling for discovery content.
- DOM and visual order remain identical across breakpoints.
- Focus follows visible content and never enters a visually hidden product card.
- Section anchors remain unobstructed by the sticky header.

## Review Outcome

The updated homepage direction is coherent, restrained, product-led, responsive
in structure, and recognizably aligned with Mandoquita. The hierarchy correctly
prioritizes business orientation, featured products, categories, assistance, and
footer content. Transactional patterns remain outside the experience.

The visual design direction is approved. Remaining decisions and repeatable QA
evidence are tracked below without changing the approved UI hierarchy.

## Confirmed UX/UI Decisions

- The primary contact channel is WhatsApp and is framed as personalized help.
- Contact is available from global navigation and the dedicated contact section.
- Featured products precede categories in the homepage hierarchy.
- "Productos destacados" is the approved visitor-facing label and does not imply
  a promotion or discount.
- Missing featured products or categories omit their complete section.
- Promotional and transactional experiences remain outside the homepage scope.
- Category cards lead to category exploration and product cards lead to product
  detail exploration.

## Findings and Follow-up

### UXUI-001 — Featured product count on tablet and mobile

Status: Resolved in implementation; final repeatable regression coverage remains
owned by QA.

The homepage now selects four products below the 1280px wide breakpoint and up to
eight at wider viewports. The selected collection drives both visible cards and
structured data, so smaller viewports do not retain hidden duplicate card content.
Rendered inspection confirmed four cards at 375px and 768px.

Acceptance preserved:

- Render no more than four featured products on tablet and mobile.
- Preserve access to further catalog exploration through a clear, non-transactional
  path if more eligible products exist.
- Avoid client-only hiding that leaves duplicated or confusing screen-reader
  content.

No additional UI design action is required for this finding.

### UXUI-002 — Eligible category presentation

Status: Resolved.

Product Requirements approved an uncapped eligible-category collection. Backend
returns every eligible category and Frontend renders the complete collection.
The UI uses one column on narrow mobile, two on tablet, and three on desktop while
keeping category cards visually subordinate to featured products.

### UXUI-003 — Contrast evidence

Status: Resolved for UI review; repeatable evidence is present in the automated
contrast suite.

The Senior UI/UX Designer completed a mathematical audit of the implemented RGB
tokens using WCAG relative luminance. Text, primary actions, and focus indicators
pass in the audited combinations. Generic low-contrast borders are accepted only
as supplemental section or surface separation. Interaction boundaries that must
communicate state consume the primary interaction color, which passes 3:1.

| Pair | Ratio | UI result |
| --- | ---: | --- |
| Light foreground / light background | 17.01:1 | Pass |
| Light muted / light background | 4.63:1 | Pass for normal text |
| White / primary | 5.09:1 | Pass for normal text |
| Light focus / light background | 5.24:1 | Pass |
| Light focus / light surface | 5.47:1 | Pass |
| Light focus / inverse surface | 3.39:1 | Pass |
| Light border / light background | 1.15:1 | Decorative separation only |
| Light border / light surface | 1.20:1 | Decorative separation only |
| Inverse foreground / inverse surface | 18.55:1 | Pass |
| Inverse muted / inverse surface | 11.26:1 | Pass for normal text |
| Inverse border / inverse surface | 2.62:1 | Decorative separation only |

Ongoing Design System constraint:

- Record WCAG 2.2 AA ratios for every semantic pair used by the homepage.
- Verify focus indicators at a minimum 3:1 against adjacent colors.
- Verify normal text at 4.5:1 and large text or essential graphics at 3:1.

The React Frontend Architect must continue to ensure low-contrast borders remain
supplemental decoration and consume the passing primary interaction token whenever
a border communicates control state. The 28 automated contrast assertions protect
required text, action, status, focus, control, and interaction-border pairs.

## Rendered Visual Review

The 1440px rendered homepage was inspected in Chrome after the UX Solution update.

Passed:

- Mandoquita identity and navigation are immediately recognizable.
- Hero message is the dominant page element and discovery CTAs are clearly ordered.
- Carousel supports the hero without overpowering its primary message.
- Featured products are visually stronger than categories.
- Spacing and section rhythm are restrained and consistent.
- Contact language remains assistance-oriented and non-transactional.
- The desktop composition avoids marketplace density.

Final QA revalidation stores eight responsive baselines from 320px through 1920px
and nine route/preference baselines under `tests/visual/`. The evidence confirms
the 8/4/4 featured-product limits, uncapped eligible categories, expected 1/2/4
product columns, expected 1/2/3 category columns, no horizontal overflow, sticky
header offsets, focus behavior, and the deterministic light-only presentation.

## Non-Blocking Observations

- The page uses clear Spanish, action-oriented labels.
- Product content is visually prioritized over decorative interface chrome.
- Empty sections are omitted rather than replaced with dead-end messaging.
- Sticky navigation destinations match the discovery-only scope.
- The contact section is visually distinct without resembling checkout.

## Release Follow-up Conditions

No UX/UI release blocker remains. Requirements Review and Release Review retain
their independent owner approvals.

## Re-review Decision

The UX Solution update and subsequent frontend change resolve responsive featured
product density and uncapped category presentation, providing an implementable
composition. The rendered hierarchy,
brand expression, product emphasis, spacing, CTA treatment, and non-transactional
language satisfy the Senior UI/UX Designer review. Design Review is **Approved**;
all UX/UI findings are resolved and repeatable visual evidence is stored by QA.
