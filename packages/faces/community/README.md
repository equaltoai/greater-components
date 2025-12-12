# @equaltoai/greater-components-community

Community/Reddit-style UI components for Greater Components. Build forum-based discussion applications with nested threading, voting systems, flair management, and moderation tools.

## Installation

```bash
pnpm add @equaltoai/greater-components-community
```

## Features

- **Community Management** - Display and manage forum communities with stats, rules, and settings
- **Post System** - Card-based post listings with multiple display densities
- **Nested Threading** - Collapsible comment trees with infinite nesting
- **Voting System** - Upvote/downvote with score display and ratio
- **Flair System** - Post and user flairs with custom colors and emojis
- **Moderation Tools** - Queue management, user banning, spam filtering
- **Wiki Pages** - Community wiki with revision history
- **Sorting Algorithms** - Hot, new, top, controversial, rising

## Quick Start

```svelte
<script>
	import { Community, Post, Thread } from '@equaltoai/greater-components-community';
	import '@equaltoai/greater-components-community/style.css';
</script>

<!-- Community Header -->
<Community.Root community={communityData}>
	<Community.Header />
	<Community.RulesSidebar />
</Community.Root>

<!-- Post Listing -->
<Post.Root post={postData}>
	<Post.Header />
	<Post.Content />
	<Post.Footer />
</Post.Root>

<!-- Comment Thread -->
<Thread.Root thread={threadData}>
	<Thread.View />
</Thread.Root>
```

## Components

### Compound Components

| Component    | Description                                 |
| ------------ | ------------------------------------------- |
| `Community`  | Community display with header, rules, stats |
| `Post`       | Forum post with voting, flair, actions      |
| `Thread`     | Nested comment threading                    |
| `Voting`     | Upvote/downvote buttons and score           |
| `Flair`      | Post and user flair selection               |
| `Moderation` | Mod queue, actions, ban dialog              |
| `Wiki`       | Community wiki pages                        |

### Standalone Components

| Component         | Description                           |
| ----------------- | ------------------------------------- |
| `CommunityIndex`  | List of communities with subscription |
| `CommunityHeader` | Community banner and info             |
| `PostListing`     | Sortable post list                    |
| `ThreadView`      | Full thread with comments             |
| `CommentTree`     | Collapsible comment hierarchy         |
| `VoteButtons`     | Upvote/downvote buttons               |
| `FlairSelector`   | Flair selection dropdown              |
| `ModerationPanel` | Mod queue and actions                 |
| `RulesSidebar`    | Community rules display               |
| `WikiPage`        | Wiki page content                     |

### Patterns

| Pattern           | Description                          |
| ----------------- | ------------------------------------ |
| `SortingControls` | Hot, new, top, controversial sorting |
| `FlairFilter`     | Filter posts by flair                |
| `ModActions`      | Remove, lock, sticky, distinguish    |
| `BanDialog`       | Ban user with reason and duration    |
| `SpamFilter`      | Auto-moderation rules                |

## Styling

Import the theme CSS for community-specific styles:

```typescript
// Import base tokens first
import '@equaltoai/greater-components-tokens/theme.css';

// Then import community styles
import '@equaltoai/greater-components-community/style.css';
```

### CSS Custom Properties

The community face provides these design tokens:

```css
:root {
	/* Card layout */
	--gr-community-card-background: var(--gr-color-surface-primary);
	--gr-community-card-radius: var(--gr-radii-lg);

	/* Voting */
	--gr-community-vote-upvote-color: var(--gr-color-success-500);
	--gr-community-vote-downvote-color: var(--gr-color-error-500);

	/* Comments */
	--gr-community-comment-indent: 16px;
	--gr-community-comment-line-color: var(--gr-color-border-secondary);

	/* Flairs */
	--gr-community-flair-radius: var(--gr-radii-full);
}
```

## Shared Modules

The community face integrates with these shared modules:

- `@equaltoai/greater-components-auth` - Authentication flows
- `@equaltoai/greater-components-search` - Search functionality
- `@equaltoai/greater-components-admin` - Admin dashboard
- `@equaltoai/greater-components-notifications` - Notification system

## TypeScript

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
	CommunityData,
	PostData,
	CommentData,
	VoteDirection,
	FlairData,
	ModerationHandlers,
} from '@equaltoai/greater-components-community';
```

## Accessibility

All components meet WCAG 2.1 AA standards:

- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Focus management in modals and dialogs
- Collapsible regions with proper announcements
- Skip links for comment threads

## License

AGPL-3.0-only
