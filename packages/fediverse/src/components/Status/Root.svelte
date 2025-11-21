<!--
Status.Root - Container component for Status compound components

Provides context for child components and handles root-level interactions.

@component
@example
```svelte
<Status.Root status={post} config={{ density: 'comfortable' }}>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { GenericStatus } from '../../generics/index.js';
	import { setContext } from 'svelte';
	import { STATUS_CONTEXT_KEY } from './context.js';
	import type { StatusConfig, StatusActionHandlers, StatusContext } from './context.js';
	import { formatDateTime } from '@equaltoai/greater-components-utils';

	interface Props {
		/**
		 * Status data to display
		 */
		status: GenericStatus;

		/**
		 * Configuration options
		 */
		config?: StatusConfig;

		/**
		 * Action handlers
		 */
		handlers?: StatusActionHandlers;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let { status, config = {}, handlers = {}, children }: Props = $props();

	// Handle reblogs - display the reblogged status
	const actualStatus = $derived(status.reblog || status);
	const account = $derived(
		(status.reblog?.account || status.account) as GenericStatus['account'] | undefined
	);
	const isReblog = $derived(!!status.reblog);
	const tombstoneMetadata = $derived(
		(status as unknown as { metadata?: { lesser?: { isDeleted?: boolean; deletedAt?: string } } })
			?.metadata?.lesser
	);
	const tombstoneDeletedAt = $derived(
		(status as unknown as { deletedAt?: string | Date }).deletedAt ??
			tombstoneMetadata?.deletedAt ??
			(actualStatus as unknown as { deletedAt?: string | Date })?.deletedAt
	);
	const isTombstone = $derived(
		(status as unknown as { type?: string }).type === 'tombstone' ||
			tombstoneMetadata?.isDeleted === true ||
			(status as unknown as { isDeleted?: boolean }).isDeleted === true
	);
	const tombstoneTimestamp = $derived(() => {
		if (!tombstoneDeletedAt) return null;
		return formatDateTime(tombstoneDeletedAt);
	});
	const accountLabel = $derived(account ? account.displayName || account.username : 'Deleted post');

	// Create context for child components
	const context: StatusContext = {
		get status() {
			return status;
		},
		get actualStatus() {
			return actualStatus;
		},
		get account() {
			return account;
		},
		get isReblog() {
			return isReblog;
		},
		config: {
			density: config.density || 'comfortable',
			showActions: config.showActions ?? true,
			clickable: config.clickable ?? false,
			showThread: config.showThread ?? true,
			class: config.class || '',
		},
		handlers,
	};

	// Set context once during initialization
	setContext(STATUS_CONTEXT_KEY, context);

	/**
	 * Handle root element click
	 */
	function handleClick(event: MouseEvent) {
		if (!context.config.clickable) return;

		// Don't trigger if clicking on links or buttons
		const target = event.target as HTMLElement;
		if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
			return;
		}

		context.handlers.onClick?.(status);
	}

	/**
	 * Handle keyboard activation
	 */
	function handleKeyPress(event: KeyboardEvent) {
		if (!context.config.clickable) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			context.handlers.onClick?.(status);
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
	class={`status-root ${context.config.class}`}
	class:status-root--compact={context.config.density === 'compact'}
	class:status-root--comfortable={context.config.density === 'comfortable'}
	class:status-root--tombstone={isTombstone}
	class:status-root--clickable={context.config.clickable}
	role={context.config.clickable ? 'button' : undefined}
	tabindex={context.config.clickable ? 0 : undefined}
	onclick={context.config.clickable ? handleClick : undefined}
	onkeypress={context.config.clickable ? handleKeyPress : undefined}
	aria-label={context.config.clickable ? `Status by ${accountLabel}` : undefined}
>
	{#if isTombstone}
		<div class="status-tombstone" role="note">
			<div class="status-tombstone__icon" aria-hidden="true">
				<svg viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"
					/>
				</svg>
			</div>
			<div>
				<p class="status-tombstone__title">This post has been deleted.</p>
				{#if tombstoneTimestamp}
					<p class="status-tombstone__meta">Deleted {tombstoneTimestamp.relative}</p>
				{/if}
			</div>
		</div>
	{:else if children}
		{@render children()}
	{/if}
</article>

<style>
	.status-root {
		padding: var(--status-padding, 1rem);
		border-bottom: 1px solid var(--status-border-color, #e1e8ed);
		background: var(--status-bg, white);
		transition: background-color 0.2s;
	}

	.status-root--compact {
		padding: var(--status-padding-compact, 0.75rem);
	}

	.status-root--comfortable {
		padding: var(--status-padding-comfortable, 1rem);
	}

	.status-root--clickable {
		cursor: pointer;
	}

	.status-root--clickable:hover {
		background: var(--status-bg-hover, #f7f9fa);
	}

	.status-root--clickable:focus {
		outline: 2px solid var(--status-focus-ring, #3b82f6);
		outline-offset: -2px;
	}

	.status-root--tombstone {
		background: var(--status-tombstone-bg, #f8fafc);
	}

	.status-tombstone {
		display: flex;
		align-items: center;
		gap: var(--status-spacing-sm, 0.5rem);
		color: var(--status-text-secondary, #4b5563);
	}

	.status-tombstone__title {
		margin: 0;
		font-weight: 600;
		color: var(--status-text-primary, #111827);
	}

	.status-tombstone__meta {
		margin: 0;
		color: var(--status-text-secondary, #6b7280);
	}

	.status-tombstone__icon {
		width: 28px;
		height: 28px;
		opacity: 0.7;
	}

	.status-tombstone__icon svg {
		width: 100%;
		height: 100%;
	}

	/* Allow customization via CSS custom properties */
	:global(.status-root) {
		--status-spacing-xs: 0.25rem;
		--status-spacing-sm: 0.5rem;
		--status-spacing-md: 1rem;
		--status-spacing-lg: 1.5rem;
	}
</style>
