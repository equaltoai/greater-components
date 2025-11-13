<script lang="ts">
	import { StatusCard, type Status } from '@equaltoai/greater-components-fediverse';
	import { generateMockStatuses } from '@equaltoai/greater-components-fediverse/src/mockData';

	let posts: Status[] = generateMockStatuses(20);

	function handleBoost(status: Status) {
		status.reblogged = !status.reblogged;
		status.reblogsCount = (status.reblogsCount || 0) + (status.reblogged ? 1 : -1);
	}

	function handleFavorite(status: Status) {
		status.favourited = !status.favourited;
		status.favouritesCount = (status.favouritesCount || 0) + (status.favourited ? 1 : -1);
	}

	function handleReply(status: Status) {
		console.log('Reply to:', status.id);
	}
</script>

<div class="timeline-demo">
	<main class="timeline">
		<header class="timeline-header">
			<h1>Timeline with Status Cards</h1>
		</header>

		<div class="timeline-feed">
			<p>Posts count: {posts.length}</p>
			{#each posts as status (status.id)}
				<StatusCard
					{status}
					onBoost={handleBoost}
					onFavorite={handleFavorite}
					onReply={handleReply}
					density="comfortable"
				/>
			{/each}
		</div>
	</main>
</div>

<style>
	.timeline-demo {
		height: 100vh;
		background: var(--gr-semantic-background-secondary, #f7f9fa);
	}

	.timeline {
		display: flex;
		flex-direction: column;
		max-width: 600px;
		margin: 0 auto;
		height: 100vh;
		background: var(--gr-semantic-background-primary, #fff);
		border-left: 1px solid var(--gr-semantic-border-subtle, #e1e8ed);
		border-right: 1px solid var(--gr-semantic-border-subtle, #e1e8ed);
	}

	.timeline-header {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--gr-semantic-border-subtle, #e1e8ed);
		position: sticky;
		top: 0;
		background: var(--gr-semantic-background-primary, #fff);
		backdrop-filter: blur(10px);
		z-index: 10;
	}

	.timeline-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.timeline-feed {
		flex: 1;
		overflow-y: auto;
	}

	.loading,
	.empty {
		padding: 3rem 2rem;
		text-align: center;
		color: var(--gr-semantic-foreground-secondary, #64748b);
	}
</style>