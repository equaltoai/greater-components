# Artist Face: Gallery Integration

> Layout components for displaying artwork collections with responsive, performant galleries.

The Gallery namespace provides three layout strategies optimized for different use cases: Grid for uniform displays, Masonry for variable-height artwork, and Row for horizontal carousels.

## Installation

```bash
npx @equaltoai/greater-components-cli add gallery-grid gallery-masonry gallery-row
```

Or install as part of the Artist Face:

```bash
npx @equaltoai/greater-components-cli add faces/artist
```

## Required CSS

```ts
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/artist.css';
```

## Gallery.Grid

Uniform grid layout with responsive columns. Best for curated collections where visual consistency matters.

```svelte
<script lang="ts">
	import { Gallery } from '$lib/components/faces/artist';

	const artworks = [...]; // Array of ArtworkData

	function handleArtworkClick(artwork) {
		goto(`/artwork/${artwork.id}`);
	}
</script>

<Gallery.Grid
	items={artworks}
	columns={4}
	gap="md"
	aspectRatio="4:3"
	onclick={handleArtworkClick}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArtworkData[]` | `[]` | Artworks to display |
| `columns` | `number \| 'auto'` | `'auto'` | Column count or responsive |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between items |
| `aspectRatio` | `'preserve' \| '1:1' \| '4:3' \| '16:9'` | `'preserve'` | Image aspect ratio |
| `virtualScrolling` | `boolean` | `true` | Enable for large lists |
| `onLoadMore` | `() => void` | - | Infinite scroll callback |

### Responsive Columns

When `columns="auto"`, the grid automatically adjusts:

| Viewport | Columns |
|----------|---------|
| < 640px | 2 |
| 640–1024px | 3 |
| 1024–1440px | 4 |
| > 1440px | 5 |

## Gallery.Masonry

Variable-height masonry layout that preserves artwork aspect ratios. Ideal for mixed-format collections.

```svelte
<script lang="ts">
	import { Gallery } from '$lib/components/faces/artist';
	import { createGalleryStore } from '$lib/stores';

	const store = createGalleryStore({
		initialItems: [],
		pageSize: 20,
		onLoadMore: async (cursor) => fetchArtworks(cursor),
	});
</script>

<Gallery.Masonry
	items={$store.items}
	columnWidth={280}
	gap={16}
	loading={$store.loading}
	onLoadMore={() => store.loadMore()}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArtworkData[]` | `[]` | Artworks to display |
| `columnWidth` | `number` | `300` | Target column width in pixels |
| `gap` | `number` | `16` | Gap in pixels |
| `loading` | `boolean` | `false` | Show loading state |
| `skeleton` | `boolean` | `true` | Show skeleton placeholders |

### Layout Algorithm

The masonry layout uses a bin-packing algorithm:

1. Calculate optimal column count based on container width and `columnWidth`
2. Place each item in the shortest column
3. Respect original aspect ratios
4. Virtualize items outside viewport for performance

## Gallery.Row

Horizontal scrolling row for featured sections and carousels.

```svelte
<script lang="ts">
	import { Gallery } from '$lib/components/faces/artist';
</script>

<Gallery.Row
	items={featuredArtworks}
	title="Featured This Week"
	showAllLink="/gallery/featured"
	cardSize="lg"
	autoScroll
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArtworkData[]` | `[]` | Artworks to display |
| `title` | `string` | - | Section title |
| `showAllLink` | `string` | - | "View all" link URL |
| `cardSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size variant |
| `autoScroll` | `boolean` | `false` | Enable auto-scrolling |
| `scrollSpeed` | `number` | `3000` | Auto-scroll interval (ms) |

## Combining Layouts

Build complex gallery pages by combining layouts:

```svelte
<script lang="ts">
	import { Gallery, ArtistProfile } from '$lib/components/faces/artist';
</script>

<ArtistProfile.Root {artist}>
	<ArtistProfile.HeroBanner />
	<ArtistProfile.Avatar />
	<ArtistProfile.Name />
	
	<!-- Featured row at top -->
	<section>
		<Gallery.Row items={artist.featuredWorks} title="Featured" cardSize="lg" />
	</section>
	
	<!-- Main gallery as masonry -->
	<section>
		<h2>All Works</h2>
		<Gallery.Masonry items={artist.allWorks} columnWidth={250} />
	</section>
</ArtistProfile.Root>
```

## Infinite Scroll

Implement infinite scroll with the gallery store:

```svelte
<script lang="ts">
	import { Gallery } from '$lib/components/faces/artist';
	import { createGalleryStore } from '$lib/stores';

	const gallery = createGalleryStore({
		initialItems: [],
		pageSize: 24,
		onLoadMore: async (cursor) => {
			const response = await fetch(`/api/artworks?cursor=${cursor}`);
			return response.json();
		},
	});

	// Load initial data
	$effect(() => {
		gallery.loadMore();
	});
</script>

<Gallery.Grid
	items={$gallery.items}
	columns="auto"
	virtualScrolling
	onLoadMore={() => gallery.loadMore()}
/>

{#if $gallery.loading}
	<div class="loading-indicator">Loading more...</div>
{/if}

{#if !$gallery.hasMore}
	<div class="end-message">You've seen all artworks</div>
{/if}
```

## Performance Tips

1. **Enable Virtual Scrolling** – Set `virtualScrolling={true}` for lists > 50 items
2. **Use Appropriate Image Sizes** – Provide `thumbnail`, `preview`, and `full` URLs
3. **Lazy Load** – Images outside viewport load on scroll
4. **Skeleton Loading** – Show placeholders while loading

## Accessibility

All gallery components support:

- Keyboard navigation (arrow keys)
- Screen reader announcements
- Focus management
- Reduced motion preferences

```svelte
<Gallery.Grid
	items={artworks}
	ariaLabel="Artist portfolio gallery"
	announceNavigation
/>
```

## Related Documentation

- [Gallery Components API](../../components/artist/gallery.md)
- [Artwork Components](../../components/artist/artwork.md)
- [Getting Started](./getting-started.md)
