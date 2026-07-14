# Admin Catalog Management V2

Status: Approved with Account Governance Amendment — Downstream Revision Required

Coordinator: Project Architect

Date: 2026-07-13

## Summary

Replace the shared six-digit Admin entry with named username/password access and
extend the isolated Admin from update-only Product maintenance to governed
Product and Category creation, editing, retirement and restoration. Product
discovery in Admin uses a semantic data table instead of Product Cards.

## Business Problem

The current Admin uses one shared code, cannot identify individual maintainers,
cannot create or retire Products, and limits Category work to media. Routine
catalog lifecycle changes therefore require database, seed or engineering work.
The Product Card collection is inefficient for scanning and operating a growing
administrative dataset.

## Business Goal

Provide accountable Administrator access and complete, governed lifecycle
management for existing Product and Category boundaries without exposing public
authentication, weakening publication/taxonomy invariants or adding transactional
commerce.

## Approved Scope

- One protected Superadministrator and multiple named Administrator accounts
  with temporary revocable sessions.
- Superadministrator-only account creation, password reset and account
  deactivation inside the Admin.
- Product creation with an explicit Base SKU, complete approved editing,
  reversible retirement and explicit restoration.
- Category creation within the active taxonomy, complete approved editing,
  dependency-protected retirement and explicit restoration.
- Searchable, filterable and paged semantic Product data table with row actions.
- Integration with released Product/Category media administration.
- Conflict, validation, destructive confirmation, authorization and recovery.
- Historical slug reservation and URL continuity.

## Excluded Scope

- Public signup, customer accounts or public login.
- Self-service Administrator registration, custom roles/permissions, additional
  Superadministrators, MFA or social login. Managed-edge protection remains a
  production release control.
- Email/SMS/security-question password delivery or recovery.
- Bulk mutation, import/export or spreadsheet editing.
- Order, inventory, checkout, payment or customer management.
- Taxonomy-version management.
- Variant matrix management beyond the Product creation Base Variant.
- Physical Product/Category purge.

## Resolved Product Decisions

1. V2 has exactly one protected Superadministrator plus multiple Administrators.
   Deployment bootstraps the Superadministrator; only that Superadministrator
   creates, resets or deactivates Administrator accounts from the Admin.
2. Product creation requires name, slug, positive price, currency and globally
   unique Base SKU, and creates one Base Variant plus a safe non-public Product.
3. Product deletion means reversible retirement; it retains data, relationships,
   media ownership, audit and slug history. Restore never implies publication.
4. Category creation appends an inactive, invisible Category to the active
   taxonomy. Category retirement is rejected while protected dependencies exist
   and never cascades.
5. Changed and retired slugs stay reserved; old public URLs preserve continuity.
6. Product rows remain a semantic table at every viewport through an accessible
   responsive composition; they are not converted to Cards.
7. The shared-code path and its active sessions are invalidated at V2 cutover.
8. Managed-edge protection stays mandatory for production until a separately
   approved stronger-authentication change replaces that release control.
9. There is no self-service password recovery. A Superadministrator reset
   replaces an Administrator credential, revokes active sessions and requires a
   password change on the next successful access.
10. Account deletion means deactivation with retained identity and audit history.
    The Superadministrator cannot deactivate or delete itself in the Admin.

## Dependencies

- Product Admin V1 session, audit, throttling and managed-edge contracts.
- Catalog Media Admin V1 Product/Category media capability.
- Product Content/Variants and Category Taxonomy invariants.
- Product Catalog API and public discovery contracts.
- Design System table, form, confirmation, status and responsive foundations.

## Risks and Controls

- Orphaned URLs or relationships: reversible retirement, no cascade and reserved
  slug aliases.
- Unusable Product drafts: atomic Product plus explicit Base Variant/SKU creation.
- Credential compromise: named attribution, strong password verification,
  throttling, revocation and retained managed edge.
- Narrow-view table failure: UX and accessibility review at 320px and 200% zoom.
- Taxonomy corruption: active-version-only creation and protected dependency
  checks.

## Approval Outcome

Product Requirements and Project Architecture decisions are approved. UX,
Design System and Backend contract work are unblocked under the attached
requirements, reviews and architecture handoff.
