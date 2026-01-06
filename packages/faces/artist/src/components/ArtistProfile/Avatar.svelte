<!--
ArtistProfile.Avatar - Artist avatar with status indicator

Features:
- Online/offline/busy/away status indicator
- Fallback to initials when no image
- Click to view full size
- Accessible with proper alt text

@component
@example
```svelte
<ArtistProfile.Avatar size="lg" showStatus />
```
-->

<script lang="ts">
	import { getArtistProfileContext, getInitials, type ArtistStatus } from './context.js';

	interface Props {
		/**
		 * Avatar size
		 */
		size?: 'sm' | 'md' | 'lg' | 'xl';

		/**
		 * Show status indicator
		 */
		showStatus?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { size = 'lg', showStatus = true, class: className = '' }: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist, handlers } = ctx;

	// Status labels for accessibility
	const statusLabels: Record<ArtistStatus, string> = {
		online: 'Online',
		offline: 'Offline',
		busy: 'Busy',
		away: 'Away',
	};

	// Image load error state
	let imageError = $state(false);

	// Initials fallback
	const initials = $derived(getInitials(artist.displayName));

	// Handle click
	function handleClick() {
		handlers.onAvatarClick?.();
	}

	// Handle keyboard
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}
</script>

<div class={`avatar avatar--${size} ${className}`}>
	<button
		class="avatar__button"
		onclick={handleClick}
		onkeydown={handleKeydown}
		aria-label={`View ${artist.displayName}'s avatar${showStatus ? `, ${statusLabels[artist.status]}` : ''}`}
		type="button"
	>
		{#if artist.avatar && !imageError}
			<img
				src={artist.avatar}
				alt=""
				class="avatar__image"
				loading="lazy"
				onerror={() => {
					imageError = true;
				}}
			/>
		{:else}
			<div class="avatar__initials" aria-hidden="true">
				{initials}
			</div>
		{/if}
	</button>

	{#if showStatus}
		<span
			class={`avatar__status avatar__status--${artist.status}`}
			title={statusLabels[artist.status]}
			aria-hidden="true"
		></span>
	{/if}
</div>

<style>
	.avatar {
		position: relative;
		width: var(--avatar-size);
		height: var(--avatar-size);
		flex-shrink: 0;
	}

	.avatar--sm {
		--avatar-size: 40px;
	}

	.avatar--md {
		--avatar-size: 64px;
	}

	.avatar--lg {
		--avatar-size: 96px;
	}

	.avatar--xl {
		--avatar-size: 128px;
	}

	.avatar__button {
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		border-radius: 50%;
		overflow: hidden;
		cursor: pointer;
		background: var(--gr-color-gray-700);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.avatar__button:hover {
		transform: scale(1.05);
		box-shadow: var(--gr-shadow-lg);
	}

	.avatar__button:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.avatar__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar__initials {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: calc(var(--avatar-size) * 0.4);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
		background: linear-gradient(135deg, var(--gr-color-primary-600), var(--gr-color-primary-800));
	}

	.avatar__status {
		position: absolute;
		bottom: 2px;
		right: 2px;
		width: calc(var(--avatar-size) * 0.25);
		height: calc(var(--avatar-size) * 0.25);
		min-width: 12px;
		min-height: 12px;
		border-radius: 50%;
		border: 2px solid var(--gr-color-gray-900);
	}

	.avatar__status--online {
		background: var(--gr-color-success-500);
	}

	.avatar__status--offline {
		background: var(--gr-color-gray-500);
	}

	.avatar__status--busy {
		background: var(--gr-color-error-500);
	}

	.avatar__status--away {
		background: var(--gr-color-warning-500);
	}

	/* Size variants */
	.avatar--sm .avatar__status {
		width: 10px;
		height: 10px;
		min-width: 10px;
		min-height: 10px;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.avatar__button {
			transition: none;
		}
	}
</style>
