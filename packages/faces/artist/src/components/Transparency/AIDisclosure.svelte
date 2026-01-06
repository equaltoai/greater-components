<!--
Transparency.AIDisclosure - Standalone AI usage transparency component

REQ-AI-008: AI usage transparency badge and details
REQ-PHIL-005: Maintain transparency about AI usage
REQ-PHIL-004: Position AI as creative assistant, never replacement

Supports three display variants:
- badge: Compact icon with tooltip
- detailed: Full breakdown panel
- inline: Text-based disclosure

@component
@example
```svelte
<script>
  import { AIDisclosure } from '@equaltoai/greater-components/faces/artist/Transparency';
  
  const usage = {
    hasAI: true,
    tools: [{ name: 'Midjourney', type: 'generation', usage: 'Initial concept generation' }],
    humanContribution: 70,
    aiContribution: 30,
    disclosureLevel: 'detailed'
  };
</script>

<AIDisclosure {usage} variant="badge" expandable />
```
-->

<script lang="ts">
	import type { AITool } from '../../types/transparency.js';

	/**
	 * AI usage data structure
	 */
	interface AIUsageData {
		/** Whether AI was used */
		hasAI: boolean;
		/** AI tools used */
		tools: AITool[];
		/** Human contribution percentage (0-100) */
		humanContribution: number;
		/** AI contribution percentage (0-100) */
		aiContribution: number;
		/** Disclosure detail level */
		disclosureLevel: 'none' | 'minimal' | 'detailed';
		/** Model/service information */
		model?: string;
		/** Provider information */
		provider?: string;
	}

	interface Props {
		/** AI usage data */
		usage: AIUsageData;
		/** Display variant */
		variant?: 'badge' | 'detailed' | 'inline';
		/** Allow expansion to show details */
		expandable?: boolean;
		/** Custom CSS class */
		class?: string;
	}

	let { usage, variant = 'badge', expandable = true, class: className = '' }: Props = $props();

	// Expanded state for badge variant
	let isExpanded = $state(false);

	// Toggle expanded state
	function toggleExpanded() {
		if (expandable && variant === 'badge') {
			isExpanded = !isExpanded;
		}
	}

	// Handle keyboard interaction
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleExpanded();
		}
	}

	// Format tool type for display
	function formatToolType(type: string): string {
		const typeMap: Record<string, string> = {
			generation: 'Generation',
			enhancement: 'Enhancement',
			upscaling: 'Upscaling',
			'style-transfer': 'Style Transfer',
			assistance: 'Assistance',
			reference: 'Reference',
			other: 'Other',
		};
		return typeMap[type] || type;
	}

	// Compute CSS classes
	const disclosureClass = $derived(
		[
			'gr-transparency-ai-disclosure',
			`gr-transparency-ai-disclosure--${variant}`,
			isExpanded && 'gr-transparency-ai-disclosure--expanded',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);

	const humanPercent = $derived(Math.max(0, Math.min(100, usage.humanContribution)));
	const aiPercent = $derived(Math.max(0, Math.min(100, usage.aiContribution)));
	const aiPercentRemainder = $derived(Math.max(0, Math.min(100 - humanPercent, aiPercent)));
</script>

{#if usage?.hasAI}
	<div class={disclosureClass}>
		{#if variant === 'badge'}
			<button
				class="gr-transparency-ai-badge"
				onclick={toggleExpanded}
				onkeydown={handleKeydown}
				aria-expanded={expandable ? isExpanded : undefined}
				aria-label="AI-assisted artwork - click for details"
				title="AI-assisted artwork"
				disabled={!expandable}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="gr-transparency-ai-icon"
				>
					<path d="M12 2L2 7l10 5 10-5-10-5z" />
					<path d="M2 17l10 5 10-5" />
					<path d="M2 12l10 5 10-5" />
				</svg>
				<span class="gr-transparency-ai-badge-label">AI</span>
			</button>
		{:else if variant === 'inline'}
			<span class="gr-transparency-ai-inline">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="gr-transparency-ai-icon"
				>
					<path d="M12 2L2 7l10 5 10-5-10-5z" />
					<path d="M2 17l10 5 10-5" />
					<path d="M2 12l10 5 10-5" />
				</svg>
				<span>AI-assisted ({usage.aiContribution}% AI contribution)</span>
			</span>
		{/if}

		{#if variant === 'detailed' || isExpanded}
			<div class="gr-transparency-ai-details" role="region" aria-label="AI usage details">
				<!-- Contribution breakdown -->
					<div class="gr-transparency-ai-contribution">
						<div class="gr-transparency-ai-contribution-header">
							<span class="gr-transparency-ai-contribution-title">Contribution Breakdown</span>
						</div>
						<div class="gr-transparency-ai-contribution-bar" role="img" aria-label="Contribution breakdown">
							<svg
								class="gr-transparency-ai-contribution-bar-svg"
								viewBox="0 0 100 1"
								preserveAspectRatio="none"
								aria-hidden="true"
							>
								<rect
									class="gr-transparency-ai-contribution-fill gr-transparency-ai-contribution-fill--human"
									x="0"
									y="0"
									width={humanPercent}
									height="1"
								/>
								<rect
									class="gr-transparency-ai-contribution-fill gr-transparency-ai-contribution-fill--ai"
									x={humanPercent}
									y="0"
									width={aiPercentRemainder}
									height="1"
								/>
							</svg>
						</div>
						<div class="gr-transparency-ai-contribution-labels">
							<span class="gr-transparency-ai-contribution-label">Human {humanPercent}%</span>
							<span class="gr-transparency-ai-contribution-label">AI {aiPercent}%</span>
						</div>
					</div>

				<!-- Tools used -->
				{#if usage.tools?.length}
					<div class="gr-transparency-ai-tools">
						<span class="gr-transparency-ai-detail-label">AI Tools Used:</span>
						<ul class="gr-transparency-ai-tools-list">
							{#each usage.tools as tool (tool.name)}
								<li class="gr-transparency-ai-tool">
									<span class="gr-transparency-ai-tool-name">{tool.name}</span>
									{#if tool.version}
										<span class="gr-transparency-ai-tool-version">v{tool.version}</span>
									{/if}
									<span class="gr-transparency-ai-tool-type">
										({formatToolType(tool.usage)})
									</span>
									{#if tool.description}
										<p class="gr-transparency-ai-tool-desc">{tool.description}</p>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Model/Provider info -->
				{#if usage.model || usage.provider}
					<div class="gr-transparency-ai-model">
						{#if usage.provider}
							<div class="gr-transparency-ai-detail">
								<span class="gr-transparency-ai-detail-label">Provider:</span>
								<span class="gr-transparency-ai-detail-value">{usage.provider}</span>
							</div>
						{/if}
						{#if usage.model}
							<div class="gr-transparency-ai-detail">
								<span class="gr-transparency-ai-detail-label">Model:</span>
								<span class="gr-transparency-ai-detail-value">{usage.model}</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Disclosure note -->
				<p class="gr-transparency-ai-note">
					AI was used as a creative assistant in this work. The artist maintains full creative
					control and ownership.
				</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	.gr-transparency-ai-disclosure {
		font-family: var(--gr-typography-fontFamily-sans);
	}

	/* Badge variant */
	.gr-transparency-ai-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-sm);
		color: var(--gr-color-gray-400);
		font-size: var(--gr-typography-fontSize-xs);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-transparency-ai-badge:hover:not(:disabled),
	.gr-transparency-ai-badge:focus:not(:disabled) {
		color: var(--gr-color-gray-100);
		border-color: var(--gr-color-gray-500);
		background: var(--gr-color-gray-800);
	}

	.gr-transparency-ai-badge:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-transparency-ai-badge:disabled {
		cursor: default;
	}

	.gr-transparency-ai-icon {
		width: 14px;
		height: 14px;
	}

	.gr-transparency-ai-badge-label {
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	/* Inline variant */
	.gr-transparency-ai-inline {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-ai-inline .gr-transparency-ai-icon {
		width: 14px;
		height: 14px;
	}

	/* Details panel */
	.gr-transparency-ai-details {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		margin-top: var(--gr-spacing-scale-2);
	}

	.gr-transparency-ai-disclosure--detailed .gr-transparency-ai-details {
		margin-top: 0;
	}

	/* Contribution bar */
	.gr-transparency-ai-contribution {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-transparency-ai-contribution-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.gr-transparency-ai-contribution-title {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-200);
	}

	.gr-transparency-ai-contribution-bar {
		display: flex;
		height: 24px;
		border-radius: var(--gr-radii-sm);
		overflow: hidden;
		background: var(--gr-color-gray-800);
	}

	.gr-transparency-ai-contribution-human {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-primary-600);
		color: var(--gr-color-white);
		min-width: fit-content;
		padding: 0 var(--gr-spacing-scale-2);
	}

	.gr-transparency-ai-contribution-ai {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-gray-600);
		color: var(--gr-color-white);
		min-width: fit-content;
		padding: 0 var(--gr-spacing-scale-2);
	}

	.gr-transparency-ai-contribution-label {
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: var(--gr-typography-fontWeight-medium);
		white-space: nowrap;
	}

	/* Tools list */
	.gr-transparency-ai-tools {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-transparency-ai-tools-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-transparency-ai-tool {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-sm);
	}

	.gr-transparency-ai-tool-name {
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-100);
	}

	.gr-transparency-ai-tool-version {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	.gr-transparency-ai-tool-type {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-ai-tool-desc {
		width: 100%;
		margin: var(--gr-spacing-scale-1) 0 0 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	/* Detail rows */
	.gr-transparency-ai-detail {
		display: flex;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-transparency-ai-detail-label {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-300);
	}

	.gr-transparency-ai-detail-value {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	/* Model info */
	.gr-transparency-ai-model {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	/* Note */
	.gr-transparency-ai-note {
		margin: 0;
		padding-top: var(--gr-spacing-scale-2);
		border-top: 1px solid var(--gr-color-gray-700);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		font-style: italic;
	}
</style>
