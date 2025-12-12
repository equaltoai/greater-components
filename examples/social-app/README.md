# Social App Example

A complete SvelteKit application demonstrating Greater Components social face usage.

## Features

- 📱 Timeline with virtual scrolling
- 📝 Status/post display with actions
- 👤 User profile components
- ✍️ Compose box for new posts
- 🔔 Notifications feed
- 🔍 Search functionality

## Quick Start

```bash
# Install dependencies
pnpm install

# Initialize Greater Components
greater init --face social

# Add social face components
greater add faces/social

# Start development server
pnpm dev
```

## Project Structure

```
social-app/
├── src/
│   ├── lib/
│   │   └── components/
│   │       └── ui/          # Greater Components (added via CLI)
│   │           ├── Timeline/
│   │           ├── Status/
│   │           ├── Profile/
│   │           └── ...
│   └── routes/
│       ├── +layout.svelte   # Root layout with CSS imports
│       ├── +page.svelte     # Home timeline
│       ├── profile/
│       │   └── [id]/
│       │       └── +page.svelte
│       └── compose/
│           └── +page.svelte
├── components.json          # Greater Components config
├── package.json
└── svelte.config.js
```

## Usage Examples

### Timeline

```svelte
<script>
	import Timeline from '$lib/components/ui/Timeline/Timeline.svelte';
	import { createTimelineStore } from '$lib/stores/timeline';

	const timeline = createTimelineStore({ type: 'home' });
</script>

<Timeline
	statuses={$timeline.items}
	loading={$timeline.loading}
	onLoadMore={() => timeline.loadMore()}
/>
```

### Status Card

```svelte
<script>
	import * as Status from '$lib/components/ui/Status';
</script>

<Status.Root {status}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions onReply={handleReply} onBoost={handleBoost} onFavorite={handleFavorite} />
</Status.Root>
```

### Compose Box

```svelte
<script>
	import ComposeBox from '$lib/components/ui/Compose/ComposeBox.svelte';
</script>

<ComposeBox onSubmit={handleSubmit} placeholder="What's on your mind?" maxLength={500} />
```

## Customization

Components are in your `src/lib/components/ui/` directory. Modify them directly:

```svelte
<!-- src/lib/components/ui/Status/Actions.svelte -->
<script>
	// Add custom action
	let { onCustomAction } = $props();
</script>

<button onclick={onCustomAction}> Custom Action </button>
```

## Learn More

- [CLI Guide](../../docs/cli-guide.md)
- [Social Face Documentation](../../packages/faces/social/README.md)
- [Core Patterns](../../docs/core-patterns.md)
