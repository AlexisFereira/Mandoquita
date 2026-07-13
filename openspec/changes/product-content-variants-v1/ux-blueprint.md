# Product Content and Variants V1 — UX Solution

Status: Approved and Released

Owner: UX Solution Architect

Date: 2026-07-12

Source of truth:

- `proposal.md`
- `requirements.md`
- `product-decisions.md`
- `architecture-review.md`
- Category Taxonomy V1 UX and Platform accessibility contracts

## Experience Goal

Help a visitor understand a Product, inspect its available imagery, and identify
meaningful Product Variant differences without introducing purchasing, inventory,
reservation, or Variant-specific price behavior.

The experience separates four questions:

1. What Product am I viewing?
2. What does it look like?
3. Does it have meaningful visitor-selectable options?
4. Which option am I inspecting?

## Information Architecture

Product Detail remains the primary experience and preserves this hierarchy:

1. Product identity and taxonomy context.
2. Product gallery.
3. Product name and short description.
4. Current Product-level commercial information when publicly eligible.
5. Meaningful Variant choices, when two or more distinguishable Active Variants
   exist.
6. Selected Variant context.
7. Complete description and optional merchandising metadata.
8. Related Product discovery.

Variant Attributes explain a Product option. They do not become Category,
Subcategory, Product Type, tags, public filters, or independent destinations.

## Product Detail Entry Journey

1. The visitor arrives from Homepage, Catalog, Search, Category discovery,
   Featured Products, Related Products, a shared URL, or browser history.
2. Product identity, taxonomy context, gallery, and short description establish
   what the Product is before any option choice is requested.
3. The visitor browses Product Images in approved order.
4. If meaningful Variant choices exist, the visitor reviews the approved
   attribute names and values.
5. The visitor may select a Variant to inspect its attributes and associated
   Image.
6. The visitor may switch between Variants or continue browsing the complete
   Product gallery.
7. The visitor continues to taxonomy or related-Product discovery, contacts the
   business through an already approved path, or leaves the page.

No step requires a Variant selection because V1 provides discovery rather than a
transactional configuration flow.

## Gallery Journey

### Initial image

- When a Primary Image exists, it is the initial gallery image.
- Otherwise, the first Image in approved ascending position is initial.
- If no Product Images exist, the Product remains valid and the approved missing-
  media presentation occupies the gallery region without becoming an action.

### Gallery navigation

- The visitor can move directly among all available Images.
- Current image position and the total number of Images remain understandable.
- Image order follows approved Product Image position and is never visually
  reordered by viewport.
- Gallery navigation changes only the inspected Image. It never changes Variant,
  Product price, taxonomy, publication, or Commercial Availability.

### Variant-associated Image

- Selecting a Variant with an associated Product Image moves gallery focus to
  that Image.
- The Image remains part of the Product gallery; it is not duplicated into a
  separate Variant gallery.
- Selecting a Variant without an associated Image preserves the current gallery
  position.
- After a Variant focuses its associated Image, the visitor may continue browsing
  every Product Image without clearing or changing the selected Variant.

## Variant Choice Journey

### Meaningful selectable Variants

A Variant selector is presented only when at least two Active Variants can be
distinguished through approved, non-empty visitor-facing attributes.

- Options use the official attribute vocabulary: Talla, Color, Material,
  Capacidad, and Presentación.
- Attribute values retain their approved display format.
- Each selectable outcome must be distinguishable by meaningful text, not only
  color, position, media, SKU, reference, or barcode.
- No Variant is preselected solely to create an apparent default choice.
- Before selection, Product-level content and gallery remain complete and useful.
- Selecting an option identifies the inspected Variant and exposes its approved
  attribute context.
- Switching options updates Variant context and focuses an associated Image when
  available.

### Attribute groups

When Variants differ across more than one attribute, the experience may organize
choices by official attribute name. A complete Variant becomes selected only
when the visitor's choices identify exactly one Active Variant.

Choices that cannot lead to an Active Variant must not be presented as valid
available combinations. V1 must not describe this as inventory or stock status.

### One Active Variant

When only one Active Variant exists, it is not presented as a selector:

- A Base Variant remains completely absent as a visitor choice.
- Meaningful approved attributes on a single Variant may appear as non-interactive
  Product information.
- Internal Base Variant terminology is not exposed to visitors.
- The absence of a selector does not imply that the Product lacks a governed SKU.

### Multiple indistinguishable Variants

If multiple Active Variants cannot be distinguished by approved, non-empty
attributes:

- do not present duplicate or SKU-based choices;
- keep Product-level discovery content available;
- omit the selector rather than asking the visitor to make a meaningless choice;
- record the condition for catalog-content correction;
- do not infer or fabricate attribute values.

This is a recoverable content-quality condition, not a Product, inventory, or
commercial state.

### Inactive Variants

Inactive Variants are not visitor-selectable and are not represented as disabled,
sold-out, unavailable-stock, or historical choices. Their state does not alter
Product publication or Commercial Availability.

## Selection Consequences

Variant selection may change only:

- the identified Variant being inspected;
- displayed approved Variant Attributes;
- optional approved public reference information;
- gallery focus when the Variant has an associated Product Image.

Variant selection must not change or imply:

- Product-level price or currency;
- Commercial Availability;
- inventory, stock, reservation, backorder, or delivery;
- taxonomy classification;
- Featured status;
- cart, checkout, payment, or order behavior.

SKU, barcode, and reference are not automatically visitor-facing. They may be
shown only when a separate approved public-content decision authorizes them.

## Screen Structure

### Product with multiple meaningful Variants

1. Global Header.
2. Taxonomy and Product orientation.
3. Product gallery.
4. Product identity, short description, and eligible Product-level commercial
   information.
5. Variant choice region with a clear purpose and grouped official attributes.
6. Selected Variant context.
7. Complete description and optional merchandising metadata.
8. Related Products and recovery navigation.
9. Footer.

### Product with one non-selectable Variant

Use the same structure without a Variant choice region. Approved meaningful
attributes may appear as metadata; the Base Variant name and its existence remain
internal.

### Product without Images

Use the same content and focus order. The non-interactive missing-media outcome
replaces gallery navigation, while Product identity, Variant information,
commercial information, taxonomy, and related discovery remain available.

## Merchandising Metadata

- Short description supports fast Product evaluation near Product identity.
- Complete description provides deeper context later in the reading flow.
- Brand, collection, gender applicability, and tags remain optional supporting
  information.
- Metadata must not compete visually or semantically with Product Type,
  Subcategory, or Category.
- Tags do not become interactive filters or destinations in V1.
- Missing metadata leaves no empty headings, labels, separators, or spacing gaps.
- SEO title and description are not presented as duplicate visible content.

## Loading Behavior

- Preserve Product identity and known taxonomy context while optional content is
  resolved.
- Do not render selectable placeholder Variants or Images.
- Do not interpret unresolved Variants or Images as empty collections.
- Keep stable gallery space to prevent layout movement when media loads.
- A pending associated Image must not erase the selected Variant context.

## Empty and Missing Content

### No Images

- Present the approved missing-media outcome.
- Keep Product and Variant discovery fully usable.
- Do not announce an optional-media absence as a Product error.

### No short description

- Continue directly from Product identity to the next available content.
- Do not substitute SEO description or fabricate summary copy.

### No optional metadata

- Omit each absent field and its label.
- Preserve taxonomy as the authoritative classification context.

### No meaningful Variant choices

- Omit the selector.
- Keep Product-level information and discovery paths available.

## Error and Recovery Behavior

### Image fails to load

- Preserve gallery position and orientation.
- Use the approved media-error outcome without exposing the URL or technical
  details.
- Allow navigation to other valid Images.
- If no valid Image remains, degrade to the missing-media outcome.

### Variant-associated Image fails

- Keep the Variant selected.
- Preserve its text attributes and move no ownership or meaning to another Image.
- Allow continued browsing of other Product Images.

### Variant options cannot resolve one Variant

- Preserve the visitor's understandable choices.
- Explain that the option information cannot be completed at this time without
  implying stock or commercial unavailability.
- Allow another option choice and keep Product-level content available.
- Never expose internal identifiers or select an arbitrary Variant.

### Product becomes unavailable

Use the existing standard unavailable-Product outcome. Variant or Image errors do
not create a competing Product availability state.

## Success Behavior

No interruptive success confirmation is required. Successful inspection is
communicated when:

- the selected Variant is named through meaningful attributes;
- its associated Image receives gallery focus when available;
- current gallery position remains clear;
- Product-level commercial and taxonomy information remains stable;
- the visitor can switch options, browse media, or continue Product discovery.

## Responsive Priorities

### Desktop

- Gallery and Product identity may share the first reading region.
- Variant choices remain grouped with Product information, not detached into a
  commerce-oriented side panel.
- Thumbnails or direct Image choices support comparison without hiding the main
  Image.

### Tablet

- Preserve Product identity before Variant decisions.
- Gallery and Variant choices may reflow while retaining the same semantic and
  focus order.
- Long Spanish attribute names and values wrap without truncating meaning.

### Mobile

- Use a single top-to-bottom journey: orientation, gallery, Product identity,
  Variant choices when meaningful, details, and related discovery.
- Do not require horizontal scrolling to understand Images or Variant options.
- Keep current Image and selected Variant context visible near their controls.
- Touch interaction must not depend on hover or small color swatches.

## Accessibility Requirements

- Gallery and Variant regions have clear accessible names when present.
- Current Image and selected Variant are communicated programmatically and not by
  color, border, position, or media alone.
- Image alternative text comes from approved Product Image content; decorative
  fallback media is not redundantly announced.
- Gallery controls have distinguishable names that identify their destination or
  position.
- Variant choices expose official attribute names and values.
- Grouped choices communicate their attribute group, selection state, and any
  unavailable combination without using inventory language.
- Keyboard order follows Product orientation, gallery controls, Variant choices,
  Product information, related discovery, and Footer.
- Changing Image or Variant does not move keyboard focus unexpectedly.
- Status feedback for selection or media failure is available to assistive
  technology without interrupting reading.
- Long labels support zoom and text reflow; no meaning relies on clipped text.
- Omitted Base, inactive, or indistinguishable Variants do not remain as hidden or
  disabled duplicate controls in the accessibility tree.
- Existing visible-focus, target-size, reduced-motion, and light-only Platform
  contracts remain mandatory.

## UX Constraints

- Product remains the identity and Variant remains subordinate context.
- Preserve Product Type as the only leaf taxonomy classification.
- Preserve Product-level price and Commercial Availability behavior.
- Do not expose Variant Active state as stock or commercial availability.
- Do not create Variant-specific prices, inventory, filters, destinations, or
  transactional actions.
- Do not fabricate Variant attributes, Image alternative text, metadata, tags,
  SKU, or references.
- Do not make optional Images or metadata prerequisites for understanding or
  accessing a valid Product.

## UX Validation Checklist

- [x] Gallery entry, browsing, ordering, Primary Image, Variant-associated Image,
  missing-media, and failure journeys are defined.
- [x] Multiple meaningful Variant choices are distinguishable without relying on
  SKU, color alone, media alone, or position.
- [x] A Product with one non-selectable Base Variant presents no fabricated
  selector.
- [x] Multiple indistinguishable and inactive Variant outcomes avoid misleading
  visitor choices.
- [x] Variant selection consequences exclude price, inventory, taxonomy, and
  transactional meaning.
- [x] Short description and optional metadata hierarchy is defined without
  replacing taxonomy.
- [x] Loading, empty, error, recovery, and success behavior remains useful and
  non-transactional.
- [x] Desktop, tablet, and mobile priorities preserve one semantic journey.
- [x] Keyboard, focus, screen-reader, alternative-text, reflow, target-size,
  reduced-motion, and light-only expectations are documented.
- [x] No business rule, attribute vocabulary, capability boundary, or deferred
  operational behavior is changed.
