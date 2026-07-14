# Admin Catalog Management V2 — Approved Requirements

Status: Approved with Account Governance Amendment

Owner: Product Requirements Architect

Date: 2026-07-13

## Purpose and Actors

Admin Catalog Management V2 gives an authorized, named Administrator a safe
way to maintain Products and Categories without direct database or seed changes.
The Superadministrator is the privileged business actor responsible for managing
Administrator accounts and can also perform catalog administration. Deployment
bootstraps the single Superadministrator and owns emergency recovery if that
protected account loses access. Public customers are not authentication actors.

## User Stories — Account Governance

- As the Superadministrator, I want to create and deactivate Administrator
  accounts so that access is granted only to current authorized maintainers.
- As the Superadministrator, I want to replace an Administrator's password so
  that lost or compromised access can be resolved without exposing the prior
  credential.
- As an Administrator, I want my account and actions to be individually
  attributable so that catalog maintenance is accountable.
- As the business owner, I want the single Superadministrator protected from
  in-application deletion or privilege changes so that account governance cannot
  be accidentally removed.

## Functional Requirements

- FR-ACM-001: Admin access requires an enabled, approved username and password
  and creates a temporary, revocable server-side authorization. The former
  shared code is not an accepted V2 login path after cutover.
- FR-ACM-002: The system supports exactly one protected Superadministrator and
  multiple named Administrator accounts. It does not expose public or
  self-service registration.
- FR-ACM-003: Every successful administrative mutation is attributable to one
  named Administrator without exposing passwords or authorization secrets.
- FR-ACM-004: Deployment bootstraps the Superadministrator through a governed
  server-side operation. No Administrator or public actor can create or assume
  that role.
- FR-ACM-005: An authorized Administrator can list, search, filter and page the
  Product collection through a semantic data table. Retired Products are hidden
  by default and available through an explicit filter.
- FR-ACM-006: An authorized Administrator can create a Product by providing a
  name, unique slug, positive price, three-letter currency and globally unique
  Base SKU. Product Type, content and media are optional at creation.
- FR-ACM-007: Product creation atomically creates one Base Variant identified by
  the supplied SKU. It does not fabricate Variant attributes or option values.
- FR-ACM-008: A newly created Product is inactive, not editorially approved, not
  published, not commercially available and not featured until each governed
  transition is requested and all existing eligibility rules pass.
- FR-ACM-009: An authorized Administrator can edit approved Product scalar,
  content, taxonomy and media boundaries without bypassing Product or Variant
  invariants.
- FR-ACM-010: Product deletion means reversible retirement, requires explicit
  impact confirmation and atomically removes the Product from publication,
  commercial availability and featured placement while preserving its content,
  Variants, Images, identity and audit history.
- FR-ACM-011: An authorized Administrator can explicitly restore a retired
  Product. Restoration does not automatically publish, feature or make it
  commercially available and revalidates current uniqueness and integrity rules.
- FR-ACM-012: An authorized Administrator can list and find Categories with
  state, order, dependency counts and Image context.
- FR-ACM-013: An authorized Administrator can create a Category in the active
  taxonomy by providing a name and unique slug. Description and Image are
  optional; default order appends it to its collection; initial state is inactive
  and not publicly visible.
- FR-ACM-014: An authorized Administrator can edit Category name, slug,
  description, order, state, visibility and Image without modifying unrelated
  taxonomy descendants or dependents.
- FR-ACM-015: Category deletion means reversible retirement and is rejected while
  any Subcategory, Product Type or Product depends on the Category. It never
  cascades and physical purge is outside V2.
- FR-ACM-016: An authorized Administrator can explicitly restore a retired
  Category after current uniqueness and dependency rules pass. Restoration does
  not automatically make the Category active or publicly visible.
- FR-ACM-017: A changed Product or Category slug preserves the former public URL
  as an alias to the current resource. Retired and historical slugs remain
  reserved and cannot be reassigned to another resource.
- FR-ACM-018: Every create, edit, retire, restore and ordering operation validates
  the complete resulting aggregate and applies atomically.
- FR-ACM-019: A stale Product, Category or account baseline cannot overwrite a
  newer confirmed change; the Administrator receives a recoverable conflict.
- FR-ACM-020: Validation, duplicate identity, protected dependency, conflict,
  expired authorization, throttling and service failures expose safe and
  actionable outcomes without revealing security-sensitive details.
- FR-ACM-021: Admin lifecycle changes preserve the released Homepage, Catalog,
  Search, Category and Product Detail eligibility and unavailable outcomes.
- FR-ACM-022: An authenticated Superadministrator can list and inspect
  Administrator accounts and their enabled/disabled state without seeing current
  or historical passwords.
- FR-ACM-023: An authenticated Superadministrator can create a named
  Administrator with a unique username and temporary password. The new account
  must replace that password on its next successful access.
- FR-ACM-024: An authenticated Superadministrator can reset an Administrator's
  password to a temporary replacement. The reset revokes every active
  authorization for that account and requires password replacement on next
  access.
- FR-ACM-025: An authenticated Superadministrator can remove an Administrator's
  access through reversible account deactivation. Deactivation revokes all active
  authorizations and retains identity and audit attribution.
- FR-ACM-026: A regular Administrator cannot list, create, reset, enable, disable
  or otherwise manage Administrator accounts.
- FR-ACM-027: The Superadministrator cannot deactivate, delete or demote itself,
  and the Admin cannot create or promote another Superadministrator in V2.
- FR-ACM-028: There is no password-recovery flow. The access experience only
  directs locked-out Administrators to the Superadministrator without confirming
  whether a submitted username exists.
- FR-ACM-029: An authenticated Superadministrator can reactivate a disabled
  Administrator only by assigning a new temporary password; reactivation does
  not restore any prior authorization or credential.

## Business Rules

- BR-ACM-001: Usernames contain 3–64 ASCII letters, digits, `.`, `_` or `-` and
  are unique after trimming, Unicode normalization and lowercase comparison.
- BR-ACM-002: Passwords contain 12–128 characters, may contain Unicode and
  spaces, support paste and password managers, and are rejected when commonly
  used, compromised or specific to the username/service. Arbitrary composition
  and periodic-rotation rules are not imposed.
- BR-ACM-003: Passwords are never stored, logged, returned by an API or later
  recoverable in plaintext. A reset replaces a credential; it never reveals one.
- BR-ACM-004: Authentication failures do not disclose whether a username exists,
  is disabled or has an incorrect password.
- BR-ACM-005: Product publication continues to require editorial approval,
  Product Type and at least one valid Variant, plus every released Product
  eligibility invariant.
- BR-ACM-006: Base SKU is explicit Administrator input and globally unique. The
  Product creation flow never derives it silently from name or slug.
- BR-ACM-007: Retirement is not physical deletion. Product and Category records,
  owned relationships, historical slugs and audit evidence are retained.
- BR-ACM-008: Retiring a Product sets `active`, `published`,
  `commerciallyAvailable` and `featured` false and clears `featuredOrder` as one
  outcome.
- BR-ACM-009: Category retirement sets it inactive and not visible only after all
  protected dependency counts are zero.
- BR-ACM-010: Empty Categories remain valid but follow the released public
  discovery omission rule until eligible Products exist.
- BR-ACM-011: Category creation targets only the active taxonomy version. V2 does
  not create or administer taxonomy versions.
- BR-ACM-012: Product and Category identities are system-generated and cannot be
  supplied or changed by an Administrator.
- BR-ACM-013: Table presentation and row actions do not authorize bulk mutation.
- BR-ACM-014: Media changes reuse the released Catalog Media Admin capability;
  this artifact does not create a second upload or ownership model.
- BR-ACM-015: Superadministrator is a fixed privileged role and Administrator is
  a fixed catalog-management role. V2 does not expose configurable permissions.
- BR-ACM-016: The Superadministrator inherits all catalog capabilities granted to
  an Administrator.
- BR-ACM-017: Account deletion is deactivation, not physical deletion. A disabled
  username remains reserved and its audit attribution is immutable.
- BR-ACM-018: Temporary passwords follow the same password policy as permanent
  passwords and cannot be returned, retrieved or displayed after creation/reset.
- BR-ACM-019: Account creation, reset, enablement and deactivation require fresh
  Superadministrator authorization and create safe audit evidence.

## Acceptance Criteria

- AC-ACM-001: Given a provisioned, enabled account, valid normalized username and
  password create a named temporary authorization; the legacy shared code cannot.
- AC-ACM-002: Given an unknown, disabled, throttled or incorrect credential, the
  access response is generic and no authorization is created.
- AC-ACM-003: Given account reset or disablement, all of that account's existing
  authorizations stop working before another protected operation can complete.
- AC-ACM-004: Given valid minimum Product input, creation produces one safe draft
  Product and one Base Variant with the supplied unique SKU in one operation.
- AC-ACM-005: Given missing, invalid or duplicate minimum Product input, neither
  Product nor partial Base Variant persists.
- AC-ACM-006: Given an eligible Product retirement request and confirmation, it
  disappears from public discovery and default Admin results while its data,
  relationships and historical URL ownership remain intact.
- AC-ACM-007: Given a retired Product restoration, it returns as a non-public,
  non-featured and commercially unavailable Product pending explicit transitions.
- AC-ACM-008: Given valid minimum Category input, creation adds an inactive,
  invisible Category at the end of the active taxonomy collection.
- AC-ACM-009: Given any protected Category dependency, retirement is rejected
  with dependency context and no Category, descendant or Product is mutated.
- AC-ACM-010: Given an eligible Category retirement, it becomes inactive and
  invisible while its data, Image association, identity and slug remain retained.
- AC-ACM-011: Given a Product or Category slug edit, the prior public URL resolves
  permanently to the current resource and the old slug cannot be reused.
- AC-ACM-012: Given a stale mutation baseline, the newer state remains intact and
  the Administrator is offered refresh/retry recovery.
- AC-ACM-013: At 320 CSS pixels and 200% zoom, every Product-table field and row
  action remains operable through the UX-approved responsive table behavior; it
  is not replaced by Product Cards.
- AC-ACM-014: Every successful protected mutation emits safe evidence containing
  actor, action, target, outcome and time, and never credentials or session data.
- AC-ACM-015: Given an authenticated Superadministrator and valid unique account
  input, one enabled Administrator is created with a temporary password and
  cannot perform catalog operations until that password is replaced.
- AC-ACM-016: Given a regular Administrator, every account-list or account-change
  attempt is rejected without exposing account data or changing state.
- AC-ACM-017: Given a Superadministrator password reset for an Administrator, all
  existing sessions for the target stop working and only the temporary credential
  can begin the mandatory password-change journey.
- AC-ACM-018: Given a Superadministrator deactivation of an Administrator, the
  target immediately loses access while its username and historical audit
  attribution remain retained.
- AC-ACM-019: Given an attempt to deactivate, delete or demote the protected
  Superadministrator, the operation is rejected and the account remains active.
- AC-ACM-020: Given a disabled Administrator reactivation, the account receives a
  new temporary password, retains its identity/history and receives no restored
  session.
- AC-ACM-021: Given the access screen, no password-recovery form, email/SMS action
  or account-discovery response is available.

## Non-Functional Requirements

- NFR-ACM-001 Security: authentication and mutation boundaries fail closed,
  throttle automated attempts, prevent account enumeration and preserve existing
  managed-edge, origin, CSRF, session and audit protections.
- NFR-ACM-002 Accessibility: access, forms, confirmations and table behavior meet
  WCAG 2.2 AA expectations, including keyboard use, programmatic relationships,
  error association, focus recovery, 320px reflow and 200% zoom.
- NFR-ACM-003 Usability: all Admin experiences remain light-only and clearly
  distinguish draft, active, public, unavailable and retired states without color
  as the only cue.
- NFR-ACM-004 Consistency: Product/Category reads and mutations preserve existing
  API envelopes, concurrency semantics and public projections unless this
  artifact explicitly supersedes them.
- NFR-ACM-005 Performance: table paging and mutations must remain bounded; no
  list operation loads unbounded Products, Images, Variants or dependencies.
- NFR-ACM-006 Reliability: each lifecycle mutation is atomic, idempotent where
  appropriate and produces an observable, recoverable outcome.

## Edge Cases and Explicit Outcomes

- Concurrent duplicate username, slug, SKU or order requests resolve through the
  canonical uniqueness/integrity rule; one wins and the other receives conflict.
- A retired resource requested by its historical public URL follows the released
  unavailable outcome; an old alias never exposes an ineligible resource.
- Media storage objects are not deleted by Product or Category retirement.
- Category reorder collisions are resolved atomically across the affected sibling
  collection; no duplicate final order is accepted.
- Loss of Administrator access is resolved by the Superadministrator. Loss of the
  protected Superadministrator requires governed Deployment emergency recovery;
  neither case introduces email, SMS, security-question or public recovery.
- Duplicate account creation, reset of a disabled account and concurrent
  reset/deactivation resolve atomically without restoring an older credential or
  session.
- Physical purge, bulk mutation, configurable permission management and
  taxonomy-version management require separate approval and are not implied by
  Administrator access.

## Traceability and Handoff

- Authentication/account lifecycle: FR-ACM-001–004 and 022–029,
  BR-ACM-001–004 and 015–019, AC-ACM-001–003 and 015–021, NFR-ACM-001.
- Product lifecycle/table: FR-ACM-005–011, BR-ACM-005–008 and 013–014,
  AC-ACM-004–007 and 013.
- Category lifecycle: FR-ACM-012–016, BR-ACM-009–012 and 014,
  AC-ACM-008–010.
- Continuity/concurrency/audit: FR-ACM-017–021, AC-ACM-011–012 and 014,
  NFR-ACM-004–006.

Requirements Review result: Approved. UX, Design System and technical contract
work may proceed without additional Product decisions inside the approved scope.
