# @equaltoai/greater-components-messaging

Direct messaging components for Greater Components.

## Usage (recommended)

```svelte
<script>
	import * as Messaging from '@equaltoai/greater-components/shared/messaging';
</script>

<Messaging.Root>
	<Messaging.Conversations />
	<Messaging.Thread />
	<Messaging.Composer />
</Messaging.Root>
```

Message `content` is treated as server-rendered HTML and passed through Greater's allow-list
sanitizer before rendering. Conversation cards intentionally show a sanitized plain-text excerpt so
the single-line preview cannot introduce nested block or interactive markup.

### Folder routing and request actions

`Conversations` exposes a bindable `folder` prop instead of a mount-only initial value so URL state
and tab changes can stay synchronized. Omitting it preserves the existing context-owned Inbox
behavior and single-button card markup.

```svelte
<script lang="ts">
	import * as Messaging from '@equaltoai/greater-components/shared/messaging';

	let folder: Messaging.ConversationFolder = $state('REQUESTS');
</script>

<Messaging.Conversations bind:folder>
	{#snippet actions(conversation)}
		<button type="button" onclick={() => acceptRequest(conversation.id)}>Accept</button>
		<button type="button" onclick={() => declineRequest(conversation.id)}>Decline</button>
	{/snippet}
</Messaging.Conversations>
```

When `actions` is supplied, the card selection button and action controls are siblings, avoiding
nested interactive elements while keeping the entire default card as the selection button when the
snippet is omitted.

`UnreadIndicator` counts conversations whose `unreadCount` is positive. Its accessible label names
that unit explicitly (for example, “2 conversations with unread messages”); Lesser's pinned contract
exposes unread activity per conversation rather than a per-message unread total.

## Standalone package

```ts
import * as Messaging from '@equaltoai/greater-components-messaging';
```
