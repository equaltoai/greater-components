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
	import { untrack } from 'svelte';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: profileState, setActiveTab } = getProfileContext();

	const activeTabIndex = $derived.by(() => {
		const index = profileState.tabs.findIndex((tab) => tab.id === profileState.activeTab);
		return index >= 0 ? index : 0;
	});

	const tabs = createTabs({
		defaultTab: untrack(() => activeTabIndex),
		onChange: (index) => {
			const tabId = profileState.tabs[index]?.id;
			if (!tabId) return;
			setActiveTab(tabId);
		},
	});

	$effect(() => {
		if (tabs.state.activeTab !== activeTabIndex) {
			tabs.helpers.setActiveTab(activeTabIndex);
		}
	});
</script>

<div class={`profile-tabs ${className}`}>
	<div class="profile-tabs__list" use:tabs.actions.tabList>
		{#each profileState.tabs as tab, index (tab.id)}
			<button
				class="profile-tabs__tab"
				class:profile-tabs__tab--active={tabs.state.activeTab === index}
				use:tabs.actions.tab={{ index }}
				type="button"
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
