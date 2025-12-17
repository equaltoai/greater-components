# Artwork Components (Artist Face)

> Artwork-first UI primitives for portfolio and gallery experiences

## Imports

```ts
import { Artwork, ArtworkCard, MediaViewer } from '@equaltoai/greater-components/faces/artist';
```

## `ArtworkData` Shape

`Artwork.Root` (and components that render artworks/cards) expects a single normalized artwork object with precomputed image URLs and accessible alt text:

```ts
const artwork = {
	id: '1',
	title: 'Sunset Over Mountains',
	description: 'Oil on canvas study in warm evening light.',
	images: {
		thumbnail: '/artwork/sunset-thumb.jpg',
		preview: '/artwork/sunset-preview.jpg',
		standard: '/artwork/sunset.jpg',
		full: '/artwork/sunset-full.jpg',
	},
	dimensions: { width: 1200, height: 800 },
	artist: {
		id: 'artist-1',
		name: 'Jane Artist',
		username: 'janeartist',
		avatar: '/avatars/jane.jpg',
		verified: true,
	},
	metadata: {
		medium: 'Oil on canvas',
		materials: ['Oil paint', 'Canvas'],
		year: 2024,
		dimensions: '24×36 in',
		tags: ['landscape'],
	},
	stats: { views: 1250, likes: 89, collections: 12, comments: 7 },
	aiUsage: { hasAI: false },
	altText: 'Oil painting of a sun setting behind layered mountain ridges.',
	createdAt: new Date().toISOString(),
};
```

## `Artwork.Root`

`Artwork` is a compound component. `Artwork.Root` provides context to its children; subcomponents read the current artwork/config/handlers from context.

```svelte
<script lang="ts">
	import { Artwork } from '@equaltoai/greater-components/faces/artist';

	const handlers = {
		onLike: async (artwork) => console.log('like', artwork.id),
		onArtistClick: (artistId) => console.log('artist', artistId),
	};
</script>

<Artwork.Root {artwork} config={{ density: 'comfortable', showAIDisclosure: true }} {handlers}>
	<Artwork.Image aspectRatio="preserve" />
	<Artwork.Title linkTo={`/artwork/${artwork.id}`} />
	<Artwork.Attribution profileBaseUrl="/artist" />
	<Artwork.Metadata collapsible />
	<Artwork.Stats />
	<Artwork.Actions />
	<Artwork.AIDisclosure variant="badge" />
</Artwork.Root>
```

### Props

| Prop       | Type              | Default | Notes                     |
| ---------- | ----------------- | ------- | ------------------------- |
| `artwork`  | `ArtworkData`     | -       | Required                  |
| `config`   | `ArtworkConfig`   | `{}`    | Display toggles + density |
| `handlers` | `ArtworkHandlers` | `{}`    | Interaction callbacks     |
| `children` | `Snippet`         | -       | Compound children         |

### `ArtworkConfig`

| Field                | Type                                       | Default         |
| -------------------- | ------------------------------------------ | --------------- |
| `density`            | `'compact' \| 'comfortable' \| 'spacious'` | `'comfortable'` |
| `displayMode`        | `'card' \| 'detail' \| 'immersive'`        | `'card'`        |
| `showMetadata`       | `boolean`                                  | `true`          |
| `showStats`          | `boolean`                                  | `true`          |
| `showActions`        | `boolean`                                  | `true`          |
| `showAIDisclosure`   | `boolean`                                  | `true`          |
| `progressiveLoading` | `boolean`                                  | `true`          |
| `class`              | `string`                                   | `''`            |

### `ArtworkHandlers`

| Handler         | Signature                                         |
| --------------- | ------------------------------------------------- |
| `onLike`        | `(artwork: ArtworkData) => void \| Promise<void>` |
| `onCollect`     | `(artwork: ArtworkData) => void \| Promise<void>` |
| `onShare`       | `(artwork: ArtworkData) => void \| Promise<void>` |
| `onComment`     | `(artwork: ArtworkData) => void \| Promise<void>` |
| `onClick`       | `(artwork: ArtworkData) => void \| Promise<void>` |
| `onArtistClick` | `(artistId: string) => void \| Promise<void>`     |
| `onImageError`  | `(error: Error) => void`                          |

## Subcomponents

All `Artwork.*` subcomponents read from context; they do not accept an `artwork` prop.

### `Artwork.Image`

| Prop          | Type                                     | Default      |
| ------------- | ---------------------------------------- | ------------ |
| `aspectRatio` | `'preserve' \| '1:1' \| '4:3' \| '16:9'` | `'preserve'` |
| `class`       | `string`                                 | `''`         |

### `Artwork.Title`

| Prop       | Type                         | Default |
| ---------- | ---------------------------- | ------- |
| `linkTo`   | `string`                     | -       |
| `maxLines` | `number`                     | `2`     |
| `level`    | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3`     |
| `class`    | `string`                     | `''`    |

### `Artwork.Attribution`

| Prop             | Type      | Default     |
| ---------------- | --------- | ----------- |
| `showAvatar`     | `boolean` | `true`      |
| `linkToProfile`  | `boolean` | `true`      |
| `profileBaseUrl` | `string`  | `'/artist'` |
| `class`          | `string`  | `''`        |

### `Artwork.Metadata`

| Prop              | Type      | Default |
| ----------------- | --------- | ------- |
| `collapsible`     | `boolean` | `false` |
| `defaultExpanded` | `boolean` | `true`  |
| `class`           | `string`  | `''`    |

### `Artwork.Stats`

| Prop              | Type      | Default |
| ----------------- | --------- | ------- |
| `showViews`       | `boolean` | `true`  |
| `showLikes`       | `boolean` | `true`  |
| `showCollections` | `boolean` | `true`  |
| `showComments`    | `boolean` | `true`  |
| `class`           | `string`  | `''`    |

### `Artwork.Actions`

| Prop          | Type      | Default |
| ------------- | --------- | ------- |
| `showLike`    | `boolean` | `true`  |
| `showCollect` | `boolean` | `true`  |
| `showShare`   | `boolean` | `true`  |
| `showComment` | `boolean` | `true`  |
| `class`       | `string`  | `''`    |

### `Artwork.AIDisclosure`

| Prop         | Type                                | Default   |
| ------------ | ----------------------------------- | --------- |
| `variant`    | `'badge' \| 'detailed' \| 'inline'` | `'badge'` |
| `expandable` | `boolean`                           | `true`    |
| `class`      | `string`                            | `''`      |

## `ArtworkCard`

Compact rendering for grids/rows/masonry. Uses the same `ArtworkData` shape.

```svelte
<ArtworkCard {artwork} variant="grid" size="md" onclick={(art) => console.log('open', art.id)} />
```

| Prop          | Type                                     | Default      |
| ------------- | ---------------------------------------- | ------------ |
| `artwork`     | `ArtworkData`                            | -            |
| `size`        | `'sm' \| 'md' \| 'lg' \| 'auto'`         | `'auto'`     |
| `variant`     | `'grid' \| 'row' \| 'list' \| 'masonry'` | `'grid'`     |
| `showOverlay` | `boolean`                                | `true`       |
| `aspectRatio` | `'preserve' \| '1:1' \| '4:3' \| '16:9'` | `'preserve'` |
| `onclick`     | `(artwork: ArtworkData) => void`         | -            |
| `tabindex`    | `number`                                 | `0`          |
| `tagName`     | `'button' \| 'div'`                      | `'button'`   |
| `class`       | `string`                                 | `''`         |

## `MediaViewer`

Full-screen lightbox viewer. `MediaViewer` is also a compound component.

```svelte
<script lang="ts">
	import { MediaViewer } from '@equaltoai/greater-components/faces/artist';

	let currentIndex = $state(0);
	let open = $state(true);
</script>

{#if open}
	<MediaViewer.Root
		{artworks}
		{currentIndex}
		config={{ background: 'black', showMetadata: true, showThumbnails: true }}
		handlers={{
			onClose: () => (open = false),
			onNavigate: (i) => (currentIndex = i),
		}}
	>
		<MediaViewer.Navigation />
		<MediaViewer.ZoomControls />
		<MediaViewer.MetadataPanel />
	</MediaViewer.Root>
{/if}
```

### `MediaViewer.Root` Props

| Prop           | Type                  | Default |
| -------------- | --------------------- | ------- |
| `artworks`     | `ArtworkData[]`       | -       |
| `currentIndex` | `number`              | `0`     |
| `config`       | `MediaViewerConfig`   | `{}`    |
| `handlers`     | `MediaViewerHandlers` | `{}`    |
| `children`     | `Snippet`             | -       |

### `MediaViewerConfig`

| Field            | Type                          | Default   |
| ---------------- | ----------------------------- | --------- |
| `background`     | `'dark' \| 'black' \| 'blur'` | `'black'` |
| `showMetadata`   | `boolean`                     | `true`    |
| `showSocial`     | `boolean`                     | `false`   |
| `enableZoom`     | `boolean`                     | `true`    |
| `enablePan`      | `boolean`                     | `true`    |
| `showThumbnails` | `boolean`                     | `true`    |

### `MediaViewerHandlers`

| Handler         | Signature                                      |
| --------------- | ---------------------------------------------- |
| `onClose`       | `() => void`                                   |
| `onNavigate`    | `(index: number) => void`                      |
| `onZoom`        | `(level: number) => void`                      |
| `onInteraction` | `(type: string, artwork: ArtworkData) => void` |
| `i`             | Toggle metadata                                |

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
