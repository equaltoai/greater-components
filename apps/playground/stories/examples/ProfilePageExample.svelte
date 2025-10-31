<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ProfileHeader,
		TimelineVirtualized,
		TransportManager,
		MockTransport,
		MastodonTransport,
		createTimelineStore,
		type Account,
		type Status,
		type Transport,
		type Relationship,
	} from '@greater-components/fediverse';
	import {
		createLesserGraphQLAdapter,
		type LesserGraphQLAdapter,
	} from '@equaltoai/greater-components-adapters';

	interface Props {
		useMockData?: boolean;
		profileId?: string;
		isOwnProfile?: boolean;
		showTimeline?: boolean;
		showStats?: boolean;
		enableEditing?: boolean;
		showRelationships?: boolean;
	}

	let {
		useMockData = true,
		profileId = 'user123',
		isOwnProfile = false,
		showTimeline = true,
		showStats = true,
		enableEditing = false,
		showRelationships = true,
	}: Props = $props();

	let transport = $state<Transport | null>(null);
	let graphqlAdapter = $state<LesserGraphQLAdapter | null>(null);
	let account = $state<Account | null>(null);
	let relationship = $state<Relationship | null>(null);
	let timelineStore = $state(createTimelineStore());
	let activeTab = $state<'posts' | 'replies' | 'media' | 'likes'>('posts');
	let isEditing = $state(false);
	let followers = $state<Account[]>([]);
	let following = $state<Account[]>([]);
	let followersNextCursor = $state<string | undefined>(undefined);
	let followingNextCursor = $state<string | undefined>(undefined);
	let followersTotalCount = $state(0);
	let followingTotalCount = $state(0);
	let showFollowersList = $state(false);
	let showFollowingList = $state(false);
	let loadingFollowers = $state(false);
	let loadingFollowing = $state(false);

	// Mock data for demonstration
	const mockAccount: Account = {
		id: profileId,
		username: profileId === 'verified_user' ? 'verified_account' : 'johndoe',
		acct:
			profileId === 'verified_user'
				? 'verified_account@mastodon.social'
				: 'johndoe@mastodon.social',
		display_name: profileId === 'verified_user' ? 'Verified Account ✓' : 'John Doe',
		avatar: `https://picsum.photos/seed/${profileId}/200`,
		avatar_static: `https://picsum.photos/seed/${profileId}/200`,
		header: `https://picsum.photos/seed/${profileId}-header/1500/500`,
		header_static: `https://picsum.photos/seed/${profileId}-header/1500/500`,
		note:
			profileId === 'verified_user'
				? '<p>Official account. Verified since 2020. Tech enthusiast, open source advocate.</p>'
				: '<p>Software developer | Open source enthusiast | Coffee addict ☕</p>',
		url: `https://mastodon.social/@${profileId}`,
		created_at: '2020-01-01T00:00:00.000Z',
		followers_count: profileId === 'verified_user' ? 50000 : 1234,
		following_count: profileId === 'verified_user' ? 500 : 567,
		statuses_count: profileId === 'verified_user' ? 10000 : 890,
		bot: false,
		locked: false,
		verified: profileId === 'verified_user',
		fields: [
			{
				name: 'Website',
				value: '<a href="https://example.com">example.com</a>',
				verified_at: profileId === 'verified_user' ? '2020-01-01T00:00:00.000Z' : null,
			},
			{
				name: 'GitHub',
				value: '<a href="https://github.com/johndoe">@johndoe</a>',
				verified_at: null,
			},
			{ name: 'Location', value: 'San Francisco, CA', verified_at: null },
			{ name: 'Pronouns', value: 'they/them', verified_at: null },
		],
	};

	const mockRelationship: Relationship = {
		id: profileId,
		following: false,
		followed_by: false,
		blocking: false,
		blocked_by: false,
		muting: false,
		muting_notifications: false,
		requested: false,
		domain_blocking: false,
		showing_reblogs: true,
		endorsed: false,
		notifying: false,
		note: '',
	};

	onMount(() => {
		initializeTransport();

		return () => {
			if (transport) {
				TransportManager.disconnect();
			}
		};
	});

	async function initializeTransport() {
		try {
			if (useMockData) {
				transport = new MockTransport();
				await TransportManager.initialize(transport);

				// Load mock data
				account = mockAccount;
				relationship = isOwnProfile ? null : mockRelationship;

				if (showTimeline) {
					loadUserTimeline();
				}

				if (showRelationships) {
					loadRelationships();
				}
			} else {
				const token = localStorage.getItem('mastodon_token') || '';
				const lesserToken = localStorage.getItem('lesser_token') || '';

				if (lesserToken) {
					// Use GraphQL adapter for Lesser
					graphqlAdapter = createLesserGraphQLAdapter({
						httpEndpoint: 'https://dev.lesser.host/api/graphql',
						wsEndpoint: 'wss://dev.lesser.host/api/graphql',
						token: lesserToken,
						debug: true,
					});

					loadRealProfile();
				} else if (token) {
					transport = new MastodonTransport('https://mastodon.social', token);
					await TransportManager.initialize(transport);
					loadRealProfile();
				} else {
					// Fallback to mock
					transport = new MockTransport();
					await TransportManager.initialize(transport);
					account = mockAccount;
					relationship = mockRelationship;
				}
			}
		} catch (error) {
			console.error('Failed to initialize transport:', error);
		}
	}

	async function loadRealProfile() {
		if (!transport) return;

		try {
			account = await transport.getAccount(profileId);

			if (!isOwnProfile) {
				const relationships = await transport.getRelationships([profileId]);
				relationship = relationships[0];
			}

			if (showTimeline) {
				loadUserTimeline();
			}

			if (showRelationships) {
				loadRelationships();
			}
		} catch (error) {
			console.error('Failed to load profile:', error);
			// Fallback to mock data
			account = mockAccount;
			relationship = mockRelationship;
		}
	}

	async function loadUserTimeline() {
		if (!transport || !account) return;

		try {
			let statuses: Status[];

			switch (activeTab) {
				case 'posts':
					statuses = await transport.getAccountStatuses(account.id, { exclude_replies: true });
					break;
				case 'replies':
					statuses = await transport.getAccountStatuses(account.id, { only_replies: true });
					break;
				case 'media':
					statuses = await transport.getAccountStatuses(account.id, { only_media: true });
					break;
				case 'likes':
					// This would require a different endpoint in real API
					statuses = await transport.getAccountStatuses(account.id);
					break;
				default:
					statuses = await transport.getAccountStatuses(account.id);
			}

			timelineStore.setStatuses(statuses);
		} catch (error) {
			console.error('Failed to load timeline:', error);
		}
	}

	async function loadRelationships() {
		if (useMockData || !graphqlAdapter || !account) {
			// Mock data fallback
			followers = Array(5)
				.fill(null)
				.map((_, i) => ({
					...mockAccount,
					id: `follower-${i}`,
					username: `follower${i}`,
					display_name: `Follower ${i}`,
					avatar: `https://picsum.photos/seed/follower-${i}/200`,
				}));

			following = Array(5)
				.fill(null)
				.map((_, i) => ({
					...mockAccount,
					id: `following-${i}`,
					username: `following${i}`,
					display_name: `Following ${i}`,
					avatar: `https://picsum.photos/seed/following-${i}/200`,
				}));
			return;
		}

		try {
			// Use GraphQL to fetch followers and following
			const followersData = await graphqlAdapter.getFollowers(account.username, 40);
			const followingData = await graphqlAdapter.getFollowing(account.username, 40);

			// Convert GraphQL actors to Account format
			followers = followersData.actors.map((actor) => ({
				id: actor.id,
				username: actor.username,
				acct: actor.domain ? `${actor.username}@${actor.domain}` : actor.username,
				display_name: actor.displayName || actor.username,
				avatar: actor.avatar || '',
				avatar_static: actor.avatar || '',
				note: actor.summary || '',
				url: `https://example.com/@${actor.username}`,
				created_at: actor.createdAt,
				followers_count: actor.followers,
				following_count: actor.following,
				statuses_count: actor.statusesCount,
				bot: actor.bot,
				locked: actor.locked,
				trustScore: actor.trustScore,
			}));

			following = followingData.actors.map((actor) => ({
				id: actor.id,
				username: actor.username,
				acct: actor.domain ? `${actor.username}@${actor.domain}` : actor.username,
				display_name: actor.displayName || actor.username,
				avatar: actor.avatar || '',
				avatar_static: actor.avatar || '',
				note: actor.summary || '',
				url: `https://example.com/@${actor.username}`,
				created_at: actor.createdAt,
				followers_count: actor.followers,
				following_count: actor.following,
				statuses_count: actor.statusesCount,
				bot: actor.bot,
				locked: actor.locked,
				trustScore: actor.trustScore,
			}));

			followersNextCursor = followersData.nextCursor;
			followingNextCursor = followingData.nextCursor;
			followersTotalCount = followersData.totalCount;
			followingTotalCount = followingData.totalCount;
		} catch (error) {
			console.error('Failed to load relationships via GraphQL:', error);
			// Fallback to mock data
			followers = Array(5)
				.fill(null)
				.map((_, i) => ({
					...mockAccount,
					id: `follower-${i}`,
					username: `follower${i}`,
					display_name: `Follower ${i}`,
					avatar: `https://picsum.photos/seed/follower-${i}/200`,
				}));

			following = Array(5)
				.fill(null)
				.map((_, i) => ({
					...mockAccount,
					id: `following-${i}`,
					username: `following${i}`,
					display_name: `Following ${i}`,
					avatar: `https://picsum.photos/seed/following-${i}/200`,
				}));
		}
	}

	async function handleFollow() {
		if (!transport || !account || !relationship) return;

		try {
			if (relationship.following) {
				await transport.unfollowAccount(account.id);
				relationship.following = false;
			} else {
				await transport.followAccount(account.id);
				relationship.following = true;
			}
		} catch (error) {
			console.error('Failed to follow/unfollow:', error);
		}
	}

	async function handleMute() {
		if (!transport || !account || !relationship) return;

		try {
			if (relationship.muting) {
				await transport.unmuteAccount(account.id);
				relationship.muting = false;
			} else {
				await transport.muteAccount(account.id);
				relationship.muting = true;
			}
		} catch (error) {
			console.error('Failed to mute/unmute:', error);
		}
	}

	async function handleBlock() {
		if (!transport || !account || !relationship) return;

		try {
			if (relationship.blocking) {
				await transport.unblockAccount(account.id);
				relationship.blocking = false;
			} else {
				await transport.blockAccount(account.id);
				relationship.blocking = true;
			}
		} catch (error) {
			console.error('Failed to block/unblock:', error);
		}
	}

	async function saveProfile(updates: Partial<Account>) {
		if (!account || !isOwnProfile) return;

		try {
			if (graphqlAdapter) {
				// Use GraphQL updateProfile mutation
				const updated = await graphqlAdapter.updateProfile({
					displayName: updates.display_name,
					bio: updates.note?.replace(/<[^>]*>/g, ''), // Strip HTML
					avatar: updates.avatar,
					header: updates.header,
					fields: updates.fields?.map((f) => ({
						name: f.name,
						value: f.value,
						verifiedAt: f.verified_at || undefined,
					})),
				});

				// Convert back to Account format
				account = {
					...account,
					display_name: updated.displayName || account.display_name,
					note: updated.summary || account.note,
					avatar: updated.avatar || account.avatar,
					header: updated.header || account.header,
					fields: updated.fields.map((f) => ({
						name: f.name,
						value: f.value,
						verified_at: f.verifiedAt || null,
					})),
				};

				isEditing = false;
			} else if (transport) {
				const updated = await transport.updateCredentials({
					display_name: updates.display_name,
					note: updates.note,
					avatar: updates.avatar,
					header: updates.header,
					fields_attributes: updates.fields,
				});

				account = updated;
				isEditing = false;
			}
		} catch (error) {
			console.error('Failed to update profile:', error);
		}
	}

	async function loadMoreFollowers() {
		if (!graphqlAdapter || !account || loadingFollowers || !followersNextCursor) return;

		loadingFollowers = true;
		try {
			const followersData = await graphqlAdapter.getFollowers(
				account.username,
				40,
				followersNextCursor
			);

			// Append to existing followers
			const newFollowers = followersData.actors.map((actor) => ({
				id: actor.id,
				username: actor.username,
				acct: actor.domain ? `${actor.username}@${actor.domain}` : actor.username,
				display_name: actor.displayName || actor.username,
				avatar: actor.avatar || '',
				avatar_static: actor.avatar || '',
				note: actor.summary || '',
				url: `https://example.com/@${actor.username}`,
				created_at: actor.createdAt,
				followers_count: actor.followers,
				following_count: actor.following,
				statuses_count: actor.statusesCount,
				bot: actor.bot,
				locked: actor.locked,
				trustScore: actor.trustScore,
			}));

			followers = [...followers, ...newFollowers];
			followersNextCursor = followersData.nextCursor;
		} catch (error) {
			console.error('Failed to load more followers:', error);
		} finally {
			loadingFollowers = false;
		}
	}

	async function loadMoreFollowing() {
		if (!graphqlAdapter || !account || loadingFollowing || !followingNextCursor) return;

		loadingFollowing = true;
		try {
			const followingData = await graphqlAdapter.getFollowing(
				account.username,
				40,
				followingNextCursor
			);

			// Append to existing following
			const newFollowing = followingData.actors.map((actor) => ({
				id: actor.id,
				username: actor.username,
				acct: actor.domain ? `${actor.username}@${actor.domain}` : actor.username,
				display_name: actor.displayName || actor.username,
				avatar: actor.avatar || '',
				avatar_static: actor.avatar || '',
				note: actor.summary || '',
				url: `https://example.com/@${actor.username}`,
				created_at: actor.createdAt,
				followers_count: actor.followers,
				following_count: actor.following,
				statuses_count: actor.statusesCount,
				bot: actor.bot,
				locked: actor.locked,
				trustScore: actor.trustScore,
			}));

			following = [...following, ...newFollowing];
			followingNextCursor = followingData.nextCursor;
		} catch (error) {
			console.error('Failed to load more following:', error);
		} finally {
			loadingFollowing = false;
		}
	}

	function switchTab(tab: typeof activeTab) {
		activeTab = tab;
		loadUserTimeline();
	}

	$effect(() => {
		if (account && showTimeline) {
			loadUserTimeline();
		}
	});
</script>

<div class="profile-page">
	{#if account}
		<!-- Profile Header -->
		<ProfileHeader
			{account}
			{relationship}
			{isOwnProfile}
			{showStats}
			on:follow={handleFollow}
			on:mute={handleMute}
			on:block={handleBlock}
			on:edit={() => (isEditing = true)}
		/>

		<!-- Edit Profile Modal -->
		{#if isEditing && isOwnProfile && enableEditing}
			<div class="edit-modal">
				<div class="modal-content">
					<h2>Edit Profile</h2>

					<form
						onsubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.currentTarget);
							saveProfile({
								display_name: formData.get('display_name') as string,
								note: formData.get('note') as string,
							});
						}}
					>
						<div class="form-field">
							<label for="display_name">Display Name</label>
							<input
								id="display_name"
								name="display_name"
								type="text"
								value={account.display_name}
								maxlength="30"
							/>
						</div>

						<div class="form-field">
							<label for="note">Bio</label>
							<textarea
								id="note"
								name="note"
								rows="4"
								maxlength="500"
								value={account.note.replace(/<[^>]*>/g, '')}
							></textarea>
						</div>

						<div class="form-actions">
							<button type="button" onclick={() => (isEditing = false)}> Cancel </button>
							<button type="submit" class="primary"> Save Changes </button>
						</div>
					</form>
				</div>
			</div>
		{/if}

		<!-- Relationships Lists -->
		{#if showRelationships}
			<div class="relationships-bar">
				<button
					class="relationship-button"
					onclick={() => (showFollowersList = !showFollowersList)}
				>
					<strong>{account.followers_count.toLocaleString()}</strong> Followers
				</button>

				<button
					class="relationship-button"
					onclick={() => (showFollowingList = !showFollowingList)}
				>
					<strong>{account.following_count.toLocaleString()}</strong> Following
				</button>
			</div>

			{#if showFollowersList}
				<div class="relationships-list">
					<h3>
						Followers {followersTotalCount > 0 ? `(${followersTotalCount.toLocaleString()})` : ''}
					</h3>
					<div class="accounts-grid">
						{#each followers as follower (follower.id)}
							<div class="account-card">
								<img src={follower.avatar} alt={follower.display_name} />
								<div class="account-info">
									<div class="account-name">{follower.display_name}</div>
									<div class="account-handle">@{follower.username}</div>
								</div>
							</div>
						{/each}
					</div>
					{#if followersNextCursor && !loadingFollowers}
						<button class="load-more-btn" onclick={loadMoreFollowers}> Load More Followers </button>
					{/if}
					{#if loadingFollowers}
						<div class="loading-more">Loading more followers...</div>
					{/if}
				</div>
			{/if}

			{#if showFollowingList}
				<div class="relationships-list">
					<h3>
						Following {followingTotalCount > 0 ? `(${followingTotalCount.toLocaleString()})` : ''}
					</h3>
					<div class="accounts-grid">
						{#each following as account (account.id)}
							<div class="account-card">
								<img src={account.avatar} alt={account.display_name} />
								<div class="account-info">
									<div class="account-name">{account.display_name}</div>
									<div class="account-handle">@{account.username}</div>
								</div>
							</div>
						{/each}
					</div>
					{#if followingNextCursor && !loadingFollowing}
						<button class="load-more-btn" onclick={loadMoreFollowing}> Load More Following </button>
					{/if}
					{#if loadingFollowing}
						<div class="loading-more">Loading more following...</div>
					{/if}
				</div>
			{/if}
		{/if}

		<!-- Timeline Tabs -->
		{#if showTimeline}
			<div class="timeline-section">
				<div class="timeline-tabs">
					<button
						class="tab"
						class:active={activeTab === 'posts'}
						onclick={() => switchTab('posts')}
					>
						Posts
						<span class="tab-count">{account.statuses_count}</span>
					</button>

					<button
						class="tab"
						class:active={activeTab === 'replies'}
						onclick={() => switchTab('replies')}
					>
						Replies
					</button>

					<button
						class="tab"
						class:active={activeTab === 'media'}
						onclick={() => switchTab('media')}
					>
						Media
					</button>

					<button
						class="tab"
						class:active={activeTab === 'likes'}
						onclick={() => switchTab('likes')}
					>
						Likes
					</button>
				</div>

				<!-- Timeline Content -->
				<div class="timeline-content">
					{#if $timelineStore.loading}
						<div class="loading">Loading timeline...</div>
					{:else if $timelineStore.error}
						<div class="error">Error: {$timelineStore.error}</div>
					{:else if $timelineStore.statuses.length === 0}
						<div class="empty">No posts to show</div>
					{:else}
						<TimelineVirtualized
							statuses={$timelineStore.statuses}
							loading={false}
							error={null}
							itemHeight={150}
							overscan={3}
						/>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Stats Panel -->
		{#if showStats && !showTimeline}
			<div class="stats-panel">
				<div class="stat">
					<div class="stat-value">{account.statuses_count.toLocaleString()}</div>
					<div class="stat-label">Posts</div>
				</div>

				<div class="stat">
					<div class="stat-value">{account.followers_count.toLocaleString()}</div>
					<div class="stat-label">Followers</div>
				</div>

				<div class="stat">
					<div class="stat-value">{account.following_count.toLocaleString()}</div>
					<div class="stat-label">Following</div>
				</div>

				<div class="stat">
					<div class="stat-value">
						{new Date(account.created_at).toLocaleDateString()}
					</div>
					<div class="stat-label">Joined</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="loading-profile">Loading profile...</div>
	{/if}
</div>

<style>
	.profile-page {
		min-height: 100vh;
		background: var(--gc-color-surface-100);
	}

	.edit-modal {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: var(--gc-color-surface-100);
		border-radius: var(--gc-radius-lg);
		padding: var(--gc-spacing-lg);
		max-width: 500px;
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-content h2 {
		margin: 0 0 var(--gc-spacing-md) 0;
		color: var(--gc-color-text-primary);
	}

	.form-field {
		margin-bottom: var(--gc-spacing-md);
	}

	.form-field label {
		display: block;
		margin-bottom: var(--gc-spacing-xs);
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
	}

	.form-field input,
	.form-field textarea {
		width: 100%;
		padding: var(--gc-spacing-sm);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-surface-200);
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-md);
	}

	.form-actions {
		display: flex;
		gap: var(--gc-spacing-sm);
		justify-content: flex-end;
		margin-top: var(--gc-spacing-lg);
	}

	.form-actions button {
		padding: var(--gc-spacing-sm) var(--gc-spacing-md);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-surface-200);
		color: var(--gc-color-text-primary);
		cursor: pointer;
		font-size: var(--gc-font-size-sm);
	}

	.form-actions button.primary {
		background: var(--gc-color-primary-500);
		color: white;
		border-color: var(--gc-color-primary-500);
	}

	.relationships-bar {
		display: flex;
		gap: var(--gc-spacing-md);
		padding: var(--gc-spacing-md);
		background: var(--gc-color-surface-200);
		border-bottom: 1px solid var(--gc-color-border-subtle);
	}

	.relationship-button {
		background: none;
		border: none;
		color: var(--gc-color-text-primary);
		cursor: pointer;
		font-size: var(--gc-font-size-md);
		padding: 0;
	}

	.relationship-button strong {
		color: var(--gc-color-primary-600);
	}

	.relationships-list {
		padding: var(--gc-spacing-md);
		background: var(--gc-color-surface-200);
		border-bottom: 1px solid var(--gc-color-border-subtle);
	}

	.relationships-list h3 {
		margin: 0 0 var(--gc-spacing-md) 0;
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-lg);
	}

	.accounts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--gc-spacing-md);
	}

	.account-card {
		display: flex;
		align-items: center;
		gap: var(--gc-spacing-sm);
		padding: var(--gc-spacing-sm);
		background: var(--gc-color-surface-100);
		border-radius: var(--gc-radius-sm);
	}

	.account-card img {
		width: 48px;
		height: 48px;
		border-radius: var(--gc-radius-full);
	}

	.account-info {
		flex: 1;
		min-width: 0;
	}

	.account-name {
		font-weight: 600;
		color: var(--gc-color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.account-handle {
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timeline-section {
		flex: 1;
	}

	.timeline-tabs {
		display: flex;
		background: var(--gc-color-surface-200);
		border-bottom: 1px solid var(--gc-color-border-subtle);
	}

	.tab {
		flex: 1;
		padding: var(--gc-spacing-md);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--gc-color-text-secondary);
		cursor: pointer;
		font-size: var(--gc-font-size-md);
		transition: all 0.2s;
	}

	.tab.active {
		color: var(--gc-color-primary-600);
		border-bottom-color: var(--gc-color-primary-500);
	}

	.tab-count {
		margin-left: var(--gc-spacing-xs);
		padding: 2px 6px;
		background: var(--gc-color-surface-300);
		border-radius: var(--gc-radius-full);
		font-size: var(--gc-font-size-xs);
	}

	.timeline-content {
		min-height: 400px;
		background: var(--gc-color-surface-100);
	}

	.stats-panel {
		display: flex;
		justify-content: space-around;
		padding: var(--gc-spacing-lg);
		background: var(--gc-color-surface-200);
	}

	.stat {
		text-align: center;
	}

	.stat-value {
		font-size: var(--gc-font-size-xl);
		font-weight: 700;
		color: var(--gc-color-text-primary);
	}

	.stat-label {
		font-size: var(--gc-font-size-sm);
		color: var(--gc-color-text-secondary);
		text-transform: uppercase;
		margin-top: var(--gc-spacing-xs);
	}

	.loading-profile,
	.loading,
	.error,
	.empty {
		padding: var(--gc-spacing-xl);
		text-align: center;
		color: var(--gc-color-text-secondary);
	}

	.error {
		color: var(--gc-color-error-600);
	}

	.load-more-btn {
		width: 100%;
		padding: var(--gc-spacing-md);
		margin-top: var(--gc-spacing-md);
		background: var(--gc-color-surface-300);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		color: var(--gc-color-text-primary);
		cursor: pointer;
		font-size: var(--gc-font-size-sm);
		transition: background 0.2s;
	}

	.load-more-btn:hover {
		background: var(--gc-color-surface-400);
	}

	.loading-more {
		padding: var(--gc-spacing-md);
		text-align: center;
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
	}

	@media (max-width: 768px) {
		.timeline-tabs {
			overflow-x: auto;
		}

		.tab {
			white-space: nowrap;
		}

		.accounts-grid {
			grid-template-columns: 1fr;
		}

		.stats-panel {
			flex-wrap: wrap;
			gap: var(--gc-spacing-md);
		}

		.stat {
			flex: 1 1 45%;
		}
	}
</style>
