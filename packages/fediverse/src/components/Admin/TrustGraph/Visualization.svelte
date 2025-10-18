<!-- Admin.TrustGraph.Visualization - Trust Graph Visual Display -->

<script lang="ts">
	import { getTrustGraphContext } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getTrustGraphContext();
	let loading = $state(false);
	let error = $state<Error | null>(null);
	let edges = $state<Array<Record<string, unknown>>>([]);

	async function loadGraph() {
		if (!context.state.rootActorId) return;
		loading = true;
		error = null;
		try {
			const result = await context.config.adapter.getTrustGraph(
				context.state.rootActorId,
				context.config.category
			);
			edges = result || [];
		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to load');
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (context.state.rootActorId) {
			void loadGraph();
		}
	});
</script>

<div class={`trust-graph-visualization ${className}`}>
	{#if loading}
		<div>Loading trust graph...</div>
	{:else if error}
		<div>Error: {error.message}</div>
	{:else if edges.length === 0}
		<div>No trust relationships found.</div>
	{:else}
		<div>Trust Graph: {edges.length} relationships</div>
	{/if}
</div>

<style>
	.trust-graph-visualization {
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
	}
</style>
