# Catalog Media Admin V1 — Requirements

Status: Approved

Owner: Product Requirements Architect

Date: 2026-07-13

## Domain Language

- **Media Asset:** stored raster file plus its delivery identity and validated
  technical metadata.
- **Product Image:** ordered, meaningfully described media record owned by one
  Product.
- **Category Image:** optional discovery media owned by one Category.
- **Primary Image:** at most one Product Image preferred for public discovery.
- **Replacement:** changing the Media Asset of an existing media record while
  preserving its approved ownership and relationships.
- **Removal:** deleting the entity-to-media association under the approved
  reference and storage-lifecycle rules.
- **Media Change:** one authorized add, metadata update, reorder, Primary change,
  replacement or removal request.

## Actors and User Stories

- As an Authorized Maintainer, I want to manage Product gallery media so that
  visitors see accurate and ordered Product imagery.
- As an Authorized Maintainer, I want to replace Category imagery so that public
  taxonomy discovery remains current.
- As a Visitor, I want meaningful alternative descriptions and stable media so
  that I can understand Products and Categories across supported experiences.

## Functional Requirements

### FR-CMA-001 — Authorized media administration

Only a valid Product Admin authorization within the approved managed perimeter
may read administrative media details or request a Media Change.

### FR-CMA-002 — Existing-entity boundary

Media administration shall operate only on an existing Product or existing
Category and shall not create or delete either catalog entity.

### FR-CMA-003 — Product Image collection

An authorized maintainer shall be able to review the complete ordered Product
Image collection, including stable identity, alternative text, position, Primary
designation and whether an Image is referenced by a Variant. Product business
rules impose no maximum Image count; the released zero-or-more contract remains
authoritative.

### FR-CMA-004 — Product Image upload and association

An authorized maintainer shall be able to upload one approved Image and associate
it with the selected Product using required alternative text and a deterministic
gallery position.

### FR-CMA-005 — Product Image metadata

An authorized maintainer shall be able to update alternative text, position and
Primary designation for a Product Image owned by the selected Product.

### FR-CMA-006 — Product Image replacement

An authorized maintainer shall be able to replace the Media Asset of an existing
Product Image while preserving its Product ownership, stable Image identity,
position, Primary designation and valid Variant references.

### FR-CMA-007 — Product Image removal

An authorized maintainer shall be able to remove an unreferenced Product Image.
Removal of an Image referenced by a Variant shall be rejected in V1 without
changing the Product or the reference.

### FR-CMA-008 — Product Image ordering and Primary outcome

Product Image positions shall remain unique and deterministic within the Product.
At most one Image may be Primary. Removing or demoting a Primary Image shall not
silently promote another Image.

### FR-CMA-009 — Category Image administration

An authorized maintainer shall be able to review, upload, replace, meaningfully
describe or remove the single Image of an existing Category. A Category without
an Image remains valid.

### FR-CMA-010 — Approved media

New Media Assets shall accept only JPEG, PNG, WebP or AVIF raster content whose
file signature agrees with its declared type and whose size is within the
approved deployment limit. SVG, video, animation and other files are rejected.

### FR-CMA-011 — Alternative text

Every newly associated or replaced Product Image and Category Image shall have
trimmed alternative text of 1–240 characters that describes the media's catalog
meaning. Filename alone, generic filler and unrelated text are not approved
alternative text. Product and Category discovery media are meaningful, not
decorative, under this capability.

### FR-CMA-012 — Atomic catalog outcome

Invalid media, alternative text, ownership, position, Primary, reference,
authorization or concurrency outcomes shall not partially change the current
Product or Category media state.

### FR-CMA-013 — Storage failure recovery

A failed upload, association, replacement or storage operation shall preserve the
last confirmed catalog state and expose a recoverable outcome without claiming
success.

### FR-CMA-014 — Concurrent media changes

A Media Change based on a stale Product, Category or media baseline shall not
overwrite a newer confirmed change without explicit reload and review.

### FR-CMA-015 — Confirmed public outcome

Public consumers shall use only the confirmed persisted Product or Category
media outcome. An uploaded but unassociated or failed Media Asset shall not
become public catalog media.

### FR-CMA-016 — Audit and secret protection

Media Changes shall produce safe audit evidence of actor session, entity, action,
media identity and outcome without recording credentials, file bytes, sensitive
headers or unrestricted storage URLs. The browser shall never receive storage or
internal operator credentials.

## Business Rules

- BR-CMA-001: A Product Image belongs to exactly one Product.
- BR-CMA-002: A Category owns at most one Category Image outcome.
- BR-CMA-003: A Product supports zero or more Product Images and remains valid
  without an Image or Primary Image.
- BR-CMA-004: Product Image position is unique within its Product.
- BR-CMA-005: At most one Product Image per Product is Primary.
- BR-CMA-006: A Variant may reference only an Image owned by the same Product.
- BR-CMA-007: Replacement preserves the media record and its valid relationships;
  removal does not.
- BR-CMA-008: V1 rejects removal of a Variant-referenced Product Image.
- BR-CMA-009: A Category without an Image remains a valid Category.
- BR-CMA-010: Alternative text is required for every new or replaced meaningful
  media outcome.
- BR-CMA-011: One invalid part rejects the complete catalog Media Change.
- BR-CMA-012: Storage completion alone does not authorize public association.
- BR-CMA-013: Media administration does not infer Product publication,
  Commercial Availability, Featured, taxonomy or Variant state.
- BR-CMA-014: Product business rules impose no maximum Product Image count.
  Request/resource limits and performance protections do not truncate or reject a
  valid existing gallery because of its count.
- BR-CMA-015: Confirmed removal immediately removes the Image from the catalog
  outcome; storage retention is an operational safeguard, not user-visible undo.
- BR-CMA-016: Existing Category media without alternative text remains valid and
  publicly compatible. Replacement or metadata update requires approved
  alternative text; removal does not fabricate text.

## Acceptance Criteria

### AC-CMA-001 — Add Product Image

Given an authorized maintainer and an existing Product, when one valid raster
Image, valid alternative text and valid position are confirmed, then one Product
Image is persisted and appears in deterministic gallery order.

### AC-CMA-002 — Reject invalid upload

Given a disallowed, oversized or signature-mismatched file, when upload is
attempted, then no Product or Category media state changes and no success is
reported.

### AC-CMA-003 — Primary uniqueness

Given a Product with Images, when one Image is designated Primary, then no other
Image for that Product remains Primary and no unrelated Product changes.

### AC-CMA-004 — Preserve Variant reference on replacement

Given a Variant references a Product Image, when that Image's Media Asset is
validly replaced, then the same Product Image identity remains referenced and its
position, Primary state and Product ownership are preserved.

### AC-CMA-005 — Reject referenced removal

Given a Variant references a Product Image, when removal is requested, then the
request is rejected and the Image, Variant reference and public Product outcome
remain unchanged.

### AC-CMA-006 — Category replacement

Given an existing Category with an Image, when a valid replacement and valid
alternative text are confirmed, then the Category exposes only the new confirmed
media outcome and preserves its taxonomy identity and state.

### AC-CMA-007 — Stale change

Given a newer confirmed media change exists, when a request uses the older
baseline, then the request is rejected as a conflict without overwriting the
newer outcome.

### AC-CMA-008 — Authorization boundary

Given missing, invalid or expired administrative authorization or missing
managed-edge proof in production, when media is read or changed, then the request
fails before file association or catalog mutation.

### AC-CMA-009 — Public regression

Given a confirmed media change, when Homepage, Catalog, Search, Category and
Product Detail are evaluated, then they consume the approved Product Primary/
ordered fallback or Category Image outcome without changing discovery eligibility.

### AC-CMA-010 — Remove Category Image

Given an existing Category with an Image, when authorized removal is confirmed,
then the Category has no Image and preserves its identity, taxonomy version,
order, Active, Visible and discovery eligibility values.

### AC-CMA-011 — Remove or demote Primary Image

Given a Product whose current Primary Image is unreferenced, when that Image is
removed or demoted, then no other Image becomes Primary unless the maintainer
explicitly designates it in the same valid Media Change.

### AC-CMA-012 — Alternative-text boundary

Given a new or replacement Image, when alternative text is empty, whitespace,
longer than 240 characters, merely the filename, generic filler or unrelated to
the catalog meaning, then association is rejected and the current media outcome
is preserved.

### AC-CMA-013 — Existing gallery count

Given a Product has any valid number of existing Images, when its administrative
gallery is reviewed, then the complete ordered collection remains manageable and
no Image is removed, hidden or invalidated because of collection count.

## Non-functional Requirements

- **Security:** Media administration remains within the approved managed-edge and
  temporary server-session boundary. Credentials, internal operator authority,
  raw file bytes and sensitive storage details never enter public responses,
  browser storage, URLs, analytics or unsafe logs.
- **Accessibility:** Every meaningful confirmed Image has associated alternative
  text. Upload, metadata, order, Primary, replacement, removal, validation,
  progress, conflict and recovery outcomes remain keyboard and assistive-
  technology operable and understandable.
- **Reliability:** The same authorized baseline and Media Change produce a
  deterministic catalog outcome. Invalid, stale or failed changes never partially
  mutate Product or Category state.
- **Compatibility:** Existing public Product, Variant, taxonomy, Homepage,
  Catalog, Search, Category and Product Detail contracts remain compatible.
- **Performance:** Complete representative galleries, Category media and upload
  confirmation remain responsive without imposing a new Product Image count
  business rule; measured limits and evidence are required before Release.
- **Privacy:** Uploaded public media shall not retain unnecessary location or
  personal device metadata, and safe audit shall not store image content or
  alternative-text values.

## Edge Cases

- Product has zero Images or Images but no Primary Image.
- Product has one Primary Image and it is removed or demoted.
- Product has multiple Images and a complete reorder arrives concurrently with a
  metadata or Primary change.
- Product Image is referenced by one or multiple Variants.
- Product Image identity belongs to another Product.
- Duplicate Product Image position or two proposed Primary Images.
- Category has no Image, legacy Image without alternative text, or unavailable
  Image URL.
- Alternative text is whitespace, filename-only, generic filler, unrelated,
  Unicode, exactly 240 characters or longer than 240 characters.
- The same valid file is intentionally uploaded for different entities; ownership
  remains independent and no cross-entity media record is inferred.
- Upload succeeds but association fails, expires or conflicts.
- Storage becomes unavailable before upload, after upload or during cleanup.
- A stale Product, Product Image or Category baseline attempts replacement or
  removal.
- Confirmed media changes while a visitor holds a cached prior public response.
- Existing Product gallery has a large valid count.

## Dependencies

- Approved Product Admin authorization, session, managed-edge, concurrency and
  audit contracts.
- Released Product Image ownership, order, Primary and Variant-reference rules.
- Released Category taxonomy and optional Category media outcome.
- Approved `architecture-review.md` upload, storage, lifecycle and rollback
  boundaries.
- UX Solution, Design System, Backend contract, Accessibility, QA and Deployment
  evidence before Release.

## Resolved Product Decisions

- Product Image count remains uncapped by Product business rules.
- Variant-referenced Product Image removal is rejected; stable replacement is
  allowed.
- Removing/demoting Primary never causes implicit promotion.
- Category Image removal is included and Category remains valid without media.
- Alternative text is required for every new/replaced meaningful Image and is
  1–240 trimmed characters subject to contextual quality review.
- Existing legacy Category media without alternative text remains valid until
  replacement or metadata update.
- Confirmed removal is immediate for catalog behavior; storage retention is an
  operational safeguard only.
