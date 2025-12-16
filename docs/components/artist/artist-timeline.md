# Artist Timeline (Artist Face)

> Hybrid social feed with larger artwork previews

## Imports

```ts
import { ArtistTimeline } from '@equaltoai/greater-components/faces/artist';
```

## Basic Usage

```svelte
<script lang="ts">
	import { ArtistTimeline } from '@equaltoai/greater-components/faces/artist';

	const artist = {
		id: 'artist-1',
		displayName: 'Jane Artist',
		username: 'janeartist',
		profileUrl: '/artists/janeartist',
		status: 'online',
		verified: true,
		commissionStatus: 'open',
		badges: [],
		stats: { followers: 1, following: 1, works: 1, exhibitions: 0, collaborations: 0, totalViews: 1 },
		sections: [],
		joinedAt: new Date().toISOString(),
	};

	const items = [
		{
			id: 't1',
			type: 'artwork',
			content: 'New piece: “Masterpiece”',
			createdAt: new Date().toISOString(),
			artwork: artworkData,
			engagement: { likes: 10, comments: 2, shares: 1 },
		},
	];
</script>

<ArtistTimeline {artist} {items} showSocial />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `artist` | `ArtistData` | - |
| `items` | `TimelineItem[]` | `[]` |
| `showSocial` | `boolean` | `true` |
| `onLoadMore` | `() => void \| Promise<void>` | - |
| `hasMore` | `boolean` | `false` |
| `class` | `string` | `''` |

## `TimelineItem` Shape

`TimelineItem` is exported from `ArtistProfile` context and supports optional `artwork` previews:

```ts
type TimelineItem = {
	id: string;
	type: 'post' | 'artwork' | 'exhibition' | 'collaboration' | 'milestone';
	content: string;
	createdAt: string | Date;
	artwork?: ArtworkData;
	engagement?: { likes: number; comments: number; shares: number };
};
```

## Notes

- For profile pages, `ArtistProfile.Timeline` provides a more compact timeline that respects `showSocial={false}` “professional mode”.

### Grouped by Year

```svelte
<ArtistTimeline {events} groupBy="year" collapsible={true} defaultExpanded={['2024']} />
```

## Filtering and Sorting

```svelte
<script lang="ts">
	let filterType = $state<string | null>(null);

	const filteredEvents = $derived(
		filterType ? events.filter((e) => e.type === filterType) : events
	);
</script>

<div class="timeline-filters">
	<button onclick={() => (filterType = null)}>All</button>
	<button onclick={() => (filterType = 'artwork')}>Artworks</button>
	<button onclick={() => (filterType = 'exhibition')}>Exhibitions</button>
	<button onclick={() => (filterType = 'award')}>Awards</button>
</div>

<ArtistTimeline events={filteredEvents} />
```

## Accessibility

### Keyboard Navigation

| Key         | Action                 |
| ----------- | ---------------------- |
| `Tab`       | Move to next event     |
| `Shift+Tab` | Move to previous event |
| `Enter`     | Expand/open event      |
| `Escape`    | Collapse event         |

### Screen Reader Support

```svelte
<ArtistTimeline {events} aria-label="Artist career timeline" announceOnNavigate={true} />
```

## Styling

### CSS Custom Properties

```css
.artist-timeline {
	--timeline-line-color: var(--color-border);
	--timeline-dot-color: var(--color-primary);
	--timeline-dot-size: 12px;
	--timeline-spacing: var(--space-6);
	--timeline-card-bg: var(--color-surface);
	--timeline-card-shadow: var(--shadow-sm);
}
```
