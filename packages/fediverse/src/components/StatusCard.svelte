<script lang="ts">
	import { formatDateTime } from '@equaltoai/greater-components-utils';
	import ContentRenderer from './ContentRenderer.svelte';
	import ActionBar from './ActionBar.svelte';
	import { ReplyIcon, RepeatIcon } from '@equaltoai/greater-components-icons';
	import type { Status } from '../types';
	import type { Snippet } from 'svelte';

	interface ActionHandlers {
		onReply?: (status: Status) => Promise<void> | void;
		onBoost?: (status: Status) => Promise<void> | void;
		onFavorite?: (status: Status) => Promise<void> | void;
		onShare?: (status: Status) => Promise<void> | void;
		onQuote?: (status: Status) => Promise<void> | void;
	}

	interface Props {
		/**
		 * Status data to display
		 */
		status: Status;
		/**
		 * Display density variant
		 */
		density?: 'compact' | 'comfortable';
		/**
		 * Whether to show the action bar
		 */
		showActions?: boolean;
		/**
		 * Action handlers for the action bar
		 */
		actionHandlers?: ActionHandlers;
		/**
		 * CSS class for the card
		 */
		class?: string;
		/**
		 * Custom header content
		 */
		header?: Snippet;
		/**
		 * Custom footer content
		 */
		footer?: Snippet;
		/**
		 * Click handler for the card
		 */
		onclick?: (status: Status) => void;
	}

	let {
		status,
		density = 'comfortable',
		showActions = true,
		actionHandlers,
		class: className = '',
		header,
		footer,
		onclick,
	}: Props = $props();

	const account = $derived(status.reblog?.account || status.account);
	const actualStatus = $derived(status.reblog || status);
	const dateTime = $derived(formatDateTime(actualStatus.createdAt));
	const replyAccount = $derived(actualStatus.inReplyToAccount);
	const replyTargetUrl = $derived(
		actualStatus.inReplyToStatus?.url ||
			(actualStatus.inReplyToId ? `#/status/${actualStatus.inReplyToId}` : undefined)
	);

	function handleCardClick(event: MouseEvent) {
		// Don't trigger if clicking on links or buttons
		const target = event.target as HTMLElement;
		if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
			return;
		}
		onclick?.(status);
	}

	// Action handler wrappers that pass the status to the handlers
	const wrappedActionHandlers = $derived({
		onReply: actionHandlers?.onReply ? () => actionHandlers.onReply!(status) : undefined,
		onBoost: actionHandlers?.onBoost ? () => actionHandlers.onBoost!(status) : undefined,
		onFavorite: actionHandlers?.onFavorite ? () => actionHandlers.onFavorite!(status) : undefined,
		onShare: actionHandlers?.onShare ? () => actionHandlers.onShare!(status) : undefined,
		onQuote: actionHandlers?.onQuote ? () => actionHandlers.onQuote!(status) : undefined,
	});

	let sensitiveVisibility: Record<string, boolean> = {};

	function getPreviewType(
		media: (typeof actualStatus.mediaAttachments)[number]
	): 'image' | 'video' | 'audio' | 'file' {
		if (media.mediaCategory) {
			switch (media.mediaCategory) {
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

		switch (media.type) {
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

	function isMediaHidden(media: (typeof actualStatus.mediaAttachments)[number]): boolean {
		return media.sensitive === true && sensitiveVisibility[media.id] !== true;
	}

	function toggleMediaVisibility(id: string) {
		sensitiveVisibility = {
			...sensitiveVisibility,
			[id]: sensitiveVisibility[id] === true ? false : true,
		};
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
	class={`status-card ${density} ${className}`}
	class:clickable={onclick}
	role={onclick ? 'button' : undefined}
	tabindex={onclick ? 0 : undefined}
	onclick={onclick ? handleCardClick : undefined}
	onkeypress={onclick ? (e) => e.key === 'Enter' && handleCardClick(e) : undefined}
	aria-label={`Status by ${account.displayName || account.username}`}
>
	{#if status.reblog}
		<div class="reblog-indicator">
			<RepeatIcon class="reblog-icon" size={16} />
			<span>{status.account.displayName || status.account.username} boosted</span>
		</div>
	{/if}

	{#if header}
		<div class="custom-header">
			{@render header()}
		</div>
	{/if}

	{#if replyAccount || replyTargetUrl}
		<div class="reply-indicator">
			<ReplyIcon class="reply-icon" size={16} />
			<span>Replying to </span>
			{#if replyTargetUrl}
				<a href={replyTargetUrl} class="reply-indicator__link">
					post from {replyAccount?.displayName || replyAccount?.username || 'original author'}
				</a>
			{:else if replyAccount}
				<span class="reply-indicator__link">
					post from {replyAccount.displayName || replyAccount.username}
				</span>
			{/if}
		</div>
	{/if}

	<div class="status-header">
		<a
			href={account.url}
			class="avatar-link"
			aria-label={`View ${account.displayName || account.username}'s profile`}
		>
			<img src={account.avatar} alt="" class="avatar" loading="lazy" width="48" height="48" />
		</a>

		<div class="account-info">
			<a href={account.url} class="display-name">
				{account.displayName || account.username}
				{#if account.bot}
					<span class="bot-badge" aria-label="Bot account">BOT</span>
				{/if}
			</a>
			<div class="account-handle">@{account.acct}</div>
		</div>

		<time class="timestamp" datetime={dateTime.iso} title={dateTime.absolute}>
			{dateTime.relative}
		</time>
	</div>

	<div class="status-content">
		<ContentRenderer
			content={actualStatus.content}
			spoilerText={actualStatus.spoilerText}
			mentions={actualStatus.mentions}
			tags={actualStatus.tags}
		/>
	</div>

	{#if actualStatus.mediaAttachments && actualStatus.mediaAttachments.length > 0}
		<div class="media-attachments" class:single={actualStatus.mediaAttachments.length === 1}>
			{#each actualStatus.mediaAttachments as media (media.id)}
				{@const previewType = getPreviewType(media)}
				<div class="media-item" class:blurred={isMediaHidden(media)}>
					{#if previewType === 'image'}
						<img
							src={media.previewUrl || media.url}
							alt={media.description || ''}
							loading="lazy"
							class="media-image"
						/>
					{:else if previewType === 'video'}
						<video
							src={media.url}
							poster={media.previewUrl}
							controls
							class="media-video"
							aria-label={media.description || 'Video'}
						>
							<track kind="captions" />
						</video>
					{:else if previewType === 'audio'}
						<audio
							src={media.url}
							controls
							class="media-audio"
							aria-label={media.description || 'Audio'}
						></audio>
					{:else}
						<div class="media-file">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
								/>
							</svg>
							<span>{media.description || 'Attachment'}</span>
						</div>
					{/if}

					{#if media.sensitive}
						{#if isMediaHidden(media)}
							<div class="media-overlay media-overlay--sensitive">
								<span class="media-overlay__label">Sensitive content</span>
								{#if media.spoilerText}
									<p class="media-overlay__text">{media.spoilerText}</p>
								{/if}
								<button
									type="button"
									class="media-reveal"
									onclick={() => toggleMediaVisibility(media.id)}
								>
									Show media
								</button>
							</div>
						{:else}
							<div class="media-badge">Sensitive</div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if showActions}
		<ActionBar
			counts={{
				replies: actualStatus.repliesCount,
				boosts: actualStatus.reblogsCount,
				favorites: actualStatus.favouritesCount,
				quotes: actualStatus.quoteCount,
			}}
			states={{
				boosted: actualStatus.reblogged,
				favorited: actualStatus.favourited,
				bookmarked: actualStatus.bookmarked,
			}}
			handlers={wrappedActionHandlers}
			readonly={!actionHandlers}
			size={density === 'compact' ? 'sm' : 'sm'}
			idPrefix={`status-${actualStatus.id}`}
		/>
	{/if}

	{#if footer}
		<div class="custom-footer">
			{@render footer()}
		</div>
	{/if}
</article>

<style>
	.status-card {
		padding: var(--spacing-md, 1rem);
		border-bottom: 1px solid var(--color-border, #e1e8ed);
		background: var(--color-bg, white);
		transition: background-color 0.2s;
	}

	.status-card.clickable {
		cursor: pointer;
	}

	.status-card.clickable:hover {
		background: var(--color-bg-hover, #f7f9fa);
	}

	.status-card.compact {
		padding: var(--spacing-sm, 0.5rem);
	}

	.reblog-indicator {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs, 0.25rem);
		margin-bottom: var(--spacing-xs, 0.25rem);
		margin-left: 0;
		color: var(--color-text-secondary, #536471);
		font-size: var(--font-size-sm, 0.875rem);
	}

	.reblog-icon {
		width: 16px;
		height: 16px;
	}

	.status-header {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-sm, 0.5rem);
		margin-bottom: var(--spacing-sm, 0.5rem);
	}

	.avatar-link {
		flex-shrink: 0;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
	}

	.compact .avatar {
		width: 40px;
		height: 40px;
	}

	.account-info {
		flex: 1;
		min-width: 0;
	}

	.display-name {
		font-weight: 600;
		color: var(--color-text, #0f1419);
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: var(--spacing-xs, 0.25rem);
	}

	.display-name:hover {
		text-decoration: underline;
	}

	.bot-badge {
		padding: 2px 4px;
		background: var(--color-bg-secondary, #f7f9fa);
		border: 1px solid var(--color-border, #e1e8ed);
		border-radius: var(--radius-xs, 2px);
		font-size: var(--font-size-xs, 0.75rem);
		font-weight: normal;
	}

	.account-handle {
		color: var(--color-text-secondary, #536471);
		font-size: var(--font-size-sm, 0.875rem);
	}

	.timestamp {
		color: var(--color-text-secondary, #536471);
		font-size: var(--font-size-sm, 0.875rem);
		text-decoration: none;
		white-space: nowrap;
	}

	.timestamp:hover {
		text-decoration: underline;
	}

	.status-content {
		margin-bottom: var(--spacing-sm, 0.5rem);
	}

	.media-attachments {
		display: grid;
		gap: var(--spacing-xs, 0.25rem);
		grid-template-columns: repeat(2, 1fr);
		margin-bottom: var(--spacing-sm, 0.5rem);
		border-radius: var(--radius-md, 8px);
		overflow: hidden;
	}

	.media-attachments.single {
		grid-template-columns: 1fr;
	}

	.media-item {
		position: relative;
		background: var(--color-bg-secondary, #f7f9fa);
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.media-item.blurred .media-image,
	.media-item.blurred .media-video {
		filter: blur(18px);
	}

	.media-image,
	.media-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.media-audio {
		width: 100%;
		margin-top: 50%;
		transform: translateY(-50%);
	}

	.media-file {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		height: 100%;
		color: var(--color-text-secondary, #536471);
	}

	.media-file svg {
		width: 2rem;
		height: 2rem;
	}

	.media-file span {
		font-size: 0.75rem;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.media-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.media-overlay--sensitive {
		background: rgba(15, 20, 25, 0.85);
		gap: 0.75rem;
		text-align: center;
		padding: 1rem;
	}

	.media-overlay__label {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #fff;
	}

	.media-overlay__text {
		font-size: 0.75rem;
		color: #fff;
		margin: 0;
	}

	.media-reveal {
		padding: 0.3rem 0.75rem;
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

	.media-reveal:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.media-badge {
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

	/* Action bar styling is now handled by the ActionBar component */

	.custom-header,
	.custom-footer {
		margin: var(--spacing-sm, 0.5rem) 0;
	}

	.reply-indicator {
		display: flex;
		align-items: center;
		gap: var(--spacing-2xs, 0.2rem);
		color: var(--color-text-secondary, #536471);
		font-size: var(--font-size-sm, 0.875rem);
		margin-left: 0;
	}

	.reply-indicator__link {
		color: inherit;
		text-decoration: none;
	}

	.reply-indicator__link:hover {
		text-decoration: underline;
	}
</style>
