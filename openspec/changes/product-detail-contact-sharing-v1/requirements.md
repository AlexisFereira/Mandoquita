# Product Detail Contact and Sharing V1 — Approved Requirements

Status: Approved — Ready for UX and Technical Contract

Owner: Product Requirements Architect

Date: 2026-07-13

## Purpose and Actor

Product Detail Contact and Sharing V1 helps a visitor inspect every released
Product Image, ask the business about the current Product through WhatsApp and
share its canonical public URL. The visitor remains anonymous and no action
creates a transaction, reservation, account or stored lead.

## User Stories

- As a visitor, I want to inspect every available Product Image so that I can
  understand the Product before asking for information.
- As a visitor, I want to contact the business about the Product I am viewing so
  that I do not need to identify it manually in WhatsApp.
- As a visitor, I want to share the Product's stable public link so that another
  person can open the same Product Detail.
- As the business, I want contact and sharing to use only current public Product
  identity so that hidden commercial or administrative information is not sent.

## Functional Requirements

- FR-PDS-001: Product Detail presents the complete eligible ordered Product Image
  gallery using the released Image identities, order and alternative text.
- FR-PDS-002: Initial gallery media is the Primary Image when present, otherwise
  the first ordered Image. No Images preserves the released missing-media outcome.
- FR-PDS-003: Selecting a Variant with a valid associated Image may select that
  gallery Image. Manual gallery navigation never changes Variant state.
- FR-PDS-004: This artifact consumes Product Content and Variants V1 and Catalog
  Media Admin V1; it creates no second Image, upload, ordering or ownership model.
- FR-PDS-005: When the approved business WhatsApp destination is configured,
  Product Detail exposes one labelled `Contactar por WhatsApp` action about the
  current Product.
- FR-PDS-006: The WhatsApp message is exactly: `Hola, vi “{Product name}” en
  Mandoquita y quisiera recibir información. {canonical Product URL}`.
- FR-PDS-007: WhatsApp context contains only the public Product name and canonical
  Product URL. It does not contain price, currency, SKU, Variant, inventory,
  availability claims, visitor data or administrative fields.
- FR-PDS-008: Missing or invalid WhatsApp configuration omits only the WhatsApp
  action. Product content, gallery and Share remain available.
- FR-PDS-009: Activating WhatsApp opens the approved external destination without
  claiming that a message, purchase, reservation or availability confirmation
  succeeded.
- FR-PDS-010: Product Detail exposes one labelled `Compartir producto` action for
  the canonical public Product URL.
- FR-PDS-011: Share content is exactly: title `{Product name} | Mandoquita`, text
  `Mira “{Product name}” en Mandoquita.` and the canonical Product URL.
- FR-PDS-012: When native sharing is available, the Share action invokes it from
  an explicit visitor action. When unavailable, the visitor can copy the
  canonical Product URL.
- FR-PDS-013: Copy fallback copies only the canonical Product URL and communicates
  confirmed or failed status without moving focus unexpectedly.
- FR-PDS-014: Native Share cancellation is neutral: it creates no error alert,
  success claim, retry loop or application state.
- FR-PDS-015: Native Share or Clipboard denial/failure preserves Product content
  and exposes a recoverable manual canonical-link outcome.
- FR-PDS-016: Contact and Share remain optional continuation actions and do not
  change Product, Variant, commercial, publication or visitor state.
- FR-PDS-017: Historical Product slug requests resolve to the current canonical
  Product URL before contact/share content is built.

## Business Rules

- BR-PDS-001: The WhatsApp destination is the same single business contact
  approved for Homepage. Business approves the number and Deployment owns its
  runtime configuration.
- BR-PDS-002: No Product Detail control can create, edit or discover a WhatsApp
  destination.
- BR-PDS-003: Contact copy expresses an information request; it never promises
  availability, price, response time, sale or delivery.
- BR-PDS-004: Price and currency are excluded even when publicly available so the
  shared message cannot become a stale commercial offer.
- BR-PDS-005: The canonical Product URL uses the approved public site origin and
  current Product slug, without query, fragment, tracking or session data.
- BR-PDS-006: Share and contact never use the browser's current arbitrary URL,
  referrer, an Admin URL or an incoming alias.
- BR-PDS-007: Product names are public content but are normalized for message
  whitespace and safely encoded; they never become executable markup or URL
  structure.
- BR-PDS-008: Native Share is progressive enhancement. Copy/manual link remains
  the non-native recovery and does not require an account.
- BR-PDS-009: Cancellation and external navigation generate no stored business
  event, lead or behavioral profile in V1.
- BR-PDS-010: WhatsApp is the primary contact continuation and Share is a
  secondary utility. Neither is labelled or presented as purchase completion.
- BR-PDS-011: Multiple Images do not change Product publication, Commercial
  Availability, Variant eligibility or public offer meaning.
- BR-PDS-012: The application cannot confirm delivery or behavior after control
  passes to WhatsApp or the operating-system share destination.

## Acceptance Criteria

- AC-PDS-001: Given multiple Images, every eligible Image appears once in released
  order and the Primary Image is initially selected.
- AC-PDS-002: Given no Primary Image, the first ordered Image is initially
  selected; given no Images, the released missing-media message remains.
- AC-PDS-003: Given a Variant-associated Image, resolving that Variant selects the
  corresponding gallery Image; manually selecting another Image does not alter
  the Variant.
- AC-PDS-004: Given valid WhatsApp configuration, the labelled action targets the
  approved business number and carries exactly the encoded template with current
  public Product name and absolute canonical URL.
- AC-PDS-005: Given absent/invalid WhatsApp configuration, no WhatsApp action or
  invented alternative destination renders and all other Product content remains.
- AC-PDS-006: Given a Product without a current commercial offer, contact/share
  content contains no historical price/currency and makes no availability claim.
- AC-PDS-007: Given native Share support and visitor activation, exactly the
  approved title, text and canonical URL are submitted.
- AC-PDS-008: Given native Share cancellation, focus returns/persists safely and no
  success or error announcement is emitted.
- AC-PDS-009: Given native Share is unavailable, the visitor can copy the
  canonical URL and receives a polite confirmation.
- AC-PDS-010: Given Clipboard is unavailable or denied, Product Detail remains
  intact and exposes the canonical link for manual recovery with a polite failure.
- AC-PDS-011: Given an old Product slug, permanent resolution occurs before the
  page exposes metadata, WhatsApp or Share, all of which use the current URL.
- AC-PDS-012: Given an activation of WhatsApp, the destination opens externally
  without access to the original window and the page does not announce delivery.
- AC-PDS-013: At 320 CSS pixels and 200% zoom, gallery and both actions remain
  readable, keyboard-operable and free of page-level horizontal overflow.
- AC-PDS-014: Contact/share use only the approved public fields and create no
  request that stores visitor identity, Product inquiry or transaction state.

## Non-Functional Requirements

- NFR-PDS-001 Accessibility: gallery controls, action names, external context,
  polite statuses, focus, keyboard, 44px targets, 320px reflow and 200% zoom meet
  WCAG 2.2 AA expectations.
- NFR-PDS-002 Security: all external URLs are constructed from allowlisted
  configuration/data, safely encoded and opened without opener/referrer exposure.
- NFR-PDS-003 Privacy: contact/share payloads contain no visitor, session,
  referral, analytics, hidden commercial or administrative information.
- NFR-PDS-004 Reliability: unavailable/denied external capabilities fail locally
  and recoverably without affecting Product rendering or domain state.
- NFR-PDS-005 Performance: this capability adds no Product media duplication,
  server mutation or blocking third-party script to initial Product rendering.
- NFR-PDS-006 Consistency: Product canonical metadata, WhatsApp, Share and alias
  resolution use one canonical URL source.
- NFR-PDS-007 Presentation: Product Detail remains light-only and reuses released
  Gallery, Button, Icon and polite-status foundations.

## Edge Cases

- Product name containing quotes, emoji, accents, ampersands or line breaks is
  normalized/encoded without changing the public Product identity.
- A very long valid Product name preserves the exact template but cannot break or
  inject the destination URL; technical URL limits fail by omitting contact with
  safe Product content retained.
- WhatsApp configuration with punctuation or spaces is normalized only when it
  represents one valid international number; otherwise the action is omitted.
- Native Share may exist but reject the payload. Non-cancel rejection moves to
  copy/manual-link recovery; cancellation remains neutral.
- Clipboard may require a secure context or visitor permission. Denial never
  causes repeated prompts.
- Product retirement/unpublication between page load and external activation may
  make the canonical URL unavailable later; no availability guarantee is made.
- Failed/missing gallery media has no effect on Contact or Share eligibility.
- Contact and Share activation while another action is pending does not create
  duplicate status claims or disable access to Product content.

## Traceability and Review

- Gallery integration: FR-PDS-001–004, BR-PDS-011, AC-PDS-001–003.
- WhatsApp: FR-PDS-005–009, BR-PDS-001–004 and 007 and 012,
  AC-PDS-004–006 and 012.
- Sharing: FR-PDS-010–015, BR-PDS-005–010 and 012,
  AC-PDS-007–011.
- Scope/privacy/quality: FR-PDS-016–017, AC-PDS-013–014,
  NFR-PDS-001–007.

Requirements Review result: Approved. PDS-001–PDS-004 are complete and UX may
proceed without inventing Product, contact, sharing or privacy behavior.
