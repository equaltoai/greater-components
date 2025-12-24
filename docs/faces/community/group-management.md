# Community Face: Group Management

> Managing community settings, rules, and member roles.

The Community Face provides comprehensive tools for managing community configurations, membership, and governance.

## Community Components

```svelte
<script lang="ts">
	import { Community, Post, Thread } from '$lib/components/faces/community';
</script>

<Community.Root {community}>
	<Community.Header />
	<Community.Stats />
	<Community.RulesSidebar />
	<Community.ModeratorList />
</Community.Root>
```

## Community Settings

Configure community appearance and behavior:

```typescript
interface CommunitySettings {
	// Display
	name: string;
	title: string;
	description: string;
	icon?: string;
	banner?: string;

	// Posting rules
	allowImages: boolean;
	allowLinks: boolean;
	allowPolls: boolean;
	requireFlair: boolean;

	// Membership
	joinType: 'open' | 'request' | 'invite';
	minAccountAge?: number; // days
	minKarma?: number;

	// Visibility
	visibility: 'public' | 'restricted' | 'private';
	searchable: boolean;
}
```

## Rules Management

Define and display community rules:

```svelte
<script lang="ts">
	import { Community } from '$lib/components/faces/community';

	const rules = [
		{
			id: 'r1',
			title: 'Be respectful',
			description: 'Treat all community members with respect. No personal attacks or harassment.',
			order: 1,
		},
		{
			id: 'r2',
			title: 'Stay on topic',
			description: 'Posts should be relevant to the community purpose.',
			order: 2,
		},
	];
</script>

<Community.RulesSidebar {rules} editable={isModerator} onEdit={handleRuleEdit} />
```

## Member Management

```svelte
<script lang="ts">
	import { Community } from '$lib/components/faces/community';
</script>

<Community.MemberList
	{members}
	onBan={handleBan}
	onPromote={handlePromote}
	onRemove={handleRemove}
/>
```

### Member Roles

| Role          | Permissions                       |
| ------------- | --------------------------------- |
| `member`      | Post, comment, vote               |
| `contributor` | Member + bypass some restrictions |
| `moderator`   | Contributor + moderation tools    |
| `admin`       | Moderator + settings management   |
| `owner`       | Admin + delete community          |

## Flair System

Configure post and user flair:

```svelte
<script lang="ts">
	import { Flair } from '$lib/components/faces/community';

	const flairs = [
		{ id: 'f1', text: 'Discussion', color: '#3B82F6' },
		{ id: 'f2', text: 'Question', color: '#10B981' },
		{ id: 'f3', text: 'Announcement', color: '#EF4444' },
	];
</script>

<Flair.Picker {flairs} onSelect={handleFlairSelect} />
<Flair.Manager {flairs} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
```

## Join Requests

For restricted communities:

```svelte
<Community.JoinRequests
	requests={pendingRequests}
	onApprove={handleApprove}
	onReject={handleReject}
/>
```

## Analytics Dashboard

```svelte
<Community.Analytics period="30d" metrics={['members', 'posts', 'engagement']} />
```

## Related Documentation

- [Getting Started](./getting-started.md)
- [Moderation](./moderation.md)
- [Core Patterns](../../core-patterns.md)
