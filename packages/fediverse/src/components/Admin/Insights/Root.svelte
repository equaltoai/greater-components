<!--
Admin.Insights.Root - AI and Moderation Insights Container

Root component for admin insights, analytics, and AI analysis dashboards.

@component
@example
```svelte
<Insights.Root {adapter}>
  <Insights.AIAnalysis />
  <Insights.ModerationAnalytics />
</Insights.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createInsightsContext, type InsightsConfig } from './context.js';

	interface Props {
		/**
		 * GraphQL adapter
		 */
		adapter: InsightsConfig['adapter'];

		/**
		 * Configuration options
		 */
		config?: Partial<Omit<InsightsConfig, 'adapter'>>;

		/**
		 * Children content
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { adapter, config = {}, children, class: className = '' }: Props = $props();

	// Create context
	createInsightsContext({
		adapter,
		...config,
	});
</script>

<div class={`insights-root ${className}`}>
	{#if children}
		{@render children()}
	{:else}
		<div class="insights-root__empty">
			<p>
				No insights configured. Add Insights.AIAnalysis or Insights.ModerationAnalytics components.
			</p>
		</div>
	{/if}
</div>
