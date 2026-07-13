# Product Admin V1 Requirements

Status: Approved

Owner: Product Requirements Architect

Date: 2026-07-13

## Domain Language

- **Product Admin:** isolated capability for reviewing and updating existing
  Products outside the visitor experience.
- **Authorized Catalog Maintainer:** person currently authorized to use Product
  Admin; V1 does not identify that person by name.
- **Access Credential:** the single approved six-digit shared code used to obtain
  temporary administrative authorization.
- **Administrative Authorization:** temporary permission to use Product Admin.
- **Editable Product Field:** Product-owned scalar information explicitly allowed
  to change in V1.
- **Read-only Product Context:** information required to understand or validate a
  Product but not editable under this capability.
- **Persisted Baseline:** Product state against which an edit begins.
- **Concurrent Conflict:** outcome where the Product changed after the Persisted
  Baseline was obtained and before the requested change was accepted.
- **Product Change:** one atomic accepted update to one existing Product.

## Actors and User Stories

### US-ADM-001

As an Authorized Catalog Maintainer, I want temporary protected access, so that
Product management is unavailable to visitors and unauthorized people.

### US-ADM-002

As an Authorized Catalog Maintainer, I want to find existing Products by identity
and state, so that I can select the correct Product efficiently.

### US-ADM-003

As an Authorized Catalog Maintainer, I want to update approved Product content and
states, so that the public catalog reflects current business decisions.

### US-ADM-004

As a Business Representative, I want Product invariants and concurrent changes
protected, so that administration cannot silently corrupt catalog behavior.

## Functional Requirements

### FR-ADM-001 — Restricted administration

Product Admin shall be available only during valid Administrative Authorization
and shall remain absent from public navigation, public Search and public indexing.

### FR-ADM-002 — Approved access credential

V1 shall use exactly one six-digit shared Access Credential. The Business
Representative authorizes its activation or rotation; the Deployment Operator
generates and rotates it under Project Architecture policy. Rotation shall end all
previous Administrative Authorization.

### FR-ADM-003 — Temporary authorization

Administrative Authorization shall end after 30 minutes without activity, after
eight total hours, on explicit exit, on credential rotation or when its validity
cannot be confirmed. Expired authorization shall never preserve an unconfirmed
Product Change.

### FR-ADM-004 — Repeated access attempts

Repeated unsuccessful access attempts shall produce a temporary denial without
disclosing whether the credential, configuration or authorization state caused
the failure. Successful access shall not expose the credential after validation.

### FR-ADM-005 — Existing Product collection

An Authorized Catalog Maintainer shall be able to review all existing Products,
including Active, inactive, Published, unpublished, Commercially Available,
commercially unavailable, Featured and non-Featured Products.

### FR-ADM-006 — Administrative Product search

Product Admin search shall match Product name and slug only, ignoring letter case
and surrounding whitespace. It shall not search SKU, reference, barcode, Variant,
Image, tag or operational data.

### FR-ADM-007 — Administrative Product filters

The collection shall support combinable filters for Publication, Commercial
Availability, Featured designation, Product Active state, Category and Product
Type. A valid filter combination with no matches shall return an empty collection.

### FR-ADM-008 — Deterministic collection

The Product collection shall use explicit finite pages and deterministic Product
name then stable-identifier order. Search, filters and page context shall be
preserved when returning from a Product that was reviewed or edited when that
context remains valid.

### FR-ADM-009 — Product administration context

Before editing, the maintainer shall receive Product identity, the complete
editable-field baseline, current independent lifecycle/commercial/Featured
states, authoritative Product Type with inherited Subcategory and Category,
whether the Product owns a governed Variant, and last-change context. Variant,
Image and unrelated internal details remain excluded.

### FR-ADM-010 — Closed editable-field set

V1 shall allow changes only to:

- name and slug;
- short description and complete description;
- brand, collection and gender applicability;
- Product-level price and currency;
- Product Active state, Editorial Approval, Publication, Commercial Availability
  and Featured designation;
- Featured order;
- authoritative Product Type assignment;
- SEO title and SEO description.

No other Product or related-entity field is editable by implication.

### FR-ADM-011 — Field validity

Accepted Product Changes shall satisfy these field rules:

- name is non-empty and no longer than 200 characters;
- slug is unique, no longer than 160 characters, and contains lowercase letters,
  digits and single hyphens between non-empty segments;
- optional textual fields are absent or non-empty when present;
- short description is at most 500 characters and complete description at most
  5,000;
- brand and collection are each at most 160 characters;
- gender applicability is absent or one of `mujer`, `hombre`, `unisex`,
  `no_aplica`;
- SEO title is at most 200 characters and SEO description at most 500;
- price is positive, has no more than two decimal places and does not exceed
  99,999,999.99;
- currency is exactly three uppercase letters;
- Product-level price and currency remain required persisted values; omitting
  either from a partial Product Change preserves its current value, while
  explicitly clearing either is invalid;
- Featured order is absent or a positive integer;
- Product Type is absent only when Publication rules permit it.

### FR-ADM-012 — Atomic Product Change

One save shall change exactly one existing Product atomically. If any submitted
field or resulting Product state is invalid, no submitted field shall change.
Success shall reflect the accepted persisted Product state, not an assumed result.

### FR-ADM-013 — Concurrent-change protection

Every Product Change shall be evaluated against its Persisted Baseline. When the
Product has changed since that baseline, the newer Product shall remain unchanged
and the requested edit shall result in Concurrent Conflict. V1 shall not merge
concurrent changes automatically.

### FR-ADM-014 — Publication invariants

A Product shall not become or remain Published through an accepted Product Change
unless it has Editorial Approval, one approved Product Type and at least one
governed Product Variant.

### FR-ADM-015 — Independent Product dimensions

Product Active state, Editorial Approval, Publication, Commercial Availability
and Featured designation remain independent dimensions except for explicitly
approved prerequisites. Changing one shall not silently change another.

### FR-ADM-016 — Featured rules

Disabling Featured designation shall remove Featured order as part of the same
Product Change. A non-Featured Product shall not retain Featured order. A Featured
Product may have no explicit order and then follows the existing unranked
Featured behavior.

### FR-ADM-017 — Commercial information protection

Disabling Commercial Availability shall preserve stored Product price and
currency for future administration while existing public experiences continue to
return no current price or currency. It shall not change Publication, Featured or
Product Active state.

### FR-ADM-018 — Taxonomy ownership

Product Type remains the only editable classification assignment. Category and
Subcategory are inherited context and shall not be assigned independently. A
Published Product requires an approved Product Type in the governed taxonomy.

### FR-ADM-019 — Read-only and excluded information

Product ID, last-change context and Variant-readiness context are read-only.
Product creation, duplication, deletion, archival, bulk editing, Variants,
Variant Attributes, SKU, reference, barcode, Product Images, image operations,
tags, taxonomy structure, inventory, cost, suppliers, warehouses, logistics,
orders and payments are excluded.

### FR-ADM-020 — Explicit exit and unavailable outcomes

An Authorized Catalog Maintainer shall be able to end Administrative Authorization
explicitly. Missing Products, expired authorization, temporary access denial,
invalid changes, Concurrent Conflict and administration unavailability shall
produce distinct recoverable business outcomes without exposing secrets or
technical internals.

### FR-ADM-021 — Safe auditability

Access success/failure, temporary denial, authorization end/expiry, invalid or
conflicting Product Changes and accepted Product Changes shall be auditable by
outcome, time and affected Product when applicable. Audit information shall not
contain the Access Credential, authorization secret or Product field values.

## Business Rules

### BR-ADM-001 — One credential, no user identity

The shared Access Credential authorizes one maintainer class and does not establish
a named user, individual attribution, role or profile.

### BR-ADM-002 — Authorization is mandatory

Absence, expiry, revocation or unverifiable Administrative Authorization denies
all Product Admin reading and changing behavior.

### BR-ADM-003 — Existing Products only

Product Admin V1 can change only an existing Product. An empty Product collection
does not authorize creation.

### BR-ADM-004 — Closed field authority

Only fields listed by FR-ADM-010 may change. Unknown, read-only, related-entity or
excluded information invalidates the requested Product Change.

### BR-ADM-005 — No partial invalid change

An invalid field, invariant failure or Concurrent Conflict preserves the entire
current persisted Product.

### BR-ADM-006 — State independence

No Product state is inferred from a different state except the explicit
Publication and Featured rules in this specification.

### BR-ADM-007 — Historical commercial values

Commercial unavailability protects historical price and currency from public
display but does not erase them from authorized administration.

### BR-ADM-008 — Product Type is the taxonomy leaf

Product Type remains the sole Product classification assignment; Category and
Subcategory are inherited.

### BR-ADM-009 — Images remain excluded

Product Image upload, ownership, association, order, Primary designation and
alternative text are not part of Product Admin V1. Existing image-storage
capability does not authorize Product Image administration.

### BR-ADM-010 — Public isolation

Product Admin does not create public catalog content, navigation or Search
destinations of its own.

### BR-ADM-011 — No transactional expansion

Product Admin introduces no inventory, order, checkout, payment or purchase
completion behavior.

## Non-functional Requirements

- **Security:** the shared credential, authorization secrets and internal write
  credentials shall never appear in public content, URLs, browser storage,
  analytics or visitor-visible configuration. Production release requires the
  managed-access boundary approved by Project Architecture.
- **Privacy:** V1 stores no maintainer profile or personal identity and audit data
  excludes Product values and authentication secrets.
- **Reliability:** the same valid baseline and requested Product Change shall
  produce the same business outcome; invalid changes never apply partially.
- **Performance:** Product list, filtering, Product review and Product Change
  confirmation shall remain responsive for representative catalog size and
  concurrent administrative/security activity, with measured evidence before
  release.
- **Accessibility:** access, collection, editing, validation, success, conflict,
  expiry and recovery outcomes shall be understandable and operable with keyboard
  and assistive technology.
- **Responsive behavior:** the complete capability shall remain usable across the
  project's supported narrow viewports and at 200% zoom without loss of fields,
  meaning or required actions.
- **Presentation:** the deterministic light-only project contract remains active.
- **Maintainability:** field expansion, Product Images, additional administrators
  or stronger identity behavior require separately reviewed requirements.
- **Auditability:** approved security and change outcomes remain available for at
  least the retention period established by Project Architecture.

## Acceptance Criteria

```gherkin
Scenario: AC-ADM-001 Authorized maintainer receives temporary access
  Given the approved Access Credential is active
  And the managed administration boundary is available
  When the correct six-digit credential is validated
  Then temporary Administrative Authorization is granted
  And the credential is not reused as ongoing authorization
```

```gherkin
Scenario: AC-ADM-002 Repeated invalid access is temporarily denied
  Given repeated unsuccessful access attempts exceed the approved limit
  When another access attempt occurs during the denial period
  Then Product Admin remains unavailable
  And the outcome does not reveal credential or configuration validity
```

```gherkin
Scenario: AC-ADM-003 Authorization expires
  Given an Authorized Catalog Maintainer has unsaved Product changes
  When Administrative Authorization expires
  Then no Product Change is confirmed
  And new authorization is required before another save attempt
```

```gherkin
Scenario: AC-ADM-004 Existing Products can be found
  Given Products exist in different public and commercial states
  When the maintainer searches by name or slug and applies approved filters
  Then only matching existing Products are returned in deterministic order
  And no excluded internal field is searched
```

```gherkin
Scenario: AC-ADM-005 No Product matches
  Given a valid search and filter combination matches no Product
  When the Product collection is evaluated
  Then the collection is empty
  And no Product creation behavior is introduced
```

```gherkin
Scenario: AC-ADM-006 Approved scalar Product change
  Given an existing Product and its current Persisted Baseline
  When the maintainer submits valid changes only to approved editable fields
  Then exactly that Product is changed atomically
  And the confirmed outcome reflects its new persisted state
```

```gherkin
Scenario: AC-ADM-007 Excluded field is rejected
  Given an existing Product
  When a requested change includes a Variant, Image, tag or other excluded field
  Then the Product Change is rejected
  And no submitted field is changed
```

```gherkin
Scenario: AC-ADM-008 Published Product prerequisites
  Given a Product lacks Editorial Approval, Product Type or a governed Variant
  When a requested change would leave it Published
  Then the Product Change is rejected
  And the existing Product remains unchanged
```

```gherkin
Scenario: AC-ADM-009 Featured designation is disabled
  Given a Featured Product has a Featured order
  When Featured designation is disabled
  Then Featured order is removed in the same Product Change
  And no other Product state is silently changed
```

```gherkin
Scenario: AC-ADM-010 Commercial Availability is disabled
  Given a Product has stored price and currency
  When Commercial Availability is disabled
  Then the stored price and currency remain available to authorized administration
  And public price and currency remain unavailable
  And Publication, Featured and Product Active state are unchanged
```

```gherkin
Scenario: AC-ADM-011 Product Type changes classification
  Given an existing Product is assigned an approved Product Type
  When the assignment is accepted
  Then Category and Subcategory are inherited from that Product Type
  And no independent Category or Subcategory assignment is created
```

```gherkin
Scenario: AC-ADM-012 Concurrent Product change
  Given a Product changed after the maintainer obtained its Persisted Baseline
  When the maintainer attempts to save the older edit
  Then a Concurrent Conflict is returned
  And the newer Product remains unchanged
  And no automatic merge occurs
```

```gherkin
Scenario: AC-ADM-013 Images remain outside V1
  Given an Authorized Catalog Maintainer is editing a Product
  When Product Admin capabilities are evaluated
  Then no Product Image upload, association, ordering, Primary designation or alternative-text change is available
```

```gherkin
Scenario: AC-ADM-014 Explicit exit
  Given Administrative Authorization is active
  When the maintainer explicitly exits
  Then the authorization ends
  And further Product reading or changing requires new authorization
```

## Edge Cases

- No Products exist: valid empty collection; creation remains unavailable.
- Search contains only whitespace: invalid search outcome without changing list
  context or Product data.
- Requested page exceeds the available collection: resolve to the nearest valid
  page without fabricating Products.
- Product disappears between list and edit: missing Product outcome.
- Product changes during editing: Concurrent Conflict; no overwrite or merge.
- Credential rotates during active administration: authorization ends.
- Authorization expires during a save attempt: no success may be claimed unless
  the Product Change was confirmed before expiry.
- Product lacks a Variant: it may be reviewed, but cannot be left Published.
- Product Type is inactive or invalid: it cannot satisfy Publication eligibility.
- Commercial Availability becomes false: stored price/currency remain intact and
  public values remain protected.
- Featured becomes false while order exists: order is removed atomically.
- Optional text is cleared: absence is valid where the field is optional; empty
  text is not stored as meaningful content.
- Product has no Images or tags: Product remains valid; those collections remain
  outside editing.
- Administration dependency or security boundary is unavailable: access fails
  closed without exposing internal cause.

## Dependencies

- Approved Product Admin V1 Architecture and Security Review.
- Product Catalog public and administrative Product contracts.
- Category Taxonomy V1.
- Product Content and Variants V1.
- Featured Product Curation.
- Commercial Availability and public price protection.
- Design System, Accessibility and deterministic light-only Platform contracts.

## Open Questions

None. Any request to add Images, Variants, tags, Product creation/deletion,
multiple administrators or unrestricted Internet authentication creates a new
reviewed change rather than an implicit V1 extension.
