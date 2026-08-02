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

## Standalone package

```ts
import * as Messaging from '@equaltoai/greater-components-messaging';
```
