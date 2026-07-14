# Admin Catalog Management V2 — Account Management UI Amendment

Status: Joint UX/UI, Accessibility and Design System Review Approved

Owner: UX/UI Designer

Date: 2026-07-13

## Amendment scope and precedence

This artifact completes the UX/UI portion of `ACM-041`. It consumes the approved
account-governance Requirements and Architecture amendment, revised `ACM-040` UX
Solution and `account-management-design-system-handoff.md`.

It supersedes only the recovery wording and authenticated destination behavior
in the `Named username/password access` section of `ui-design.md`. Product and
Category table/lifecycle design remains unchanged and approved. When account
copy or navigation differs, this amendment is authoritative.

| Deliverable | Final status | Approval evidence |
| --- | --- | --- |
| Revised named access and no-recovery guidance | Approved | Accessibility approval recorded in `accessibility-design-review.md`. |
| Mandatory temporary-password replacement | Approved | Accessibility approval recorded in `accessibility-design-review.md`. |
| Superadministrator account collection and actions | Approved | Accessibility approval and final Design System confirmation recorded. |
| ACM-041 joint review | Complete | `accessibility-design-review.md` and `account-management-design-system-review.md`. |

No new `AccountTable`, `PasswordField`, permission matrix, Modal, role selector
or token is introduced. Composition uses released `Input`, `Button`, `Badge`,
status, error and light-only foundations plus native table, form and confirmation
semantics.

## Authorization-visible information architecture

```text
/admin
├── Named access (everyone without a valid session)
├── Replace temporary password (restricted temporary session)
└── Authorized administration
    ├── Products (Administrator and Superadministrator)
    ├── Categories (Administrator and Superadministrator)
    ├── Administrator accounts (Superadministrator only)
    └── Exit session
```

- A regular Administrator never sees an account-management navigation item,
  empty placeholder, disabled control, account count or account name.
- A direct unauthorized account-route request displays only `No tienes acceso a
  esta sección` and `Volver a productos`; it exposes no table shell or cached
  account content.
- A temporary-password session displays only password replacement and `Salir`.
  Catalog and account navigation is absent from both DOM and accessibility tree;
  it is not rendered behind a disabled layer.
- The Superadministrator sees `Cuentas de administradores` as a peer authorized
  navigation item. Current-page state uses visible text and programmatic state.
- Fixed roles are read-only visible labels. No user can select, edit, promote,
  demote or create another Superadministrator through the application.

## Revised named access

The visual measurements, labelled username/password fields, password-manager,
paste, show/hide, pending and generic security behavior defined in
`ui-design.md` remain valid. Replace its recovery copy with:

- Generic denial: `No se pudo iniciar sesión. Revisa los datos o contacta al
  Superadministrador.`
- `No puedo acceder` reveals guidance, never a form:
  `Solicita al Superadministrador que restablezca tu acceso.`
- When an approved organizational contact is unavailable, show `Contacta al
  Superadministrador de Mandoquita.`
- Add non-interactive clarification: `Si el Superadministrador perdió el acceso,
  el responsable técnico debe seguir el procedimiento de emergencia.`

Do not expose email/SMS reset, recovery links, username checks, account creation,
existing-password retrieval or Deployment instructions. Unknown, incorrect,
disabled and locked accounts remain one indistinguishable outcome.

After successful credential verification:

- A normal confirmed session opens `Productos`.
- A temporary-password session opens only `Reemplaza tu contraseña`.
- The credential pair is never reused as an ongoing API credential or saved in
  URL, Web Storage, logs, analytics, notifications or autocomplete workarounds.

## Mandatory temporary-password replacement

### Restricted screen

Use the isolated Admin identity with no authorized navigation. A surface of
`min(100%, 560px)` contains:

1. H1 `Reemplaza tu contraseña`.
2. Explanation: `Tu contraseña temporal no permite administrar el catálogo.
   Crea una nueva contraseña para continuar.`
3. Policy guidance: `Usa entre 12 y 128 caracteres. Puedes usar espacios y
   caracteres Unicode. Elige una contraseña única para Mandoquita.`
4. `Contraseña temporal` only when required by the executable fresh-auth
   contract.
5. `Nueva contraseña`.
6. `Confirmar nueva contraseña`.
7. Validation/status region.
8. Primary `Guardar nueva contraseña`.
9. Secondary `Salir`.

The surface uses 24px padding below 640px and 32px from 640px. All fields stack;
password controls are never placed side by side. Each password input has
`autocomplete` appropriate to its purpose (`current-password` for the temporary
credential when required and `new-password` for both new fields).

Optional show/hide Buttons are independent and name the target field and state:
`Mostrar nueva contraseña`, `Ocultar nueva contraseña`, `Mostrar confirmación`
and `Ocultar confirmación`. They preserve value and focus, have 44px targets and
never reveal any password by default.

The UI does not impose uppercase, lowercase, number, symbol or periodic-rotation
rules. Confirmation mismatch is associated locally with the confirmation field;
compromised/common/context-specific rejection remains server-authoritative.
Error summaries name fields, never values.

### Replacement states

| State | Visible outcome | Focus and recovery |
| --- | --- | --- |
| Initial | Restricted explanation, fields and actions. | Predictable focus enters first required password field. |
| Local invalid/mismatch | Field error and linked error summary after submit. | Focus summary, then link to first invalid field; preserve safe correction values. |
| Saving | `Guardando nueva contraseña…`; no catalog navigation. | Mark form busy and prevent duplicate submit/exit mutation race. |
| Confirmed | `Contraseña actualizada`. | Establish confirmed full session before opening and focusing `Productos`. |
| Policy rejection | Safe policy error without echoing the value. | Clear rejected password fields and return focus to `Nueva contraseña`. |
| Temporary session expired/reset | `Tu acceso temporal terminó. Solicita una nueva contraseña al Superadministrador.` | Clear fields and return to named access. |
| Service failure | `No se pudo confirmar la nueva contraseña.` | Clear password fields; offer safe retry only while temporary session remains valid. |
| Exit | No success claim. | Revoke restricted session, clear all fields and return to access. |

## Superadministrator account collection

### Page hierarchy

The authorized route contains:

1. H1 `Cuentas de administradores` and primary `Crear administrador`.
2. Explanation: `El Superadministrador puede crear y administrar cuentas con el
   rol fijo Administrador. Los roles no se pueden cambiar.`
3. Collection status/error region.
4. Named horizontal-scroll region.
5. One native semantic account table.

No search, filter or pagination is invented unless the executable Backend
contract supplies a bounded collection need. The initial V2 collection is
scannable as one bounded administrative table. Empty Administrator state is
valid: the protected Superadministrator row and creation action remain.

### Native table contract

Use one `<table>` at every viewport with a concise caption, column headers using
`<th scope="col">`, and username as `<th scope="row">`. Do not add redundant ARIA
table roles, convert rows into Cards or duplicate mobile DOM.

| Column | Minimum width | Content |
| --- | ---: | --- |
| Usuario | 224px | Canonical/display username as row identity. |
| Rol | 176px | Fixed `Superadministrador` or `Administrador`. |
| Acceso | 136px | Visible `Activo` or `Desactivado`. |
| Credencial | 216px | `Lista para usar` or `Debe reemplazar contraseña`. |
| Acciones | 272px | Only actions permitted for that exact row. |

The approximately 1,024px table sits in a region labelled `Tabla de cuentas de
administradores`. When it overflows, the region uses `tabindex="0"`, visible
focus and the associated instruction `Desplázate horizontalmente dentro de la
tabla para consultar todas las columnas.` Overflow never reaches the page.

Rows use 12–16px vertical and 16px horizontal padding, top alignment and semantic
separators. Role/access/credential states use visible text plus `Badge` where
helpful, never icon/color alone. No password, hash, session, credential version,
security implementation value or log-like payload appears in any cell.

### Row actions and protected row

An active Administrator row exposes `Restablecer contraseña de {usuario}` and
`Desactivar acceso de {usuario}`. A deactivated Administrator exposes only
`Reactivar {usuario}`. Every name retains row association and a 44px target.

The Superadministrator row displays `Cuenta protegida` and has no reset,
deactivate, delete, demote, role-edit or self-target action. Action absence is
explained in text, not disabled opacity. There is no account deletion action for
any row; deactivation is reversible and retains username/audit identity.

Loading rows contain no fabricated identities/actions. Failure hides account
data and shows `No pudimos cargar las cuentas de administradores` plus safe
`Reintentar`. Session expiry removes the table and returns to named access.

### Responsive behavior

| Viewport | Composition |
| --- | --- |
| Mobile `<640px` | H1/action stack; action may fill available width. Only the named table region scrolls horizontally. No Card rows. |
| Tablet `640–1023px` | Heading/action may share a row; same native table and contained overflow. |
| Desktop `≥1024px` | Full table uses the Admin container; action labels wrap before any column is hidden. |
| 320px / 200% zoom | Region name/instruction and a usable portion of the focused cell remain visible. Keyboard/pointer scrolling reaches every cell/action without page overflow. |

Sticky columns are not required because they risk covering content at 320px.
Natural table reading order is unchanged at every breakpoint.

## Shared account mutation pattern

Account creation, reset, deactivation and reactivation use an inline task route
or region rather than requiring a new Modal. The persistent order is:

1. Return/cancel path.
2. H1 naming the action and target when one exists.
3. Current safe account state.
4. Consequence explanation.
5. Labelled action-specific fields.
6. Validation/status region.
7. Safe Cancel and explicit mutation action.

Forms use a 720px maximum and stack below 768px. Password fields are cleared
after validation/conflict/authorization/service failures as governed by the UX
contract; non-sensitive username/target orientation may remain.

### Fresh Superadministrator authorization

When Backend requires fresh authorization, the final action opens an inline
confirmation step or independently validated native dialog titled `Confirma tu
contraseña`. It contains:

- The intended target/action in non-sensitive text.
- One labelled current Superadministrator password using
  `autocomplete="current-password"`.
- `Cancelar` and `Confirmar y continuar`.

Cancel returns to the initiating action without mutation. Generic failure says
`No se pudo confirmar la autorización`; it never identifies password/account
state, clears every password field and restores focus to the authorization
field. Success immediately continues only the already reviewed action. The
authorization password is never stored, displayed later or included in success.
Expiry cancels the mutation and clears all credentials.

## Create Administrator

The form title is `Crear administrador` and contains:

- Required `Usuario`, with the approved 3–64-character guidance.
- Required `Contraseña temporal`.
- Required `Confirmar contraseña temporal`.
- Read-only definition `Rol: Administrador`.

Pre-submit copy states: `La cuenta se creará activa. La persona deberá reemplazar
la contraseña temporal antes de acceder al catálogo. Comparte la contraseña
únicamente por el canal privado aprobado; no volverá a mostrarse.`

Actions are `Cancelar` and `Crear administrador`. After field review, complete
fresh authorization when requested. Confirmed success announces `Cuenta creada
para {usuario}` and `Debe reemplazar su contraseña al ingresar`, without echoing
credentials, then focuses the new row/status. Duplicate username preserves the
username for correction but clears both password fields. Failure states `No se
creó la cuenta`; no alternate username or partial account is generated.

## Reset Administrator password

Available only for an active Administrator. The page/confirmation identifies the
username and contains new `Contraseña temporal` plus confirmation. Consequence
copy states:

`Las sesiones activas de {usuario} terminarán. La contraseña anterior dejará de
funcionar y deberá reemplazar la nueva contraseña temporal antes de acceder al
catálogo.`

After fresh authorization, the explicit action is `Restablecer contraseña`.
Success announces `Contraseña restablecida para {usuario}` and `Sus sesiones
anteriores terminaron`, never the value, and focuses the updated row/status.
Validation/conflict clears password fields. If the target became deactivated,
offer the separate reactivation path and do not enable it silently.

## Deactivate Administrator

Use danger action `Desactivar acceso`, not delete. Confirmation identifies the
username and states:

- Active sessions end immediately.
- The username and historical audit attribution remain.
- The account may later be reactivated with a new temporary password.

After fresh authorization, actions are safe `Cancelar` then danger `Desactivar
administrador`. Cancel has initial focus. Success announces `Acceso desactivado
para {usuario}`, updates the row and removes reset/deactivate actions. Conflict
requires collection reload. Any attempted self/protected-target denial preserves
the account and focuses `Cuenta protegida`.

## Reactivate Administrator

Available only for a deactivated Administrator. The form requires a new
temporary password and confirmation and states:

`La cuenta quedará activa, pero no podrá acceder al catálogo hasta reemplazar la
contraseña temporal. No se restaurará ninguna contraseña ni sesión anterior.`

After fresh authorization, use `Reactivar administrador`. Success announces
`Cuenta reactivada para {usuario}`, sets `Debe reemplazar contraseña` and focuses
the updated row/status. Failure leaves the account deactivated and clears all
password fields.

## Confirmation, status and focus matrix

| Outcome | Visible contract | Focus/recovery |
| --- | --- | --- |
| Local validation | Linked summary and associated field errors; never include password value. | Focus summary, then field link; clear sensitive fields when the governed journey requires it. |
| Pending mutation | Entity/action-specific progress; no optimistic row change. | Mark form busy, prevent duplicates and retain orientation. |
| Fresh-auth denial | Generic authorization failure; no account-state detail. | Clear all password fields and focus authorization input. |
| Confirmed mutation | Exact account/action outcome without credential echo. | Focus updated/new row or result status; if filtered away, collection summary. |
| Conflict | `La cuenta cambió en otra sesión. La acción no se completó.` | Clear credentials, reload collection and review; no automatic merge. |
| Target missing | `La cuenta ya no está disponible.` | Affect no other row; focus collection heading. |
| Service unavailable/throttled | Safe retry guidance with no infrastructure detail. | Retain non-sensitive target, clear credentials and retry only when permitted. |
| Superadministrator expiry | `Tu sesión administrativa terminó. La acción no se completó.` | Clear credentials, remove account data and return to access. |
| Protected self-target denial | Account remains active; `La cuenta del Superadministrador está protegida.` | Focus protected-row explanation. |

Inline confirmation is the default. If a modal native-dialog pattern is chosen,
it receives and contains focus, Escape means Cancel and focus returns to the
invoker after cancel/non-removing outcomes. Dismissal never confirms. After a
confirmed row-state change, focus moves to the updated row/status rather than an
action that no longer exists.

## Accessibility and security self-review — ACM-041

- Role-based destinations are omitted from unauthorized DOM/navigation; access
  is not communicated by visually hiding privileged controls.
- Temporary-password restriction exposes one heading, correctly labelled
  password fields, status, save and logout; direct navigation cannot reveal
  catalog/account content behind it.
- Account collection is one native table with caption, column headers, username
  row headers and row-bound actions at every viewport. Its named region alone
  scrolls horizontally at 320px/200% zoom; no account Cards or duplicate DOM.
- Show/hide controls name both target field and visibility state, retain focus,
  meet 44px targets and do not alter values.
- Password fields support paste/password managers and appropriate autocomplete.
  No password is echoed in summaries, table, success, URL, storage, clipboard
  helper, analytics or notifications.
- Fixed role, Active/Deactivated, credential replacement and protected states
  use visible text plus semantics, never color/icon/action absence alone.
- Confirmations identify target, effect and reversibility; safe Cancel receives
  initial focus. Fresh authorization is distinct from target temporary/new
  password input.
- Error summaries link to non-sensitive field names only. Blocking errors and
  focus movement occur after submission; loading/status does not steal focus.
- All actions meet 44 by 44px targets; focus is visible; released light-only
  contrast/status/danger tokens are used. Text spacing and 200% zoom do not
  obscure fields, actions, errors or table focus.
- Forms and confirmations reflow as one column at 320px with no page-level
  overflow. No interaction depends on hover, drag, motion or fine pointer use.
- Generic denial prevents account enumeration. Self-protection, session
  revocation and mutation authorization remain server-authoritative.

The UX/UI portion of ACM-041 is complete with no design blocker. Independent
Accessibility Review approved the screen, table, credential, confirmation,
focus, error, reflow and light-only contracts in
`accessibility-design-review.md`. Design System confirmed final conformance in
`account-management-design-system-review.md`; the joint task is closed.

## Frontend handoff boundary

This amendment authorized account UI implementation and removed the former
UX/UI, Accessibility and Design System gaps. Frontend implementation is recorded
complete in `frontend-implementation.md`; post-implementation Security, QA and
Accessibility validation remain independent release gates. Client state never
authorizes role visibility, fresh authorization, account mutation or catalog
access after temporary credentials.
