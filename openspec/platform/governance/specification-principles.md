# Specification Principles

Version: 1.0

Status: Active

Owner: Project Architect

---

# Purpose

This document defines the official specification principles for the project.

Its purpose is to ensure that every specification follows the same modeling rules regardless of which AI agent or engineer produces it.

These principles are mandatory.

All specifications must comply with them.

---

# Guiding Principles

## Principle 1 — Specifications are the Single Source of Truth

Specifications define the expected system behavior.

Implementation must follow specifications.

Specifications must never be changed to match an implementation.

---

## Principle 2 — Business Before Technology

Specifications describe business behavior.

They do not describe implementation.

Avoid references to:

- React
- Tailwind
- Database
- API
- Components
- CSS
- UI Frameworks

Specifications answer:

"What must happen?"

Never:

"How should it be implemented?"

---

## Principle 3 — Separate Business from Presentation

Business behavior and presentation are independent concerns.

Example:

Business:

A product has no primary image.

Presentation:

Show a placeholder image.

Only the business behavior belongs in the specification.

Presentation belongs to the Design System.

---

## Principle 4 — Model Business States Only

Specifications only define business states.

Examples:

- Draft
- Active
- Hidden
- Archived
- Available
- Unavailable

Never define presentation states.

Examples:

- Loading
- Skeleton
- Placeholder
- Empty Screen
- Modal Open
- Hover

Those belong to the UI layer.

---

## Principle 5 — Business States Must Be Independent

Avoid creating linear chains mixing different concerns.

Incorrect:

Active

↓

Publishable

↓

Available

Correct:

Editorial State

- Draft
- Active
- Hidden
- Archived

Publication State

- Publishable
- Not Publishable

Commercial Availability

- Available
- Unavailable

Each dimension represents an independent concern.

---

## Principle 6 — Missing Information Does Not Necessarily Invalidate an Entity

Missing optional information must not automatically invalidate a business entity.

Example:

A product without a primary image remains a valid product.

The presentation layer decides how missing information is displayed.

---

## Principle 7 — Collections Are Not States

An empty collection does not create a new business state.

Example:

Related Products = []

This is a valid business outcome.

It is NOT a new state.

---

## Principle 8 — Tasks Represent Implementation Planning

tasks.md always represents the implementation work required after a specification is approved.

tasks.md never documents how requirements are written.

Correct flow:

Proposal

↓

Design

↓

Tasks

↓

Implementation

---

## Principle 9 — Requirements Must Be Implementation Independent

Requirements must never depend on:

- React
- NestJS
- Prisma
- SQL
- Tailwind
- REST
- GraphQL

Requirements describe behavior.

Implementation chooses technology.

---

## Principle 10 — One Concept, One Name

Every business concept must have exactly one official name.

Avoid synonyms.

Example:

Correct

Product

Incorrect

Item

Product

Catalog Item

Article

All referring to the same concept.

Maintain a shared glossary.

---

# Business Rules

Business Rules must be:

- deterministic
- measurable
- implementation independent
- testable

Example:

BR-001

Hidden products shall never appear in search results.

Good.

Example:

Products should normally appear first.

Bad.

---

# Functional Requirements

Each Functional Requirement must be:

- atomic
- unique
- testable
- implementation independent
- traceable

Recommended format:

FR-001

Title

Description

Acceptance Criteria

Dependencies

---

# Non-functional Requirements

Document independently from Functional Requirements.

Categories include:

- Performance
- Accessibility
- Security
- SEO
- Localization
- Reliability
- Scalability
- Availability
- Maintainability

---

# Acceptance Criteria

Acceptance Criteria must use Gherkin.

Example

Given

When

Then

Every Functional Requirement must have measurable acceptance criteria.

---

# Edge Cases

Every feature must document:

- Empty data
- Missing optional information
- Invalid identifiers
- Disabled entities
- Boundary values
- Unexpected user behavior
- Failure scenarios

A specification is incomplete without edge cases.

---

# Layer Responsibilities

## Product Requirements

Responsible for:

- Business goals
- Requirements
- Rules
- User stories
- Acceptance criteria

Must not define:

- UI
- Components
- APIs
- Database

---

## Design System

Responsible for:

- Visual language
- Components
- Tokens
- Layout
- Interaction
- Accessibility
- Responsive behavior

Must not change business rules.

---

## Frontend

Responsible for implementing specifications.

Frontend does not redefine requirements.

Frontend does not redesign the UI.

---

## Backend

Responsible for implementing business behavior.

Backend does not reinterpret business rules.

---

# Decision Hierarchy

Business Requirements

↓

Design System

↓

Frontend

↓

Backend

Changes flow downward.

Never upward.

---

# AI Agent Rules

Every AI agent working in this repository must:

- respect this document
- preserve terminology
- avoid inventing business rules
- ask for clarification when requirements are ambiguous
- never silently change specifications

When conflicts exist, stop and report them.

Do not make assumptions.

---

# Final Principle

Clarity is always preferred over brevity.

Consistency is always preferred over creativity.

Specifications exist to eliminate ambiguity.

Every specification should allow independent teams to implement the same behavior without additional clarification.
