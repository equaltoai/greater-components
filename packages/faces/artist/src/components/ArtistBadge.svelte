<!--
ArtistBadge - Professional verification/credential badge

Features:
- Distinct icons for each badge type
- Tooltip with explanation
- Color-coded but accessible (REQ-A11Y-006)

@component
@example
```svelte
<ArtistBadge type="verified" tooltip="Verified artist" size="md" />
```
-->

<script lang="ts">
	import type { BadgeType } from './ArtistProfile/context.js';

	interface Props {
		/**
		 * Badge type
		 */
		type: BadgeType;

		/**
		 * Tooltip explanation
		 */
		tooltip?: string;

		/**
		 * Badge size
		 */
		size?: 'sm' | 'md';

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { type, tooltip, size = 'md', class: className = '' }: Props = $props();

	// Badge configurations
	const badgeConfig: Record<
		BadgeType,
		{ label: string; color: string; icon: string; defaultTooltip: string }
	> = {
		verified: {
			label: 'Verified',
			color: 'var(--gr-color-primary-500)',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
			defaultTooltip: 'Verified artist identity',
		},
		educator: {
			label: 'Educator',
			color: 'var(--gr-color-success-500)',
			icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
			defaultTooltip: 'Art educator or instructor',
		},
		institution: {
			label: 'Institution',
			color: 'var(--gr-color-warning-500)',
			icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
			defaultTooltip: 'Verified institution or gallery',
		},
		mentor: {
			label: 'Mentor',
			color: 'var(--gr-color-info-500)',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
			defaultTooltip: 'Active mentor in the community',
		},
		curator: {
			label: 'Curator',
			color: 'var(--gr-color-secondary-500)',
			icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
			defaultTooltip: 'Recognized curator',
		},
	};

	const config = $derived(badgeConfig[type]);
	const tooltipText = $derived(tooltip || config.defaultTooltip);

	// Tooltip state
	let showTooltip = $state(false);

	// Size values
	const sizeValues = {
		sm: { badge: 20, icon: 12 },
		md: { badge: 24, icon: 14 },
	};
</script>

<button
	class={`artist-badge artist-badge--${type} artist-badge--${size} ${className}`}
	style:--badge-color={config.color}
	style:--badge-size={`${sizeValues[size].badge}px`}
	style:--icon-size={`${sizeValues[size].icon}px`}
	aria-label={`${config.label}: ${tooltipText}`}
	onmouseenter={() => {
		showTooltip = true;
	}}
	onmouseleave={() => {
		showTooltip = false;
	}}
	onfocus={() => {
		showTooltip = true;
	}}
	onblur={() => {
		showTooltip = false;
	}}
>
	<svg
		width={sizeValues[size].icon}
		height={sizeValues[size].icon}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d={config.icon} />
	</svg>

	{#if showTooltip}
		<span class="artist-badge__tooltip" role="tooltip">
			<strong>{config.label}</strong>
			<span>{tooltipText}</span>
		</span>
	{/if}
</button>

<style>
	.artist-badge {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--badge-size);
		height: var(--badge-size);
		border-radius: 50%;
		background: var(--badge-color);
		color: white;
		cursor: help;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		appearance: none;
	}

	.artist-badge:focus {
		outline: 2px solid var(--badge-color);
		outline-offset: 2px;
	}

	.artist-badge__tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		box-shadow: var(--gr-shadow-lg);
		white-space: nowrap;
		z-index: 100;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.artist-badge__tooltip strong {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.artist-badge__tooltip span {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	/* Tooltip arrow */
	.artist-badge__tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: var(--gr-color-gray-800);
	}
</style>
