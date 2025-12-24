<!--
ArtistProfile.Stats - Artist statistics display

Features:
- Followers, works, exhibitions, collaborations
- REQ-PHIL-008: Transparent, real metrics
- Clickable to view details

@component
@example
```svelte
<ArtistProfile.Stats clickable />
```
-->

<script lang="ts">
	import { getArtistProfileContext, formatStatNumber, type ArtistStats } from './context.js';

	interface Props {
		/**
		 * Stats to display
		 */
		show?: (keyof ArtistStats)[];

		/**
		 * Make stats clickable
		 */
		clickable?: boolean;

		/**
		 * Layout direction
		 */
		direction?: 'row' | 'column';

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		show = ['followers', 'works', 'exhibitions', 'collaborations'],
		clickable = true,
		direction = 'row',
		class: className = '',
	}: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist, handlers } = ctx;

	// Stat labels
	const statLabels: Record<keyof ArtistStats, string> = {
		followers: 'Followers',
		following: 'Following',
		works: 'Works',
		exhibitions: 'Exhibitions',
		collaborations: 'Collaborations',
		totalViews: 'Views',
	};

	// Handle stat click
	function handleStatClick(stat: keyof ArtistStats) {
		if (clickable) {
			handlers.onStatsClick?.(stat);
		}
	}
</script>

<ul class={`profile-stats profile-stats--${direction} ${className}`} aria-label="Artist statistics">
	{#each show as stat (stat)}
		{@const value = artist.stats[stat]}
		{@const label = statLabels[stat]}
		{@const formattedValue = formatStatNumber(value)}

		<li>
			{#if clickable}
				<button
					class="profile-stats__item profile-stats__item--clickable"
					onclick={() => handleStatClick(stat)}
					aria-label={`${value} ${label}`}
				>
					<span class="profile-stats__value">{formattedValue}</span>
					<span class="profile-stats__label">{label}</span>
				</button>
			{:else}
				<div class="profile-stats__item" aria-label={`${value} ${label}`} role="group">
					<span class="profile-stats__value">{formattedValue}</span>
					<span class="profile-stats__label">{label}</span>
				</div>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.profile-stats {
		display: flex;
		gap: var(--gr-spacing-scale-6);
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.profile-stats--row {
		flex-direction: row;
		flex-wrap: wrap;
	}

	.profile-stats--column {
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.profile-stats__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		text-align: center;
	}

	.profile-stats__item--clickable {
		cursor: pointer;
		transition: transform 0.2s;
	}

	.profile-stats__item--clickable:hover {
		transform: translateY(-2px);
	}

	.profile-stats__item--clickable:hover .profile-stats__value {
		color: var(--gr-color-primary-400);
	}

	.profile-stats__item--clickable:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 4px;
		border-radius: var(--gr-radii-sm);
	}

	.profile-stats__value {
		font-size: var(--gr-font-size-2xl);
		font-weight: var(--gr-font-weight-bold);
		color: var(--gr-color-gray-100);
		transition: color 0.2s;
	}

	.profile-stats__label {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.profile-stats__item--clickable {
			transition: none;
		}

		.profile-stats__value {
			transition: none;
		}
	}
</style>
