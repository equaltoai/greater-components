<!--
CritiqueCircle.Queue - Critique request queue management

@component
-->

<script lang="ts">
	import {
		getCritiqueCircleContext,
		canSubmit,
		formatWaitTime,
		calculateEstimatedWaitTime,
	} from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCritiqueCircleContext();
	const { circle, config, handlers } = ctx;

	// Form state
	let feedbackRequested = $state('');
	let selectedArtworkId = $state('');

	// Check if user can submit
	const userCanSubmit = $derived(canSubmit(ctx));

	// Get queue with estimated times
	const queueWithTimes = $derived(
		circle.queue.map((submission, index) => ({
			...submission,
			position: index + 1,
			estimatedWait: formatWaitTime(calculateEstimatedWaitTime(index + 1)),
		}))
	);

	// Handle submission
	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!selectedArtworkId || ctx.isSubmitting) return;

		ctx.isSubmitting = true;
		try {
			// Note: In real implementation, artwork would be fetched/passed
			await handlers.onSubmit?.(
				circle,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				{ id: selectedArtworkId } as any,
				feedbackRequested || undefined
			);
			feedbackRequested = '';
			selectedArtworkId = '';
		} finally {
			ctx.isSubmitting = false;
		}
	}
</script>

{#if config.showQueue}
	<div class={`critique-queue ${className}`}>
		<h3 class="critique-queue__title">Critique Queue</h3>

		<!-- Submission form -->
		{#if userCanSubmit}
			<form class="critique-queue__form" onsubmit={handleSubmit}>
				<div class="critique-queue__field">
					<label for="artwork-select">Select Artwork</label>
					<select id="artwork-select" bind:value={selectedArtworkId} required>
						<option value="">Choose artwork...</option>
						<!-- Artwork options would be populated from user's portfolio -->
					</select>
				</div>

				<div class="critique-queue__field">
					<label for="feedback-requested">What feedback are you looking for? (optional)</label>
					<textarea
						id="feedback-requested"
						bind:value={feedbackRequested}
						placeholder="e.g., Color harmony, composition, technique..."
						rows="3"
					></textarea>
				</div>

				<button
					type="submit"
					class="critique-queue__submit"
					disabled={!selectedArtworkId || ctx.isSubmitting}
				>
					{ctx.isSubmitting ? 'Submitting...' : 'Submit for Critique'}
				</button>
			</form>
		{/if}

		<!-- Queue list -->
		<div class="critique-queue__list" role="list" aria-label="Critique queue">
			{#if queueWithTimes.length === 0}
				<p class="critique-queue__empty">No artworks in queue. Be the first to submit!</p>
			{:else}
				{#each queueWithTimes as item (item.id)}
					<article class="critique-queue__item" role="listitem">
						<div class="critique-queue__position">#{item.position}</div>
						<div class="critique-queue__artwork">
							<img
								src={item.artwork.thumbnailUrl || ''}
								alt={item.artwork.title}
								class="critique-queue__thumbnail"
							/>
							<div class="critique-queue__details">
								<span class="critique-queue__artwork-title">{item.artwork.title}</span>
								<span class="critique-queue__artist">by {item.artwork.artistName || 'Unknown'}</span
								>
							</div>
						</div>
						<div class="critique-queue__wait">
							<span class="critique-queue__wait-label">Est. wait:</span>
							<span class="critique-queue__wait-time">{item.estimatedWait}</span>
						</div>
					</article>
				{/each}
			{/if}
		</div>

		<!-- User's queue status -->
		{#if ctx.queue.userPosition !== null}
			<div class="critique-queue__status" role="status">
				<p>Your position: <strong>#{ctx.queue.userPosition}</strong></p>
				{#if ctx.queue.estimatedWaitTime !== null}
					<p>Estimated wait: <strong>{formatWaitTime(ctx.queue.estimatedWaitTime)}</strong></p>
				{/if}
				{#if ctx.queue.hasPriority}
					<span class="critique-queue__priority-badge">Priority Queue</span>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.critique-queue {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.critique-queue__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.critique-queue__form {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
		padding-bottom: var(--gr-spacing-scale-5);
		border-bottom: 1px solid var(--gr-color-gray-700);
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.critique-queue__field {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.critique-queue__field label {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-300);
	}

	.critique-queue__field select,
	.critique-queue__field textarea {
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-font-size-base);
	}

	.critique-queue__field textarea {
		resize: vertical;
		min-height: 80px;
	}

	.critique-queue__submit {
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-5);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: background 0.2s;
	}

	.critique-queue__submit:hover:not(:disabled) {
		background: var(--gr-color-primary-700);
	}

	.critique-queue__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.critique-queue__list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.critique-queue__empty {
		text-align: center;
		color: var(--gr-color-gray-400);
		padding: var(--gr-spacing-scale-6);
	}

	.critique-queue__item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.critique-queue__position {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-bold);
		color: var(--gr-color-primary-400);
		min-width: 40px;
	}

	.critique-queue__artwork {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		flex: 1;
	}

	.critique-queue__thumbnail {
		width: 48px;
		height: 48px;
		object-fit: cover;
		border-radius: var(--gr-radius-sm);
	}

	.critique-queue__details {
		display: flex;
		flex-direction: column;
	}

	.critique-queue__artwork-title {
		font-weight: var(--gr-font-weight-medium);
	}

	.critique-queue__artist {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.critique-queue__wait {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		font-size: var(--gr-font-size-sm);
	}

	.critique-queue__wait-label {
		color: var(--gr-color-gray-400);
	}

	.critique-queue__wait-time {
		font-weight: var(--gr-font-weight-medium);
	}

	.critique-queue__status {
		margin-top: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-900);
		border-radius: var(--gr-radius-md);
	}

	.critique-queue__status p {
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.critique-queue__priority-badge {
		display: inline-block;
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-warning-600);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
		font-weight: var(--gr-font-weight-medium);
	}

	@media (prefers-reduced-motion: reduce) {
		.critique-queue__submit {
			transition: none;
		}
	}
</style>
