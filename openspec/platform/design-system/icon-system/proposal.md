# Governed Icon System

Status: Complete — Released

Owner: Design System Architect

Date: 2026-07-13

## Problem

The application contains locally authored SVG fragments and accepts arbitrary
`ReactNode` icon content in some components. There is no governed source, semantic
name registry, visual contract, accessibility mode, or migration boundary.
Adding feature icons directly would create inconsistent meanings and unbounded
bundle and maintenance costs.

## Decision

Adopt `lucide-react` as the single external glyph source, wrapped by a local
domain-neutral `Icon` Platform component and an explicit semantic registry.

The application SHALL NOT expose Lucide's complete name set as its public Design
System API. Features consume approved semantic `IconName` values; the registry
maps each value to one named Lucide import. This preserves meaning, permits glyph
migration, and prevents full-library dynamic imports.

## Rationale

- Lucide provides consistent, scalable SVG icons and official React packaging.
- Named imports support tree-shaking; only approved registry glyphs ship.
- The project is actively maintained and uses the permissive ISC license, with
  inherited MIT terms for identified Feather-derived glyphs.
- Lucide intentionally excludes brand logos, matching the prohibition on inferred
  or unapproved payment brands.
- A local wrapper prevents library names, defaults, and version changes from
  becoming feature contracts.

## Dependency and versioning strategy

- Add `lucide-react` as a production dependency only after DTE-009 approval.
- Commit the resolved version in the project lockfile; upgrades are deliberate,
  tested dependency changes rather than automatic API expansion.
- An upgrade must run icon snapshots/semantics, TypeScript, accessibility,
  production-build, and bundle validation.
- Keep required ISC/MIT notices with distributed dependency notices.
- Do not copy package SVG files into feature folders.

## Scope

- Typed semantic icon registry and reusable `Icon` API.
- Decorative and informative semantics.
- Size, stroke, fill, color, alignment, focus, target, reflow, and light-only rules.
- Initial mapping boundaries for navigation, Search, contact, payment information,
  feedback, media, and supporting metadata.
- Backward-compatible migration of local SVG fragments and icon slots.

## Out of scope

- Brand logos, custom illustration, emoji, flags, and payment-provider marks.
- Icon-only required meaning.
- Feature labels or business-state decisions.
- Icon buttons as a new primitive; interactive semantics remain owned by Button
  or the consuming native control.
