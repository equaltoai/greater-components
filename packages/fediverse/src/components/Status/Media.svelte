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

	let sensitiveVisibility = $state<Record<string, boolean>>({});

	function getPreviewType(
		attachment: (typeof actualStatus.mediaAttachments)[number]
	): 'image' | 'video' | 'audio' | 'file' {
		if (attachment.mediaCategory) {
			switch (attachment.mediaCategory) {
				case 'IMAGE':
					return 'image';
				case 'VIDEO':
				case 'GIFV':
					return 'video';
				case 'AUDIO':
					return 'audio';
				default:
					return 'file';
			}
		}

		switch (attachment.type) {
			case 'image':
				return 'image';
			case 'video':
			case 'gifv':
				return 'video';
			case 'audio':
				return 'audio';
			default:
				return 'file';
		}
	}

	function isAttachmentHidden(attachment: (typeof actualStatus.mediaAttachments)[number]): boolean {
		return attachment.sensitive === true && sensitiveVisibility[attachment.id] !== true;
	}

	function toggleAttachmentVisibility(id: string) {
		const current = sensitiveVisibility[id] === true;
		sensitiveVisibility = { ...sensitiveVisibility, [id]: !current };
	}
</script>

{#if hasMedia}
	<div
		class={`status-media ${className}`}
		class:status-media--single={actualStatus.mediaAttachments!.length === 1}
		class:status-media--multiple={actualStatus.mediaAttachments!.length > 1}
	>
		{#if media}
			{@render media()}
		{:else}
			{#each actualStatus.mediaAttachments! as attachment (attachment.id)}
				{@const previewType = getPreviewType(attachment)}
				<div
					class="status-media__item"
					class:status-media__item--blurred={isAttachmentHidden(attachment)}
				>
					{#if previewType === 'image'}
						<img
							src={attachment.previewUrl || attachment.url}
							alt={attachment.description || ''}
							loading="lazy"
							class="status-media__image"
						/>
					{:else if previewType === 'video'}
						<video
							src={attachment.url}
							poster={attachment.previewUrl}
							controls
							class="status-media__video"
							aria-label={attachment.description || 'Video'}
						>
							<track kind="captions" />
						</video>
					{:else if previewType === 'audio'}
						<audio
							src={attachment.url}
							controls
							class="status-media__audio"
							aria-label={attachment.description || 'Audio'}
						>
							<track kind="captions" />
						</audio>
					{:else}
						<div class="status-media__file">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
								/>
							</svg>
							<span>{attachment.description || 'Attachment'}</span>
						</div>
					{/if}

					{#if attachment.sensitive}
						{#if isAttachmentHidden(attachment)}
							<div class="status-media__overlay status-media__overlay--sensitive">
								<span class="status-media__overlay-label">Sensitive content</span>
								{#if attachment.spoilerText}
									<p class="status-media__overlay-text">{attachment.spoilerText}</p>
								{/if}
								<button
									type="button"
									class="status-media__reveal"
									onclick={() => toggleAttachmentVisibility(attachment.id)}
								>
									Show media
								</button>
							</div>
						{:else}
							<div class="status-media__badge">Sensitive</div>
						{/if}
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

	.status-media__item--blurred .status-media__image,
	.status-media__item--blurred .status-media__video {
		filter: blur(18px);
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

	.status-media__file {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		height: 100%;
		color: var(--text-secondary, #536471);
	}

	.status-media__file svg {
		width: 2rem;
		height: 2rem;
	}

	.status-media__file span {
		font-size: 0.75rem;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.status-media__overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.status-media__overlay--sensitive {
		background: rgba(15, 20, 25, 0.85);
		gap: 0.75rem;
		text-align: center;
		padding: 1rem;
	}

	.status-media__overlay-label {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #fff;
	}

	.status-media__overlay-text {
		font-size: 0.8125rem;
		color: #fff;
		margin: 0;
	}

	.status-media__reveal {
		padding: 0.35rem 0.75rem;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.8);
		background: transparent;
		color: #fff;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.status-media__reveal:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.status-media__badge {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		background: rgba(15, 20, 25, 0.8);
		color: #fff;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		z-index: 1;
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
	:global(.status-root--compact) .status-media {
		margin: var(--status-spacing-xs, 0.25rem) 0;
	}
</style>
