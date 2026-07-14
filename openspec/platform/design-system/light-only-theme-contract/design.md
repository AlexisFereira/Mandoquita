# Feature Design

Status: Approved

Finalized: 2026-07-12

> **Public catalog amendment (2026-07-14):**
> `../public-catalog-visual-contract.md` governs surface assignment. Header,
> mobile navigation and Footer now use light standard surfaces; inverse roles
> remain available only for bounded contrast regions such as overlays or
> Contact.

## Overview

The platform exposes one deterministic light theme. Semantic tokens remain the styling interface, but they resolve to a single palette. Theme selection is no longer an interaction or user preference.

## User Flow

1. The document loads with the light palette.
2. The application hydrates without changing theme state or semantic values.
3. Operating-system preference changes have no effect on application presentation.
4. Navigation between pages preserves the same light visual language.

## Information Architecture

Theme controls are absent because no theme selection exists. This change does not alter page information architecture.

## Navigation

No navigation changes.

## Page Structure

- `:root` owns the complete supported semantic palette.
- `color-scheme` remains `light`.
- No `.dark` palette is shipped as an active application contract.
- Components continue consuming semantic roles.
- Header, mobile navigation and Footer use light standard surfaces. Bounded
  inverse regions such as contact or media overlays remain component roles, not
  dark mode.

## Interaction Flow

There is no theme toggle, stored preference, or system-theme listener.

If the existing theme context has no remaining non-test consumers, remove it. If a temporary compatibility export is required, it must expose a read-only light result, be deprecated, have no toggle behavior, and include a removal milestone.

## Empty States

Not applicable.

## Error States

- A stale browser `theme-preference` value must not change rendering.
- A system dark preference must not change rendering.
- Missing JavaScript must still produce the approved light presentation.

## Success States

- First paint and hydrated output use identical light semantic values.
- All pages and shared components remain visually coherent.
- Inverse surfaces preserve approved contrast without being interpreted as dark mode.

## Responsive Behavior

Theme behavior remains identical at all viewport sizes. Existing responsive component contracts remain unchanged.

## Accessibility Notes

- Light-mode semantic pairs must satisfy WCAG AA.
- Browser form controls should render with the light color scheme.
- Removing dark mode does not weaken focus, reduced-motion, keyboard, semantic, or touch-target requirements.
- Validation no longer needs dark-mode matrices, but inverse-surface states remain mandatory.

## Dependencies

- Active semantic token family.
- Shared focus and inverse-surface contracts.
- Consumer audit for `ThemeProvider`, `useTheme`, theme preference types, `.dark`, `dark:`, localStorage key, and system color-scheme queries.
