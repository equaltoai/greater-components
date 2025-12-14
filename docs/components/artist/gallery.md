# Gallery Components

> Layout components for displaying artwork collections with virtual scrolling and responsive behavior

## Overview

Gallery components provide flexible layouts for displaying artwork collections. They support virtual scrolling for performance, responsive column counts, and various clustering modes.

## GalleryGrid

Masonry-style grid layout for artwork display.

### Basic Usage

```svelte
<script lang="ts">
	import { GalleryGrid } from '@equaltoai/greater-components-artist';
	import type { ArtworkData } from '@equaltoai/greater-components-artist/types';

	let artworks: ArtworkData[] = $state([]);
	let loading = $state(false);

	async function loadMore() {
		loading = true;
		const newArtworks = await fetchArtworks();
		artworks = [...artworks, ...newArtworks];
		loading = false;
	}
</script>

<GalleryGrid
	items={artworks}
	columns="auto"
	gap="md"
	virtualScrolling={true}
	onLoadMore={loadMore}
/>
```

### Props

| Prop               | Type                                       | Default  | Description                      |
| ------------------ | ------------------------------------------ | -------- | -------------------------------- |
| `items`            | `ArtworkData[]`                            | `[]`     | Artworks to display              |
| `columns`          | `number \| 'auto'`                         | `'auto'` | Column count or auto-responsive  |
| `gap`              | `'sm' \| 'md' \| 'lg'`                     | `'md'`   | Gap between items                |
| `clustering`       | `'none' \| 'artist' \| 'theme' \| 'smart'` | `'none'` | Smart grouping mode              |
| `virtualScrolling` | `boolean`                                  | `true`   | Enable virtual scrolling         |
| `overscan`         | `number`                                   | `5`      | Items to render outside viewport |
| `onLoadMore`       | `() => void`                               | -        | Infinite scroll callback         |
| `loading`          | `boolean`                                  | `false`  | Loading state                    |

### Responsive Columns

```svelte
<GalleryGrid
	items={artworks}
	columns="auto"
	breakpoints={{
		sm: 1, // 1 column on mobile
		md: 2, // 2 columns on tablet
		lg: 3, // 3 columns on desktop
		xl: 4, // 4 columns on large screens
	}}
/>
```

### Clustering Modes

```svelte
<!-- Group by artist -->
<GalleryGrid items={artworks} clustering="artist" />

<!-- Group by theme/style -->
<GalleryGrid items={artworks} clustering="theme" />

<!-- AI-powered smart grouping -->
<GalleryGrid items={artworks} clustering="smart" />
```

### Virtual Scrolling Configuration

```svelte
<GalleryGrid
	items={artworks}
	virtualScrolling={true}
	overscan={10}
	estimatedItemHeight={300}
	scrollContainer={containerRef}
/>
```

## GalleryRow

Horizontal scrolling row for curated selections.

### Basic Usage

```svelte
<script lang="ts">
	import { GalleryRow } from '@equaltoai/greater-components-artist';
</script>

<GalleryRow
	items={featuredArtworks}
	title="Featured This Week"
	showAllLink="/gallery/featured"
	cardSize="md"
/>
```

### Props

| Prop          | Type                   | Default | Description             |
| ------------- | ---------------------- | ------- | ----------------------- |
| `items`       | `ArtworkData[]`        | `[]`    | Artworks to display     |
| `title`       | `string`               | -       | Row title               |
| `showAllLink` | `string`               | -       | Link to full collection |
| `cardSize`    | `'sm' \| 'md' \| 'lg'` | `'md'`  | Card size in row        |
| `scrollSnap`  | `boolean`              | `true`  | Enable scroll snapping  |
| `showArrows`  | `boolean`              | `true`  | Show navigation arrows  |

### Multiple Rows

```svelte
<div class="gallery-rows">
	<GalleryRow items={recentArtworks} title="Recent Uploads" showAllLink="/gallery/recent" />

	<GalleryRow items={trendingArtworks} title="Trending Now" showAllLink="/gallery/trending" />

	<GalleryRow
		items={followingArtworks}
		title="From Artists You Follow"
		showAllLink="/gallery/following"
	/>
</div>
```

## GalleryMasonry

Variable-height masonry layout respecting artwork aspect ratios.

### Basic Usage

```svelte
<script lang="ts">
	import { GalleryMasonry } from '@equaltoai/greater-components-artist';
</script>

<GalleryMasonry items={artworks} columnWidth={300} gap={16} />
```

### Props

| Prop          | Type            | Default | Description              |
| ------------- | --------------- | ------- | ------------------------ |
| `items`       | `ArtworkData[]` | `[]`    | Artworks to display      |
| `columnWidth` | `number`        | `300`   | Target column width (px) |
| `gap`         | `number`        | `16`    | Gap between items (px)   |
| `minColumns`  | `number`        | `1`     | Minimum column count     |
| `maxColumns`  | `number`        | `6`     | Maximum column count     |

### Responsive Configuration

```svelte
<GalleryMasonry
	items={artworks}
	columnWidth={300}
	gap={16}
	responsive={{
		sm: { columnWidth: 150, gap: 8 },
		md: { columnWidth: 250, gap: 12 },
		lg: { columnWidth: 300, gap: 16 },
	}}
/>
```

## Performance

### Virtual Scrolling

Virtual scrolling renders only visible items plus overscan:

```svelte
<GalleryGrid
	items={largeCollection}
	virtualScrolling={true}
	overscan={5}
	onVisibleRangeChange={(start, end) => {
		console.log(`Rendering items ${start} to ${end}`);
	}}
/>
```

### Lazy Loading Images

```svelte
<GalleryGrid items={artworks} lazyLoadImages={true} placeholderColor="#f0f0f0" />
```

### Intersection Observer

```svelte
<GalleryGrid items={artworks} onLoadMore={loadMore} loadMoreThreshold={0.8} />
```

## Accessibility

### Keyboard Navigation

| Key         | Action                |
| ----------- | --------------------- |
| `Tab`       | Move to next item     |
| `Shift+Tab` | Move to previous item |
| `Enter`     | Open artwork          |
| `Home`      | Go to first item      |
| `End`       | Go to last item       |

### Screen Reader Support

```svelte
<GalleryGrid items={artworks} aria-label="Artwork gallery" announceOnLoad={true} />
```

### Focus Management

```svelte
<GalleryGrid items={artworks} focusOnMount={false} restoreFocusOnUpdate={true} />
```

## Styling

### CSS Custom Properties

```css
.gallery-grid {
	--gallery-gap-sm: 8px;
	--gallery-gap-md: 16px;
	--gallery-gap-lg: 24px;
	--gallery-card-radius: var(--radius-md);
	--gallery-card-shadow: var(--shadow-sm);
}
```

### Custom Card Rendering

```svelte
<GalleryGrid items={artworks}>
	{#snippet card(artwork)}
		<CustomArtworkCard {artwork} />
	{/snippet}
</GalleryGrid>
```
