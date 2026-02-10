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
				switch (attachment.mediaCategory.toUpperCase()) {
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

			const mime =
				(attachment as unknown as { mimeType?: string; mediaType?: string }).mimeType ||
				(attachment as unknown as { mimeType?: string; mediaType?: string }).mediaType;
			if (mime) {
				if (mime.startsWith('image/')) return 'image';
				if (mime.startsWith('video/')) return 'video';
				if (mime.startsWith('audio/')) return 'audio';
			}

			switch ((attachment as unknown as { type?: string }).type) {
				case 'Image':
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
			return attachment.sensitive === true && sensitiveVisibility[attachment.url] !== true;
		}

		function toggleAttachmentVisibility(url: string) {
			const current = sensitiveVisibility[url] === true;
			sensitiveVisibility = { ...sensitiveVisibility, [url]: !current };
		}

		function getAttachmentDescription(
			attachment: (typeof actualStatus.mediaAttachments)[number]
		): string {
			const maybeDescription = (attachment as unknown as { description?: unknown }).description;
			if (typeof maybeDescription === 'string') return maybeDescription;
			return attachment.name || '';
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
				{#each actualStatus.mediaAttachments! as attachment (attachment.url)}
					{@const previewType = getPreviewType(attachment)}
					{@const description = getAttachmentDescription(attachment)}
					<div
						class="status-media__item"
						class:status-media__item--blurred={isAttachmentHidden(attachment)}
					>
						{#if previewType === 'image'}
							<img
								src={attachment.previewUrl || attachment.url}
								alt={description}
								loading="lazy"
								class="status-media__image"
							/>
						{:else if previewType === 'video'}
							<video
								src={attachment.url}
								poster={attachment.previewUrl}
								controls
								class="status-media__video"
								aria-label={description || 'Video'}
							>
								<track kind="captions" />
							</video>
						{:else if previewType === 'audio'}
							<audio
								src={attachment.url}
								controls
								class="status-media__audio"
								aria-label={description || 'Audio'}
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
								<span>{description || 'Attachment'}</span>
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
										onclick={() => toggleAttachmentVisibility(attachment.url)}
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
