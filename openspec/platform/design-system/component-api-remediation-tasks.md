# Component API Remediation Tasks

Version: 1.0

Status: Complete

Requested By: Design System Architect

Implementation Owner: React Frontend Architect

---

# Purpose

Complete platform task 15.4 by making the public props contract of every reusable component available to TypeScript consumers without changing runtime behavior.

---

# Audit Result

The following reusable components currently keep their props type private:

- Button: `ButtonProps`
- Card: `CardProps`
- Carousel: `CarouselProps`
- Container: `ContainerProps`
- ProductCard: `ProductCardProps`
- ProductOffer: `ProductOfferProps`
- SearchInput: `SearchInputProps`
- Section: `SectionProps`

Header and Footer currently accept no props and do not require empty props interfaces.

Badge, CategoryCard, Chip, Hero, Input, and SectionHeader already export their props types.

---

# Tasks

- [x] API-01 Export the existing props type for Button, Card, Carousel, Container, ProductCard, ProductOffer, SearchInput, and Section.
- [x] API-02 Preserve every existing component prop, default, generic constraint, and runtime behavior.
- [x] API-03 Confirm the component barrel continues exporting the component and its public types.
- [x] API-04 Add type-level import assertions or compile fixtures for the public props contracts.
- [x] API-05 Run `npx tsc --noEmit` and the complete test suite.

---

# Acceptance Criteria

- [x] Every reusable component with configurable props exports a named `*Props` type.
- [x] Type consumers can import each props type through the component module and shared barrel.
- [x] No runtime JavaScript output or visual behavior changes.
- [x] TypeScript and all existing tests pass.

---

# Non-Goals

- Renaming current props.
- Adding variants or feature-specific options.
- Redesigning component behavior.
- Adding empty interfaces to Header or Footer.
