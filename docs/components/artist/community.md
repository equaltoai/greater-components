# Community Components

> Components for artist community features: critique circles, collaborations, and mentorship

## Overview

Community components facilitate artist interactions, structured feedback, collaborative projects, and mentorship connections.

## CritiqueCircle.Root

Structured critique group/space.

### Basic Usage

```svelte
<script lang="ts">
	import { CritiqueCircle } from '$lib/components/Community/CritiqueCircle';

	const circle = /* load from your backend */ null as any;
	const handlers = {
		onSubmit: async (_circle, _artwork, _feedbackRequested) => {},
		onCritique: async (_submission, _annotations, _summary) => {},
	};
</script>

<CritiqueCircle.Root {circle} membership="member" {handlers}>
	<CritiqueCircle.Queue />
	<CritiqueCircle.Session />
	<CritiqueCircle.History />
	<CritiqueCircle.Members />
</CritiqueCircle.Root>
```

### Props

| Prop                      | Type                                  | Default    | Description                         |
| ------------------------- | ------------------------------------- | ---------- | ----------------------------------- |
| `circle`                  | `CritiqueCircleData`                  | required   | Circle data (queue/history/members) |
| `membership`              | `'member' \| 'moderator' \| 'viewer'` | `'viewer'` | User role                           |
| `handlers`                | `CritiqueCircleHandlers`              | `{}`       | Interaction callbacks               |
| `showQueue`               | `boolean`                             | `true`     | Show queue panel                    |
| `showSession`             | `boolean`                             | `true`     | Show active session                 |
| `showHistory`             | `boolean`                             | `true`     | Show history panel                  |
| `showMembers`             | `boolean`                             | `true`     | Show members panel                  |
| `enableAnonymousFeedback` | `boolean`                             | `true`     | Allow anonymous feedback            |
| `class`                   | `string`                              | `''`       | Custom class                        |
| `children`                | `Snippet`                             | required   | Compound children                   |

### Subcomponents

All `CritiqueCircle.*` subcomponents are context-driven; they do not take `circle` props directly (only `class`).

## Collaboration.Root

Multi-artist collaboration space.

### Basic Usage

```svelte
<script lang="ts">
	import { Collaboration } from '$lib/components/Community/Collaboration';

	const collaboration = /* load from your backend */ null as any;
	const handlers = {
		onUploadAsset: async (_collaboration, _file) => {},
	};
</script>

<Collaboration.Root {collaboration} role="contributor" {handlers}>
	<Collaboration.Project />
	<Collaboration.Contributors />
	<Collaboration.Uploads />
	<Collaboration.Gallery />
	<Collaboration.Split />
</Collaboration.Root>
```

### Subcomponents

All `Collaboration.*` subcomponents are context-driven; they do not take `collaboration` props directly (only `class`).

## MentorMatch

Mentor-mentee connection interface.

### Basic Usage

```svelte
<script lang="ts">
	import MentorMatch from '$lib/components/Community/MentorMatch.svelte';

	const filters = { styles: ['digital-art', 'illustration'], menteeLevel: 'intermediate' };
	const handlers = {
		onSearch: (nextFilters) => console.log('search', nextFilters),
		onRequestMentorship: (mentor, program) => console.log('request', mentor.id, program),
	};
</script>

<MentorMatch mode="find-mentor" {filters} {handlers} />
```

### Props

| Prop       | Type                                         | Default         | Description                |
| ---------- | -------------------------------------------- | --------------- | -------------------------- |
| `mode`     | `'find-mentor' \| 'find-mentee' \| 'active'` | `'find-mentor'` | Interface mode             |
| `filters`  | `MentorFilters`                              | `{}`            | Matching criteria          |
| `matches`  | `MentorMatch[]`                              | `[]`            | Candidate matches          |
| `handlers` | `MentorMatchHandlers`                        | `{}`            | Callbacks (search/request) |

## Accessibility

### Keyboard Navigation

| Key      | Action                    |
| -------- | ------------------------- |
| `Tab`    | Navigate between elements |
| `Enter`  | Select/activate           |
| `Escape` | Close/cancel              |

### Screen Reader Support

```svelte
<CritiqueCircle.Root {circle} aria-label="Critique circle: {circle.name}" />

<Collaboration.Root {collaboration} aria-label="Collaboration: {collaboration.title}" />
```
