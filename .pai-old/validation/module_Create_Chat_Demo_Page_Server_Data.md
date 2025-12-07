# Module: Create Chat Demo Page Server Data

## Type: creation

## Files:
[apps/playground/src/routes/chat/+page.server.ts]

## File Changes:
- apps/playground/src/routes/chat/+page.server.ts: BEFORE: DOES NOT EXIST | AFTER: <<<
```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		metadata: {
			slug: 'chat',
			title: 'Chat Components',
			description:
				'AI chat interface components for building conversational UIs with streaming responses, tool calls, and configurable settings.',
		},
	};
};
```
>>> | TYPE: content creation | DESC: Create server-side data loader for chat demo page metadata with correct DemoMetadata structure including slug field
