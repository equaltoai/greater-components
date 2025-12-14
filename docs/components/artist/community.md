# Community Components

> Components for artist community features: critique circles, collaborations, and mentorship

## Overview

Community components facilitate artist interactions, structured feedback, collaborative projects, and mentorship connections.

## CritiqueCircle.Root

Structured critique group/space.

### Basic Usage

```svelte
<script lang="ts">
	import { CritiqueCircle } from '@equaltoai/greater-components-artist';

	const circle = {
		id: 'circle-1',
		name: 'Digital Art Critique Group',
		description: 'Weekly critique sessions for digital artists',
		members: membersList,
		moderators: moderatorsList,
		schedule: 'Saturdays 2PM EST',
		rules: critiqueRules,
	};
</script>

<CritiqueCircle.Root {circle} membership="member">
	<CritiqueCircle.Queue />
	<CritiqueCircle.Session />
	<CritiqueCircle.History />
	<CritiqueCircle.Members />
</CritiqueCircle.Root>
```

### Props

| Prop         | Type                                  | Default    | Description |
| ------------ | ------------------------------------- | ---------- | ----------- |
| `circle`     | `CritiqueCircleData`                  | required   | Circle data |
| `membership` | `'member' \| 'moderator' \| 'viewer'` | `'viewer'` | User role   |

### Subcomponents

#### CritiqueCircle.Queue

Critique request queue.

```svelte
<CritiqueCircle.Queue showPosition={true} allowReorder={membership === 'moderator'} />
```

#### CritiqueCircle.Session

Active critique session.

```svelte
<CritiqueCircle.Session artwork={currentArtwork} timeLimit={15} showTimer={true} />
```

#### CritiqueCircle.History

Past critiques.

```svelte
<CritiqueCircle.History filter="my-submissions" showFeedback={true} />
```

#### CritiqueCircle.Members

Circle membership.

```svelte
<CritiqueCircle.Members showRoles={true} showActivity={true} />
```

## Collaboration.Root

Multi-artist collaboration space.

### Basic Usage

```svelte
<script lang="ts">
	import { Collaboration } from '@equaltoai/greater-components-artist';

	const project = {
		id: 'collab-1',
		title: 'Community Mural Project',
		description: 'Collaborative digital mural for city arts initiative',
		contributors: contributorsList,
		status: 'in-progress',
		uploads: projectUploads,
	};
</script>

<Collaboration.Root {project}>
	<Collaboration.Project />
	<Collaboration.Contributors />
	<Collaboration.Uploads />
	<Collaboration.Gallery />
	<Collaboration.Split />
</Collaboration.Root>
```

### Subcomponents

#### Collaboration.Project

Project overview.

```svelte
<Collaboration.Project showTimeline={true} showMilestones={true} />
```

#### Collaboration.Contributors

Artist attribution chain.

```svelte
<Collaboration.Contributors showRoles={true} showContributions={true} />
```

#### Collaboration.Uploads

Contribution management.

```svelte
<Collaboration.Uploads allowUpload={isContributor} showVersions={true} />
```

#### Collaboration.Gallery

Collaborative gallery.

```svelte
<Collaboration.Gallery layout="masonry" showAttribution={true} />
```

#### Collaboration.Split

Revenue/credit split.

```svelte
<Collaboration.Split splits={revenueSplits} editable={isOwner} />
```

## MentorMatch

Mentor-mentee connection interface.

### Basic Usage

```svelte
<script lang="ts">
	import { MentorMatch } from '@equaltoai/greater-components-artist';

	const filters = {
		medium: ['digital-art', 'illustration'],
		experience: 'intermediate',
		availability: 'weekly',
	};
</script>

<MentorMatch mode="find-mentor" {filters} onMatch={handleMatch} />
```

### Props

| Prop      | Type                                         | Default  | Description       |
| --------- | -------------------------------------------- | -------- | ----------------- |
| `mode`    | `'find-mentor' \| 'find-mentee' \| 'active'` | required | Interface mode    |
| `filters` | `MentorFilters`                              | `{}`     | Matching criteria |

### Modes

#### Find Mentor

```svelte
<MentorMatch
	mode="find-mentor"
	filters={{
		specialties: ['character-design'],
		experience: '5+ years',
		style: 'structured',
	}}
/>
```

#### Find Mentee

```svelte
<MentorMatch
	mode="find-mentee"
	filters={{
		level: 'beginner',
		commitment: 'serious',
		goals: ['portfolio-building'],
	}}
/>
```

#### Active Mentorship

```svelte
<MentorMatch mode="active" relationship={mentorshipData} showProgress={true} showSchedule={true} />
```

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

<Collaboration.Root {project} aria-label="Collaboration project: {project.title}" />
```
