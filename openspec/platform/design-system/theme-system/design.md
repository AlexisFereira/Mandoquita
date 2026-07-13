# Design: Solid Design Foundations with Tailwind

Status: Superseded

Superseded By: `../light-only-theme-contract/design.md`

## Context

Currently, the Mandoquita catalog frontend uses inline styles, scattered design decisions, and inconsistent Tailwind class usage. The design system tokens exist in `src/design-system/` but are incomplete—theme colors are defined but not fully utilized, and components mix inline styles with Tailwind. This fragmentation makes visual consistency difficult, slows down feature development (designers/developers must recreate patterns), and creates maintenance burden.

**Current State:**

- `src/design-system/tokens.ts`: Color tokens defined but underutilized
- `src/design-system/theme.ts`: Light/dark theme structure exists but not integrated
- `src/components/`: Mix of inline styles, Tailwind classes, and theme references
- `src/design-system/layout.ts`: Spacing helpers partially defined
- Tailwind config: Minimal customization, no semantic color mapping

**Constraints:**

- Existing Tailwind/Twind setup must be maintained (no major dependency changes)
- Next.js Pages Router (not App Router)
- TypeScript for type safety
- Server-side rendering for catalog pages

## Goals / Non-Goals

**Goals:**

1. Create a centralized, typed token system (colors, spacing, typography, shadows) accessible throughout the app
2. Build reusable component library (Button, Card, Input, Badge, etc.) with consistent styling and TypeScript generics
3. Implement automatic light/dark theme switching with CSS variables
4. Document design patterns, usage examples, and component APIs
5. Establish 4px grid spacing and responsive breakpoint patterns
6. Make it easy for new features to adopt the design system with minimal friction
7. Migrate existing components to use the new system incrementally

**Non-Goals:**

- Completely rewrite every component at once (phased approach)
- Build an exhaustive component library (start with essentials: Button, Card, Input, Badge, Pill, Tag)
- Create a Storybook instance (visual documentation in code comments is sufficient for MVP)
- Support multiple theme formats (CSS-in-JS, Styled Components, etc.)

## Decisions

### 1. **CSS Variable-Based Theme System**

- **Decision**: Use CSS custom properties (variables) for theme colors, not Tailwind's color utilities directly
- **Why**: Enables true runtime theme switching without recompilation; easier to audit all color usage; supports dark mode naturally
- **Alternatives Considered**:
  - Tailwind color utilities only (inflexible for runtime themes)
  - CSS-in-JS solutions (adds dependencies, complexity for Next.js SSR)
- **Implementation**: Define CSS variables in `:root` and media query for `@media (prefers-color-scheme: dark)`, map to Tailwind config via `var()`

### 2. **Typed Token Export from tokens.ts**

- **Decision**: Create a `DESIGN_TOKENS` object exported from `src/design-system/tokens.ts` with full TypeScript definitions
- **Why**: Type-safe access in components; IDE autocomplete for all tokens; compile-time validation
- **Structure**:
  ```typescript
  export const DESIGN_TOKENS = {
    colors: { primary: '#..', secondary: '#..', ... },
    spacing: { xs: '0.25rem', sm: '0.5rem', ... },
    typography: { heading: { size: '2rem', weight: 700 }, ... },
    shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', ... }
  }
  ```

### 3. **Component Library with Tailwind + Inline Styles**

- **Decision**: Use React components that compose Tailwind utility classes + semantic CSS for complex styles
- **Why**: Leverage Tailwind for rapid iteration; components handle complex state styling (hover, focus, disabled)
- **Pattern**: Components accept `className` prop for extending, apply base tokens, export TypeScript interfaces
- **Example**: Button component sets `className="px-4 py-2 bg-primary text-white rounded"` with variants (size, variant) via conditional classes

### 4. **No Breaking Changes to Existing Styling**

- **Decision**: New design system runs parallel to old inline styles; migrate incrementally
- **Why**: Reduces risk, allows team to adopt gradually, avoids large refactoring
- **Plan**: Mark old patterns as "deprecated" in comments; new features use design system from day one

### 5. **4px Grid & Spacing Scale**

- **Decision**: Base unit = 4px; spacing scale: xs(0.25rem), sm(0.5rem), md(1rem), lg(1.5rem), xl(2rem), 2xl(3rem), etc.
- **Why**: Industry standard, ensures visual harmony, matches common mobile/web expectations
- **Implementation**: Tailwind spacing extended with custom scale

### 6. **Semantic Color Naming**

- **Decision**: Use semantic names (primary, secondary, success, danger, warning, info) mapped to hex values
- **Why**: Intent-based naming is clearer for developers; easier to change palettes without touching component code
- **Mapping**: primary → brand color, secondary → accent, success → green, danger → red, etc.

## Risks / Trade-offs

| Risk                                                                                    | Mitigation                                                                                                   |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Parallel Systems**: Old inline styles + new design system coexist, creating confusion | Mark old patterns clearly; enforce new system in code review; prioritize migration of high-impact components |
| **Theme Switch Performance**: CSS variable switching could cause layout shift           | Test with DevTools throttling; ensure variables are applied at `:root` level before paint                    |
| **Incomplete Token Definitions**: Missing tokens as features are added                  | Create template for token addition; document the process; include token audits in PR reviews                 |
| **Component API Complexity**: Too many props/variants could make components hard to use | Keep components simple; follow React patterns; provide clear examples in JSDoc                               |
| **TypeScript Maintenance**: Keeping type definitions in sync with implementation        | Use `const` assertions to generate types automatically where possible                                        |

## Migration Plan

**Phase 1 (Week 1-2):**

1. Define complete token set (`tokens.ts`, `theme.ts`)
2. Create core component library (Button, Card, Input, Badge)
3. Update Tailwind config to use CSS variables

**Phase 2 (Week 3-4):**

1. Migrate homepage (Header, Carousel, ProductCard) to new system
2. Update product detail page components
3. Deprecate old inline style patterns in codebase

**Phase 3 (Week 5+):**

1. Migrate remaining pages and API endpoints
2. Document component usage in comments
3. Establish design system guidelines for new features

**Rollback Strategy:**

- All old styles remain in place; new system is additive
- If CSS variable switching causes issues, revert Tailwind config changes
- Component library is independent; can be rolled back without affecting pages

## Open Questions

1. Should we create a centralized `COMPONENTS_REGISTRY` for all components, or keep them modular in `src/components/`?
2. Do we need a color contrast checker to ensure WCAG compliance?
3. Should dark mode be auto-enabled based on system preference or user toggle?
4. How should we handle responsive typography scaling?
