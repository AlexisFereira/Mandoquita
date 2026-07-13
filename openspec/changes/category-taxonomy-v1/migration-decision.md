# Category Taxonomy V1 — Migration Decision

Status: Approved

Decision Owner: Project Architect

Business Owner: Product Requirements Architect

Date: 2026-07-12

## Evidence Reviewed

The current seed contains ten English-language demonstration Products under three demonstration Categories: `audio`, `computing`, and `home-living`.

The approved taxonomy source represents Mandoquita's Spanish-language assortment. None of the ten demonstration Products has an exact, truthful Product Type in that source.

The repository contains no separate business inventory requiring migration.

## Product Disposition

The ten seeded Products and their three Categories are demonstration fixtures, not approved Mandoquita catalog records.

They shall not be forced into a semantically incorrect Product Type. They shall be retired from the public catalog when taxonomy version 1.0.0 is activated.

| Existing Category | Existing Product | Decision |
| --- | --- | --- |
| Audio | Wireless Headset Pro | Retire demonstration fixture |
| Audio | Studio Speaker Duo | Retire demonstration fixture |
| Audio | Noise Cancel Earbuds | Retire demonstration fixture |
| Computing | Mechanical Keyboard TKL | Retire demonstration fixture |
| Computing | USB-C Dock 8-in-1 | Retire demonstration fixture |
| Computing | Ultrabook 14 | Retire demonstration fixture |
| Computing | 4K Monitor 27 | Retire demonstration fixture |
| Home Living | Ceramic Table Lamp | Retire demonstration fixture |
| Home Living | Linen Storage Basket | Retire demonstration fixture |
| Home Living | Walnut Side Table | Retire demonstration fixture |

Retirement is an explicit catalog-content decision and is not an automatic classification. No approved Product is lost because the reviewed repository contains no approved production inventory.

## Public Destination Continuity

The former Category destinations are discontinued because they do not represent branches of the approved taxonomy.

| Former destination | Continuity outcome |
| --- | --- |
| `/categorias/audio` | Permanent redirect to the general Category discovery destination |
| `/categorias/computing` | Permanent redirect to the general Category discovery destination |
| `/categorias/home-living` | Permanent redirect to the general Category discovery destination |

The general Category discovery destination is the canonical location where all eligible version 1.0.0 Categories are available. No former Category shall redirect to a new Category with a different meaning.

Former demonstration Product destinations are not preserved as catalog content. A request for one of those Products shall receive the project's standard unavailable-Product outcome and shall not be redirected to an unrelated Product.

## Future Inventory Rule

Any real inventory supplied after this decision must receive an explicit Product Type from taxonomy version 1.0.0 before it becomes publicly discoverable. An unrecognized Product is held from publication and escalated for a business taxonomy decision.

## Approval Outcome

- Existing inventory review: Complete.
- Existing Product disposition: Approved.
- Existing Category continuity: Approved.
- Requirements blocker: Resolved.
- Implementation authorization: Subject to Architecture and UX reviews defined in `tasks.md`.
