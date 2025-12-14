<!--
Artwork.Attribution - Artist attribution display component

Displays artist name, avatar, and link to profile.
REQ-PHIL-003: Prominent but doesn't compete with artwork.

@component
@example
```svelte
<Artwork.Root artwork={artworkData}>
  <Artwork.Attribution showAvatar linkToProfile />
</Artwork.Root>
```
-->

<script lang="ts">
	import { getArtworkContext } from './context.js';

	interface Props {
		/**
		 * Show artist avatar
		 */
		showAvatar?: boolean;

		/**
		 * Link to artist profile
		 */
		linkToProfile?: boolean;

		/**
		 * Base URL for profile links
		 */
		profileBaseUrl?: string;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		showAvatar = true,
		linkToProfile = true,
		profileBaseUrl = '/artist',
		class: className = '',
	}: Props = $props();

	const context = getArtworkContext();
	const { artwork, handlers } = context;
	const { artist } = artwork;

	// Profile URL
	const profileUrl = $derived(`${profileBaseUrl}/${artist.username}`);

	// Handle artist click
	function handleArtistClick(e: MouseEvent) {
		if (handlers.onArtistClick) {
			e.preventDefault();
			handlers.onArtistClick(artist.id);
		}
	}

	// Compute CSS classes
	const attributionClass = $derived(
		['gr-artist-artwork-attribution', className].filter(Boolean).join(' ')
	);
</script>

<div class={attributionClass}>
	{#if showAvatar}
		<div class="gr-artist-artwork-attribution-avatar">
			{#if artist.avatar}
				<img src={artist.avatar} alt="" aria-hidden="true" loading="lazy" />
			{:else}
				<span class="gr-artist-artwork-attribution-avatar-fallback" aria-hidden="true">
					{artist.name.charAt(0).toUpperCase()}
				</span>
			{/if}
		</div>
	{/if}

	<div class="gr-artist-artwork-attribution-info">
		{#if linkToProfile}
			<a href={profileUrl} class="gr-artist-artwork-attribution-name" onclick={handleArtistClick}>
				{artist.name}
				{#if artist.verified}
					<svg
						class="gr-artist-artwork-attribution-verified"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-label="Verified artist"
					>
						<path
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
						/>
					</svg>
				{/if}
			</a>
		{:else}
			<span class="gr-artist-artwork-attribution-name">
				{artist.name}
				{#if artist.verified}
					<svg
						class="gr-artist-artwork-attribution-verified"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-label="Verified artist"
					>
						<path
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
						/>
					</svg>
				{/if}
			</span>
		{/if}
		<span class="gr-artist-artwork-attribution-username">@{artist.username}</span>
	</div>
</div>

<style>
	.gr-artist-artwork-attribution {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
	}

	.gr-artist-artwork-attribution-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
		background: var(--gr-artist-bg-elevated, var(--gr-color-gray-850));
	}

	.gr-artist-artwork-attribution-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.gr-artist-artwork-attribution-avatar-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: 600;
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
	}

	.gr-artist-artwork-attribution-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.gr-artist-artwork-attribution-name {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: 500;
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
		text-decoration: none;
		transition: color var(--gr-artist-transition-hover, 200ms ease-out);
	}

	a.gr-artist-artwork-attribution-name:hover,
	a.gr-artist-artwork-attribution-name:focus {
		color: var(--gr-artist-accent-hover, var(--gr-color-gray-300));
	}

	a.gr-artist-artwork-attribution-name:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
		border-radius: var(--gr-radii-sm);
	}

	.gr-artist-artwork-attribution-verified {
		width: 14px;
		height: 14px;
		color: var(--gr-color-primary-500);
	}

	.gr-artist-artwork-attribution-username {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-attribution-name {
			transition: none;
		}
	}
</style>
