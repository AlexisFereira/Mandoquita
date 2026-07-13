# Homepage Frontend Component Contracts

Status: Implemented

Owner: React Frontend Architect

## Header

`Header` renders the approved Mandoquita logo, Spanish discovery navigation,
sticky positioning, and an accessible mobile menu. The public component has no
props. Its destinations are limited to `/`, `/#destacados`, `/#categorias`, and
`/#contacto`. Logo loading failure falls back to the textual business name.

## Carousel

`Carousel` accepts a `slides` array. Each slide requires `title` and may include
`description`, `imageUrl`, and an action with `label` and `href`. An empty array
renders nothing; one slide renders statically without navigation controls.
Multiple slides autoplay every six seconds, pause on hover or focus, and disable
autoplay and transitions when reduced motion is requested. The first image is
prioritized; subsequent images are lazy loaded.

## ProductCard

`ProductCard` accepts a strongly typed `ProductItem`. The optional `featured`
flag is retained for API compatibility but does not create a second visual
hierarchy. The complete card exposes one product-detail link. Product media has
a stable 4:3 ratio, responsive sizing metadata, lazy loading, and an intentional
fallback image.

The homepage renders ProductCard density before creating card nodes: a maximum
of four below 1280 CSS pixels and a maximum of eight at wider desktop widths.
The compact subset is the server-safe snapshot, so mobile and tablet focus order
never includes hidden duplicate product cards.

## CategoryCard

`CategoryCard` requires `title` and `href`. It optionally accepts `description`,
`imageUrl`, `count`, `compact`, and `className`. The whole card is one category
destination. Media uses a category-specific stable ratio, responsive sizing
metadata, lazy loading, and an intentional fallback.

## Footer

`Footer` has no props. It provides low-priority reorientation using only valid
homepage destinations. It must not expose shipping, checkout, cart, payment, or
other transactional paths.

## Responsive and Accessibility Guarantees

- Interactive navigation remains keyboard focusable with visible focus styles.
- Carousel controls provide at least 44 by 44 CSS pixels of target area.
- Section anchors include sticky-header scroll offset.
- Homepage media reserves dimensions and stable aspect ratios before loading.
- Below-the-fold product and category media is lazy loaded.
- Featured density is four cards on mobile/tablet and up to eight on desktop.
- Semantic landmarks and one coherent heading hierarchy are preserved.
