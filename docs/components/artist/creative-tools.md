# Creative Tools Components (Artist Face)

> WIP threads, critique UI, reference boards, and commission workflow scaffolding

## Imports

```ts
import { WorkInProgress } from '$lib/components/CreativeTools/WorkInProgress';
import { CritiqueMode } from '$lib/components/CreativeTools/CritiqueMode';
import ReferenceBoard from '$lib/components/CreativeTools/ReferenceBoard.svelte';
import { CommissionWorkflow } from '$lib/components/CreativeTools/CommissionWorkflow';
```

## `WorkInProgress`

Work-in-progress documentation as a compound component (thread header, updates list, comparison, timeline, comments).

```svelte
<script lang="ts">
	import { WorkInProgress } from '$lib/components/CreativeTools/WorkInProgress';

	const thread = {
		id: 'wip-1',
		title: 'Portrait Commission — Progress',
		artistId: 'artist-1',
		artistName: 'Jane Artist',
		updates: [
			{
				id: 'u1',
				content: 'Initial sketch and composition.',
				media: [{ type: 'image', url: '/wip/v1.jpg', thumbnailUrl: '/wip/v1-thumb.jpg' }],
				progress: 10,
				createdAt: '2024-03-01T10:00:00Z',
			},
		],
		currentProgress: 10,
		isComplete: false,
		createdAt: '2024-03-01T10:00:00Z',
	};
</script>

<WorkInProgress.Root {thread} isOwner={true}>
	<WorkInProgress.Header />
	<WorkInProgress.VersionList />
	<WorkInProgress.Compare />
	<WorkInProgress.Timeline />
	<WorkInProgress.Comments />
</WorkInProgress.Root>
```

### `WorkInProgress.Root` Props

| Prop               | Type            | Default |
| ------------------ | --------------- | ------- |
| `thread`           | `WIPThreadData` | -       |
| `handlers`         | `WIPHandlers`   | `{}`    |
| `isOwner`          | `boolean`       | `false` |
| `showTimeline`     | `boolean`       | `true`  |
| `showComments`     | `boolean`       | `true`  |
| `enableComparison` | `boolean`       | `true`  |
| `showProgress`     | `boolean`       | `true`  |
| `allowUpdates`     | `boolean`       | `false` |
| `class`            | `string`        | `''`    |
| `children`         | `Snippet`       | -       |

## `CritiqueMode`

Structured critique UI for a single artwork, with an interactive image view and an annotation layer.

```svelte
<CritiqueMode.Root {artwork} categories={['composition', 'color']} enableDrawing={true}>
	<CritiqueMode.Image />
	<CritiqueMode.Annotations />
</CritiqueMode.Root>
```

### `CritiqueMode.Root` Props

| Prop                 | Type                    | Default |
| -------------------- | ----------------------- | ------- |
| `artwork`            | `ArtworkData`           | -       |
| `handlers`           | `CritiqueHandlers`      | `{}`    |
| `initialAnnotations` | `CritiqueAnnotation[]`  | `[]`    |
| `enableAnnotations`  | `boolean`               | `true`  |
| `enableDrawing`      | `boolean`               | `true`  |
| `showCategories`     | `boolean`               | `true`  |
| `categories`         | `string[] \| undefined` | -       |
| `class`              | `string`                | `''`    |
| `children`           | `Snippet`               | -       |

## `ReferenceBoard`

Standalone mood board / reference collection component.

```svelte
<script lang="ts">
	import ReferenceBoard from '$lib/components/CreativeTools/ReferenceBoard.svelte';

	const board = {
		id: 'board-1',
		title: 'Landscape References',
		ownerId: 'artist-1',
		items: [
			{
				id: 'ref-1',
				imageUrl: '/refs/mountains.jpg',
				position: { x: 0.1, y: 0.1 },
				size: { width: 240, height: 180 },
			},
		],
		dimensions: { width: 1200, height: 800 },
		isPublic: false,
		createdAt: new Date().toISOString(),
	};
</script>

<ReferenceBoard {board} editable={true} layout="freeform" />
```

| Prop          | Type                     | Default      |
| ------------- | ------------------------ | ------------ |
| `board`       | `ReferenceBoardData`     | -            |
| `editable`    | `boolean`                | `false`      |
| `showSources` | `boolean`                | `true`       |
| `handlers`    | `ReferenceBoardHandlers` | `{}`         |
| `layout`      | `'grid' \| 'freeform'`   | `'freeform'` |
| `class`       | `string`                 | `''`         |

## `CommissionWorkflow`

Commission workflow scaffolding (step nav + context). You provide the step content.

```svelte
<script lang="ts">
	import { CommissionWorkflow } from '$lib/components/CreativeTools/CommissionWorkflow';

	const commission = {
		id: 'comm-1',
		title: 'Cat Portrait',
		description: 'Portrait of my cat in Renaissance style.',
		artistId: 'artist-1',
		artistName: 'Jane Artist',
		clientId: 'client-1',
		clientName: 'Alex Client',
		status: 'in-progress',
		createdAt: new Date().toISOString(),
	};
</script>

<CommissionWorkflow.Root {commission} role="artist">
	<!-- Render your step UI here -->
	<div>Current step content…</div>
</CommissionWorkflow.Root>
```

| Prop         | Type                   | Default |
| ------------ | ---------------------- | ------- |
| `commission` | `CommissionData`       | -       |
| `role`       | `'artist' \| 'client'` | -       |
| `handlers`   | `CommissionHandlers`   | `{}`    |
| `class`      | `string`               | `''`    |
| `children`   | `Snippet`              | -       |
