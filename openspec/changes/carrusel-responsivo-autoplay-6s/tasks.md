Status: Superseded — Closed by `../../features/homepage/carousel-autoplay/tasks.md`

## 1. Carousel behavior foundation

- [x] 1.1 Review current `Carousel` props/state and identify autoplay integration points
- [x] 1.2 Add autoplay timer with 6000ms interval when slides length is greater than one
- [x] 1.3 Ensure timer cleanup on unmount and dependency changes

## 2. Interaction-safe autoplay

- [x] 2.1 Pause autoplay on mouse hover within carousel container
- [x] 2.2 Pause autoplay when keyboard focus enters carousel controls/content
- [x] 2.3 Resume autoplay after hover/focus interaction ends

## 3. Manual navigation and fallback

- [x] 3.1 Keep previous/next and indicator navigation fully functional
- [x] 3.2 Reset or continue autoplay cycle predictably after manual navigation
- [x] 3.3 Disable autoplay when there is only one slide

## 4. Responsive behavior verification

- [x] 4.1 Verify carousel readability, tap targets, and media composition in mobile viewport (phone-first)
- [x] 4.2 Verify carousel visual hierarchy and spacing in tablet viewport
- [x] 4.3 Verify carousel visual hierarchy and spacing in desktop viewport
- [x] 4.4 Confirm no clipping or horizontal overflow of critical slide content across all three breakpoints

## 5. Test coverage and validation

- [x] 5.1 Add/extend UI or component tests for 6-second autoplay progression
- [x] 5.2 Add tests for pause-on-hover and pause-on-focus behavior
- [x] 5.3 Add tests for manual navigation compatibility and single-slide fallback
- [x] 5.4 Add responsive tests for mobile, tablet, and desktop rendering quality
- [x] 5.5 Run full test suite and verify no regressions in catalog/detail flows

## 6. Loading state and default media

- [x] 6.1 Define and display a default banner image while the main banner image is loading
- [x] 6.2 Create a dedicated assets folder at `public/images/banners/`
- [x] 6.3 Add the default banner image file in that folder and wire the fallback path in the carousel
