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

	const timeBetween = $derived.by(() => {
		if (!showTimeBetween || thread.updates.length < 2) return [];

		const pairs: Array<{ from: number; to: number; label: string }> = [];
		for (let i = 0; i < thread.updates.length - 1; i++) {
			const update = thread.updates[i];
			const nextUpdate = thread.updates[i + 1];
			if (!update || !nextUpdate) continue;
			pairs.push({
				from: i,
				to: i + 1,
				label: formatTimeBetweenVersions(update, nextUpdate),
			});
		}
		return pairs;
	});
</script>

{#if config.showTimeline}
	<nav class={`wip-timeline ${className}`} aria-label="Progress timeline">
		<div
			class="wip-timeline__track"
			role="progressbar"
			aria-valuenow={thread.currentProgress}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<svg
				class="wip-timeline__track-svg"
				viewBox="0 0 100 4"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<rect class="wip-timeline__track-bg" x="0" y="0" width="100" height="4" rx="2" />
				<rect
					class="wip-timeline__track-fill"
					x="0"
					y="0"
					width={thread.currentProgress}
					height="4"
					rx="2"
				/>
			</svg>
		</div>

		<div class="wip-timeline__milestones" role="list">
			{#each thread.updates as update, index (update.id)}
				<button
					type="button"
					class="wip-timeline__milestone"
					class:active={ctx.currentVersionIndex === index}
					class:current={index === thread.updates.length - 1}
					onclick={() => handleMilestoneClick(index)}
					aria-label={`Version ${index + 1}, ${update.progress || 0}% complete`}
					aria-current={ctx.currentVersionIndex === index ? 'step' : undefined}
				>
					<span class="wip-timeline__milestone-dot" aria-hidden="true"></span>
					<span class="wip-timeline__milestone-label">v{index + 1}</span>
					{#if update.progress !== undefined}
						<span class="wip-timeline__milestone-progress">{update.progress}%</span>
					{/if}
				</button>
			{/each}
		</div>

		{#if showTimeBetween && timeBetween.length > 0}
			<ol class="wip-timeline__time-between" aria-label="Time between versions">
				{#each timeBetween as item (item.from)}
					<li class="wip-timeline__time-between-item">
						v{item.from + 1} → v{item.to + 1}: {item.label}
					</li>
				{/each}
			</ol>
		{/if}
	</nav>
{/if}

<style>
	.wip-timeline {
		position: relative;
		padding: var(--gr-spacing-scale-8) var(--gr-spacing-scale-4);
	}

	.wip-timeline__track {
		position: relative;
		margin-bottom: var(--gr-spacing-scale-6);
	}

	.wip-timeline__milestones {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--gr-spacing-scale-2);
	}

	.wip-timeline__milestone {
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
		margin: var(--gr-spacing-scale-4) 0 0;
		padding: 0;
		list-style: none;
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-500);
	}

	.wip-timeline__time-between-item {
		margin: var(--gr-spacing-scale-1) 0 0;
	}

	.wip-timeline__track-svg {
		display: block;
		width: 100%;
		height: 4px;
	}

	.wip-timeline__track-bg {
		fill: var(--gr-color-gray-700);
	}

	.wip-timeline__track-fill {
		fill: var(--gr-color-primary-500);
	}

	@media (prefers-reduced-motion: reduce) {
		.wip-timeline__milestone-dot {
			transition: none;
		}
	}
</style>
