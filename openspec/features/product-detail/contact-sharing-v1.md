# Product Detail Contact and Sharing V1 — Canonical Feature Amendment

Status: Complete — Release Approved

Owner: Product Detail / Project Architecture

Last synchronized: 2026-07-14

## Capability

Product Detail consumes the complete released ordered Image gallery and adds one
WhatsApp inquiry plus one canonical Share utility. It creates no Image model,
Product mutation, transaction, stored lead, visitor account or analytics event.

## Gallery

- Every released eligible Image appears once in canonical position order.
- Primary Image is initially selected, otherwise the first ordered Image.
- Valid Variant `imageId` may select its gallery Image; manual Image navigation
  never changes Variant state.
- Missing/failed media preserves the released gallery outcome.

## WhatsApp

- The recipient is the same Business-approved number used by Homepage and is
  provided through server-only `WHATSAPP_BUSINESS_NUMBER` configuration.
- Exact message: `Hola, vi “{Product name}” en Mandoquita y quisiera recibir
  información. {canonical Product URL}`.
- Missing/invalid configuration omits the action. External navigation never
  claims message delivery, response, availability or transaction completion.
- Price, currency, SKU, Variant, visitor, referrer, session and Admin data are
  excluded.

## Canonical Share

- Server derives one absolute URL from governed `PUBLIC_SITE_ORIGIN` plus current
  canonical Product slug after alias resolution.
- Native Share submits title `{Product name} | Mandoquita`, text
  `Mira “{Product name}” en Mandoquita.` and canonical URL.
- Cancellation is neutral. Unsupported/failed native Share falls back to copying
  only the URL; denied Clipboard exposes the same manual link.
- Current arbitrary browser/Host/referrer URLs and tracking parameters are never
  used.

## Security and Privacy

Production origin is HTTPS and the international WhatsApp number normalizes to
one 8–15 digit recipient. URLs are constructed with governed URL APIs, external
navigation receives no opener/referrer and no third-party script/frame/request
is needed during render.

## Release Evidence

- Requirements/Architecture: active change `requirements.md`,
  `architecture-review.md` and `architecture-handoff.md`.
- Backend: active change `backend-implementation.md`; additive canonical/contact
  fields and gallery compatibility are complete.
- UX/UI, Design System and Accessibility: `ux-blueprint.md`,
  `design-system-review.md`, `ui-design.md` and
  `accessibility-design-review.md` are approved.
- Frontend: complete Gallery, Contact, Share/Copy recovery and automated/browser
  evidence are recorded in `frontend-implementation.md`.
- PDS-017–PDS-021 QA is approved in the active change `qa-review.md` with 225
  tests, production build and rendered responsive/accessibility validation.
- PDS-022 documentation synchronization and PDS-023 final release are approved
  in `documentation-sync-review.md` and `release-approval.md`.
