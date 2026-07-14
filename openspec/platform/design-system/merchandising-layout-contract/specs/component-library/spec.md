# Component Library Delta: Merchandising Layout

## ADDED Requirements

### Requirement: Container provides an opt-in 1400px boundary

The system SHALL add a `wide` Container size with a 1400 CSS-pixel maximum while
preserving every existing size, default and consumer.

#### Scenario: Consumer opts into the wide boundary

- **GIVEN** a viewport wider than 1400 CSS pixels
- **WHEN** a consumer renders `Container size="wide"`
- **THEN** its content remains centered at a maximum of 1400 CSS pixels
- **AND** its configured responsive gutters remain present

#### Scenario: Existing consumer does not opt in

- **WHEN** an existing Container renders without the `wide` size
- **THEN** its previous maximum width, padding and centering remain unchanged
- **AND** no global breakpoint is redefined

### Requirement: CollectionGrid provides one responsive ordered collection

The system SHALL provide a domain-neutral `CollectionGrid` that lays out its
unchanged child collection in two columns below 640px, three from 640px, four
from 1024px and six from 1400px.

#### Scenario: Collection crosses density boundaries

- **GIVEN** one ordered set of children
- **WHEN** the viewport is respectively 320, 640, 1024 and 1400 CSS pixels wide
- **THEN** the same children render in respectively 2, 3, 4 and 6 columns
- **AND** their DOM and reading order is unchanged
- **AND** no child is cloned or hidden for layout

#### Scenario: Collection contains fewer items than one row

- **WHEN** CollectionGrid receives fewer children than the current column count
- **THEN** every supplied child renders once
- **AND** no placeholder or fabricated child completes the row

#### Scenario: Narrow or zoomed content reflows

- **WHEN** the viewport is 320 CSS pixels or content is viewed at 200% zoom
- **THEN** fluid tracks and tokenized gaps contain each child
- **AND** the Grid creates no page-level horizontal overflow

### Requirement: Promotional Carousel supports full-bleed composition

The released promotional Carousel SHALL remain composable outside a Container
without changing slide behavior, timing, controls or existing consumers.

#### Scenario: Banner is composed full bleed

- **WHEN** a promotional Carousel is placed outside the page Container
- **THEN** its media/background may span the viewport width
- **AND** meaningful HTML content remains readable within safe gutters
- **AND** crop cannot remove required meaning

#### Scenario: Motion preference is reduced

- **WHEN** the visitor requests reduced motion
- **THEN** automatic advancement and slide transition motion remain disabled
- **AND** manual controls and slide content remain available

