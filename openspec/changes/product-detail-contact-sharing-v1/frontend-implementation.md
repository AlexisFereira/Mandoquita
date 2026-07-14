# Product Detail Contact and Sharing V1 — Frontend Implementation

Status: PDS-012–PDS-016 Complete — QA and Release Approved

Owner: React Frontend Architect with Accessibility responsibilities

Date: 2026-07-14

## Delivered

- Product Detail consumes every released ordered Image through the controlled
  Gallery. Primary/first initialization, manual navigation and valid
  Variant-to-Image selection preserve one media collection and Variant authority.
- `ProductContinuationActions` follows Product identity, offer and Variants in
  one responsive DOM. It consumes only server-provided `canonicalUrl` and
  `whatsappUrl`; missing canonical configuration fails closed without guessing.
- WhatsApp is a labelled primary external link with `noopener`, `noreferrer`
  and `no-referrer`. The approved external-context guidance is visible and the
  UI does not rebuild, expose or claim delivery of the prepared message.
- Share submits the exact approved title, text and canonical URL. `AbortError`
  is neutral; unsupported/non-cancel failure discloses Copy plus the readable
  canonical link without automatic Clipboard activation.
- Copy uses only the canonical URL and reports confirmed/failed outcomes through
  one visible `PoliteStatus`. Share/Copy prevent duplicate activation and restore
  focus after their pending state commits.
- The recovery surface wraps long URLs, uses released semantic tokens and keeps
  44px targets, light-only behavior and one gallery→Product→actions order.

## Automated evidence

- `tests/ui/product-detail-page.test.tsx` covers Primary/first/missing media,
  Variant Image association, exact WhatsApp destination/safety, absent config,
  exact native Share payload, neutral cancellation, unsupported Share, confirmed
  Copy, denied Clipboard, manual link and fail-closed canonical behavior.
- `scripts/validate-product-detail-contact-browser.cjs` validates the configured
  rendered page at 320, 768 and 1440px plus a 720px effective viewport for 200%
  zoom. It checks order, no overflow, deterministic light, external safety,
  canonical identity, targets, focus, fallback and accessibility-tree names.
- TypeScript and the full 38-file / 218-test suite pass. Rendered evidence records
  targets of at least 46px, no horizontal overflow and successful 200% reflow.

## Configuration boundary

Runtime actions require server-only `PUBLIC_SITE_ORIGIN` and optional
`WHATSAPP_BUSINESS_NUMBER`. Browser validation used local process-scoped values;
no `.env` value was changed or persisted.
