# Governed Icon System — Design Contract

Status: Complete — Released

Owner: Design System Architect

## Public API

The shared component SHALL expose a closed API equivalent to:

```ts
type IconName =
  | "search"
  | "menu"
  | "close"
  | "back"
  | "forward"
  | "previous"
  | "next"
  | "external-link"
  | "contact"
  | "information"
  | "success"
  | "warning"
  | "error"
  | "image-unavailable"
  | "payment-information"
  | "tag"
  | "location";

type IconProps = {
  name: IconName;
  size?: "sm" | "md" | "lg";
  decorative?: boolean;
  label?: string;
  className?: string;
};
```

Exact React implementation remains Frontend-owned. `decorative` defaults to
`true`. An informative icon requires a non-empty `label`. TypeScript should model
these as a discriminated union so `decorative={false}` cannot omit `label`.

## Registry strategy

The semantic registry owns the only permitted Lucide mapping. Initial library
glyph choices are implementation details and SHALL NOT leak through `IconName`.
Aliases must reflect stable intent, not page, Product, payment-provider, or library
glyph names.

| Context | Approved semantic names | Boundary |
| --- | --- | --- |
| Search | `search`, `close` | Text label/query meaning remains authoritative |
| Navigation | `menu`, `close`, `back`, `forward`, `previous`, `next`, `external-link` | Icon-only controls still require an accessible control name |
| Contact | `contact`, `external-link` | Does not imply a specific provider unless text does |
| Payment information | `payment-information`, `information` | One supporting section cue only; no per-method logo or inferred support |
| Feedback | `information`, `success`, `warning`, `error` | Icon does not replace message text or status semantics |
| Media/metadata | `image-unavailable`, `tag`, `location` | Decorative unless it contributes approved unique text meaning |

Adding a name requires Design System review of meaning, reuse, collision, glyph,
and accessibility. Features cannot pass arbitrary SVG data, Lucide components, or
unregistered string names through the shared `Icon` API.

## Visual rules

- `sm`: 16px; `md`: 20px default; `lg`: 24px.
- Default stroke: 2 CSS pixels with round caps and joins; use outline glyphs.
- Fill remains `none` unless the registry explicitly documents a status glyph.
- Color inherits `currentColor`; consumers use semantic foreground, muted, status,
  primary, or inverse roles. Raw colors and feature palettes are prohibited.
- Icons align to the text baseline through a non-shrinking inline-flex wrapper.
- The icon must remain legible at 200% zoom and never force label truncation.
- Responsive changes may select a semantic size, but may not change meaning.

## Accessibility and interaction

- Decorative: SVG is hidden from the accessibility tree and cannot create a
  duplicate accessible name.
- Informative: SVG exposes the provided textual equivalent without duplicating
  adjacent visible text.
- An icon inside a labelled control is normally decorative; the parent control
  owns name, focus, keyboard behavior, disabled state, and target.
- An icon is never independently focusable.
- Interactive controls retain the shared visible-focus contract and a minimum
  44 by 44 CSS-pixel target; enlarging the glyph is not a substitute for the
  target.
- Required meaning uses text or an accessible control/message label. Color,
  direction, or glyph shape alone is insufficient.

## Compatibility and migration

1. Inventory current inline SVGs and icon-bearing component slots.
2. Replace exact approved meanings with semantic `Icon` names.
3. Preserve existing visible labels and component APIs during adoption.
4. Retain arbitrary `ReactNode` icon slots until every consumer is migrated; any
   removal requires a separate deprecation change.
5. Reject migrations where no approved semantic name exists; request registry
   review instead of importing Lucide directly in feature code.
