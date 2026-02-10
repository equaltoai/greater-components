# Post interactions (reply / boost / favorite / share)

This example shows how to wire interaction handlers to `StatusCard` and how to provide an inline reply composer.

Notes:

- `ActionBar` disables each action when its handler is missing.
- If you pass `shareUrl`, the Share button uses the Web Share API when available, otherwise it copies the URL.
- `StatusCard` passes `shareUrl={status.url}` by default, so sharing/copying can work even if you don’t provide `onShare`.

```svelte
<script lang="ts">
	import { Compose, StatusCard } from '@equaltoai/greater-components/faces/social';
	import type { Status } from '@equaltoai/greater-components/faces/social';

	let status: Status;
	let replying = false;

	async function handleBoost(s: Status) {
		// await api.boost(s.id);
	}

	async function handleFavorite(s: Status) {
		// await api.favorite(s.id);
	}

	async function handleSubmitReply(data: {
		content: string;
		visibility: 'public' | 'unlisted' | 'private' | 'direct';
		inReplyTo?: string;
	}) {
		// await api.createPost(data);
		replying = false;
	}
</script>

<StatusCard
	{status}
	actionHandlers={{
		onReply: () => (replying = true),
		onBoost: handleBoost,
		onFavorite: handleFavorite,
	}}
/>

{#if replying}
	<Compose.Root initialState={{ inReplyTo: status.id }} handlers={{ onSubmit: handleSubmitReply }}>
		<Compose.Editor autofocus />
		<Compose.CharacterCount />
		<Compose.Submit text="Reply" />
	</Compose.Root>
{/if}
```
