<!--
CritiqueCircle.Session - Active critique session display

@component
-->

<script lang="ts">
	import { getCritiqueCircleContext, canCritique } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCritiqueCircleContext();
	const { config, handlers, session } = ctx;

	// Feedback form state
	let feedbackSummary = $state('');
	let isAnonymous = $state(false);
	let isSubmittingFeedback = $state(false);

	// Check if user can give critique
	const userCanCritique = $derived(canCritique(ctx));

	// Format time remaining
	const formattedTimeRemaining = $derived(() => {
		if (session.timeRemaining === null) return null;
		const minutes = Math.floor(session.timeRemaining / 60);
		const seconds = session.timeRemaining % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	});

	// Handle feedback submission
	async function handleSubmitFeedback(event: Event) {
		event.preventDefault();
		if (!session.currentSubmission || !feedbackSummary.trim() || isSubmittingFeedback) return;

		isSubmittingFeedback = true;
		try {
			await handlers.onCritique?.(session.currentSubmission, [], feedbackSummary);
			feedbackSummary = '';
		} finally {
			isSubmittingFeedback = false;
		}
	}
</script>

{#if config.showSession}
	<div class={`critique-session ${className}`}>
		<h3 class="critique-session__title">Active Session</h3>

		{#if session.isActive && session.currentSubmission}
			<div class="critique-session__active">
				<!-- Artwork being critiqued -->
				<div class="critique-session__artwork">
					<img
						src={session.currentSubmission.artwork.imageUrl}
						alt={session.currentSubmission.artwork.title}
						class="critique-session__image"
					/>
					<div class="critique-session__artwork-info">
						<h4 class="critique-session__artwork-title">
							{session.currentSubmission.artwork.title}
						</h4>
						<p class="critique-session__artwork-artist">
							by {session.currentSubmission.artwork.artistName || 'Unknown Artist'}
						</p>
					</div>
				</div>

				<!-- Feedback requested -->
				{#if session.currentSubmission.feedbackRequested}
					<div class="critique-session__feedback-requested">
						<h5>Feedback Requested:</h5>
						<p>{session.currentSubmission.feedbackRequested}</p>
					</div>
				{/if}

				<!-- Timer -->
				{#if formattedTimeRemaining()}
					<div class="critique-session__timer" role="timer" aria-live="polite">
						<span class="critique-session__timer-label">Time Remaining:</span>
						<span class="critique-session__timer-value">{formattedTimeRemaining()}</span>
					</div>
				{/if}

				<!-- Feedback form -->
				{#if userCanCritique && session.canGiveFeedback}
					<form class="critique-session__form" onsubmit={handleSubmitFeedback}>
						<div class="critique-session__field">
							<label for="feedback-summary">Your Feedback</label>
							<textarea
								id="feedback-summary"
								bind:value={feedbackSummary}
								placeholder="Share your constructive feedback..."
								rows="4"
								required
							></textarea>
						</div>

						{#if config.enableAnonymousFeedback}
							<label class="critique-session__anonymous">
								<input type="checkbox" bind:checked={isAnonymous} />
								<span>Submit anonymously</span>
							</label>
						{/if}

						<button
							type="submit"
							class="critique-session__submit"
							disabled={!feedbackSummary.trim() || isSubmittingFeedback}
						>
							{isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
						</button>
					</form>
				{/if}

				<!-- Existing critiques -->
				{#if session.currentSubmission.critiques.length > 0}
					<div class="critique-session__critiques">
						<h5>Feedback Received ({session.currentSubmission.critiques.length})</h5>
						{#each session.currentSubmission.critiques as critique (critique.createdAt)}
							<div class="critique-session__critique">
								<div class="critique-session__critique-header">
									<span class="critique-session__critique-author">{critique.authorName}</span>
									<time class="critique-session__critique-date">
										{new Date(critique.createdAt).toLocaleDateString()}
									</time>
								</div>
								<p class="critique-session__critique-summary">{critique.summary}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="critique-session__empty">
				<p>No active critique session.</p>
				<p class="critique-session__empty-hint">
					Sessions start when an artwork from the queue is selected for critique.
				</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	.critique-session {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.critique-session__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.critique-session__active {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-5);
	}

	.critique-session__artwork {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.critique-session__image {
		width: 100%;
		max-height: 400px;
		object-fit: contain;
		background: var(--gr-color-gray-900);
		border-radius: var(--gr-radius-md);
	}

	.critique-session__artwork-info {
		text-align: center;
	}

	.critique-session__artwork-title {
		font-size: var(--gr-font-size-xl);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0;
	}

	.critique-session__artwork-artist {
		color: var(--gr-color-gray-400);
		margin: var(--gr-spacing-scale-1) 0 0 0;
	}

	.critique-session__feedback-requested {
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-900);
		border-radius: var(--gr-radius-md);
	}

	.critique-session__feedback-requested h5 {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-primary-300);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.critique-session__feedback-requested p {
		margin: 0;
		color: var(--gr-color-gray-200);
	}

	.critique-session__timer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.critique-session__timer-label {
		color: var(--gr-color-gray-400);
	}

	.critique-session__timer-value {
		font-size: var(--gr-font-size-2xl);
		font-weight: var(--gr-font-weight-bold);
		font-family: var(--gr-font-mono);
	}

	.critique-session__form {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.critique-session__field {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.critique-session__field label {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-300);
	}

	.critique-session__field textarea {
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-font-size-base);
		resize: vertical;
		min-height: 100px;
	}

	.critique-session__anonymous {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
		cursor: pointer;
	}

	.critique-session__submit {
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-5);
		background: var(--gr-color-success-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: background 0.2s;
	}

	.critique-session__submit:hover:not(:disabled) {
		background: var(--gr-color-success-700);
	}

	.critique-session__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.critique-session__critiques {
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.critique-session__critiques h5 {
		font-size: var(--gr-font-size-base);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0 0 var(--gr-spacing-scale-3) 0;
	}

	.critique-session__critique {
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
		margin-bottom: var(--gr-spacing-scale-3);
	}

	.critique-session__critique-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.critique-session__critique-author {
		font-weight: var(--gr-font-weight-medium);
	}

	.critique-session__critique-date {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.critique-session__critique-summary {
		margin: 0;
		color: var(--gr-color-gray-200);
		line-height: 1.6;
	}

	.critique-session__empty {
		text-align: center;
		padding: var(--gr-spacing-scale-8);
		color: var(--gr-color-gray-400);
	}

	.critique-session__empty p {
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.critique-session__empty-hint {
		font-size: var(--gr-font-size-sm);
	}

	@media (prefers-reduced-motion: reduce) {
		.critique-session__submit {
			transition: none;
		}
	}
</style>
