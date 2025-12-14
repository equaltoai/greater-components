<!--
WorkInProgress.VersionCard - Individual version display with notes

@component
-->

<script lang="ts">
	import { getWIPContext } from './context.js';
	import type { WIPUpdate } from '../../../types/creative-tools.js';

	interface Props {
		/**
		 * Update to display (defaults to current selected)
		 */
		update?: WIPUpdate;

		/**
		 * Show reactions
		 */
		showReactions?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { update, showReactions = true, class: className = '' }: Props = $props();

	const ctx = getWIPContext();
	const { thread, handlers } = ctx;

	// Use provided update or current selected
	const displayUpdate = $derived(
		update || ctx.selectedUpdate || thread.updates[ctx.currentVersionIndex]
	);

	// Get primary image
	const primaryImage = $derived(() => {
		const imageMedia = displayUpdate?.media?.find((m) => m.type === 'image');
		return imageMedia?.url || null;
	});

	// Format date
	const formattedDate = $derived(() => {
		if (!displayUpdate) return '';
		return new Date(displayUpdate.createdAt).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		});
	});

	// Handle like
	async function handleLike() {
		if (displayUpdate) {
			await handlers.onLikeUpdate?.(thread, displayUpdate.id);
		}
	}
</script>

{#if displayUpdate}
	<article class={`wip-version-card ${className}`}>
		<!-- Image -->
		{#if primaryImage()}
			<div class="wip-version-card__image">
				<img src={primaryImage()} alt={displayUpdate.content || 'Version update'} />
			</div>
		{/if}

		<!-- Content -->
		<div class="wip-version-card__content">
			{#if displayUpdate.progress !== undefined}
				<div class="wip-version-card__progress">
					<div
						class="wip-version-card__progress-bar"
						style="width: {displayUpdate.progress}%"
					></div>
					<span class="wip-version-card__progress-text">{displayUpdate.progress}% complete</span>
				</div>
			{/if}

			<p class="wip-version-card__commentary">{displayUpdate.content}</p>

			<time
				class="wip-version-card__date"
				datetime={new Date(displayUpdate.createdAt).toISOString()}
			>
				{formattedDate()}
			</time>

			{#if showReactions}
				<div class="wip-version-card__reactions">
					<button
						type="button"
						class="wip-version-card__reaction"
						onclick={handleLike}
						aria-label="Like this update"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span>{displayUpdate.likeCount || 0}</span>
					</button>
					<button type="button" class="wip-version-card__reaction" aria-label="View comments">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
							<path
								d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span>{displayUpdate.commentCount || 0}</span>
					</button>
				</div>
			{/if}
		</div>
	</article>
{/if}

<style>
	.wip-version-card {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.wip-version-card__image {
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.wip-version-card__image img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: var(--gr-color-gray-900);
	}

	.wip-version-card__content {
		padding: var(--gr-spacing-scale-4);
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.wip-version-card__progress {
		position: relative;
		height: 8px;
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-full);
		overflow: hidden;
	}

	.wip-version-card__progress-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--gr-color-primary-500);
		transition: width 0.3s ease;
	}

	.wip-version-card__progress-text {
		position: absolute;
		right: 0;
		top: 12px;
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	.wip-version-card__commentary {
		font-size: var(--gr-font-size-base);
		line-height: 1.6;
		color: var(--gr-color-gray-200);
		margin: 0;
	}

	.wip-version-card__date {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.wip-version-card__reactions {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		padding-top: var(--gr-spacing-scale-3);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.wip-version-card__reaction {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: none;
		border: none;
		color: var(--gr-color-gray-400);
		cursor: pointer;
		transition: color 0.2s;
	}

	.wip-version-card__reaction:hover {
		color: var(--gr-color-gray-100);
	}

	.wip-version-card__reaction svg {
		width: 20px;
		height: 20px;
	}

	@media (prefers-reduced-motion: reduce) {
		.wip-version-card__progress-bar,
		.wip-version-card__reaction {
			transition: none;
		}
	}
</style>
