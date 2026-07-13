# Theme API Deprecation

Version: 1.0

Status: Active

Owner: Design System Architect

---

# Decision

Theme selection is no longer a supported platform behavior. The following APIs are deprecated and must be removed after the consumer audit:

- `ThemeProvider`
- `useTheme`
- `ThemeMode`
- `ThemePreference`
- `ThemeContextValue`
- `resolveThemePreference`
- `applyTheme`
- `getThemeBootstrapScript`
- `setThemePreference`
- `toggleTheme`
- localStorage key `theme-preference`

# Migration

Components needing color must consume semantic CSS roles. They must not read a theme value in JavaScript.

The application root must load the authoritative light semantic stylesheet directly. No provider, bootstrap selector, storage normalization, or operating-system listener is required.

# Compatibility

Temporary compatibility is allowed only when a documented consumer cannot migrate atomically. A compatibility export must:

- always report light;
- expose no effective toggle or preference mutation;
- be marked deprecated;
- identify its consumer and removal milestone;
- install no class, data attribute, storage value, or semantic inline variable.

# Removal Validation

- repository search finds no application consumer;
- TypeScript passes after API removal;
- initial render remains light without JavaScript theme bootstrap;
- stale localStorage data has no effect;
- tests prevent reintroduction of selection behavior.
