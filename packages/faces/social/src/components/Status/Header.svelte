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
