# Community Face: Moderation

> Moderation tools and workflows for community platforms.

The Community Face includes comprehensive moderation components for managing content, users, and community health.

## Installation

```bash
greater add moderation
```

## Moderation Components

```svelte
<script lang="ts">
	import { Moderation } from '$lib/components/faces/community';
</script>

<Moderation.Root {queue} {handlers}>
	<Moderation.Queue />
	<Moderation.Actions />
	<Moderation.Log />
</Moderation.Root>
```

## Moderation Queue

View and manage reported content:

```svelte
<script lang="ts">
	import { Moderation } from '$lib/components/faces/community';

	const queue = {
		items: [
			{
				id: 'r1',
				type: 'post',
				reason: 'spam',
				reportedBy: { id: 'u1', username: 'reporter' },
				content: { id: 'p1', title: 'Suspicious post' },
				createdAt: new Date().toISOString(),
			},
		],
		loading: false,
	};

	const handlers = {
		onApprove: async (item) => {
			await api.approveContent(item.id);
		},
		onRemove: async (item) => {
			await api.removeContent(item.id);
		},
		onBan: async (item) => {
			await api.banUser(item.reportedBy.id);
		},
	};
</script>

<Moderation.Queue {queue} {handlers} />
```

## Moderation Actions

Available actions for moderators:

| Action    | Description                   |
| --------- | ----------------------------- |
| `approve` | Mark content as acceptable    |
| `remove`  | Remove content from community |
| `warn`    | Send warning to user          |
| `mute`    | Temporarily mute user         |
| `ban`     | Permanently ban user          |
| `lock`    | Lock thread/comments          |

```svelte
<Moderation.Actions item={selectedItem} actions={['approve', 'remove', 'warn', 'ban']} {handlers} />
```

## Moderation Log

View history of moderation actions:

```svelte
<Moderation.Log
	entries={logEntries}
	showModerator={true}
	showReason={true}
	onFilter={handleFilter}
/>
```

## Auto-Moderation

Configure automatic moderation rules:

```typescript
const autoModConfig = {
	spamThreshold: 0.8,
	profanityFilter: true,
	linkFiltering: 'review', // 'allow' | 'review' | 'block'
	newUserRestrictions: {
		enabled: true,
		minAccountAge: 7, // days
		minKarma: 10,
	},
};
```

## Mod Permissions

```typescript
interface ModPermissions {
	canApprove: boolean;
	canRemove: boolean;
	canWarn: boolean;
	canMute: boolean;
	canBan: boolean;
	canEditRules: boolean;
	canManageMods: boolean;
}

const modRole: ModPermissions = {
	canApprove: true,
	canRemove: true,
	canWarn: true,
	canMute: true,
	canBan: false, // Requires admin
	canEditRules: false,
	canManageMods: false,
};
```

## Related Documentation

- [Getting Started](./getting-started.md)
- [Group Management](./group-management.md)
- [Core Patterns](../../core-patterns.md)
