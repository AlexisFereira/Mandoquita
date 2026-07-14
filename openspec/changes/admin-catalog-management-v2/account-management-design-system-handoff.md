# Admin Catalog Management V2 — Account Management Design System Handoff

Status: Superseded by Approved Joint Review

Owner: Design System Architect

Date: 2026-07-13

## Purpose

This handoff completes the Design System sufficiency portion of `ACM-041` without
claiming the still-pending UX/UI and Accessibility approvals. It consumes the
approved account-governance amendment and gives `ACM-040`/UI Design a fixed
composition boundary.

## Sufficiency decision

Existing composition is sufficient for Superadministrator account management:

- `Input` for username, current/temporary/new password and confirmation fields;
- `Button` for submit, cancel, reset, deactivate, reactivate and logout actions;
- native semantic table for the Administrator account collection;
- `Badge` plus visible text for enabled/disabled and fixed-role context;
- `Card`/native sections and fieldsets for grouped forms;
- native inline/dialog confirmations for reset, deactivate and reactivate;
- `PoliteStatus` for confirmed non-interruptive outcomes and native alert/error
  composition for blocking failures.

No AccountTable, PasswordField, PermissionMatrix, Modal, role selector or new
token family is justified.

## Binding account-management composition

- Only the Superadministrator sees the account-management destination and
  actions. A regular Administrator receives no hidden/disabled imitation of
  privileged controls.
- The table row identity is the normalized/display username; enabled state and
  fixed `Administrador` role are visible text, not icons or color alone.
- No password—current, historical, temporary or generated—is rendered in a table,
  status, log-like UI, URL, storage-backed convenience, clipboard helper or
  post-success summary.
- Create uses labelled username and temporary-password fields. Success identifies
  the account and states that password replacement is required, but does not echo
  the credential.
- Reset confirmation identifies the Administrator, explains active-session
  revocation and requires a new temporary password; it never reveals the prior
  password.
- Deactivation confirmation identifies the Administrator, explains access/session
  revocation and uses danger treatment. Deactivation is reversible and is not
  labelled physical deletion.
- Reactivation requires a new temporary password and explains that no prior
  credential or session is restored.
- The protected Superadministrator row exposes no deactivate, delete, demote or
  role-edit control; self-protection is stated in visible text when relevant.
- Fixed roles are read-only labels. No select, permission matrix, checkbox list or
  promotion action is approved.
- Fresh-authorization requirements and generic security failures remain Backend/
  Security-owned; UI copy cannot confirm username existence to unauthorized
  actors.
- A temporary-password session exposes only password replacement and logout. It
  does not render catalog/account navigation behind a disabled visual layer.
- Password inputs support paste and password managers, use labelled optional
  show/hide controls, preserve 44px targets and never impose unapproved composition
  hints beyond the approved policy guidance.

## Joint review evidence

The required evidence is now complete:

1. UX Solution completed `ACM-040` journeys and recovery/focus outcomes.
2. UX/UI mapped those journeys to responsive screens and state matrices.
3. Accessibility independently approved names, table relationships, password
   reveal, temporary-password restriction, confirmations, errors, focus, 320px
   reflow, 200% zoom, targets, contrast and light-only behavior.
4. Design System confirmed final conformance in
   `account-management-design-system-review.md`.

The joint gate is complete. Implementation still requires the executable Backend
contract and the remaining dependencies in `tasks.md`.
