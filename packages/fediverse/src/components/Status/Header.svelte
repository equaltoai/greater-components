<!--
Status.Header - Display account information and timestamp

Shows avatar, display name, username, and post timestamp.
Handles reblog indicators automatically from context.

@component
@example
```svelte
<Status.Root status={post}>
  <Status.Header />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getStatusContext } from './context.js';
	import { formatDateTime } from '@equaltoai/greater-components-utils';
	import { Avatar } from '@equaltoai/greater-components-primitives';
	import { RepeatIcon } from '@equaltoai/greater-components-icons';

	interface Props {
		/**
		 * Custom avatar rendering
		 */
		avatar?: Snippet;

		/**
		 * Custom account info rendering
		 */
		accountInfo?: Snippet;

		/**
		 * Custom timestamp rendering
		 */
		timestamp?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { avatar, accountInfo, timestamp, class: className = '' }: Props = $props();

	const context = getStatusContext();
	const { status, actualStatus, account, isReblog, config } = context;

	const dateTime = $derived(formatDateTime(actualStatus.createdAt));
	const avatarSize = $derived(config.density === 'compact' ? 'sm' : 'md');
</script>

<div class={`status-header ${className}`}>
	<!-- Reblog indicator -->
	{#if isReblog}
		<div class="status-header__reblog-indicator">
			<RepeatIcon class="status-header__reblog-icon" size={16} />
			<span class="status-header__reblog-text">
				{status.account.displayName || status.account.username} boosted
			</span>
		</div>
	{/if}

	<div class="status-header__main">
		<!-- Avatar -->
		<div class="status-header__avatar">
			{#if avatar}
				{@render avatar()}
			{:else}
				<a
					href={account.url}
					class="status-header__avatar-link"
					aria-label={`View ${account.displayName || account.username}'s profile`}
				>
					<Avatar
						src={account.avatar}
						name={account.displayName || account.username}
						size={avatarSize}
						alt={`${account.displayName || account.username} avatar`}
					/>
				</a>
			{/if}
		</div>

		<!-- Account info -->
		<div class="status-header__account">
			{#if accountInfo}
				{@render accountInfo()}
			{:else}
				<div class="status-header__account-name">
					<a href={account.url} class="status-header__display-name">
						{account.displayName || account.username}
					</a>
					{#if account.bot}
						<span class="status-header__bot-badge" aria-label="Bot account"> BOT </span>
					{/if}
				</div>
				<div class="status-header__username">
					@{account.acct}
				</div>
			{/if}
		</div>

		<!-- Timestamp -->
		<div class="status-header__timestamp">
			{#if timestamp}
				{@render timestamp()}
			{:else}
				<time class="status-header__time" datetime={dateTime.iso} title={dateTime.absolute}>
					{dateTime.relative}
				</time>
			{/if}
		</div>
	</div>
</div>

<style>
	.status-header {
		display: flex;
		flex-direction: column;
		gap: var(--status-spacing-sm, 0.5rem);
	}

	.status-header__reblog-indicator {
		display: flex;
		align-items: center;
		gap: var(--status-spacing-xs, 0.25rem);
		margin-left: 0;
		color: var(--status-text-secondary, #536471);
		font-size: var(--status-font-size-sm, 0.875rem);
	}

	.status-header__reblog-icon {
		width: 16px;
		height: 16px;
	}

	.status-header__reblog-text {
		font-weight: 500;
	}

	.status-header__main {
		display: flex;
		align-items: flex-start;
		gap: var(--status-spacing-sm, 0.5rem);
	}

	.status-header__avatar {
		flex-shrink: 0;
	}

	.status-header__avatar-link {
		display: block;
		border-radius: 50%;
		overflow: hidden;
	}

	.status-header__avatar-link:focus {
		outline: 2px solid var(--status-focus-ring, #3b82f6);
		outline-offset: 2px;
	}

	.status-header__account {
		flex: 1;
		min-width: 0;
	}

	.status-header__account-name {
		display: flex;
		align-items: center;
		gap: var(--status-spacing-xs, 0.25rem);
	}

	.status-header__display-name {
		font-weight: 600;
		color: var(--status-text-primary, #0f1419);
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status-header__display-name:hover {
		text-decoration: underline;
	}

	.status-header__bot-badge {
		padding: 2px 4px;
		background: var(--status-bg-secondary, #f7f9fa);
		border: 1px solid var(--status-border-color, #e1e8ed);
		border-radius: var(--status-radius-xs, 2px);
		font-size: var(--status-font-size-xs, 0.75rem);
		font-weight: normal;
		line-height: 1;
	}

	.status-header__username {
		color: var(--status-text-secondary, #536471);
		font-size: var(--status-font-size-sm, 0.875rem);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status-header__timestamp {
		flex-shrink: 0;
	}

	.status-header__time {
		color: var(--status-text-secondary, #536471);
		font-size: var(--status-font-size-sm, 0.875rem);
		text-decoration: none;
		white-space: nowrap;
	}

	.status-header__time:hover {
		text-decoration: underline;
	}
</style>
