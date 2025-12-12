# @equaltoai/greater-components-social

Social/Twitter-style UI components for ActivityPub/Fediverse applications. Part of the Greater Components library.

## Installation

```bash
# Using the Greater CLI (recommended)
npx @equaltoai/greater-cli add face:social

# Or install directly
pnpm add @equaltoai/greater-components-social
```

## Quick Start

```svelte
<script>
	import { Status, Profile, Timeline } from '@equaltoai/greater-components-social';
	import '@equaltoai/greater-components-social/style.css';
</script>

<!-- Display a status/post -->
<Status.Root status={post}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>
```

## CSS Setup

Import the required CSS files in your app's entry point:

```typescript
// Import design tokens first
import '@equaltoai/greater-components/tokens/theme.css';

// Then import the social face styles
import '@equaltoai/greater-components-social/style.css';
```

## Component Inventory

### Timeline Components

| Component               | Description                             | Props                                        |
| ----------------------- | --------------------------------------- | -------------------------------------------- |
| `Status.Root`           | Container for status compound component | `status`, `config`, `handlers`               |
| `Status.Header`         | Account info, avatar, timestamp         | -                                            |
| `Status.Content`        | Post content with mentions/hashtags     | -                                            |
| `Status.Media`          | Media attachments display               | -                                            |
| `Status.Actions`        | Reply, boost, favorite, share buttons   | -                                            |
| `Status.LesserMetadata` | Lesser-specific metadata (cost, trust)  | `showCost`, `showTrust`                      |
| `Status.CommunityNotes` | Community notes display                 | `enableVoting`                               |
| `TimelineVirtualized`   | Virtual scrolling timeline              | `items`, `onLoadMore`, `loading`, `hasMore`  |
| `ActionBar`             | Standalone action bar                   | `status`, `onReply`, `onBoost`, `onFavorite` |
| `ContentRenderer`       | HTML content renderer                   | `content`, `mentions`, `tags`, `emojis`      |

### Profile Components

| Component            | Description                              | Props                                 |
| -------------------- | ---------------------------------------- | ------------------------------------- |
| `Profile.Root`       | Container for profile compound component | `profile`, `handlers`, `isOwnProfile` |
| `Profile.Header`     | Avatar, banner, display name             | -                                     |
| `Profile.Stats`      | Followers, following, posts count        | -                                     |
| `Profile.Tabs`       | Content tabs (posts, replies, media)     | -                                     |
| `Profile.Fields`     | Custom profile fields                    | -                                     |
| `Profile.Edit`       | Profile editing form                     | -                                     |
| `Profile.TrustBadge` | Lesser trust score badge                 | -                                     |
| `Profile.Timeline`   | Profile-specific timeline                | -                                     |

### Lists Components

| Component            | Description                            | Props      |
| -------------------- | -------------------------------------- | ---------- |
| `Lists.Root`         | Container for lists compound component | `handlers` |
| `Lists.Manager`      | Lists management interface             | -          |
| `Lists.Editor`       | List creation/editing form             | -          |
| `Lists.Timeline`     | List-specific timeline                 | -          |
| `Lists.MemberPicker` | Member selection interface             | -          |

### Filters Components

| Component                 | Description                              | Props                |
| ------------------------- | ---------------------------------------- | -------------------- |
| `Filters.Root`            | Container for filters compound component | `handlers`           |
| `Filters.Manager`         | Filter management interface              | -                    |
| `Filters.Editor`          | Filter creation/editing form             | -                    |
| `Filters.FilteredContent` | Content filter wrapper                   | `content`, `context` |

### Hashtags Components

| Component               | Description                               | Props      |
| ----------------------- | ----------------------------------------- | ---------- |
| `Hashtags.Root`         | Container for hashtags compound component | `handlers` |
| `Hashtags.FollowedList` | Followed hashtags list                    | -          |
| `Hashtags.MutedList`    | Muted hashtags list                       | -          |
| `Hashtags.Controls`     | Follow/mute controls                      | -          |

## Patterns

The social face includes these reusable patterns:

- **ThreadView** - Conversation/thread display
- **ModerationTools** - Content moderation interface
- **VisibilitySelector** - Post visibility selection
- **ContentWarningHandler** - Spoiler/CW handling
- **FederationIndicator** - Federation status display
- **InstancePicker** - Instance selection for login
- **CustomEmojiPicker** - Custom emoji selection
- **PollComposer** - Poll creation interface
- **MediaComposer** - Media attachment composition
- **BookmarkManager** - Bookmark management

## Shared Module References

The social face references these shared modules (install separately):

```bash
# Authentication
npx @equaltoai/greater-cli add shared/auth

# Post composition
npx @equaltoai/greater-cli add shared/compose

# Notifications
npx @equaltoai/greater-cli add shared/notifications

# Search
npx @equaltoai/greater-cli add shared/search
```

## Theme Customization

### Using CSS Variables

Override design tokens to customize the theme:

```css
:root {
	/* Primary colors */
	--gr-color-primary-500: #1d9bf0;
	--gr-color-primary-600: #1a8cd8;

	/* Status-specific colors */
	--gr-social-boost-color: #00ba7c;
	--gr-social-favorite-color: #f91880;
	--gr-social-reply-color: #1d9bf0;

	/* Timeline density */
	--gr-social-status-padding: var(--gr-spacing-scale-4);
	--gr-social-status-gap: var(--gr-spacing-scale-3);
}
```

### Theme Variants

```svelte
<script>
	import '@equaltoai/greater-components/tokens/themes/dark.css';
</script>

<!-- Set theme on root element -->
<div data-theme="dark">
	<Timeline items={posts} />
</div>
```

## Lesser Integration

For Lesser-specific features (quote posts, community notes, trust graphs):

```typescript
import { createLesserClient } from '@equaltoai/greater-components-social/adapters/graphql';

const client = createLesserClient({
	endpoint: 'https://api.lesser.example.com/graphql',
	token: 'your-auth-token',
});

// Fetch timeline with Lesser-specific fields
const timeline = await client.getTimeline({
	limit: 20,
	includeQuotes: true,
	includeCommunityNotes: true,
});
```

## Events

### Status Events

| Event        | Payload                 | Description                 |
| ------------ | ----------------------- | --------------------------- |
| `onReply`    | `{ status }`            | User clicked reply          |
| `onBoost`    | `{ status, boosted }`   | User toggled boost          |
| `onFavorite` | `{ status, favorited }` | User toggled favorite       |
| `onShare`    | `{ status }`            | User clicked share          |
| `onQuote`    | `{ status }`            | User clicked quote (Lesser) |

### Profile Events

| Event      | Payload                  | Description         |
| ---------- | ------------------------ | ------------------- |
| `onFollow` | `{ account, following }` | User toggled follow |
| `onBlock`  | `{ account, blocked }`   | User toggled block  |
| `onMute`   | `{ account, muted }`     | User toggled mute   |
| `onSave`   | `{ data }`               | Profile edit saved  |

## Accessibility

All components meet WCAG 2.1 AA standards:

- Full keyboard navigation
- Screen reader support with ARIA labels
- Focus management in modals and menus
- Reduced motion support
- High contrast theme support

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

AGPL-3.0-only
