<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Button } from '@equaltoai/greater-components-primitives';
	import { ProfileHeader, NotificationsFeed } from '@equaltoai/greater-components-fediverse';
	import type { DemoPageData } from '$lib/types/demo';
	import { createNotificationSeed, getDemoProfile } from '$lib/data/fediverse';

	let { data }: { data: DemoPageData } = $props();

	let notifications = $state(createNotificationSeed());
	const profile = getDemoProfile();

	function markAsRead(id: string) {
		notifications = notifications.map((notification) =>
			notification.id === id ? { ...notification, read: true } : notification
		);
	}

	function markAll() {
		notifications = notifications.map((notification) => ({ ...notification, read: true }));
	}

	function dismiss(id: string) {
		notifications = notifications.filter((notification) => notification.id !== id);
	}

	const profileSnippet = `
<ProfileHeader
  account={profile}
  followButton={FollowButtonSnippet}
/>

{#snippet FollowButtonSnippet()}
  <Button variant={profile.relationship?.following ? 'ghost' : 'solid'}>
    {profile.relationship?.following ? 'Following' : 'Follow'}
  </Button>
{/snippet}`;

	const notificationsSnippet = `
<NotificationsFeed
  notifications={notifications}
  onNotificationClick={(notification) => console.log(notification.id)}
  onMarkAsRead={markAsRead}
  onMarkAllAsRead={markAll}
  onDismiss={dismiss}
/>`;

	const guidance = [
		'Expose the list as a `region` with `aria-label="Notifications"` so screen readers can jump quickly.',
		'When focus enters a notification, announce its type (mention, boost, follow) using `aria-label`.',
		'Keyboard shortcuts (e.g., `Shift + C` to clear, `Enter` to open) should be documented near the list.',
		'Batch actions like “Mark all as read” should use real buttons to inherit semantics and focus.',
	];
</script>

<DemoPage
	eyebrow="Fediverse Surface"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="notifications-section">
		<header>
			<p class="section-eyebrow">01 · Profile header</p>
			<h2>Federated account overview + action slot</h2>
			<p>
				The published <code>ProfileHeader</code> component accepts a <code>UnifiedAccount</code> so you
				can feed it data from Mastodon, Lesser, or any adapter. Drop a follow button into the provided
				snippet to wire up your own action semantics.
			</p>
		</header>

		<ProfileHeader account={profile} showFields showCounts followButton={FollowButtonSnippet} />

		<CodeExample
			title="ProfileHeader snippet"
			description="Supply a UnifiedAccount from your adapter"
			code={profileSnippet}
		/>
	</section>

	<section class="notifications-section">
		<header>
			<p class="section-eyebrow">02 · Notification list</p>
			<h2>Mentions, boosts, likes, follows</h2>
			<p>
				`NotificationsFeed` virtualizes large collections and emits callbacks when users interact
				with a row. We mark items read in-place so the UI stays responsive even before API calls
				settle.
			</p>
		</header>

		<NotificationsFeed
			{notifications}
			grouped={false}
			density="comfortable"
			onNotificationClick={(notification) => markAsRead(notification.id)}
			onMarkAsRead={markAsRead}
			onMarkAllAsRead={markAll}
			onDismiss={dismiss}
		/>

		<div class="notifications-actions">
			<Button size="sm" variant="outline" onclick={markAll}>Mark all as read</Button>
			<Button size="sm" variant="ghost" onclick={() => (notifications = createNotificationSeed())}>
				Reset data
			</Button>
		</div>

		<CodeExample
			title="Notifications snippet"
			description="Hooking callbacks for mark-as-read + dismiss"
			code={notificationsSnippet}
		/>
	</section>

	<section class="notifications-section">
		<header>
			<p class="section-eyebrow">03 · Accessibility guidance</p>
			<h2>ARIA roles + keyboard cues</h2>
		</header>
		<ul class="guidance-list">
			{#each guidance as tip (tip)}
				<li>{tip}</li>
			{/each}
		</ul>
	</section>
</DemoPage>

{#snippet FollowButtonSnippet()}
	<Button variant={profile.relationship?.following ? 'ghost' : 'solid'} size="sm">
		{profile.relationship?.following ? 'Following' : 'Follow'}
	</Button>
{/snippet}

<style>
	.notifications-section {
		padding: 2.25rem;
		border-radius: var(--gr-radii-2xl);
		border: 1px solid var(--gr-semantic-border-default);
		background: var(--gr-semantic-background-primary);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.section-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin-bottom: 0.35rem;
	}

	.notifications-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.guidance-list {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	@media (max-width: 720px) {
		.notifications-section {
			padding: 1.5rem;
		}
	}
</style>
