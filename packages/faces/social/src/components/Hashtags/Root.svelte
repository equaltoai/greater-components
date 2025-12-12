<!--
Hashtags.Root - Hashtag Management Container
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createHashtagsContext, type HashtagsConfig } from './context.js';

	interface Props {
		adapter: HashtagsConfig['adapter'];
		children?: Snippet;
		class?: string;
	}

	let { adapter, children, class: className = '' }: Props = $props();

	// eslint-disable-next-line svelte/valid-compile
	createHashtagsContext({ adapter });
</script>

<div class={`hashtags-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
