<!--
Hashtags.MutedList - List of Muted Hashtags
-->

<script lang="ts">
	import { getHashtagsContext } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	getHashtagsContext();

	// Note: Schema doesn't have mutedHashtags query; this is placeholder
	const mutedHashtags = $state<Array<Record<string, unknown>>>([]);
</script>

<div class={`muted-hashtags ${className}`}>
	<h4>Muted Hashtags</h4>
	{#if mutedHashtags.length === 0}
		<p>No muted hashtags.</p>
	{/if}
</div>
