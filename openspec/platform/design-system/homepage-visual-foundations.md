# Homepage Visual Foundations

Version: 1.1

Status: Active

Owner: Design System Architect

Applies To: Homepage visual refresh and shared components consumed by the homepage

Canonical companion: `public-catalog-visual-contract.md`. If this audit history
or migration guidance conflicts with that contract, the public catalog contract
takes precedence.

---

# Purpose

This document defines the authoritative visual foundation for the homepage refresh.

It resolves the token, theme, typography, surface, focus, and motion decisions required before frontend migration. It does not prescribe React structure or contain CSS or Tailwind implementation.

The homepage consumes this platform contract. It must not create a parallel feature-specific theme.

---

# Audit Summary

The current homepage consumes two conflicting token families.

## Theme-aware channel family

Defined primarily in `src/styles/theme.css` and partially in `styles/globals.css`:

- `--background`
- `--surface`
- `--foreground`
- `--muted`
- `--border`
- `--primary`
- `--primary-foreground`

This family is compatible with alpha composition through `rgb(var(--token) / <alpha-value>)` and is already consumed by the current homepage components and Tailwind semantic utilities.

## Legacy hex family

Defined in `styles/globals.css`:

- `--color-bg`
- `--color-surface`
- `--color-surface-muted`
- `--color-border`
- `--color-text`
- `--color-text-muted`
- `--color-brand`
- `--color-brand-strong`
- `--color-brand-soft`
- `--color-accent`
- `--color-accent-soft`
- `--color-success`
- `--color-warning`
- `--color-danger`

The names `--color-surface` and `--color-border` are also emitted by the runtime theme system with different values. Their ownership is therefore ambiguous.

## Shared foundation tokens currently consumed

- Spacing: `--space-3`, `--space-4`, `--space-6`
- Radii: `--radius-sm`, `--radius-md`, `--radius-lg`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Typography: `--font-sans`, `--font-display`, `--line-height-body`, `--line-height-tight`
- Layout: `--container-lg`

## Conflicting declarations

The audit confirms:

- `:root` is declared independently in both global stylesheets.
- `body` background and color are declared independently in both global stylesheets.
- `.ds-surface` and `.ds-card` are declared independently in both global stylesheets.
- `theme.css` contains both a class-based dark theme and an additional system media-query override.
- the runtime theme system writes both channel tokens and duplicate `--color-*` hex aliases.
- Tailwind hardcodes brand scales, radii, shadows, fonts, and durations instead of resolving every semantic value from the authoritative variables.

## Homepage hardcoded-value exceptions to migrate

Static visual values remain in:

- Header background, borders, focus treatment, height, and stacking level.
- Contact surface, text, radius, focus treatment, and spacing.
- Button colors, borders, shadows, radii, movement, and durations.
- Badge foreground and translucent background colors.
- Carousel overlays, indicators, controls, dimensions, radii, spacing, and transition durations.
- the browser `theme-color` metadata.

Calculated carousel track widths and transforms are runtime layout values and may remain inline.

---

# Authoritative Token Model

The channel-based semantic family is the single source of truth for theme-aware colors.

## Required semantic color roles

| Token | Purpose |
| --- | --- |
| `--background` | Page canvas and low-emphasis media fallback |
| `--surface` | Standard content surface |
| `--surface-muted` | Subtle section separation |
| `--foreground` | Primary text and icons |
| `--muted` | Secondary text |
| `--border` | Structural borders and dividers |
| `--primary` | Brand action and emphasis |
| `--primary-hover` | Brand action hover state |
| `--primary-foreground` | Content placed on the primary color |
| `--accent` | Secondary semantic emphasis |
| `--success` | Successful status communication |
| `--warning` | Warning status communication |
| `--danger` | Destructive or error communication |
| `--focus` | Universal focus indicator |
| `--inverse-surface` | Persistent high-contrast brand surface |
| `--inverse-foreground` | Primary content on inverse surfaces |
| `--inverse-muted` | Secondary content on inverse surfaces |
| `--inverse-border` | Structural cue on inverse surfaces |

All color roles use space-separated RGB channels so opacity variants do not require new color literals.

Legacy `--color-*` aliases are deprecated. They must not be introduced in new or migrated homepage code. Removal may occur only after a repository-wide consumer audit.

## Color direction

The palette remains warm and restrained:

- warm off-white canvas;
- white or near-white standard surfaces;
- near-black warm foreground;
- terracotta primary brand color;
- teal accent reserved for secondary emphasis and information;
- semantic green, amber, and red reserved for status meaning;
- dark brown inverse roles for local media overlays, contact, and other
  deliberately bounded high-contrast regions; Header remains a light surface.

Products and their imagery remain more visually prominent than decorative color.

---

# Theme Decision

The platform and Homepage support one deterministic light theme.

The approved light semantic palette applies from first paint through hydration and shall not change because of operating-system preference, stored browser state, or user controls.

No dark palette, theme selector, system-theme listener, or partial dark-mode override belongs to the active contract.

Header and mobile navigation use the light surface roles. Deliberately bounded
contact or media-overlay regions may use inverse semantic roles for contrast;
they do not constitute dark mode.

---

# Typography

Typography uses deterministic local system fallbacks for this release. No remote font request is required.

## Body family

`Inter`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`

## Heading family

`Manrope`, `Inter`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`

If Manrope and Inter are not locally available, the chain must degrade predictably without changing the intended sans-serif character of the product.

Georgia and other serif fallbacks are not part of the refreshed homepage language.

Typography roles must define font family, size, line height, weight, and tracking together. Arbitrary letter-spacing and font-size values must be replaced by named roles during implementation.

---

# Spacing and Layout

The existing 4 CSS-pixel base grid remains authoritative.

The shared spacing scale must cover 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64 CSS pixels. Components consume named scale steps; features do not add isolated spacing values.

Homepage layout follows these rules:

- full-width section surface;
- exactly one centered internal container per section;
- compact mobile gutters and progressively larger tablet and desktop gutters;
- section rhythm based on the shared 32, 48, and 64 CSS-pixel steps;
- grid gaps based on the shared 16, 24, and 32 CSS-pixel steps;
- no viewport width may introduce horizontal overflow.

The V1 default Homepage maximum of 1280 CSS pixels is historical. Current public
Header, Footer, Homepage sections, Category, Subcategory, Search and Product
Detail use `Container size="wide"`: a centered 1400 CSS-pixel maximum with the
shared large gutter. Full-bleed media may span the viewport while meaningful
content stays aligned to this boundary. Readable text blocks remain narrower
through composition rather than a second nested page container.

---

# Radius, Border, and Elevation

## Radius roles

- Small: compact controls and small media.
- Medium: standard cards and media frames.
- Large: hero media and high-emphasis section surfaces.
- Full: buttons, indicators, and intentionally circular controls only.

Pill radius is not a default container treatment.

## Border rules

- Use borders to communicate structure, boundaries, or interaction.
- Do not place a border around every content group.
- Section dividers use the semantic border role at restrained contrast.
- Borders on inverse surfaces use the inverse-border role.

## Elevation rules

- None: default for sections, Header, Footer, contact surfaces, and static product/category cards.
- Small: interactive separation only when a border or surface change is insufficient.
- Medium: temporary overlays or elevated navigation only.
- Large: reserved for modal or floating overlay patterns and not used by the homepage.

Featured products must not use translation or elevation to imply promotion.

---

# Interaction and Focus

All interactive components share one focus-visible contract:

- the indicator uses `--focus`;
- it is visible on both standard and inverse surfaces;
- it does not depend on hover;
- it is not clipped by card or media overflow;
- it meets a minimum 3:1 contrast against adjacent colors;
- component-specific white rings are replaced by the semantic focus and offset roles.

Interactive targets are at least 44 by 44 CSS pixels where applicable.

Hover may add a subtle color, underline, or maximum 2 CSS-pixel translation. Hover never becomes the only interaction cue.

Disabled states use semantic opacity and preserve readable labels. Disabled controls must not retain hover movement.

---

# Motion

Motion is restrained and purposeful.

The shared duration roles are:

- Fast: 150 milliseconds for color, underline, and focus-adjacent feedback.
- Standard: 220 milliseconds for opacity and small transforms.
- Slow: 320 milliseconds for carousel opacity-fade transitions.

The default easing is a standard ease-out curve. Decorative entrance animation is not required for the homepage.

When `prefers-reduced-motion: reduce` is active:

- carousel autoplay is disabled;
- carousel and image-opacity transitions are disabled;
- hover translation and image scaling are disabled;
- smooth scrolling becomes immediate;
- content remains available without animation.

---

# Tailwind Mapping Contract

Tailwind semantic utilities must resolve to the authoritative CSS variables.

Required semantic mappings include:

- colors: background, surface, surface-muted, foreground, muted, border, primary, primary-hover, primary-foreground, accent, success, warning, danger, focus, inverse-surface, inverse-foreground, inverse-muted, inverse-border;
- font families: heading and body;
- radii: small, medium, large, and full;
- shadows: none, small, medium, and large;
- transition durations: fast, standard, and slow;
- container widths and gutters;
- the shared spacing scale.

The Tailwind configuration must not contain a second independently maintained copy of semantic hex colors, radii, shadows, font stacks, or durations.

Primitive palette scales may remain as implementation-independent references only when a documented semantic role consumes them. Homepage components consume semantic roles, not primitive palette steps.

---

# Component Guidance

## Header

Use the light standard surface, no floating-card elevation, a restrained
divider, the shared 1400px boundary and the shared focus contract. Display the
logo at 50px high with automatic width and preserved aspect ratio; identity may
fall back to plain text.

## Hero and Carousel

The promotional Carousel is full bleed while copy and controls align to the
1400px boundary. It uses fade-only slide changes and responsive heights of
200/250/300/350/400px at base/640/768/1024/1280. Overlays and controls consume
inverse roles. Horizontal track transforms are not part of the active contract.

## ProductCard

Default elevation is none, outer radius is 8px and edge-to-edge media has no
padding. Name, compact commercial/taxonomy information and one detail affordance
establish hierarchy; collection cards omit the product description. Featured
state must not change elevation or position.

## Homepage CategoryLink

Homepage categories are not cards. Use one 100px circular image and a centered
name, with no description or count, in a single 30px-gap rail. Overflow resolves
through the `Ver todas` destination. Rich Category cards remain valid outside
the Homepage rail.

## Contact

Use inverse semantic roles with one primary action. The surface is high contrast but flat. Language communicates assistance rather than purchase completion.

## Footer

Use the standard surface, a restrained divider, and no enclosing floating card.

---

# Migration Order

Frontend implementation must proceed in this order:

1. Establish one authoritative variable declaration and resolved-theme selector.
2. Map Tailwind semantic utilities to the authoritative variables.
3. Migrate global body, surface, card, focus, and reduced-motion rules.
4. Migrate shared Button, Badge, Card, Container, Section, and SectionHeader primitives.
5. Migrate Header, Hero, Carousel, ProductCard, CategoryCard, contact, and Footer.
6. Remove legacy aliases only after confirming no remaining consumers.
7. Verify Homepage and Product Detail in the light theme across standard and inverse surfaces.

This sequence prevents feature components from depending on a temporary third token system.

---

# Acceptance Criteria

The visual foundation is correctly implemented when:

- only one stylesheet owns root semantic token declarations;
- only one rule owns the page body surface and foreground;
- `.ds-surface` and `.ds-card` each have one definition or are replaced by documented component variants;
- the resolved theme controls the entire page without an independent partial override;
- Tailwind semantic utilities resolve to CSS variables;
- homepage components contain no static color, spacing, radius, shadow, or duration literals;
- only genuinely calculated runtime values remain inline; promotional carousel
  track transforms are absent;
- focus-visible treatment is consistent across standard and inverse surfaces;
- reduced-motion behavior covers autoplay, scrolling, transforms, and opacity transitions;
- the public catalog passes deterministic light-theme visual review across
  standard surfaces and any bounded inverse overlays;
- WCAG AA contrast is verified for primary text, muted text, actions, controls, and focus indicators.

---

# Ownership Boundary

This document authorizes and guides implementation but is not itself implementation.

Changes to React components, CSS stylesheets, Tailwind configuration, tests, and application metadata belong to the React Frontend Architect and QA Engineer. Any necessary change to business scope, navigation destinations, content approval, or requirements must be escalated to the Project Architect or Product Requirements Architect.
