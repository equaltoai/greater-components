<!--
Admin.TrustGraph.RelationshipList - Trust Relationships Table

Tabular view of trust relationships and scores.

@component
@example
```svelte
<TrustGraph.Root {adapter} rootActorId={actorId}>
  <TrustGraph.RelationshipList />
</TrustGraph.Root>
```
-->

<script lang="ts">
	import { getTrustGraphContext } from './context.js';

	interface TrustEdge {
		from: { id: string; username: string; displayName: string };
		to: { id: string; username: string; displayName: string };
		category: string;
		score: number;
		updatedAt: string;
	}

	interface Props {
		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getTrustGraphContext();
	let relationships = $state<TrustEdge[]>([]);
	let loading = $state(false);
	let error = $state<Error | null>(null);

	async function loadRelationships() {
		if (!context.state.rootActorId) return;

		loading = true;
		error = null;
		try {
			const result = await context.config.adapter.getTrustGraph(
				context.state.rootActorId,
				context.config.category
			);
			relationships = result || [];
		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to load trust relationships');
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (context.state.rootActorId) {
			loadRelationships();
		}
	});

	function formatScore(score: number): string {
		return `${(score * 100).toFixed(1)}%`;
	}

	function getScoreClass(score: number): string {
		if (score >= 0.8) return 'trust-relationship-list__score--high';
		if (score >= 0.5) return 'trust-relationship-list__score--medium';
		if (score >= 0.3) return 'trust-relationship-list__score--low';
		return 'trust-relationship-list__score--very-low';
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString();
	}
</script>

<div class={`trust-relationship-list ${className}`}>
	<div class="trust-relationship-list__header">
		<h4 class="trust-relationship-list__title">Trust Relationships</h4>
	</div>

	{#if loading}
		<div class="trust-relationship-list__loading">
			<p>Loading relationships...</p>
		</div>
	{:else if error}
		<div class="trust-relationship-list__error">
			<p>Error: {error.message}</p>
			<button onclick={loadRelationships} type="button">Retry</button>
		</div>
	{:else if relationships.length === 0}
		<div class="trust-relationship-list__empty">
			<p>No trust relationships found.</p>
		</div>
	{:else}
		<div class="trust-relationship-list__table-wrapper">
			<table class="trust-relationship-list__table">
				<thead>
					<tr>
						<th>From</th>
						<th>To</th>
						<th>Category</th>
						<th>Score</th>
						<th>Updated</th>
					</tr>
				</thead>
				<tbody>
					{#each relationships as rel (rel.from.id + '-' + rel.to.id)}
						<tr class="trust-relationship-list__row">
							<td class="trust-relationship-list__actor">
								{rel.from.displayName || rel.from.username}
							</td>
							<td class="trust-relationship-list__actor">
								{rel.to.displayName || rel.to.username}
							</td>
							<td class="trust-relationship-list__category">
								{rel.category}
							</td>
							<td class="trust-relationship-list__score {getScoreClass(rel.score)}">
								{formatScore(rel.score)}
							</td>
							<td class="trust-relationship-list__date">
								{formatDate(rel.updatedAt)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
