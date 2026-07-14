# Admin Catalog Management V2 — Architecture and Security Review

Status: Approved with Superadministrator Amendment

Owner: Project Architect / Security Architecture

Date: 2026-07-13

## Decision Summary

The change is additive-first with a hard authentication cutover. Catalog delete
operations are reversible domain retirement commands, not storage deletion.
Production retains the managed-edge control because username/password is a
single authentication factor and the Admin can perform destructive operations.

## Authentication Boundary

- Replace the shared code with `username` and `password` on the existing Admin
  session creation boundary. No endpoint accepts both schemes after cutover.
- Persist `AdminAccount`: generated ID, canonical username, normalized username
  with a unique constraint, password hash, fixed role (`SUPER_ADMIN` or `ADMIN`),
  enabled/disabled state, mandatory-password-change flag, credential version,
  password-change/last-login timestamps and audit timestamps.
- Associate every Admin session with `adminAccountId` and the credential version
  valid at issuance. Disablement or password reset increments the version and
  revokes all sessions for that account.
- Bootstrap exactly one `SUPER_ADMIN` through an authenticated server-side
  Deployment command. The command may perform governed emergency reset of that
  account, but routine Administrator lifecycle belongs to the authenticated
  Superadministrator in the Admin.
- Enforce account authorization on the server for every account read/mutation.
  Only `SUPER_ADMIN` can list accounts or create, reset, reactivate and deactivate
  an `ADMIN`; `ADMIN` receives no account-management data or capability.
- Account removal is a soft deactivation with username and audit retention. The
  Superadministrator cannot target itself, change its role or create/promote
  another Superadministrator through an application boundary.
- Create/reset accepts a temporary password, stores only its hash and sets the
  mandatory-password-change flag. Until replacement, the target session is
  limited to password change/logout and cannot execute catalog commands.
- Reset, deactivation and reactivation increment credential version and revoke
  all target sessions. Reactivation requires a new temporary password and never
  restores an old credential/session.
- There is no public, email/SMS, token-link or knowledge-based recovery endpoint.
- Normalize usernames by trimming, Unicode normalization and lowercase
  comparison before validation and lookup. Persist the canonical normalized value
  used for uniqueness.
- Hash passwords with Argon2id and a unique salt using at least 19 MiB memory,
  two iterations and parallelism one; calibrate upward within the deployment
  latency budget. An optional pepper belongs only in managed secret storage.
- Apply the Product-amended 12–128 character policy, Unicode NFC before hashing,
  compromised/common/context-specific blocklist, no composition rule and no
  periodic rotation without compromise evidence.
- Execute a dummy password hash for an unknown username and return one generic
  authentication outcome for unknown, incorrect, disabled and locked accounts.
- Enforce independent persistent throttles per normalized username and per client
  source, plus the existing deployment-wide emergency budget. A baseline is five
  failures in 15 minutes followed by a 15-minute account/client throttle; the
  backend may use progressive delay when it is at least as protective and avoids
  permanent denial of service.
- Issue opaque server-side sessions with token rotation at login, `HttpOnly`,
  `Secure` and `SameSite=Strict` cookies, 30-minute idle expiry and eight-hour
  absolute expiry. Existing origin, CSRF and fail-closed checks remain.
- Audit actor account ID, action, target, result, time and safe request
  correlation. Never audit password input/hash, cookie, session token, pepper or
  complete submitted payloads.

## Catalog Aggregate Boundaries

- Product creation is one transaction across Product and its Base Variant. The
  application service accepts only the approved allowlist and enforces canonical
  slug/SKU uniqueness at persistence level.
- Product update mutates an explicit allowlist and checks the supplied concurrency
  baseline. Product Type, Variant, content and media invariants remain owned by
  their released contracts.
- Product retirement is one idempotent command: mark retired, force `active`,
  `published`, `commerciallyAvailable` and `featured` false, clear
  `featuredOrder`, retain Variants/Images/content and record actor/time.
- Product restoration clears retirement only after current identity/integrity
  validation. It does not restore active/public/commercial/featured flags.
- Category creation belongs to the active taxonomy aggregate, uses a generated
  ID and appends through a collision-safe sibling ordering transaction.
- Category update uses an allowlist and concurrency baseline. Reordering locks or
  otherwise serializes the affected sibling collection so the final order is
  unique and gap policy is deterministic.
- Category retirement first verifies zero Subcategory, Product Type and Product
  dependencies in the same consistency boundary, then marks retired, inactive
  and invisible. It never cascades or deletes media.
- Category restoration clears retirement only after current uniqueness and
  integrity checks and retains inactive/invisible state.
- Add retirement actor/time metadata to Product and Category. Add immutable
  Product and Category slug-alias reservations with unique canonical slug and
  target identity. Alias resolution uses the target's current public eligibility;
  it does not bypass unavailable outcomes.
- Physical purge is outside all Admin HTTP contracts in V2.

## API Contract Direction

- `POST /api/admin/session`: accepts only username/password and returns the
  existing safe session outcome shape.
- Product collection: paged/searchable/filterable read plus create. Product item:
  read, allowlisted update, retirement and explicit restore commands.
- Account collection/item boundaries are Superadministrator-only and expose safe
  identity, role and state projections plus separate create, reset, deactivate
  and reactivate commands. They never return a password or hash.
- Category collection: paged/dependency-aware read plus create. Category item:
  read, allowlisted update, protected retirement and explicit restore commands.
- Reads expose stable IDs, concurrency token, lifecycle state and only the counts
  required for confirmations. They never expose password/session internals.
- Writes distinguish validation, conflict, protected dependency, authorization,
  throttling and unavailable-service outcomes through the project's governed
  error envelope without account enumeration.

Exact route naming and method shape may follow the repository's established API
conventions, but must retain these separate commands and semantics.

## Migration and Rollback

1. Apply additive account, session association, retirement and slug-alias schema.
2. Bootstrap and verify the single enabled Superadministrator through the
   Deployment operation.
3. Deploy V2 authentication accepting only username/password, revoke every
   legacy shared-code session and remove the shared-code secret/configuration.
4. Verify managed-edge, role denial, Superadministrator self-protection, named
   audit, reset/deactivation revocation and catalog lifecycle probes before
   enabling Admin mutations.
5. Remove obsolete legacy columns only in a later proven-safe cleanup.

There is no dual-authentication window. Rollback first disables Admin at the
managed edge, revokes V2 sessions and restores the previous application only
with a newly rotated emergency legacy secret. Additive catalog data is retained;
rollback never physically deletes new or retired resources.

## Security and Release Posture

- Production Admin remains unreachable without managed-edge attestation.
- Username/password is necessary for named accountability but is not considered a
  replacement for edge protection or a future separately approved MFA control.
- Missing hash configuration, account store, throttle store, session store,
  managed-edge verification or audit persistence fails closed.
- Release requires migration/rollback evidence, security tests, protected
  dependency tests, public discovery regression and Deployment approval.

## Standards Basis

- NIST SP 800-63B password-verifier guidance: single-factor minimum length,
  blocklist, Unicode, password-manager/paste support and no arbitrary composition
  or periodic rotation.
- OWASP Password Storage guidance: Argon2id with a unique salt and current minimum
  work parameters.
- OWASP Authentication guidance: generic responses, persistent account-aware
  throttling and defense against automated authentication attacks.

## Review Outcome

ACM-007–ACM-011 and the ACM-039 Superadministrator amendment are approved.
Backend contract design can proceed; access UX must incorporate ACM-040 before
Frontend treats the account-management journey as implementation-ready.
