<!--
Transparency.ProcessDocumentation - Creative process timeline component

REQ-AI-009: Human creativity documentation for AI-assisted work
REQ-PHIL-004: Position AI as creative assistant, never replacement

Features:
- Visual timeline of creation process
- Step-by-step documentation
- Color-coded human vs AI contributions
- Exportable process documentation
- Timestamps and notes per step

@component
@example
```svelte
<script>
  import { ProcessDocumentation } from '@equaltoai/greater-components/faces/artist/Transparency';
  
  const steps = [
    { id: '1', order: 1, title: 'Concept', description: 'Initial sketches', type: 'human', timestamp: new Date() },
    { id: '2', order: 2, title: 'AI Generation', description: 'Reference images', type: 'ai', timestamp: new Date() },
    { id: '3', order: 3, title: 'Refinement', description: 'Manual adjustments', type: 'hybrid', timestamp: new Date() }
  ];
</script>

<ProcessDocumentation {steps} showAIContribution />
```
-->

<script lang="ts">
	import type { ProcessStep, ProcessDocumentationData } from '../../types/transparency.js';

	interface Props {
		/** Process steps to display */
		steps: ProcessStep[];
		/** Show AI contribution indicators */
		showAIContribution?: boolean;
		/** Documentation title */
		title?: string;
		/** Overview description */
		overview?: string;
		/** Total creation time */
		totalTime?: string;
		/** Enable export functionality */
		enableExport?: boolean;
		/** Compact display mode */
		compact?: boolean;
		/** Custom CSS class */
		class?: string;
		/** Export handler */
		onExport?: (data: ProcessDocumentationData) => void;
	}

	let {
		steps,
		showAIContribution = true,
		title = 'Creative Process',
		overview,
		totalTime,
		enableExport = false,
		compact = false,
		class: className = '',
	}: Props = $props();

	// Sort steps by order
	const sortedSteps = $derived([...steps].sort((a, b) => a.order - b.order));

	// Calculate contribution percentages
	const contributions = $derived(() => {
		const total = steps.length;
		if (total === 0) return { human: 0, ai: 0, hybrid: 0 };

		const counts = steps.reduce(
			(acc, step) => {
				acc[step.type] = (acc[step.type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return {
			human: Math.round(((counts['human'] || 0) / total) * 100),
			ai: Math.round(((counts['ai'] || 0) / total) * 100),
			hybrid: Math.round(((counts['hybrid'] || 0) / total) * 100),
		};
	});

	// Format timestamp
	function formatTimestamp(timestamp: Date | string | undefined): string {
		if (!timestamp) return '';
		const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
		return date.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	// Get step type label
	function getStepTypeLabel(type: 'human' | 'ai' | 'hybrid'): string {
		const labels: Record<string, string> = {
			human: 'Human',
			ai: 'AI-Assisted',
			hybrid: 'Collaborative',
		};
		return labels[type] || type;
	}

	// Get step type icon
	function getStepTypeIcon(type: 'human' | 'ai' | 'hybrid'): string {
		const icons: Record<string, string> = {
			human: '👤',
			ai: '🤖',
			hybrid: '🤝',
		};
		return icons[type] || '•';
	}

	// Compute CSS classes
	const containerClass = $derived(
		['gr-transparency-process', compact && 'gr-transparency-process--compact', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={containerClass}>
	<!-- Header -->
	<header class="gr-transparency-process-header">
		<h3 class="gr-transparency-process-title">{title}</h3>
		{#if totalTime}
			<span class="gr-transparency-process-time">
				Total time: {totalTime}
			</span>
		{/if}
	</header>

	{#if overview}
		<p class="gr-transparency-process-overview">{overview}</p>
	{/if}

	<!-- Contribution summary -->
	{#if showAIContribution}
		<div class="gr-transparency-process-summary" role="region" aria-label="Contribution summary">
			<div class="gr-transparency-process-summary-item gr-transparency-process-summary-item--human">
				<span class="gr-transparency-process-summary-icon">👤</span>
				<span class="gr-transparency-process-summary-label">Human</span>
				<span class="gr-transparency-process-summary-value">{contributions().human}%</span>
			</div>
			<div class="gr-transparency-process-summary-item gr-transparency-process-summary-item--ai">
				<span class="gr-transparency-process-summary-icon">🤖</span>
				<span class="gr-transparency-process-summary-label">AI-Assisted</span>
				<span class="gr-transparency-process-summary-value">{contributions().ai}%</span>
			</div>
			<div
				class="gr-transparency-process-summary-item gr-transparency-process-summary-item--hybrid"
			>
				<span class="gr-transparency-process-summary-icon">🤝</span>
				<span class="gr-transparency-process-summary-label">Collaborative</span>
				<span class="gr-transparency-process-summary-value">{contributions().hybrid}%</span>
			</div>
		</div>
	{/if}

	<!-- Timeline -->
	<ol class="gr-transparency-process-timeline" role="list" aria-label="Creative process steps">
		{#each sortedSteps as step, index (step.id)}
			<li
				class="gr-transparency-process-step gr-transparency-process-step--{step.type}"
				role="listitem"
			>
				<!-- Timeline connector -->
				<div class="gr-transparency-process-connector">
					<div class="gr-transparency-process-dot" aria-hidden="true">
						{getStepTypeIcon(step.type)}
					</div>
					{#if index < sortedSteps.length - 1}
						<div class="gr-transparency-process-line" aria-hidden="true"></div>
					{/if}
				</div>

				<!-- Step content -->
				<div class="gr-transparency-process-content">
					<div class="gr-transparency-process-step-header">
						<span class="gr-transparency-process-step-number">Step {step.order}</span>
						<span class="gr-transparency-process-step-type">
							{getStepTypeLabel(step.type)}
						</span>
					</div>

					<h4 class="gr-transparency-process-step-title">{step.title}</h4>
					<p class="gr-transparency-process-step-desc">{step.description}</p>

					<!-- Step metadata -->
					<div class="gr-transparency-process-step-meta">
						{#if step.timestamp}
							<span class="gr-transparency-process-step-time">
								{formatTimestamp(step.timestamp)}
							</span>
						{/if}
						{#if step.duration}
							<span class="gr-transparency-process-step-duration">
								Duration: {step.duration}
							</span>
						{/if}
					</div>

					<!-- Tools used -->
					{#if step.tools?.length || step.aiTools?.length}
						<div class="gr-transparency-process-step-tools">
							<span class="gr-transparency-process-step-tools-label">Tools:</span>
							{#if step.tools?.length}
								{#each step.tools as tool (tool)}
									<span class="gr-transparency-process-step-tool">{tool}</span>
								{/each}
							{/if}
							{#if step.aiTools?.length}
								{#each step.aiTools as aiTool (aiTool.name)}
									<span
										class="gr-transparency-process-step-tool gr-transparency-process-step-tool--ai"
									>
										{aiTool.name}
									</span>
								{/each}
							{/if}
						</div>
					{/if}

					<!-- Notes -->
					{#if step.notes}
						<p class="gr-transparency-process-step-notes">
							<strong>Notes:</strong>
							{step.notes}
						</p>
					{/if}

					<!-- Media attachments -->
					{#if step.media?.length && !compact}
						<div class="gr-transparency-process-step-media">
							{#each step.media as media (media.url)}
								{#if media.type === 'image' || media.type === 'screenshot' || media.type === 'sketch'}
									<figure class="gr-transparency-process-media-item">
										<img
											src={media.thumbnailUrl || media.url}
											alt={media.caption || `${step.title} - ${media.type}`}
											loading="lazy"
										/>
										{#if media.caption}
											<figcaption>{media.caption}</figcaption>
										{/if}
									</figure>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</li>
		{/each}
	</ol>

	<!-- Export button -->
	{#if enableExport}
		<div class="gr-transparency-process-actions">
			<button
				class="gr-transparency-process-export"
				type="button"
				aria-label="Export process documentation"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
				Export Documentation
			</button>
		</div>
	{/if}
</div>

<style>
	.gr-transparency-process {
		font-family: var(--gr-typography-fontFamily-sans);
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
	}

	.gr-transparency-process--compact {
		padding: var(--gr-spacing-scale-4);
	}

	/* Header */
	.gr-transparency-process-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.gr-transparency-process-title {
		margin: 0;
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
	}

	.gr-transparency-process-time {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-process-overview {
		margin: 0 0 var(--gr-spacing-scale-4) 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		line-height: 1.6;
	}

	/* Summary */
	.gr-transparency-process-summary {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-md);
		margin-bottom: var(--gr-spacing-scale-6);
	}

	.gr-transparency-process-summary-item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		flex: 1;
	}

	.gr-transparency-process-summary-icon {
		font-size: var(--gr-typography-fontSize-lg);
	}

	.gr-transparency-process-summary-label {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-process-summary-value {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
		margin-left: auto;
	}

	/* Timeline */
	.gr-transparency-process-timeline {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.gr-transparency-process-step {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		position: relative;
	}

	/* Connector */
	.gr-transparency-process-connector {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		width: 40px;
	}

	.gr-transparency-process-dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--gr-typography-fontSize-base);
		background: var(--gr-color-gray-800);
		border: 2px solid var(--gr-color-gray-600);
	}

	.gr-transparency-process-step--human .gr-transparency-process-dot {
		border-color: var(--gr-color-primary-500);
		background: var(--gr-color-primary-900);
	}

	.gr-transparency-process-step--ai .gr-transparency-process-dot {
		border-color: var(--gr-color-gray-500);
		background: var(--gr-color-gray-800);
	}

	.gr-transparency-process-step--hybrid .gr-transparency-process-dot {
		border-color: var(--gr-color-amber-500);
		background: var(--gr-color-amber-900);
	}

	.gr-transparency-process-line {
		width: 2px;
		flex: 1;
		min-height: 24px;
		background: var(--gr-color-gray-700);
		margin: var(--gr-spacing-scale-2) 0;
	}

	/* Content */
	.gr-transparency-process-content {
		flex: 1;
		padding-bottom: var(--gr-spacing-scale-6);
	}

	.gr-transparency-process-step:last-child .gr-transparency-process-content {
		padding-bottom: 0;
	}

	.gr-transparency-process-step-header {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-1);
	}

	.gr-transparency-process-step-number {
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.gr-transparency-process-step-type {
		font-size: var(--gr-typography-fontSize-xs);
		padding: var(--gr-spacing-scale-0-5) var(--gr-spacing-scale-2);
		border-radius: var(--gr-radii-full);
		background: var(--gr-color-gray-800);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-process-step--human .gr-transparency-process-step-type {
		background: var(--gr-color-primary-900);
		color: var(--gr-color-primary-300);
	}

	.gr-transparency-process-step--ai .gr-transparency-process-step-type {
		background: var(--gr-color-gray-800);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-process-step--hybrid .gr-transparency-process-step-type {
		background: var(--gr-color-amber-900);
		color: var(--gr-color-amber-300);
	}

	.gr-transparency-process-step-title {
		margin: 0 0 var(--gr-spacing-scale-1) 0;
		font-size: var(--gr-typography-fontSize-base);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-100);
	}

	.gr-transparency-process-step-desc {
		margin: 0 0 var(--gr-spacing-scale-2) 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		line-height: 1.5;
	}

	.gr-transparency-process-step-meta {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	.gr-transparency-process-step-tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-2);
	}

	.gr-transparency-process-step-tools-label {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	.gr-transparency-process-step-tool {
		font-size: var(--gr-typography-fontSize-xs);
		padding: var(--gr-spacing-scale-0-5) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-sm);
		color: var(--gr-color-gray-300);
	}

	.gr-transparency-process-step-tool--ai {
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
	}

	.gr-transparency-process-step-notes {
		margin: var(--gr-spacing-scale-2) 0 0 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		font-style: italic;
	}

	/* Media */
	.gr-transparency-process-step-media {
		display: flex;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-3);
		overflow-x: auto;
	}

	.gr-transparency-process-media-item {
		margin: 0;
		flex-shrink: 0;
	}

	.gr-transparency-process-media-item img {
		width: 120px;
		height: 80px;
		object-fit: cover;
		border-radius: var(--gr-radii-sm);
		border: 1px solid var(--gr-color-gray-700);
	}

	.gr-transparency-process-media-item figcaption {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		margin-top: var(--gr-spacing-scale-1);
	}

	/* Actions */
	.gr-transparency-process-actions {
		margin-top: var(--gr-spacing-scale-6);
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.gr-transparency-process-export {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-200);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-transparency-process-export:hover {
		background: var(--gr-color-gray-700);
		border-color: var(--gr-color-gray-500);
	}

	.gr-transparency-process-export:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-transparency-process-export svg {
		width: 16px;
		height: 16px;
	}
</style>
