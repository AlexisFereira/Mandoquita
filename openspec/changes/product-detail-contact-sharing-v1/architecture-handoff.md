# Product Detail Contact and Sharing V1 — Architecture Handoff

Status: Ready for UX, Design System, Backend and Frontend

Date: 2026-07-13

## UX and Design

- Keep WhatsApp as the primary information-request continuation and Share as a
  secondary utility; neither is a purchase action.
- Define visible external context before WhatsApp activation and polite copy/
  failure statuses. Native cancellation receives no success/error announcement.
- Preserve gallery/Variant interaction and Product Offer hierarchy.
- Provide manual canonical-link recovery when native Share or Clipboard fails.
- Validate one coherent action group at keyboard, touch, 320px and 200% zoom.

## Backend

- Validate governed public-site HTTPS origin and approved WhatsApp number.
- Resolve canonical slug first, then produce one absolute canonical URL and safe
  optional WhatsApp URL for Product Detail.
- Preserve the released complete ordered gallery/Primary/Variant projection.
- Add no Image schema, third-party request, lead storage or mutation endpoint.

## Frontend

- Render the released gallery once and preserve controlled Variant/Image rules.
- Use server-provided canonical/contact data; never rebuild origin from browser
  location or accept arbitrary WhatsApp URLs.
- Capability-detect native Share on explicit activation; cancellation is neutral.
- Fallback to canonical-URL copy, then manual link on Clipboard denial/failure.
- Use exact payloads, safe external link attributes and no success claim for
  WhatsApp navigation.

## Required Evidence

- Complete gallery order, Primary/first selection, Variant association and
  missing/failed media.
- Exact encoded WhatsApp message and approved recipient; absent/invalid config.
- Current canonical URL after alias resolution; no query/referrer/session data.
- Native share success invocation, cancellation, rejection, unsupported state,
  Clipboard confirmation/denial and manual recovery.
- Keyboard, screen reader, targets, focus, 320px, 200% zoom and light-only.
- No third-party render request, Product mutation, lead/analytics event or public
  Catalog/Product Detail regression.
