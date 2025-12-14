# Artist Face Migration Guide

> Migrating from Social Face to Artist Face

## Overview

This guide covers migrating an existing application from the Social Face to the Artist Face. While both faces share core primitives, the Artist Face introduces art-specific components and a different visual hierarchy.

## Component Mapping

### Timeline → Gallery

| Social Face     | Artist Face       | Notes                     |
| --------------- | ----------------- | ------------------------- |
| `Timeline`      | `GalleryGrid`     | Different layout paradigm |
| `StatusCard`    | `ArtworkCard`     | Art-focused metadata      |
| `StatusActions` | `Artwork.Actions` | Different action set      |

### Profile Components

| Social Face     | Artist Face               | Notes                |
| --------------- | ------------------------- | -------------------- |
| `ProfileHeader` | `ArtistProfile.Root`      | Portfolio-focused    |
| `ProfileBio`    | `ArtistProfile.Statement` | Rich formatting      |
| `ProfileStats`  | `ArtistProfile.Stats`     | Art-specific metrics |

### Content Display

| Social Face     | Artist Face     | Notes                |
| --------------- | --------------- | -------------------- |
| `StatusContent` | `Artwork.Root`  | Image-first design   |
| `MediaGallery`  | `MediaViewer`   | Enhanced zoom/pan    |
| `ComposeBox`    | `ArtworkUpload` | Metadata-rich upload |

## Migration Steps

### 1. Update Dependencies

```bash
# Remove social face (if standalone)
pnpm remove @equaltoai/greater-components-social

# Add artist face
pnpm add @equaltoai/greater-components-artist
```

### 2. Update Imports

```typescript
// Before (Social Face)
import { Timeline, StatusCard, ProfileHeader } from '@equaltoai/greater-components-social';

// After (Artist Face)
import { GalleryGrid, ArtworkCard, ArtistProfile } from '@equaltoai/greater-components-artist';
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
interface Artwork {
	id: string;
	title: string;
	imageUrl: string;
	artist: ArtistData;
	metadata: ArtworkMetadata;
	// ...
}
```

### 4. Update Components

#### Timeline to Gallery

```svelte
<!-- Before -->
<Timeline {statuses} onLoadMore={loadMore} />

<!-- After -->
<GalleryGrid items={artworks} columns="auto" gap="md" onLoadMore={loadMore} />
```

#### Status to Artwork

```svelte
<!-- Before -->
<StatusCard {status}>
	<StatusHeader />
	<StatusContent />
	<StatusMedia />
	<StatusActions />
</StatusCard>

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
<ProfileHeader {profile}>
	<ProfileAvatar />
	<ProfileName />
	<ProfileBio />
	<ProfileStats />
</ProfileHeader>

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
// Before (Social Face)
const statuses = await api.getTimeline({ type: 'home' });

// After (Artist Face)
const artworks = await artistApi.getGallery({
	type: 'home',
	includeMetadata: true,
});
```

### Search

```typescript
// Before (Social Face)
const results = await api.search({ q: 'landscape' });

// After (Artist Face)
const results = await artistApi.discover({
	query: 'landscape',
	filters: {
		styles: ['impressionism'],
		colors: ['#4169E1'],
		mood: { energy: 0.3, valence: 0.7 },
	},
});
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
	import { GalleryGrid } from '@equaltoai/greater-components-artist';
	import { Timeline } from '@equaltoai/greater-components-social';

	let useArtistFace = $state(true);
</script>

{#if useArtistFace}
	<GalleryGrid items={artworks} />
{:else}
	<Timeline {statuses} />
{/if}
```

## Testing

After migration, verify:

1. **Visual Rendering** - Artwork displays correctly
2. **Interactions** - Like, collect, share work
3. **Navigation** - Gallery to detail to profile
4. **Search** - Discovery features function
5. **Accessibility** - Keyboard navigation, screen readers
