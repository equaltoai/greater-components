# Artwork Components

> Display components for artwork presentation with progressive loading and accessibility

## Overview

The Artwork components provide a comprehensive system for displaying visual artwork with proper attribution, metadata, and social interactions. The design philosophy prioritizes the artwork itself, with UI elements receding until interaction.

## Artwork.Root

The main compound component container for artwork display.

### Basic Usage

```svelte
<script lang="ts">
	import { Artwork } from '@equaltoai/greater-components-artist';
	import type { ArtworkData } from '@equaltoai/greater-components-artist/types';

	const artwork: ArtworkData = {
		id: '1',
		title: 'Sunset Over Mountains',
		imageUrl: '/artwork/sunset.jpg',
		thumbnailUrl: '/artwork/sunset-thumb.jpg',
		artist: {
			id: 'artist-1',
			name: 'Jane Artist',
			username: 'janeartist',
			avatar: '/avatars/jane.jpg',
		},
		metadata: {
			medium: 'Oil on canvas',
			dimensions: '24x36 inches',
			year: 2024,
			materials: ['Oil paint', 'Canvas'],
		},
		stats: {
			views: 1250,
			likes: 89,
			collections: 12,
			comments: 7,
		},
	};
</script>

<Artwork.Root {artwork}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.Attribution />
	<Artwork.Metadata />
	<Artwork.Stats />
	<Artwork.Actions />
</Artwork.Root>
```

### Props

| Prop       | Type              | Default  | Description           |
| ---------- | ----------------- | -------- | --------------------- |
| `artwork`  | `ArtworkData`     | required | Artwork data object   |
| `config`   | `ArtworkConfig`   | `{}`     | Display configuration |
| `handlers` | `ArtworkHandlers` | `{}`     | Event handlers        |

### Config Options

```typescript
interface ArtworkConfig {
	showMetadata?: boolean; // Show metadata section
	showStats?: boolean; // Show statistics
	showActions?: boolean; // Show action buttons
	showAIDisclosure?: boolean; // Show AI usage badge
	compactMode?: boolean; // Compact display mode
	linkToDetail?: boolean; // Link image to detail page
}
```

### Event Handlers

```typescript
interface ArtworkHandlers {
	onLike?: (artwork: ArtworkData) => void;
	onCollect?: (artwork: ArtworkData) => void;
	onShare?: (artwork: ArtworkData) => void;
	onComment?: (artwork: ArtworkData) => void;
	onClick?: (artwork: ArtworkData) => void;
}
```

## Subcomponents

### Artwork.Image

High-resolution image with progressive loading.

```svelte
<Artwork.Image loading="lazy" placeholder={artwork.thumbnailUrl} aspectRatio="preserve" />
```

| Prop          | Type                                     | Default       | Description                |
| ------------- | ---------------------------------------- | ------------- | -------------------------- |
| `loading`     | `'eager' \| 'lazy'`                      | `'lazy'`      | Loading strategy           |
| `placeholder` | `string`                                 | -             | Low-res placeholder URL    |
| `aspectRatio` | `'preserve' \| '1:1' \| '4:3' \| '16:9'` | `'preserve'`  | Aspect ratio handling      |
| `alt`         | `string`                                 | artwork.title | Alt text for accessibility |

### Artwork.Title

Artwork title with optional link.

```svelte
<Artwork.Title linkTo={`/artwork/${artwork.id}`} truncate={false} />
```

| Prop        | Type      | Default | Description                  |
| ----------- | --------- | ------- | ---------------------------- |
| `linkTo`    | `string`  | -       | Link destination             |
| `truncate`  | `boolean` | `false` | Truncate long titles         |
| `maxLength` | `number`  | `100`   | Max characters if truncating |

### Artwork.Attribution

Artist name, avatar, and link.

```svelte
<Artwork.Attribution showAvatar={true} linkToProfile={true} />
```

| Prop            | Type           | Default | Description            |
| --------------- | -------------- | ------- | ---------------------- |
| `showAvatar`    | `boolean`      | `true`  | Show artist avatar     |
| `linkToProfile` | `boolean`      | `true`  | Link to artist profile |
| `size`          | `'sm' \| 'md'` | `'md'`  | Attribution size       |

### Artwork.Metadata

Medium, dimensions, year, materials.

```svelte
<Artwork.Metadata fields={['medium', 'dimensions', 'year']} layout="inline" />
```

| Prop     | Type                    | Default    | Description       |
| -------- | ----------------------- | ---------- | ----------------- |
| `fields` | `string[]`              | all        | Fields to display |
| `layout` | `'inline' \| 'stacked'` | `'inline'` | Layout style      |

### Artwork.Stats

Views, likes, collections, comments.

```svelte
<Artwork.Stats show={['likes', 'collections', 'comments']} compact={false} />
```

### Artwork.Actions

Like, collect, share, comment buttons.

```svelte
<Artwork.Actions actions={['like', 'collect', 'share', 'comment']} variant="subtle" />
```

| Prop      | Type                      | Default    | Description     |
| --------- | ------------------------- | ---------- | --------------- |
| `actions` | `string[]`                | all        | Actions to show |
| `variant` | `'subtle' \| 'prominent'` | `'subtle'` | Button style    |

### Artwork.AIDisclosure

AI usage transparency badge.

```svelte
<Artwork.AIDisclosure variant="badge" expandable={true} />
```

## ArtworkCard

Compact artwork representation for grid views.

```svelte
<script lang="ts">
	import { ArtworkCard } from '@equaltoai/greater-components-artist';
</script>

<ArtworkCard
	{artwork}
	size="md"
	showOverlay={true}
	aspectRatio="preserve"
	onclick={() => openViewer(artwork)}
/>
```

### Props

| Prop          | Type                                     | Default      | Description        |
| ------------- | ---------------------------------------- | ------------ | ------------------ |
| `artwork`     | `ArtworkData`                            | required     | Artwork data       |
| `size`        | `'sm' \| 'md' \| 'lg' \| 'auto'`         | `'auto'`     | Card size variant  |
| `showOverlay` | `boolean`                                | `true`       | Show info on hover |
| `aspectRatio` | `'preserve' \| '1:1' \| '4:3' \| '16:9'` | `'preserve'` | Aspect ratio       |

## MediaViewer

Full-screen immersive artwork viewing experience.

```svelte
<script lang="ts">
	import { MediaViewer } from '@equaltoai/greater-components-artist';

	let viewerOpen = $state(false);
	let currentIndex = $state(0);
</script>

{#if viewerOpen}
	<MediaViewer
		artworks={galleryArtworks}
		{currentIndex}
		background="black"
		showMetadata={true}
		showSocial={false}
		enableZoom={true}
		enablePan={true}
		onClose={() => (viewerOpen = false)}
		onNavigate={(index) => (currentIndex = index)}
	/>
{/if}
```

### Props

| Prop           | Type                          | Default   | Description                 |
| -------------- | ----------------------------- | --------- | --------------------------- |
| `artworks`     | `ArtworkData[]`               | required  | Array of artworks           |
| `currentIndex` | `number`                      | `0`       | Currently displayed index   |
| `background`   | `'dark' \| 'black' \| 'blur'` | `'black'` | Background style            |
| `showMetadata` | `boolean`                     | `true`    | Display metadata panel      |
| `showSocial`   | `boolean`                     | `false`   | Display social elements     |
| `enableZoom`   | `boolean`                     | `true`    | Enable pinch/scroll zoom    |
| `enablePan`    | `boolean`                     | `true`    | Enable pan on zoomed images |

### Events

| Event           | Payload             | Description                    |
| --------------- | ------------------- | ------------------------------ |
| `onClose`       | -                   | Viewer closed                  |
| `onNavigate`    | `number`            | Navigation between artworks    |
| `onZoom`        | `number`            | Zoom level changed             |
| `onInteraction` | `{ type, artwork }` | Like/collect/share from viewer |

### Keyboard Navigation

| Key          | Action           |
| ------------ | ---------------- |
| `Escape`     | Close viewer     |
| `ArrowLeft`  | Previous artwork |
| `ArrowRight` | Next artwork     |
| `+` / `=`    | Zoom in          |
| `-`          | Zoom out         |
| `0`          | Reset zoom       |
| `i`          | Toggle metadata  |

## Accessibility

### Alt Text

All artwork images require meaningful alt text:

```svelte
<Artwork.Image alt={artwork.altText || `${artwork.title} by ${artwork.artist.name}`} />
```

### Focus Management

The MediaViewer traps focus and returns it on close:

```svelte
<MediaViewer {artworks} trapFocus={true} returnFocusOnClose={true} />
```

### Screen Reader Announcements

```svelte
<Artwork.Root {artwork}>
	<Artwork.Image />
	<span class="sr-only">
		{artwork.title} by {artwork.artist.name}.
		{artwork.metadata.medium}, {artwork.metadata.year}.
	</span>
</Artwork.Root>
```

## Styling

### CSS Custom Properties

```css
.artwork-root {
	--artwork-border-radius: var(--radius-md);
	--artwork-shadow: var(--shadow-sm);
	--artwork-overlay-bg: rgba(0, 0, 0, 0.6);
	--artwork-title-size: var(--font-size-lg);
	--artwork-meta-size: var(--font-size-sm);
}
```

### Dark Mode

```css
:root[data-theme='dark'] .artwork-root {
	--artwork-shadow: var(--shadow-md);
	--artwork-overlay-bg: rgba(0, 0, 0, 0.8);
}
```
