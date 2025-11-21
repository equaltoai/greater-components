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
	import { createTabs } from '@equaltoai/greater-components-headless/tabs';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: profileState, setActiveTab } = getProfileContext();

	const tabs = createTabs({
		defaultTab: profileState.activeTab,
		onChange: (tabId) => setActiveTab(tabId),
	});
</script>

<div class={`profile-tabs ${className}`}>
	<div class="profile-tabs__list" use:tabs.actions.list role="tablist">
		{#each profileState.tabs as tab (tab.id)}
			<button
				class="profile-tabs__tab"
				class:profile-tabs__tab--active={profileState.activeTab === tab.id}
				use:tabs.actions.tab={tab.id}
				role="tab"
				aria-selected={profileState.activeTab === tab.id}
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
