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
