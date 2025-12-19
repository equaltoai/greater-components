# Artist Face: Getting Started

> Portfolio-centric UI components for visual artists, galleries, and creative communities.

The Artist Face provides artwork-first components designed for visual artist portfolios, gallery platforms, and art community applications. Unlike the Social Face which prioritizes text-based content, the Artist Face places **artwork first** with social elements secondary.

## Installation

### Option 1: CLI (Recommended)

```bash
# Initialize with Artist Face
npx @equaltoai/greater-components-cli init --face artist

# Or add to an existing project
npx @equaltoai/greater-components-cli add faces/artist
```

### Option 2: Add Individual Components

```bash
# Add specific component groups
npx @equaltoai/greater-components-cli add artwork gallery-grid artist-profile

# Add discovery components
npx @equaltoai/greater-components-cli add discovery-engine color-palette-search
```

## Required CSS

If using CLI with local CSS mode (default), imports are injected automatically:

```ts
// Automatically added by CLI init
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/artist.css';
```

## Basic Usage

### Displaying Artwork

```svelte
<script lang="ts">
	import { Artwork } from '$lib/components/Artwork';

	const artwork = {
		id: '1',
		title: 'Sunset Over Mountains',
		images: {
			thumbnail: '/artwork/sunset-thumb.jpg',
			preview: '/artwork/sunset-preview.jpg',
			standard: '/artwork/sunset.jpg',
			full: '/artwork/sunset-full.jpg',
		},
		artist: {
			id: 'artist-1',
			name: 'Jane Artist',
			username: 'janeartist',
			avatar: '/avatars/jane.jpg',
		},
		metadata: {
			medium: 'Oil on canvas',
			year: 2024,
			dimensions: '24×36 in',
		},
		stats: { views: 1250, likes: 89, collections: 12, comments: 7 },
		altText: 'Oil painting of a sun setting behind layered mountain ridges.',
		createdAt: new Date().toISOString(),
	};

	const handlers = {
		onLike: async (art) => console.log('Liked:', art.id),
		onArtistClick: (artistId) => goto(`/artist/${artistId}`),
	};
</script>

<Artwork.Root {artwork} {handlers}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.Attribution />
	<Artwork.Metadata collapsible />
	<Artwork.Stats />
	<Artwork.Actions />
</Artwork.Root>
```

### Building a Gallery

```svelte
<script lang="ts">
	import { Gallery } from '$lib/components/Gallery';

	const artworks = []; // Array of ArtworkData
</script>

<!-- Masonry Layout (variable heights) -->
<Gallery.Masonry items={artworks} columns={3} gap={16} />

<!-- Grid Layout (uniform cells) -->
<Gallery.Grid items={artworks} columns="auto" gap="md" />

<!-- Horizontal Row -->
<Gallery.Row items={artworks} title="Featured Works" cardSize="lg" />
```

### Artist Profile

```svelte
<script lang="ts">
	import * as ArtistProfile from '$lib/components/ArtistProfile';

	const artist = {
		id: 'artist-1',
		name: 'Jane Artist',
		username: 'janeartist',
		avatar: '/avatars/jane.jpg',
		banner: '/banners/jane-banner.jpg',
		statement: 'Contemporary landscape painter exploring light and atmosphere.',
		verified: true,
		stats: { followers: 1234, works: 89, exhibitions: 5 },
	};
</script>

<ArtistProfile.Root {artist}>
	<ArtistProfile.HeroBanner />
	<ArtistProfile.Avatar />
	<ArtistProfile.Name />
	<ArtistProfile.Badges />
	<ArtistProfile.Statement />
	<ArtistProfile.Stats />
	<ArtistProfile.Sections />
	<ArtistProfile.Actions />
</ArtistProfile.Root>
```

## Key Component Groups

| Component       | Description                            | Documentation                                          |
| --------------- | -------------------------------------- | ------------------------------------------------------ |
| `Artwork`       | Compound component for artwork display | [View Docs](../../components/artist/artwork.md)        |
| `Gallery`       | Grid, Masonry, Row layouts             | [Gallery Integration](./gallery-integration.md)        |
| `ArtistProfile` | Portfolio profile pages                | [View Docs](../../components/artist/artist-profile.md) |
| `Discovery`     | AI-powered artwork search              | [View Docs](../../components/artist/discovery.md)      |
| `Exhibition`    | Curated showcases                      | [View Docs](../../components/artist/gallery.md)        |
| `CreativeTools` | WIP, Critique, Commission              | [View Docs](../../components/artist/creative-tools.md) |
| `Community`     | CritiqueCircle, Collaboration          | [View Docs](../../components/artist/community.md)      |
| `Transparency`  | AI disclosure, ethical badges          | [AI Transparency](./ai-transparency.md)                |
| `Monetization`  | TipJar, DirectPurchase                 | [View Docs](../../components/artist/monetization.md)   |

## Next Steps

- [Gallery Integration](./gallery-integration.md) – Layout strategies for artwork display
- [AI Transparency](./ai-transparency.md) – Disclosing AI usage in artwork
- [Commission Workflow](./commission-workflow.md) – Managing artist commissions
- [Artist Face Best Practices](../../guides/artist-face-best-practices.md) – Patterns and recommendations
