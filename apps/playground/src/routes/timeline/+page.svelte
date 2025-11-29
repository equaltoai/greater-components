<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import ContentWarningField from '$lib/components/ContentWarningField.svelte';
	import { Button, Switch, Modal, Avatar } from '@equaltoai/greater-components-primitives';
	import {
		ComposeCompound as Compose,
		TimelineVirtualized,
		StatusCard,
		type ComposeAttachment,
		type ComposeHandlers,
		type StatusActionHandlers,
	} from '@equaltoai/greater-components-social';
	import type { DemoPageData } from '$lib/types/demo';
	import type { Notification, Status, TimelineFilter } from '$lib/types/fediverse';
	import {
		createTimelineSeeds,
		generateTimelineBatch,
		getDemoProfile,
		createNotificationSeed,
		getPinnedStatuses,
		getPrimaryTimelineAccount,
	} from '$lib/data/fediverse';
	import { createTimelineController, type TimelineState } from '$lib/stores/timelineStore';
	import { loadPersistedState, persistState } from '$lib/stores/storage';
	import { GlobeIcon, HashIcon, HomeIcon, SettingsIcon } from '@equaltoai/greater-components-icons';
	import { get } from 'svelte/store';
	import { onDestroy } from 'svelte';

	let { data }: { data: DemoPageData } = $props();

	type TimelinePreferenceState = {
		density: 'comfortable' | 'compact';
		autoplayMedia: boolean;
		showBoosts: boolean;
		streaming: boolean;
	};

	type PreferenceToggleKey = Exclude<keyof TimelinePreferenceState, 'density'>;

	const defaultPreferences: TimelinePreferenceState = {
		density: 'comfortable',
		autoplayMedia: true,
		showBoosts: true,
		streaming: true,
	};

	const preferencesKey = 'timeline-app-preferences';

	const timeline = createTimelineController({
		seeds: createTimelineSeeds(),
		generator: generateTimelineBatch,
		pageSize: 4,
		prefetchTarget: 8,
		delayMs: 360,
	});
	let timelineState = $state<TimelineState>(get(timeline));

	const unsubscribeTimeline = timeline.subscribe((value) => {
		timelineState = value;
	});

	onDestroy(() => {
		unsubscribeTimeline();
	});

	const profile = getDemoProfile();
	const pinnedStatuses = getPinnedStatuses();
	const authorAccount = getPrimaryTimelineAccount();

	let timelinePreferences = $state<TimelinePreferenceState>(defaultPreferences);
	let preferencesHydrated = false;
	let showPreferences = $state(false);
	let cwEnabled = $state(false);
	let cwText = $state("Spoilers about today's release");
	let composedStatuses = $state<Status[]>([]);
	let composerStatus = $state<'idle' | 'sending' | 'saved'>('idle');
	let notifications = $state<Notification[]>(createNotificationSeed().slice(0, 4));
	let actionLog = $state<string[]>([]);

	const navLinks: Array<{
		id: string;
		label: string;
		icon: typeof HomeIcon;
		filter?: TimelineFilter;
	}> = [
		{ id: 'home', label: 'Home', icon: HomeIcon, filter: 'home' },
		{ id: 'local', label: 'Local', icon: GlobeIcon, filter: 'local' },
		{ id: 'federated', label: 'Federated', icon: HashIcon, filter: 'federated' },
	];

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	$effect(() => {
		if (!preferencesHydrated) {
			timelinePreferences = loadPersistedState(preferencesKey, defaultPreferences);
			preferencesHydrated = true;
			return;
		}

		persistState(preferencesKey, timelinePreferences);
	});

	const timelineItems = $derived(() => [...composedStatuses, ...timelineState.items]);

	const composerStatusText = $derived(() => {
		if (composerStatus === 'sending') {
			return 'Posting to ' + timelineState.filter + '…';
		}

		if (composerStatus === 'saved') {
			return 'Posted to ' + timelineState.filter + ' timeline';
		}

		return 'Drafts stay local to each filter';
	});

	const streamingAnnouncement = $derived(() =>
		timelinePreferences.streaming
			? timelineState.loading
				? 'Streaming new posts…'
				: `Updated ${new Date(timelineState.lastUpdated).toLocaleTimeString()}`
			: 'Streaming paused'
	);

	const actionHandlers: StatusActionHandlers = {
		onReply: (status) => logAction('Reply', status.account.acct),
		onBoost: (status) => logAction('Boost', status.account.acct),
		onFavorite: (status) => logAction('Favorite', status.account.acct),
	};

	function logAction(action: string, acct: string) {
		actionLog = [`${action} • ${acct}`, ...actionLog].slice(0, 4);
	}

	function togglePreference(key: PreferenceToggleKey, next?: boolean) {
		timelinePreferences = {
			...timelinePreferences,
			[key]: next ?? !timelinePreferences[key],
		};
	}

	function setDensity(density: TimelinePreferenceState['density']) {
		timelinePreferences = { ...timelinePreferences, density };
	}

	function handleNav(link: { id: string; filter?: TimelineFilter }) {
		if (link.filter) {
			timeline.setFilter(link.filter);
			return;
		}

		showPreferences = true;
	}

	function formatCount(count: number) {
		if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
		if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
		return count.toString();
	}

	function makeStatusId() {
		if (typeof crypto !== 'undefined' && crypto.randomUUID) {
			return crypto.randomUUID();
		}

		return `status-${Date.now()}`;
	}

	function normalizeContent(content: string) {
		const trimmed = content.trim();
		if (!trimmed) {
			return '<p>(Shared from Compose dock)</p>';
		}

		return trimmed
			.split('\n')
			.filter(Boolean)
			.map((line) => `<p>${line}</p>`)
			.join('');
	}

	const composeHandlers: ComposeHandlers = {
		onSubmit: async (payload) => {
			composerStatus = 'sending';
			await wait(480);

			const status: Status = {
				id: makeStatusId(),
				uri: `https://equalto.social/@${authorAccount.username}/${Date.now()}`,
				url: `https://equalto.social/@${authorAccount.username}/${Date.now()}`,
				account: { ...authorAccount },
				content: normalizeContent(payload.content),
				createdAt: new Date().toISOString(),
				visibility: payload.visibility,
				repliesCount: 0,
				reblogsCount: 0,
				favouritesCount: 0,
				spoilerText: payload.contentWarning,
				sensitive: Boolean(payload.contentWarning),
				mediaAttachments: (payload.mediaAttachments ?? []).map((media) => ({
					id: media.id ?? makeStatusId(),
					type: media.type ?? 'image',
					url:
						media.url ??
						media.previewUrl ??
						'https://placehold.co/600x400/0f172a/ffffff?text=Media',
					previewUrl: media.previewUrl ?? media.url,
					description: media.description ?? media.file?.name ?? 'Attachment',
				})),
				mentions: [],
				tags: [
					{
						name: timelineState.filter,
						url: `https://equalto.social/tags/${timelineState.filter}`,
					},
				],
			};

			composedStatuses = [status, ...composedStatuses].slice(0, 4);
			notifications = [
				{
					id: `notif-compose-${status.id}`,
					type: 'mention',
					createdAt: status.createdAt,
					account: status.account,
					status,
					read: false,
				},
				...notifications.slice(0, 3),
			];

			composerStatus = 'saved';
			setTimeout(() => (composerStatus = 'idle'), 1800);
		},
		onMediaUpload: async (file: File) => {
			await wait(650);
			const url = URL.createObjectURL(file);
			return {
				id: `timeline-upload-${file.name}-${Date.now()}`,
				type: file.type.startsWith('video') ? 'video' : 'image',
				url,
				previewUrl: url,
				description: file.name,
			} satisfies ComposeAttachment;
		},
	};

	function markNotification(id: string) {
		notifications = notifications.map((notification) =>
			notification.id === id ? { ...notification, read: true } : notification
		);
	}

	function clearNotifications() {
		notifications = notifications.map((notification) => ({ ...notification, read: true }));
	}

	function handlePreferencesSubmit(event: SubmitEvent) {
		event.preventDefault();
		showPreferences = false;
	}
</script>

<DemoPage
	eyebrow="Fediverse Surface"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="timeline-app" aria-label="Timeline application demo">
		<section class="timeline-app__sidebar" aria-label="Timeline navigation">
			<div class="sidebar-header">
				<p class="section-eyebrow">Compose dock</p>
				<h2>Filters + quick settings</h2>
				<p>Switch feeds, tweak density, and open preferences without leaving the dock.</p>
			</div>

			<nav class="sidebar-nav" aria-label="Timeline filters">
				{#each navLinks as link (link.id)}
					{@const Icon = link.icon}
					<button
						class:selected={link.filter ? timelineState.filter === link.filter : false}
						onclick={() => handleNav(link)}
						aria-pressed={link.filter ? timelineState.filter === link.filter : undefined}
					>
						<Icon size={18} aria-hidden="true" />
						<span>{link.label}</span>
					</button>
				{/each}
				<button class="preferences-trigger" onclick={() => (showPreferences = true)}>
					<SettingsIcon size={18} aria-hidden="true" />
					<span>Preferences</span>
				</button>
			</nav>

			<div class="quick-settings">
				<h3>Quick settings</h3>
				<div class="quick-settings__list">
					<div class="quick-toggle">
						<Switch
							label="Live streaming"
							checked={timelinePreferences.streaming}
							onclick={() => togglePreference('streaming')}
						/>
						<p class="muted">Auto fetches batches in the background</p>
					</div>
					<div class="quick-toggle">
						<Switch
							label="Inline media"
							checked={timelinePreferences.autoplayMedia}
							onclick={() => togglePreference('autoplayMedia')}
						/>
						<p class="muted">Expand attachments inside the feed</p>
					</div>
					<div class="quick-toggle">
						<Switch
							label="Show boosts"
							checked={timelinePreferences.showBoosts}
							onclick={() => togglePreference('showBoosts')}
						/>
						<p class="muted">Dim or hide reposts</p>
					</div>
				</div>
				<p class="muted" aria-live="polite">{streamingAnnouncement()}</p>
			</div>
		</section>

		<div class="timeline-app__main">
			<section class="compose-dock" aria-labelledby="compose-heading">
				<div class="compose-dock__header">
					<div>
						<p class="section-eyebrow">Compose dock</p>
						<h2 id="compose-heading">Post directly into {timelineState.filter} timeline</h2>
					</div>
					<p class="muted" aria-live="polite">{composerStatusText()}</p>
				</div>
				<Compose.Root
					config={{ allowMedia: true, placeholder: 'Share a release update…' }}
					handlers={composeHandlers}
				>
					<Compose.Editor rows={4} />
					<Compose.MediaUpload />
					<ContentWarningField bind:enabled={cwEnabled} bind:text={cwText} />
					<div class="compose-dock__controls">
						<Compose.VisibilitySelect />
						<Compose.CharacterCount />
						<Compose.Submit text="Publish" />
					</div>
				</Compose.Root>
			</section>

			<section class="timeline-feed" aria-live="polite">
				<header>
					<div>
						<p class="section-eyebrow">Timeline</p>
						<h2>{timelineState.viewDescription}</h2>
						<p class="muted">
							Prefetched {timelineState.prefetched} posts · Density {timelinePreferences.density}
						</p>
					</div>
					<div class="timeline-feed__actions">
						<Button size="sm" variant="outline" onclick={() => timeline.refresh()}>Refresh</Button>
						<Button size="sm" onclick={() => timeline.loadMore()} disabled={timelineState.loading}>
							{timelineState.loading ? 'Loading…' : 'Load more'}
						</Button>
					</div>
				</header>

				{#if timelineState.error}
					<div class="state-card state-card--error" role="alert">
						<p>{timelineState.error}</p>
						<Button size="sm" variant="ghost" onclick={() => timeline.clearError()}>Dismiss</Button>
					</div>
				{/if}

				<div
					class={`timeline-virtualized timeline-virtualized--${timelinePreferences.density} ${
						timelinePreferences.autoplayMedia ? '' : 'timeline-virtualized--media-muted'
					}`}
				>
					<TimelineVirtualized
						items={timelineItems()}
						density={timelinePreferences.density}
						{actionHandlers}
						loadingBottom={timelineState.loading}
					/>
				</div>

				<div class="action-log" aria-live="polite">
					<strong>Recent interactions</strong>
					{#if actionLog.length === 0}
						<p class="muted">Boost, reply, or favorite a post to populate this log.</p>
					{:else}
						<ol>
							{#each actionLog as entry, index (entry + index)}
								<li>{entry}</li>
							{/each}
						</ol>
					{/if}
				</div>
			</section>
		</div>

		<section class="timeline-app__meta" aria-label="Timeline meta">
			<section class="profile-card" aria-label="Profile summary">
				<div class="profile-card__header">
					<Avatar src={profile.avatar} alt={profile.displayName} size="lg" />
					<div>
						<h3>{profile.displayName}</h3>
						<p class="muted">@{profile.acct}</p>
					</div>
				</div>
				<dl>
					<div>
						<dt>Followers</dt>
						<dd>{formatCount(profile.followersCount)}</dd>
					</div>
					<div>
						<dt>Following</dt>
						<dd>{formatCount(profile.followingCount)}</dd>
					</div>
					<div>
						<dt>Posts</dt>
						<dd>{formatCount(profile.statusesCount)}</dd>
					</div>
				</dl>
				<Button size="sm" variant={profile.relationship?.following ? 'ghost' : 'solid'}>
					{profile.relationship?.following ? 'Following' : 'Follow'}
				</Button>
			</section>

			<section class="pinned-card" aria-label="Pinned posts">
				<header>
					<h3>Pinned posts</h3>
					<p class="muted">Highlights from product + research teams.</p>
				</header>
				<div class="pinned-card__list">
					{#each pinnedStatuses as status (status.id)}
						<StatusCard {status} density="compact" />
					{/each}
				</div>
			</section>

			<section class="notifications-card" aria-label="Notifications">
				<header>
					<div>
						<h3>Notifications</h3>
						<p class="muted">Mentions, boosts, follows</p>
					</div>
					<Button size="sm" variant="ghost" onclick={clearNotifications}>Clear</Button>
				</header>
				<ul>
					{#each notifications as notification (notification.id)}
						<li>
							<div class="notification-row">
								<img src={notification.account.avatar} alt={notification.account.displayName} />
								<div>
									<p>
										<strong>{notification.account.displayName}</strong>
										{#if notification.type === 'mention'}
											left a mention{/if}
										{#if notification.type === 'follow'}
											followed you{/if}
										{#if notification.type === 'favourite'}
											favorited your post{/if}
										{#if notification.type === 'reblog'}
											boosted your post{/if}
										{#if notification.type === 'follow_request'}
											requested to follow you{/if}
									</p>
									<span class="muted">{new Date(notification.createdAt).toLocaleTimeString()}</span>
								</div>
								{#if !notification.read}
									<Button
										size="sm"
										variant="outline"
										onclick={() => markNotification(notification.id)}
									>
										Mark read
									</Button>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		</section>
	</section>
</DemoPage>

<Modal bind:open={showPreferences} title="Timeline preferences" size="lg">
	<form class="preferences-form" onsubmit={handlePreferencesSubmit}>
		<div class="preferences-grid">
			<div>
				<p class="section-eyebrow">Appearance</p>
				<h3>Density + media</h3>
				<div class="density-toggle" role="group" aria-label="Timeline density">
					<Button
						size="sm"
						variant={timelinePreferences.density === 'comfortable' ? 'solid' : 'ghost'}
						onclick={() => setDensity('comfortable')}
						type="button"
					>
						Comfortable
					</Button>
					<Button
						size="sm"
						variant={timelinePreferences.density === 'compact' ? 'solid' : 'ghost'}
						onclick={() => setDensity('compact')}
						type="button"
					>
						Compact
					</Button>
				</div>
				<div class="quick-toggle">
					<Switch
						label="Inline media"
						checked={timelinePreferences.autoplayMedia}
						onclick={() => togglePreference('autoplayMedia')}
					/>
					<p class="muted">Autoplay attachments</p>
				</div>
			</div>
			<div>
				<p class="section-eyebrow">Streaming</p>
				<h3>Live updates</h3>
				<div class="quick-toggle">
					<Switch
						label="Enable live streaming"
						checked={timelinePreferences.streaming}
						onclick={() => togglePreference('streaming')}
					/>
					<p class="muted">Pulls the next batch when users near the end</p>
				</div>
				<div class="quick-toggle">
					<Switch
						label="Show boosts"
						checked={timelinePreferences.showBoosts}
						onclick={() => togglePreference('showBoosts')}
					/>
					<p class="muted">Dim reposts in high-noise timelines</p>
				</div>
			</div>
		</div>
		<div class="preferences-footer">
			<Button variant="ghost" type="button" onclick={() => (showPreferences = false)}>
				Cancel
			</Button>
			<Button type="submit">Close</Button>
		</div>
	</form>
</Modal>

<style>
	.timeline-app {
		display: grid;
		grid-template-columns: 280px minmax(0, 1fr) 320px;
		gap: 1.5rem;
		width: 100%;
	}

	.timeline-app__sidebar,
	.timeline-app__main,
	.timeline-app__meta {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.timeline-app__sidebar {
		padding: 1.75rem;
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-2xl);
		background: var(--gr-semantic-background-secondary);
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.sidebar-nav button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 0.85rem;
		border-radius: var(--gr-radii-lg);
		border: none;
		background: transparent;
		font-weight: var(--gr-typography-fontWeight-medium);
		cursor: pointer;
		color: inherit;
	}

	.sidebar-nav button.selected {
		background: var(--gr-semantic-action-primary-muted);
		color: var(--gr-semantic-action-primary-foreground);
	}

	.preferences-trigger {
		margin-top: 0.5rem;
		border: 1px dashed var(--gr-semantic-border-default);
	}

	.quick-settings h3 {
		margin-bottom: 0.5rem;
	}

	.quick-settings__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.quick-toggle {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.muted {
		color: var(--gr-semantic-foreground-tertiary);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.compose-dock,
	.timeline-feed,
	.profile-card,
	.pinned-card,
	.notifications-card {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-2xl);
		background: var(--gr-semantic-background-primary);
		padding: 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.compose-dock__controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.timeline-feed header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.timeline-feed__actions {
		display: flex;
		gap: 0.5rem;
	}

	.timeline-virtualized {
		height: 520px;
		border-radius: var(--gr-radii-2xl);
	}

	.timeline-virtualized--media-muted :global(img) {
		filter: grayscale(0.75);
		opacity: 0.75;
	}

	.action-log {
		border: 1px dashed var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		padding: 1rem;
	}

	.action-log ol {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.profile-card__header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.profile-card dl {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		margin: 0;
	}

	.profile-card dt {
		font-size: var(--gr-typography-fontSize-xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.profile-card dd {
		margin: 0;
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
	}

	.pinned-card__list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 540px;
		overflow: auto;
	}

	.notifications-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.notification-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.notification-row img {
		width: 40px;
		height: 40px;
		border-radius: 999px;
	}

	.preferences-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.preferences-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
	}

	.density-toggle {
		display: inline-flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.preferences-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.state-card {
		border: 1px solid var(--gr-semantic-action-danger-border);
		border-radius: var(--gr-radii-xl);
		padding: 1rem;
		background: var(--gr-semantic-action-danger-muted);
	}

	@media (max-width: 1280px) {
		.timeline-app {
			grid-template-columns: minmax(0, 1fr);
		}

		.timeline-app__sidebar,
		.timeline-app__meta {
			order: -1;
		}
	}

	@media (max-width: 720px) {
		.timeline-app__sidebar,
		.timeline-app__main,
		.timeline-app__meta,
		.compose-dock,
		.timeline-feed,
		.profile-card,
		.pinned-card,
		.notifications-card {
			padding: 1.25rem;
		}

		.timeline-virtualized {
			height: 420px;
		}

		.sidebar-nav {
			flex-direction: row;
			flex-wrap: wrap;
		}

		.sidebar-nav button {
			flex: 1 1 calc(50% - 0.5rem);
			justify-content: center;
		}
	}
</style>
