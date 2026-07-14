# Catalog Media Admin V1 — Production Deployment Runbook

Status: Superseded — Consolidated into Admin V2 ACM-037 Runbook

Owner: Deployment Owner with Backend Architect and Project Architect

Date: 2026-07-13

## Deployment Boundary

Catalog Media Admin uses the same `/admin` and `/api/admin/*` production
perimeter as Admin Catalog Management V2. The default Amplify/CloudFront application origin
is not, by itself, proof of managed administrative access. Production requires
an approved proxy, VPN/private network or operator allowlist that strips any
caller edge-proof header and injects the trusted value only after access passes.

The application already fails closed when the Product Admin security, edge or
storage configuration is absent. Fail-closed behavior is not a substitute for
proving that authorized production access works through the intended perimeter.

## Runtime Configuration

Amplify runtime must receive the server-only Admin V2 session/pepper/edge,
Origin/proxy and catalog storage values declared in `.env.example`. Named-account
bootstrap credentials are invocation-scoped and are not stored in build
configuration. `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and
`AWS_SESSION_TOKEN` must not be configured in Amplify or written into build
artifacts. Production uses temporary credentials from the Amplify **SSR Compute
role** (not the deployment service role).

## IAM and Storage

The runtime role is limited to the approved Product and Category prefixes and
requires only the S3 Put/Delete operations used by the implemented lifecycle,
plus approved KMS Encrypt/GenerateDataKey permissions when KMS is configured.
Bucket listing, wildcard buckets and repository/static access keys are not part
of the approved profile.

Create the role with this trust relationship:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "amplify.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
```

Attach a least-privilege identity policy, replacing the placeholders:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CatalogMediaObjects",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": [
        "arn:aws:s3:::BUCKET_NAME/images/products/*",
        "arn:aws:s3:::BUCKET_NAME/images/categories/*"
      ]
    },
    {
      "Sid": "CatalogMediaEncryption",
      "Effect": "Allow",
      "Action": ["kms:Encrypt", "kms:GenerateDataKey"],
      "Resource": "KMS_KEY_ARN"
    }
  ]
}
```

Remove the KMS statement when `AWS_S3_KMS_KEY_ID` is unset. When it is set, the
KMS key policy must also permit this role. Associate the role in Amplify under
**App settings → IAM roles → Compute role**. App-level roles affect all branches;
use a branch-specific role or disable untrusted previews where appropriate.

The delivery origin/CDN serves immutable UUID-keyed JPEG/PNG/WebP/AVIF objects
with the approved cache policy. Product and Category namespaces remain separate.

## Scheduled Lifecycle

A production schedule must execute the idempotent cleanup capability often
enough to delete expired temporary uploads after 24 hours and superseded/removed
objects after their seven-day retention. Cleanup failures remain observable and
retryable; currently referenced objects are never deleted.

## Mandatory Attestation

- [ ] Production Amplify application and canonical HTTPS origin identified.
- [ ] Managed proxy, VPN/private-network or operator allowlist identified.
- [ ] Direct/unapproved access to Admin routes denied; authorized perimeter
  access reaches the login gate.
- [ ] Caller edge-proof header stripped and trusted proof injected only after
  perimeter authorization.
- [ ] `PRODUCT_ADMIN_ORIGIN`, proxy mode/hops and HTTPS topology verified.
- [ ] Runtime IAM Role policy proves scoped Product/Category S3 access and no
  static AWS credentials in the deployed artifact.
- [ ] Bucket public-access, delivery CDN origin and immutable cache behavior
  verified without exposing bucket administration.
- [ ] Temporary/orphan and seven-day retained cleanup schedule enabled and one
  production-equivalent scheduled run recorded with zero unsafe deletion.
- [ ] Named-account session, password pepper and edge secret rotation tested
  without an unprotected interval.
- [ ] Any credential-shaped value previously placed in a local environment or
  sample file is confirmed inactive or revoked/rotated.

Evidence records operator and timestamp but never includes credentials, full
headers, private network detail or unrestricted storage URLs.

## Rollback

1. Deny media and Product Admin routes at the managed edge.
2. Stop new uploads and the cleanup schedule.
3. Restore the prior compatible application artifact.
4. Revoke Admin sessions and rotate affected secrets.
5. Preserve currently referenced and retained media; never roll back by deleting
   public objects.
6. Verify public catalog and Category discovery remain available.

## Release Decision

Do not execute this as a standalone release checklist. Every mandatory item is
consolidated into the Admin V2 deployment runbook and must pass before ACM-037.
