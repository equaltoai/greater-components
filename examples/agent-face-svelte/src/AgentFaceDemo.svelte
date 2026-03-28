<script lang="ts">
	import {
		AGENT_FACE_COMPOSITIONS,
		AgentGenesisWorkspace,
		GraduationApprovalThread,
		IdentityNexus,
		NexusDashboard,
		SoulRequestCenter,
		type AgentFaceComposition,
	} from '@equaltoai/greater-components/faces/agent';
	import { Button, ThemeProvider, ThemeSwitcher } from '@equaltoai/greater-components/primitives';
	import { agentFaceDemoScreens, type AgentFaceDemoKey } from './demo-data.js';
	import '@equaltoai/greater-components/tokens/theme.css';
	import '@equaltoai/greater-components/primitives/style.css';
	import '@equaltoai/greater-components/faces/agent/style.css';

	interface Props {
		embedded?: boolean;
	}

	let { embedded = false }: Props = $props();
	let activeKey = $state<AgentFaceDemoKey>('nexus-dashboard');

	const activeComposition = $derived(
		AGENT_FACE_COMPOSITIONS.find((composition) => composition.key === activeKey) ??
			AGENT_FACE_COMPOSITIONS[0]
	);
	const activeScreen = $derived(agentFaceDemoScreens[activeKey]);

	function setActiveKey(key: AgentFaceComposition['key']) {
		activeKey = key as AgentFaceDemoKey;
	}
</script>

<ThemeProvider>
	<section class:agent-face-demo--embedded={embedded} class="agent-face-demo">
		<header class="agent-face-demo__header">
			<div>
				<p class="agent-face-demo__eyebrow">Drones-oriented demo</p>
				<h1>Canonical Agent Face</h1>
				<p class="agent-face-demo__lede">
					Render the route-level face through public package surfaces while keeping host data,
					navigation, and product actions outside the bundle.
				</p>
			</div>

			<div class="agent-face-demo__header-actions">
				<ThemeSwitcher size="sm" variant="outline" />
			</div>
		</header>

		<div class="agent-face-demo__picker" role="tablist" aria-label="Agent face screens">
			{#each AGENT_FACE_COMPOSITIONS as composition (composition.key)}
				<Button
					variant={activeKey === composition.key ? 'solid' : 'outline'}
					size="sm"
					onclick={() => setActiveKey(composition.key)}
				>
					{composition.title}
				</Button>
			{/each}
		</div>

		<div class="agent-face-demo__meta">
			<article class="agent-face-demo__meta-card">
				<p class="agent-face-demo__meta-label">Current route</p>
				<h2>{activeScreen.label}</h2>
				<p>{activeScreen.summary}</p>
			</article>

			<article class="agent-face-demo__meta-card">
				<p class="agent-face-demo__meta-label">Stitch anchor</p>
				<h2>{activeComposition.stitchAnchor}</h2>
				<ul>
					{#each activeComposition.layoutBoundaries as boundary, boundaryIndex (`${activeComposition.key}-${boundaryIndex}`)}
						<li>{boundary}</li>
					{/each}
				</ul>
			</article>

			<article class="agent-face-demo__meta-card">
				<p class="agent-face-demo__meta-label">Aggregate surfaces</p>
				<h2>Public package path</h2>
				<ul>
					{#each activeComposition.aggregateExports as exportPath (exportPath)}
						<li><code>{exportPath}</code></li>
					{/each}
				</ul>
			</article>
		</div>

		<div class="agent-face-demo__canvas">
			{#if activeKey === 'genesis-workspace'}
				<AgentGenesisWorkspace data={agentFaceDemoScreens['genesis-workspace'].data} />
			{:else if activeKey === 'soul-request-center'}
				<SoulRequestCenter data={agentFaceDemoScreens['soul-request-center'].data} />
			{:else if activeKey === 'graduation-approval-thread'}
				<GraduationApprovalThread data={agentFaceDemoScreens['graduation-approval-thread'].data} />
			{:else if activeKey === 'identity-nexus'}
				<IdentityNexus data={agentFaceDemoScreens['identity-nexus'].data} />
			{:else}
				<NexusDashboard data={agentFaceDemoScreens['nexus-dashboard'].data} />
			{/if}
		</div>
	</section>
</ThemeProvider>

<style>
	:global(body) {
		margin: 0;
		background:
			radial-gradient(circle at top left, rgba(255, 159, 84, 0.14), transparent 28rem),
			radial-gradient(circle at top right, rgba(226, 155, 254, 0.16), transparent 26rem),
			var(--gr-semantic-background-primary);
		color: var(--gr-semantic-foreground-primary);
		font-family: var(--gr-typography-fontFamily-body);
	}

	.agent-face-demo {
		display: grid;
		gap: 1.5rem;
		max-width: 110rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.agent-face-demo--embedded {
		padding: 0;
	}

	.agent-face-demo__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.agent-face-demo__eyebrow,
	.agent-face-demo__lede,
	.agent-face-demo__meta-label,
	.agent-face-demo__meta-card p,
	.agent-face-demo__meta-card ul {
		margin: 0;
	}

	.agent-face-demo__eyebrow,
	.agent-face-demo__meta-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.agent-face-demo__header h1,
	.agent-face-demo__meta-card h2 {
		margin: 0.35rem 0 0;
		font-family: var(--gr-typography-fontFamily-headline);
	}

	.agent-face-demo__header h1 {
		font-size: clamp(2.4rem, 5vw, 4.2rem);
		line-height: 0.96;
	}

	.agent-face-demo__lede {
		max-width: 46rem;
		margin-top: 0.85rem;
		line-height: 1.65;
		color: var(--gr-semantic-foreground-secondary);
	}

	.agent-face-demo__picker {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.agent-face-demo__meta {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
	}

	.agent-face-demo__meta-card {
		display: grid;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		border-radius: 1.2rem;
		background: rgba(255, 255, 255, 0.76);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.agent-face-demo__meta-card p:last-of-type,
	.agent-face-demo__meta-card li {
		line-height: 1.55;
		color: var(--gr-semantic-foreground-secondary);
	}

	.agent-face-demo__meta-card ul {
		padding-left: 1rem;
	}

	.agent-face-demo__meta-card code {
		font-size: 0.85rem;
	}

	.agent-face-demo__canvas {
		min-width: 0;
	}

	@media (max-width: 720px) {
		.agent-face-demo {
			padding: 1rem;
		}

		.agent-face-demo__header {
			flex-direction: column;
		}
	}
</style>
