<!--
Review.QueueCard - SSR-safe queue card for the shared-draft review workflow

Renders one entry of a review queue: draft identity (title, subtitle, excerpt,
last-updated), author/agent attribution, and the resolved verdict state —
including the stale-approval demotion, which keeps a recorded approval visible
but strips it of the success tone and wording once Lesser marks it void for
the current revision.

The card deliberately does not wrap itself in a single anchor: verdict actions
are composed into the `actions` snippet, and nesting a button inside an anchor
is invalid HTML and hostile to screen readers. Instead the title carries the
link and actions sit alongside it.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DraftReviewData } from '../../types.js';
	import {
		REVIEW_STATE_QUALIFIER,
		formatReviewDateTime,
		resolveReviewState,
		reviewActorName,
	} from './state.js';

	interface Props {
		/** The shared draft under review. */
		review: DraftReviewData;
		/**
		 * Link target for the draft. When omitted the title renders as plain
		 * text rather than inventing a route.
		 */
		href?: string;
		/** Heading level for the card title. */
		headingLevel?: 2 | 3 | 4;
		/** Show the draft excerpt. */
		showExcerpt?: boolean;
		/** Show the "Agent-generated" marker when the draft was agent-authored. */
		showAgentBadge?: boolean;
		/** Custom CSS class. */
		class?: string;
		/**
		 * Actions rendered in the card footer — typically `Review.VerdictActions`.
		 */
		actions?: Snippet;
		/**
		 * Supplementary content rendered above the actions — typically
		 * `Review.AttributionStrip`.
		 */
		attribution?: Snippet;
	}

	let {
		review,
		href,
		headingLevel = 2,
		showExcerpt = true,
		showAgentBadge = true,
		class: className = '',
		actions,
		attribution,
	}: Props = $props();

	const titleId = $derived(`gr-blog-review-card-title-${review.draftId}`);
	const headingTag = $derived(`h${headingLevel}` as 'h2' | 'h3' | 'h4');
	const cardClass = $derived(['gr-blog-review-card', className].filter(Boolean).join(' '));

	const title = $derived(review.title?.trim() || 'Untitled draft');
	const subtitle = $derived(review.subtitle?.trim() || '');
	const excerpt = $derived(review.excerpt?.trim() || '');

	const state = $derived(resolveReviewState(review));
	const stateClass = $derived(
		`gr-blog-review-card__state gr-blog-review-card__state--${state.tone}`
	);

	const updated = $derived(formatReviewDateTime(review.updatedAt));
	const scheduled = $derived(formatReviewDateTime(review.scheduledAt));

	const generatedByAgent = $derived(Boolean(review.generatedBy?.isAgent));
	const generatedByName = $derived(reviewActorName(review.generatedBy));
</script>

<article class={cardClass} aria-labelledby={titleId}>
	<div class="gr-blog-review-card__header">
		<svelte:element this={headingTag} id={titleId} class="gr-blog-review-card__title">
			{#if href}
				<a class="gr-blog-review-card__link" {href}>{title}</a>
			{:else}
				{title}
			{/if}
		</svelte:element>

		<div class="gr-blog-review-card__state-group">
			<p class={stateClass}>
				<span class="gr-blog-review-card__state-label">{state.label}</span>
			</p>
			{#if state.detail}
				<p class="gr-blog-review-card__state-detail">{state.detail}</p>
			{/if}
			{#if state.source !== 'none'}
				<span class="gr-blog-review-card__state-note">{REVIEW_STATE_QUALIFIER}</span>
			{/if}
		</div>
	</div>

	{#if subtitle}
		<p class="gr-blog-review-card__subtitle">{subtitle}</p>
	{/if}

	<p class="gr-blog-review-card__meta">
		{#if generatedByName}
			<span class="gr-blog-review-card__author">
				{#if generatedByAgent && showAgentBadge}
					<span class="gr-blog-review-card__agent-badge">Agent-generated</span>
				{/if}
				<span class="gr-blog-review-card__author-name">{generatedByName}</span>
			</span>
			<span class="gr-blog-review-card__separator" aria-hidden="true">·</span>
		{/if}

		{#if updated.label}
			<span class="gr-blog-review-card__updated">
				Updated
				<time datetime={updated.iso}>{updated.label}</time>
			</span>
		{/if}

		{#if scheduled.label}
			<span class="gr-blog-review-card__separator" aria-hidden="true">·</span>
			<span class="gr-blog-review-card__scheduled">
				Scheduled
				<time datetime={scheduled.iso}>{scheduled.label}</time>
			</span>
		{/if}
	</p>

	{#if showExcerpt && excerpt}
		<p class="gr-blog-review-card__excerpt">{excerpt}</p>
	{/if}

	{#if attribution}
		<div class="gr-blog-review-card__attribution">
			{@render attribution()}
		</div>
	{/if}

	{#if actions}
		<div class="gr-blog-review-card__actions">
			{@render actions()}
		</div>
	{/if}
</article>
