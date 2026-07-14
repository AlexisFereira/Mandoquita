# OpenSpec Engineering Guide

Version: 1.0

Status: Active

---

# Purpose

This repository follows a Specification-Driven Development (SDD) methodology powered by OpenSpec and AI-assisted engineering.

The objective is to ensure that every feature is:

- Clearly specified before implementation.
- Architecturally consistent.
- Fully traceable.
- Easy to maintain.
- Independently verifiable.
- Scalable over time.

This document is the entry point for every engineer and AI agent working on the project.

---

# Engineering Philosophy

The project follows a strict separation of responsibilities.

Business decisions, user experience, design, implementation and validation are independent disciplines.

Each discipline owns its own artifacts.

No discipline should modify artifacts owned by another.

The workflow always starts with understanding the problem before proposing a solution.

---

# Project Structure

.openspec/

├── governance/

├── agents/

├── templates/

├── checklists/

└── prompts/

Each directory has a specific purpose and should not overlap with another.

---

# Directory Overview

## governance/

Defines the engineering rules of the project.

Includes:

- Specification Principles
- Architecture Principles
- AI Organization
- Project Lifecycle
- Quality Standards

These documents are mandatory references.

Public catalog proposals and implementations must also read:

- `platform/design-system/public-catalog-visual-contract.md`

That contract owns the current light theme, 1400px public content boundary,
responsive component presentation and visual accessibility rules. Completed
tasks and superseded feature designs are historical evidence, not authority for
new visual decisions.

---

## agents/

Defines the responsibilities of every AI role.

Each agent owns a specific discipline.

Agents collaborate through OpenSpec artifacts.

Agents never replace each other.

---

## templates/

Reusable templates for specifications and documentation.

Templates guarantee consistency across features.

---

## checklists/

Validation checklists used during reviews.

Every feature must pass all applicable checklists before completion.

---

## prompts/

Operational prompts for GitHub Copilot Agent.

These prompts activate a specific engineering role while referencing the appropriate governance documents.

---

# AI Organization

The project uses specialized engineering roles.

Project Architect (Human)

↓

Product Requirements Architect

↓

Design System Architect

↓

UX Solution Architect

↓

React Frontend Architect

↓

Backend Architect

↓

Quality Assurance Architect

Every role has clearly defined responsibilities.

---

# Ownership

Each role owns different artifacts.

| Role                           | Primary Ownership       |
| ------------------------------ | ----------------------- |
| Product Requirements Architect | Business specifications |
| Design System Architect        | Design System           |
| UX Solution Architect          | Feature design          |
| React Frontend Architect       | Frontend implementation |
| Backend Architect              | Backend implementation  |
| Quality Assurance Architect    | Validation              |

Ownership must always be respected.

---

# Development Workflow

Every feature follows the same lifecycle.

Idea

↓

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

Skipping phases is not allowed.

---

# Creating a New Feature

Every feature begins by creating:

features/

feature-name/

proposal.md

design.md

tasks.md

Use the templates inside:

.openspec/templates/

Do not create custom document structures.

---

# Working with GitHub Copilot

Before asking Copilot to perform a task, activate the appropriate role using the prompts stored in:

.openspec/prompts/

Examples:

requirements.prompt.md

frontend.prompt.md

backend.prompt.md

qa.prompt.md

This keeps responses aligned with project standards.

---

# Review Process

Before completing a feature verify:

Requirements Review

↓

Design Review

↓

Frontend Review

↓

Backend Review

↓

QA Review

↓

Release Checklist

All review documents are located in:

.openspec/checklists/

---

# Quality Gates

A feature is considered complete only if:

✓ Business requirements are complete.

✓ Design is approved.

✓ Architecture is respected.

✓ Accessibility is verified.

✓ Documentation is updated.

✓ Acceptance Criteria pass.

✓ QA approves the implementation.

---

# Engineering Principles

Always prioritize:

Correctness

↓

Consistency

↓

Maintainability

↓

Reusability

↓

Performance

↓

Developer Experience

Never sacrifice maintainability for short-term speed.

---

# AI Collaboration Rules

AI agents must:

Respect ownership boundaries.

Never modify another discipline's artifacts.

Read governance documents before making decisions.

Escalate ambiguity instead of making assumptions.

Document significant decisions.

Keep artifacts synchronized.

---

# Documentation Policy

Documentation is part of the product.

Every architectural or behavioral decision must be documented.

Outdated documentation is considered a defect.

---

# Definition of Done

A feature is complete only when:

Business requirements are approved.

Design is approved.

Implementation is complete.

Validation passes.

Documentation is synchronized.

Quality standards are satisfied.

Release checklist is completed.

---

# Continuous Improvement

The project should continuously evolve.

After each completed feature ask:

Can this be simplified?

Can this become reusable?

Can this improve future implementations?

Can documentation become clearer?

Every feature should improve the engineering system itself.

---

# Final Principle

Specifications define the product.

Architecture defines the structure.

Implementation realizes the design.

Validation protects quality.

Documentation preserves knowledge.

Every contribution should leave the project in a better state than it was found.
