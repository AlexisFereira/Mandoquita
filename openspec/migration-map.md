# OpenSpec Migration Map

This file records the current compatibility mapping between the legacy OpenSpec change tree and the new layered architecture.

## Platform

| Current location                                                                             | New location                                                                                   |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| openspec/changes/solid-design-foundations-tailwind/specs/tailwind-design-tokens/spec.md      | openspec/platform/design-system/tailwind-design-tokens/specs/tailwind-design-tokens/           |
| openspec/changes/solid-design-foundations-tailwind/specs/component-library-base/spec.md      | openspec/platform/design-system/component-library-base/specs/component-library-base/           |
| openspec/changes/solid-design-foundations-tailwind/specs/theme-system/spec.md                | openspec/platform/design-system/theme-system/specs/theme-system/                               |
| openspec/changes/solid-design-foundations-tailwind/specs/design-system-documentation/spec.md | openspec/platform/design-system/design-system-documentation/specs/design-system-documentation/ |

## Features

| Current location                                                                          | New location                                                                   |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| openspec/changes/carrusel-responsivo-autoplay-6s/specs/homepage-carousel-autoplay/spec.md | openspec/features/homepage/carousel-autoplay/specs/homepage-carousel-autoplay/ |
| openspec/changes/header-sticky/specs/sticky-header-navigation/spec.md                     | openspec/features/navigation/sticky-header/specs/sticky-header-navigation/     |
| openspec/changes/catalogo-moderno-responsive/specs/product-catalog-ui/spec.md             | openspec/features/product-catalog/ui/specs/product-catalog-ui/                 |
| openspec/changes/catalogo-moderno-responsive/specs/product-catalog-api/spec.md            | openspec/features/product-catalog/api/specs/product-catalog-api/               |
| openspec/changes/catalogo-moderno-responsive/specs/product-detail-page/spec.md            | openspec/features/product-detail/specs/product-detail-page/                    |

## Notes

- The layered `platform/` and `features/` locations are now authoritative.
- Legacy `changes/` content is retained for traceability and is superseded when its task artifact names an authoritative layered replacement.
- Homepage Carousel Autoplay and Sticky Header task ownership has migrated to `features/`.
- Solid Design Foundations task ownership has migrated to focused packages under `platform/design-system/`; its unchecked broad-plan items are historical, not active backlog.
- No legacy specification content is deleted by this mapping.
