# @equaltoai/greater-components-artist

> Artist Face - Visual artist portfolio and gallery UI components for Greater Components

[![npm version](https://img.shields.io/npm/v/@equaltoai/greater-components-artist.svg)](https://www.npmjs.com/package/@equaltoai/greater-components-artist)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0)

## Overview

The Artist Face is a specialized component bundle designed for visual artist communities and portfolio-centric social platforms. Unlike the social face which prioritizes text-based microblogging, the Artist Face reimagines the visual hierarchy to place **artwork first** and social elements second.

### Target Applications

- Artist portfolio platforms
- Visual art social networks
- Gallery and exhibition platforms
- Creative community hubs
- Art marketplace frontends

## Installation

```bash
# Using pnpm (recommended)
pnpm add @equaltoai/greater-components-artist

# Using npm
npm install @equaltoai/greater-components-artist

# Using yarn
yarn add @equaltoai/greater-components-artist
```

### Using the CLI

```bash
# Initialize Greater Components with Artist Face
greater init --face artist

# Add specific components
greater add faces/artist/Artwork
greater add faces/artist/Gallery
greater add faces/artist/ArtistProfile
```

## Quick Start

```svelte
<script lang="ts">
	import { Artwork, GalleryGrid, ArtistProfile } from '@equaltoai/greater-components-artist';
	import '@equaltoai/greater-components-artist/style.css';

	const artwork = {
		id: '1',
		title: 'Sunset Over Mountains',
		imageUrl: '/artwork/sunset.jpg',
		artist: { id: '1', name: 'Jane Artist', avatar: '/avatars/jane.jpg' },
		metadata: { medium: 'Oil on canvas', dimensions: '24x36 inches', year: 2024 },
	};
</script>

<Artwork.Root {artwork}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.Attribution />
	<Artwork.Metadata />
	<Artwork.Actions />
</Artwork.Root>
```

## Component Overview

### Display Components

| Component     | Description                            | Documentation                                                |
| ------------- | -------------------------------------- | ------------------------------------------------------------ |
| `Artwork`     | Compound component for artwork display | [View Docs](./docs/components/artist/artwork.md)             |
| `ArtworkCard` | Compact artwork card for grids         | [View Docs](./docs/components/artist/artwork.md#artworkcard) |
| `MediaViewer` | Full-screen immersive viewer           | [View Docs](./docs/components/artist/artwork.md#mediaviewer) |

### Gallery Components

| Component        | Description               | Documentation                                                   |
| ---------------- | ------------------------- | --------------------------------------------------------------- |
| `GalleryGrid`    | Masonry-style grid layout | [View Docs](./docs/components/artist/gallery.md)                |
| `GalleryRow`     | Horizontal scrolling row  | [View Docs](./docs/components/artist/gallery.md#galleryrow)     |
| `GalleryMasonry` | Variable-height masonry   | [View Docs](./docs/components/artist/gallery.md#gallerymasonry) |

### Profile Components

| Component          | Description               | Documentation                                                            |
| ------------------ | ------------------------- | ------------------------------------------------------------------------ |
| `ArtistProfile`    | Artist portfolio compound | [View Docs](./docs/components/artist/artist-profile.md)                  |
| `ArtistBadge`      | Professional badges       | [View Docs](./docs/components/artist/artist-profile.md#artistbadge)      |
| `PortfolioSection` | Customizable sections     | [View Docs](./docs/components/artist/artist-profile.md#portfoliosection) |
| `ArtistTimeline`   | Career timeline           | [View Docs](./docs/components/artist/artist-timeline.md)                 |

### Discovery Components

| Component            | Description           | Documentation                                                         |
| -------------------- | --------------------- | --------------------------------------------------------------------- |
| `DiscoveryEngine`    | AI-powered search     | [View Docs](./docs/components/artist/discovery.md)                    |
| `ColorPaletteSearch` | Color-based search    | [View Docs](./docs/components/artist/discovery.md#colorpalettesearch) |
| `StyleFilter`        | Style/movement filter | [View Docs](./docs/components/artist/discovery.md#stylefilter)        |
| `MoodMap`            | Mood-based discovery  | [View Docs](./docs/components/artist/discovery.md#moodmap)            |

### Creative Tools

| Component            | Description           | Documentation                                                              |
| -------------------- | --------------------- | -------------------------------------------------------------------------- |
| `WorkInProgress`     | WIP documentation     | [View Docs](./docs/components/artist/creative-tools.md)                    |
| `CritiqueMode`       | Structured critique   | [View Docs](./docs/components/artist/creative-tools.md#critiquemode)       |
| `ReferenceBoard`     | Mood boards           | [View Docs](./docs/components/artist/creative-tools.md#referenceboard)     |
| `CommissionWorkflow` | Commission management | [View Docs](./docs/components/artist/creative-tools.md#commissionworkflow) |

### Community Components

| Component        | Description           | Documentation                                                    |
| ---------------- | --------------------- | ---------------------------------------------------------------- |
| `CritiqueCircle` | Critique groups       | [View Docs](./docs/components/artist/community.md)               |
| `Collaboration`  | Multi-artist projects | [View Docs](./docs/components/artist/community.md#collaboration) |
| `MentorMatch`    | Mentorship matching   | [View Docs](./docs/components/artist/community.md#mentormatch)   |

### Transparency Components

| Component              | Description      | Documentation                                                              |
| ---------------------- | ---------------- | -------------------------------------------------------------------------- |
| `AIDisclosure`         | AI usage badges  | [View Docs](./docs/components/artist/transparency.md)                      |
| `ProcessDocumentation` | Process tracking | [View Docs](./docs/components/artist/transparency.md#processdocumentation) |

### Monetization Components

| Component        | Description     | Documentation                                                        |
| ---------------- | --------------- | -------------------------------------------------------------------- |
| `TipJar`         | Tip integration | [View Docs](./docs/components/artist/monetization.md)                |
| `DirectPurchase` | Purchase setup  | [View Docs](./docs/components/artist/monetization.md#directpurchase) |

## API Reference

### Stores

```typescript
import {
	createArtworkStore,
	createGalleryStore,
	createArtistProfileStore,
	createDiscoveryStore,
} from '@equaltoai/greater-components-artist/stores';

// Create a gallery store with infinite scroll
const gallery = createGalleryStore({
	initialItems: [],
	pageSize: 20,
	onLoadMore: async (cursor) => fetchArtworks(cursor),
});
```

### Types

```typescript
import type {
	Artwork,
	ArtworkMetadata,
	ArtistData,
	ArtistProfile,
	GalleryConfig,
	DiscoveryFilter,
} from '@equaltoai/greater-components-artist/types';
```

### Adapters

```typescript
import { createArtistAdapter } from '@equaltoai/greater-components-artist';

const adapter = createArtistAdapter({
	apiUrl: 'https://api.example.com/graphql',
	auth: { token: 'your-token' },
});

// Fetch artworks with color search
const artworks = await adapter.searchByColor({
	colors: ['#FF5733', '#33FF57'],
	mode: 'dominant',
	tolerance: 15,
});
```

## Accessibility

The Artist Face is built with WCAG 2.1 AA compliance:

- **Alt Text**: AI-assisted alt text generation with artist editing
- **Keyboard Navigation**: Full gallery navigation via keyboard
- **Screen Readers**: Optimized artwork descriptions
- **High Contrast**: Modes that preserve artwork visibility
- **Focus Management**: Proper focus handling in lightbox/viewer
- **Reduced Motion**: Respects `prefers-reduced-motion`

```svelte
<Artwork.Root {artwork}>
	<Artwork.Image alt={artwork.altText || artwork.title} />
</Artwork.Root>
```

## Performance

### Progressive Loading

```svelte
<Artwork.Image src={artwork.imageUrl} placeholder={artwork.thumbnailUrl} loading="lazy" />
```

### Virtual Scrolling

```svelte
<GalleryGrid items={artworks} virtualScrolling={true} overscan={5} />
```

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Performance: ≥ 90

## Federation Support

The Artist Face supports ActivityPub federation:

```typescript
import {
	toActivityPubNote,
	fromActivityPubNote,
	generateArtworkUri,
} from '@equaltoai/greater-components-artist';

// Convert artwork to ActivityPub format
const note = toActivityPubNote(artwork, {
	baseUrl: 'https://example.com',
	includeMetadata: true,
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

### Development

```bash
# Clone the repository
git clone https://github.com/equaltoai/greater-components.git
cd greater-components

# Install dependencies
pnpm install

# Run artist face tests
pnpm --filter @equaltoai/greater-components-artist test

# Build the package
pnpm --filter @equaltoai/greater-components-artist build
```

## License

AGPL-3.0-only - See [LICENSE](../../LICENSE) for details.
