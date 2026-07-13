# Category Taxonomy V1 — UX Solution

Status: Approved

Owner: UX Solution Architect

Final review: 2026-07-12

Source of truth:

- `proposal.md`
- `requirements.md`
- `taxonomy.md`
- `migration-decision.md`
- `architecture-review.md`

## Experience Goal

Allow visitors to move predictably from broad catalog intent to relevant
Products through the approved hierarchy:

Category → Subcategory → Product.

The experience must preserve the official Spanish taxonomy language, avoid dead
ends, and remain useful when eligible branches change. It does not introduce
transactional behavior or an administration experience.

## Information Architecture

### Public hierarchy

1. General Category discovery
   - Presents every eligible Category in approved ascending business order.
   - Acts as the canonical recovery destination for discontinued legacy Category
     URLs that have no semantically equivalent successor.
2. Category exploration
   - Identifies the selected Category using its official Spanish name.
   - Presents its eligible Subcategories in approved source sequence.
   - Presents Products belonging to the complete selected Category branch.
3. Subcategory exploration
   - Identifies the selected Subcategory and its parent Category.
   - Presents Products belonging only to the selected Subcategory branch.
4. Product Detail
   - Preserves the official Product Type, Subcategory, and Category language.
   - Provides a predictable path back to its Subcategory, Category, and general
     Category discovery.

Product Type is leaf classification vocabulary. The approved requirements do
not define Product Type as an independent public discovery destination, so this
solution does not introduce a Product Type page or filter.

## Navigation Hierarchy

- Global catalog navigation may lead to general Category discovery.
- Homepage Category actions lead to the selected eligible Category.
- General Category discovery leads to an eligible Category.
- Category exploration leads to an eligible Subcategory or a Product.
- Subcategory exploration leads to a Product.
- Product Detail may lead back through its inherited Subcategory and Category.
- Every hierarchy page provides a path to general Category discovery.

Navigation labels use only the approved Spanish names. Internal identifiers,
taxonomy versions, migration states, and unavailable branches are never exposed
as visitor choices.

## Primary User Flow

1. The visitor enters through Homepage, Catalog, Search, Product Detail, or the
   general Category discovery destination.
2. The visitor reviews eligible Categories in approved order.
3. The visitor selects the Category matching their broad intent.
4. The Category context confirms where the visitor is and exposes eligible
   Subcategories plus Products in the Category branch.
5. The visitor either:
   - selects a Subcategory to narrow the branch;
   - selects a Product directly; or
   - returns to general Category discovery.
6. If a Subcategory is selected, the visitor sees only Products inherited from
   that Subcategory branch.
7. The visitor selects a Product and continues to Product Detail.
8. Product Detail preserves the hierarchy context so exploration can continue
   without restarting from the Homepage.

## Entry and Exit Points

### Entry points

- Homepage Category action.
- Catalog Category or Subcategory selection.
- Search result or Product Detail hierarchy context.
- Existing shared or bookmarked Category destination.
- Redirect from a discontinued demonstration Category destination.

### Exit points

- Product Detail.
- Another eligible Category or Subcategory.
- General Catalog or Homepage.
- Standard browser back navigation.
- Leaving the site.

## Screen Structure

### General Category Discovery

1. Global Header and primary navigation.
2. Page orientation: purpose and current location.
3. Eligible Categories in approved order.
4. Supporting path back to the broader Catalog or Homepage.
5. Footer.

The page must not show empty, inactive, invisible, or unavailable Categories as
disabled choices.

### Category Exploration

1. Global Header and primary navigation.
2. Hierarchy context: general Categories → selected Category.
3. Category name and optional approved description.
4. Eligible Subcategory choices in source sequence.
5. Products belonging to the selected Category branch.
6. Recovery paths to general Category discovery and broader Catalog.
7. Footer.

### Subcategory Exploration

1. Global Header and primary navigation.
2. Hierarchy context: general Categories → parent Category → selected
   Subcategory.
3. Subcategory name.
4. Products belonging only to the selected Subcategory branch.
5. Recovery paths to the parent Category and general Category discovery.
6. Footer.

### Product Detail Context

1. Preserve the existing Product Detail hierarchy.
2. Present the official Product Type as classification context.
3. Expose the inherited Subcategory and Category as understandable navigation
   context when their destinations remain eligible.
4. Do not present inactive or empty branches as active destinations.

## Interaction Specification

### Primary actions

- Select Category.
- Select Subcategory.
- Select Product.

### Secondary actions

- Return to parent Category.
- Return to general Category discovery.
- Return to broader Catalog or Homepage.

### Filtering behavior

- Selecting a Category restricts Products to the complete selected Category
  branch.
- Selecting a Subcategory restricts Products to the selected Subcategory branch.
- The active branch is communicated through persistent page context, not color
  alone.
- Changing branches produces one predictable result set and updates the visible
  hierarchy context together.
- Browser back restores the previous discovery context when supported by the
  existing navigation contract.

## Empty-Branch Behavior

### Empty Category

An Active Category with no publicly discoverable Products remains valid taxonomy
data but is omitted from every visitor discovery collection. It has no active
Category action, placeholder card, disabled control, or empty public destination.

### Empty Subcategory

A Subcategory with no publicly discoverable Products remains valid taxonomy data
but is omitted from its Category's visitor choices. It has no disabled option or
empty public destination.

### Branch becomes empty after navigation

If eligibility changes after a visitor follows a previously valid destination:

1. Explain that the requested selection is not currently available.
2. Do not expose internal states or imply that the taxonomy entity was deleted.
3. Offer general Category discovery as the primary recovery path.
4. Offer the parent Category only when it remains an eligible destination.
5. Never redirect silently to a semantically different branch.

### Eligible Category with no eligible Subcategory choices

The Category remains useful when publicly discoverable Products exist in its
branch. Omit the empty Subcategory choice area and keep the Category Products and
recovery navigation available.

### No eligible Categories

General Category discovery explains that Category exploration is temporarily
unavailable and provides a path to the broader Catalog or Homepage. It does not
render an empty hierarchy, fabricated Categories, or transactional actions.

## Invalid and Legacy Destinations

- Unknown Category or Subcategory identifiers use one consistent unavailable
  outcome with recovery to general Category discovery.
- `/categorias/audio`, `/categorias/computing`, and
  `/categorias/home-living` lead to general Category discovery according to the
  approved continuity decision.
- The redirected experience must not imply that a new Category is equivalent to
  the discontinued one.
- Retired demonstration Product destinations use the standard unavailable
  Product outcome and never redirect to unrelated Products.

## Loading Behavior

- Preserve hierarchy orientation while Product results are being resolved.
- Do not present an unresolved branch as empty.
- Keep navigation and recovery paths available when their eligibility is already
  known.
- Loading feedback must not change the official order or create selectable
  placeholder taxonomy entities.

## Success Behavior

No interruptive success confirmation is required for navigation. Success is
communicated when:

- the selected Category or Subcategory is clearly identified;
- every visible Product belongs to the selected branch;
- the visitor can continue to Product Detail or move back through the hierarchy;
- official Spanish names remain consistent across Homepage, Catalog, Category,
  Subcategory, and Product Detail contexts.

## Responsive Priorities

### Desktop

- Keep hierarchy context and current selection visible before Product results.
- Support fast comparison of Categories or Subcategories without weakening the
  primary Product-discovery path.
- Avoid exposing all three taxonomy levels as equally weighted navigation.

### Tablet

- Preserve the same information and focus order as desktop.
- Reduce simultaneous choices when needed while keeping parent context visible.
- Keep every target readable and operable by touch and keyboard.

### Mobile

- Use a single top-to-bottom discovery journey.
- Show current Category/Subcategory context before results.
- Do not require horizontal scrolling for hierarchy navigation or Product
  discovery.
- Keep recovery to the parent branch and general Categories easy to find.

## Accessibility Requirements

- Keyboard order follows hierarchy context, branch choices, Products, recovery
  navigation, and footer.
- Current location is communicated semantically and not through color alone.
- Category and Subcategory actions have names that identify their destinations.
- Hierarchy context is understandable to screen-reader users without relying on
  visual separators.
- Heading order communicates page, selected branch, and Product-results
  structure.
- Focus moves predictably after navigation and begins at the new page's primary
  content through the existing skip-navigation contract.
- Omitted branches are not left in the accessibility tree as disabled or hidden
  duplicate controls.
- All interaction targets follow the existing Platform accessibility contract.

## UX Constraints

- Preserve discovery-only and light-only Platform contracts.
- Do not rename taxonomy entities or introduce synonyms.
- Do not alter eligibility, ordering, migration, or classification rules.
- Do not infer a Product Type from Product text, media, or similarity.
- Do not expose inactive or empty branches to make the hierarchy appear fuller.
- Do not introduce cart, checkout, payment, authentication, personalization, or
  inventory behavior.

## UX Validation Checklist

- [x] General Category discovery is defined as the canonical broad entry and
  recovery destination.
- [x] Category → Subcategory → Product exploration is complete.
- [x] Category and Subcategory filtering preserve branch integrity.
- [x] Empty, newly empty, invalid, and fully unavailable discovery states have
  recovery paths without dead ends.
- [x] Legacy Category and retired Product continuity follows approved decisions.
- [x] Desktop, tablet, and mobile priorities are defined without visual tokens or
  implementation instructions.
- [x] Keyboard, focus, semantic hierarchy, and screen-reader expectations are
  documented.
- [x] Product Type remains classification vocabulary without invented public
  navigation.
- [x] Official Spanish language, source order, discovery-only scope, and
  light-only scope are preserved.

## Final Validation Evidence

- The approved UI design adopts the same progressive hierarchy, responsive
  priorities, omitted-branch behavior, recovery paths, and accessibility order.
- General Category, Category, Subcategory, and Product Detail implementations
  preserve official hierarchy language and Product Type as non-interactive
  context.
- Invalid and newly unavailable branches recover to general Category discovery.
- QA confirms branch filtering, omission, ordering, navigation recovery, 7/16/30
  taxonomy integrity, zero published orphans, and cross-feature regression.
- No implementation introduces transactional scope, a competing taxonomy, a
  presentation cap, or an alternative theme.
