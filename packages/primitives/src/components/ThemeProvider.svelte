<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { preferencesStore, type ColorScheme } from '../stores/preferences';

	interface Props {
		theme?: ColorScheme;
		enableSystemDetection?: boolean;
		enablePersistence?: boolean;
		preventFlash?: boolean;
		children: Snippet;
	}

	let {
		theme,
		enableSystemDetection = true,
		enablePersistence = true,
		preventFlash = true,
		children,
	}: Props = $props();

	// Apply theme override if provided
	$effect(() => {
		if (theme && theme !== preferencesStore.preferences.colorScheme) {
			preferencesStore.setColorScheme(theme);
		}
	});

	// Initialize theme on mount
	onMount(() => {
		// The preferences store automatically initializes and applies theme
		// This is just to ensure it's initialized in case of SSR
		// If we have a theme prop, apply it
		if (theme) {
			preferencesStore.setColorScheme(theme);
		}

		// Return cleanup function
		return () => {
			// Cleanup is handled by the store
		};
	});

	// Note: preventFlash, enablePersistence, and enableSystemDetection props are kept
	// for API compatibility but flash prevention should be handled in app.html.
	// See Greater Components docs for the recommended approach.
	void preventFlash;
	void enablePersistence;
	void enableSystemDetection;
</script>

<!-- 
	Theme flash prevention should be handled in app.html for SvelteKit projects.
	The preventFlash prop is kept for API compatibility but the script injection
	via svelte:head doesn't work reliably. See Greater Components docs for 
	the recommended app.html approach.
-->

<div class="gr-theme-provider" data-theme-provider>
	{@render children()}
</div>
