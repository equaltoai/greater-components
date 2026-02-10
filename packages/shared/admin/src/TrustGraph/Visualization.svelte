<!-- Admin.TrustGraph.Visualization - Trust Graph Visual Display -->

<script lang="ts">
	import { getTrustGraphContext } from './context.js';

	interface TrustEdge {
		from: { id: string; username: string; displayName?: string };
		to: { id: string; username: string; displayName?: string };
		category: string;
		score: number;
		updatedAt: string;
	}

	interface PositionedNode {
		id: string;
		label: string;
		connections: number;
		isRoot: boolean;
		x: number;
		y: number;
	}

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getTrustGraphContext();
	let loading = $state(false);
	let error = $state<Error | null>(null);
	let edges = $state<TrustEdge[]>([]);

	const width = 640;
	const height = 420;
	const viewBox = `0 0 ${width} ${height}`;
	const centerX = width / 2;
	const centerY = height / 2;

	let positionedNodes = $state<PositionedNode[]>([]);
	let renderedEdges = $state<
		Array<{
			id: string;
			from: PositionedNode;
			to: PositionedNode;
			score: number;
			category: string;
		}>
	>([]);
	let uniqueActorCount = $state(0);

	function buildGraphLayout(edgesData: TrustEdge[]) {
		const rootId = context.state.rootActorId;
		const accumulator = new Map<
			string,
			{ id: string; label: string; connections: number; isRoot: boolean }
		>();

		for (const edge of edgesData) {
			const fromLabel = edge.from.displayName || edge.from.username;
			const toLabel = edge.to.displayName || edge.to.username;

			const fromEntry = accumulator.get(edge.from.id) ?? {
				id: edge.from.id,
				label: fromLabel,
				connections: 0,
				isRoot: edge.from.id === rootId,
			};
			fromEntry.connections += 1;
			fromEntry.isRoot ||= edge.from.id === rootId;
			accumulator.set(edge.from.id, fromEntry);

			const toEntry = accumulator.get(edge.to.id) ?? {
				id: edge.to.id,
				label: toLabel,
				connections: 0,
				isRoot: edge.to.id === rootId,
			};
			toEntry.connections += 1;
			toEntry.isRoot ||= edge.to.id === rootId;
			accumulator.set(edge.to.id, toEntry);
		}

		if (rootId && !accumulator.has(rootId)) {
			accumulator.set(rootId, {
				id: rootId,
				label: rootId,
				connections: 0,
				isRoot: true,
			});
		}

		const baseNodes = Array.from(accumulator.values());

		if (baseNodes.length === 0) {
			positionedNodes = [];
			renderedEdges = [];
			uniqueActorCount = 0;
			return;
		}

		const nonRoot = baseNodes.filter((node) => !node.isRoot);
		const root = baseNodes.find((node) => node.isRoot) ?? baseNodes[0];
		const radius = Math.min(width, height) / 2 - 60;

		const positioned: PositionedNode[] = [
			{
				...root,
				x: centerX,
				y: centerY,
			},
		];

		if (nonRoot.length > 0) {
			const step = (2 * Math.PI) / nonRoot.length;
			nonRoot.forEach((node, index) => {
				const angle = index * step;
				const x = centerX + radius * Math.cos(angle);
				const y = centerY + radius * Math.sin(angle);
				positioned.push({
					...node,
					x,
					y,
				});
			});
		}

		const lookup = new Map(positioned.map((node) => [node.id, node] as const));
		const edgeLayout = edgesData
			.map((edge, index) => {
				const fromNode = lookup.get(edge.from.id);
				const toNode = lookup.get(edge.to.id);
				if (!fromNode || !toNode) return null;
				return {
					id: `${edge.from.id}-${edge.to.id}-${index}`,
					from: fromNode,
					to: toNode,
					score: edge.score,
					category: edge.category,
				};
			})
			.filter((edge): edge is NonNullable<typeof edge> => edge !== null);

		positionedNodes = positioned;
		renderedEdges = edgeLayout;
		uniqueActorCount = positioned.length;
	}

	async function loadGraph() {
		if (!context.state.rootActorId) return;
		loading = true;
		error = null;
		try {
			const result = await context.config.adapter.getTrustGraph(
				context.state.rootActorId,
				context.config.category
			);
			edges = (result ?? []).map((edge) => edge as unknown as TrustEdge);
			buildGraphLayout(edges);
		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to load trust graph');
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
		<div class="trust-graph-visualization__summary" data-testid="trust-graph-summary">
			<div class="trust-graph-visualization__metric">
				<strong>{edges.length}</strong>
				<span>Relationships</span>
			</div>
			<div class="trust-graph-visualization__metric">
				<strong>{uniqueActorCount}</strong>
				<span>Unique Actors</span>
			</div>
		</div>

		<svg
			class="trust-graph-visualization__canvas"
			{viewBox}
			role="img"
			aria-label="Trust graph visualization"
			data-testid="trust-graph-canvas"
		>
			<g class="trust-graph-visualization__edges">
				{#each renderedEdges as edge (edge.id)}
					<line
						x1={edge.from.x}
						y1={edge.from.y}
						x2={edge.to.x}
						y2={edge.to.y}
						data-category={edge.category}
						data-testid="trust-graph-edge"
						aria-hidden="true"
					/>
				{/each}
			</g>

			<g class="trust-graph-visualization__nodes">
				{#each positionedNodes as node (node.id)}
					<g
						class={`trust-graph-visualization__node${node.isRoot ? ' trust-graph-visualization__node--root' : ''}`}
						transform={`translate(${node.x}, ${node.y})`}
						data-testid="trust-graph-node"
					>
						<circle r={node.isRoot ? 14 : 10} />
						<text y={node.isRoot ? -20 : -16} text-anchor="middle">{node.label}</text>
						{#if !node.isRoot}
							<text y={20} text-anchor="middle" class="trust-graph-visualization__node-degree">
								{node.connections} links
							</text>
						{/if}
					</g>
				{/each}
			</g>
		</svg>

		<div class="trust-graph-visualization__legend">
			<div>
				<span class="legend-dot legend-dot--root"></span>
				Root actor
			</div>
			<div>
				<span class="legend-dot"></span>
				Connected actor
			</div>
		</div>
	{/if}
</div>
