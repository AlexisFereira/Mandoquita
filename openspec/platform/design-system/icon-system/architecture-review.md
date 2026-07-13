# Governed Icon System — Architecture Review

Status: Approved

Owner: Project Architect

Date: 2026-07-13

## Decision

The Governed Icon System Platform contract is approved for implementation.

`lucide-react` may be added as the single wrapped glyph source. Features consume only the local closed semantic registry and never import library glyphs as feature contracts.

## Approved Boundaries

- Platform owns semantic icon names, glyph mapping, size, stroke/fill, color inheritance, decorative/informative modes, compatibility and maintenance.
- Features own visible labels, business meaning, placement and whether an approved Icon is useful.
- Button or native controls continue to own focus, keyboard behavior, accessible name and target size.
- No brand logo, payment-provider mark, arbitrary SVG, emoji, flag or feature-specific registry name enters the shared API.
- Payment Information may use only the domain-neutral `payment-information` or `information` meaning; Binance remains text-only under the current approval.

## Compatibility and Quality Conditions

- Named imports and the closed registry must prevent full-library bundling.
- Existing visible labels and icon-bearing component APIs remain compatible during migration.
- Informative mode requires a non-empty label; decorative mode avoids duplicate accessible names.
- Icon nodes never receive focus independently.
- Semantic light-only colors, reflow and existing focus/44px control contracts remain authoritative.
- Dependency license notices, lockfile versioning, TypeScript, accessibility, regression, production-build and bundle evidence are required before Platform release.

## Outcome

`ICON-004` is approved. `ICON-005` is unblocked. Final Icon Platform release remains gated by `ICON-006` through `ICON-008`.

This approval satisfied the Icon portion of `DTE-009`; the Motion contract and
both final Platform releases are now approved in their respective release records.
