<!--
Notifications.Filter - Filter notifications by type

Allows users to filter notifications by type (all, mentions, follows, etc.).

@component
@example
```svelte
<script>
  import { Notifications } from '@greater/fediverse';
</script>

<Notifications.Root {notifications}>
  <Notifications.Filter />
  {#each notifications as notification}
    <Notifications.Item {notification} />
  {/each}
</Notifications.Root>
```
-->

<script lang="ts">
	import { getNotificationsContext } from './context.js';
	import type { NotificationFilter } from './context.js';

	interface Props {
		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getNotificationsContext();

	const filters: Array<{ value: NotificationFilter; label: string; icon: string }> = [
		{ value: 'all', label: 'All', icon: '🔔' },
		{ value: 'mentions', label: 'Mentions', icon: '@' },
		{ value: 'follows', label: 'Follows', icon: '👤' },
		{ value: 'boosts', label: 'Boosts', icon: '🔁' },
		{ value: 'favorites', label: 'Favorites', icon: '⭐' },
		{ value: 'polls', label: 'Polls', icon: '📊' },
	];

	function handleFilterClick(filter: NotificationFilter) {
		context.updateState({ activeFilter: filter });
		context.handlers.onFilterChange?.(filter);
	}
</script>

<nav class="notification-filter {className}" aria-label="Filter notifications">
	<div class="notification-filter__tabs">
		{#each filters as filter}
			<button
				class="notification-filter__tab"
				class:notification-filter__tab--active={context.state.activeFilter === filter.value}
				onclick={() => handleFilterClick(filter.value)}
				aria-current={context.state.activeFilter === filter.value ? 'page' : undefined}
			>
				<span class="notification-filter__icon" aria-hidden="true">{filter.icon}</span>
				<span class="notification-filter__label">{filter.label}</span>
			</button>
		{/each}
	</div>
</nav>

<style>
	.notification-filter {
		border-bottom: 1px solid var(--notifications-border, #e1e8ed);
		background: var(--notifications-filter-bg, white);
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.notification-filter__tabs {
		display: flex;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.notification-filter__tabs::-webkit-scrollbar {
		display: none;
	}

	.notification-filter__tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--notifications-text-secondary, #536471);
		font-size: var(--notifications-font-size-base, 1rem);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.notification-filter__tab:hover {
		background: var(--notifications-filter-hover-bg, #f7f9fa);
	}

	.notification-filter__tab--active {
		color: var(--notifications-primary, #1d9bf0);
		border-bottom-color: var(--notifications-primary, #1d9bf0);
		font-weight: 700;
	}

	.notification-filter__icon {
		font-size: 1.25rem;
	}

	.notification-filter__label {
		/* Label styling */
	}

	@media (max-width: 640px) {
		.notification-filter__label {
			display: none;
		}

		.notification-filter__tab {
			padding: 0.75rem 0.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.notification-filter__tab {
			transition: none;
		}
	}
</style>
