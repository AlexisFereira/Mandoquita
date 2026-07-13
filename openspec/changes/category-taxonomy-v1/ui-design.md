# Category Taxonomy V1 — UI Design

Version: 1.0

Status: Approved for Frontend Planning

Owner: Senior UI/UX Designer

Source of truth:

- `proposal.md`
- `requirements.md`
- `taxonomy.md`
- `migration-decision.md`
- `architecture-review.md`
- `ux-blueprint.md`
- Platform Design System

## UX Analysis

The visitor needs to understand three different levels without experiencing them
as three competing navigation systems. Category is the broad orientation,
Subcategory is the narrowing choice, and Product is the primary discovery result.
Product Type remains classification context and is not presented as an additional
public navigation level.

The UI must make the current branch obvious, preserve the official Spanish names,
and provide a predictable recovery path. It must not expose empty or inactive
branches, fabricate taxonomy content, or alter eligibility and ordering rules.

## Information Hierarchy

The visual priority is:

1. Current page purpose and selected branch.
2. Eligible Products in the active branch.
3. Eligible Category or Subcategory choices used to continue exploration.
4. Parent and general Category recovery paths.
5. Product Type and supporting metadata.

Breadcrumb context appears before the page title but remains visually quieter.
Subcategory choices are more prominent than recovery navigation and less prominent
than the current page title or Product results.

## Layout Proposal

### General Category discovery

1. Shared Header.
2. Main content with breadcrumb or short orientation label.
3. One `h1` explaining Category discovery.
4. Concise supporting text with a readable line length.
5. Complete eligible Category grid in approved order.
6. Empty or unavailable recovery state when no eligible Categories exist.
7. Shared Footer.

Category cards use official name as their primary label, optional approved
description as supporting text, and one coherent destination. They do not display
Product Type lists or dense Product previews.

### Category exploration

1. Breadcrumb: Categorías → selected Category.
2. Official Category name as `h1` and optional approved description.
3. Eligible Subcategory choices in source sequence.
4. Product-results heading with result context.
5. Responsive Product grid for the complete Category branch.
6. Recovery navigation to general Category discovery.

If no eligible Subcategories exist but eligible Products remain, the Subcategory
region is omitted completely. Product results keep their normal position without
an orphan heading or spacing gap.

### Subcategory exploration

1. Breadcrumb: Categorías → parent Category → selected Subcategory.
2. Official Subcategory name as `h1`.
3. Compact parent-Category context.
4. Product-results heading.
5. Responsive Product grid restricted to the selected Subcategory branch.
6. Recovery navigation to parent Category and general Category discovery.

### Product Detail taxonomy context

The existing Product Detail composition remains primary. Taxonomy context appears
as supporting metadata near the Product identity:

- Product Type is text, not an interactive filter or page destination.
- Eligible Subcategory and Category names may be links to their approved routes.
- Breadcrumb and metadata use the same official Spanish names shown in discovery.

## Components

Use existing Design System components and patterns:

| Need | Approved component or pattern | UI contract |
| --- | --- | --- |
| Page width | `Container` | One centered internal container per section. |
| Section rhythm | `Section`, `SectionHeader` | No nested card around the complete page. |
| Category destination | `CategoryCard` | One coherent link, visible focus, optional description/media/count. |
| Subcategory destination | Existing `Card` composed as a link | Official name is dominant; no Product previews or invented icons required. |
| Products | `ProductCard` | Existing detail destination and media fallback contract. |
| Recovery action | `Button` link, outline or ghost | Specific destination label; never “Continuar” or “Aceptar”. |
| Active context | Text heading, breadcrumb and optional semantic Badge | Never communicated through color alone. |
| Loading | Existing skeleton primitives | Preserve layout without selectable placeholder taxonomy entities. |

A new reusable taxonomy component is not required for V1. If frontend identifies a
repeated hierarchy pattern that existing composition cannot express accessibly, it
must return to Design System review before creating a shared component.

## Visual Direction

### Color and surfaces

- Consume the authoritative light semantic palette.
- Use the standard page background and white content surfaces.
- Reserve inverse surfaces for the existing Header and established high-contrast
  platform regions; taxonomy navigation does not introduce a new inverse panel.
- Use primary color for meaningful actions and active interaction borders.
- Generic borders remain supplemental separation and never the only state cue.

### Typography

- One `h1` identifies the current discovery level.
- `h2` identifies Subcategories and Product results.
- Category and Subcategory card names use a consistent component-heading style.
- Supporting descriptions use body or body-small with `60–75` character line
  length where practical.
- Internal identifiers, taxonomy version and migration terminology are never
  rendered as visitor-facing labels.

### Spacing and density

- Use the established 4px token scale with primary rhythm at 8, 16, 24, 32, 48
  and 64px.
- Major page regions use 48–64px separation on desktop and 32–48px on mobile.
- Card grids use the shared 24px gap.
- Category cards remain less dense than Product cards.
- Subcategory choices use concise content and do not compete visually with the
  Product grid.

### Imagery

- Category imagery is optional and uses the existing fallback contract.
- Missing media never invalidates a Category or changes its ordering.
- Subcategory choices are text-first; no decorative image is required.
- Product imagery retains the existing stable aspect ratio and visual priority.

## Responsive Behavior

### Mobile — below 640px

- Use one top-to-bottom column.
- Horizontal page padding is 16px minimum through the shared Container contract.
- Breadcrumbs wrap across lines; they never become a horizontally scrolling strip.
- Category and Subcategory destinations occupy the full available width.
- Product cards render in one column.
- Current branch and recovery paths appear before Product results without using a
  sticky secondary navigation bar.
- Every interactive target is at least `44px × 44px`.

### Tablet — 640px to 1023px

- Category and Subcategory choices use two columns when names remain readable.
- Product cards use two columns.
- Breadcrumb, title and branch context retain desktop semantic order.
- Long official names wrap naturally; truncation must not hide the distinguishing
  part of a taxonomy label.

### Desktop — 1024px and above

- Category discovery uses three columns.
- Subcategory choices use two or three columns according to available width and
  label length, without changing source order.
- Product cards use three columns at standard desktop widths and up to four at the
  established wide breakpoint.
- Content remains centered within the approved maximum width.
- Do not create a persistent sidebar for V1; it would give hierarchy navigation
  equal visual weight to Product discovery and diverge from the approved UX flow.

## Interaction States

### Default and hover

- Category and Subcategory destinations look interactive without requiring hover.
- Hover may strengthen border or text emphasis but does not reveal required text.
- Motion uses existing duration tokens and respects reduced motion.

### Focus and keyboard

- Every destination uses the shared visible focus token.
- Focus order follows breadcrumb/recovery context, branch choices, Product cards,
  secondary recovery actions and Footer.
- No visual reordering may diverge from DOM order.
- Focus never enters omitted, inactive or empty branches.

### Loading

- Preserve the page title and known hierarchy context.
- Skeletons approximate visible Product or card structure but are not links and
  have no taxonomy labels.
- Loading is not represented as an empty result.

### Empty and newly unavailable branch

- Show a concise explanation using human language.
- Primary recovery action: `Ver todas las categorías`.
- Parent recovery is secondary and appears only when the parent remains eligible.
- Do not render disabled Category/Subcategory cards or blank grids.

### Invalid and legacy destination

- Use the same unavailable visual pattern as a newly empty branch.
- Legacy Category redirects arrive at general Category discovery without presenting
  a misleading success message or inferred replacement.
- Retired Product destinations retain the standard unavailable-Product UI.

### Error

- Explain that content could not be loaded without exposing technical details.
- Provide `Intentar de nuevo` when retry is possible and a valid recovery link.
- Preserve known hierarchy context and user orientation.

## Accessibility Considerations

- Follow WCAG 2.2 AA and the existing Platform accessibility contract.
- Use semantic `nav` with an accessible label for breadcrumbs.
- Mark the current breadcrumb item with `aria-current="page"` and plain text when
  it is not a useful destination.
- Use ordered-list semantics for breadcrumb structure; visual separators remain
  hidden from assistive technology.
- Maintain exactly one `h1`; use sequential `h2` headings for choices and results.
- Link names include the official destination name and remain distinguishable out
  of context.
- Active branch is communicated by heading, breadcrumb and text, not color alone.
- All text and focus pairs consume the verified semantic contrast tokens.
- Long Spanish names support zoom and text reflow without clipping at 200%.
- Omitted branches do not remain hidden in the accessibility tree.
- Product Type is announced as classification context and is not styled as a link.

## UX Rationale

The hierarchy is disclosed progressively because visitors first choose broad
intent, then optionally narrow it, and finally compare Products. Showing all three
levels simultaneously would increase cognitive load and incorrectly imply that
Product Type is a public navigation destination.

Cards support scanability for the seven broad Categories, while simpler text-first
Subcategory destinations preserve Product results as the strongest repeatable
visual content. Breadcrumbs provide orientation and recovery without introducing a
second navigation system. The same structure scales from one column to wider grids
without changing taxonomy order, semantics or business behavior.

## UI Validation Checklist

- [x] Category, Subcategory and Product levels have distinct visual priority.
- [x] Product Type remains non-interactive classification context.
- [x] General, Category, Subcategory and Product Detail compositions are defined.
- [x] Mobile, tablet and desktop layouts preserve the same semantic order.
- [x] Empty, unavailable, invalid, legacy, loading and error states are defined.
- [x] Existing components are reused without creating an unapproved shared pattern.
- [x] Official Spanish names, source order and uncapped eligible collections are preserved.
- [x] Light-only, discovery-only and reduced-motion contracts are preserved.
- [x] Keyboard order, focus, headings, breadcrumbs, reflow and touch targets are defined.
- [x] No eligibility, ordering, migration, classification or routing rule is changed.
