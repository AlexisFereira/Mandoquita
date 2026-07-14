# Homepage Merchandising Layout V2 — Frontend Implementation

Status: HML-015–HML-020 Complete — Feature Release Approved

Owner: React Frontend Architect

Date: 2026-07-14

## Delivered

- The former separate Hero is removed. The released promotional Carousel is the
  full-width first region with stable responsive height, decorative media,
  semantic copy/actions and unchanged six-second/reduced-motion behavior.
- Surviving regions render once in canonical order: Banner, Categories,
  Featured, Payment, server-selected Category, Contact and Footer.
- Categories, Featured and selected-Category Products use `Container size="wide"`
  and one `CollectionGrid` list with exact 2/3/4/6 responsive density.
- Payment is an informational Banner containing exactly Binance, Pago móvil and
  Dólares en efectivo. It has no payment/contact control or transactional state.
- The daily Category section consumes the server projection unchanged, renders a
  maximum of six canonical Products and links to the canonical Category. Missing
  or empty projections omit the complete region.
- Contact remains the single external inquiry region after merchandising.

## Evidence

Homepage, Carousel, Platform layout and Backend rotation tests cover exact order,
wide API, grid density/source order, Featured limits, uncapped Categories,
selected projection/omission, canonical continuation, payment meaning, Carousel
zero/one/multiple behavior and deterministic server rotation.
