<script lang="ts">
	import Tabs from '../../src/components/Tabs.svelte';
	import type TabsComponent from '../../src/components/Tabs.svelte';
	import { type ComponentProps } from 'svelte';
	let { props = {} as ComponentProps<typeof TabsComponent> } = $props<{
		props?: ComponentProps<typeof TabsComponent>;
	}>();

	const defaultTabs = [
		{ id: 'overview', label: 'Overview', content: OverviewContent },
		{ id: 'activity', label: 'Activity', content: ActivityContent },
		{ id: 'settings', label: 'Settings', disabled: true, content: SettingsContent },
	];
	const tabs = $derived(props.tabs ?? defaultTabs);
	const finalProps = $derived({
		...props,
		tabs,
	});
</script>

{#snippet OverviewContent()}
	<p data-testid="tab-panel-overview">Overview content</p>
{/snippet}

{#snippet ActivityContent()}
	<p data-testid="tab-panel-activity">Activity content</p>
{/snippet}

{#snippet SettingsContent()}
	<p data-testid="tab-panel-settings">Settings content</p>
{/snippet}

<Tabs {...finalProps} />
