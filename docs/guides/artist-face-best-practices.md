# Artist Face Best Practices Guide

> Guidelines for performance, accessibility, federation, and AI transparency

## Performance

### Provide complete image sets

`ArtworkData` is intentionally pre-normalized for rendering. Populate `images.thumbnail/preview/standard/full` and a meaningful `altText`, then let `Artwork.Image` handle progressive loading (enabled by default).

```svelte
<Artwork.Root {artwork} config={{ progressiveLoading: true }}>
	<Artwork.Image aspectRatio="preserve" />
</Artwork.Root>
```

### Use virtual scrolling for large galleries

`GalleryGrid` supports `virtualScrolling` (and will auto-enable for large sets).

```svelte
<GalleryGrid items={artworks} virtualScrolling={true} scrollKey="artist-gallery" />
```

### Lazy-load heavy UI when needed

```svelte
<script>
	import { onMount } from 'svelte';

	let MediaViewer;

	onMount(async () => {
		const module = await import('$lib/components/MediaViewer');
		MediaViewer = module.MediaViewer;
	});
</script>
```

## Accessibility

- `ArtworkData.altText` is required; `Artwork.Image` and `MediaViewer` use it automatically.
- `MediaViewer.Root` supports `Escape` + arrow keys; keep `handlers.onClose` wired.
- When wrapping `ArtworkCard` in custom elements, preserve button semantics or add keyboard handlers (`Enter`/`Space`).

## Federation (API entities)

Keep ActivityPub transformations in your API/adapters layer (not inside your UI components). The Artist Face UI components expect already-normalized `ArtworkData` and related view models.

## AI Transparency

`Artwork.AIDisclosure` reads `artwork.aiUsage` from context. Use `aiUsage.hasAI`, `tools`, `percentage`, and `description` for UI disclosure.

```svelte
<Artwork.Root {artwork} config={{ showAIDisclosure: true }}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.AIDisclosure variant="badge" expandable />
</Artwork.Root>
```

## Error Handling

`ArtworkHandlers.onImageError` gives you a single hook for progressive image load failures.

```svelte
<Artwork.Root
	{artwork}
	handlers={{
		onImageError: (err) => console.error('Failed to load artwork image', err),
	}}
>
	<Artwork.Image />
</Artwork.Root>
```
