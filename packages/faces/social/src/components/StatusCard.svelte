<script lang="ts">
	import { formatDateTime } from '@equaltoai/greater-components-utils';
	import ContentRenderer from './ContentRenderer.svelte';
	import ActionBar from './ActionBar.svelte';
	import { ReplyIcon, RepeatIcon } from '@equaltoai/greater-components-icons';
	import type { MediaAttachment, Status } from '../types';
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

	function handleCardClick(event: MouseEvent | KeyboardEvent) {
		// Don't trigger if clicking on links or buttons
		const target = event.target;
		if (
			target instanceof HTMLElement &&
			(target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button'))
		) {
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

	let sensitiveVisibility = $state<Record<string, boolean>>({});

	function getPreviewType(media: MediaAttachment): 'image' | 'video' | 'audio' | 'file' {
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

	function isMediaHidden(media: MediaAttachment): boolean {
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
				shareUrl={actualStatus.url}
				shareTitle={`Post by ${account.displayName || account.username}`}
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
