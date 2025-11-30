<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import AccessibilityScorecard from '$lib/components/AccessibilityScorecard.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';

	const headerProps = [
		{
			name: 'account',
			type: 'UnifiedAccount',
			required: true,
			description: 'Profile payload (display name, avatar, header, counts) rendered in the header.',
		},
		{
			name: 'showBanner',
			type: 'boolean',
			default: 'true',
			description: 'Controls the masthead gradient / cover image.',
		},
		{
			name: 'showBio',
			type: 'boolean',
			default: 'true',
			description: 'Toggles the sanitized note/bio region.',
		},
		{
			name: 'showFields',
			type: 'boolean',
			default: 'true',
			description: 'Displays metadata fields + verified badges pulled from account.emojis.',
		},
		{
			name: 'showCounts',
			type: 'boolean',
			default: 'true',
			description:
				'Followers/following/posts summary (wire to `clickableCounts` for interactive stats).',
		},
		{
			name: 'clickableCounts',
			type: 'boolean',
			default: 'false',
			description: 'Wraps counts in buttons and wires onFollowersClick/onFollowingClick callbacks.',
		},
		{
			name: 'followButton',
			type: 'Snippet',
			description: 'Optional slot used for the “Edit profile” button inside the demo.',
		},
		{
			name: 'emojiRenderer',
			type: '(text: string) => string',
			description: 'Custom renderer for server-provided emoji; accepts sanitized HTML.',
		},
	];

	const packages = [
		{
			name: '@equaltoai/greater-components-social',
			detail: 'ProfileHeader, StatusCard, Tabs snippets, and Followers/Following utilities.',
		},
		{
			name: '@equaltoai/greater-components-primitives',
			detail: 'Button, Avatar, Skeleton, Modal, TextField, and TextArea for edit flows.',
		},
		{
			name: '@equaltoai/greater-components-icons',
			detail: 'Used inside ProfileHeader actions and pinned cards.',
		},
	];

	const snippet = `<script lang="ts">
  import { ProfileHeader, StatusCard } from '@equaltoai/greater-components-social';
  import { Tabs, Button, Modal, TextField, TextArea } from '@equaltoai/greater-components-primitives';
  import { getDemoProfile, getPinnedStatuses } from '$lib/data/fediverse';

  let profile = $state(getDemoProfile());
  let showEditModal = $state(false);

  const tabList = [
    { id: 'posts', label: 'Posts', content: PostsTab },
    { id: 'media', label: 'Media', content: MediaTab },
    { id: 'likes', label: 'Likes', content: LikesTab }
  ] as const;
  let activeTab = $state(tabList[0].id);
</${'script'}>

<ProfileHeader account={profile} showFields showActions followButton={ProfileActionSnippet} />

<Tabs tabs={tabList} activeTab={activeTab} onTabChange={(id) => activeTab = id} />

<Modal bind:open={showEditModal} title="Edit profile">
  <form class="edit-form">
    <TextField label="Display name" bind:value={profile.displayName} required />
    <TextArea label="Bio" rows={4} bind:value={bioDraft} />
    <div class="modal-footer">
      <Button variant="ghost" onclick={() => showEditModal = false}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Modal>

{#snippet ProfileActionSnippet()}
  <Button size="sm" variant="solid" onclick={() => showEditModal = true}>
    Edit profile
  </Button>
{/snippet}`;

	const accessibility = {
		wcagLevel: 'AA' as const,
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		reducedMotion: true,
		notes: [
			'Connections lists announce follow state changes via aria-live.',
			'Tabs use roving tabindex + arrow key handlers (tested via keyboard automation).',
			'Edit profile modal traps focus and labels inputs with visible text.',
			'Skeleton state for media gallery uses `role="img"` with `data-index` for deterministic announcements.',
		],
		axeScore: 100,
	};

	const performance = [
		'Pinned StatusCard instances reuse comfortable density tokens to stay under 30KB hydrated.',
		'Media gallery defers image loads with `loading="lazy"` and exposes skeleton placeholders.',
		'Connections list items are capped to 6 per column to avoid layout thrash on mobile.',
		'Profile edit modal relies on local state only; no network calls occur in the demo.',
	];

	const testing = [
		{
			label: 'packages/testing/tests/demo/profile.spec.ts',
			detail: 'Keyboard navigation coverage for Tabs plus aria-live assertions on follow toggles.',
		},
		{
			label: 'apps/playground/src/routes/profile/+page.svelte',
			detail: 'Source of snippets listed above and home for pinned status fixtures.',
		},
	];
</script>

<svelte:head>
	<title>Profile Demo Documentation - Greater Components</title>
	<meta
		name="description"
		content="Guidance for wiring Greater Components profile surfaces including ProfileHeader, tabbed feeds, and edit modals."
	/>
</svelte:head>

<DemoPage
	eyebrow="Demo Suite"
	title="Profile application"
	description="End-to-end profile surface with editable bio, pinned statuses, and tabbed feeds. Mirrors the Phase 4 /profile route."
>
	<section>
		<h2>Packages in play</h2>
		<ul>
			{#each packages as pkg (pkg.name)}
				<li>
					<strong><code>{pkg.name}</code></strong> — {pkg.detail}
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>ProfileHeader props</h2>
		<PropsTable props={headerProps} />
		<p>
			Follow/edit interactions flow through <code>Profile.Root</code> context handlers. In the demo
			we trigger a local modal (<code>#snippet ProfileActionSnippet</code>) rather than remote
			requests.
		</p>
	</section>

	<section>
		<h2>Usage snippet</h2>
		<CodeExample language="svelte" code={snippet} />
	</section>

	<section>
		<h2>Accessibility</h2>
		<AccessibilityScorecard {...accessibility} />
	</section>

	<section>
		<h2>Performance considerations</h2>
		<ul>
			{#each performance as tip, index (`${index}-${tip}`)}
				<li>{tip}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Testing references</h2>
		<ul>
			{#each testing as link (link.label)}
				<li>
					<code>{link.label}</code> — {link.detail}
				</li>
			{/each}
		</ul>
	</section>
</DemoPage>
