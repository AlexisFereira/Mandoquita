## ADDED Requirements

### Requirement: Home carousel autoplay interval

The system SHALL advance the homepage carousel automatically every 6 seconds when more than one slide exists.

#### Scenario: Autoplay advances slide after interval

- **WHEN** a user opens the homepage and the carousel has at least 2 slides
- **THEN** the active slide changes automatically every 6 seconds

### Requirement: Responsive carousel layout

The system SHALL preserve readable content and non-clipped media in the carousel across mobile, tablet, and desktop breakpoints, prioritizing visual quality on phones.

#### Scenario: Carousel renders correctly on small viewport

- **WHEN** a user opens the homepage on a mobile viewport
- **THEN** the carousel content remains readable, controls remain reachable, and images are displayed without clipping critical content

#### Scenario: Carousel renders correctly on tablet viewport

- **WHEN** a user opens the homepage on a tablet viewport
- **THEN** the carousel balances media and text density without overlap and preserves readable typography

#### Scenario: Carousel renders correctly on wide viewport

- **WHEN** a user opens the homepage on a desktop viewport
- **THEN** the carousel layout uses available width while preserving visual hierarchy

### Requirement: Phone-first quality baseline

The system SHALL meet a phone-first quality baseline so the carousel feels polished on common smartphone widths.

#### Scenario: Phone-first spacing and typography

- **WHEN** the carousel renders on typical phone widths
- **THEN** spacing, text size, and control hit areas remain legible and tappable without horizontal overflow

### Requirement: User interaction pause and resume

The system SHALL pause autoplay while the user is interacting with carousel content and resume afterwards.

#### Scenario: Pause on hover

- **WHEN** a pointing-device user hovers over the carousel area
- **THEN** automatic slide advancement pauses until hover ends

#### Scenario: Pause on keyboard focus

- **WHEN** keyboard focus is inside carousel controls or slide content
- **THEN** automatic slide advancement pauses until focus leaves the carousel area

#### Scenario: Resume after interaction ends

- **WHEN** hover/focus interaction ends
- **THEN** autoplay resumes with the same 6-second interval

### Requirement: Manual navigation compatibility

The system SHALL support manual slide navigation without breaking autoplay behavior.

#### Scenario: User navigates manually

- **WHEN** a user navigates using previous/next controls or indicators
- **THEN** the carousel updates to the selected slide and autoplay continues from that state

### Requirement: Single-slide fallback

The system SHALL disable autoplay when there is only one slide.

#### Scenario: Carousel has one slide

- **WHEN** the homepage carousel is rendered with exactly one slide
- **THEN** no automatic slide transition is executed

### Requirement: Default banner image during loading

The system SHALL render a default banner image while each main banner image is still loading.

#### Scenario: Placeholder is visible before image load completes

- **WHEN** a banner slide image has not finished loading
- **THEN** a default banner image is displayed until the target image is fully loaded

#### Scenario: Placeholder is replaced after image load

- **WHEN** the banner image load completes successfully
- **THEN** the default banner image is replaced by the loaded banner image without layout shift

### Requirement: Banner image asset directory

The system SHALL use a dedicated image directory for homepage banner assets.

#### Scenario: Banner assets are organized in a dedicated folder

- **WHEN** banner and fallback assets are added to the project
- **THEN** they are stored under `public/images/banners/` for consistent referencing and maintenance
