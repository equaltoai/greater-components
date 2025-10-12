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
	import { formatDateTime } from '@greater/utils';

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
	const avatarSize = $derived(config.density === 'compact' ? 40 : 48);
</script>

<div class="status-header {className}">
	<!-- Reblog indicator -->
	{#if isReblog}
		<div class="status-header__reblog-indicator">
			<svg class="status-header__reblog-icon" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="currentColor"
					d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.22 2.22V7.65a3.755 3.755 0 0 0-3.75-3.75h-5.85a.75.75 0 0 0 0 1.5h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22a.749.749 0 1 0-1.06 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5a.747.747 0 0 0 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22a.752.752 0 0 0 1.062 0 .749.749 0 0 0 0-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.22-2.22V16.7a3.755 3.755 0 0 0 3.75 3.75h5.85a.75.75 0 0 0 0-1.5z"
				/>
			</svg>
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
					aria-label="View {account.displayName || account.username}'s profile"
				>
					<img
						src={account.avatar}
						alt=""
						class="status-header__avatar-img"
						loading="lazy"
						width={avatarSize}
						height={avatarSize}
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
		margin-left: calc(48px + var(--status-spacing-sm, 0.5rem));
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

	.status-header__avatar-img {
		display: block;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
	}

	.status-root--compact .status-header__avatar-img {
		width: 40px;
		height: 40px;
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
