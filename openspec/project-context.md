# Project Context

Version: 1.1

Status: Active

---

# Project Overview

This project is a modern Product Catalog Platform designed to allow businesses to publish and showcase products through responsive, high-quality catalog websites.

The platform prioritizes product discovery rather than e-commerce.

It is not an online store.

Its primary objective is allowing visitors to explore products quickly, visually and intuitively.

The platform must support different business types while maintaining a consistent user experience.

---

# Vision

Build a modern, scalable and reusable catalog platform that allows businesses to present their products professionally without requiring authentication, shopping carts or payment systems.

The system should be simple enough for small businesses while being architecturally prepared for future growth.

---

# Business Goals

The project aims to:

- Showcase products professionally.
- Improve product discoverability.
- Provide responsive browsing experiences.
- Minimize friction for visitors.
- Encourage customer contact through external communication channels.
- Support multiple catalog structures.
- Enable future expansion without architectural redesign.

---

# Product Scope

Current scope includes:

- Homepage
- Product Catalog
- Categories
- Product Detail
- Search
- Product Filtering
- Featured Products
- Related Products
- Informational accepted-payment methods with external contact continuation

The following features are intentionally excluded:

- Public/customer registration
- Public/customer authentication
- Shopping Cart
- Checkout
- Online Payments
- Order Management

These capabilities may be considered in future phases but are outside the current scope.

---

# Product Boundary

The platform is a public Product Catalog, not a transactional e-commerce store.

Product discovery, current commercial information, Category exploration, Product Detail, and external business contact are in scope. Authentication, cart, checkout, payment, orders, and purchase-completion behavior remain excluded until separately approved.

Static accepted-payment information is presentation content, not an Online
Payment capability. It may identify only business-approved methods and direct the
visitor to external contact; it cannot select, validate, calculate, capture or
complete a payment.

Homepage Merchandising Layout V2 uses this active discovery order: full-width
Banner Slider, all eligible Categories, Featured Products, informational Payment
Methods Banner, up to six Products from one anonymous deterministic daily
Category, then Contact and Footer. Public page content uses the shared centered
1400px maximum. Homepage Categories use a compact circular one-row rail with a
`Ver todas` overflow destination; Featured Products use one responsive
2/3/4/6-item row and continue at `/destacados`.
Selection uses the Bogotá business date on the server and is neither visitor
personalization nor client-side randomness.

Product Detail may continue discovery through one WhatsApp information request
and one canonical Share action. Both use only public Product name and the
governed canonical Product URL; price, Variant, visitor, referrer, session and
administrative data are excluded. These actions create no transaction, lead,
analytics event or delivery guarantee.

---

# Presentation Theme

The public application uses one deterministic light visual theme across every supported page and viewport.

Operating-system color preference, stored browser preferences, or client-side controls shall not activate a dark theme or change the approved palette.

Header, mobile navigation and Footer use light surfaces. High-contrast inverse
roles may be used only in deliberately bounded regions such as media overlays or
contact. An inverse surface is a component role and does not constitute a second
application theme.

The canonical visual rules for every public catalog surface are defined in
`platform/design-system/public-catalog-visual-contract.md`.

---

# Target Users

Primary users are visitors who want to:

- Browse products
- Search products
- Explore categories
- View product details
- Contact the business

The platform is optimized for customers rather than administrators.

---

# Administrative Operations

Admin Catalog Management V2 provides one isolated `/admin` operational
capability backed by named accounts: exactly one Deployment-bootstrapped,
protected Superadministrator and multiple fixed-role Administrators. The former
shared six-digit credential is not accepted. Passwords use Argon2id, temporary
credentials require replacement, and credential lifecycle changes revoke every
named server-side session for the account.

Production administration still requires managed-edge attestation in addition
to the named opaque `HttpOnly` session, origin and CSRF protections. The
Superadministrator alone manages Administrator creation, password reset,
deactivation and reactivation; there is no self-service recovery or configurable
permission model.

Authorized Administrators can list/create/edit/retire/restore Products and
Categories through strict transactional contracts. Product creation includes
one explicit Base SKU/Variant. Retirement is reversible and non-cascading;
historical Product/Category slugs remain reserved and permanently redirect only
while the canonical resource is publicly eligible. Catalog Media Admin remains
the sole Product/Category Image ownership and upload capability. Taxonomy-version
management, Variant matrices, bulk mutation, cart, checkout, Online Payments,
orders and physical purge remain outside this capability.

---

# User Experience Principles

The experience should feel:

Simple

Fast

Modern

Professional

Visual

Intuitive

Product-focused

Every interaction should reduce friction.

Products should always remain the primary visual element.

---

# Design Philosophy

The interface should:

Prioritize whitespace.

Use consistent spacing.

Minimize unnecessary decoration.

Use high-quality imagery.

Maintain strong visual hierarchy.

Provide excellent readability.

The Design System defines all visual decisions.

---

# Technical Stack

Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS

Backend

- NestJS
- TypeScript

Database

- PostgreSQL

ORM

- Prisma

Real-time Communication

- Socket.IO (when required)

Deployment

- Docker

Version Control

- Git

---

# Architectural Principles

The project follows:

Specification Driven Development (SDD)

Component-Based Architecture

Feature-Oriented Organization

Reusable Design System

Strong Typing

API-First Thinking

Accessibility by Default

Documentation-Driven Engineering

Business Rules Separation

---

# Frontend Principles

Frontend should:

Use reusable components.

Respect Design Tokens.

Follow the Design System.

Avoid duplicated logic.

Use composition over inheritance.

Prefer simplicity.

Keep state close to where it is required.

Maintain predictable component APIs.

---

# Backend Principles

Backend should:

Protect business rules.

Keep domain logic isolated.

Expose consistent APIs.

Validate all external input.

Protect data integrity.

Separate infrastructure from business logic.

Avoid duplicated business rules.

---

# Quality Standards

Every feature must satisfy:

Business Requirements

↓

Design Review

↓

Implementation Review

↓

Accessibility Validation

↓

Documentation Review

↓

Quality Assurance

↓

Release Approval

No feature skips validation.

---

# Accessibility

Accessibility is mandatory.

Every feature must support:

Keyboard navigation

Visible focus

Semantic HTML

Screen reader compatibility

Responsive layouts

Accessible forms

Accessibility defects are treated as functional defects.

---

# Performance Goals

The platform should prioritize:

Fast page rendering

Optimized images

Minimal JavaScript

Responsive interactions

Efficient rendering

Code splitting when appropriate

Performance should never compromise maintainability.

---

# Engineering Workflow

Every feature follows:

Proposal

↓

Requirements

↓

Design

↓

Planning

↓

Frontend

↓

Backend

↓

Validation

↓

Release

This workflow is mandatory.

---

# Documentation Policy

Documentation is part of the product.

Every important decision must be documented.

Specifications are the source of truth.

Implementation must follow documentation.

Documentation must evolve together with the codebase.

---

# AI Collaboration

AI agents operate as specialized engineering roles.

Each role owns specific artifacts.

Agents collaborate through specifications.

No agent modifies artifacts owned by another discipline.

When ambiguity exists, agents must request clarification instead of making assumptions.

---

# Future Evolution

The architecture should support future capabilities such as:

- Commerce features
- Authentication
- Inventory
- Promotions
- Multi-language catalogs
- Multi-tenant support
- CMS integration
- Analytics
- SEO enhancements

Future evolution should not require major architectural redesign.

---

# Success Criteria

The project is successful when:

Business requirements are faithfully implemented.

The user experience is intuitive.

The interface is visually consistent.

The architecture remains maintainable.

Documentation stays synchronized.

New features can be added without introducing unnecessary complexity.

---

# Guiding Principle

Every engineering decision should answer the following question:

"Does this improve the long-term maintainability, consistency and scalability of the platform?"

If the answer is no, the decision should be reconsidered.
