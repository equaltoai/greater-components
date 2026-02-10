<script lang="ts">
	import { Button } from '@equaltoai/greater-components-primitives';
	import {
		ReplyIcon as Reply,
		RepeatIcon as Boost,
		FavoriteIcon as Favorite,
		ShareIcon as Share,
		RepeatIcon as Unboost,
		UnfavoriteIcon as Unfavorite,
	} from '@equaltoai/greater-components-icons';
	import { copyToClipboard } from '@equaltoai/greater-components-utils';
	import type { Snippet } from 'svelte';

	interface ActionCounts {
		replies: number;
		boosts: number;
		favorites: number;
		quotes?: number;
	}

	interface ActionStates {
		boosted?: boolean;
		favorited?: boolean;
		bookmarked?: boolean;
	}

	interface ActionHandlers {
		onReply?: () => Promise<void> | void;
		onBoost?: () => Promise<void> | void;
		onFavorite?: () => Promise<void> | void;
		onShare?: () => Promise<void> | void;
		onQuote?: () => Promise<void> | void;
	}

	interface Props {
		/**
		 * Current action counts
		 */
		counts: ActionCounts;
		/**
		 * Current action states
		 */
		states?: ActionStates;
		/**
		 * Action event handlers
		 */
		handlers?: ActionHandlers;
		/**
		 * URL to share/copy when `handlers.onShare` is not provided.
		 */
		shareUrl?: string;
		/**
		 * Optional title for Web Share API.
		 */
		shareTitle?: string;
		/**
		 * Optional text for Web Share API.
		 */
		shareText?: string;
		/**
		 * Whether the action bar is in read-only mode (disables all actions)
		 */
		readonly?: boolean;
		/**
		 * Size variant for the buttons
		 */
		size?: 'sm' | 'md' | 'lg';
		/**
		 * CSS class for the action bar
		 */
		class?: string;
		/**
		 * Custom slot for additional actions after standard actions
		 */
		extensions?: Snippet;
		/**
		 * ID prefix for accessibility
		 */
		idPrefix?: string;
	}

	let {
		counts,
		states = {},
		handlers = {},
		readonly = false,
		size = 'sm',
		class: className = '',
		extensions,
		idPrefix = 'action',
		shareUrl,
		shareTitle,
		shareText,
	}: Props = $props();

	// Loading states for each action
	let replyLoading = $state(false);
	let boostLoading = $state(false);
	let quoteLoading = $state(false);
	let favoriteLoading = $state(false);
	let shareLoading = $state(false);

	const quotesCount = $derived(counts.quotes ?? 0);

	// Derived state for action states
	const isBoosted = $derived(states.boosted ?? false);
	const isFavorited = $derived(states.favorited ?? false);

	// Format count display (e.g., 1K for 1000)
	function formatCount(count: number): string {
		if (count === 0) return '';
		if (count < 1000) return count.toString();
		if (count < 10000) return (count / 1000).toFixed(1).replace('.0', '') + 'K';
		return Math.floor(count / 1000) + 'K';
	}

	// Action handlers with loading states
	async function handleReply() {
		if (readonly || replyLoading || !handlers.onReply) return;

		replyLoading = true;
		try {
			await handlers.onReply();
		} catch (error) {
			console.error('Reply action failed:', error);
		} finally {
			replyLoading = false;
		}
	}

	async function handleBoost() {
		if (readonly || boostLoading || !handlers.onBoost) return;

		boostLoading = true;
		try {
			await handlers.onBoost();
		} catch (error) {
			console.error('Boost action failed:', error);
		} finally {
			boostLoading = false;
		}
	}

	async function handleFavorite() {
		if (readonly || favoriteLoading || !handlers.onFavorite) return;

		favoriteLoading = true;
		try {
			await handlers.onFavorite();
		} catch (error) {
			console.error('Favorite action failed:', error);
		} finally {
			favoriteLoading = false;
		}
	}

	async function handleShare() {
		if (readonly || shareLoading) return;
		if (!handlers.onShare && !shareUrl) return;

		shareLoading = true;
		try {
			if (handlers.onShare) {
				await handlers.onShare();
				return;
			}

			const url = shareUrl!;
			if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
				const data: { url: string; title?: string; text?: string } = { url };
				if (shareTitle) data.title = shareTitle;
				if (shareText) data.text = shareText;
				await navigator.share(data);
			} else {
				const result = await copyToClipboard(url);
				if (!result.success) {
					throw new Error(result.error || 'Failed to copy link');
				}
			}
		} catch (error) {
			console.error('Share action failed:', error);
		} finally {
			shareLoading = false;
		}
	}

	async function handleQuote() {
		if (readonly || quoteLoading || !handlers.onQuote) return;

		quoteLoading = true;
		try {
			await handlers.onQuote();
		} catch (error) {
			console.error('Quote action failed:', error);
		} finally {
			quoteLoading = false;
		}
	}
</script>

<div class={`gr-action-bar ${className}`} role="group" aria-label="Post actions">
	<Button
		variant="ghost"
		{size}
		disabled={readonly || replyLoading || !handlers.onReply}
		loading={replyLoading}
		onclick={handleReply}
		class="gr-action-bar__button gr-action-bar__button--reply"
		aria-label={counts.replies > 0
			? `Reply to this post. ${counts.replies} replies`
			: 'Reply to this post'}
		id={`${idPrefix}-reply`}
	>
		{#snippet prefix()}
			<Reply size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
		{/snippet}

		{#if counts.replies > 0}
			<span class="gr-action-bar__count" aria-hidden="true">
				{formatCount(counts.replies)}
			</span>
		{/if}
	</Button>

	<!-- Boost/Unboost Button -->
	<Button
		variant="ghost"
		{size}
		disabled={readonly || boostLoading || !handlers.onBoost}
		loading={boostLoading}
		onclick={handleBoost}
		class={`gr-action-bar__button gr-action-bar__button--boost${isBoosted ? ' gr-action-bar__button--active' : ''}`}
		aria-label={isBoosted
			? `Undo boost. ${counts.boosts} boosts`
			: counts.boosts > 0
				? `Boost this post. ${counts.boosts} boosts`
				: 'Boost this post'}
		aria-pressed={isBoosted}
		id={`${idPrefix}-boost`}
	>
		{#snippet prefix()}
			{#if isBoosted}
				<Unboost size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
			{:else}
				<Boost size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
			{/if}
		{/snippet}

		{#if counts.boosts > 0}
			<span class="gr-action-bar__count" aria-hidden="true">
				{formatCount(counts.boosts)}
			</span>
		{/if}
	</Button>

	<!-- Quote Button (Lesser-specific) -->
	{#if handlers.onQuote}
		<Button
			variant="ghost"
			{size}
			disabled={readonly || quoteLoading}
			loading={quoteLoading}
			onclick={handleQuote}
			class="gr-action-bar__button gr-action-bar__button--quote"
			aria-label={quotesCount > 0 ? `Quote this post. ${quotesCount} quotes` : 'Quote this post'}
			id={`${idPrefix}-quote`}
		>
			{#snippet prefix()}
				<svg
					width={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
					height={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
					<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
					<path d="M4 22h16"></path>
					<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
					<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
				</svg>
			{/snippet}

			{#if quotesCount > 0}
				<span class="gr-action-bar__count" aria-hidden="true">
					{formatCount(quotesCount)}
				</span>
			{/if}
		</Button>
	{/if}

	<!-- Favorite/Unfavorite Button -->
	<Button
		variant="ghost"
		{size}
		disabled={readonly || favoriteLoading || !handlers.onFavorite}
		loading={favoriteLoading}
		onclick={handleFavorite}
		class={`gr-action-bar__button gr-action-bar__button--favorite${isFavorited ? ' gr-action-bar__button--active' : ''}`}
		aria-label={isFavorited
			? `Remove from favorites. ${counts.favorites} favorites`
			: counts.favorites > 0
				? `Add to favorites. ${counts.favorites} favorites`
				: 'Add to favorites'}
		aria-pressed={isFavorited}
		id={`${idPrefix}-favorite`}
	>
		{#snippet prefix()}
			{#if isFavorited}
				<Unfavorite size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
			{:else}
				<Favorite size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
			{/if}
		{/snippet}

		{#if counts.favorites > 0}
			<span class="gr-action-bar__count" aria-hidden="true">
				{formatCount(counts.favorites)}
			</span>
		{/if}
	</Button>

	<!-- Share Button -->
	<Button
		variant="ghost"
		{size}
		disabled={readonly || shareLoading || (!handlers.onShare && !shareUrl)}
		loading={shareLoading}
		onclick={handleShare}
		class="gr-action-bar__button gr-action-bar__button--share"
		aria-label="Share this post"
		id={`${idPrefix}-share`}
	>
		{#snippet prefix()}
			<Share size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
		{/snippet}
	</Button>

	<!-- Extensions slot for additional actions -->
	{#if extensions}
		<div class="gr-action-bar__extensions">
			{@render extensions()}
		</div>
	{/if}
</div>
