<!--
Admin.SeveredRelationships.List - Severed Instances List
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getSeveredRelationshipsContext } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getSeveredRelationshipsContext();
	let relationships = $state<Array<Record<string, unknown>>>([]);
	let loading = $state(false);

	async function load() {
		loading = true;
		try {
			const result = await context.config.adapter.getSeveredRelationships();
			relationships =
				result?.edges?.map((e: Record<string, unknown>) => e.node as Record<string, unknown>) || [];
		} finally {
			loading = false;
		}
	}

	onMount(load);
</script>

<div class={`severed-relationships-list ${className}`}>
	<h4>Severed Relationships</h4>
	{#if loading}
		<p>Loading...</p>
	{:else if relationships.length === 0}
		<p>No severed relationships.</p>
	{:else}
		<ul>
			{#each relationships as rel (rel.id)}
				<li>
					{rel.remoteInstance} - {rel.reason} ({(rel.affectedFollowers as number) +
						(rel.affectedFollowing as number)} affected)
				</li>
			{/each}
		</ul>
	{/if}
</div>
