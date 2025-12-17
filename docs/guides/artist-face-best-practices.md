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
		const module = await import('@equaltoai/greater-components/faces/artist');
		MediaViewer = module.MediaViewer;
	});
</script>
```

## Accessibility

- `ArtworkData.altText` is required; `Artwork.Image` and `MediaViewer` use it automatically.
- `MediaViewer.Root` supports `Escape` + arrow keys; keep `handlers.onClose` wired.
- When wrapping `ArtworkCard` in custom elements, preserve button semantics or add keyboard handlers (`Enter`/`Space`).

## Federation (API entities)

Federation utilities operate on the API entity types exported from the face (not `ArtworkData`):

```ts
import {
	toActivityPubNote,
	generateArtworkUri,
	serializeMetadata,
	serializeLicense,
	serializeNoAI,
	type ArtworkEntity,
} from '@equaltoai/greater-components/faces/artist';

const note = toActivityPubNote(artworkEntity as ArtworkEntity, 'https://example.com');

const uri = generateArtworkUri(
	'https://example.com',
	(artworkEntity as ArtworkEntity).account.username,
	(artworkEntity as ArtworkEntity).id
);

const metadata = serializeMetadata((artworkEntity as ArtworkEntity).metadata);
const rights = {
	license: serializeLicense((artworkEntity as ArtworkEntity).metadata.license),
	noAI: serializeNoAI((artworkEntity as ArtworkEntity).metadata.noAI),
};
```

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
