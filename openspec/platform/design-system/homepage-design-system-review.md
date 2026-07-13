# Homepage Design System Review

Version: 1.1

Status: Superseded

Superseded By: `light-only-theme-contract/` and the pending light-only Design System re-review

Owner: Design System Architect

Review Target: `openspec/changes/homepage-visual-refresh/tasks.md` — Validation 8.3

---

# Original Decision

The homepage visual refresh does not yet pass the final Design System Review.

The CSS consolidation and Tailwind mapping are materially improved and their automated assertions pass. Final approval is rejected because the active theme still has two sources capable of producing different semantic values and the primary action color does not yet meet the approved contrast contract.

This rejection does not reopen business scope, UX structure, or completed responsive work.

---

# Evidence Reviewed

- `src/styles/theme.css`
- `src/design-system/theme.ts`
- `src/design-system/tokens.ts`
- `tailwind.config.ts`
- `styles/globals.css`
- Homepage shared components
- `tests/design-system/theme-consolidation.test.ts`
- Complete automated test suite: 18 files and 76 tests passing

---

# Passing Findings

- `theme.css` is the sole stylesheet owner of `:root`, `:root.dark`, `body`, `.ds-surface`, and `.ds-card`.
- No independent `prefers-color-scheme: dark` palette remains in `theme.css`.
- Tailwind semantic colors resolve to the channel-based variables.
- The shared focus-visible and reduced-motion rules exist.
- Homepage components no longer consume deprecated `--color-*` aliases.
- Header and contact use inverse semantic roles.
- The automated consolidation assertions pass.

---

# Blocking Findings

## DS-B01 — Runtime and CSS disagree on dark primary

`src/styles/theme.css` defines dark `--primary` as `196 106 74` (`#C46A4A`).

`src/design-system/theme.ts` derives dark `--primary` from `DESIGN_TOKENS.colors.dark.primary[500]`, which is `168 88 61` (`#A8583D`), and writes it as an inline root property.

Inline runtime values take precedence over the stylesheet. The effective semantic palette therefore depends on whether `applyTheme` has executed, which violates the single-source-of-truth requirement and makes first paint differ from hydrated state.

## DS-B02 — Deprecated runtime aliases remain active

The runtime theme system still generates and writes:

- `--color-background`
- `--color-surface`
- `--color-foreground`
- `--color-primary`
- `--color-primary-foreground`
- `--color-border`
- `--color-muted`

These aliases are deprecated by the approved foundation. They may remain only as an explicitly documented compatibility layer with audited consumers. No such compatibility inventory currently justifies their runtime ownership.

## DS-B03 — Theme runtime does not own the complete semantic palette

The runtime setter updates only a subset of current roles. It does not update surface-muted, primary-hover, accent, status, focus, or inverse roles.

The system must choose one model:

1. The resolved class selects the complete CSS palette and JavaScript does not write semantic colors inline; or
2. A generated runtime map writes every semantic role from the same source used to generate CSS.

The first model is preferred because the existing root class bootstrap already supports it with less complexity.

## DS-B04 — Primary action pair fails normal-text contrast

The light primary remains `#C46A4A` and Button uses white primary foreground. The ratio is 3.81:1, below WCAG AA's 4.5:1 threshold for normal text.

The approved correction is primary action `#A8583D` with white text, which produces 5.09:1. Brand primary 500 may remain for non-text emphasis or large content that satisfies the applicable threshold.

## DS-B05 — Contrast evidence remains incomplete

Task 4.5 correctly remains open. Complete evidence is still required for borders used as interaction cues, all Badge states, Button states, carousel controls and indicators, and focus against standard and inverse surfaces.

---

# Required Correction Order

The smallest compliant path is:

1. Make the resolved root class the only runtime theme-color selector.
2. Remove semantic inline writes from `applyTheme`; retain only class and data-attribute resolution.
3. Remove deprecated runtime aliases after confirming there are no remaining consumers, or document a temporary compatibility owner and removal milestone.
4. Assign the passing primary action pair without changing the broader primitive brand palette.
5. Extend automated assertions to detect runtime semantic writes and CSS/TypeScript value disagreement.
6. Complete the contrast matrix for all required interactive states.
7. Re-run functional, theme, contrast, and visual validation.

This order preserves existing architecture and avoids a new token-generation mechanism during a homepage refresh.

---

# Ownership and Blockers

## React Frontend Architect

Owns corrections to `theme.ts`, CSS, Tailwind consumption, components, and implementation tests.

## QA Engineer

Owns repeatable visual-regression coverage and independent accessibility validation.

## Product Requirements and UX owners

Must resolve the separate featured-count and category-cap conflicts recorded in the change artifact. The Design System must not decide those business or feature-design rules.

## Project Architect

Must decide whether performance task 5.7 is formally waived or replaced because the historical baseline does not exist.

---

# Re-review Entry Criteria

Design System re-review may begin when:

- CSS and runtime resolve identical semantic values before and after hydration;
- the deprecated runtime aliases have an explicit disposition;
- normal-size primary actions pass 4.5:1;
- the complete contrast evidence for task 4.5 is available;
- consolidation and functional tests pass;
- light and dark visual captures show no shared-component regression.

Until these conditions are met, validation 8.3 must remain unapproved.

---

# Frontend Re-review — 2026-07-12

## Decision

The React Frontend Architect remediation is accepted.

Validation 8.3 remains pending only because the approved re-review entry criteria require QA visual evidence for homepage, Product Detail, and shared components in light and dark themes. This is not a remaining frontend implementation rejection.

## Resolved findings

- DS-B01 resolved: `applyTheme` changes only the root class and `data-theme`; it no longer installs semantic variables inline.
- DS-B02 resolved: the runtime alias generator and write list were removed.
- DS-B03 resolved: the complete palette is selected through the resolved root class.
- DS-B04 resolved: light and dark primary actions use `#A8583D` with white foreground, producing 5.09:1.
- DS-B05 automated portion resolved: shared focus rules, semantic Carousel control colors, and 28 contrast assertions are present.

## Verification evidence

- `npx tsc --noEmit`: pass.
- Complete suite: 19 test files and 107 tests pass.
- Theme consolidation: 8 assertions pass.
- Semantic contrast: 28 assertions pass.
- `npm run build`: production build passes.
- Homepage, Product Detail, category, API, theme, Carousel, and shared-component test suites remain green.

The jsdom navigation warning emitted by the Button link test is a test-environment limitation and does not fail the suite.

## Remaining external validation

- QA-DS-01: initial light, dark, and system theme through hydration.
- QA-DS-02: persistence and live system-theme change.
- QA-DS-03: complete keyboard focus traversal.
- QA-DS-04: repeatable responsive screenshots in both themes.
- QA-DS-05 and AC-08: Product Detail and shared-component visual regression evidence.
- QA-DS-06: attached human-reviewable contrast evidence.

## Gate status

- Frontend remediation: accepted.
- Automated Design System contract: pass.
- Accessibility task 4.5: pending QA evidence.
- Design System Review 8.3: pending AC-08 and QA handoff.

---

# Light-Only Contract Change Notice

A replacement theme contract is proposed in `light-only-theme-contract/`.

Architecture Review has approved the light-only platform contract. This review must now be re-baselined against one light palette plus standard and inverse surface states. Previous dark-mode QA requirements are superseded rather than completed, and no operating-system or stored preference may activate an alternative palette.
