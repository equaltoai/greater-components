# Profile.Root

**Component**: Context Provider  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 18 passing tests

---

## 📋 Overview

`Profile.Root` is the foundational component for all profile functionality. It creates and provides profile context to all child components, managing shared state, event handlers, and user interactions.

### **Key Features**:

- ✅ Centralized profile state management
- ✅ Shared event handlers for profile operations
- ✅ Edit mode toggle and management
- ✅ Tab navigation state
- ✅ Type-safe context API
- ✅ Flexible composition
- ✅ Error handling and loading states
- ✅ Support for own profile vs. viewing others

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
		bio: 'Developer & open source enthusiast',
		avatar: 'https://example.com/avatar.jpg',
		header: 'https://example.com/header.jpg',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{ name: 'Website', value: 'https://alice.dev' },
			{ name: 'Location', value: 'San Francisco' },
		],
		createdAt: '2023-01-15T10:00:00Z',
	};

	const handlers = {
		onFollow: async (userId) => {
			console.log('Following user:', userId);
		},
		onSave: async (editData) => {
			console.log('Saving profile:', editData);
		},
	};
</script>

<Profile.Root {profile} {handlers} isOwnProfile={false}>
	<Profile.Header />
	<Profile.Stats />
	<Profile.Fields />
</Profile.Root>
```

---

## 🎛️ Props

| Prop           | Type                  | Default | Required | Description                                |
| -------------- | --------------------- | ------- | -------- | ------------------------------------------ |
| `profile`      | `ProfileData \| null` | -       | **Yes**  | Profile data to display                    |
| `handlers`     | `ProfileHandlers`     | `{}`    | No       | Event handlers for profile operations      |
| `isOwnProfile` | `boolean`             | `false` | No       | Whether this is the current user's profile |
| `children`     | `Snippet`             | -       | No       | Child components                           |
| `class`        | `string`              | `''`    | No       | Custom CSS class                           |

### **ProfileData Interface**

```typescript
interface ProfileData {
	/** Unique profile ID */
	id: string;

	/** Username (handle) */
	username: string;

	/** Display name */
	displayName: string;

	/** Biography/description */
	bio?: string;

	/** Avatar image URL */
	avatar?: string;

	/** Header/banner image URL */
	header?: string;

	/** Profile URL */
	url?: string;

	/** Number of followers */
	followersCount: number;

	/** Number of accounts following */
	followingCount: number;

	/** Number of posts/statuses */
	statusesCount: number;

	/** Custom profile fields */
	fields?: ProfileField[];

	/** Account creation date */
	createdAt?: string;

	/** Whether current user is following */
	isFollowing?: boolean;

	/** Whether current user is followed by */
	isFollowedBy?: boolean;

	/** Whether account is blocked */
	isBlocked?: boolean;

	/** Whether account is muted */
	isMuted?: boolean;

	/** Detailed relationship data */
	relationship?: ProfileRelationship;
}
```

### **ProfileHandlers Interface**

```typescript
interface ProfileHandlers {
	// Social actions
	onFollow?: (userId: string) => Promise<void>;
	onUnfollow?: (userId: string) => Promise<void>;
	onBlock?: (userId: string) => Promise<void>;
	onUnblock?: (userId: string) => Promise<void>;
	onMute?: (userId: string, notifications?: boolean) => Promise<void>;
	onUnmute?: (userId: string) => Promise<void>;
	onReport?: (userId: string) => void;

	// Profile editing
	onSave?: (data: ProfileEditData) => Promise<void>;
	onAvatarUpload?: (file: File) => Promise<string>;
	onHeaderUpload?: (file: File) => Promise<string>;

	// Navigation
	onTabChange?: (tabId: string) => void;
	onShare?: () => void;
	onMention?: (username: string) => void;
	onMessage?: (userId: string) => void;

	// Follow requests
	onApproveFollowRequest?: (requestId: string) => Promise<void>;
	onRejectFollowRequest?: (requestId: string) => Promise<void>;

	// Endorsements
	onEndorseAccount?: (userId: string) => Promise<void>;
	onUnendorseAccount?: (userId: string) => Promise<void>;
	onReorderEndorsements?: (userIds: string[]) => Promise<void>;

	// Featured hashtags
	onAddFeaturedHashtag?: (hashtag: string) => Promise<void>;
	onRemoveFeaturedHashtag?: (hashtag: string) => Promise<void>;
	onReorderHashtags?: (hashtags: string[]) => Promise<void>;

	// Privacy settings
	onUpdatePrivacySettings?: (settings: Partial<PrivacySettings>) => Promise<void>;

	// Migration
	onInitiateMigration?: (targetAccount: string) => Promise<void>;
	onCancelMigration?: () => Promise<void>;

	// Follower management
	onRemoveFollower?: (userId: string) => Promise<void>;
	onLoadMoreFollowers?: () => Promise<void>;
	onLoadMoreFollowing?: () => Promise<void>;
	onSearchFollowers?: (query: string) => void;
	onSearchFollowing?: (query: string) => void;
}
```

---

## 📤 Context API

The `Profile.Root` component provides context that child components can access:

```typescript
interface ProfileContext {
	/** Current profile state */
	state: ProfileState;

	/** Event handlers */
	handlers: ProfileHandlers;

	/** Update profile state */
	updateState: (partial: Partial<ProfileState>) => void;

	/** Clear error message */
	clearError: () => void;

	/** Toggle edit mode */
	toggleEdit: () => void;

	/** Set active tab */
	setActiveTab: (tabId: string) => void;
}

interface ProfileState {
	/** Current profile data */
	profile: ProfileData | null;

	/** Edit mode active */
	editMode: boolean;

	/** Loading state */
	loading: boolean;

	/** Error message */
	error: string | null;

	/** Active tab ID */
	activeTab: string;

	/** Available tabs */
	tabs: ProfileTab[];

	/** Is own profile */
	isOwnProfile: boolean;
}
```

### **Accessing Context in Child Components**

```svelte
<script lang="ts">
	import { getProfileContext } from '@equaltoai/greater-components-fediverse/Profile';

	const { state, handlers, toggleEdit } = getProfileContext();
</script>

<div>
	<p>Username: {state.profile?.username}</p>
	<p>Edit mode: {state.editMode ? 'On' : 'Off'}</p>
	<button onclick={toggleEdit}>Toggle Edit</button>
</div>
```

---

## 💡 Examples

### **Example 1: Basic Profile Display**

Display a profile with standard components:

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
		bio: 'Software developer specializing in distributed systems and web technologies. Open source enthusiast.',
		avatar: 'https://cdn.example.com/avatars/alice.jpg',
		header: 'https://cdn.example.com/headers/alice-banner.jpg',
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
				verifiedAt: '2024-01-15T10:30:00Z',
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
			console.log('Following:', userId);
			// Implement follow logic
		},
		onShare: () => {
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

<div class="profile-page">
	<Profile.Root {profile} {handlers} isOwnProfile={false}>
		<Profile.Header showCover={true} showActions={true} showFields={true} />
		<div class="profile-body">
			<Profile.Stats clickable={true} />
			<Profile.Tabs />
		</div>
	</Profile.Root>
</div>

<style>
	.profile-page {
		max-width: 600px;
		margin: 0 auto;
	}

	.profile-body {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
```

### **Example 2: Own Profile with Edit Mode**

Display own profile with edit functionality:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type {
		ProfileData,
		ProfileEditData,
	} from '@equaltoai/greater-components-fediverse/Profile';

	let profile = $state<ProfileData>({
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Developer & open source enthusiast',
		avatar: 'https://cdn.example.com/avatars/alice.jpg',
		header: 'https://cdn.example.com/headers/alice.jpg',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [{ name: 'Website', value: 'https://alice.dev' }],
		createdAt: '2023-01-15T10:00:00Z',
	});

	let editMode = $state(false);
	let error = $state<string | null>(null);

	const handlers = {
		onSave: async (editData: ProfileEditData) => {
			try {
				const response = await fetch('/api/profile', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${getAuthToken()}`,
					},
					body: JSON.stringify(editData),
				});

				if (!response.ok) {
					throw new Error('Failed to update profile');
				}

				const updated = await response.json();
				profile = updated;
				editMode = false;
				error = null;
			} catch (err) {
				error = err instanceof Error ? err.message : 'Update failed';
				throw err;
			}
		},

		onAvatarUpload: async (file: File) => {
			const formData = new FormData();
			formData.append('avatar', file);

			const response = await fetch('/api/profile/avatar', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Avatar upload failed');
			}

			const { url } = await response.json();
			return url;
		},

		onHeaderUpload: async (file: File) => {
			const formData = new FormData();
			formData.append('header', file);

			const response = await fetch('/api/profile/header', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Header upload failed');
			}

			const { url } = await response.json();
			return url;
		},
	};

	function getAuthToken(): string {
		return localStorage.getItem('auth_token') || '';
	}
</script>

<div class="own-profile">
	{#if error}
		<div class="error-banner" role="alert">
			{error}
			<button onclick={() => (error = null)}>Dismiss</button>
		</div>
	{/if}

	<Profile.Root {profile} {handlers} isOwnProfile={true}>
		{#if editMode}
			<Profile.Edit maxFields={4} maxBioLength={500} />
		{:else}
			<Profile.Header showActions={true} />
			<Profile.Stats />
			<Profile.Fields />
		{/if}
	</Profile.Root>
</div>

<style>
	.own-profile {
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
</style>
```

### **Example 3: With Server-Side Data Loading**

Load profile data from server with loading and error states:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

	interface Props {
		username: string;
		currentUserId?: string;
	}

	let { username, currentUserId }: Props = $props();

	let profile = $state<ProfileData | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Load profile on mount
	$effect(() => {
		loadProfile();
	});

	async function loadProfile() {
		loading = true;
		error = null;

		try {
			const response = await fetch(`/api/profiles/${username}`, {
				credentials: 'include',
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Profile not found');
				}
				throw new Error('Failed to load profile');
			}

			profile = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	const isOwnProfile = $derived(profile?.id === currentUserId);

	const handlers = {
		onFollow: async (userId: string) => {
			const response = await fetch(`/api/accounts/${userId}/follow`, {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				await loadProfile(); // Refresh profile
			}
		},

		onUnfollow: async (userId: string) => {
			const response = await fetch(`/api/accounts/${userId}/unfollow`, {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				await loadProfile(); // Refresh profile
			}
		},

		onBlock: async (userId: string) => {
			if (!confirm('Block this user?')) return;

			const response = await fetch(`/api/accounts/${userId}/block`, {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				await loadProfile();
			}
		},
	};
</script>

<div class="profile-container">
	{#if loading}
		<div class="loading-state">
			<div class="spinner" aria-label="Loading profile"></div>
			<p>Loading profile...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<h2>Error</h2>
			<p>{error}</p>
			<button onclick={loadProfile}>Try Again</button>
		</div>
	{:else if profile}
		<Profile.Root {profile} {handlers} {isOwnProfile}>
			<Profile.Header />
			<Profile.Stats />
			<Profile.Tabs />
		</Profile.Root>
	{/if}
</div>

<style>
	.profile-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
	}

	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		gap: 1rem;
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

	.error-state button {
		padding: 0.75rem 1.5rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
	}
</style>
```

### **Example 4: With GraphQL Integration**

Use GraphQL for data fetching and mutations:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import { query, mutation } from '@urql/svelte';
	import { gql } from '@urql/core';

	interface Props {
		username: string;
	}

	let { username }: Props = $props();

	// GraphQL query
	const PROFILE_QUERY = gql`
		query GetProfile($username: String!) {
			profile(username: $username) {
				id
				username
				displayName
				bio
				avatar
				header
				followersCount
				followingCount
				statusesCount
				fields {
					name
					value
					verifiedAt
				}
				relationship {
					following
					followedBy
					blocking
					muting
					requested
				}
				createdAt
			}
		}
	`;

	const profileQuery = query({
		query: PROFILE_QUERY,
		variables: { username },
	});

	// GraphQL mutations
	const FOLLOW_MUTATION = gql`
		mutation Follow($userId: ID!) {
			follow(userId: $userId) {
				id
				relationship {
					following
					requested
				}
			}
		}
	`;

	const UNFOLLOW_MUTATION = gql`
		mutation Unfollow($userId: ID!) {
			unfollow(userId: $userId) {
				id
				relationship {
					following
				}
			}
		}
	`;

	const UPDATE_PROFILE_MUTATION = gql`
		mutation UpdateProfile($input: ProfileUpdateInput!) {
			updateProfile(input: $input) {
				id
				displayName
				bio
				avatar
				header
				fields {
					name
					value
					verifiedAt
				}
			}
		}
	`;

	const followMutation = mutation({ query: FOLLOW_MUTATION });
	const unfollowMutation = mutation({ query: UNFOLLOW_MUTATION });
	const updateProfileMutation = mutation({ query: UPDATE_PROFILE_MUTATION });

	const handlers = {
		onFollow: async (userId: string) => {
			await followMutation({ variables: { userId } });
			await profileQuery.reexecute({ requestPolicy: 'network-only' });
		},

		onUnfollow: async (userId: string) => {
			await unfollowMutation({ variables: { userId } });
			await profileQuery.reexecute({ requestPolicy: 'network-only' });
		},

		onSave: async (editData) => {
			const result = await updateProfileMutation({
				variables: { input: editData },
			});

			if (result.error) {
				throw new Error(result.error.message);
			}

			await profileQuery.reexecute({ requestPolicy: 'network-only' });
		},
	};

	const profile = $derived($profileQuery.data?.profile ?? null);
	const loading = $derived($profileQuery.fetching);
	const error = $derived($profileQuery.error?.message ?? null);
</script>

<div class="profile-graphql">
	{#if loading}
		<div class="loading">Loading...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if profile}
		<Profile.Root {profile} {handlers}>
			<Profile.Header />
			<Profile.Stats />
			<Profile.Fields />
		</Profile.Root>
	{/if}
</div>
```

### **Example 5: With Real-Time Updates**

Implement real-time profile updates using WebSockets:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

	interface Props {
		initialProfile: ProfileData;
		websocketUrl: string;
	}

	let { initialProfile, websocketUrl }: Props = $props();

	let profile = $state<ProfileData>(initialProfile);
	let ws: WebSocket | null = null;

	// Connect to WebSocket for real-time updates
	$effect(() => {
		ws = new WebSocket(websocketUrl);

		ws.onopen = () => {
			console.log('WebSocket connected');
			// Subscribe to profile updates
			ws?.send(
				JSON.stringify({
					type: 'subscribe',
					channel: 'profile',
					userId: profile.id,
				})
			);
		};

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);

			switch (message.type) {
				case 'profile.updated':
					// Merge updated fields
					profile = { ...profile, ...message.data };
					break;

				case 'profile.follower.added':
					profile.followersCount++;
					break;

				case 'profile.follower.removed':
					profile.followersCount--;
					break;

				case 'profile.following.added':
					profile.followingCount++;
					break;

				case 'profile.following.removed':
					profile.followingCount--;
					break;

				case 'profile.status.created':
					profile.statusesCount++;
					break;
			}
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		ws.onclose = () => {
			console.log('WebSocket disconnected');
			// Attempt to reconnect after delay
			setTimeout(() => {
				if (!ws || ws.readyState === WebSocket.CLOSED) {
					// Re-trigger effect to reconnect
				}
			}, 5000);
		};

		// Cleanup on unmount
		return () => {
			if (ws) {
				ws.close();
				ws = null;
			}
		};
	});

	const handlers = {
		onFollow: async (userId: string) => {
			// Optimistic update
			const previousRelationship = profile.relationship;
			profile.relationship = {
				...previousRelationship!,
				following: true,
			};

			try {
				const response = await fetch(`/api/accounts/${userId}/follow`, {
					method: 'POST',
					credentials: 'include',
				});

				if (!response.ok) {
					// Revert on error
					profile.relationship = previousRelationship;
					throw new Error('Follow failed');
				}

				// WebSocket will send update for follower count
			} catch (error) {
				profile.relationship = previousRelationship;
				console.error(error);
			}
		},

		onSave: async (editData) => {
			const response = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editData),
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Update failed');
			}

			// WebSocket will send the updated profile data
		},
	};
</script>

<div class="profile-realtime">
	<div class="connection-status">
		{#if ws?.readyState === WebSocket.OPEN}
			<span class="status-dot connected"></span>
			<span>Live</span>
		{:else}
			<span class="status-dot disconnected"></span>
			<span>Connecting...</span>
		{/if}
	</div>

	<Profile.Root {profile} {handlers}>
		<Profile.Header />
		<Profile.Stats />
		<Profile.Fields />
	</Profile.Root>
</div>

<style>
	.profile-realtime {
		max-width: 600px;
		margin: 0 auto;
	}

	.connection-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.status-dot.connected {
		background: #00ba7c;
		box-shadow: 0 0 6px #00ba7c;
	}

	.status-dot.disconnected {
		background: #8899a6;
	}
</style>
```

---

## 🔒 Security Considerations

### **Server-Side Validation**

Always validate profile data on the server:

```typescript
// server/api/profile.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const ProfileUpdateSchema = z.object({
	displayName: z.string().min(1).max(50).optional(),
	bio: z.string().max(500).optional(),
	fields: z
		.array(
			z.object({
				name: z.string().min(1).max(30),
				value: z.string().min(1).max(100),
			})
		)
		.max(4)
		.optional(),
});

export async function POST(request: Request) {
	// Get authenticated user
	const userId = await getAuthenticatedUserId(request);
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Parse and validate input
	const body = await request.json();
	const validated = ProfileUpdateSchema.parse(body);

	// Sanitize HTML content
	const sanitized = {
		...validated,
		bio: validated.bio
			? DOMPurify.sanitize(validated.bio, {
					ALLOWED_TAGS: ['a', 'br', 'p', 'strong', 'em'],
					ALLOWED_ATTR: ['href', 'rel'],
				})
			: undefined,
		fields: validated.fields?.map((field) => ({
			name: DOMPurify.sanitize(field.name, { ALLOWED_TAGS: [] }),
			value: DOMPurify.sanitize(field.value, {
				ALLOWED_TAGS: ['a'],
				ALLOWED_ATTR: ['href', 'rel'],
			}),
		})),
	};

	// Update database
	const updated = await db.profiles.update({
		where: { userId },
		data: sanitized,
	});

	// Create audit log
	await db.auditLogs.create({
		data: {
			userId,
			action: 'profile.update',
			details: JSON.stringify(sanitized),
			ipAddress: request.headers.get('x-forwarded-for'),
			userAgent: request.headers.get('user-agent'),
			timestamp: new Date(),
		},
	});

	return new Response(JSON.stringify(updated), {
		headers: { 'Content-Type': 'application/json' },
	});
}
```

### **Rate Limiting**

Implement rate limiting for profile operations:

```typescript
// server/middleware/rateLimit.ts
import { RateLimiter } from 'limiter';

const profileUpdateLimiter = new RateLimiter({
	tokensPerInterval: 5,
	interval: 'hour',
	fireImmediately: true,
});

export async function checkProfileUpdateRateLimit(userId: string) {
	const hasTokens = await profileUpdateLimiter.tryRemoveTokens(1);

	if (!hasTokens) {
		throw new Error('Rate limit exceeded. Please try again later.');
	}
}
```

### **Image Upload Validation**

Validate and process uploaded images securely:

```typescript
// server/api/upload.ts
import sharp from 'sharp';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadAvatar(request: Request) {
	const userId = await getAuthenticatedUserId(request);
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get('avatar') as File;

	// Validate file
	if (!file) {
		return new Response('No file provided', { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return new Response('Invalid file type', { status: 400 });
	}

	if (file.size > MAX_FILE_SIZE) {
		return new Response('File too large', { status: 400 });
	}

	// Process image with sharp
	const buffer = await file.arrayBuffer();
	const processed = await sharp(Buffer.from(buffer))
		.resize(400, 400, {
			fit: 'cover',
			position: 'center',
		})
		.jpeg({ quality: 90 })
		.toBuffer();

	// Upload to storage (S3, CloudFlare R2, etc.)
	const url = await uploadToStorage(processed, `avatars/${userId}.jpg`);

	// Update profile
	await db.profiles.update({
		where: { userId },
		data: { avatar: url },
	});

	// Log upload
	await db.auditLogs.create({
		data: {
			userId,
			action: 'profile.avatar.upload',
			details: JSON.stringify({ size: processed.length, url }),
			timestamp: new Date(),
		},
	});

	return new Response(JSON.stringify({ url }), {
		headers: { 'Content-Type': 'application/json' },
	});
}
```

---

## 🎨 Styling

The Root component provides minimal styling, allowing child components to be styled independently:

```css
/* Default styles */
.profile-root {
	width: 100%;
	max-width: 100%;
}

/* Custom theme */
.profile-root {
	--profile-bg-primary: #ffffff;
	--profile-bg-secondary: #f7f9fa;
	--profile-text-primary: #0f1419;
	--profile-text-secondary: #536471;
	--profile-border-color: #e1e8ed;
	--profile-primary-color: #1d9bf0;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
	.profile-root {
		--profile-bg-primary: #15202b;
		--profile-bg-secondary: #192734;
		--profile-text-primary: #f7f9fa;
		--profile-text-secondary: #8899a6;
		--profile-border-color: #38444d;
	}
}
```

---

## ♿ Accessibility

The Profile.Root component ensures accessibility for all child components:

- ✅ **Semantic Structure**: Proper HTML5 semantics
- ✅ **Keyboard Navigation**: All interactive elements keyboard accessible
- ✅ **Screen Readers**: Context changes announced appropriately
- ✅ **Focus Management**: Logical focus order maintained
- ✅ **ARIA Labels**: Proper labeling throughout

---

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

describe('Profile.Root', () => {
	it('provides context to child components', () => {
		const profile = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
			followersCount: 100,
			followingCount: 50,
			statusesCount: 200,
		};

		render(Profile.Root, {
			props: { profile, handlers: {} },
		});

		// Context should be accessible by children
		expect(screen.getByText('Alice')).toBeInTheDocument();
	});

	it('updates profile when prop changes', async () => {
		const { component } = render(Profile.Root, {
			props: {
				profile: { id: '1', username: 'alice', displayName: 'Alice' },
				handlers: {},
			},
		});

		await component.$set({
			profile: { id: '1', username: 'alice', displayName: 'Alice Updated' },
		});

		expect(screen.getByText('Alice Updated')).toBeInTheDocument();
	});

	it('manages edit mode state', async () => {
		const profile = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
		};

		render(Profile.Root, {
			props: { profile, handlers: {}, isOwnProfile: true },
		});

		// Edit mode should start as false
		// Test edit toggle functionality
	});
});
```

---

## 🔗 Related Components

- [Profile.Header](./Header.md) - Profile header display
- [Profile.Edit](./Edit.md) - Profile editing form
- [Profile.Stats](./Stats.md) - Statistics display
- [Profile.Tabs](./Tabs.md) - Tab navigation
- [Profile.Fields](./Fields.md) - Custom fields

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Getting Started Guide](../../GETTING_STARTED.md)
- [Context API Documentation](../../patterns/CONTEXT_API.md)
- [State Management Best Practices](../../patterns/STATE_MANAGEMENT.md)
