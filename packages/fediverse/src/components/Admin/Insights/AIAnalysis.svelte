<!--
Admin.Insights.AIAnalysis - AI Content Analysis Display

Shows AI-powered content analysis including sentiment, toxicity, spam detection,
deepfake detection, and moderation recommendations.

@component
@example
```svelte
<Insights.Root {adapter}>
  <Insights.AIAnalysis objectId={statusId} />
</Insights.Root>
```
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getInsightsContext } from './context.js';
	import type { AIAnalysis } from '@equaltoai/greater-components-adapters';

	interface Props {
		/**
		 * Object ID to analyze
		 */
		objectId?: string;

		/**
		 * Whether to auto-request analysis if none exists
		 */
		autoRequest?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { objectId, autoRequest = false, class: className = '' }: Props = $props();

	const context = getInsightsContext();
	let analysis = $state<AIAnalysis | null>(null);
	let loading = $state(false);
	let error = $state<Error | null>(null);
	let requesting = $state(false);

	async function loadAnalysis() {
		if (!objectId) return;

		loading = true;
		error = null;
		try {
			const result = await context.config.adapter.getAIAnalysis(objectId);
			analysis = result;

			if (!result && autoRequest) {
				await requestAnalysis();
			}
		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to load AI analysis');
		} finally {
			loading = false;
		}
	}

	async function requestAnalysis() {
		if (!objectId || requesting) return;

		requesting = true;
		try {
			await context.config.adapter.requestAIAnalysis(objectId);
			// Re-load after a delay
			setTimeout(() => loadAnalysis(), 3000);
		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to request AI analysis');
		} finally {
			requesting = false;
		}
	}

	onMount(() => {
		loadAnalysis();
	});

	function getSeverityColor(score: number): string {
		if (score >= 0.8) return 'var(--danger-color, #f4211e)';
		if (score >= 0.5) return 'var(--warning-color, #ff9800)';
		return 'var(--success-color, #10b981)';
	}

	function formatPercent(value: number): string {
		return `${(value * 100).toFixed(1)}%`;
	}
</script>

<div class={`ai-analysis ${className}`}>
	<div class="ai-analysis__header">
		<h3 class="ai-analysis__title">AI Analysis</h3>
		{#if objectId && !loading}
			<button
				class="ai-analysis__refresh"
				onclick={requestAnalysis}
				disabled={requesting}
				type="button"
			>
				{requesting ? 'Requesting...' : 'Request Analysis'}
			</button>
		{/if}
	</div>

	{#if loading}
		<div class="ai-analysis__loading">
			<p>Loading AI analysis...</p>
		</div>
	{:else if error}
		<div class="ai-analysis__error">
			<p>Error: {error.message}</p>
			<button onclick={loadAnalysis} type="button">Retry</button>
		</div>
	{:else if !analysis}
		<div class="ai-analysis__empty">
			<p>No AI analysis available for this content.</p>
			{#if autoRequest && objectId}
				<button onclick={requestAnalysis} disabled={requesting} type="button">
					{requesting ? 'Requesting...' : 'Request Analysis'}
				</button>
			{/if}
		</div>
	{:else}
		<div class="ai-analysis__content">
			<!-- Overall Risk -->
			<div class="ai-analysis__section">
				<h4 class="ai-analysis__section-title">Overall Assessment</h4>
				<div class="ai-analysis__risk">
					<div class="ai-analysis__risk-meter">
						<div
							class="ai-analysis__risk-fill"
							style="width: {formatPercent(
								analysis.overallRisk
							)}; background-color: {getSeverityColor(analysis.overallRisk)}"
						></div>
					</div>
					<div class="ai-analysis__risk-info">
						<span class="ai-analysis__risk-score">{formatPercent(analysis.overallRisk)} Risk</span>
						<span class="ai-analysis__risk-action">Action: {analysis.moderationAction}</span>
						<span class="ai-analysis__risk-confidence"
							>Confidence: {formatPercent(analysis.confidence)}</span
						>
					</div>
				</div>
			</div>

			<!-- Text Analysis -->
			{#if analysis.textAnalysis}
				<div class="ai-analysis__section">
					<h4 class="ai-analysis__section-title">Text Analysis</h4>
					<dl class="ai-analysis__details">
						<dt>Sentiment:</dt>
						<dd>{analysis.textAnalysis.sentiment}</dd>

						<dt>Toxicity:</dt>
						<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">
							{formatPercent(analysis.textAnalysis.toxicityScore)}
						</dd>

						{#if analysis.textAnalysis.containsPII}
							<dt>PII Detected:</dt>
							<dd class="ai-analysis__warning">Yes</dd>
						{/if}

						<dt>Language:</dt>
						<dd>{analysis.textAnalysis.dominantLanguage}</dd>
					</dl>
				</div>
			{/if}

			<!-- Image Analysis -->
			{#if analysis.imageAnalysis}
				<div class="ai-analysis__section">
					<h4 class="ai-analysis__section-title">Image Analysis</h4>
					<dl class="ai-analysis__details">
						{#if analysis.imageAnalysis.isNSFW}
							<dt>NSFW:</dt>
							<dd class="ai-analysis__warning">
								Yes ({formatPercent(analysis.imageAnalysis.nsfwConfidence)} confidence)
							</dd>
						{/if}

						<dt>Violence Score:</dt>
						<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">
							{formatPercent(analysis.imageAnalysis.violenceScore)}
						</dd>

						{#if analysis.imageAnalysis.deepfakeScore > 0.5}
							<dt>Deepfake:</dt>
							<dd class="ai-analysis__warning">
								Possible ({formatPercent(analysis.imageAnalysis.deepfakeScore)} confidence)
							</dd>
						{/if}
					</dl>
				</div>
			{/if}

			<!-- AI Detection -->
			{#if analysis.aiDetection}
				<div class="ai-analysis__section">
					<h4 class="ai-analysis__section-title">AI Content Detection</h4>
					<dl class="ai-analysis__details">
						<dt>AI Generated:</dt>
						<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">
							{formatPercent(analysis.aiDetection.aiGeneratedProbability)}
						</dd>

						{#if analysis.aiDetection.generationModel}
							<dt>Model:</dt>
							<dd>{analysis.aiDetection.generationModel}</dd>
						{/if}
					</dl>
				</div>
			{/if}

			<!-- Spam Analysis -->
			{#if analysis.spamAnalysis}
				<div class="ai-analysis__section">
					<h4 class="ai-analysis__section-title">Spam Detection</h4>
					<dl class="ai-analysis__details">
						<dt>Spam Score:</dt>
						<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">
							{formatPercent(analysis.spamAnalysis.spamScore)}
						</dd>

						<dt>Indicators:</dt>
						<dd>
							{#each analysis.spamAnalysis.spamIndicators.slice(0, 3) as indicator (indicator.type)}
								<span class="ai-analysis__tag">{indicator.type}</span>
							{/each}
						</dd>
					</dl>
				</div>
			{/if}

			<div class="ai-analysis__footer">
				<small>Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}</small>
			</div>
		</div>
	{/if}
</div>

<style>
	.ai-analysis {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.ai-analysis__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.ai-analysis__title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}

	.ai-analysis__refresh {
		padding: 0.5rem 1rem;
		background: var(--primary-color, #1d9bf0);
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.ai-analysis__refresh:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.ai-analysis__section {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.ai-analysis__section:last-of-type {
		border-bottom: none;
	}

	.ai-analysis__section-title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.ai-analysis__risk-meter {
		width: 100%;
		height: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.375rem;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.ai-analysis__risk-fill {
		height: 100%;
		transition: width 0.3s ease;
	}

	.ai-analysis__risk-info {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.ai-analysis__risk-score {
		font-weight: 600;
	}

	.ai-analysis__details {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.ai-analysis__details dt {
		font-weight: 600;
		color: var(--text-secondary, #536471);
	}

	.ai-analysis__details dd {
		margin: 0;
	}

	.ai-analysis__warning {
		color: var(--danger-color, #f4211e);
		font-weight: 600;
	}

	.ai-analysis__tag {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		margin-right: 0.25rem;
	}

	.ai-analysis__footer {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-secondary, #536471);
	}

	.ai-analysis__loading,
	.ai-analysis__error,
	.ai-analysis__empty {
		padding: 2rem;
		text-align: center;
	}

	.ai-analysis__error {
		color: var(--danger-color, #f4211e);
	}
</style>
