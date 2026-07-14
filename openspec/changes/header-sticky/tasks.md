Status: Superseded — Closed by `../../features/navigation/sticky-header/tasks.md`

The unchecked items below are retained as historical planning and are not active
backlog. The canonical feature package owns all continuing work and approvals.

## 1. Sticky header foundation

- [ ] 1.1 Review current `Header` structure and identify sticky integration points
- [ ] 1.2 Add sticky positioning behavior to header container
- [ ] 1.3 Implement always-on sticky behavior pinned to `top: 0`

## 2. Sticky visual design

- [ ] 2.1 Define sticky background, elevation, and z-index styles
- [ ] 2.2 Ensure stable sticky visual state without threshold toggles
- [ ] 2.3 Ensure sticky styles preserve readability over page backgrounds

## 3. Responsive behavior

- [ ] 3.1 Render header as full-width bar (no card container)
- [ ] 3.2 Add inner centered container with `max-width: 1400px`
- [x] 3.3 Verify sticky header usability and tap targets on mobile viewport
- [x] 3.4 Verify spacing and alignment in tablet viewport
- [x] 3.5 Verify desktop navigation alignment in sticky mode
- [x] 3.6 Prevent horizontal overflow and content overlap across breakpoints

## 4. Navigation scope cleanup

- [ ] 4.1 Remove header links related to cart, checkout, or buy actions
- [ ] 4.2 Ensure header navigation reflects catalog-only browsing scope

## 5. Content offset and layout safety

- [ ] 5.1 Add top content offset strategy so sections are not hidden beneath sticky header
- [ ] 5.2 Validate offset behavior on home and product detail pages
- [ ] 5.3 Confirm no regression in hero/slider positioning after sticky activation

## 6. Testing and verification

- [x] 6.1 Add component/UI tests for persistent sticky behavior at top edge
- [x] 6.2 Add tests for keyboard navigation and focus visibility in sticky mode
- [x] 6.3 Add responsive checks for mobile/tablet/desktop sticky behavior
- [x] 6.4 Add tests to verify cart/checkout/buy links are absent in header
- [x] 6.5 Run full test suite and validate no regressions in catalog/detail flows
- [x] 6.6 Verify non-goals remain unchanged (no cart, auth, payments)
