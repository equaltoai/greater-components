# Artist Face: Getting Started

The artist face provides portfolio- and gallery-centric UI plus federation utilities for artwork metadata and rights.

## Install

```bash
pnpm add @equaltoai/greater-components
```

## Required CSS

```ts
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/artist/style.css';
```

## Basic Usage

```svelte
<script lang="ts">
	import { Artwork, Gallery } from '@equaltoai/greater-components/faces/artist';

	const artwork = {
		id: '1',
		title: 'Demo Artwork',
		images: {
			thumbnail: '/demo/thumb.jpg',
			preview: '/demo/preview.jpg',
			standard: '/demo/standard.jpg',
			full: '/demo/full.jpg',
		},
		artist: { id: 'a', name: 'Demo Artist', username: 'demo' },
		metadata: {},
		stats: { views: 0, likes: 0, collections: 0, comments: 0 },
		altText: 'Demo artwork',
		createdAt: new Date().toISOString(),
	};
<\/script>

<Artwork.Root artwork={artwork}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.Attribution />
</Artwork.Root>

<!-- Or layout multiple artworks -->
<!-- <Gallery.Grid items={artworks} /> -->
```

## CLI Install

```bash
greater init --face artist
greater add faces/artist
```
