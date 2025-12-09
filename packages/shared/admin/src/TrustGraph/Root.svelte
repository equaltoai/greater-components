<!--
Admin.TrustGraph.Root - Trust Graph Container

Root component for trust graph visualization and relationship management.

@component
@example
```svelte
<TrustGraph.Root {adapter} rootActorId={actorId}>
  <TrustGraph.Visualization />
  <TrustGraph.RelationshipList />
</TrustGraph.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createTrustGraphContext, type TrustGraphConfig } from './context.js';

	interface Props {
		/**
		 * GraphQL adapter
		 */
		adapter: TrustGraphConfig['adapter'];

		/**
		 * Root actor ID to center the graph on
		 */
		rootActorId?: string;

		/**
		 * Configuration options
		 */
		config?: Partial<Omit<TrustGraphConfig, 'adapter'>>;

		/**
		 * Children content
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { adapter, rootActorId, config = {}, children, class: className = '' }: Props = $props();

	// Create context
	const context = createTrustGraphContext(
		untrack(() => ({
			adapter,
			...config,
		}))
	);

	// Load graph when rootActorId changes
	$effect(() => {
		if (rootActorId) {
			context.loadGraph(rootActorId);
		}
	});
</script>

<div class={`trust-graph-root ${className}`}>
	{#if children}
		{@render children()}
	{:else}
		<div class="trust-graph-root__empty">
			<p>
				No trust graph configured. Add TrustGraph.Visualization or TrustGraph.RelationshipList
				components.
			</p>
		</div>
	{/if}
</div>
