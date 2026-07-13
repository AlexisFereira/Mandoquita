# Featured Products Backend Review

Status: Approved

Owner: Backend Architect

## Approved Traceability

The implementation is aligned with the formally approved Featured Product
Curation capability and Homepage requirements:

- Eligibility: `active = true`, `published = true`, and `featured = true`.
- Category eligibility: active and visible.
- Ranked order: `featuredOrder ASC`, with null priorities last.
- Deterministic ties: `createdAt DESC`, then `id ASC`.
- Homepage retrieval maximum: eight.
- Homepage presentation maximum: eight on Desktop and four on Tablet/Mobile.
- Featured designation remains independent from discounts, promotions, paid
  placement, and commercial availability.

`published` is included because all visitor-facing Products must be public.
`active` remains an additional Featured Curation eligibility rule required by
BR-FPC-001; it is not restored as the general catalog visibility authority.

## Commercial Availability Representation

The backend currently keeps a published Featured Product eligible when
`commerciallyAvailable = false`, consistent with BR-FPC-005. Its persisted
price is retained internally, while public `price` and `currency` are returned
as `null` so an expired offer is not represented as current.

This representation is formally approved by Product Requirements and the
Project Architect. See `commercial-availability-approval.md`.

## Backend Decision

Eligibility, limit, ordering, and the public commercial-availability contract
are approved from the Backend Architecture perspective and trace to formally
approved requirements. The backend returns a deterministic `null` price and
currency outcome; presentation consumers must render the approved explicit
no-current-offer message rather than blank commercial content.
