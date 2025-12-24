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

	const style = $derived.by(() => {
		const styles: string[] = [];
		if (flair.backgroundColor) styles.push(`background:${flair.backgroundColor}`);
		if (flair.textColor) styles.push(`color:${flair.textColor}`);
		return styles.join(';');
	});
</script>

<span class={flairClass} {style}>
	{#if flair.emoji}
		<span class="gr-community-flair__emoji" aria-hidden="true">{flair.emoji}</span>
	{/if}
	<span>{flair.text}</span>
</span>
