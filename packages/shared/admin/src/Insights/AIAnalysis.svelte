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

	type Severity = 'danger' | 'warning' | 'success';

	function getSeverity(score: number): Severity {
		if (score >= 0.8) return 'danger';
		if (score >= 0.5) return 'warning';
		return 'success';
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
						{@const overallRiskPercent = Math.max(0, Math.min(100, analysis.overallRisk * 100))}
						{@const overallRiskSeverity = getSeverity(analysis.overallRisk)}
						<div class="ai-analysis__risk-meter">
							<svg
								class="ai-analysis__risk-meter-svg"
								viewBox="0 0 100 1"
								preserveAspectRatio="none"
								aria-hidden="true"
							>
								<rect
									class={`ai-analysis__risk-fill ai-analysis__risk-fill--${overallRiskSeverity}`}
									x="0"
									y="0"
									width={overallRiskPercent}
									height="1"
								/>
							</svg>
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
							<dd
								class={`ai-analysis__severity ai-analysis__severity--${getSeverity(
									analysis.textAnalysis.toxicityScore
								)}`}
							>
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
							<dd
								class={`ai-analysis__severity ai-analysis__severity--${getSeverity(
									analysis.imageAnalysis.violenceScore
								)}`}
							>
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
							<dd
								class={`ai-analysis__severity ai-analysis__severity--${getSeverity(
									analysis.aiDetection.aiGeneratedProbability
								)}`}
							>
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
							<dd
								class={`ai-analysis__severity ai-analysis__severity--${getSeverity(
									analysis.spamAnalysis.spamScore
								)}`}
							>
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
