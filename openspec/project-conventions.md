# Project Conventions

Version: 1.0

Status: Active

---

# Purpose

This document defines the engineering conventions used throughout the project.

Its purpose is to ensure that every engineer and AI agent produces code and documentation that is:

- Consistent
- Predictable
- Readable
- Maintainable
- Scalable

These conventions are mandatory.

When a convention conflicts with personal preference, the project convention takes precedence.

---

# General Principles

Always prefer:

- Simplicity over cleverness
- Explicitness over implicit behavior
- Composition over inheritance
- Reuse over duplication
- Readability over brevity
- Maintainability over premature optimization

---

# Naming Conventions

## Files

Use **kebab-case**

Examples:

```
product-card.tsx
product-service.ts
search-input.tsx
```

---

## React Components

Use **PascalCase**

```
ProductCard
CategoryGrid
ProductGallery
```

One component per file.

---

## Hooks

Always start with **use**

```
useProducts
useSearch
useCatalog
```

Hooks represent reusable behavior.

---

## Types

Use **PascalCase**

```
Product
Category
ProductStatus
CatalogConfiguration
```

---

## Interfaces

Do not prefix with "I".

Good:

```
Product
Catalog
```

Avoid:

```
IProduct
ICatalog
```

---

## Enums

Use singular PascalCase.

```
ProductStatus

CatalogVisibility
```

---

## Variables

Use camelCase.

Names should describe intent.

Avoid abbreviations.

Good:

```
featuredProducts
selectedCategory
```

Bad:

```
fp
cat
prd
```

---

## Constants

Global constants use UPPER_SNAKE_CASE.

```
DEFAULT_PAGE_SIZE

MAX_PRODUCTS
```

Local constants use camelCase.

---

# Folder Organization

Organize by feature before technology.

Prefer:

```
features/

catalog/

product/

search/

shared/

components/

hooks/

services/

utils/
```

Avoid generic folders with unrelated content.

---

# Import Order

Imports should follow this order:

1. React / Next.js
2. External libraries
3. Shared modules
4. Feature modules
5. Relative imports
6. Types
7. Styles

Avoid circular dependencies.

---

# React Conventions

Prefer:

Functional Components

Custom Hooks

Composition

Controlled Components

Avoid:

Large components

Business logic inside UI

Nested conditional rendering

Anonymous exported components

---

# Component Structure

Use the following order:

Imports

Types

Constants

Component

Helper functions

Export

Keep components focused.

---

# Component Responsibilities

A component should have one responsibility.

If a component exceeds approximately 250 lines, evaluate splitting it.

Prefer composition.

---

# State Management

Priority:

Local State

↓

Context

↓

Global Store

↓

Server State

Do not globalize state unnecessarily.

---

# Props

Props should be:

Minimal

Explicit

Strongly typed

Avoid passing unrelated data.

Prefer objects only when they represent a cohesive concept.

---

# Styling

Never hardcode:

Colors

Spacing

Typography

Radius

Shadows

Animations

Always consume Design Tokens.

---

# Tailwind CSS

Prefer utility classes.

Extract repeated patterns into reusable components.

Avoid excessive inline class duplication.

Never bypass the Design System.

---

# TypeScript

Strict mode is mandatory.

Avoid:

```
any
```

Prefer:

Interfaces

Utility Types

Discriminated Unions

Generics

Type inference when appropriate.

---

# Error Handling

Errors should:

Be explicit.

Contain meaningful messages.

Never expose internal implementation details.

Recover gracefully whenever possible.

---

# Logging

Log only meaningful events.

Avoid console.log in production code.

Prefer structured logging.

---

# API Conventions

Endpoints should use nouns.

Good:

```
/products

/categories
```

Avoid verbs.

Use proper HTTP methods.

Maintain consistent response structures.

---

# Database

Model business concepts.

Avoid database-driven design.

Foreign keys should be explicit.

Naming should remain consistent with the domain.

---

# Validation

Validate:

Input

Business Rules

Permissions

Relationships

Never trust client-side validation.

---

# Testing

Test behavior.

Not implementation.

Prefer:

Integration Tests

Component Tests

Business Rule Tests

Avoid tests tightly coupled to implementation details.

---

# Documentation

Every public module should explain:

Purpose

Responsibilities

Dependencies

Limitations

Architecture decisions belong in documentation.

Not in code comments.

---

# Comments

Write comments only when necessary.

Explain **why**.

Never explain **what** obvious code is doing.

Good:

```ts
// Prevent duplicate requests while the previous search is still pending.
```

Avoid:

```ts
// Increment counter.
counter++;
```

---

# Git

Commits should be:

Small

Focused

Atomic

Each commit should represent one logical change.

---

# Pull Requests

Every Pull Request should include:

- Purpose
- Scope
- Related feature
- Testing performed
- Screenshots (if UI changes)
- Known limitations

---

# Performance

Optimize only after measuring.

Avoid unnecessary memoization.

Prefer simple code.

Performance improvements should remain understandable.

---

# Accessibility

Accessibility is mandatory.

Every UI change must verify:

- Keyboard navigation
- Focus visibility
- Semantic HTML
- Screen reader compatibility

Accessibility regressions block approval.

---

# AI Engineering

AI agents must:

Follow project ownership.

Respect governance documents.

Never invent requirements.

Never modify artifacts outside their responsibility.

Document important decisions.

---

# Code Review Checklist

Before completing any implementation verify:

✓ Naming follows conventions.

✓ Folder organization respected.

✓ Components are reusable.

✓ Business logic separated.

✓ Types are explicit.

✓ Accessibility verified.

✓ No duplicated code.

✓ Documentation updated.

✓ No architectural violations.

---

# Definition of Consistency

A new engineer should be unable to distinguish which parts of the codebase were written by different contributors.

The project should feel like it was written by a single engineering team following one shared architecture.

---

# Final Principle

Conventions exist to eliminate unnecessary decisions.

Every engineer and AI agent should spend their effort solving business problems, not debating formatting, naming or structure.
