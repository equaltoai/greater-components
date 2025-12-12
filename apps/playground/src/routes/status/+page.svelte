<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import {
		StatusCard,
		Status,
		type StatusActionHandlers,
	} from '@equaltoai/greater-components-social';
	import type { DemoPageData } from '$lib/types/demo';
	import { createStatusShowcase, createThreadReplies } from '$lib/data/fediverse';

	let { data }: { data: DemoPageData } = $props();

	const showcaseStatuses = createStatusShowcase();
	const spoilerStatus = showcaseStatuses[0]!;
	const pollStatus = showcaseStatuses[1] ?? showcaseStatuses[0]!;
	const threadRoot =
		showcaseStatuses.find((status) => status.id === 'status-thread-root') ??
		showcaseStatuses[showcaseStatuses.length - 1]!;
	const replies = createThreadReplies();

	let actionLog = $state<string[]>([]);

	const actionHandlers: StatusActionHandlers = {
		onReply: (status) => logAction('Reply', status.account.acct),
		onBoost: (status) => logAction('Boost', status.account.acct),
		onFavorite: (status) => logAction('Favorite', status.account.acct),
	};

	function logAction(action: string, actor: string) {
		actionLog = [`${action} · ${actor}`, ...actionLog].slice(0, 5);
	}

	const a11yTips = [
		'Wrap feeds with role="feed" so assistive tech announces streaming updates politely.',
		'Document keyboard shortcuts (j/k, g then h, .) near the surface or via help dialogs.',
		'Use aria-describedby to point to shortcut hints (“Press boost to announce to followers”).',
		'Keep action handlers idempotent and announce optimistic updates via aria-live regions.',
	];

	const cardSnippet = `
const statuses = createStatusShowcase();
const [spoilerStatus, pollStatus] = statuses;

const handlers: StatusActionHandlers = {
  onReply: (status) => console.log('Reply', status.id),
  onBoost: (status) => console.log('Boost', status.id),
  onFavorite: (status) => console.log('Favorite', status.id)
};

<StatusCard status={spoilerStatus} actionHandlers={handlers} />
<StatusCard status={pollStatus} actionHandlers={handlers} density="comfortable" />`;

	const threadSnippet = `
const statuses = createStatusShowcase();
const threadRoot = statuses.find((status) => status.id === 'status-thread-root') ?? statuses.at(-1);
const replies = createThreadReplies();

<StatusCard status={threadRoot} actionHandlers={handlers} />
{#each replies as reply}
  <Status.Root status={reply} handlers={handlers} config={{ density: 'compact' }}>
    <Status.Header />
    <Status.Content />
    {#if reply.mediaAttachments?.length}
      <Status.Media />
    {/if}
    <Status.Actions />
  </Status.Root>
{/each}`;

	const a11ySnippet = `
<section role="feed" aria-live="polite">
  <StatusCard status={threadRoot} actionHandlers={handlers} />
  {#each replies as reply}
    <Status.Root
      status={reply}
      handlers={handlers}
      config={{ density: 'compact' }}
      aria-describedby="thread-shortcuts"
      data-shortcut="j/k"
    >
      <Status.Header />
      <Status.Content />
      <Status.Actions />
    </Status.Root>
  {/each}
</section>`;
</script>

<DemoPage
	eyebrow="Fediverse Surface"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="status-section">
		<header>
			<p class="section-eyebrow">01 · Published StatusCard</p>
			<h2>Media, content warnings, and polls</h2>
			<p>
				All data comes from <code>createStatusShowcase()</code>, mirroring ActivityPub payloads with
				spoiler text, media attachments, and poll metadata. We tap into the published
				<code>StatusCard</code> component and wire the action callbacks so you can drop in API calls later.
			</p>
		</header>

		<div class="status-grid">
			<div class="status-card-stack" role="region" aria-live="polite">
				<StatusCard status={spoilerStatus} {actionHandlers} />
				<StatusCard status={pollStatus} {actionHandlers} density="comfortable" />
			</div>

			<div class="status-panel">
				<h3>Interaction log</h3>
				<p class="muted">Reply/boost/favorite any card to see the optimistic log update.</p>
				<div class="action-log" role="log" aria-live="polite">
					{#if actionLog.length === 0}
						<p class="muted">No actions yet.</p>
					{:else}
						<ol>
							{#each actionLog as entry (entry)}
								<li>{entry}</li>
							{/each}
						</ol>
					{/if}
				</div>
				<CodeExample
					title="StatusCard snippet"
					description="Data provided by createStatusShowcase()"
					code={cardSnippet}
				/>
			</div>
		</div>
	</section>

	<section class="status-section">
		<header>
			<p class="section-eyebrow">02 · Thread preview</p>
			<h2>Status compound components</h2>
			<p>
				The root card reuses the "thread" entry from <code>createStatusShowcase()</code>, while
				replies are provided by <code>createThreadReplies()</code>. We blend <code>StatusCard</code>
				with <code>Status.*</code> to illustrate how to stitch a thread with consistent action handlers.
			</p>
		</header>

		<div class="thread-layout">
			<div class="thread-stack" role="region" aria-labelledby="thread-heading">
				<h3 id="thread-heading" class="visually-hidden">Threaded status preview</h3>
				<StatusCard status={threadRoot} {actionHandlers} />
				<ol class="thread-replies">
					{#each replies as reply (reply.id)}
						<li>
							<Status.Root status={reply} handlers={actionHandlers} config={{ density: 'compact' }}>
								<Status.Header />
								<Status.Content />
								{#if reply.mediaAttachments?.length}
									<Status.Media />
								{/if}
								<Status.Actions />
							</Status.Root>
						</li>
					{/each}
				</ol>
			</div>
			<CodeExample
				title="Thread snippet"
				description="createThreadReplies() + Status compound"
				code={threadSnippet}
			/>
		</div>
	</section>

	<section class="status-section">
		<header>
			<p class="section-eyebrow">03 · Accessibility & guidance</p>
			<h2>ARIA roles + keyboard cues</h2>
		</header>

		<div class="a11y-grid">
			<ul class="guidance-list">
				{#each a11yTips as tip (tip)}
					<li>{tip}</li>
				{/each}
			</ul>
			<CodeExample
				title="Accessibility snippet"
				description="Role + shortcut annotations"
				code={a11ySnippet}
			/>
		</div>
	</section>
</DemoPage>

<style>
	.status-section {
		padding: 2.25rem;
		border-radius: var(--gr-radii-2xl);
		border: 1px solid var(--gr-semantic-border-subtle);
		background: var(--gr-semantic-background-primary);
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.section-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin-bottom: 0.25rem;
	}

	.status-grid {
		display: grid;
		grid-template-columns: minmax(320px, 1fr) minmax(260px, 360px);
		gap: 1.75rem;
		align-items: flex-start;
	}

	.status-card-stack {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.status-panel {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: var(--gr-semantic-background-secondary);
	}

	.muted {
		color: var(--gr-semantic-foreground-tertiary);
	}

	.action-log {
		min-height: 96px;
		border: 1px dashed var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-lg);
		padding: 0.75rem;
	}

	.action-log ol {
		margin: 0;
		padding-left: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.thread-layout {
		display: grid;
		grid-template-columns: minmax(360px, 2fr) minmax(260px, 1fr);
		gap: 1.75rem;
		align-items: flex-start;
	}

	.thread-stack {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-2xl);
		overflow: hidden;
		background: var(--gr-semantic-background-secondary);
	}

	.thread-replies {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.thread-replies li + li {
		border-top: 1px solid var(--gr-semantic-border-subtle);
	}

	.a11y-grid {
		display: grid;
		grid-template-columns: 1fr minmax(260px, 1.2fr);
		gap: 1.75rem;
		align-items: start;
	}

	.guidance-list {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.visually-hidden {
		border: 0;
		clip: rect(0 0 0 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
	}

	@media (max-width: 1080px) {
		.status-grid,
		.thread-layout,
		.a11y-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.status-section {
			padding: 1.5rem;
		}
	}
</style>
