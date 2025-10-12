<!--
Status.Media - Display media attachments

Handles images, videos, audio, and GIFs with proper accessibility.

@component
@example
```svelte
<Status.Root status={post}>
  <Status.Media />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getStatusContext } from './context.js';

	interface Props {
		/**
		 * Custom media rendering
		 */
		media?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { media, class: className = '' }: Props = $props();

	const context = getStatusContext();
	const { actualStatus } = context;

	const hasMedia = $derived(
		actualStatus.mediaAttachments && actualStatus.mediaAttachments.length > 0
	);
</script>

{#if hasMedia}
	<div
		class="status-media {className}"
		class:status-media--single={actualStatus.mediaAttachments!.length === 1}
		class:status-media--multiple={actualStatus.mediaAttachments!.length > 1}
	>
		{#if media}
			{@render media()}
		{:else}
			{#each actualStatus.mediaAttachments! as attachment (attachment.id)}
				<div class="status-media__item">
					{#if attachment.type === 'image'}
						<img
							src={attachment.previewUrl || attachment.url}
							alt={attachment.description || ''}
							loading="lazy"
							class="status-media__image"
						/>
					{:else if attachment.type === 'video' || attachment.type === 'gifv'}
						<video
							src={attachment.url}
							poster={attachment.previewUrl}
							controls={attachment.type === 'video'}
							autoplay={attachment.type === 'gifv'}
							loop={attachment.type === 'gifv'}
							muted={attachment.type === 'gifv'}
							class="status-media__video"
							aria-label={attachment.description || 'Video'}
						>
							<track kind="captions" />
						</video>
					{:else if attachment.type === 'audio'}
						<audio
							src={attachment.url}
							controls
							class="status-media__audio"
							aria-label={attachment.description || 'Audio'}
						>
							<track kind="captions" />
						</audio>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
{/if}

<style>
	.status-media {
		display: grid;
		gap: var(--status-spacing-xs, 0.25rem);
		grid-template-columns: repeat(2, 1fr);
		margin: var(--status-spacing-sm, 0.5rem) 0;
		border-radius: var(--status-radius-md, 8px);
		overflow: hidden;
	}

	.status-media--single {
		grid-template-columns: 1fr;
		max-height: 600px;
	}

	.status-media__item {
		position: relative;
		background: var(--status-bg-secondary, #f7f9fa);
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.status-media--single .status-media__item {
		aspect-ratio: auto;
	}

	.status-media__image,
	.status-media__video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.status-media--single .status-media__image,
	.status-media--single .status-media__video {
		object-fit: contain;
		max-height: 600px;
	}

	.status-media__audio {
		width: 100%;
		margin-top: 50%;
		transform: translateY(-50%);
	}

	/* Responsive layout for more than 2 images */
	.status-media__item:nth-child(1):nth-last-child(3),
	.status-media__item:nth-child(2):nth-last-child(2) {
		grid-column: span 1;
	}

	.status-media__item:nth-child(3):nth-last-child(1) {
		grid-column: span 2;
	}

	/* Compact density adjustments */
	.status-root--compact .status-media {
		margin: var(--status-spacing-xs, 0.25rem) 0;
	}
</style>
