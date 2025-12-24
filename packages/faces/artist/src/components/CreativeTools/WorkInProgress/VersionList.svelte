<!--
WorkInProgress.VersionList - Chronological version display

@component
-->

<script lang="ts">
	import { getWIPContext, navigateToVersion } from './context.js';
	import type { WIPUpdate } from '../../../types/creative-tools.js';

	interface Props {
		/**
		 * Layout direction
		 */
		direction?: 'horizontal' | 'vertical';

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { direction = 'horizontal', class: className = '' }: Props = $props();

	const ctx = getWIPContext();
	const { thread } = ctx;

	// Format date
	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	}

	// Get thumbnail from update
	function getThumbnail(update: WIPUpdate): string | null {
		const imageMedia = update.media?.find((m) => m.type === 'image');
		return imageMedia?.thumbnailUrl || imageMedia?.url || null;
	}

	// Handle version click
	function handleVersionClick(index: number) {
		navigateToVersion(ctx, index);
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleVersionClick(index);
		}
	}
</script>

<div
	class={`wip-version-list wip-version-list--${direction} ${className}`}
	role="listbox"
	aria-label="Version history"
>
	{#each thread.updates as update, index (update.id)}
		{@const thumbnail = getThumbnail(update)}
		<button
			type="button"
			class="wip-version-list__item"
			class:selected={ctx.currentVersionIndex === index}
			role="option"
			aria-selected={ctx.currentVersionIndex === index}
			onclick={() => handleVersionClick(index)}
			onkeydown={(e) => handleKeydown(e, index)}
		>
			<div class="wip-version-list__thumbnail">
				{#if thumbnail}
					<img src={thumbnail} alt={`Version ${index + 1}`} loading="lazy" />
				{:else}
					<div class="wip-version-list__placeholder">
						<span>{index + 1}</span>
					</div>
				{/if}
			</div>
			<div class="wip-version-list__info">
				<span class="wip-version-list__number">v{index + 1}</span>
				<time class="wip-version-list__date" datetime={new Date(update.createdAt).toISOString()}>
					{formatDate(update.createdAt)}
				</time>
				{#if update.progress !== undefined}
					<span class="wip-version-list__progress">{update.progress}%</span>
				{/if}
			</div>
		</button>
	{/each}
</div>

<style>
	.wip-version-list {
		display: flex;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-4);
	}

	.wip-version-list--horizontal {
		flex-direction: row;
		overflow-x: auto;
	}

	.wip-version-list--vertical {
		flex-direction: column;
	}

	.wip-version-list__item {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border: 2px solid transparent;
		border-radius: var(--gr-radius-md);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}

	.wip-version-list__item:hover {
		background: var(--gr-color-gray-700);
	}

	.wip-version-list__item.selected {
		border-color: var(--gr-color-primary-500);
	}

	.wip-version-list__thumbnail {
		width: 80px;
		height: 80px;
		border-radius: var(--gr-radius-sm);
		overflow: hidden;
	}

	.wip-version-list__thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.wip-version-list__placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-400);
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-bold);
	}

	.wip-version-list__info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
	}

	.wip-version-list__number {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.wip-version-list__date {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	.wip-version-list__progress {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-primary-400);
	}

	@media (prefers-reduced-motion: reduce) {
		.wip-version-list__item {
			transition: none;
		}
	}
</style>
