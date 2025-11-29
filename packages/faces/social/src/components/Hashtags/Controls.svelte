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
	let processing = $state<null | 'follow' | 'mute' | 'unmute'>(null);

	function notifyRefresh() {
		context.updateState({ refreshVersion: context.state.refreshVersion + 1 });
	}

	async function runAction<T>(type: 'follow' | 'mute' | 'unmute', action: () => Promise<T>) {
		if (processing) return;
		processing = type;
		try {
			await action();
			notifyRefresh();
		} finally {
			processing = null;
		}
	}

	async function follow() {
		await runAction('follow', () => context.config.adapter.followHashtag(hashtag));
	}

	async function mute() {
		await runAction('mute', () => context.config.adapter.muteHashtag(hashtag));
	}

	async function unmute() {
		await runAction('unmute', () => context.config.adapter.unmuteHashtag(hashtag));
	}
</script>

<div class={`hashtag-controls ${className}`}>
	<button onclick={follow} disabled={processing !== null} type="button">
		{processing === 'follow' ? 'Following…' : 'Follow'}
	</button>
	<button onclick={mute} disabled={processing !== null} type="button">
		{processing === 'mute' ? 'Muting…' : 'Mute'}
	</button>
	<button onclick={unmute} disabled={processing !== null} type="button">
		{processing === 'unmute' ? 'Unmuting…' : 'Unmute'}
	</button>
</div>
