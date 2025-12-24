<!--
ArtistProfile.Badges - Professional badges container

Features:
- Container for professional badges
- Uses ArtistBadge component
- Tooltip explanations
- Color-coded but accessible (REQ-A11Y-006)

@component
@example
```svelte
<ArtistProfile.Badges />
```
-->

<script lang="ts">
	import { getArtistProfileContext } from './context.js';
	import ArtistBadge from '../ArtistBadge.svelte';

	interface Props {
		/**
		 * Badge size
		 */
		size?: 'sm' | 'md';

		/**
		 * Maximum badges to show (rest in overflow)
		 */
		maxVisible?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { size = 'md', maxVisible = 5, class: className = '' }: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist } = ctx;

	// Split badges into visible and overflow
	const visibleBadges = $derived(artist.badges.slice(0, maxVisible));
	const overflowBadges = $derived(artist.badges.slice(maxVisible));
	const hasOverflow = $derived(overflowBadges.length > 0);

	// Overflow tooltip state
	let showOverflow = $state(false);
</script>

{#if artist.badges.length > 0}
	<div class={`profile-badges ${className}`} role="list" aria-label="Professional badges">
		{#each visibleBadges as badge (badge.type)}
			<div role="listitem">
				<ArtistBadge type={badge.type} tooltip={badge.tooltip} {size} />
			</div>
		{/each}

		{#if hasOverflow}
			<div class="profile-badges__overflow" role="listitem">
				<button
					class="profile-badges__overflow-button"
					aria-expanded={showOverflow}
					aria-haspopup="true"
					onclick={() => {
						showOverflow = !showOverflow;
					}}
				>
					+{overflowBadges.length}
				</button>

				{#if showOverflow}
					<div class="profile-badges__overflow-menu" role="menu">
						{#each overflowBadges as badge (badge.type)}
							<div role="menuitem">
								<ArtistBadge type={badge.type} tooltip={badge.tooltip} {size} />
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.profile-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		align-items: center;
	}

	.profile-badges__overflow {
		position: relative;
	}

	.profile-badges__overflow-button {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 32px;
		height: 24px;
		padding: 0 var(--gr-spacing-scale-2);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radii-full);
		background: var(--gr-color-gray-800);
		color: var(--gr-color-gray-300);
		font-size: var(--gr-font-size-sm);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.profile-badges__overflow-button:hover {
		background: var(--gr-color-gray-700);
		border-color: var(--gr-color-gray-500);
	}

	.profile-badges__overflow-button:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.profile-badges__overflow-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		box-shadow: var(--gr-shadow-lg);
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		z-index: 10;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.profile-badges__overflow-button {
			transition: none;
		}
	}
</style>
