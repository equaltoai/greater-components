<!--
Community.Stats - Community stats block
-->

<script lang="ts">
	import { getCommunityContext } from './context.js';

	const { community, config } = getCommunityContext();

	const createdAt = $derived.by(() => {
		const date =
			typeof community.stats.createdAt === 'string'
				? new Date(community.stats.createdAt)
				: community.stats.createdAt;
		return date.toLocaleDateString();
	});
</script>

{#if config.showStats}
	<section class="gr-community-stats" aria-label="Community stats">
		<div>{community.stats.subscriberCount.toLocaleString()} members</div>
		<div>{community.stats.activeCount.toLocaleString()} online</div>
		<div>{community.stats.postCount.toLocaleString()} posts</div>
		<div>Created {createdAt}</div>
	</section>
{/if}
