# Homepage Merchandising Layout V2 — Accessibility Design Review

Status: HML-012 and HML-023 Approved

Owner: Accessibility Review

Date: 2026-07-14

## Decision

The independent Accessibility Review approves the UX/UI contract and closes
HML-012. The composition can satisfy WCAG 2.2 AA using the released Carousel,
Card, Button, semantic light palette and the approved CollectionGrid.

## Evidence

- One page H1 precedes ordered H2 section headings; omitted regions leave no
  empty landmark, heading, control or spacing shell.
- Banner meaning is HTML and decorative media does not duplicate its title.
  Zero/one/multiple-slide states remove inapplicable controls while multiple
  slides retain 44px named controls, focus/hover pause and reduced-motion rules.
- Category and Product collections use native lists with one Card per server
  entity. DOM, visual, reading and focus order remain identical across 2/3/4/6
  density changes.
- At 320px and 200% zoom, fluid tracks and wrapping content preserve the approved
  two-column contract without duplicating or hiding Cards.
- Payment information is one heading, guidance and semantic list with no payment
  selector, amount, CTA, status or transactional interaction.
- The server-selected Category is named by its official public identity and
  links to its canonical route without client randomization or personalization.
- Light semantic and inverse Banner roles retain text/state meaning independent
  of color; no layout behavior depends on hover, fine pointer or animation.

## Rendered implementation evidence

The Chrome DevTools validation in
`scripts/validate-homepage-merchandising-browser.cjs` now passes at 320, 640,
1024 and 1400px. It records exact 2/3/4/6 density, canonical section order,
native list semantics, the accessibility-tree hierarchy, targets of at least
44px, zero horizontal overflow, CLS 0, the deterministic light-only result and
reduced-motion Carousel behavior. A 700px effective CSS viewport confirms the
1400px-at-200% reflow with three columns and no overflow.

This completes the Accessibility Review portion of HML-023. Independent QA
confirmation is recorded in `qa-review.md`; release ownership remains outside
this approval.
