# Product Admin V1

Status: Approved for Design and Implementation

Owner: Product Requirements Architect

Date: 2026-07-13

## Business Problem

The catalog has governed Product content and lifecycle rules but no approved
visitor-independent experience for an authorized maintainer to review and update
existing Products. Direct technical operations increase the risk of inconsistent
fields, invalid publication, accidental exposure of internal data and loss of
concurrent changes.

## Business Goal

Allow one authorized catalog-maintainer role to find and update existing Product
information safely while preserving Product, taxonomy, Variant, Featured,
Commercial Availability, public discovery and non-transactional boundaries.

## Actors

- **Authorized Catalog Maintainer:** reviews and updates existing Products.
- **Business Representative:** authorizes catalog changes and activation or
  rotation of the shared access credential.
- **Deployment Operator:** generates and rotates the approved credential under
  the Project Architecture policy.

## Included Scope

- One isolated Product administration capability.
- Access through the single approved six-digit shared credential and temporary
  administrative authorization.
- Listing all existing Products, including Products not publicly discoverable.
- Search by Product name or slug.
- Combinable filters for Publication, Commercial Availability, Featured
  designation, Product Active state, Category and Product Type.
- Deterministic pagination and restoration of list context.
- Reading and editing the exact approved Product-owned scalar fields.
- Validation of Product rules before a change is accepted.
- Protection against overwriting a concurrently changed Product.
- Explicit exit, authorization expiry, generic access failure and temporary
  attempt-limiting outcomes.
- Safe auditability of access and Product-change outcomes.

## Excluded Scope

- Registration, named users, multiple administrators, roles, permissions,
  profiles, email, password recovery, social login or public accounts.
- Product creation, duplication, deletion, archival or bulk editing.
- Product Variants, Variant Attributes, SKU, reference or barcode editing.
- Product Images, image upload/association, Primary Image, ordering or alternative
  text editing.
- Tags or taxonomy Category/Subcategory/Product Type structure management.
- Inventory, cost, suppliers, warehouses, logistics, orders, checkout or payment.
- Public navigation, public indexing or visitor-facing administration discovery.
- Using the internal Product write credential as a visitor-visible or browser
  credential.

## Success Measures

- An authorized maintainer can find and update an existing Product without direct
  technical data operations.
- Only the approved fields can change.
- Invalid publication, taxonomy, Variant, Featured and commercial outcomes are
  rejected without partial changes.
- A concurrent change is never overwritten silently.
- Access secrets and unrelated internal Product data are never disclosed.
- Public catalog behavior remains unchanged except for approved persisted Product
  changes.

## Dependencies

- Product Catalog and Product Detail contracts.
- Product Content and Variants V1.
- Category Taxonomy V1.
- Featured Product Curation and Commercial Availability rules.
- Product Admin V1 Architecture and Security approval.
- Existing external deployment and operational-secret ownership.

## Risks

- A shared credential cannot attribute activity to a named person.
- Incorrect lifecycle edits could remove Products from public discovery.
- Broad field exposure could disclose operational or Variant data.
- Concurrent editing could overwrite newer changes.
- Product Image editing without its full ownership contract could corrupt media
  order or meaning.
- A six-digit credential is not sufficient for unrestricted Internet exposure;
  release remains subject to the approved managed-access boundary.

## Product Decisions

- The shared six-digit credential is accepted for V1 under the Architecture
  security and deployment boundary. This does not create user identity.
- Product Images remain excluded. A future administration capability for Images
  requires its own governed proposal and requirements.
- The editable-field set is closed and defined in `requirements.md`. Expansion
  requires Product Requirements approval.
