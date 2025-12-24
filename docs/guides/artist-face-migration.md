# Artist Face Migration Guide

> Migrating from Social Face to Artist Face

## Overview

This guide covers migrating an existing application from the Social Face to the Artist Face. While both faces share core primitives, the Artist Face introduces art-specific components and a different visual hierarchy.

## Component Mapping

### Timeline → Gallery

| Social Face                   | Artist Face       | Notes                     |
| ----------------------------- | ----------------- | ------------------------- |
| `TimelineVirtualizedReactive` | `GalleryGrid`     | Different layout paradigm |
| `Status`                      | `ArtworkCard`     | Art-focused metadata      |
| `Status.Actions`              | `Artwork.Actions` | Different action set      |

### Profile Components

| Social Face      | Artist Face                | Notes                |
| ---------------- | -------------------------- | -------------------- |
| `Profile.Root`   | `ArtistProfile.Root`       | Portfolio-focused    |
| `Profile.Header` | `ArtistProfile.HeroBanner` | Rich formatting      |
| `Profile.Stats`  | `ArtistProfile.Stats`      | Art-specific metrics |

### Content Display

| Social Face      | Artist Face            | Notes                                                               |
| ---------------- | ---------------------- | ------------------------------------------------------------------- |
| `Status.Content` | `Artwork.Root`         | Image-first design                                                  |
| `Status.Media`   | `MediaViewer`          | Enhanced zoom/pan                                                   |
| `ComposeBox`     | _No direct equivalent_ | Use `createArtistAdapter().createArtwork()` plus your own upload UI |

## Migration Steps

### 1. Update Dependencies

```bash
greater add faces/artist
```

### 2. Update Imports

```typescript
// Before (Social Face)
import * as Profile from '$lib/components/Profile';
import { Status } from '$lib/components/Status';
import TimelineVirtualizedReactive from '$lib/components/TimelineVirtualizedReactive.svelte';

// After (Artist Face)
import { Artwork } from '$lib/components/Artwork';
import ArtworkCard from '$lib/components/ArtworkCard';
import * as ArtistProfile from '$lib/components/ArtistProfile';
import { GalleryGrid } from '$lib/components/Gallery';
```

### 3. Update Data Types

```typescript
// Before (Social Face)
interface Status {
	id: string;
	content: string;
	account: Account;
	mediaAttachments: MediaAttachment[];
	// ...
}

// After (Artist Face)
interface ArtworkData {
	id: string;
	title: string;
	images: {
		thumbnail: string;
		preview: string;
		standard: string;
		full: string;
	};
	altText: string;
}
```

### 4. Update Components

#### Timeline to Gallery

```svelte
<!-- Before -->
<TimelineVirtualizedReactive items={statuses} onLoadMore={loadMore} />

<!-- After -->
<GalleryGrid items={artworks} columns="auto" gap="md" onLoadMore={loadMore} />
```

#### Status to Artwork

```svelte
<!-- Before -->
<Status.Root {status}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>

<!-- After -->
<Artwork.Root {artwork}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.Attribution />
	<Artwork.Metadata />
	<Artwork.Actions />
</Artwork.Root>
```

#### Profile Migration

```svelte
<!-- Before -->
<Profile.Root {profile} isOwnProfile={false}>
	<Profile.Header />
	<Profile.Stats />
	<Profile.Tabs />
</Profile.Root>

<!-- After -->
<ArtistProfile.Root {artist}>
	<ArtistProfile.HeroBanner />
	<ArtistProfile.Avatar />
	<ArtistProfile.Name />
	<ArtistProfile.Statement />
	<ArtistProfile.Stats />
	<ArtistProfile.Sections />
</ArtistProfile.Root>
```

## API Differences

### Fetching Content

```typescript
import { LesserGraphQLAdapter } from '$lib/greater/adapters';

// Your data layer can continue to use the standard Lesser adapter.
// Map the resulting data into the Artist Face component props (e.g. ArtworkData).
const adapter = new LesserGraphQLAdapter({
	httpEndpoint: import.meta.env.VITE_LESSER_ENDPOINT,
	wsEndpoint: import.meta.env.VITE_LESSER_WS_ENDPOINT,
	token: import.meta.env.VITE_LESSER_TOKEN,
});
```

### Search

```typescript
const results = await artistAdapter.discoverArtworks(
	{
		styles: ['impressionism'],
		mood: { energy: 0.3, valence: 0.7 },
	},
	{ first: 20 }
);
```

## Theme Customization

### CSS Variables

```css
/* Social Face defaults */
:root {
	--timeline-gap: 16px;
	--status-padding: 16px;
}

/* Artist Face equivalents */
:root {
	--gallery-gap: 16px;
	--artwork-padding: 0; /* Art-first, minimal chrome */
	--artwork-overlay-bg: rgba(0, 0, 0, 0.6);
}
```

## New Features

The Artist Face introduces features not available in Social Face:

- **AI-Powered Discovery** - Color, style, and mood search
- **Work-in-Progress Tracking** - Version control for artwork
- **Critique Mode** - Structured feedback with annotations
- **Commission Workflow** - End-to-end commission management
- **AI Transparency** - Disclosure badges and process documentation

## Gradual Migration

For large applications, consider gradual migration:

```svelte
<script>
	import { GalleryGrid } from '$lib/components/Gallery';
	import TimelineVirtualizedReactive from '$lib/components/TimelineVirtualizedReactive.svelte';

	let useArtistFace = $state(true);
</script>

{#if useArtistFace}
	<GalleryGrid items={artworks} />
{:else}
	<TimelineVirtualizedReactive items={statuses} />
{/if}
```

## Testing

After migration, verify:

1. **Visual Rendering** - Artwork displays correctly
2. **Interactions** - Like, collect, share work
3. **Navigation** - Gallery to detail to profile
4. **Search** - Discovery features function
5. **Accessibility** - Keyboard navigation, screen readers
