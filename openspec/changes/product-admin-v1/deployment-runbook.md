# Product Admin V1 — Production Deployment Runbook

Status: Cancelled — Superseded by Admin Catalog Management V2

Owner: Deployment Owner with Backend Architect and Project Architect

Date: 2026-07-13

## Release Boundary

Product Admin V1 must not be released through an unrestricted direct application
origin. Production `/admin` and `/api/admin/*` traffic requires one approved
managed access proxy, VPN/private network or explicit operator-network allowlist.
The six-digit credential and application session are additional controls, not a
replacement for this perimeter.

The repository's `docker-compose.yml` is a development/integration composition
and is not production perimeter evidence because it publishes Next.js directly.

## Required Edge Behavior

The production edge shall:

1. deny `/admin` and `/api/admin/*` unless the request satisfies the approved
   operator-access policy;
2. remove every caller-provided `x-product-admin-edge` header;
3. inject `x-product-admin-edge` with the independent deployment secret only
   after access succeeds;
4. use HTTPS and forward only the explicitly trusted proxy chain;
5. leave public catalog routes available without the administrative header; and
6. fail closed if the edge policy or secret injection is unavailable.

The application shall configure `PRODUCT_ADMIN_ORIGIN`,
`PRODUCT_ADMIN_CODE_HASH`, `PRODUCT_ADMIN_SESSION_SECRET`,
`PRODUCT_ADMIN_EDGE_SECRET`, `PRODUCT_ADMIN_TRUST_PROXY` and
`PRODUCT_ADMIN_TRUSTED_PROXY_HOPS` according to `backend-implementation.md`.
Edge, session and credential secrets must be independent.

## Mandatory Production Attestation

Deployment Owner must replace each unchecked item with dated, non-secret evidence:

- [ ] Deployment target and production origin identified.
- [ ] Managed proxy, VPN/private-network or operator allowlist policy identified.
- [ ] Direct origin access to `/admin` and `/api/admin/*` denied or unreachable.
- [ ] Caller-supplied edge header stripped and trusted value injected only after
  perimeter authorization.
- [ ] Authorized edge request reaches the access gate; unauthorized request
  fails without Product data or session creation.
- [ ] Trusted proxy hop count and HTTPS origin match production topology.
- [ ] Secret rotation and rollback procedure tested without an unprotected window.
- [ ] Credential-shaped AWS values formerly present in the local `.env.example`
  are confirmed inactive or have been revoked/rotated.

Evidence must name the responsible operator and timestamp but must not contain
credentials, tokens, full sensitive headers or private network details.

## Release Decision

Do not execute this runbook. Product Admin V1 production release is prohibited by
`supersession-decision.md`; Admin Catalog Management V2 owns the named-account
managed-edge activation and rollback procedure.

## Rollback

1. Deny `/admin` and `/api/admin/*` at the managed edge.
2. Restore the prior application artifact.
3. Revoke active Product Admin sessions and rotate affected secrets.
4. Retain safe audit evidence for at least 90 days.
5. Verify the public catalog remains available and Product data is unchanged.
