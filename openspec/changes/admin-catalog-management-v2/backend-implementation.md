# Admin Catalog Management V2 — Backend Implementation Evidence

Status: Backend complete; Superadministrator bootstrap remains a Deployment credential operation

Date: 2026-07-13

## Delivered

- Additive migration `202607130013_add_admin_catalog_management_v2` introduces
  named accounts, the fixed role enum, session/account credential-version links,
  named audit attribution, retirement metadata and immutable slug aliases.
- A partial unique index permits only one `SUPER_ADMIN`; another partial unique
  index permits at most one Base Variant per Product. Database checks protect
  retirement/public-state pairs. Advisory-locking triggers close concurrent
  canonical/alias slug reservation races.
- The migration revokes every unrevoked legacy shared-code session. Runtime code
  and Amplify configuration no longer accept or export `PRODUCT_ADMIN_CODE_HASH`.
- Password hashing is Argon2id (`m=19456`, `t=2`, `p=1`) with unique salts and an
  optional independent pepper. Login performs a dummy hash verification for an
  unknown username and persists account/client/deployment throttles.
- Product amended the password range to 12–128 characters. Account/client
  throttles still reject repeated invalid credentials, while a subsequently
  correct credential can recover immediately and clears those scopes. Credential
  reset also clears the target account throttle; deployment-wide protection is
  retained independently.
- `npm run admin:account -- bootstrap <username>` creates the one protected
  Superadministrator using `ADMIN_ACCOUNT_PASSWORD`; `reset` is the audited
  emergency credential rotation. Neither operation prints the password.
- Account, Product and Category command/read contracts are documented in
  `backend-api-contracts.md` and implemented under `/api/admin`.
- Product/Base-Variant and every lifecycle command are transactional. Category
  dependency retirement is non-cascading. Product/Category slug changes reserve
  and permanently redirect historical URLs subject to public eligibility.

## Verification recorded

- `npx prisma format` and `npx prisma generate`: pass.
- `npx tsc --noEmit`: pass.
- `npm test`: 36 files and 200 tests pass, including new Argon2id, normalization,
  credential revocation, safe Product creation/lifecycle and Category dependency
  coverage.
- `npx prisma migrate deploy`: migration 013 applied successfully to configured
  `dbmaster`; `npx prisma migrate status` confirms all 14 migrations are current.
- `npm run test:integration:admin-catalog-v2`: pass against real PostgreSQL.
  Named-account persistence, atomic Product/Base Variant, retirement/restoration,
  historical Product/Category aliases and safe Category lifecycle were verified;
  Admin Product-list p95 was 520.24 ms against the 750 ms remote evidence limit.

## Deployment and rollback gate

Migration 013 was applied after explicit authorization and all legacy Admin
sessions were revoked. The remaining Deployment activation sequence is:

1. Confirm Admin remains governed by the managed edge.
2. Set independent session/pepper/edge secrets and remove the legacy code secret.
3. Set `ADMIN_ACCOUNT_PASSWORD` only for the command invocation and run the
   Superadministrator bootstrap; then remove that environment value.
4. Verify named login, mandatory password replacement, role denial, account
   revocation, lifecycle probes and audit attribution before re-enabling Admin.

Rollback disables Admin at the edge first and revokes V2 sessions. The previous
application may be restored only with a newly rotated emergency legacy secret.
The additive schema and all Product/Category/account/audit data remain; rollback
does not physically delete or unretire resources. Obsolete columns are reserved
for a separately approved cleanup migration.
