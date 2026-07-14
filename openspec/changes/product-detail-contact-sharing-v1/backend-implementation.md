# Product Detail Contact and Sharing V1 — Backend Implementation

Status: Complete

Owner: Backend Architect

Date: 2026-07-14

## Delivered

- Product Detail responses add `canonicalUrl` and optional `whatsappUrl` without
  exposing source configuration or any internal Product field.
- `PUBLIC_SITE_ORIGIN` must be an absolute root HTTPS origin in production with
  no credentials, path, query or fragment. HTTP is accepted only for explicit
  localhost development. Missing/invalid configuration yields null actions and
  never guesses from request headers or browser state.
- `WHATSAPP_BUSINESS_NUMBER` accepts one punctuated international number only
  when normalization produces 8–15 digits. Prebuilt URLs, query strings,
  extensions/multiple recipients and arbitrary hosts are rejected.
- The destination is constructed with the URL API at exact host `wa.me` and the
  approved information-request template. Product whitespace is normalized after
  NFC; price, currency, availability, Variant, SKU, visitor, referrer, session
  and Admin data are absent.
- Existing alias resolution redirects before `getProductDetail` builds the
  continuation. Canonical metadata consumes the same server value.
- Existing Product Detail media projection remains unchanged: all Images use
  ascending position, preserve stable ID/Primary/alternative text and active
  public Variants retain only their approved optional `imageId` association.

## Configuration

- `PUBLIC_SITE_ORIGIN=https://<approved-public-origin>`
- `WHATSAPP_BUSINESS_NUMBER=<approved-8-to-15-digit-international-number>`

Both are server runtime values included in `.env.example` and the Amplify
environment handoff. Neither uses a `NEXT_PUBLIC_` prefix.

## Evidence and rollback

- `tests/api/publicProductContinuationService.test.ts` covers exact message,
  Unicode/whitespace, allowlisted origin/recipient, unsafe inputs and local HTTP.
- `tests/api/catalogService.test.ts` verifies complete ordered gallery, Primary
  flag, Variant Image association and the canonical Product URL projection.
- No schema, third-party request, SDK, lead storage or mutation was introduced.
  Rollback removes the two additive response fields; Product/media data remains
  unchanged.
