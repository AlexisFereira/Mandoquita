# Product Gallery and Variant Controls — Design System Decision

Status: Complete

Owner: Design System Architect

Date: 2026-07-12

## PCV-011 decision

Existing visual composition is not sufficient as a supported Design System
contract. A separate Platform change is required and has been opened at
`openspec/platform/design-system/product-gallery-variant-controls/`.

The decision extends existing `Carousel` and `Chip` components rather than adding
feature-specific components. It preserves their current consumers and assigns
Product Image order, Variant resolution, vocabulary, and domain state to the
Product Content and Variants feature.

## Findings

- Current `Carousel` cannot be reused for Product gallery behavior because it
  owns selection internally, autoplays, and models promotional slides.
- Current `Chip` cannot act as a Variant choice because its normal mode is static
  and its only interactive mode means removal.
- Existing semantic tokens are sufficient; no palette addition is justified.
- Existing focus, target-size, motion, light-only, and status foundations remain
  mandatory but need explicit component API coverage.

## Outcome

`PCV-011` is complete. `PCV-010` may now finalize its UI specification against the
proposed Platform contracts, while feature implementation remains blocked until
the Platform change is approved and implemented through its own gates.

