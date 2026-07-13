# Design System Integration Guide

## 1. Import shared components

Import from the component barrel when working inside the application:

```tsx
import { Button, Card, Input } from "../src/components";
```

Use the relative path appropriate to the consuming file. Do not create a feature-local duplicate of a shared component.

## 2. Use semantic styling

Theme-aware colors use semantic channel variables:

```tsx
<section className="bg-[rgb(var(--surface)/1)] text-[rgb(var(--foreground)/1)]">
  <p className="text-[rgb(var(--muted)/1)]">Supporting text</p>
</section>
```

Do not add hexadecimal colors or new `--color-*` aliases. The channel family described in `homepage-visual-foundations.md` is authoritative for the ongoing consolidation.

## 3. Use typed tokens outside CSS utilities

Use the TypeScript export for calculated values, tooling, and non-CSS consumers:

```ts
import { DESIGN_TOKENS } from "./tokens";

const desktopContainer = DESIGN_TOKENS.layout.containers.xl;
```

Static component styling should use semantic CSS variables or mapped Tailwind utilities, not inline token objects.

## 4. Compose components

```tsx
import { Button, Card, Input } from "../components";

export function ContactExample() {
  return (
    <Card as="section" elevation="none" padding="lg">
      <Input
        label="Producto"
        helperText="Escribe el producto que te interesa."
        size="md"
      />
      <Button variant="primary" size="md">
        Solicitar información
      </Button>
    </Card>
  );
}
```

Prefer composition and the documented props. A `className` extension must not redefine the component's semantic color, accessibility, or state contract.

## 5. Fixed application theme

The application has no theme provider, selector, toggle, stored preference, or system-theme behavior. Components consume the single light semantic palette directly. Continue using semantic variables so components remain consistent, and never introduce `dark:`, `.dark`, a system color-scheme listener, or a feature-local palette.

## 6. Gallery and option controls

- Existing `<Carousel slides={slides} />` remains promotional and compatible.
- Use `<Carousel mode="gallery" items={items} />` for ordered, non-autoplay media inspection.
- A controlled gallery receives `activeItemId`; manual gallery navigation reports through `onActiveItemChange` but never changes domain selection itself.
- Existing presentational and `removable` Chip modes remain compatible.
- Compose `<Chip mode="option">` inside a labelled `fieldset`/`legend` or equivalent radiogroup. The parent owns the selected value and valid-combination resolution.
- Use `PoliteStatus` for concise state changes that must not move keyboard focus.

Never put Product IDs, Variant rules, inventory, pricing, taxonomy, or commercial logic inside these Platform components.

## Best practices

- Use one official concept name.
- Use semantic roles instead of palette values.
- Use the 4-pixel spacing scale.
- Keep visible focus and keyboard behavior intact.
- Test missing optional content and media failures.
- Respect reduced-motion preferences.
- Add shared patterns to the platform only after review.

## Common mistakes

- Hardcoding a hex value in JSX.
- Using `--color-*` legacy aliases in new work.
- Adding arbitrary spacing, radius, shadow, or duration values.
- Using a primitive palette step as a component contract.
- Removing compatibility aliases before all consumers are migrated.
- Importing deprecated theme-selection APIs.

## Performance

- Prefer CSS variables for semantic visual changes; they do not require React rerenders.
- Keep runtime inline styles for genuinely calculated values only.
- Avoid duplicating large class strings across feature components.
- Load only critical media eagerly and preserve media aspect ratio.

## Troubleshooting

### Colors do not match the light contract

Confirm the component uses `rgb(var(--semantic-token) / alpha)`. Check whether a hardcoded color, local override, legacy alias, or stale dark selector overrides it.

### CSS variables are missing

Confirm both global stylesheets are loaded by `pages/_app.tsx`. During consolidation, verify that the eventual single owner still declares every required semantic role.

### A component ignores tokens

Search the component for hexadecimal, `rgb(...)`, `rgba(...)`, arbitrary Tailwind values, and static inline styles. Replace only after checking the component contract and migration plan.

### A dark presentation appears

This is a contract violation. Check for `.dark`, `dark:`, `prefers-color-scheme`, stored theme state, or a local palette. The application must always use the light root palette.

### Focus is difficult to see

Do not create a local translucent ring. Use the shared focus token after task 3.9 of the homepage refresh is implemented and verify 3:1 contrast against adjacent surfaces.
