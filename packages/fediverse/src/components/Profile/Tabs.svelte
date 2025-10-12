<!--
  Profile.Tabs - Profile Navigation Tabs
  
  Displays navigation tabs for different sections of the profile (posts, replies, media, likes).
  
  @component
  @example
  ```svelte
  <Profile.Root {profile} {handlers}>
    <Profile.Tabs />
  </Profile.Root>
  ```
-->
<script lang="ts">
	import { createTabs } from '@greater/headless/tabs';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state, setActiveTab } = getProfileContext();

	const tabs = createTabs({
		defaultTab: state.activeTab,
		onChange: (tabId) => setActiveTab(tabId),
	});
</script>

<div class="profile-tabs {className}">
	<div class="profile-tabs__list" use:tabs.actions.list role="tablist">
		{#each state.tabs as tab}
			<button
				class="profile-tabs__tab"
				class:profile-tabs__tab--active={state.activeTab === tab.id}
				use:tabs.actions.tab={tab.id}
				role="tab"
				aria-selected={state.activeTab === tab.id}
			>
				{#if tab.icon}
					<svg class="profile-tabs__icon" viewBox="0 0 24 24" fill="currentColor">
						<path d={tab.icon} />
					</svg>
				{/if}
				<span class="profile-tabs__label">{tab.label}</span>
				{#if tab.count !== undefined}
					<span class="profile-tabs__count">{tab.count}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.profile-tabs {
		width: 100%;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		background: var(--bg-primary, #ffffff);
	}

	.profile-tabs__list {
		display: flex;
		gap: 0.25rem;
		padding: 0 1rem;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.profile-tabs__list::-webkit-scrollbar {
		display: none;
	}

	.profile-tabs__tab {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		border: none;
		background: transparent;
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.2s;
	}

	.profile-tabs__tab:hover {
		background: var(--bg-hover, rgba(0, 0, 0, 0.03));
		color: var(--text-primary, #0f1419);
	}

	.profile-tabs__tab--active {
		color: var(--text-primary, #0f1419);
	}

	.profile-tabs__tab--active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--primary-color, #1d9bf0);
		border-radius: 4px 4px 0 0;
	}

	.profile-tabs__icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.profile-tabs__count {
		padding: 0.125rem 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	.profile-tabs__tab--active .profile-tabs__count {
		background: rgba(29, 155, 240, 0.1);
		color: var(--primary-color, #1d9bf0);
	}
</style>
