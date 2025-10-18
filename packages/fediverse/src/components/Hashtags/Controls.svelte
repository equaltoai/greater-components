<!--
Hashtags.Controls - Hashtag Follow/Mute Controls
-->

<script lang="ts">
	import { getHashtagsContext } from './context.js';

	interface Props {
		hashtag: string;
		class?: string;
	}

	let { hashtag, class: className = '' }: Props = $props();

	const context = getHashtagsContext();
	let processing = $state(false);

	async function follow() {
		processing = true;
		try {
			await context.config.adapter.followHashtag(hashtag);
		} finally {
			processing = false;
		}
	}

	async function mute() {
		processing = true;
		try {
			await context.config.adapter.muteHashtag(hashtag);
		} finally {
			processing = false;
		}
	}
</script>

<div class={`hashtag-controls ${className}`}>
	<button onclick={follow} disabled={processing}>Follow</button>
	<button onclick={mute} disabled={processing}>Mute</button>
</div>
