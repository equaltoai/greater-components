<!--
Exhibition.Banner - Hero banner with title, dates, and curator attribution

Features:
- Hero image with responsive sizing
- Exhibition title and subtitle
- Date range display
- Curator attribution
- Share and save actions

@component
@example
```svelte
<Exhibition.Banner />
```
-->

<script lang="ts">
	import { getExhibitionContext, formatExhibitionDates } from './context.js';

	interface Props {
		/**
		 * Show share button
		 */
		showShare?: boolean;

		/**
		 * Show save button
		 */
		showSave?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { showShare = true, showSave = true, class: className = '' }: Props = $props();

	const ctx = getExhibitionContext();
	const { exhibition, config, handlers } = ctx;

	// Format dates
	const dateDisplay = $derived(formatExhibitionDates(exhibition));

	// Status badge text
	const statusBadge = $derived(() => {
		switch (exhibition.status) {
			case 'upcoming':
				return 'Opening Soon';
			case 'current':
				return 'Now Showing';
			case 'past':
				return 'Past Exhibition';
			case 'virtual':
				return 'Virtual Exhibition';
			case 'permanent':
				return 'Permanent Collection';
			default:
				return '';
		}
	});

	// Handle share
	async function handleShare() {
		await handlers.onShare?.(exhibition);
	}

	// Handle curator click
	function handleCuratorClick() {
		handlers.onCuratorClick?.(exhibition.curator);
	}
</script>

<header class={`exhibition-banner ${className}`}>
	<!-- Hero image -->
	<div class="exhibition-banner__hero">
		<img
			src={exhibition.bannerImage || exhibition.coverImage}
			alt={`${exhibition.title} exhibition banner`}
			class="exhibition-banner__image"
			loading="eager"
		/>
		<div class="exhibition-banner__overlay" aria-hidden="true"></div>
	</div>

	<!-- Content overlay -->
	<div class="exhibition-banner__content">
		<!-- Status badge -->
		{#if statusBadge()}
			<span class="exhibition-banner__status" data-status={exhibition.status}>
				{statusBadge()}
			</span>
		{/if}

		<!-- Title -->
		<h1 class="exhibition-banner__title">{exhibition.title}</h1>

		{#if exhibition.subtitle}
			<p class="exhibition-banner__subtitle">{exhibition.subtitle}</p>
		{/if}

		<!-- Meta information -->
		<div class="exhibition-banner__meta">
			{#if config.showDates}
				<time
					class="exhibition-banner__dates"
					datetime={new Date(exhibition.startDate).toISOString()}
				>
					{dateDisplay}
				</time>
			{/if}

			{#if config.showCurator}
				<button
					type="button"
					class="exhibition-banner__curator"
					onclick={handleCuratorClick}
					aria-label={`View curator: ${exhibition.curator.name}`}
				>
					{#if exhibition.curator.avatar}
						<img src={exhibition.curator.avatar} alt="" class="exhibition-banner__curator-avatar" />
					{/if}
					<span>Curated by <strong>{exhibition.curator.name}</strong></span>
					{#if exhibition.curator.isVerified}
						<svg
							class="exhibition-banner__verified"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-label="Verified curator"
						>
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
						</svg>
					{/if}
				</button>
			{/if}

			{#if config.showLocation && exhibition.location}
				<address class="exhibition-banner__location">
					{exhibition.location.venue}
					{#if exhibition.location.city}
						<span>, {exhibition.location.city}</span>
					{/if}
				</address>
			{/if}
		</div>

		<!-- Actions -->
		<div class="exhibition-banner__actions">
			{#if showShare}
				<button
					type="button"
					class="exhibition-banner__action"
					onclick={handleShare}
					aria-label="Share exhibition"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
						<path
							d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<polyline
							points="16,6 12,2 8,6"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<line x1="12" y1="2" x2="12" y2="15" stroke-width="2" stroke-linecap="round" />
					</svg>
					<span>Share</span>
				</button>
			{/if}

			{#if showSave}
				<button type="button" class="exhibition-banner__action" aria-label="Save exhibition">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
						<path
							d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span>Save</span>
				</button>
			{/if}

			{#if config.showArtworkCount}
				<span class="exhibition-banner__count">
					{exhibition.artworks.length}
					{exhibition.artworks.length === 1 ? 'artwork' : 'artworks'}
				</span>
			{/if}
		</div>
	</div>
</header>

<style>
	.exhibition-banner {
		position: relative;
		width: 100%;
		min-height: 400px;
		display: flex;
		align-items: flex-end;
	}

	.exhibition-banner__hero {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.exhibition-banner__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.exhibition-banner__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.8) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.2) 100%
		);
	}

	.exhibition-banner__content {
		position: relative;
		z-index: 1;
		width: 100%;
		padding: var(--gr-spacing-scale-8);
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.exhibition-banner__status {
		display: inline-flex;
		align-items: center;
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-3);
		border-radius: var(--gr-radius-full);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		width: fit-content;
	}

	.exhibition-banner__status[data-status='current'] {
		background: var(--gr-color-success-500);
		color: white;
	}

	.exhibition-banner__status[data-status='upcoming'] {
		background: var(--gr-color-warning-500);
		color: var(--gr-color-gray-900);
	}

	.exhibition-banner__status[data-status='past'] {
		background: var(--gr-color-gray-600);
		color: white;
	}

	.exhibition-banner__status[data-status='virtual'] {
		background: var(--gr-color-primary-500);
		color: white;
	}

	.exhibition-banner__title {
		font-size: var(--gr-font-size-4xl);
		font-weight: var(--gr-font-weight-bold);
		line-height: 1.1;
		color: white;
		margin: 0;
	}

	.exhibition-banner__subtitle {
		font-size: var(--gr-font-size-xl);
		color: var(--gr-color-gray-300);
		margin: 0;
	}

	.exhibition-banner__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gr-spacing-scale-4);
		color: var(--gr-color-gray-300);
	}

	.exhibition-banner__dates {
		font-size: var(--gr-font-size-base);
	}

	.exhibition-banner__curator {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		background: none;
		border: none;
		color: var(--gr-color-gray-300);
		cursor: pointer;
		padding: 0;
		font-size: var(--gr-font-size-base);
		transition: color 0.2s;
	}

	.exhibition-banner__curator:hover {
		color: white;
	}

	.exhibition-banner__curator-avatar {
		width: 24px;
		height: 24px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.exhibition-banner__curator strong {
		font-weight: var(--gr-font-weight-semibold);
	}

	.exhibition-banner__verified {
		width: 16px;
		height: 16px;
		color: var(--gr-color-primary-400);
	}

	.exhibition-banner__location {
		font-style: normal;
		font-size: var(--gr-font-size-base);
	}

	.exhibition-banner__actions {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-4);
		margin-top: var(--gr-spacing-scale-2);
	}

	.exhibition-banner__action {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: var(--gr-radius-md);
		color: white;
		font-size: var(--gr-font-size-sm);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.exhibition-banner__action:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.exhibition-banner__action svg {
		width: 18px;
		height: 18px;
	}

	.exhibition-banner__count {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	@media (max-width: 768px) {
		.exhibition-banner {
			min-height: 300px;
		}

		.exhibition-banner__content {
			padding: var(--gr-spacing-scale-4);
		}

		.exhibition-banner__title {
			font-size: var(--gr-font-size-2xl);
		}

		.exhibition-banner__subtitle {
			font-size: var(--gr-font-size-base);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.exhibition-banner__curator,
		.exhibition-banner__action {
			transition: none;
		}
	}
</style>
