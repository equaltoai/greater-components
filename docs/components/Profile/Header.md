# Profile.Header

**Component**: Profile Header Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 42 passing tests

---

## 📋 Overview

`Profile.Header` displays the profile header section with avatar, cover image, display name, username, bio, action buttons, and custom fields. It provides comprehensive profile information in a visually rich format with support for both viewing profiles and own profile management.

### **Key Features**:

- ✅ Rich profile display with avatar and banner
- ✅ Follow/unfollow actions for other profiles
- ✅ Edit button for own profile
- ✅ Action menu (share, mention, message, mute, block, report)
- ✅ Custom profile fields with verification badges
- ✅ Account creation date display
- ✅ Relationship status indicators
- ✅ Fully responsive design
- ✅ Accessible with keyboard navigation

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Developer & open source enthusiast 🚀',
		avatar: 'https://example.com/avatars/alice.jpg',
		header: 'https://example.com/headers/alice-banner.jpg',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		createdAt: '2023-01-15T10:00:00Z',
	};

	const handlers = {
		onFollow: async (userId) => {
			console.log('Following:', userId);
		},
	};
</script>

<Profile.Root {profile} {handlers}>
	<Profile.Header />
</Profile.Root>
```

---

## 🎛️ Props

| Prop          | Type      | Default | Required | Description                              |
| ------------- | --------- | ------- | -------- | ---------------------------------------- |
| `showCover`   | `boolean` | `true`  | No       | Show cover/banner image                  |
| `showActions` | `boolean` | `true`  | No       | Show action buttons (follow, edit, etc.) |
| `showFields`  | `boolean` | `true`  | No       | Show custom profile fields               |
| `class`       | `string`  | `''`    | No       | Custom CSS class                         |

---

## 📤 Events

The component uses context handlers from Profile.Root:

| Handler      | Parameters         | Description                         |
| ------------ | ------------------ | ----------------------------------- |
| `onFollow`   | `userId: string`   | Called when follow button clicked   |
| `onUnfollow` | `userId: string`   | Called when unfollow clicked        |
| `onBlock`    | `userId: string`   | Called when block action selected   |
| `onMute`     | `userId: string`   | Called when mute action selected    |
| `onReport`   | `userId: string`   | Called when report action selected  |
| `onShare`    | -                  | Called when share button clicked    |
| `onMention`  | `username: string` | Called when mention action selected |
| `onMessage`  | `userId: string`   | Called when message action selected |

---

## 💡 Examples

### **Example 1: Complete Profile Header**

Full-featured profile header with all elements:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type {
		ProfileData,
		ProfileHandlers,
	} from '@equaltoai/greater-components-fediverse/Profile';

	const profile: ProfileData = {
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: `Software developer specializing in distributed systems and web technologies.
    
Open source enthusiast | Rust & TypeScript | Building for the decentralized web 🌐`,
		avatar: 'https://cdn.example.com/avatars/alice.jpg',
		header: 'https://cdn.example.com/headers/alice-banner.jpg',
		url: 'https://alice.dev',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{
				name: 'Website',
				value: '<a href="https://alice.dev" rel="me">alice.dev</a>',
				verifiedAt: '2024-01-15T10:00:00Z',
			},
			{
				name: 'GitHub',
				value: '<a href="https://github.com/alice" rel="me">github.com/alice</a>',
				verifiedAt: '2024-01-15T11:00:00Z',
			},
			{
				name: 'Location',
				value: 'San Francisco, CA',
			},
			{
				name: 'Pronouns',
				value: 'she/her',
			},
		],
		createdAt: '2023-01-15T10:00:00Z',
		relationship: {
			following: false,
			followedBy: false,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		},
	};

	const handlers: ProfileHandlers = {
		onFollow: async (userId) => {
			console.log('Following user:', userId);
			// Implement follow logic
			await fetch(`/api/accounts/${userId}/follow`, {
				method: 'POST',
				credentials: 'include',
			});
		},

		onShare: () => {
			if (navigator.share) {
				navigator.share({
					title: profile.displayName,
					text: profile.bio,
					url: window.location.href,
				});
			} else {
				// Fallback: copy to clipboard
				navigator.clipboard.writeText(window.location.href);
				alert('Link copied to clipboard!');
			}
		},

		onMention: (username) => {
			window.location.href = `/compose?mention=@${username}`;
		},

		onMessage: (userId) => {
			window.location.href = `/messages/new?to=${userId}`;
		},
	};
</script>

<div class="profile-container">
	<Profile.Root {profile} {handlers} isOwnProfile={false}>
		<Profile.Header showCover={true} showActions={true} showFields={true} />
	</Profile.Root>
</div>

<style>
	.profile-container {
		max-width: 600px;
		margin: 0 auto;
	}
</style>
```

### **Example 2: Own Profile with Edit Button**

Display own profile with edit functionality:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import { goto } from '$app/navigation';

	let profile = $state({
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Developer & designer',
		avatar: 'https://example.com/avatar.jpg',
		header: 'https://example.com/header.jpg',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{ name: 'Website', value: 'https://alice.dev' },
			{ name: 'GitHub', value: 'https://github.com/alice' },
		],
		createdAt: '2023-01-15T10:00:00Z',
	});

	let editMode = $state(false);

	const handlers = {
		// Edit mode is toggled through context
		// The Header component will show "Edit Profile" button
	};

	function handleEditClick() {
		editMode = true;
		// Or navigate to edit page
		// goto('/settings/profile');
	}
</script>

<div class="own-profile">
	<Profile.Root {profile} {handlers} isOwnProfile={true}>
		{#if editMode}
			<Profile.Edit />
		{:else}
			<Profile.Header showActions={true} />
		{/if}
	</Profile.Root>
</div>

<style>
	.own-profile {
		max-width: 600px;
		margin: 0 auto;
	}
</style>
```

### **Example 3: With Follow/Block Actions**

Implement follow, mute, and block actions:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

	let profile = $state<ProfileData>({
		id: '456',
		username: 'bob',
		displayName: 'Bob Smith',
		bio: 'Designer & illustrator',
		avatar: 'https://example.com/bob.jpg',
		followersCount: 567,
		followingCount: 234,
		statusesCount: 1234,
		relationship: {
			following: false,
			followedBy: true,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		},
	});

	let loading = $state(false);
	let error = $state<string | null>(null);

	async function performAction(action: string, apiCall: () => Promise<void>) {
		loading = true;
		error = null;

		try {
			await apiCall();

			// Update relationship status
			switch (action) {
				case 'follow':
					profile.relationship!.following = true;
					profile.followersCount++;
					break;
				case 'unfollow':
					profile.relationship!.following = false;
					profile.followersCount--;
					break;
				case 'block':
					profile.relationship!.blocking = true;
					break;
				case 'mute':
					profile.relationship!.muting = true;
					break;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Action failed';
		} finally {
			loading = false;
		}
	}

	const handlers = {
		onFollow: async (userId: string) => {
			await performAction('follow', async () => {
				const response = await fetch(`/api/accounts/${userId}/follow`, {
					method: 'POST',
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Follow request failed');
				}
			});
		},

		onUnfollow: async (userId: string) => {
			if (!confirm('Unfollow this user?')) return;

			await performAction('unfollow', async () => {
				const response = await fetch(`/api/accounts/${userId}/unfollow`, {
					method: 'POST',
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Unfollow request failed');
				}
			});
		},

		onBlock: async (userId: string) => {
			if (!confirm('Block this user? They will not be able to follow you or see your posts.')) {
				return;
			}

			await performAction('block', async () => {
				const response = await fetch(`/api/accounts/${userId}/block`, {
					method: 'POST',
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Block request failed');
				}
			});
		},

		onMute: async (userId: string, muteNotifications = false) => {
			await performAction('mute', async () => {
				const response = await fetch(`/api/accounts/${userId}/mute`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ notifications: muteNotifications }),
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Mute request failed');
				}
			});
		},

		onReport: (userId: string) => {
			// Open report modal
			showReportModal(userId);
		},
	};

	function showReportModal(userId: string) {
		// Implementation for report modal
		console.log('Report user:', userId);
	}
</script>

<div class="profile-actions">
	{#if error}
		<div class="error-banner" role="alert">
			{error}
			<button onclick={() => (error = null)}>Dismiss</button>
		</div>
	{/if}

	{#if loading}
		<div class="loading-overlay">
			<div class="spinner"></div>
		</div>
	{/if}

	<Profile.Root {profile} {handlers} isOwnProfile={false}>
		<Profile.Header showActions={true} />
	</Profile.Root>
</div>

<style>
	.profile-actions {
		position: relative;
		max-width: 600px;
		margin: 0 auto;
	}

	.error-banner {
		padding: 1rem;
		margin-bottom: 1rem;
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 0.5rem;
		color: #c00;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.error-banner button {
		padding: 0.25rem 0.75rem;
		background: white;
		border: 1px solid #c00;
		border-radius: 0.25rem;
		color: #c00;
		cursor: pointer;
	}

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid #eff3f4;
		border-top-color: #1d9bf0;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
```

### **Example 4: Responsive Header with Mobile Optimization**

Optimize for mobile devices with responsive design:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

	let isMobile = $state(false);

	// Detect mobile viewport
	$effect(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	});

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Developer & designer',
		avatar: 'https://example.com/avatar.jpg',
		header: 'https://example.com/header.jpg',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
	};

	const handlers = {
		onFollow: async (userId: string) => {
			// Implement follow with haptic feedback on mobile
			if ('vibrate' in navigator) {
				navigator.vibrate(50);
			}

			await fetch(`/api/accounts/${userId}/follow`, {
				method: 'POST',
				credentials: 'include',
			});
		},

		onShare: () => {
			// Use native share on mobile
			if (navigator.share) {
				navigator.share({
					title: profile.displayName,
					text: profile.bio,
					url: window.location.href,
				});
			}
		},
	};
</script>

<div class="responsive-profile" class:mobile={isMobile}>
	<Profile.Root {profile} {handlers}>
		<Profile.Header showCover={!isMobile || true} showActions={true} showFields={true} />
	</Profile.Root>
</div>

<style>
	.responsive-profile {
		max-width: 600px;
		margin: 0 auto;
	}

	.responsive-profile.mobile {
		max-width: 100%;
		padding: 0;
	}

	/* Mobile-specific adjustments */
	.responsive-profile.mobile :global(.profile-header__avatar) {
		width: 5rem;
		height: 5rem;
	}

	.responsive-profile.mobile :global(.profile-header__cover) {
		height: 120px;
	}

	.responsive-profile.mobile :global(.profile-header__actions) {
		flex-direction: column;
		gap: 0.5rem;
	}

	.responsive-profile.mobile :global(.profile-header__button) {
		width: 100%;
	}

	@media (max-width: 768px) {
		.responsive-profile :global(.profile-header__fields) {
			grid-template-columns: 1fr;
		}
	}
</style>
```

### **Example 5: With GraphQL and Optimistic Updates**

Implement with GraphQL and optimistic UI updates:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import { mutation } from '@urql/svelte';
	import { gql } from '@urql/core';
	import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

	let profile = $state<ProfileData>({
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Developer',
		avatar: 'https://example.com/avatar.jpg',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		relationship: {
			following: false,
			followedBy: false,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		},
	});

	// GraphQL mutations
	const FOLLOW_MUTATION = gql`
		mutation Follow($userId: ID!) {
			follow(userId: $userId) {
				id
				followersCount
				relationship {
					following
					requested
				}
			}
		}
	`;

	const BLOCK_MUTATION = gql`
		mutation Block($userId: ID!) {
			block(userId: $userId) {
				id
				relationship {
					blocking
				}
			}
		}
	`;

	const followMutation = mutation({ query: FOLLOW_MUTATION });
	const blockMutation = mutation({ query: BLOCK_MUTATION });

	const handlers = {
		onFollow: async (userId: string) => {
			// Optimistic update
			const previousRelationship = profile.relationship;
			const previousFollowersCount = profile.followersCount;

			profile.relationship = {
				...previousRelationship!,
				following: true,
			};
			profile.followersCount++;

			try {
				const result = await followMutation({ variables: { userId } });

				if (result.error) {
					// Revert on error
					profile.relationship = previousRelationship;
					profile.followersCount = previousFollowersCount;
					throw new Error(result.error.message);
				}

				// Update with server data
				if (result.data?.follow) {
					profile = {
						...profile,
						...result.data.follow,
					};
				}
			} catch (error) {
				// Already reverted above
				console.error('Follow failed:', error);
			}
		},

		onUnfollow: async (userId: string) => {
			// Optimistic update
			const previousRelationship = profile.relationship;
			const previousFollowersCount = profile.followersCount;

			profile.relationship = {
				...previousRelationship!,
				following: false,
			};
			profile.followersCount--;

			try {
				const result = await followMutation({ variables: { userId } });

				if (result.error) {
					profile.relationship = previousRelationship;
					profile.followersCount = previousFollowersCount;
					throw new Error(result.error.message);
				}
			} catch (error) {
				console.error('Unfollow failed:', error);
			}
		},

		onBlock: async (userId: string) => {
			if (!confirm('Block this user?')) return;

			const previousRelationship = profile.relationship;

			profile.relationship = {
				...previousRelationship!,
				blocking: true,
				following: false,
				followedBy: false,
			};

			try {
				const result = await blockMutation({ variables: { userId } });

				if (result.error) {
					profile.relationship = previousRelationship;
					throw new Error(result.error.message);
				}
			} catch (error) {
				console.error('Block failed:', error);
			}
		},
	};
</script>

<div class="graphql-profile">
	<Profile.Root {profile} {handlers}>
		<Profile.Header showActions={true} />
	</Profile.Root>
</div>

<style>
	.graphql-profile {
		max-width: 600px;
		margin: 0 auto;
	}
</style>
```

---

## 🔒 Security Considerations

### **Server-Side Action Validation**

Always validate and authorize profile actions on the server:

```typescript
// server/api/follow.ts
import { z } from 'zod';

const FollowSchema = z.object({
	userId: z.string().uuid(),
});

export async function POST(request: Request) {
	// Get authenticated user
	const currentUserId = await getAuthenticatedUserId(request);
	if (!currentUserId) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Parse and validate
	const body = await request.json();
	const { userId } = FollowSchema.parse(body);

	// Prevent self-follow
	if (userId === currentUserId) {
		return new Response('Cannot follow yourself', { status: 400 });
	}

	// Check if target user exists
	const targetUser = await db.users.findUnique({
		where: { id: userId },
	});

	if (!targetUser) {
		return new Response('User not found', { status: 404 });
	}

	// Check if already following
	const existingFollow = await db.follows.findUnique({
		where: {
			followerId_followingId: {
				followerId: currentUserId,
				followingId: userId,
			},
		},
	});

	if (existingFollow) {
		return new Response('Already following', { status: 400 });
	}

	// Check if blocked
	const isBlocked = await db.blocks.findFirst({
		where: {
			OR: [
				{ blockerId: userId, blockedId: currentUserId },
				{ blockerId: currentUserId, blockedId: userId },
			],
		},
	});

	if (isBlocked) {
		return new Response('Cannot follow blocked user', { status: 403 });
	}

	// Create follow relationship
	await db.follows.create({
		data: {
			followerId: currentUserId,
			followingId: userId,
			createdAt: new Date(),
		},
	});

	// Send notification to target user
	await sendNotification(userId, {
		type: 'follow',
		actorId: currentUserId,
		createdAt: new Date(),
	});

	// Create activity for federation
	await createFollowActivity(currentUserId, userId);

	// Audit log
	await db.auditLogs.create({
		data: {
			userId: currentUserId,
			action: 'follow',
			targetUserId: userId,
			ipAddress: request.headers.get('x-forwarded-for'),
			userAgent: request.headers.get('user-agent'),
			timestamp: new Date(),
		},
	});

	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' },
	});
}
```

### **Rate Limiting for Actions**

Implement rate limiting to prevent abuse:

```typescript
// server/middleware/rateLimitActions.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
	url: process.env.REDIS_URL!,
	token: process.env.REDIS_TOKEN!,
});

// Different limits for different actions
const followRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(20, '1 h'),
	analytics: true,
});

const blockRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, '1 h'),
	analytics: true,
});

export async function checkFollowRateLimit(userId: string): Promise<boolean> {
	const { success } = await followRateLimit.limit(`follow:${userId}`);
	return success;
}

export async function checkBlockRateLimit(userId: string): Promise<boolean> {
	const { success } = await blockRateLimit.limit(`block:${userId}`);
	return success;
}
```

### **Content Sanitization**

Sanitize user-generated content in bio and fields:

```typescript
// server/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeProfileBio(bio: string): string {
	return DOMPurify.sanitize(bio, {
		ALLOWED_TAGS: ['a', 'br', 'p', 'strong', 'em', 'code'],
		ALLOWED_ATTR: ['href', 'rel', 'target'],
		ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|#)/,
	});
}

export function sanitizeProfileField(value: string): string {
	return DOMPurify.sanitize(value, {
		ALLOWED_TAGS: ['a'],
		ALLOWED_ATTR: ['href', 'rel'],
		ALLOWED_URI_REGEXP: /^https?:/,
	});
}
```

---

## 🎨 Styling

The Header component uses CSS custom properties for theming:

```css
/* Profile Header Styles */
.profile-header {
	--header-height: 200px;
	--avatar-size: 8rem;
	--avatar-border-width: 4px;
	--avatar-border-color: var(--bg-primary, #ffffff);

	/* Colors */
	--header-bg: var(--bg-primary, #ffffff);
	--header-text: var(--text-primary, #0f1419);
	--header-secondary-text: var(--text-secondary, #536471);
	--header-border: var(--border-color, #e1e8ed);

	/* Button styles */
	--button-bg: var(--bg-primary, #ffffff);
	--button-hover: var(--bg-hover, #eff3f4);
	--button-primary-bg: var(--primary-color, #1d9bf0);
	--button-primary-hover: var(--primary-hover, #1a8cd8);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
	.profile-header {
		--header-bg: #15202b;
		--header-text: #f7f9fa;
		--header-secondary-text: #8899a6;
		--header-border: #38444d;
		--avatar-border-color: #15202b;
		--button-bg: #192734;
		--button-hover: #1e2732;
	}
}

/* Custom theme example */
.profile-header.custom-theme {
	--header-height: 300px;
	--avatar-size: 10rem;
	--button-primary-bg: #8b5cf6;
	--button-primary-hover: #7c3aed;
}
```

---

## ♿ Accessibility

The Header component is fully accessible:

### **Keyboard Navigation**

- ✅ All buttons are keyboard accessible
- ✅ Follow button has clear focus indicator
- ✅ Action menu opens with keyboard (Enter/Space)
- ✅ Menu items navigable with arrow keys
- ✅ Escape closes menu

### **Screen Readers**

- ✅ Avatar has descriptive alt text
- ✅ Action buttons have clear labels
- ✅ Relationship status announced
- ✅ Menu items have descriptive text
- ✅ Loading states announced

### **ARIA Attributes**

```html
<!-- Follow button -->
<button aria-label="Follow Alice Wonder" aria-pressed="false">Follow</button>

<!-- Action menu -->
<button aria-label="More actions" aria-expanded="false" aria-haspopup="menu">More</button>

<div role="menu" aria-label="Profile actions">
	<button role="menuitem">Share Profile</button>
	<button role="menuitem">Mention @alice</button>
	<button role="menuitem">Direct Message</button>
</div>
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

describe('Profile.Header', () => {
	const mockProfile = {
		id: '1',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Developer',
		avatar: 'https://example.com/avatar.jpg',
		followersCount: 100,
		followingCount: 50,
		statusesCount: 200,
	};

	it('displays profile information', () => {
		render(Profile.Root, {
			props: {
				profile: mockProfile,
				handlers: {},
			},
		});

		expect(screen.getByText('Alice Wonder')).toBeInTheDocument();
		expect(screen.getByText('@alice')).toBeInTheDocument();
		expect(screen.getByText('Developer')).toBeInTheDocument();
	});

	it('shows follow button for other profiles', () => {
		render(Profile.Root, {
			props: {
				profile: mockProfile,
				handlers: {},
				isOwnProfile: false,
			},
		});

		expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
	});

	it('shows edit button for own profile', () => {
		render(Profile.Root, {
			props: {
				profile: mockProfile,
				handlers: {},
				isOwnProfile: true,
			},
		});

		expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
	});

	it('calls onFollow when follow button clicked', async () => {
		const onFollow = vi.fn();

		render(Profile.Root, {
			props: {
				profile: mockProfile,
				handlers: { onFollow },
				isOwnProfile: false,
			},
		});

		const followButton = screen.getByRole('button', { name: /follow/i });
		await fireEvent.click(followButton);

		expect(onFollow).toHaveBeenCalledWith('1');
	});

	it('opens action menu when more button clicked', async () => {
		render(Profile.Root, {
			props: {
				profile: mockProfile,
				handlers: {},
				isOwnProfile: false,
			},
		});

		const moreButton = screen.getByRole('button', { name: /more actions/i });
		await fireEvent.click(moreButton);

		expect(screen.getByText('Share Profile')).toBeInTheDocument();
		expect(screen.getByText(/mention/i)).toBeInTheDocument();
	});

	it('displays verified fields with badges', () => {
		const profileWithFields = {
			...mockProfile,
			fields: [
				{
					name: 'Website',
					value: 'https://alice.dev',
					verifiedAt: '2024-01-15T10:00:00Z',
				},
			],
		};

		render(Profile.Root, {
			props: {
				profile: profileWithFields,
				handlers: {},
			},
		});

		expect(screen.getByText('Website')).toBeInTheDocument();
		expect(screen.getByText('https://alice.dev')).toBeInTheDocument();
		// Verified badge should be present
		expect(screen.getByTitle(/verified/i)).toBeInTheDocument();
	});

	it('handles loading state during follow action', async () => {
		const onFollow = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

		render(Profile.Root, {
			props: {
				profile: mockProfile,
				handlers: { onFollow },
				isOwnProfile: false,
			},
		});

		const followButton = screen.getByRole('button', { name: /follow/i });
		await fireEvent.click(followButton);

		expect(followButton).toBeDisabled();

		await waitFor(() => {
			expect(followButton).not.toBeDisabled();
		});
	});
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md) - Context provider
- [Profile.Stats](./Stats.md) - Statistics display
- [Profile.Fields](./Fields.md) - Custom fields display
- [Profile.VerifiedFields](./VerifiedFields.md) - Verified fields with badges
- [Profile.Edit](./Edit.md) - Profile editing form

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Getting Started Guide](../../GETTING_STARTED.md)
- [Accessibility Best Practices](../../patterns/ACCESSIBILITY.md)
- [Security Guidelines](../../patterns/SECURITY.md)
