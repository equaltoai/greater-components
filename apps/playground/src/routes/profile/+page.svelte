<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import {
		Button,
		Tabs,
		TextField,
		TextArea,
		Modal,
		Avatar,
		Skeleton,
	} from '@equaltoai/greater-components-primitives';
	import { ProfileHeader, StatusCard } from '@equaltoai/greater-components-fediverse';
	import type { DemoPageData } from '$lib/types/demo';
	import type { ProfileConnection } from '$lib/types/fediverse';
	import {
		getDemoProfile,
		getPinnedStatuses,
		createStatusShowcase,
		createThreadReplies,
		getProfileMediaGallery,
		getProfileConnections,
	} from '$lib/data/fediverse';

	let { data }: { data: DemoPageData } = $props();

	const baseProfile = getDemoProfile();
	let profile = $state(baseProfile);
	let showEditModal = $state(false);
	let editName = $state(baseProfile.displayName ?? '');
	let editBio = $state(stripHtml(baseProfile.note ?? ''));
	let mediaLoading = $state(true);
	let followToast = $state('');

	const pinned = getPinnedStatuses().slice(0, 2);
	const posts = createStatusShowcase().slice(0, 3);
	const replies = createThreadReplies().slice(0, 3);
	const likes = createStatusShowcase().slice(1, 4);
	const mediaGallery = getProfileMediaGallery();

	const { followers: followerSeed, following: followingSeed } = getProfileConnections();
	const mediaSkeletons = Array.from({ length: 4 }, (_, index) => index);
	let followers = $state<ProfileConnection[]>(followerSeed);
	let following = $state<ProfileConnection[]>(followingSeed);

	const tabs = [
		{ id: 'posts', label: 'Posts', content: PostsTab },
		{ id: 'replies', label: 'Replies', content: RepliesTab },
		{ id: 'media', label: 'Media', content: MediaTab },
		{ id: 'likes', label: 'Likes', content: LikesTab },
	] as const;
	let activeTab = $state(tabs[0].id);

	$effect(() => {
		const timer = setTimeout(() => (mediaLoading = false), 700);
		return () => clearTimeout(timer);
	});

	function stripHtml(value: string) {
		return value.replace(/<[^>]*>/g, '').trim();
	}

	function formatNote(note: string) {
		const trimmed = note.trim();
		if (!trimmed) return '';
		return `<p>${trimmed}</p>`;
	}

	function syncEditFields() {
		editName = profile.displayName ?? '';
		editBio = stripHtml(profile.note ?? '');
	}

	function openEditModal() {
		syncEditFields();
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		syncEditFields();
	}

	function saveProfile(event: SubmitEvent) {
		event.preventDefault();
		profile = {
			...profile,
			displayName: editName.trim() || profile.displayName,
			note: formatNote(editBio),
		};
		closeEditModal();
	}

	function toggleConnection(list: 'followers' | 'following', id: string) {
		const collection = list === 'followers' ? followers : following;
		const index = collection.findIndex((entry) => entry.id === id);
		if (index === -1) return;

		const entry = collection[index];
		const updatedEntry = { ...entry, following: !entry.following };
		const updated = [...collection];
		updated[index] = updatedEntry;

		if (list === 'followers') {
			followers = updated;
		} else {
			following = updated;
		}

		const delta = updatedEntry.following ? 1 : -1;
		profile = {
			...profile,
			followingCount: Math.max(0, profile.followingCount + delta),
		};

		followToast = `${updatedEntry.following ? 'Following' : 'Unfollowed'} ${entry.displayName}`;
		setTimeout(() => (followToast = ''), 2000);
	}

	function handleTabChange(id: string) {
		activeTab = id;
	}
</script>

<DemoPage
	eyebrow="Fediverse Surface"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="profile-section">
		<ProfileHeader account={profile} showFields showCounts followButton={ProfileActionSnippet} />
	</section>

	<section class="profile-section">
		<header class="profile-section__header">
			<div>
				<p class="section-eyebrow">Pinned posts</p>
				<h2>Curated highlights</h2>
				<p class="muted">Two pinned updates keep press kits and release cadences handy.</p>
			</div>
		</header>
		<div class="pinned-rail">
			{#each pinned as status (status.id)}
				<StatusCard {status} density="comfortable" />
			{/each}
		</div>
	</section>

	<section class="profile-section">
		<header class="profile-section__header">
			<div>
				<p class="section-eyebrow">Activity</p>
				<h2>Posts, replies, media, likes</h2>
				<p class="muted">
					The tabs component switches between feed slices without remounting cards.
				</p>
			</div>
		</header>
		<Tabs {tabs} {activeTab} onTabChange={handleTabChange} />
	</section>

	<section class="profile-section profile-section--grid">
		<div>
			<p class="section-eyebrow">Followers</p>
			<h2>People subscribed to this profile</h2>
			<ul class="connections-list">
				{#each followers as person (person.id)}
					<li>
						<div class="connection-meta">
							<Avatar src={person.avatar} alt={person.displayName} size="md" />
							<div>
								<strong>{person.displayName}</strong>
								<p class="muted">@{person.acct}</p>
								<p>{person.note}</p>
							</div>
						</div>
						<Button
							size="sm"
							variant={person.following ? 'outline' : 'solid'}
							onclick={() => toggleConnection('followers', person.id)}
						>
							{person.following ? 'Following' : 'Follow back'}
						</Button>
					</li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="section-eyebrow">Following</p>
			<h2>Accounts managed by this team</h2>
			<ul class="connections-list">
				{#each following as person (person.id)}
					<li>
						<div class="connection-meta">
							<Avatar src={person.avatar} alt={person.displayName} size="md" />
							<div>
								<strong>{person.displayName}</strong>
								<p class="muted">@{person.acct}</p>
								<p>{person.note}</p>
							</div>
						</div>
						<Button
							size="sm"
							variant={person.following ? 'outline' : 'solid'}
							onclick={() => toggleConnection('following', person.id)}
						>
							{person.following ? 'Following' : 'Follow'}
						</Button>
					</li>
				{/each}
			</ul>
		</div>
		<p class="muted connections-note" aria-live="polite">
			{followToast || 'Follow toggles update counts optimistically.'}
		</p>
	</section>
</DemoPage>

<Modal bind:open={showEditModal} title="Edit profile">
	<form class="edit-form" onsubmit={saveProfile}>
		<TextField label="Display name" bind:value={editName} required />
		<TextArea label="Bio" rows={4} bind:value={editBio} />
		<div class="modal-footer">
			<Button variant="ghost" type="button" onclick={closeEditModal}>Cancel</Button>
			<Button type="submit">Save changes</Button>
		</div>
	</form>
</Modal>

{#snippet ProfileActionSnippet()}
	<Button size="sm" variant="solid" onclick={openEditModal}>Edit profile</Button>
{/snippet}

{#snippet PostsTab()}
	<div class="status-stack">
		{#each posts as status (status.id)}
			<StatusCard {status} density="comfortable" />
		{/each}
	</div>
{/snippet}

{#snippet RepliesTab()}
	<div class="status-stack">
		{#each replies as status (status.id)}
			<StatusCard {status} density="compact" />
		{/each}
	</div>
{/snippet}

{#snippet MediaTab()}
	{#if mediaLoading}
		<div class="media-grid">
			{#each mediaSkeletons as placeholder (placeholder)}
				<Skeleton width="100%" height="160px" data-index={placeholder} />
			{/each}
		</div>
	{:else}
		<div class="media-grid">
			{#each mediaGallery as media (media.id)}
				<figure>
					<img src={media.previewUrl ?? media.url} alt={media.description} loading="lazy" />
					<figcaption>{media.description}</figcaption>
				</figure>
			{/each}
		</div>
	{/if}
{/snippet}

{#snippet LikesTab()}
	<div class="status-stack">
		{#each likes as status (status.id)}
			<StatusCard {status} density="comfortable" />
		{/each}
	</div>
{/snippet}

<style>
	.profile-section {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-2xl);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		background: var(--gr-semantic-background-primary);
	}

	.profile-section__header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.pinned-rail {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.profile-section--grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.connections-note {
		grid-column: 1 / -1;
	}

	.status-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.media-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.media-grid figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.media-grid img {
		width: 100%;
		border-radius: var(--gr-radii-xl);
		object-fit: cover;
		block-size: 180px;
	}

	.connections-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.connections-list li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		padding: 1rem;
	}

	.connection-meta {
		display: flex;
		gap: 0.85rem;
		align-items: center;
	}

	.muted {
		color: var(--gr-semantic-foreground-tertiary);
		font-size: var(--gr-typography-fontSize-sm);
		margin: 0;
	}

	.section-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin: 0;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	@media (max-width: 720px) {
		.profile-section {
			padding: 1.25rem;
		}
	}
</style>
