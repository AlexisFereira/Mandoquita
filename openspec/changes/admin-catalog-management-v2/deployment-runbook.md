# Admin Catalog Management V2 — Deployment Runbook

Status: Procedure Complete — Production Attestation Pending

Owner: Deployment

Date: 2026-07-14

## Purpose

Activate named Admin V2 safely after implementation and QA approval. This file
defines the required evidence; it must never contain actual passwords, hashes,
cookies, peppers, edge secrets or database credentials.

## Prerequisites

- Production backup/restore procedure is current.
- Migration `202607130013_add_admin_catalog_management_v2` is deployed and
  `prisma migrate status` reports all migrations current.
- Managed edge strips caller-provided Admin edge headers and injects its own
  independent proof only after the approved operator policy passes.
- Independent values exist for `PRODUCT_ADMIN_SESSION_SECRET`,
  `PRODUCT_ADMIN_PASSWORD_PEPPER` and `PRODUCT_ADMIN_EDGE_SECRET`.
- `PRODUCT_ADMIN_ORIGIN`, proxy trust and trusted-hop configuration match the
  production topology.
- Legacy shared-code configuration is absent.
- Runtime IAM uses temporary least-privilege access limited to approved Product
  and Category media prefixes; deployed artifacts contain no static AWS keys.
- Delivery CDN/origin and immutable media cache policy are configured.
- The idempotent temporary/orphan and seven-day retained-object cleanup schedule
  is enabled.

## Activation

1. Keep `/admin` disabled at the managed edge during activation.
2. Deploy the application and additive migration; verify public Homepage,
   Category, Catalog and Product Detail health before enabling Admin.
3. Supply `ADMIN_ACCOUNT_PASSWORD` only to the one command invocation and run
   `npm run admin:account -- bootstrap <username>` from the governed Deployment
   environment. Remove the variable immediately afterward.
4. Confirm the command creates the single protected Superadministrator without
   printing or logging the credential.
5. Enable `/admin` only through the managed edge.
6. Verify named login, mandatory temporary-password replacement, logout, fixed
   role denial and safe account projection.
7. Create a temporary Administrator, verify catalog access and prove reset,
   deactivation/reactivation and session revocation. Remove access afterward.
8. Probe Product create/edit/retire/restore and dependency-safe Category
   lifecycle with disposable non-public records.
9. Confirm named safe audit attribution and no-store/security headers.
10. Upload and remove disposable Product/Category media, verify immutable CDN
    delivery, alternative-text persistence and zero unsafe cleanup deletion.

## Rollback

1. Disable `/admin` at the managed edge before application rollback.
2. Revoke all V2 sessions and preserve account/catalog/audit data.
3. Restore the prior compatible application only under the documented emergency
   procedure. If the former application requires a legacy secret, generate a new
   value; never restore the retired value.
4. Do not reverse migration 013 destructively and do not delete, unretire or
   rewrite Product/Category/account/audit records.
5. Verify public discovery and media health before reopening any Admin version.

## Required Attestation

- [ ] Production managed-edge direct-access rejection verified.
- [ ] Independent secret/origin/proxy configuration verified without recording values.
- [ ] Single Superadministrator bootstrap and mandatory replacement verified.
- [ ] Legacy shared-code rejection and old-session revocation verified.
- [ ] Role denial, reset/deactivation revocation and safe audit verified.
- [ ] Product/Category disposable lifecycle probes passed.
- [ ] Runtime IAM scope, absence of static AWS credentials and storage encryption verified.
- [ ] CDN origin/public-access boundary and immutable cache freshness verified.
- [ ] Temporary/orphan and retained-object cleanup schedule enabled and safely exercised.
- [ ] Rollback disable/revoke/restore procedure rehearsed or formally attested.
- [ ] Deployment owner, date, environment and evidence location recorded.

Until every item is attested, ACM-037 and production Release remain open.
