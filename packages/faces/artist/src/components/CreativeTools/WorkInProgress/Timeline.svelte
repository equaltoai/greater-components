<!--
WorkInProgress.Timeline - Visual progress timeline

@component
-->

<script lang="ts">
	import { getWIPContext, navigateToVersion, formatTimeBetweenVersions } from './context.js';

	interface Props {
		/**
		 * Show time between versions
		 */
		showTimeBetween?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { showTimeBetween = true, class: className = '' }: Props = $props();

	const ctx = getWIPContext();
	const { thread, config } = ctx;

	// Handle milestone click
	function handleMilestoneClick(index: number) {
		navigateToVersion(ctx, index);
	}
</script>

{#if config.showTimeline}
	<div class={`wip-timeline ${className}`} role="navigation" aria-label="Progress timeline">
		<div class="wip-timeline__track">
			<div
				class="wip-timeline__progress"
				style="width: {thread.currentProgress}%"
				role="progressbar"
				aria-valuenow={thread.currentProgress}
				aria-valuemin={0}
				aria-valuemax={100}
			></div>
		</div>

		<div class="wip-timeline__milestones">
			{#each thread.updates as update, index (update.id)}
				{@const position =
					thread.updates.length > 1 ? (index / (thread.updates.length - 1)) * 100 : 50}
				<button
					type="button"
					class="wip-timeline__milestone"
					class:active={ctx.currentVersionIndex === index}
					class:current={index === thread.updates.length - 1}
					style="left: {position}%"
					onclick={() => handleMilestoneClick(index)}
					aria-label={`Version ${index + 1}, ${update.progress || 0}% complete`}
					aria-current={ctx.currentVersionIndex === index ? 'step' : undefined}
				>
					<span class="wip-timeline__milestone-dot"></span>
					<span class="wip-timeline__milestone-label">v{index + 1}</span>
					{#if update.progress !== undefined}
						<span class="wip-timeline__milestone-progress">{update.progress}%</span>
					{/if}
				</button>

				{#if showTimeBetween && index < thread.updates.length - 1}
					{@const nextUpdate = thread.updates[index + 1]}
					<span
						class="wip-timeline__time-between"
						style="left: {position + ((1 / (thread.updates.length - 1)) * 100) / 2}%"
					>
						{formatTimeBetweenVersions(update, nextUpdate)}
					</span>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style>
	.wip-timeline {
		position: relative;
		padding: var(--gr-spacing-scale-8) var(--gr-spacing-scale-4);
	}

	.wip-timeline__track {
		position: relative;
		height: 4px;
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-full);
	}

	.wip-timeline__progress {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--gr-color-primary-500);
		border-radius: var(--gr-radius-full);
		transition: width 0.3s ease;
	}

	.wip-timeline__milestones {
		position: relative;
		height: 60px;
	}

	.wip-timeline__milestone {
		position: absolute;
		top: -8px;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
	}

	.wip-timeline__milestone-dot {
		width: 16px;
		height: 16px;
		background: var(--gr-color-gray-600);
		border: 3px solid var(--gr-color-gray-800);
		border-radius: var(--gr-radius-full);
		transition:
			background 0.2s,
			transform 0.2s;
	}

	.wip-timeline__milestone:hover .wip-timeline__milestone-dot {
		transform: scale(1.2);
	}

	.wip-timeline__milestone.active .wip-timeline__milestone-dot {
		background: var(--gr-color-primary-500);
		border-color: var(--gr-color-primary-300);
	}

	.wip-timeline__milestone.current .wip-timeline__milestone-dot {
		background: var(--gr-color-success-500);
	}

	.wip-timeline__milestone-label {
		font-size: var(--gr-font-size-xs);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-300);
	}

	.wip-timeline__milestone-progress {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-500);
	}

	.wip-timeline__time-between {
		position: absolute;
		top: 24px;
		transform: translateX(-50%);
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-500);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.wip-timeline__progress,
		.wip-timeline__milestone-dot {
			transition: none;
		}
	}
</style>
