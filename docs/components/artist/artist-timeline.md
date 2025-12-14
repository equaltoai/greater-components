# Artist Timeline Component

> Career timeline and activity feed for artist profiles

## Overview

The ArtistTimeline component displays an artist's career milestones, exhibitions, awards, and recent activity in a chronological format.

## Basic Usage

```svelte
<script lang="ts">
	import { ArtistTimeline } from '@equaltoai/greater-components-artist';
	import type { TimelineEvent } from '@equaltoai/greater-components-artist/types';

	const events: TimelineEvent[] = [
		{
			id: '1',
			type: 'exhibition',
			title: 'Solo Exhibition at Modern Gallery',
			description: 'First solo show featuring 20 new works',
			date: '2024-03-15',
			location: 'New York, NY',
			imageUrl: '/exhibitions/modern-gallery.jpg',
		},
		{
			id: '2',
			type: 'award',
			title: 'Emerging Artist Award',
			description: 'Recognized for innovative use of mixed media',
			date: '2024-01-20',
		},
		{
			id: '3',
			type: 'artwork',
			title: 'New Work: "Reflections"',
			date: '2024-02-10',
			imageUrl: '/artworks/reflections.jpg',
			link: '/artwork/reflections',
		},
	];
</script>

<ArtistTimeline {events} layout="vertical" />
```

## Props

| Prop         | Type                          | Default      | Description             |
| ------------ | ----------------------------- | ------------ | ----------------------- |
| `events`     | `TimelineEvent[]`             | `[]`         | Timeline events         |
| `layout`     | `'vertical' \| 'horizontal'`  | `'vertical'` | Layout orientation      |
| `groupBy`    | `'year' \| 'month' \| 'none'` | `'year'`     | Event grouping          |
| `showImages` | `boolean`                     | `true`       | Show event images       |
| `maxEvents`  | `number`                      | -            | Maximum events to show  |
| `expandable` | `boolean`                     | `true`       | Allow expanding details |

## Timeline Event Types

### Artwork Events

```typescript
const artworkEvent: TimelineEvent = {
	id: '1',
	type: 'artwork',
	title: 'New Work: "Sunset Dreams"',
	description: 'Oil on canvas, 24x36 inches',
	date: '2024-03-01',
	imageUrl: '/artworks/sunset-dreams.jpg',
	link: '/artwork/sunset-dreams',
};
```

### Exhibition Events

```typescript
const exhibitionEvent: TimelineEvent = {
	id: '2',
	type: 'exhibition',
	title: 'Group Show: "New Perspectives"',
	description: 'Featured alongside 12 contemporary artists',
	date: '2024-02-15',
	endDate: '2024-04-15',
	location: 'Gallery XYZ, Los Angeles',
	imageUrl: '/exhibitions/new-perspectives.jpg',
	link: 'https://galleryxyz.com/new-perspectives',
};
```

### Award Events

```typescript
const awardEvent: TimelineEvent = {
	id: '3',
	type: 'award',
	title: 'Best in Show - Regional Art Fair',
	description: 'Awarded for "Morning Light" series',
	date: '2024-01-10',
	imageUrl: '/awards/regional-fair.jpg',
};
```

### Education Events

```typescript
const educationEvent: TimelineEvent = {
	id: '4',
	type: 'education',
	title: 'MFA in Fine Arts',
	description: 'Rhode Island School of Design',
	date: '2020-05-15',
	endDate: '2022-05-15',
	location: 'Providence, RI',
};
```

### Milestone Events

```typescript
const milestoneEvent: TimelineEvent = {
	id: '5',
	type: 'milestone',
	title: '1000 Followers',
	description: 'Reached 1000 followers on the platform',
	date: '2024-02-28',
};
```

### Collaboration Events

```typescript
const collaborationEvent: TimelineEvent = {
	id: '6',
	type: 'collaboration',
	title: 'Collaboration with @artist2',
	description: 'Joint mural project for city arts initiative',
	date: '2024-03-10',
	imageUrl: '/collaborations/mural.jpg',
	link: '/collaboration/city-mural',
};
```

### Publication Events

```typescript
const publicationEvent: TimelineEvent = {
	id: '7',
	type: 'publication',
	title: 'Featured in Art Monthly',
	description: 'Interview and portfolio feature',
	date: '2024-01-05',
	link: 'https://artmonthly.com/jane-artist',
};
```

### Residency Events

```typescript
const residencyEvent: TimelineEvent = {
	id: '8',
	type: 'residency',
	title: 'Artist Residency - Mountain Studio',
	description: '3-month residency focusing on landscape work',
	date: '2023-06-01',
	endDate: '2023-09-01',
	location: 'Aspen, CO',
	imageUrl: '/residencies/mountain-studio.jpg',
};
```

## Social Interaction Patterns

### Activity Feed Integration

```svelte
<script lang="ts">
	import { ArtistTimeline } from '@equaltoai/greater-components-artist';

	// Combine career events with recent activity
	const combinedEvents = [
		...careerEvents,
		...recentActivity.map((activity) => ({
			id: activity.id,
			type: 'artwork',
			title: activity.title,
			date: activity.createdAt,
			imageUrl: activity.thumbnailUrl,
			link: `/artwork/${activity.id}`,
		})),
	];
</script>

<ArtistTimeline events={combinedEvents} groupBy="month" />
```

### Interactive Timeline

```svelte
<ArtistTimeline
	{events}
	onEventClick={(event) => {
		if (event.link) {
			goto(event.link);
		}
	}}
	onEventHover={(event) => {
		showPreview(event);
	}}
/>
```

## WIP Tracking Integration

### Linking WIP Threads

```svelte
<script lang="ts">
	import { ArtistTimeline, WorkInProgress } from '@equaltoai/greater-components-artist';

	// Convert WIP threads to timeline events
	const wipEvents = wipThreads.map((thread) => ({
		id: thread.id,
		type: 'artwork' as const,
		title: `WIP: ${thread.title}`,
		description: `${thread.versions.length} versions`,
		date: thread.createdAt,
		imageUrl: thread.latestVersion.imageUrl,
		link: `/wip/${thread.id}`,
	}));
</script>

<ArtistTimeline events={[...careerEvents, ...wipEvents]} />
```

### Progress Milestones

```svelte
<ArtistTimeline
	{events}
	showProgress={true}
	progressMilestones={[
		{ count: 10, label: '10 Artworks' },
		{ count: 50, label: '50 Artworks' },
		{ count: 100, label: '100 Artworks' },
	]}
/>
```

## Layout Options

### Vertical Timeline

```svelte
<ArtistTimeline {events} layout="vertical" alternating={true} />
```

### Horizontal Timeline

```svelte
<ArtistTimeline {events} layout="horizontal" scrollable={true} />
```

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
