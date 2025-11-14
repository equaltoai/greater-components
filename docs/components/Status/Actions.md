# Status.Actions

**Component**: Action Buttons  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 52 passing tests

---

## 📋 Overview

`Status.Actions` displays interaction buttons for a status, including reply, boost/reblog, favorite/like, share, and bookmark actions. It integrates with the ActionBar component from the fediverse package and automatically manages interaction counts and states.

### **Key Features**:

- ✅ **Reply** - Open composer to reply to status
- ✅ **Boost/Reblog** - Share status to followers
- ✅ **Favorite/Like** - Mark status as favorite
- ✅ **Share** - Native share or copy link
- ✅ **Bookmark** - Save for later (private)
- ✅ **Interaction Counts** - Display and update counts
- ✅ **Active States** - Visual feedback for boosted/favorited
- ✅ **Accessible** - Keyboard navigation and screen reader support
- ✅ **Customizable** - Custom sizes and read-only modes

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

	let status: GenericStatus = $state({
		id: '1',
		content: '<p>Hello world!</p>',
		account: mockAccount,
		createdAt: new Date().toISOString(),
		reblogsCount: 5,
		favouritesCount: 12,
		repliesCount: 3,
		reblogged: false,
		favourited: true,
		bookmarked: false,
	});

	async function handleReply(s: GenericStatus) {
		console.log('Reply to:', s.id);
		// Open reply composer
	}

	async function handleBoost(s: GenericStatus) {
		// Toggle boost with optimistic update
		s.reblogged = !s.reblogged;
		s.reblogsCount += s.reblogged ? 1 : -1;

		try {
			await boostStatus(s.id, s.reblogged);
		} catch (error) {
			// Rollback on error
			s.reblogged = !s.reblogged;
			s.reblogsCount += s.reblogged ? 1 : -1;
		}
	}

	async function handleFavorite(s: GenericStatus) {
		// Toggle favorite with optimistic update
		s.favourited = !s.favourited;
		s.favouritesCount += s.favourited ? 1 : -1;

		try {
			await favoriteStatus(s.id, s.favourited);
		} catch (error) {
			// Rollback on error
			s.favourited = !s.favourited;
			s.favouritesCount += s.favourited ? 1 : -1;
		}
	}

	const handlers = {
		onReply: handleReply,
		onBoost: handleBoost,
		onFavorite: handleFavorite,
	};
</script>

<Status.Root {status} {handlers}>
	<Status.Header />
	<Status.Content />
	<Status.Actions />
</Status.Root>
```

---

## 🎛️ Props

| Prop       | Type                   | Default            | Required | Description              |
| ---------- | ---------------------- | ------------------ | -------- | ------------------------ |
| `actions`  | `Snippet`              | Default action bar | No       | Custom actions rendering |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'sm'`             | No       | Button size              |
| `readonly` | `boolean`              | `false`            | No       | Disable interactions     |
| `class`    | `string`               | `''`               | No       | Custom CSS class         |

---

## 💡 Examples

### Example 1: Full Action Bar with All Interactions

Complete interaction bar with all actions:

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

	let status: GenericStatus = $state({
		id: '12345',
		content: '<p>Great discussion about web performance!</p>',
		account: mockAccount,
		createdAt: '2025-10-12T10:30:00Z',
		reblogsCount: 42,
		favouritesCount: 156,
		repliesCount: 23,
		reblogged: false,
		favourited: true,
		bookmarked: false,
		url: 'https://mastodon.social/@user/12345',
	});

	async function handleReply(s: GenericStatus) {
		// Open reply composer
		console.log('Opening reply composer for:', s.id);
		// You would typically open a modal or navigate to compose view
	}

	async function handleBoost(s: GenericStatus) {
		const originalState = s.reblogged;
		const originalCount = s.reblogsCount;

		// Optimistic update
		s.reblogged = !s.reblogged;
		s.reblogsCount += s.reblogged ? 1 : -1;

		try {
			const endpoint = `/api/statuses/${s.id}/${s.reblogged ? 'reblog' : 'unreblog'}`;
			const response = await fetch(endpoint, { method: 'POST' });

			if (!response.ok) throw new Error('Failed to boost');

			const data = await response.json();
			s.reblogged = data.reblogged;
			s.reblogsCount = data.reblogsCount;
		} catch (error) {
			console.error('Boost failed:', error);
			s.reblogged = originalState;
			s.reblogsCount = originalCount;
			alert('Failed to boost. Please try again.');
		}
	}

	async function handleFavorite(s: GenericStatus) {
		const originalState = s.favourited;
		const originalCount = s.favouritesCount;

		s.favourited = !s.favourited;
		s.favouritesCount += s.favourited ? 1 : -1;

		try {
			const endpoint = `/api/statuses/${s.id}/${s.favourited ? 'favourite' : 'unfavourite'}`;
			const response = await fetch(endpoint, { method: 'POST' });

			if (!response.ok) throw new Error('Failed to favorite');

			const data = await response.json();
			s.favourited = data.favourited;
			s.favouritesCount = data.favouritesCount;
		} catch (error) {
			console.error('Favorite failed:', error);
			s.favourited = originalState;
			s.favouritesCount = originalCount;
			alert('Failed to favorite. Please try again.');
		}
	}

	async function handleShare(s: GenericStatus) {
		if (navigator.share) {
			try {
				await navigator.share({
					title: `Post by ${s.account.displayName || s.account.username}`,
					text: s.content.replace(/<[^>]*>/g, ''), // Strip HTML
					url: s.url,
				});
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Share failed:', error);
				}
			}
		} else {
			// Fallback: copy link
			await navigator.clipboard.writeText(s.url!);
			alert('Link copied to clipboard!');
		}
	}

	async function handleBookmark(s: GenericStatus) {
		const originalState = s.bookmarked;

		s.bookmarked = !s.bookmarked;

		try {
			const endpoint = `/api/statuses/${s.id}/${s.bookmarked ? 'bookmark' : 'unbookmark'}`;
			const response = await fetch(endpoint, { method: 'POST' });

			if (!response.ok) throw new Error('Failed to bookmark');

			const data = await response.json();
			s.bookmarked = data.bookmarked;
		} catch (error) {
			console.error('Bookmark failed:', error);
			s.bookmarked = originalState;
			alert('Failed to bookmark. Please try again.');
		}
	}

	const handlers = {
		onReply: handleReply,
		onBoost: handleBoost,
		onFavorite: handleFavorite,
		onShare: handleShare,
		onBookmark: handleBookmark,
	};
</script>

<div class="status-card">
	<Status.Root {status} {handlers}>
		<Status.Header />
		<Status.Content />
		<Status.Actions size="md" />
	</Status.Root>
</div>

<style>
	.status-card {
		max-width: 600px;
		margin: 0 auto;
		border: 1px solid #e1e8ed;
		border-radius: 12px;
		overflow: hidden;
		background: white;
	}

	/* Action buttons are automatically styled */
	:global(.status-actions) {
		border-top: 1px solid #e1e8ed;
		padding-top: 0.5rem;
	}
</style>
```

---

### Example 2: Read-Only Action Bar

Display interaction counts without allowing interactions:

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

	const archivedStatus: GenericStatus = {
		id: '1',
		content: '<p>This is an archived post from 2020</p>',
		account: mockAccount,
		createdAt: '2020-01-15T10:00:00Z',
		reblogsCount: 500,
		favouritesCount: 1250,
		repliesCount: 85,
		reblogged: false,
		favourited: false,
		bookmarked: false,
	};
</script>

<Status.Root status={archivedStatus}>
	<Status.Header />
	<Status.Content />

	<!-- Read-only actions (no handlers, just counts) -->
	<Status.Actions readonly={true} />

	<div class="archived-badge">📦 Archived Post</div>
</Status.Root>

<style>
	.archived-badge {
		padding: 0.5rem 1rem;
		background: #f7f9fa;
		border-top: 1px solid #e1e8ed;
		text-align: center;
		font-size: 0.875rem;
		color: #536471;
		font-weight: 600;
	}

	/* Read-only actions have reduced opacity */
	:global(.status-actions[readonly]) {
		opacity: 0.6;
		pointer-events: none;
	}
</style>
```

---

### Example 3: Custom Action Buttons

Add custom actions alongside standard ones:

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

	let status = $state(mockStatus());
	let isTranslating = $state(false);
	let translatedText = $state<string | null>(null);

	async function translatePost() {
		isTranslating = true;
		try {
			const response = await fetch(`/api/statuses/${status.id}/translate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ targetLang: 'en' }),
			});
			const data = await response.json();
			translatedText = data.translatedText;
		} catch (error) {
			console.error('Translation failed:', error);
			alert('Translation failed. Please try again.');
		} finally {
			isTranslating = false;
		}
	}

	async function reportPost() {
		if (confirm('Report this post for moderation review?')) {
			try {
				await fetch(`/api/statuses/${status.id}/report`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ reason: 'user_report' }),
				});
				alert('Post reported. Moderators will review it.');
			} catch (error) {
				console.error('Report failed:', error);
				alert('Failed to report post. Please try again.');
			}
		}
	}

	const handlers = {
		onReply: (s) => console.log('Reply'),
		onBoost: (s) => console.log('Boost'),
		onFavorite: (s) => console.log('Favorite'),
	};
</script>

<Status.Root {status} {handlers}>
	<Status.Header />

	<Status.Content />

	{#if translatedText}
		<div class="translated-content">
			<div class="translated-label">Translated:</div>
			<div class="translated-text">{translatedText}</div>
		</div>
	{/if}

	<Status.Actions>
		{#snippet actions()}
			<div class="custom-actions">
				<!-- Standard actions -->
				<div class="standard-actions">
					<Status.Actions />
				</div>

				<!-- Custom action buttons -->
				<div class="extra-actions">
					<button
						class="action-btn translate-btn"
						onclick={translatePost}
						disabled={isTranslating}
						title="Translate post"
					>
						<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
							<path
								d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
							/>
						</svg>
						{isTranslating ? 'Translating...' : 'Translate'}
					</button>

					<button class="action-btn report-btn" onclick={reportPost} title="Report post">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
							<path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
						</svg>
						Report
					</button>
				</div>
			</div>
		{/snippet}
	</Status.Actions>
</Status.Root>

<style>
	.custom-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.standard-actions {
		display: flex;
		justify-content: space-between;
	}

	.extra-actions {
		display: flex;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #e1e8ed;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid #e1e8ed;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: #536471;
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-btn:hover:not(:disabled) {
		background: #f7f9fa;
		border-color: #cbd5e0;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.translate-btn:hover:not(:disabled) {
		color: #1d9bf0;
		border-color: #1d9bf0;
	}

	.report-btn:hover:not(:disabled) {
		color: #ef4444;
		border-color: #ef4444;
	}

	.translated-content {
		margin: 0.5rem 0;
		padding: 1rem;
		background: #e0f2fe;
		border: 1px solid #7dd3fc;
		border-radius: 8px;
	}

	.translated-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: #0369a1;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 0.5rem;
	}

	.translated-text {
		color: #0f1419;
		line-height: 1.5;
	}
</style>
```

---

### Example 4: Action Bar with Analytics

Track which actions users take:

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

	let status = $state(mockStatus());
	let analytics = $state({
		replies: 0,
		boosts: 0,
		favorites: 0,
		shares: 0,
		bookmarks: 0,
	});

	function trackAction(action: string) {
		// Send analytics event
		console.log('Action tracked:', action, {
			statusId: status.id,
			timestamp: new Date().toISOString(),
		});

		// Example: Send to analytics service
		// fetch('/api/analytics', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify({
		//     event: 'status_action',
		//     action,
		//     statusId: status.id,
		//     timestamp: new Date().toISOString()
		//   })
		// });
	}

	const handlers = {
		onReply: (s: GenericStatus) => {
			trackAction('reply');
			analytics.replies++;
			// Open reply composer
		},
		onBoost: async (s: GenericStatus) => {
			trackAction('boost');
			analytics.boosts++;

			s.reblogged = !s.reblogged;
			s.reblogsCount += s.reblogged ? 1 : -1;

			try {
				await boostStatus(s.id, s.reblogged);
			} catch (error) {
				s.reblogged = !s.reblogged;
				s.reblogsCount += s.reblogged ? 1 : -1;
			}
		},
		onFavorite: async (s: GenericStatus) => {
			trackAction('favorite');
			analytics.favorites++;

			s.favourited = !s.favourited;
			s.favouritesCount += s.favourited ? 1 : -1;

			try {
				await favoriteStatus(s.id, s.favourited);
			} catch (error) {
				s.favourited = !s.favourited;
				s.favouritesCount += s.favourited ? 1 : -1;
			}
		},
		onShare: (s: GenericStatus) => {
			trackAction('share');
			analytics.shares++;

			if (navigator.share) {
				navigator.share({ url: s.url });
			}
		},
	};
</script>

<div class="tracked-status">
	<div class="analytics-bar">
		<h4>Action Analytics</h4>
		<div class="analytics-stats">
			<span>Replies: {analytics.replies}</span>
			<span>Boosts: {analytics.boosts}</span>
			<span>Favorites: {analytics.favorites}</span>
			<span>Shares: {analytics.shares}</span>
		</div>
	</div>

	<Status.Root {status} {handlers}>
		<Status.Header />
		<Status.Content />
		<Status.Actions />
	</Status.Root>
</div>

<style>
	.tracked-status {
		border: 1px solid #e1e8ed;
		border-radius: 8px;
		overflow: hidden;
	}

	.analytics-bar {
		padding: 1rem;
		background: #f0f9ff;
		border-bottom: 1px solid #7dd3fc;
	}

	.analytics-bar h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		color: #0369a1;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.analytics-stats {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.75rem;
		color: #0c4a6e;
		font-weight: 600;
	}
</style>
```

---

### Example 5: Conditional Actions Based on Permissions

Show/hide actions based on user permissions:

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

	let status = $state(mockStatus());
	let currentUser = $state({ id: '123', isModerator: false });

	// Check permissions
	const canReply = $derived(true); // Everyone can reply
	const canBoost = $derived(
		!status.visibility || status.visibility === 'public' || status.visibility === 'unlisted'
	);
	const canEdit = $derived(status.account.id === currentUser.id);
	const canDelete = $derived(status.account.id === currentUser.id || currentUser.isModerator);

	const handlers = {
		onReply: canReply ? (s: GenericStatus) => console.log('Reply') : undefined,
		onBoost: canBoost ? (s: GenericStatus) => console.log('Boost') : undefined,
		onFavorite: (s: GenericStatus) => console.log('Favorite'),
	};
</script>

<Status.Root {status} {handlers}>
	<Status.Header />
	<Status.Content />
	<Status.Actions />

	{#if canEdit || canDelete}
		<div class="admin-actions">
			{#if canEdit}
				<button class="admin-btn" onclick={() => console.log('Edit')}>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
						<path
							d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
						/>
					</svg>
					Edit
				</button>
			{/if}

			{#if canDelete}
				<button class="admin-btn danger" onclick={() => console.log('Delete')}>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
						<path
							d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
						/>
					</svg>
					Delete
				</button>
			{/if}
		</div>
	{/if}
</Status.Root>

<style>
	.admin-actions {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid #e1e8ed;
		background: #f7f9fa;
	}

	.admin-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid #e1e8ed;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		color: #536471;
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-btn:hover {
		background: #f7f9fa;
		border-color: #1d9bf0;
		color: #1d9bf0;
	}

	.admin-btn.danger:hover {
		border-color: #ef4444;
		color: #ef4444;
	}
</style>
```

---

## 🎨 Styling

### CSS Custom Properties

```css
.status-actions {
	/* Spacing */
	--status-spacing-sm: 0.5rem;

	/* Colors */
	--action-color-default: #536471;
	--action-color-reply: #1d9bf0;
	--action-color-boost: #22c55e;
	--action-color-favorite: #ef4444;
	--action-color-share: #8b5cf6;
}
```

### Action States

```css
/* Default state */
.action-button {
	color: var(--action-color-default, #536471);
}

/* Active states */
.action-button--boosted {
	color: var(--action-color-boost, #22c55e);
}

.action-button--favorited {
	color: var(--action-color-favorite, #ef4444);
}

.action-button--bookmarked {
	color: var(--action-color-share, #8b5cf6);
}
```

---

## ♿ Accessibility

### ARIA Labels

```html
<button aria-label="Reply to post" aria-describedby="reply-count">
	<svg aria-hidden="true"><!-- Icon --></svg>
	<span id="reply-count">5</span>
</button>
```

### Keyboard Navigation

- `Tab` - Navigate between action buttons
- `Enter`/`Space` - Activate button
- Screen reader announces: "Reply to post, 5 replies"

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Status } from '@equaltoai/greater-components-fediverse';

describe('Status.Actions', () => {
	it('displays interaction counts', () => {
		const status = mockStatus({
			repliesCount: 5,
			reblogsCount: 10,
			favouritesCount: 20,
		});

		render(Status.Root, { props: { status } });

		expect(screen.getByText('5')).toBeInTheDocument();
		expect(screen.getByText('10')).toBeInTheDocument();
		expect(screen.getByText('20')).toBeInTheDocument();
	});

	it('calls onBoost when boost button clicked', async () => {
		const onBoost = vi.fn();
		const status = mockStatus();

		render(Status.Root, {
			props: {
				status,
				handlers: { onBoost },
			},
		});

		const boostButton = screen.getByLabelText(/boost/i);
		await fireEvent.click(boostButton);

		expect(onBoost).toHaveBeenCalledWith(status);
	});

	it('shows active state for favorited status', () => {
		const status = mockStatus({ favourited: true });

		render(Status.Root, { props: { status } });

		const favoriteButton = screen.getByLabelText(/favorite/i);
		expect(favoriteButton).toHaveClass('action-button--favorited');
	});
});
```

---

## 🔗 Related Components

- [Status.Root](./Root.md) - Status context provider
- [Status.Header](./Header.md) - Account header
- [Status.Content](./Content.md) - Post content

---

## 📚 See Also

- [Status Components README](./README.md)
- [Interaction Patterns](../../guides/interaction-patterns.md)
- [Optimistic Updates](../../guides/optimistic-updates.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0
