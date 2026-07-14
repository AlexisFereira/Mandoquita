# Product Detail Contact and Sharing V1 — Accessibility Design Review

Status: PDS-009 and PDS-020 Approved

Owner: Accessibility Review

Date: 2026-07-14

## Decision

The independent Accessibility Review approves `ui-design.md` and closes
PDS-009. Frontend may implement PDS-012–PDS-016 using the released Gallery,
Button and PoliteStatus contracts.

## Approved evidence

- Media remains first in one DOM, reading and focus order at every breakpoint.
- Gallery controls expose Product context, current position, selected state,
  meaningful alternatives and 44px targets without color-only meaning.
- Contact, Share and Copy retain complete visible labels. WhatsApp external
  context is explained in text and decorative Icons cannot become names.
- Native Share cancellation is neutral and preserves focus. Failures disclose a
  canonical manual link and one polite status without dialog or forced focus.
- Copy confirmation/failure is visible and programmatic, keeps focus on the
  initiating Button and never claims delivery or receipt.
- Actions stack and long canonical URLs wrap at 320px and 200% zoom without DOM
  duplication, truncation or page-level horizontal scrolling.
- The deterministic light palette, shared focus treatment and reduced-motion
  behavior remain unchanged. No interaction depends on hover, motion, fine
  pointer, color or an Icon alone.
- Only server-approved public Product identity and canonical/contact values
  reach the UI; no Variant, price, visitor, referrer or administrative state is
  exposed through Contact or Share.

Rendered keyboard, screen-reader, zoom and responsive evidence is approved under
PDS-020 in `qa-review.md`.
