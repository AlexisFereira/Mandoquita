# Merchandising Layout Contract — Design

Status: Complete — Platform Release Approved

Owner: Design System Architect

Date: 2026-07-13

Current public-catalog usage is governed by
`../public-catalog-visual-contract.md`. This document remains authoritative for
the reusable `Container` and `CollectionGrid` primitives; older feature
composition examples do not override the current visual contract.

## Container extension

Add `wide: 1400` to the shared container layout token and `wide` to
`ContainerSize`. `Container size="wide"` resolves to a centered maximum width of
1400 CSS pixels and retains the component's existing padding and centering API.

Compatibility is mandatory at component API level:

- the default remains `size="lg"`;
- `sm`, `md`, `lg` and `xl` retain their current values;
- public catalog consumers migrate explicitly under the current canonical
  visual contract; unrelated consumers are not migrated implicitly; and
- the existing global/Tailwind `xl` or `2xl` breakpoint names are not redefined.

`wide` is a content boundary, not a viewport breakpoint. The collection contract
below owns its explicit 1400px density transition.

## CollectionGrid

Add a domain-neutral `CollectionGrid` component for ordered Card collections.
Its minimal public API is:

```ts
type CollectionGridProps<T extends React.ElementType = "div"> =
  React.PropsWithChildren<{
    as?: T;
    className?: string;
  }> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;
```

The component owns layout only. It does not inspect, limit, sort, hide or clone
children and does not know Product, Category or Featured meaning.

### Density

| Viewport width | Columns |
| --- | ---: |
| below 640px | 2 |
| 640–1023px | 3 |
| 1024–1399px | 4 |
| 1400px and above | 6 |

- Use one DOM collection in source/business order.
- Gaps use shared spacing: 16px at the narrow range and 24px from 640px upward.
- Children use fluid tracks (`minmax(0, 1fr)`) so long content cannot force
  page-level horizontal overflow.
- Fewer children create no placeholders and are not stretched into invented
  entities.
- Consumers apply list semantics when the content is a list; the layout
  component does not manufacture semantics that conflict with `as`.
- No responsive child hiding, duplication, reordering or masonry behavior is
  permitted.

The exact two-column 320px requirement takes precedence over an assumed Card
minimum width. Cards must wrap text and media safely inside their assigned track.

## Full-bleed promotional Carousel composition

The released promotional `Carousel` is sufficient and receives no API change.
A Banner Slider consumer composes it outside `Container`, so its media/background
spans the viewport. Meaningful slide content remains real HTML inside the slide
and may be aligned to the `wide` content boundary by an internal wrapper.

- Zero valid slides omit the complete Banner region.
- One valid slide is static and renders no controls.
- Multiple valid slides retain the released six-second interval, pause on hover
  and focus, manual controls and reduced-motion behavior.
- Reserve responsive heights of 200/250/300/350/400px at
  base/640/768/1024/1280 before loading. `object-cover` crop is allowed only for
  decorative imagery with focal-safe margins.
- Multiple slides transition by opacity fade only; horizontal track movement is
  not allowed.
- Titles, descriptions, logos containing required meaning and actions must not
  be baked into pixels or placed in crop-risk zones.
- Overlay contrast uses inverse semantic roles and the existing gradient; text
  remains readable over missing, loading and failed Image outcomes.
- The first justified Image may load eagerly; later slide Images remain deferred.
- Controls stay inside safe viewport gutters, retain 44px targets and never cover
  the primary action or essential copy.

The former separate Hero is a feature composition concern and is not recreated
by Platform.

## Theme and accessibility

- The contracts consume only the deterministic light theme. Header/navigation
  stay light; semantic inverse roles are limited to bounded contrast overlays.
- Focus order follows DOM order; responsive changes never move focus.
- At 320 CSS pixels and 200% zoom, Cards, Banner content and controls reflow
  without page-level horizontal overflow.
- Carousel motion remains absent under reduced motion. Grid/Container changes
  introduce no entry animation.
