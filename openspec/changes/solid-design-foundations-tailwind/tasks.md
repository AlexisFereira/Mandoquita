# Tasks: Solid Design Foundations with Tailwind

Status: Superseded — Closed by focused Platform contracts and remediation packages.

The unchecked items below are retained as historical planning and are not active backlog. Active light-only, component API, frontend cleanup, validation, and documentation work is tracked in `openspec/platform/design-system/`.

## 1. Design Tokens Foundation

- [x] 1.1 Create complete color palette for light mode in `src/design-system/tokens.ts` (primary, secondary, success, danger, warning, info, neutral)
- [x] 1.2 Create complete color palette for dark mode in `src/design-system/tokens.ts`
- [x] 1.3 Define spacing scale (xs, sm, md, lg, xl, 2xl) based on 4px grid in tokens
- [x] 1.4 Define typography scale (heading, body, caption) with size, weight, line-height in tokens
- [x] 1.5 Define shadow tokens (sm, md, lg) for elevation in tokens
- [x] 1.6 Define border radius tokens in tokens
- [x] 1.7 Export DESIGN_TOKENS constant with TypeScript interface for autocomplete
- [x] 1.8 Create tests for DESIGN_TOKENS export and structure

## 2. Theme System Setup

- [x] 2.1 Create `src/design-system/theme.ts` with light and dark color palettes
- [x] 2.2 Generate CSS variables from theme object (--color-primary, --spacing-md, etc.)
- [x] 2.3 Create `src/styles/theme.css` with `:root` and `@media (prefers-color-scheme: dark)` rules
- [x] 2.4 Update `pages/_app.tsx` to inject theme CSS before React hydration
- [x] 2.5 Create `ThemeContext` and `useTheme()` hook in `src/design-system/theme.ts`
- [x] 2.6 Add theme provider to `pages/_app.tsx` that wraps all pages
- [x] 2.7 Implement localStorage persistence for theme preference (light/dark/system)
- [x] 2.8 Test theme switching (system preference and manual toggle)

## 3. Component Library - Button

- [ ] 3.1 Create `src/components/Button.tsx` with TypeScript interface
- [ ] 3.2 Implement Button variants (primary, secondary, danger, ghost) using design tokens
- [ ] 3.3 Implement Button sizes (sm, md, lg) with spacing tokens
- [ ] 3.4 Add disabled state styling to Button
- [ ] 3.5 Add focus ring styling using design token shadow
- [ ] 3.6 Add hover/active state transitions using design tokens
- [ ] 3.7 Add keyboard event handlers (Enter, Space) to Button
- [ ] 3.8 Write component tests for Button (variants, sizes, disabled, keyboard)
- [ ] 3.9 Add JSDoc comments with usage examples to Button

## 4. Component Library - Card

- [ ] 4.1 Create `src/components/Card.tsx` with TypeScript interface
- [ ] 4.2 Implement Card padding using design token (md)
- [ ] 4.3 Implement Card elevation prop (none, sm, md, lg) with shadow tokens
- [ ] 4.4 Add background color using design token (surface)
- [ ] 4.5 Add className prop for customization
- [ ] 4.6 Write component tests for Card (elevation levels, className)
- [ ] 4.7 Add JSDoc comments with usage examples to Card

## 5. Component Library - Input

- [ ] 5.1 Create `src/components/Input.tsx` with TypeScript interface
- [ ] 5.2 Implement Input sizes (sm, md, lg) with spacing tokens
- [ ] 5.3 Implement validation states (default, success, error) using semantic color tokens
- [ ] 5.4 Add focus ring styling using design tokens
- [ ] 5.5 Add error border color (danger token)
- [ ] 5.6 Add placeholder styling consistent with design system
- [ ] 5.7 Write component tests for Input (sizes, validation states, focus)
- [ ] 5.8 Add JSDoc comments with usage examples to Input

## 6. Component Library - Badge & Utility Components

- [ ] 6.1 Create `src/components/Badge.tsx` for semantic labels
- [ ] 6.2 Implement Badge variants (primary, secondary, success, danger, warning, info)
- [ ] 6.3 Implement Badge sizes (sm, md) with spacing tokens
- [ ] 6.4 Add contrast ratio validation (test all variant combinations)
- [ ] 6.5 Create `src/components/Pill.tsx` for rounded tag-like elements
- [ ] 6.6 Write component tests for Badge and Pill
- [ ] 6.7 Add JSDoc comments with usage examples to Badge/Pill

## 7. Tailwind Config Integration

- [ ] 7.1 Update `tailwind.config.ts` to reference CSS variables in extends
- [ ] 7.2 Map Tailwind color utilities to CSS variables (e.g., `bg-primary: var(--color-primary)`)
- [ ] 7.3 Map Tailwind spacing to design token scale
- [ ] 7.4 Map Tailwind typography utilities to design tokens
- [ ] 7.5 Map Tailwind shadow utilities to design tokens
- [ ] 7.6 Test that Tailwind classes work with CSS variables (e.g., `className="bg-primary"`)

## 8. Documentation - Token & Integration Guides

- [ ] 8.1 Create `src/design-system/DESIGN_TOKENS.md` with all tokens and values
- [ ] 8.2 Add color palette visualization to DESIGN_TOKENS.md
- [ ] 8.3 Document spacing scale and usage examples in DESIGN_TOKENS.md
- [ ] 8.4 Document typography scale and usage in DESIGN_TOKENS.md
- [ ] 8.5 Create `src/design-system/INTEGRATION_GUIDE.md` with step-by-step instructions
- [ ] 8.6 Add code examples for using tokens in components
- [ ] 8.7 Add code examples for using Button, Card, Input components
- [ ] 8.8 Create `src/design-system/DECISIONS.md` documenting design rationale
- [ ] 8.9 Add troubleshooting section to INTEGRATION_GUIDE.md
- [ ] 8.10 Create `src/design-system/CHANGELOG.md` for tracking design system updates

## 9. Light/Dark Theme Testing

- [ ] 9.1 Test theme switching in browser DevTools (simulate dark mode)
- [ ] 9.2 Verify CSS variables update correctly on theme switch
- [ ] 9.3 Test all components in both light and dark themes
- [ ] 9.4 Verify localStorage persistence (close and reopen browser)
- [ ] 9.5 Test contrast ratios in both themes (use aXe or similar tool)
- [ ] 9.6 Test keyboard navigation in both themes
- [ ] 9.7 Verify no layout shift or flash on theme toggle

## 10. Carousel Integration with Design System

- [ ] 10.1 Update `src/components/Carousel.tsx` to use Button component for controls
- [ ] 10.2 Replace overlay gradient hex colors with design token CSS variables
- [ ] 10.3 Replace control padding with spacing tokens
- [ ] 10.4 Update indicator styling to use Badge component
- [ ] 10.5 Test carousel in light and dark themes
- [ ] 10.6 Verify carousel respects new design token colors

## 11. Homepage Update

- [ ] 11.1 Update `pages/index.tsx` to use new Card component where applicable
- [ ] 11.2 Replace inline styles with design token spacing
- [ ] 11.3 Test homepage layout with new design system
- [ ] 11.4 Verify no visual regressions from carousel updates

## 12. Component Stories & Examples

- [ ] 12.1 Create `/docs/COMPONENT_EXAMPLES.md` with visual examples
- [ ] 12.2 Add Button variant examples (all variants and sizes)
- [ ] 12.3 Add Card elevation examples
- [ ] 12.4 Add Input validation state examples
- [ ] 12.5 Add Badge semantic color examples
- [ ] 12.6 Include copy-paste code snippets for each example

## 13. Full Test Suite

- [ ] 13.1 Run full test suite with new component tests
- [ ] 13.2 Verify all existing tests still pass
- [ ] 13.3 Add E2E test for theme switching
- [ ] 13.4 Add E2E test for component rendering with design tokens
- [ ] 13.5 Verify 100% component test coverage for library components

## 14. Design System Validation

- [ ] 14.1 Run contrast checker on all semantic color combinations
- [ ] 14.2 Verify responsive design in mobile, tablet, desktop viewports
- [ ] 14.3 Validate all design tokens are used (no hardcoded hex values in new components)
- [ ] 14.4 Validate CSS variables cascade correctly to nested components
- [ ] 14.5 Verify TypeScript types are correct across all components

## 15. Final Validation & Cleanup

- [ ] 15.1 Run full test suite one final time
- [ ] 15.2 Update `README.md` with design system documentation links
- [ ] 15.3 Remove any deprecated inline style patterns from new components
- [ ] 15.4 Verify all components export TypeScript interfaces
- [ ] 15.5 Create migration plan document for converting old components
