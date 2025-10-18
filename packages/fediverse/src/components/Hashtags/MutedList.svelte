<!--
Hashtags.MutedList - List of Muted Hashtags
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getHashtagsContext } from './context.js';
	import type { NotificationLevel } from '@greater/adapters';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	interface FollowedHashtag {
		name: string;
		notificationSettings?: {
			level?: string;
			muted?: boolean;
			mutedUntil?: string | null;
		};
	}

	const context = getHashtagsContext();
	const refreshVersion = $derived(context.state.refreshVersion);
	let mutedHashtags = $state<FollowedHashtag[]>([]);
	let loading = $state(false);
	let processing = $state<string | null>(null);

	function notifyRefresh() {
		context.updateState({ refreshVersion: context.state.refreshVersion + 1 });
	}

	async function load() {
		loading = true;
		try {
			const result = await context.config.adapter.getFollowedHashtags();
			const edges = (result?.edges ?? []) as Array<{ node: FollowedHashtag }>;
			const nodes = edges.map((edge) => edge.node);
			mutedHashtags = nodes.filter((node) => node.notificationSettings?.muted === true);
		} finally {
			loading = false;
		}
	}

	async function unmute(tag: FollowedHashtag) {
		if (processing) return;
		processing = tag.name;
		try {
			const level = (tag.notificationSettings?.level as NotificationLevel | undefined) ?? 'ALL';
			await context.config.adapter.unmuteHashtag(tag.name, {
				level,
				mutedUntil: null,
			});
			notifyRefresh();
			await load();
		} catch (error) {
			console.error('Failed to unmute hashtag', error);
		} finally {
			processing = null;
		}
	}

	onMount(load);

	$effect(() => {
		const version = refreshVersion;
		if (version > 0) {
			void load();
		}
	});
</script>

<div class={`muted-hashtags ${className}`}>
	<h4>Muted Hashtags</h4>
	{#if loading}
		<p>Loading...</p>
	{:else if mutedHashtags.length === 0}
		<p>No muted hashtags.</p>
	{:else}
		<ul>
			{#each mutedHashtags as tag (tag.name)}
				<li>
					{tag.name}
					{#if tag.notificationSettings?.mutedUntil}
						<span class="muted-until">
							until {new Date(tag.notificationSettings.mutedUntil as string).toLocaleDateString()}
						</span>
					{/if}
					<button
						class="muted-hashtags__unmute"
						onclick={() => unmute(tag)}
						disabled={processing === tag.name}
						type="button"
					>
						{processing === tag.name ? 'Unmuting…' : 'Unmute'}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.muted-hashtags__unmute {
		margin-left: 0.75rem;
	}
</style>
