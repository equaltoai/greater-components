# Creative Tools Components

> Components supporting the artistic process: WIP tracking, critique, reference boards, and commissions

## Overview

Creative Tools components support artists throughout their creative process, from initial concept to final delivery, including work-in-progress documentation, structured critique, reference collection, and commission management.

## WorkInProgress.Root

Work-in-progress documentation thread with version control.

### Basic Usage

```svelte
<script lang="ts">
	import { WorkInProgress } from '@equaltoai/greater-components-artist';
	import type { WIPThreadData } from '@equaltoai/greater-components-artist/types';

	const thread: WIPThreadData = {
		id: 'wip-1',
		title: 'Portrait Commission - Progress',
		artist: artistData,
		versions: [
			{
				id: 'v1',
				imageUrl: '/wip/portrait-v1.jpg',
				notes: 'Initial sketch and composition',
				createdAt: '2024-03-01T10:00:00Z',
			},
			{
				id: 'v2',
				imageUrl: '/wip/portrait-v2.jpg',
				notes: 'Added base colors and refined proportions',
				createdAt: '2024-03-03T14:30:00Z',
			},
			{
				id: 'v3',
				imageUrl: '/wip/portrait-v3.jpg',
				notes: 'Detail work on face and lighting',
				createdAt: '2024-03-05T09:15:00Z',
			},
		],
		status: 'in-progress',
		createdAt: '2024-03-01T10:00:00Z',
	};
</script>

<WorkInProgress.Root {thread}>
	<WorkInProgress.Header />
	<WorkInProgress.VersionList />
	<WorkInProgress.Timeline />
	<WorkInProgress.Comments />
</WorkInProgress.Root>
```

### Props

| Prop       | Type            | Default  | Description     |
| ---------- | --------------- | -------- | --------------- |
| `thread`   | `WIPThreadData` | required | WIP thread data |
| `handlers` | `WIPHandlers`   | `{}`     | Event handlers  |
| `editable` | `boolean`       | `false`  | Allow editing   |

### Subcomponents

#### WorkInProgress.Header

```svelte
<WorkInProgress.Header showStatus={true} showArtist={true} />
```

#### WorkInProgress.VersionList

```svelte
<WorkInProgress.VersionList layout="grid" showNotes={true} showTimestamps={true} />
```

#### WorkInProgress.VersionCard

```svelte
<WorkInProgress.VersionCard {version} expandable={true} showComparison={true} />
```

#### WorkInProgress.Compare

Side-by-side version comparison.

```svelte
<WorkInProgress.Compare versions={[versions[0], versions[2]]} mode="slider" />
```

| Prop       | Type                                      | Default    | Description         |
| ---------- | ----------------------------------------- | ---------- | ------------------- |
| `versions` | `[Version, Version]`                      | required   | Versions to compare |
| `mode`     | `'slider' \| 'side-by-side' \| 'overlay'` | `'slider'` | Comparison mode     |

#### WorkInProgress.Timeline

Visual progress timeline.

```svelte
<WorkInProgress.Timeline showMilestones={true} interactive={true} />
```

#### WorkInProgress.Comments

Threaded discussion.

```svelte
<WorkInProgress.Comments allowReplies={true} showTimestamps={true} />
```

## CritiqueMode.Root

Structured artwork critique interface.

### Basic Usage

```svelte
<script lang="ts">
	import { CritiqueMode } from '@equaltoai/greater-components-artist';

	const critiqueConfig = {
		allowAnnotations: true,
		categories: ['composition', 'color', 'technique', 'concept'],
		requireStructuredFeedback: true,
	};
</script>

<CritiqueMode.Root {artwork} config={critiqueConfig}>
	<CritiqueMode.Image />
	<CritiqueMode.Annotations />
	<CritiqueMode.Questions />
	<CritiqueMode.Feedback />
</CritiqueMode.Root>
```

### Props

| Prop      | Type             | Default  | Description             |
| --------- | ---------------- | -------- | ----------------------- |
| `artwork` | `ArtworkData`    | required | Artwork being critiqued |
| `config`  | `CritiqueConfig` | `{}`     | Critique settings       |

### Subcomponents

#### CritiqueMode.Image

Annotatable artwork display.

```svelte
<CritiqueMode.Image enableAnnotations={true} annotationTools={['point', 'rectangle', 'freehand']} />
```

#### CritiqueMode.Annotations

Visual annotation layer.

```svelte
<CritiqueMode.Annotations {annotations} editable={true} showAuthors={true} />
```

#### CritiqueMode.Questions

Artist's specific questions for feedback.

```svelte
<CritiqueMode.Questions
	questions={[
		'Does the composition feel balanced?',
		'How is the color harmony?',
		'Any suggestions for the background?',
	]}
/>
```

#### CritiqueMode.Feedback

Structured feedback form.

```svelte
<CritiqueMode.Feedback
	categories={['composition', 'color', 'technique']}
	ratingScale={5}
	requireComments={true}
/>
```

## ReferenceBoard

Mood board / reference collection tool.

### Basic Usage

```svelte
<script lang="ts">
	import { ReferenceBoard } from '@equaltoai/greater-components-artist';

	const board = {
		id: 'board-1',
		title: 'Fantasy Landscape References',
		items: [
			{ id: '1', imageUrl: '/refs/mountains.jpg', source: 'Unsplash' },
			{ id: '2', imageUrl: '/refs/forest.jpg', source: 'Personal photo' },
			{ id: '3', imageUrl: '/refs/sky.jpg', source: 'ArtStation' },
		],
	};
</script>

<ReferenceBoard {board} editable={true} showSources={true} />
```

### Props

| Prop          | Type                   | Default  | Description          |
| ------------- | ---------------------- | -------- | -------------------- |
| `board`       | `ReferenceBoardData`   | required | Board data           |
| `editable`    | `boolean`              | `false`  | Enable editing       |
| `showSources` | `boolean`              | `true`   | Show artwork sources |
| `layout`      | `'grid' \| 'freeform'` | `'grid'` | Board layout         |

### Features

```svelte
<ReferenceBoard
	{board}
	editable={true}
	features={{
		dragAndDrop: true,
		resize: true,
		colorPicker: true,
		notes: true,
		grouping: true,
	}}
/>
```

## CommissionWorkflow.Root

Commission management interface.

### Basic Usage

```svelte
<script lang="ts">
	import { CommissionWorkflow } from '@equaltoai/greater-components-artist';

	const commission = {
		id: 'comm-1',
		status: 'in-progress',
		client: clientData,
		artist: artistData,
		request: {
			description: 'Portrait of my cat in Renaissance style',
			references: ['/refs/cat.jpg', '/refs/renaissance.jpg'],
			deadline: '2024-04-15',
		},
		quote: {
			amount: 350,
			currency: 'USD',
			deliverables: ['High-res digital file', '2 revisions'],
			timeline: '2 weeks',
		},
		progress: [
			{ stage: 'sketch', status: 'completed', imageUrl: '/wip/sketch.jpg' },
			{ stage: 'colors', status: 'in-progress', imageUrl: '/wip/colors.jpg' },
		],
	};
</script>

<CommissionWorkflow.Root {commission} role="artist">
	<CommissionWorkflow.Request />
	<CommissionWorkflow.Quote />
	<CommissionWorkflow.Contract />
	<CommissionWorkflow.Progress />
	<CommissionWorkflow.Delivery />
</CommissionWorkflow.Root>
```

### Props

| Prop         | Type                   | Default  | Description     |
| ------------ | ---------------------- | -------- | --------------- |
| `commission` | `CommissionData`       | required | Commission data |
| `role`       | `'artist' \| 'client'` | required | User role       |

### Workflow Stages

#### CommissionWorkflow.Request

Initial commission request.

```svelte
<CommissionWorkflow.Request showReferences={true} showDeadline={true} />
```

#### CommissionWorkflow.Quote

Artist quote/proposal.

```svelte
<CommissionWorkflow.Quote editable={role === 'artist'} showBreakdown={true} />
```

#### CommissionWorkflow.Contract

Terms agreement.

```svelte
<CommissionWorkflow.Contract terms={contractTerms} requireSignature={true} />
```

#### CommissionWorkflow.Progress

WIP updates.

```svelte
<CommissionWorkflow.Progress
	stages={['sketch', 'lineart', 'colors', 'final']}
	showTimeline={true}
/>
```

#### CommissionWorkflow.Delivery

Final delivery.

```svelte
<CommissionWorkflow.Delivery files={deliveryFiles} showDownload={true} />
```

#### CommissionWorkflow.Payment

Payment handling.

```svelte
<CommissionWorkflow.Payment
	amount={commission.quote.amount}
	currency={commission.quote.currency}
	milestones={['50% upfront', '50% on delivery']}
/>
```

## Accessibility

### Keyboard Navigation

All creative tools support full keyboard navigation:

| Key          | Action                     |
| ------------ | -------------------------- |
| `Tab`        | Move between elements      |
| `Enter`      | Activate/select            |
| `Escape`     | Cancel/close               |
| `Arrow keys` | Navigate within components |

### Screen Reader Support

```svelte
<WorkInProgress.Root {thread} aria-label="Work in progress thread" announceUpdates={true} />

<CritiqueMode.Root {artwork} aria-label="Artwork critique interface" />
```
