<script lang="ts">
	import ThemeProvider from '../../src/components/ThemeProvider.svelte';
	import type ThemeProviderComponent from '../../src/components/ThemeProvider.svelte';
	import type { ComponentProps } from 'svelte';

	const { props = {} as ComponentProps<typeof ThemeProviderComponent> } = $props<{
		props?: ComponentProps<typeof ThemeProviderComponent>;
	}>();
</script>

<ThemeProvider {...props}>
	{#snippet children()}
		<div data-testid="theme-provider-child">Provider content</div>
	{/snippet}
</ThemeProvider>
