<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import ContentWarningField from '$lib/components/ContentWarningField.svelte';
	import { Button } from '@equaltoai/greater-components-primitives';
	import {
		ComposeCompound as Compose,
		PollComposer,
		type ComposeHandlers,
		type ComposeAttachment,
		type PostVisibility,
	} from '@equaltoai/greater-components-fediverse';
	import type { DemoPageData } from '$lib/types/demo';
	import { composeShortcuts } from '$lib/data/fediverse';

	let { data }: { data: DemoPageData } = $props();

	type Submission = {
		id: string;
		visibility: PostVisibility;
		content: string;
		mediaCount: number;
		contentWarning?: string;
		createdAt: string;
		label: string;
	};

	let submissions = $state<Submission[]>([]);
	let recentUploads = $state<Array<{ id: string; name: string; bytes: number }>>([]);
	let cwEnabled = $state(false);
	let cwText = $state('Spoilers about a future release');
	let pollDraft = $state<null | { options: string[]; expiresIn: number; multiple: boolean }>(null);

	const mentionDirectory = [
		{ username: 'alicia', displayName: 'Alicia Shen', acct: '@alicia@equalto.social' },
		{ username: 'lynn', displayName: 'Lynn Park', acct: '@lynn@green.earth' },
		{ username: 'theo', displayName: 'Theo Martinez', acct: '@theo@mastodon.art' },
	];

	const makeId = () =>
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? crypto.randomUUID()
			: `compose-${Math.random().toString(36).slice(2)}`;

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	async function simulateSubmit(
		data: {
			content: string;
			visibility: PostVisibility;
			contentWarning?: string;
			mediaAttachments?: ComposeAttachment[];
		},
		label: string
	) {
		await wait(420);
		submissions = [
			{
				id: makeId(),
				visibility: data.visibility,
				content: data.content.trim() || '(No content)',
				mediaCount: data.mediaAttachments?.length || 0,
				contentWarning: data.contentWarning,
				createdAt: new Date().toLocaleTimeString(),
				label,
			},
			...submissions,
		].slice(0, 6);
	}

	const basicHandlers: ComposeHandlers = {
		onSubmit: async (payload) => simulateSubmit(payload, 'Baseline compose'),
	};

	const mediaHandlers: ComposeHandlers = {
		onSubmit: async (payload) =>
			simulateSubmit(
				{
					...payload,
					contentWarning: cwEnabled ? cwText : undefined,
				},
				'Media + CW'
			),
		onMediaUpload: async (file) => {
			await wait(650);
			recentUploads = [{ id: makeId(), name: file.name, bytes: file.size }, ...recentUploads].slice(
				0,
				4
			);

			return {
				id: makeId(),
				type: file.type.startsWith('video') ? 'video' : 'image',
				url: URL.createObjectURL(file),
				previewUrl: URL.createObjectURL(file),
				description: file.name,
			} satisfies ComposeAttachment;
		},
	};

	const advancedHandlers: ComposeHandlers = {
		onSubmit: async (payload) =>
			simulateSubmit(
				{
					...payload,
					content: pollDraft
						? `${payload.content}\n\nPoll: ${pollDraft.options.join(', ')} (closes in ${Math.round(
								pollDraft.expiresIn / 3600
							)}h)`
						: payload.content,
				},
				'Autocomplete + poll'
			),
	};

	const draftHandlers: ComposeHandlers = {
		onSubmit: async (payload) => simulateSubmit(payload, 'Drafted message'),
	};

	async function searchDirectory(query: string, type: 'hashtag' | 'mention' | 'emoji') {
		const normalized = query.toLowerCase();

		if (type === 'mention') {
			return mentionDirectory
				.filter(
					(entry) =>
						entry.username.includes(normalized) ||
						entry.displayName.toLowerCase().includes(normalized)
				)
				.map((entry) => ({
					type: 'mention',
					text: `${entry.displayName} (${entry.acct})`,
					value: `${entry.acct} `,
					metadata: { username: entry.username, displayName: entry.displayName },
				}));
		}

		if (type === 'hashtag') {
			return [
				{ type: 'hashtag', text: `${query}·design`, value: `#${query} ` },
				{ type: 'hashtag', text: `${query}·a11y`, value: `#${query}Accessibility ` },
			];
		}

		return [
			{ type: 'emoji', text: `:${query}:`, value: `:${query}: ` },
			{ type: 'emoji', text: `:${query}sparkle:`, value: `:${query}sparkle: ` },
		];
	}

	const essentialsSnippet = `
<Compose.Root
  config={{ characterLimit: 500, placeholder: "What's on your mind?" }}
  handlers={basicHandlers}
>
  <Compose.Editor rows={4} />
  <div class="compose-row">
    <Compose.VisibilitySelect />
    <Compose.CharacterCount />
    <Compose.Submit />
  </div>
</Compose.Root>`;

	const mediaSnippet = `
<Compose.Root
  config={{ allowMedia: true, allowContentWarnings: true }}
  handlers={mediaHandlers}
>
  <Compose.Editor rows={3} />
  <Compose.MediaUpload />
  <ContentWarningField bind:enabled={cwEnabled} bind:text={cwText} />
  <Compose.Submit />
</Compose.Root>`;

	const advancedSnippet = `
<Compose.Root handlers={advancedHandlers}>
  <Compose.EditorWithAutocomplete searchHandler={searchDirectory} rows={4} />
  <Compose.VisibilitySelect />
  <Compose.Submit text="Publish" />
</Compose.Root>`;

	const draftSnippet = `
<Compose.Root handlers={draftHandlers}>
  <Compose.Editor rows={3} />
  <Compose.DraftSaver draftKey="demo-phase3" />
  <Compose.Submit text="Send" />
</Compose.Root>`;
</script>

<DemoPage
	eyebrow="Fediverse Surface"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="compose-demo__section">
		<header>
			<p class="section-eyebrow">01 · Essentials</p>
			<h2>Baseline composer + keyboard shortcuts</h2>
			<p>
				The compound composer exposes runes-friendly primitives so teams can mix and match editors,
				character counters, visibility menus, and submit actions. Everything here pulls from the
				published package—no source imports.
			</p>
		</header>

		<div class="compose-demo__grid">
			<Compose.Root
				config={{ characterLimit: 500, placeholder: "What's on your mind?" }}
				handlers={basicHandlers}
			>
				<Compose.Editor rows={4} />
				<div class="compose-row">
					<Compose.VisibilitySelect />
					<Compose.CharacterCount />
					<Compose.Submit />
				</div>
			</Compose.Root>

			<div class="compose-demo__panel">
				<h3>Keyboard primer</h3>
				<table aria-label="Compose shortcuts">
					<tbody>
						{#each composeShortcuts as shortcut (shortcut.combo)}
							<tr>
								<td><kbd>{shortcut.combo}</kbd></td>
								<td>{shortcut.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<CodeExample
					title="Essentials snippet"
					description="Visibility selector + counter + submit"
					code={essentialsSnippet}
				/>
			</div>
		</div>
	</section>

	<section class="compose-demo__section">
		<header>
			<p class="section-eyebrow">02 · Media & content warnings</p>
			<h2>Drop files, describe alt text, and gate spoilers</h2>
			<p>
				Use <code>Compose.MediaUpload</code> to manage previews, alt text, spoiler labels, and drag &
				drop. Content warnings live outside the composer in this demo, mirroring how many Fediverse clients
				expose a toggle.
			</p>
		</header>

		<div class="compose-demo__grid">
			<Compose.Root
				config={{ characterLimit: 500, allowMedia: true, allowContentWarnings: true }}
				handlers={mediaHandlers}
			>
				<Compose.Editor rows={3} />
				<Compose.MediaUpload />
				<ContentWarningField bind:enabled={cwEnabled} bind:text={cwText} />
				<div class="compose-row">
					<Compose.CharacterCount />
					<Compose.Submit />
				</div>
			</Compose.Root>

			<div class="compose-demo__panel">
				<h3>Recent uploads (mock)</h3>
				{#if recentUploads.length === 0}
					<p class="muted">Attach an image or video to populate this list.</p>
				{:else}
					<ul class="upload-list">
						{#each recentUploads as upload (upload.id)}
							<li>
								<strong>{upload.name}</strong>
								<span>{(upload.bytes / 1024).toFixed(1)} KB</span>
							</li>
						{/each}
					</ul>
				{/if}
				<CodeExample
					title="Media + CW snippet"
					description="Upload handler returns metadata consumed by the composer"
					code={mediaSnippet}
				/>
			</div>
		</div>
	</section>

	<section class="compose-demo__section">
		<header>
			<p class="section-eyebrow">03 · Polls, mentions, visibility</p>
			<h2>Autocomplete + poll creation</h2>
			<p>
				Mention autocomplete rides on <code>Compose.EditorWithAutocomplete</code>, while polls reuse
				the `PollComposer` pattern export so you can generate ActivityPub-compatible payloads before
				hitting your API.
			</p>
		</header>

		<div class="compose-demo__grid">
			<Compose.Root handlers={advancedHandlers}>
				<Compose.EditorWithAutocomplete searchHandler={searchDirectory} rows={4} />
				<div class="compose-row">
					<Compose.VisibilitySelect />
					<Compose.Submit text="Publish" />
				</div>
			</Compose.Root>

			<div class="compose-demo__panel">
				<PollComposer
					mode="create"
					handlers={{
						onSubmit: async (poll) => {
							pollDraft = poll;
							return wait(200);
						},
					}}
				/>
				{#if pollDraft}
					<div class="poll-summary" role="status">
						<p><strong>Poll ready:</strong> {pollDraft.options.join(', ')}</p>
						<p>Visibility inherits from the composer selection.</p>
						<Button variant="ghost" size="sm" onclick={() => (pollDraft = null)}>Clear poll</Button>
					</div>
				{/if}
				<CodeExample
					title="Autocomplete snippet"
					description="EditorWithAutocomplete + PollComposer"
					code={advancedSnippet}
				/>
			</div>
		</div>
	</section>

	<section class="compose-demo__section">
		<header>
			<p class="section-eyebrow">04 · Draft saving</p>
			<h2>Persist local drafts with auto-save</h2>
			<p>
				`Compose.DraftSaver` writes to <code>localStorage</code> on an interval. We expose a dedicated
				draft key so multiple composers can coexist without clobbering each other.
			</p>
		</header>

		<Compose.Root handlers={draftHandlers}>
			<Compose.Editor rows={3} />
			<Compose.DraftSaver draftKey="demo-phase3" />
			<div class="compose-row">
				<Compose.CharacterCount />
				<Compose.Submit text="Send" />
			</div>
		</Compose.Root>

		<CodeExample
			title="Draft saver wiring"
			description="Auto-save content every 30s and restore on mount"
			code={draftSnippet}
		/>
	</section>

	{#if submissions.length > 0}
		<section class="compose-demo__section">
			<header>
				<p class="section-eyebrow">Submissions (mock)</p>
				<h2>Payloads captured locally</h2>
			</header>
			<div class="submission-grid">
				{#each submissions as submission (submission.id)}
					<article class="submission-card">
						<header>
							<span class="badge">{submission.visibility}</span>
							<time datetime={submission.createdAt}>{submission.createdAt}</time>
						</header>
						<p>{submission.content}</p>
						<p class="muted">
							{submission.mediaCount} media · {submission.label}
							{#if submission.contentWarning}
								· CW: {submission.contentWarning}
							{/if}
						</p>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</DemoPage>

<style>
	.compose-demo__section {
		padding: 2.25rem;
		border-radius: var(--gr-radii-2xl);
		border: 1px solid var(--gr-semantic-border-default);
		background: var(--gr-semantic-background-primary);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin-bottom: 0.35rem;
	}

	.compose-demo__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.compose-demo__panel {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		padding: 1.25rem;
		background: var(--gr-semantic-background-secondary);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.compose-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		justify-content: space-between;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	td {
		padding: 0.35rem 0;
		border-bottom: 1px solid var(--gr-semantic-border-subtle);
		vertical-align: top;
	}

	kbd {
		background: var(--gr-semantic-background-tertiary);
		border-radius: var(--gr-radii-md);
		padding: 0.15rem 0.45rem;
		font-family: var(--gr-typography-fontFamily-mono, 'Fira Code', monospace);
		font-size: 0.85em;
	}

	.muted {
		color: var(--gr-semantic-foreground-tertiary);
	}

	.upload-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.upload-list li {
		display: flex;
		justify-content: space-between;
	}

	.poll-summary {
		border: 1px dashed var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-lg);
		padding: 0.75rem;
	}

	.submission-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.submission-card {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		padding: 1rem;
		background: var(--gr-semantic-background-secondary);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.submission-card header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--gr-typography-fontSize-sm);
	}

	.badge {
		padding: 0.2rem 0.5rem;
		border-radius: var(--gr-radii-md);
		background: var(--gr-semantic-action-primary-muted);
		color: var(--gr-semantic-action-primary-foreground);
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
	}

	@media (max-width: 720px) {
		.compose-demo__section {
			padding: 1.5rem;
		}
	}
</style>
