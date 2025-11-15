<script lang="ts">
	import { Avatar } from '@equaltoai/greater-components-primitives';
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';
	import ContentRenderer from './ContentRenderer.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { UnifiedAccount } from '@equaltoai/greater-components-adapters';

	interface ProfileHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'role'> {
		/**
		 * The profile/account data to display
		 */
		account: UnifiedAccount;
		/**
		 * Whether the banner image should be displayed
		 */
		showBanner?: boolean;
		/**
		 * Banner fallback color (CSS color value)
		 */
		bannerFallbackColor?: string;
		/**
		 * Avatar size
		 */
		avatarSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		/**
		 * Whether to show the bio/note content
		 */
		showBio?: boolean;
		/**
		 * Whether to show metadata fields
		 */
		showFields?: boolean;
		/**
		 * Whether to show creation/join date
		 */
		showJoinDate?: boolean;
		/**
		 * Whether to show follower/following counts
		 */
		showCounts?: boolean;
		/**
		 * Whether counts should be clickable
		 */
		clickableCounts?: boolean;
		/**
		 * Slot for follow/action button
		 */
		followButton?: Snippet;
		/**
		 * Additional CSS class
		 */
		class?: string;
		/**
		 * Callbacks for count clicks
		 */
		onFollowersClick?: () => void;
		onFollowingClick?: () => void;
		onPostsClick?: () => void;
		/**
		 * Custom emoji replacement function
		 */
		emojiRenderer?: (text: string) => string;
	}

	let {
		account,
		showBanner = true,
		bannerFallbackColor = 'var(--gr-color-primary-500)',
		avatarSize = 'xl',
		showBio = true,
		showFields = true,
		showJoinDate = true,
		showCounts = true,
		clickableCounts = false,
		followButton,
		class: className = '',
		onFollowersClick,
		onFollowingClick,
		onPostsClick,
		emojiRenderer,
	}: ProfileHeaderProps = $props();

	// State for banner image loading
	let bannerLoaded = $state(false);
	let bannerError = $state(false);
	let bannerElement: HTMLImageElement | null = $state(null);

	// Component class computation
	const profileHeaderClass = $derived(() => {
		const classes = ['gr-profile-header', className].filter(Boolean).join(' ');

		return classes;
	});

	// Banner style computation
	const bannerStyle = $derived(() => {
		if (showBanner && account.header && !bannerError && bannerLoaded) {
			return `background-image: url('${account.header}');`;
		}
		return `background-color: ${bannerFallbackColor};`;
	});

	// Display name with emoji support
	const processedDisplayName = $derived(() => {
		if (emojiRenderer) {
			return emojiRenderer(account.displayName || account.username);
		}
		return account.displayName || account.username;
	});

	const sanitizedDisplayName = $derived(() =>
		sanitizeHtml(processedDisplayName() || account.username || 'Profile', {
			allowedTags: ['span', 'em', 'strong', 'b', 'i', 'u', 'img'],
			allowedAttributes: [
				'class',
				'alt',
				'src',
				'title',
				'aria-label',
				'role',
				'draggable',
				'loading',
				'width',
				'height',
			],
		})
	);

	function setHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			},
		};
	}

	// Format large numbers
	function formatCount(count: number): string {
		if (count < 1000) return count.toString();
		if (count < 10000) return `${(count / 1000).toFixed(1)}K`;
		if (count < 1000000) return `${Math.floor(count / 1000)}K`;
		if (count < 10000000) return `${(count / 1000000).toFixed(1)}M`;
		return `${Math.floor(count / 1000000)}M`;
	}

	// Format join date
	const formattedJoinDate = $derived(() => {
		if (!account.createdAt) return '';
		try {
			const date = new Date(account.createdAt);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
			});
		} catch {
			return '';
		}
	});

	// Handle banner image events
	function handleBannerLoad() {
		bannerLoaded = true;
		bannerError = false;
	}

	function handleBannerError() {
		bannerLoaded = false;
		bannerError = true;
	}

	// Reset banner state when header changes
	$effect(() => {
		if (account.header) {
			bannerLoaded = false;
			bannerError = false;
		}
	});

	// Click handlers for counts
	function handleFollowersClick(event: MouseEvent) {
		if (clickableCounts && onFollowersClick) {
			event.preventDefault();
			onFollowersClick();
		}
	}

	function handleFollowingClick(event: MouseEvent) {
		if (clickableCounts && onFollowingClick) {
			event.preventDefault();
			onFollowingClick();
		}
	}

	function handlePostsClick(event: MouseEvent) {
		if (clickableCounts && onPostsClick) {
			event.preventDefault();
			onPostsClick();
		}
	}

	// Generate unique IDs for accessibility
	const bannerId = `profile-banner-${Math.random().toString(36).substr(2, 9)}`;
	const bioId = `profile-bio-${Math.random().toString(36).substr(2, 9)}`;
	const fieldsId = `profile-fields-${Math.random().toString(36).substr(2, 9)}`;
</script>

<article class={profileHeaderClass()}>
	<!-- Banner Section -->
	{#if showBanner}
		<div
			class="gr-profile-header__banner"
			style={bannerStyle()}
			id={bannerId}
			role="img"
			aria-label={account.header ? 'Profile banner' : 'Profile banner (default color)'}
		>
			{#if account.header}
				<img
					bind:this={bannerElement}
					src={account.header}
					alt=""
					class="gr-profile-header__banner-image"
					onload={handleBannerLoad}
					onerror={handleBannerError}
					style={`display: ${bannerLoaded ? 'block' : 'none'}`}
				/>
			{/if}
		</div>
	{/if}

	<!-- Profile Info Section -->
	<div class="gr-profile-header__content">
		<!-- Avatar and Action Button Row -->
		<div class="gr-profile-header__top">
			<div class="gr-profile-header__avatar-wrapper">
				<Avatar
					src={account.avatar}
					alt={`${account.displayName || account.username} avatar`}
					name={account.displayName || account.username}
					size={avatarSize}
					class="gr-profile-header__avatar"
				/>
				{#if account.verified}
					<div
						class="gr-profile-header__verified-badge"
						role="img"
						aria-label="Verified account"
						title="Verified account"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
							/>
						</svg>
					</div>
				{/if}
				{#if account.bot}
					<div
						class="gr-profile-header__bot-badge"
						role="img"
						aria-label="Bot account"
						title="Bot account"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
							/>
						</svg>
						<span class="sr-only">Bot</span>
					</div>
				{/if}
			</div>

			{#if followButton}
				<div class="gr-profile-header__actions">
					{@render followButton()}
				</div>
			{/if}
		</div>

		<!-- Name and Handle -->
		<div class="gr-profile-header__identity">
			<h1
				class="gr-profile-header__display-name"
				aria-label={processedDisplayName() || account.username || 'Profile'}
			>
				<span class="gr-profile-header__display-name-text" use:setHtml={sanitizedDisplayName()}
				></span>
				{#if account.locked}
					<svg
						class="gr-profile-header__lock-icon"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-label="Private account"
						role="img"
					>
						<path
							d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
						/>
					</svg>
				{/if}
			</h1>
			<p class="gr-profile-header__handle">@{account.acct}</p>
		</div>

		<!-- Bio/Note -->
		{#if showBio && account.note}
			<div class="gr-profile-header__bio" id={bioId}>
				<ContentRenderer
					content={account.note}
					mentions={[]}
					tags={[]}
					class="gr-profile-header__bio-content"
				/>
			</div>
		{/if}

		<!-- Metadata Fields -->
		{#if showFields && account.fields && account.fields.length > 0}
			<dl class="gr-profile-header__fields" id={fieldsId}>
				{#each account.fields as field (field.name)}
					<div class="gr-profile-header__field">
						<dt class="gr-profile-header__field-name">
							<span
								class="gr-profile-header__field-name-content"
								use:setHtml={sanitizeHtml(field.name, {
									allowedTags: ['span', 'em', 'strong'],
									allowedAttributes: ['class'],
								})}
							></span>
						</dt>
						<dd class="gr-profile-header__field-value">
							<span
								class="gr-profile-header__field-value-content"
								use:setHtml={sanitizeHtml(field.value, {
									allowedTags: ['a', 'span', 'em', 'strong'],
									allowedAttributes: ['href', 'class', 'rel', 'target'],
								})}
							></span>
							{#if field.verifiedAt}
								<svg
									class="gr-profile-header__field-verified"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-label="Verified link"
									role="img"
									title={`Verified on ${new Date(field.verifiedAt).toLocaleDateString()}`}
								>
									<path
										d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
									/>
								</svg>
							{/if}
						</dd>
					</div>
				{/each}
			</dl>
		{/if}

		<!-- Join Date and Counts -->
		<div class="gr-profile-header__stats">
			{#if showJoinDate && formattedJoinDate()}
				<div class="gr-profile-header__join-date">
					<svg
						class="gr-profile-header__calendar-icon"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
						/>
					</svg>
					<span>Joined {formattedJoinDate()}</span>
				</div>
			{/if}

			{#if showCounts}
				<div class="gr-profile-header__counts">
					<button
						class="gr-profile-header__count"
						class:clickable={clickableCounts && onPostsClick}
						onclick={handlePostsClick}
						disabled={!clickableCounts || !onPostsClick}
						aria-label={`${formatCount(account.statusesCount)} posts`}
					>
						<span class="gr-profile-header__count-number">{formatCount(account.statusesCount)}</span
						>
						<span class="gr-profile-header__count-label">Posts</span>
					</button>

					<button
						class="gr-profile-header__count"
						class:clickable={clickableCounts && onFollowingClick}
						onclick={handleFollowingClick}
						disabled={!clickableCounts || !onFollowingClick}
						aria-label={`${formatCount(account.followingCount)} following`}
					>
						<span class="gr-profile-header__count-number"
							>{formatCount(account.followingCount)}</span
						>
						<span class="gr-profile-header__count-label">Following</span>
					</button>

					<button
						class="gr-profile-header__count"
						class:clickable={clickableCounts && onFollowersClick}
						onclick={handleFollowersClick}
						disabled={!clickableCounts || !onFollowersClick}
						aria-label={`${formatCount(account.followersCount)} followers`}
					>
						<span class="gr-profile-header__count-number"
							>{formatCount(account.followersCount)}</span
						>
						<span class="gr-profile-header__count-label">Followers</span>
					</button>
				</div>
			{/if}
		</div>
	</div>
</article>

<style>
	.gr-profile-header {
		position: relative;
		background-color: var(--gr-semantic-background-primary);
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
		border: 1px solid var(--gr-semantic-border-secondary);
	}

	/* Banner */
	.gr-profile-header__banner {
		position: relative;
		width: 100%;
		height: 12rem;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.gr-profile-header__banner-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 640px) {
		.gr-profile-header__banner {
			height: 8rem;
		}
	}

	/* Content */
	.gr-profile-header__content {
		position: relative;
		padding: var(--gr-spacing-4) var(--gr-spacing-6);
		margin-top: -3rem;
	}

	@media (max-width: 640px) {
		.gr-profile-header__content {
			padding: var(--gr-spacing-4);
			margin-top: -2rem;
		}
	}

	/* Top Row (Avatar + Actions) */
	.gr-profile-header__top {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-4);
	}

	.gr-profile-header__avatar-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-2);
	}

	.gr-profile-header__avatar {
		border: 4px solid var(--gr-semantic-background-primary);
		box-shadow: var(--gr-shadow-lg);
	}

	/* Badges */
	.gr-profile-header__verified-badge {
		color: var(--gr-color-success-600);
		margin-left: var(--gr-spacing-1);
	}

	.gr-profile-header__bot-badge {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-1);
		padding: var(--gr-spacing-1) var(--gr-spacing-2);
		background-color: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-full);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-secondary);
		border: 1px solid var(--gr-semantic-border-secondary);
	}

	.gr-profile-header__actions {
		margin-bottom: var(--gr-spacing-2);
	}

	/* Identity */
	.gr-profile-header__identity {
		margin-bottom: var(--gr-spacing-4);
	}

	.gr-profile-header__display-name {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-2);
		font-size: var(--gr-typography-fontSize-2xl);
		font-weight: var(--gr-typography-fontWeight-bold);
		line-height: var(--gr-typography-lineHeight-tight);
		color: var(--gr-semantic-foreground-primary);
		margin: 0 0 var(--gr-spacing-1) 0;
	}

	.gr-profile-header__display-name-text {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-1);
	}

	.gr-profile-header__display-name-text img {
		height: 1em;
		width: 1em;
		vertical-align: middle;
	}

	.gr-profile-header__lock-icon {
		color: var(--gr-semantic-foreground-tertiary);
	}

	.gr-profile-header__handle {
		font-size: var(--gr-typography-fontSize-base);
		color: var(--gr-semantic-foreground-secondary);
		margin: 0;
	}

	@media (max-width: 640px) {
		.gr-profile-header__display-name {
			font-size: var(--gr-typography-fontSize-xl);
		}
	}

	/* Bio */
	.gr-profile-header__bio {
		margin-bottom: var(--gr-spacing-4);
	}

	.gr-profile-header__bio-content :global(p) {
		margin: 0 0 var(--gr-spacing-2) 0;
		line-height: var(--gr-typography-lineHeight-relaxed);
	}

	.gr-profile-header__bio-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.gr-profile-header__bio-content :global(a) {
		color: var(--gr-color-primary-600);
		text-decoration: none;
	}

	.gr-profile-header__bio-content :global(a:hover) {
		text-decoration: underline;
	}

	/* Fields */
	.gr-profile-header__fields {
		margin: 0 0 var(--gr-spacing-4) 0;
		border: 1px solid var(--gr-semantic-border-secondary);
		border-radius: var(--gr-radii-md);
		overflow: hidden;
	}

	.gr-profile-header__field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		border-bottom: 1px solid var(--gr-semantic-border-secondary);
	}

	.gr-profile-header__field:last-child {
		border-bottom: none;
	}

	.gr-profile-header__field-name,
	.gr-profile-header__field-value {
		padding: var(--gr-spacing-3);
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		line-height: var(--gr-typography-lineHeight-relaxed);
	}

	.gr-profile-header__field-name {
		background-color: var(--gr-semantic-background-secondary);
		color: var(--gr-semantic-foreground-secondary);
		font-weight: var(--gr-typography-fontWeight-medium);
		border-right: 1px solid var(--gr-semantic-border-secondary);
		word-break: break-word;
	}

	.gr-profile-header__field-value {
		position: relative;
		background-color: var(--gr-semantic-background-primary);
		color: var(--gr-semantic-foreground-primary);
		word-break: break-word;
	}

	.gr-profile-header__field-value :global(a) {
		color: var(--gr-color-primary-600);
		text-decoration: none;
	}

	.gr-profile-header__field-value :global(a:hover) {
		text-decoration: underline;
	}

	.gr-profile-header__field-verified {
		color: var(--gr-color-success-600);
		margin-left: var(--gr-spacing-1);
	}

	@media (max-width: 640px) {
		.gr-profile-header__field {
			grid-template-columns: 1fr;
		}

		.gr-profile-header__field-name {
			border-right: none;
			border-bottom: 1px solid var(--gr-semantic-border-secondary);
		}
	}

	/* Stats */
	.gr-profile-header__stats {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gr-spacing-4);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
	}

	.gr-profile-header__join-date {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-2);
	}

	.gr-profile-header__calendar-icon {
		flex-shrink: 0;
	}

	.gr-profile-header__counts {
		display: flex;
		gap: var(--gr-spacing-4);
		flex-wrap: wrap;
	}

	.gr-profile-header__count {
		display: flex;
		align-items: baseline;
		gap: var(--gr-spacing-1);
		background: none;
		border: none;
		padding: 0;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		cursor: default;
	}

	.gr-profile-header__count.clickable {
		cursor: pointer;
		transition: color 0.2s;
	}

	.gr-profile-header__count.clickable:hover {
		color: var(--gr-color-primary-600);
	}

	.gr-profile-header__count.clickable:focus-visible {
		outline: 2px solid var(--gr-color-primary-600);
		outline-offset: 2px;
		border-radius: var(--gr-radii-sm);
	}

	.gr-profile-header__count-number {
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-semantic-foreground-primary);
	}

	.gr-profile-header__count-label {
		color: var(--gr-semantic-foreground-secondary);
	}

	/* Screen reader only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.gr-profile-header__stats {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--gr-spacing-2);
		}

		.gr-profile-header__counts {
			gap: var(--gr-spacing-3);
		}
	}

	/* High contrast mode */
	@media (prefers-contrast: high) {
		.gr-profile-header {
			border: 2px solid currentColor;
		}

		.gr-profile-header__field-name,
		.gr-profile-header__field-value {
			border-color: currentColor;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.gr-profile-header__count.clickable {
			transition: none;
		}
	}
</style>
