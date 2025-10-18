<!--
Hashtags.FollowedList - List of Followed Hashtags
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getHashtagsContext } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getHashtagsContext();
	let hashtags = $state<Array<Record<string, unknown>>>([]);
	let loading = $state(false);

	async function load() {
		loading = true;
		try {
			const result = await context.config.adapter.getFollowedHashtags();
			hashtags =
				result?.edges?.map((e: Record<string, unknown>) => e.node as Record<string, unknown>) || [];
		} finally {
			loading = false;
		}
	}

	async function unfollow(hashtag: string) {
		await context.config.adapter.unfollowHashtag(hashtag);
		await load();
	}

	onMount(load);
</script>

<div class={`followed-hashtags ${className}`}>
	<h4>Followed Hashtags</h4>
	{#if loading}
		<p>Loading...</p>
	{:else if hashtags.length === 0}
		<p>No followed hashtags.</p>
	{:else}
		<ul>
			{#each hashtags as tag (tag.name)}
				<li>
					{tag.name}
					<button onclick={() => unfollow(tag.name as string)}>Unfollow</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
