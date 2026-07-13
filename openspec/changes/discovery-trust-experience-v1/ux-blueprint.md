# Discovery and Trust Experience V1 — UX Solution

Status: Complete — Released

Owner: UX Solution Architect

Date: 2026-07-13

Source of truth:

- `proposal.md`
- `requirements.md`
- `payment-content-decision.md`
- `architecture-review.md`
- Canonical Product Catalog, Taxonomy, Product Content and Homepage UX contracts

## Experience Goals

### Search

Allow visitors to move from intent expressed in their own words to eligible
Product discovery without requiring prior knowledge of the Category hierarchy.

### Payment Information

Answer which payment methods the business accepts while making it clear that
details are confirmed through Mandoquita's existing external contact path. The
experience informs and builds confidence; it does not simulate or initiate a
transaction.

# Search UX Solution

## Search Entry Points

### Global entry

Search is available from global Header navigation so visitors can begin from
Homepage, Category, Subcategory, Product Detail, or another public catalog page.
The entry uses a visible visitor-facing Search label and leads to the Search
query input or stable Search Results destination.

### Catalog entry

General Product and Category discovery may expose Search as a complementary path
before or near the Product collection. Search must not replace Category and
Subcategory exploration.

### Entry constraints

- Search is not presented as an account, assistant, or conversational agent.
- No autocomplete, suggestions, recent queries, trending queries, voice input,
  Variant Attribute facets, or personalized content is introduced.
- Search entry remains understandable without an Icon.
- Opening Search does not execute a query until a valid non-empty query is
  submitted.

## Primary Search Journey

1. The visitor activates an approved Search entry.
2. A clearly labelled query field receives focus only as the predictable result
   of that visitor action.
3. The visitor enters Product-related text and submits Search.
4. The system normalizes surrounding whitespace and preserves the understandable
   submitted query as result-page context.
5. The visitor reaches one stable Search Results outcome.
6. The results page identifies the query before presenting matching Products.
7. The visitor scans eligible Product results using the same identity, media,
   summary, taxonomy, and Commercial Availability rules as catalog collections.
8. The visitor may open Product Detail, refine or replace the query, move through
   result pages, recover to general Product/Category discovery, use browser back,
   or leave the site.

## Search Results Information Architecture

The Results experience follows this priority:

1. Global Header and navigation.
2. Page purpose: Product Search.
3. Search form containing the current understandable query.
4. Result context: submitted query and result count/range when available.
5. Matching Product collection.
6. Pagination when more results exist.
7. Recovery to general Products or Categories.
8. Footer.

Search results never expose internal match fields, ranking scores, SKU, barcode,
reference, inventory, supplier, cost, warehouse, or logistics information.

## Search Form Interaction

### Query submission

- The visitor submits through the labelled Search action or the form's standard
  keyboard submission behavior.
- Submission uses the field's current value, not an earlier query.
- Repeated submission of the same normalized query produces the same visitor
  outcome before approved ordering ties.
- Query text is treated as text and never rendered as executable markup.

### Query persistence

- The Results form preserves the submitted query so the visitor can understand
  and refine it.
- Pagination preserves the same query.
- Opening a Product and returning through browser navigation restores Search
  context when supported by the stable destination and browser history.
- A new valid query returns to the first result page.

### Clear query

- Clearing removes the visible query but does not automatically execute an empty
  Search.
- The visitor remains oriented to Search and can enter another query or recover
  to general discovery.

## Search Result Collection

- Results use the shared Product discovery pattern and one coherent Product
  Detail destination per item.
- Product order comes from the approved Search contract and is not visually
  reordered by viewport.
- Products without Images use the existing Product media fallback.
- Missing optional description, brand, collection, or tags leaves no empty
  metadata slots.
- A matching Product without current Commercial Availability remains
  discoverable, while price and currency remain absent under the existing
  protected public outcome.
- Search does not label absence of price as “sold out” or infer availability.

## Pagination Journey

- Pagination is used when the valid result collection exceeds one page.
- The visitor can move to the next or previous available result page and retains
  query context.
- Current page/range is understandable without relying on disabled controls or
  visual position alone.
- A page outside the valid result range recovers to the nearest approved Search
  outcome defined by the Backend contract without fabricating Products.
- V1 does not introduce infinite scroll.

## Search Empty, Invalid, and Recovery Outcomes

### Initial Search / no submitted query

Explain that the visitor can search public Products and provide the labelled
query field. Do not show a fabricated result count, empty-result error, suggested
queries, or Product recommendations presented as Search matches.

Primary action: enter and submit a Product query.

Secondary recovery: explore general Categories or Products.

### Whitespace-only query

- Do not execute Product Search.
- Keep the visitor at the Search entry/result destination.
- Explain that a Product search term is required.
- Preserve focus context and allow immediate correction.
- Provide general Product or Category discovery as secondary recovery.

### Invalid query

When the public Search contract rejects a query, including an overlong query:

- do not execute Product Search;
- preserve the understandable entered value when safe;
- explain how to correct the query without exposing validation internals;
- associate the message with the query field;
- keep general discovery available.

Punctuation and accents are not treated as invalid merely by UX inference; input
acceptance and matching follow the approved Search contract.

### No matching Products

A valid query with no eligible matches is a successful empty Search outcome.

- Identify the submitted query.
- State that no Products matched without implying a system failure.
- Offer query refinement as the primary next action.
- Offer general Category discovery and general Product discovery as recovery.
- Do not fabricate spelling corrections, related queries, or matching Products.

### Results become unavailable

If eligibility changes between requests, omit Products that are no longer
eligible. If this leaves the collection empty, use the normal no-results outcome.
Do not expose publication, taxonomy, Variant, or internal eligibility states.

### Search request failure

- Preserve the visitor's query.
- Explain that results could not be loaded without technical details.
- Offer retry when safe.
- Keep general Category/Product discovery available.
- Do not represent a request failure as zero matching Products.

## Search Loading and Success Feedback

### Loading

- Keep the Search form, submitted query, and page purpose available.
- Indicate that results are being obtained.
- Do not show stale results as if they belong to the new query.
- Loading placeholders are not Product links and do not contain fabricated names.
- Search submission and loading status are available to assistive technology.

### Success

No interruptive confirmation is needed. Success is communicated by the visible
query context, result count/range when available, and matching Product collection.

## Search Responsive Priorities

### Desktop

- Search form and query context remain before the Product collection.
- Results support efficient Product comparison within the established content
  width.
- Pagination remains adjacent to the collection it controls.

### Tablet

- Preserve the same semantic order as desktop.
- Allow Search controls and long queries to reflow without truncating their
  meaning.
- Product density follows the existing responsive Product collection contract.

### Mobile

- Use one top-to-bottom journey: page purpose, Search field/action, feedback,
  Products, pagination, recovery.
- The query action remains reachable without horizontal scrolling.
- Long safe queries wrap or remain editable without forcing page overflow.
- Search entry and submit do not depend on an Icon or hover.

## Search Accessibility Requirements

- The query field has a persistent visible label.
- Instructions and validation are programmatically associated with the field.
- Search uses native form submission expectations and does not require pointer
  interaction.
- Focus is not moved on every result update; after full navigation, the existing
  skip/main-content contract provides predictable access to result context.
- Loading, validation, errors, and result updates use appropriate non-interruptive
  status communication.
- Result count alone is not the only indication of Search success or emptiness.
- Product links retain distinguishable accessible names.
- Decorative Search Icons do not duplicate the form or button name.
- Focus order follows query, submit/clear, feedback, Products, pagination,
  recovery, and Footer.
- Existing visible-focus, 44px target, reflow, semantic heading, light-only, and
  reduced-motion contracts remain mandatory.

# Payment Information UX Solution

## Homepage Placement

Payment Information appears after primary Product and Category discovery and
immediately before the existing Contact section.

This order communicates:

1. What the business offers.
2. Which Products or Categories the visitor can explore.
3. Which payment methods may be arranged.
4. How to contact Mandoquita to confirm details.

Payment Information must not appear inside Product cards, Variant controls,
Product offers, the Header, or a checkout-like sticky region. It remains
supporting trust content rather than a primary Product action.

## Payment Information Hierarchy

The block uses the approved content in this order:

1. Heading: `Medios de pago`.
2. Supporting text: `Aceptamos Binance, pago móvil y dólares en efectivo.
   Confirma los detalles del pago directamente con Mandoquita.`
3. Methods, in exact approved order:
   - `Binance`
   - `Pago móvil`
   - `Dólares en efectivo`
4. Continuation: `Consultar por WhatsApp` through the existing approved external
   contact path.

The complete supporting sentence remains available even when the method labels
are presented separately. An Icon may support the section but cannot replace or
reinterpret any text.

## Visitor Journey

1. The visitor explores the business offering, Products, and Categories.
2. The visitor reaches `Medios de pago` as supporting decision information.
3. The visitor reads the exact accepted methods and confirmation boundary.
4. The visitor either:
   - continues to the existing Contact section;
   - activates `Consultar por WhatsApp` to confirm details externally;
   - returns to Product/Category exploration; or
   - leaves the site.

Reading Payment Information requires no interaction. Contact is optional and the
visitor may continue through the Homepage without activating it.

## Non-transactional Interpretation

- Method labels are plain information, not buttons, choices, filters, tabs, or
  form controls.
- No method has selected, default, recommended, enabled, disabled, pending, or
  completed state.
- The section displays no amount, exchange rate, conversion, fee, balance,
  financing, installment, security, refund, receipt, or payment-status claim.
- It does not associate a method with a specific Product, Variant, price,
  Commercial Availability outcome, or visitor location.
- WhatsApp continuation means “confirm details with Mandoquita”; it does not mean
  “pay,” “buy,” “reserve,” “checkout,” or “complete order.”
- No Binance logo or other payment-provider mark is introduced.
- A domain-neutral supporting Icon does not imply a specific payment integration.

## Relationship to Contact

- Payment Information provides context; Contact provides the approved external
  continuation.
- The method block and Contact section remain distinct semantic regions so
  visitors do not mistake the method list for an interactive payment form.
- Direct WhatsApp continuation may be offered in the method block using the exact
  approved label.
- The following Contact section remains available for broader Product questions
  and assistance.
- Failure to open WhatsApp does not change the listed payment information.

## Payment Content States

### Approved content available

Render the complete heading, supporting text, three methods in approved order,
and optional approved WhatsApp continuation.

### Contact continuation unavailable

- Keep the approved informational content visible.
- Do not render a broken contact action.
- Explain that direct confirmation is temporarily unavailable only when approved
  contact guidance exists.
- Do not offer an invented phone, email, payment route, or form.

### Payment content unavailable or withdrawn

Because methods are static approved content, the section is omitted as one unit
when approval is withdrawn or the approved content cannot be guaranteed. Do not
render a partial list, stale method, placeholder method, or generic payment claim.

### External contact failure

Preserve the Homepage and method information. Explain that contact could not be
opened and allow the visitor to continue Product/Category discovery. Do not imply
that payment failed.

## Payment Responsive Priorities

### Desktop

- Keep heading, explanation, methods, and continuation in one coherent trust
  region.
- Method labels may support quick scanning but remain subordinate to Product
  discovery.

### Tablet

- Preserve exact content order and association between explanation and methods.
- Allow long Spanish labels and WhatsApp continuation to wrap naturally.

### Mobile

- Use one top-to-bottom reading order: heading, explanation, methods, contact
  continuation.
- Do not use horizontally scrolling payment methods or logo strips.
- Keep the WhatsApp action distinct from the informational method labels.

## Payment Accessibility Requirements

- The section is identified by its `Medios de pago` heading.
- Methods use list semantics when presented as a collection.
- Method labels remain understandable without Icons or logos.
- A section-level supporting Icon is decorative when visible text owns meaning.
- `Consultar por WhatsApp` identifies its external contact purpose before
  activation.
- Keyboard focus reaches only the contact continuation, not static method labels.
- The content reflows without truncating `Dólares en efectivo` or the supporting
  sentence.
- Contrast, visible focus, target size, light-only behavior, and external-link
  expectations follow existing Platform contracts.

## Cross-workstream UX Constraints

- Search and Payment Information remain independent journeys; payment methods do
  not become Search fields, filters, results, or ranking signals.
- Icons support text and never introduce new Feature behavior.
- Scroll-entry Motion may enhance approved non-critical wrappers only after its
  Platform approval; Search forms, result updates, errors, Payment meaning, and
  WhatsApp continuation never wait for motion.
- Neither journey changes Product, Variant, taxonomy, publication, Featured, or
  Commercial Availability states.
- Both preserve discovery-only, responsive, accessible, and deterministic
  light-only contracts.

## UX Validation Checklist

- [x] Search entry, submit, results, refinement, pagination, Product Detail exit,
  browser return, and general-discovery recovery journeys are defined.
- [x] Initial, whitespace-only, invalid, no-results, unavailable-result, loading,
  request-error, and success outcomes are distinct and recoverable.
- [x] Query context persists without adding suggestions, personalization, facets,
  or hidden operational matching.
- [x] Search Results preserve canonical Product eligibility, media, taxonomy,
  Variant, and Commercial Availability presentation.
- [x] Desktop, tablet, mobile, keyboard, focus, status, validation, reflow, and
  target expectations are documented.
- [x] Payment Information placement follows Product/Category discovery and leads
  naturally to Contact.
- [x] Heading, copy, methods, method order, and WhatsApp label match the approved
  decision exactly.
- [x] Method labels remain static information with no selection or transaction
  state.
- [x] Missing approval, unavailable contact, and external-contact failure avoid
  invented payment or contact behavior.
- [x] Icons and motion remain subordinate to text, access, and Feature meaning.
- [x] No business rule, public Search field, payment capability, Product state,
  taxonomy behavior, or Platform contract is redefined.
