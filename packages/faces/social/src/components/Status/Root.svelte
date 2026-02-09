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
	const tombstoneTimestamp = $derived.by(() => {
		if (!tombstoneDeletedAt) return null;
		return formatDateTime(tombstoneDeletedAt);
	});
	const accountLabel = $derived(account ? account.displayName || account.username : 'Deleted post');

	// Create context for child components
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
		get config() {
			return {
				density: config.density || 'comfortable',
				showActions: config.showActions ?? true,
				clickable: config.clickable ?? false,
				showThread: config.showThread ?? true,
				class: config.class || '',
			};
		},
		get handlers() {
			return handlers;
		},
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
