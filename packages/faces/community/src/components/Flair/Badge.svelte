<!--
Flair.Badge - Display a post/user flair badge
-->

<script lang="ts">
	import type { FlairData } from '../../types.js';

	interface Props {
		flair: FlairData;
		class?: string;
	}

	let { flair, class: className = '' }: Props = $props();

	const flairClass = $derived(
		[
			'gr-community-flair',
			flair.type === 'post' ? 'gr-community-flair--post' : 'gr-community-flair--user',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);

	const dotColor = $derived.by(() => flair.backgroundColor ?? flair.textColor ?? null);
</script>

<span class={flairClass}>
	{#if dotColor}
		<svg class="gr-community-flair__dot" viewBox="0 0 10 10" aria-hidden="true">
			<circle cx="5" cy="5" r="5" fill={dotColor} />
		</svg>
	{/if}
	{#if flair.emoji}
		<span class="gr-community-flair__emoji" aria-hidden="true">{flair.emoji}</span>
	{/if}
	<span>{flair.text}</span>
</span>
