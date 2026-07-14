# Product Detail Contact and Sharing V1

Status: Approved — Requirements and Architecture Complete

Coordinator: Project Architect

Date: 2026-07-13

## Summary

Strengthen Product Detail discovery by fully consuming the released multiple-
Image gallery and adding two visitor actions: contact the business through
WhatsApp about the current Product and share its canonical public URL.

## Existing Capability

Multiple Product Images, stable order, Primary selection, Variant-associated
Image behavior, alternative text and missing/failed media outcomes are released
through Product Content and Variants V1 and Catalog Media Admin V1. This artifact
integrates and validates that capability; it creates no Image model or upload
contract.

## Business Goal

Help visitors evaluate, ask about and share a Product without introducing cart,
checkout, online payment, guaranteed availability, stored leads or visitor
tracking.

## Approved Scope

- Present every eligible Product Image in the released ordered gallery.
- Preserve Primary/first initial selection and Variant/Image interaction.
- Add one `Contactar por WhatsApp` action using the approved business destination
  and exact Product-name/canonical-URL inquiry template.
- Add one `Compartir producto` action with native Share enhancement and
  copy/manual-link recovery.
- Use one absolute canonical Product URL for metadata, contact and sharing.
- Provide neutral cancellation, confirmed copy and recoverable denied/failure
  outcomes.
- Preserve commercial availability, accessibility, responsive and light-only
  contracts.

## Excluded Scope

- Public Product Image upload/editing or a second gallery model.
- Embedded chat, contact form, lead storage, CRM, analytics or visitor identity.
- Cart, reservation, checkout, payment or order creation.
- Guarantee that WhatsApp, native Share or Clipboard succeeds.
- Price, currency, SKU, Variant or availability claims in external payloads.
- Sharing private/Admin URLs, referrers, tracking data or internal Product data.

## Resolved Decisions

1. Product Detail reuses the released complete gallery without data duplication.
2. WhatsApp reuses the same Business-approved destination as Homepage; Business
   owns approval and Deployment owns runtime configuration.
3. WhatsApp message is `Hola, vi “{Product name}” en Mandoquita y quisiera
   recibir información. {canonical Product URL}` and contains no price/Variant.
4. Missing/invalid contact configuration omits only WhatsApp. External navigation
   is never reported as a sent message or completed transaction.
5. Share uses title `{Product name} | Mandoquita`, text `Mira “{Product name}” en
   Mandoquita.` and the canonical URL.
6. Native Share cancellation is neutral. Unsupported/failed native Share uses
   copy-link; failed/denied Clipboard exposes manual canonical-link recovery.
7. Production canonical URL derives only from governed HTTPS site-origin
   configuration plus the current canonical Product slug.
8. Contact/share are progressive client capabilities and require no domain
   mutation, persistence, third-party SDK or new public API.

## Dependencies

- Released Product Detail and Product Image gallery contracts.
- Catalog Media Admin V1 for maintaining gallery data.
- Existing approved external WhatsApp business contact.
- Governed Icon, Button, polite-status, Clipboard and Web Share rules.
- Deployment public-site-origin and WhatsApp-number configuration.

## Risks and Controls

- Transactional implication: information-request copy and no success guarantee.
- Stale/hidden commercial data: name and canonical URL only.
- Unsafe/incorrect URL: server-owned allowlisted origin and current slug.
- External capability denial: copy/manual recovery and intact Product content.
- Privacy leakage: no referrer, tracking, session, visitor or analytics payload.
- Gallery duplication: released media projection remains authoritative.

## Approval Outcome

Product Requirements and Project Architecture decisions are approved. UX,
Design System, UI, Backend and Frontend contract work is unblocked by the
attached reviews and handoff.
