# Architecture Principles

Version: 1.1

Status: Active

Owner: Project Architect

---

# Purpose

This document defines the architectural organization of the OpenSpec project.

Its purpose is to ensure that specifications, design decisions, implementation artifacts, and AI agents collaborate through a well-defined architecture.

The architecture described here is the official governance model of the project.

All contributors—human and AI—must follow these principles.

---

# Core Philosophy

The project follows a Specification Driven Development (SDD) workflow.

Specifications are the source of truth.

Every implementation is derived from specifications.

Architecture exists to preserve consistency as the project grows.

---

# Architectural Layers

The project is organized into independent layers.

```
Business
        ↓
Requirements
        ↓
Design System
        ↓
Feature Design
        ↓
Frontend
        ↓
Backend
        ↓
Testing
```

Dependencies always flow downward.

Higher layers define intent.

Lower layers implement intent.

Lower layers never redefine higher-layer decisions.

---

# Repository Structure

The repository is divided into two major domains.

```
platform/
features/
```

Each domain has a different purpose.

---

# Platform

Platform contains reusable knowledge shared by the entire application.

Examples include:

- Design System
- Theme System
- Design Tokens
- Component Library
- Accessibility Guidelines
- Frontend Architecture
- Backend Standards
- Governance

Platform evolves slowly.

Changes require architectural review.

Platform specifications are shared across all features.

---

# Features

Features describe business capabilities.

Each feature is independent.

Each feature owns its own lifecycle.

Example:

```
features/

product-detail/

proposal.md

design.md

tasks.md
```

Features may consume Platform specifications.

Features must never redefine Platform behavior.

---

# Dependency Rules

Allowed:

```
Feature

↓

Platform
```

Meaning:

A feature may depend on:

- Design System
- Component Library
- Theme
- Tokens

Not allowed:

```
Feature

↓

Modify Platform
```

Platform changes must happen independently.

---

# Ownership Model

Every directory has a clear owner.

| Layer          | Owner                          |
| -------------- | ------------------------------ |
| Business       | Project Architect              |
| Requirements   | Product Requirements Architect |
| Platform       | Design System Architect        |
| Feature Design | UX/UI Designer                 |
| Frontend       | React Frontend Architect       |
| Backend        | Backend Architect              |
| Testing        | QA Engineer                    |

Ownership defines authority.

Only the owner may change architectural decisions.

---

# AI Collaboration Model

AI agents collaborate through specifications.

Agents do not communicate directly.

They exchange information using project artifacts.

Example:

```
Requirements

↓

design.md

↓

React Implementation
```

Specifications are contracts.

Not suggestions.

---

# Modification Rules

Requirements may modify:

proposal.md

Design may modify:

design.md

Engineering may modify:

implementation

No layer may silently modify artifacts owned by another layer.

If a conflict exists:

Stop.

Document it.

Request clarification.

---

# Decision Flow

Every new capability follows the same lifecycle.

```
Idea

↓

Proposal

↓

Requirements

↓

Design

↓

Tasks

↓

Implementation

↓

Validation

↓

Release
```

No step should be skipped.

---

# Platform Evolution

Platform is intentionally stable.

Platform changes only when:

- a reusable pattern is identified
- duplication appears across multiple features
- accessibility improvements are required
- architectural consistency improves

Platform is never modified to solve a single feature.

---

# Feature Evolution

Features evolve continuously.

Feature changes must:

- preserve existing contracts
- maintain traceability
- update requirements
- update design
- update tasks

Specifications and implementation must remain synchronized.

---

# Traceability

Every implementation must trace back to:

Feature

↓

Requirement

↓

Acceptance Criteria

Every requirement must trace forward to:

Implementation

↓

Tests

↓

Release

Nothing should exist without traceability.

---

# Design System Relationship

The Design System is a Platform concern.

Features consume components.

Features never create alternative versions of existing components.

If a feature requires a new reusable component:

1. Propose the component.

2. Review the Design System.

3. Approve the component.

4. Publish it to Platform.

5. Consume it from the feature.

Never duplicate components.

Public catalog architecture must consume
`../design-system/public-catalog-visual-contract.md` for theme, public content
boundaries, responsive composition and visual accessibility. Feature artifacts
may define content and business behavior but must not fork those platform rules.
Any intended deviation begins as an explicit Design System contract amendment,
not as an implementation exception.

---

# Implementation Principle

Engineering is responsible for implementation.

Engineering is not responsible for redefining requirements.

If implementation reveals ambiguity:

Do not invent behavior.

Escalate the issue back to Requirements.

---

# Architectural Stability

Architecture should evolve deliberately.

Prefer extending existing structures.

Avoid introducing new patterns unless they solve a recurring problem.

Consistency has higher value than novelty.

---

# Governance Rules

Every architectural decision must satisfy:

- Reusability
- Simplicity
- Traceability
- Consistency
- Maintainability
- Separation of Concerns

If a decision weakens one of these principles, it should be reconsidered.

---

# Definition of Done (Architecture)

A feature is architecturally complete when:

✓ Requirements are approved.

✓ Design is approved.

✓ Tasks are defined.

✓ Platform dependencies are identified.

✓ Implementation follows specifications.

✓ Tests validate requirements.

✓ Documentation is updated.

---

# Final Principle

Architecture exists to reduce future complexity.

Every architectural decision should make the next feature easier to build, not harder.

When in doubt:

Prefer clarity over cleverness.

Prefer consistency over optimization.

Prefer reusable solutions over feature-specific ones.
