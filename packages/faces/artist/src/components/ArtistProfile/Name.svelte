<!--
ArtistProfile.Name - Display name with verification badge

Features:
- Display name with verification badge
- Username/handle display
- Link to profile URL
- Semantic heading structure

@component
@example
```svelte
<ArtistProfile.Name level={1} showUsername />
```
-->

<script lang="ts">
	import { getArtistProfileContext } from './context.js';

	interface Props {
		/**
		 * Heading level for semantic HTML
		 */
		level?: 1 | 2 | 3 | 4 | 5 | 6;

		/**
		 * Show username below display name
		 */
		showUsername?: boolean;

		/**
		 * Link to profile
		 */
		linkToProfile?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		level = 1,
		showUsername = true,
		linkToProfile = false,
		class: className = '',
	}: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist } = ctx;
</script>

<div class={`profile-name ${className}`}>
	{#if linkToProfile}
		<a href={artist.profileUrl} class="profile-name__link">
			<svelte:element this={`h${level}`} class="profile-name__display">
				{artist.displayName}
				{#if artist.verified}
					<span
						class="profile-name__verified"
						role="img"
						title="Verified Artist"
						aria-label="Verified"
					>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path
								d="M10 0L12.5 2.5L16 2L16.5 5.5L19.5 7L18 10L19.5 13L16.5 14.5L16 18L12.5 17.5L10 20L7.5 17.5L4 18L3.5 14.5L0.5 13L2 10L0.5 7L3.5 5.5L4 2L7.5 2.5L10 0Z"
								fill="var(--gr-color-primary-500)"
							/>
							<path
								d="M7 10L9 12L13 8"
								stroke="white"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				{/if}
			</svelte:element>
		</a>
	{:else}
		<svelte:element this={`h${level}`} class="profile-name__display">
			{artist.displayName}
			{#if artist.verified}
				<span
					class="profile-name__verified"
					role="img"
					title="Verified Artist"
					aria-label="Verified"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path
							d="M10 0L12.5 2.5L16 2L16.5 5.5L19.5 7L18 10L19.5 13L16.5 14.5L16 18L12.5 17.5L10 20L7.5 17.5L4 18L3.5 14.5L0.5 13L2 10L0.5 7L3.5 5.5L4 2L7.5 2.5L10 0Z"
							fill="var(--gr-color-primary-500)"
						/>
						<path
							d="M7 10L9 12L13 8"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			{/if}
		</svelte:element>
	{/if}

	{#if showUsername}
		<p class="profile-name__username">@{artist.username}</p>
	{/if}
</div>

<style>
	.profile-name {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.profile-name__link {
		text-decoration: none;
		color: inherit;
	}

	.profile-name__link:hover .profile-name__display {
		color: var(--gr-color-primary-400);
	}

	.profile-name__display {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin: 0;
		font-size: var(--gr-font-size-2xl);
		font-weight: var(--gr-font-weight-bold);
		color: var(--gr-color-gray-100);
		transition: color 0.2s;
	}

	.profile-name__verified {
		display: inline-flex;
		flex-shrink: 0;
	}

	.profile-name__username {
		margin: 0;
		font-size: var(--gr-font-size-md);
		color: var(--gr-color-gray-400);
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.profile-name__display {
			transition: none;
		}
	}
</style>
