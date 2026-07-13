# Scroll-entry Motion — Design and Accessibility Contract

Status: Complete — Released

Owner: Design System Architect with Accessibility Architect

## Progressive enhancement

- SSR and default CSS render content in its final visible state.
- If JavaScript or `IntersectionObserver` is unavailable, content remains visible.
- The implementation may prepare only a confirmed below-viewport eligible element;
  initial-viewport content remains final to prevent hydration flash or delayed
  reading.
- Observation failure restores the final visible state.
- Motion never changes `display`, layout dimensions, semantic order, tab order,
  accessible name, or pointer availability.

## Public contract

Frontend SHALL provide one opt-in primitive equivalent to:

```ts
type ScrollEntryMotionProps = {
  children: ReactNode;
  as?: approvedSemanticElement;
  distance?: "none" | "sm";
  delayStep?: 0 | 40;
  className?: string;
};
```

The default wrapper must not add landmark meaning. Consumers choose the correct
semantic element and remain responsible for headings and content. No public prop
may control arbitrary duration, easing, offset, observer threshold, or repetition.

## Motion values

- Properties: opacity plus optional vertical `translateY` only.
- Distance: `sm` = 8px; absolute maximum 12px.
- Duration: shared standard role, 220ms; maximum 250ms.
- Easing: shared ease-out curve.
- Stagger: optional 40ms step, maximum four steps/160ms total.
- No scale, blur, rotation, horizontal travel, spring, bounce, or overshoot.
- `will-change` may exist only while an element is prepared or animating and must
  be removed after completion.

## Observation and lifecycle

- Use one shared `IntersectionObserver` per compatible configuration, not one
  observer or scroll listener per element.
- An element reveals when meaningfully entering the viewport; exact threshold may
  be implementation-owned within 0.1–0.2 and must be tested.
- Once revealed, an element is unobserved and never resets during the same page
  view/component lifetime.
- Cleanup removes observation and transient preparation state on unmount or route
  change.
- A controlled remount may create a new page-view instance; scroll-away alone may
  not replay motion.

## Reduced motion and accessibility

- `prefers-reduced-motion: reduce` produces immediate final state with no delay,
  opacity transition, or transform.
- Preference changes while mounted immediately resolve prepared content to final
  state and prevent later animation.
- Motion never moves focus or an element containing current focus.
- A focused or programmatically targeted element becomes immediately visible; it
  must not wait for intersection.
- Screen-reader content availability is independent from visual preparation.
- No announcement is generated solely because an element entered the viewport.

## Opt-in boundary

Eligible examples: approved supporting Homepage sections, non-critical Product
collections, and informational content groups below the initial viewport.

Ineligible: Header/navigation, primary page heading, initial Hero content, forms,
focused controls, status/live regions, validation or error messages, Search result
updates, Product/Variant/commercial availability outcomes, and external-contact
actions required for task completion.

UX/UI owns the final eligible-section inventory. Feature code only opts items in;
it does not own observation or motion values.

## Performance budget and validation

- Maximum 50 observed elements per page; prefer section/group wrappers over every
  child.
- No continuous `scroll` or `resize` listener.
- Only compositor-friendly opacity/transform properties; zero layout shift caused
  by motion.
- No horizontal overflow at supported viewports or 200% zoom.
- Tests cover SSR/default visibility, unsupported observer, initial viewport,
  entry, once-only behavior, unmount cleanup, reduced motion at mount and during
  observation, focus, no layout-affecting properties, and the 50-element guard.
- QA records production bundle/build and browser performance evidence before
  release.

## Compatibility

- Existing Carousel autoplay/reduced-motion behavior remains independent.
- Existing hover and focus transitions keep their current contracts.
- Adoption is opt-in; existing sections do not change until UI Design approves
  them.
- Rollback removes opt-in wrappers without changing content or semantic markup.
