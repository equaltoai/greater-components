# Artist Face: Exhibitions

> Curated showcases and virtual gallery experiences.

The Exhibition components enable curated art showcases with narrative layouts, curator statements, and immersive viewing experiences.

## Installation

```bash
npx @equaltoai/greater-components-cli add exhibition
```

Or install as part of the Artist Face:

```bash
npx @equaltoai/greater-components-cli add faces/artist
```

## Basic Usage

```svelte
<script lang="ts">
	import { Exhibition } from '$lib/components/faces/artist';

	const exhibition = {
		id: 'exhibition-1',
		title: 'Light & Shadow: Contemporary Perspectives',
		description: 'An exploration of contrast in modern art...',
		curator: {
			id: 'curator-1',
			name: 'Maria Chen',
			avatar: '/curators/maria.jpg',
			statement: 'This exhibition brings together artists who...',
		},
		artworks: [], // Populated with ArtworkData
		startDate: '2024-03-01',
		endDate: '2024-04-30',
		coverImage: '/exhibitions/light-shadow-cover.jpg',
	};
</script>

<Exhibition.Root {exhibition}>
	<Exhibition.Header />
	<Exhibition.CuratorNote />
	<Exhibition.Gallery layout="narrative" />
	<Exhibition.Navigation />
</Exhibition.Root>
```

## Components

| Component                | Description                         |
| ------------------------ | ----------------------------------- |
| `Exhibition.Root`        | Container with exhibition context   |
| `Exhibition.Header`      | Title, dates, cover image           |
| `Exhibition.CuratorNote` | Curator statement and bio           |
| `Exhibition.Gallery`     | Artwork display with layout options |
| `Exhibition.Navigation`  | Previous/next exhibition navigation |
| `Exhibition.Artists`     | Featured artists list               |

## Layout Options

### Gallery Layout

Standard grid display for browsing:

```svelte
<Exhibition.Gallery layout="gallery" columns={3} />
```

### Narrative Layout

Story-driven experience with contextual descriptions:

```svelte
<Exhibition.Gallery layout="narrative" showDescriptions />
```

### Timeline Layout

Chronological display for historical exhibitions:

```svelte
<Exhibition.Gallery layout="timeline" groupByYear />
```

## Curator Spotlight

Feature curators alongside their exhibitions:

```svelte
<script lang="ts">
	import { CuratorSpotlight } from '$lib/components/faces/artist';
</script>

<CuratorSpotlight curator={exhibition.curator} exhibitions={curatorExhibitions} />
```

## Collection Cards

Display themed collections:

```svelte
<script lang="ts">
	import { CollectionCard } from '$lib/components/faces/artist';
</script>

<CollectionCard
	collection={{
		id: 'collection-1',
		title: 'Impressionism Essentials',
		artworks: [...],
		owner: curator,
	}}
	preview={4}
/>
```

## Related Documentation

- [Gallery Components API](../../components/artist/gallery.md)
- [Getting Started](./getting-started.md)
