# Specification: Theme System

## ADDED Requirements

### Requirement: Light and dark theme color palettes

The system SHALL provide two complete color palettes: light mode and dark mode. Each palette SHALL include primary, secondary, success, danger, warning, info, and neutral color values. Color palettes SHALL be defined in a theme configuration file at `src/design-system/theme.ts` and applied as CSS variables.

#### Scenario: Light theme colors are applied

- **WHEN** page loads in light mode (default or system preference)
- **THEN** all `--color-*` CSS variables resolve to light palette values
- **AND** text is dark, backgrounds are light for readability

#### Scenario: Dark theme colors are applied

- **WHEN** dark mode is activated (via user preference or system setting)
- **THEN** all `--color-*` CSS variables resolve to dark palette values
- **AND** text is light, backgrounds are dark for readability

### Requirement: Automatic theme switching via system preference

The system SHALL respect the user's system color scheme preference (`prefers-color-scheme: dark` media query). If user has not explicitly set a theme preference, the system SHALL automatically apply light or dark theme based on OS setting. CSS variables SHALL update automatically when system preference changes.

#### Scenario: System dark mode preference activates dark theme

- **WHEN** user has `prefers-color-scheme: dark` in OS settings
- **THEN** on page load, dark theme is applied automatically
- **AND** CSS variables reflect dark palette

#### Scenario: System preference change updates theme

- **WHEN** user changes OS theme preference while page is open
- **THEN** page automatically updates to new theme
- **AND** CSS variables update without page reload

### Requirement: Manual theme toggle functionality

The system SHALL provide a mechanism to manually override system preference and switch themes. A theme preference token SHALL be stored (e.g., in localStorage as `theme-preference: light | dark | system`). The current theme SHALL be accessible via React context or global state.

#### Scenario: User toggles theme to dark

- **WHEN** user clicks theme toggle button
- **THEN** theme changes to dark regardless of system preference
- **AND** preference is saved to localStorage
- **AND** CSS variables update immediately

#### Scenario: Theme preference persists across sessions

- **WHEN** user sets theme preference to dark and closes browser
- **THEN** on next visit, dark theme is applied
- **AND** localStorage contains `theme-preference: dark`

### Requirement: CSS variables update without layout shift

The system SHALL apply CSS variables at `:root` scope before initial render to prevent theme flashing or layout shift. The theme CSS SHALL be loaded in the document `<head>` using inline `<style>` tag to ensure immediate availability. All color properties SHALL use CSS variables, not hardcoded hex values.

#### Scenario: No theme flash on page load

- **WHEN** page loads
- **THEN** theme CSS variables are applied before React hydration
- **AND** no white/dark flash occurs
- **AND** content renders with correct colors from first paint

### Requirement: All semantic colors have contrast ratio

The system SHALL ensure all semantic color combinations (text on background) meet WCAG AA contrast ratio (4.5:1 for body text, 3:1 for large text). Light theme backgrounds with dark text and dark theme backgrounds with light text SHALL both pass contrast checks.

#### Scenario: Text contrast is readable in light mode

- **WHEN** body text (color: var(--color-text)) is displayed on background (var(--color-surface))
- **THEN** contrast ratio is >= 4.5:1
- **AND** readability is maintained

#### Scenario: Text contrast is readable in dark mode

- **WHEN** body text (color: var(--color-text)) is displayed on dark background
- **THEN** contrast ratio is >= 4.5:1
- **AND** readability is maintained

### Requirement: Theme context available to all components

The system SHALL provide a React context (e.g., `ThemeContext`) that exports current theme state and a toggle function. Components can subscribe to theme changes via `useTheme()` hook. The context SHALL be initialized at app root (`_app.tsx`) and wrap all page content.

#### Scenario: Component accesses theme context

- **WHEN** component calls `const { theme, toggleTheme } = useTheme()`
- **THEN** component receives current theme (light | dark)
- **AND** toggleTheme function is available to change theme
- **AND** component re-renders when theme changes

#### Scenario: Theme changes propagate to all components

- **WHEN** user toggles theme via ThemeContext
- **THEN** all components subscribed to context re-render
- **AND** CSS variables update
- **AND** all UI colors reflect new theme

### Requirement: Semantic color naming consistency

The system SHALL consistently map semantic color names (primary, secondary, success, danger, warning, info, neutral) to actual hex values in both light and dark palettes. The naming convention SHALL be enforced: `--color-<semantic>` (e.g., `--color-primary`, `--color-success`). All components SHALL reference semantic color names, not specific hex values.

#### Scenario: Semantic color is mapped correctly

- **WHEN** component uses `var(--color-primary)`
- **THEN** it resolves to brand primary hex in light mode
- **AND** it resolves to brand primary (lighter) hex in dark mode
- **AND** color intent is clear from the variable name
