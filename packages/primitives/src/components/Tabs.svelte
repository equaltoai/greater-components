<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface TabData {
		id: string;
		label: string;
		disabled?: boolean;
		content?: Snippet;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
		tabs: TabData[];
		activeTab?: string;
		orientation?: 'horizontal' | 'vertical';
		activation?: 'automatic' | 'manual';
		variant?: 'default' | 'pills' | 'underline';
		class?: string;
		onTabChange?: (tabId: string) => void;
	}

	let {
		tabs = [],
		activeTab = undefined,
		orientation = 'horizontal',
		activation = 'automatic',
		variant = 'default',
		class: className = '',
		onTabChange,
		...restProps
	}: Props = $props<Props>();

	// State management
	let currentActiveTab = $state(activeTab ?? tabs[0]?.id);
	let focusedTabIndex = $state(0);
	let tablistElement: HTMLElement | null = $state(null);

	// Sync external activeTab prop with internal state
	$effect(() => {
		if (activeTab !== undefined && activeTab !== currentActiveTab) {
			currentActiveTab = activeTab;
			const tabIndex = tabs.findIndex((tab) => tab.id === activeTab);
			if (tabIndex !== -1) {
				focusedTabIndex = tabIndex;
			}
		}
	});

	// Compute container classes
	const containerClass = $derived(() => {
		const classes = ['gr-tabs', `gr-tabs--${orientation}`, `gr-tabs--${variant}`, className]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	function selectTab(tabId: string) {
		const tab = tabs.find((t) => t.id === tabId);
		if (tab && !tab.disabled && tabId !== currentActiveTab) {
			currentActiveTab = tabId;
			const tabIndex = tabs.findIndex((t) => t.id === tabId);
			focusedTabIndex = tabIndex;
			onTabChange?.(tabId);
		}
	}

	function focusTab(index: number) {
		focusedTabIndex = index;
		const tabButton = tablistElement?.querySelector(`[data-tab-index="${index}"]`) as HTMLElement;
		tabButton?.focus();

		// Automatic activation - select tab on focus
		if (activation === 'automatic') {
			const tab = tabs[index];
			if (tab && !tab.disabled) {
				selectTab(tab.id);
			}
		}
	}

	function handleTabKeydown(event: KeyboardEvent, tabIndex: number) {
		const tab = tabs[tabIndex];

		switch (event.key) {
			case 'ArrowRight':
				if (orientation === 'horizontal') {
					event.preventDefault();
					moveToNextTab();
				}
				break;

			case 'ArrowLeft':
				if (orientation === 'horizontal') {
					event.preventDefault();
					moveToPreviousTab();
				}
				break;

			case 'ArrowDown':
				if (orientation === 'vertical') {
					event.preventDefault();
					moveToNextTab();
				}
				break;

			case 'ArrowUp':
				if (orientation === 'vertical') {
					event.preventDefault();
					moveToPreviousTab();
				}
				break;

			case 'Home':
				event.preventDefault();
				moveToFirstTab();
				break;

			case 'End':
				event.preventDefault();
				moveToLastTab();
				break;

			case 'Enter':
			case ' ':
				if (activation === 'manual') {
					event.preventDefault();
					if (tab && !tab.disabled) {
						selectTab(tab.id);
					}
				}
				break;
		}
	}

	function moveToNextTab() {
		let nextIndex = focusedTabIndex + 1;

		// Skip disabled tabs
		while (nextIndex < tabs.length && tabs[nextIndex].disabled) {
			nextIndex++;
		}

		// Wrap around to first non-disabled tab
		if (nextIndex >= tabs.length) {
			nextIndex = tabs.findIndex((tab) => !tab.disabled);
		}

		if (nextIndex !== -1 && nextIndex !== focusedTabIndex) {
			focusTab(nextIndex);
		}
	}

	function moveToPreviousTab() {
		let prevIndex = focusedTabIndex - 1;

		// Skip disabled tabs
		while (prevIndex >= 0 && tabs[prevIndex].disabled) {
			prevIndex--;
		}

		// Wrap around to last non-disabled tab
		if (prevIndex < 0) {
			prevIndex = tabs.length - 1;
			while (prevIndex >= 0 && tabs[prevIndex].disabled) {
				prevIndex--;
			}
		}

		if (prevIndex !== -1 && prevIndex !== focusedTabIndex) {
			focusTab(prevIndex);
		}
	}

	function moveToFirstTab() {
		const firstIndex = tabs.findIndex((tab) => !tab.disabled);
		if (firstIndex !== -1 && firstIndex !== focusedTabIndex) {
			focusTab(firstIndex);
		}
	}

	function moveToLastTab() {
		let lastIndex = tabs.length - 1;
		while (lastIndex >= 0 && tabs[lastIndex].disabled) {
			lastIndex--;
		}
		if (lastIndex !== -1 && lastIndex !== focusedTabIndex) {
			focusTab(lastIndex);
		}
	}

	// Generate deterministic ID prefix for accessibility so SSR + CSR stay in sync.
	const tabsId = $derived(() => {
		const key = tabs.map((tab) => tab.id).join('-') || 'default';
		return `tabs-${key}`;
	});
</script>

<svelte:options
	customElement={{
		props: {
			tabs: {},
			activeTab: {},
			orientation: {},
			activation: {},
			variant: {},
			class: {},
			onTabChange: {}
		}
	}}
/>

<div class={containerClass()} {...restProps}>
	<div
		bind:this={tablistElement}
		class="gr-tabs__tablist"
		role="tablist"
		aria-orientation={orientation}
	>
		{#each tabs as tab, index (tab.id)}
			{@const isActive = tab.id === currentActiveTab}
			{@const isFocused = index === focusedTabIndex}
			<button
				class="gr-tabs__tab"
				class:gr-tabs__tab--active={isActive}
				class:gr-tabs__tab--disabled={tab.disabled}
				role="tab"
				data-tab-index={index}
				tabindex={tab.disabled ? -1 : isFocused ? 0 : -1}
				aria-selected={isActive}
				aria-disabled={tab.disabled}
				aria-controls={`${tabsId()}-panel-${tab.id}`}
				id={`${tabsId()}-tab-${tab.id}`}
				onclick={() => selectTab(tab.id)}
				onkeydown={(e) => handleTabKeydown(e, index)}
				onfocus={() => (focusedTabIndex = index)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="gr-tabs__panels">
		{#each tabs as tab (tab.id)}
			{@const isActive = tab.id === currentActiveTab}
			<div
				class="gr-tabs__panel"
				class:gr-tabs__panel--active={isActive}
				role="tabpanel"
				id={`${tabsId()}-panel-${tab.id}`}
				aria-labelledby={`${tabsId()}-tab-${tab.id}`}
				tabindex={isActive ? 0 : -1}
				hidden={!isActive}
			>
				{#if tab.content && isActive}
					{@render tab.content()}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	:global {
		.gr-tabs {
			display: flex;
			font-family: var(--gr-typography-fontFamily-sans);
		}

		.gr-tabs--horizontal {
			flex-direction: column;
		}

		.gr-tabs--vertical {
			flex-direction: row;
		}

		.gr-tabs__tablist {
			display: flex;
			position: relative;
		}

		.gr-tabs--horizontal .gr-tabs__tablist {
			flex-direction: row;
			border-bottom: 1px solid var(--gr-semantic-border-default);
		}

		.gr-tabs--vertical .gr-tabs__tablist {
			flex-direction: column;
			border-right: 1px solid var(--gr-semantic-border-default);
			min-width: 12rem;
		}

		.gr-tabs__tab {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
			font-size: var(--gr-typography-fontSize-sm);
			font-weight: var(--gr-typography-fontWeight-medium);
			line-height: var(--gr-typography-lineHeight-normal);
			color: var(--gr-semantic-foreground-secondary);
			background-color: transparent;
			border: none;
			cursor: pointer;
			transition-property: color, background-color, border-color;
			transition-duration: var(--gr-motion-duration-fast);
			transition-timing-function: var(--gr-motion-easing-out);
			position: relative;
			white-space: nowrap;
			user-select: none;
		}

		.gr-tabs__tab:focus {
			outline: none;
		}

		.gr-tabs__tab:focus-visible {
			box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
			z-index: 1;
		}

		.gr-tabs__tab:hover:not(.gr-tabs__tab--disabled):not(.gr-tabs__tab--active) {
			color: var(--gr-semantic-foreground-primary);
			background-color: var(--gr-semantic-background-secondary);
		}

		.gr-tabs__tab--active {
			color: var(--gr-semantic-action-primary-default);
		}

		.gr-tabs__tab--disabled {
			opacity: 0.6;
			cursor: not-allowed;
			pointer-events: none;
		}

		.gr-tabs__panels {
			flex: 1;
			position: relative;
		}

		.gr-tabs--horizontal .gr-tabs__panels {
			padding-top: var(--gr-spacing-scale-4);
		}

		.gr-tabs--vertical .gr-tabs__panels {
			padding-left: var(--gr-spacing-scale-4);
		}

		.gr-tabs__panel {
			outline: none;
		}

		.gr-tabs__panel:focus {
			box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
		}

		/* Default variant - simple border */
		.gr-tabs--default.gr-tabs--horizontal .gr-tabs__tab--active::after {
			content: '';
			position: absolute;
			bottom: -1px;
			left: 0;
			right: 0;
			height: 2px;
			background-color: var(--gr-semantic-action-primary-default);
		}

		.gr-tabs--default.gr-tabs--vertical .gr-tabs__tab--active::after {
			content: '';
			position: absolute;
			right: -1px;
			top: 0;
			bottom: 0;
			width: 2px;
			background-color: var(--gr-semantic-action-primary-default);
		}

		/* Pills variant - rounded background */
		.gr-tabs--pills .gr-tabs__tab {
			border-radius: var(--gr-radii-full);
			margin: var(--gr-spacing-scale-1);
		}

		.gr-tabs--pills .gr-tabs__tab--active {
			background-color: var(--gr-semantic-action-primary-default);
			color: var(--gr-color-base-white);
		}

		.gr-tabs--pills .gr-tabs__tablist {
			border: none;
			padding: var(--gr-spacing-scale-1);
			background-color: var(--gr-semantic-background-secondary);
			border-radius: var(--gr-radii-lg);
		}

		/* Underline variant - full underline */
		.gr-tabs--underline .gr-tabs__tablist {
			border-bottom: 2px solid var(--gr-semantic-border-default);
		}

		.gr-tabs--underline .gr-tabs__tab {
			border-bottom: 2px solid transparent;
			margin-bottom: -2px;
		}

		.gr-tabs--underline .gr-tabs__tab--active {
			border-bottom-color: var(--gr-semantic-action-primary-default);
		}

		/* Reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.gr-tabs__tab {
				transition-duration: 0ms;
			}
		}

		/* High contrast mode */
		@media (prefers-contrast: high) {
			.gr-tabs__tab--active {
				outline: 2px solid currentColor;
				outline-offset: -2px;
			}
		}
	}
</style>
