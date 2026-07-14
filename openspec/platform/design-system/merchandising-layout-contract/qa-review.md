# Merchandising Layout Contract — QA Review

Status: MLC-011 Approved

Owner: QA Engineer

Date: 2026-07-14

## Result

The additive `Container size="wide"` and shared `CollectionGrid` contract pass
independent QA. During rendered validation QA found that Tailwind emitted the
arbitrary 1400px variant before `lg`, allowing four columns to override six.
The shared component now uses `.collection-grid` with an explicit 1400px media
contract; no Homepage-local workaround or existing Container default changed.

## Evidence

- `npx tsc --noEmit`: passed.
- `npm test`: 38 files and 214 tests passed, including Container/CollectionGrid,
  Homepage, Carousel and public-page regressions.
- `NEXT_DIST_DIR=.next-qa npm run build`: optimized production build passed.
- Production Chrome at 320, 640, 1024 and 1400 CSS px: exact 2/3/4/6 columns,
  one native ordered list, no duplication, no horizontal overflow and CLS 0.
- Effective 200% zoom on a 1400px window: three-column reflow with no overflow.
- Accessibility tree/order, reduced motion and all visible main-content targets
  of at least 44px passed.
- `node --check scripts/validate-homepage-merchandising-browser.cjs` and
  `git diff --check`: passed.

Subsequent approvals are recorded in `design-system-review.md` for MLC-010 and
`release-approval.md` for MLC-012. The Platform package is released.
