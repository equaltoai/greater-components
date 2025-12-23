# @equaltoai/greater-components-notifications

Notification feed components for Greater Components.

## Usage (recommended)

```svelte
<script>
	import { Notifications } from '@equaltoai/greater-components/shared/notifications';
</script>

<Notifications.Root {notifications}>
	{#each notifications as notification}
		<Notifications.Item {notification} />
	{/each}
</Notifications.Root>
```

## Standalone package

```ts
import { Notifications } from '@equaltoai/greater-components-notifications';
```
