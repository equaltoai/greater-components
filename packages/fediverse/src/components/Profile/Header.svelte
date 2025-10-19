<!--
  Profile.Header - Profile Header Display
  
  Displays profile header with avatar, cover image, name, bio, and action buttons.
  Supports edit mode for own profile and follow/block actions for other profiles.
  
  @component
  @example
  ```svelte
  <Profile.Root {profile} {handlers}>
    <Profile.Header showCover={true} showActions={true} />
  </Profile.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';
	import { getProfileContext, getRelationshipText } from './context.js';

	interface Props {
		/**
		 * Show cover image
		 * @default true
		 */
		showCover?: boolean;

		/**
		 * Show action buttons (follow, block, etc.)
		 * @default true
		 */
		showActions?: boolean;

		/**
		 * Show fields section
		 * @default true
		 */
		showFields?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		showCover = true,
		showActions = true,
		showFields = true,
		class: className = '',
	}: Props = $props();

	const { state: profileState, handlers, toggleEdit } = getProfileContext();

	const editButton = createButton({
		onClick: () => toggleEdit(),
	});

	const followButton = createButton({
		onClick: () => handleFollow(),
	});

	const moreButton = createButton({
		onClick: () => (showMoreMenu = !showMoreMenu),
	});

	let showMoreMenu = $state(false);

	/**
	 * Handle follow/unfollow action
	 */
	async function handleFollow() {
		if (!profileState.profile || profileState.loading) return;

		const isFollowing = profileState.profile.relationship?.following;

		profileState.loading = true;
		try {
			if (isFollowing) {
				await handlers.onUnfollow?.(profileState.profile.id);
			} else {
				await handlers.onFollow?.(profileState.profile.id);
			}
		} catch (error) {
			profileState.error = error instanceof Error ? error.message : 'Action failed';
		} finally {
			profileState.loading = false;
		}
	}

	/**
	 * Handle share action
	 */
	function handleShare() {
		handlers.onShare?.();
		showMoreMenu = false;
	}

	/**
	 * Handle mention action
	 */
	function handleMention() {
		if (profileState.profile) {
			handlers.onMention?.(profileState.profile.username);
		}
		showMoreMenu = false;
	}

	/**
	 * Handle message action
	 */
	function handleMessage() {
		if (profileState.profile) {
			handlers.onMessage?.(profileState.profile.id);
		}
		showMoreMenu = false;
	}

	/**
	 * Handle mute action
	 */
	async function handleMute() {
		if (!profileState.profile) return;
		await handlers.onMute?.(profileState.profile.id);
		showMoreMenu = false;
	}

	/**
	 * Handle block action
	 */
	async function handleBlock() {
		if (!profileState.profile) return;
		await handlers.onBlock?.(profileState.profile.id);
		showMoreMenu = false;
	}

	/**
	 * Handle report action
	 */
	function handleReport() {
		if (profileState.profile) {
			handlers.onReport?.(profileState.profile.id);
		}
		showMoreMenu = false;
	}

	function sanitizeProfileBio(bio: string): string {
		return sanitizeHtml(bio, {
			allowedTags: [
				'p',
				'br',
				'span',
				'a',
				'strong',
				'em',
				'b',
				'i',
				'u',
				'code',
				'pre',
			],
			allowedAttributes: ['href', 'rel', 'target', 'class', 'title'],
		});
	}

	function sanitizeProfileFieldValue(html: string): string {
		return sanitizeHtml(html, {
			allowedTags: ['a', 'span', 'em', 'strong', 'code'],
			allowedAttributes: ['href', 'rel', 'target', 'class', 'title'],
		});
	}

	function setHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			},
		};
	}
</script>

{#if profileState.profile}
	<div class={`profile-header ${className}`}>
		{#if showCover && profileState.profile.header}
			<div class="profile-header__cover">
				<img src={profileState.profile.header} alt="Profile cover" class="profile-header__cover-img" />
			</div>
		{/if}

		<div class="profile-header__content">
			<div class="profile-header__avatar-wrapper">
				<div class="profile-header__avatar">
					{#if profileState.profile.avatar}
						<img src={profileState.profile.avatar} alt={profileState.profile.displayName} />
					{:else}
						<div class="profile-header__avatar-placeholder">
							{profileState.profile.displayName[0]?.toUpperCase() ||
								profileState.profile.username[0]?.toUpperCase()}
						</div>
					{/if}
				</div>
			</div>

			{#if showActions}
				<div class="profile-header__actions">
					{#if profileState.isOwnProfile}
						<button
							use:editButton.actions.button
							class="profile-header__button profile-header__button--primary"
						>
							Edit Profile
						</button>
					{:else}
						<button
							use:followButton.actions.button
							class="profile-header__button"
							class:profile-header__button--primary={!profileState.profile.relationship?.following}
							class:profile-header__button--following={profileState.profile.relationship?.following}
							disabled={profileState.loading}
						>
							{getRelationshipText(profileState.profile.relationship)}
						</button>

						<div class="profile-header__more">
							<button
								use:moreButton.actions.button
								class="profile-header__button profile-header__button--icon"
								type="button"
								aria-label="Open profile actions"
								title="More actions"
							>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
									/>
								</svg>
							</button>

							{#if showMoreMenu}
								<div class="profile-header__menu">
									<button class="profile-header__menu-item" onclick={handleShare}>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
											/>
										</svg>
										Share Profile
									</button>

									<button class="profile-header__menu-item" onclick={handleMention}>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
											/>
										</svg>
										Mention @{profileState.profile.username}
									</button>

									<button class="profile-header__menu-item" onclick={handleMessage}>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
											/>
										</svg>
										Direct Message
									</button>

									<hr class="profile-header__menu-divider" />

									<button
										class="profile-header__menu-item profile-header__menu-item--warning"
										onclick={handleMute}
									>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
											/>
										</svg>
										Mute @{profileState.profile.username}
									</button>

									<button
										class="profile-header__menu-item profile-header__menu-item--danger"
										onclick={handleBlock}
									>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"
											/>
										</svg>
										Block @{profileState.profile.username}
									</button>

									<button
										class="profile-header__menu-item profile-header__menu-item--danger"
										onclick={handleReport}
									>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"
											/>
										</svg>
										Report @{profileState.profile.username}
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<div class="profile-header__info">
				<h1 class="profile-header__name">{profileState.profile.displayName}</h1>
				<p class="profile-header__username">@{profileState.profile.username}</p>

				{#if profileState.profile.bio}
					<div
						class="profile-header__bio"
						use:setHtml={sanitizeProfileBio(profileState.profile.bio)}
					></div>
				{/if}

				{#if showFields && profileState.profile.fields && profileState.profile.fields.length > 0}
					<div class="profile-header__fields">
						{#each profileState.profile.fields as field (field.name)}
							<div class="profile-header__field">
								<dt class="profile-header__field-name">{field.name}</dt>
								<dd class="profile-header__field-value">
									<span
										class="profile-header__field-value-content"
										use:setHtml={sanitizeProfileFieldValue(field.value)}
									></span>
									{#if field.verifiedAt}
										<svg
											class="profile-header__field-verified"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
										</svg>
									{/if}
								</dd>
							</div>
						{/each}
					</div>
				{/if}

				{#if profileState.profile.createdAt}
					<div class="profile-header__meta">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
							/>
						</svg>
						Joined {new Date(profileState.profile.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
						})}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.profile-header {
		width: 100%;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
		overflow: hidden;
	}

	/* Cover */
	.profile-header__cover {
		width: 100%;
		height: 200px;
		background: var(--bg-secondary, #f7f9fa);
		overflow: hidden;
	}

	.profile-header__cover-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Content */
	.profile-header__content {
		position: relative;
		padding: 0 1.5rem 1.5rem;
	}

	/* Avatar */
	.profile-header__avatar-wrapper {
		position: relative;
		margin-top: -4rem;
		margin-bottom: 1rem;
	}

	.profile-header__avatar {
		width: 8rem;
		height: 8rem;
		border-radius: 50%;
		border: 4px solid var(--bg-primary, #ffffff);
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-header__avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-header__avatar-placeholder {
		font-size: 3rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	/* Actions */
	.profile-header__actions {
		position: absolute;
		top: 1rem;
		right: 1.5rem;
		display: flex;
		gap: 0.5rem;
	}

	.profile-header__button {
		padding: 0.5rem 1.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		background: var(--bg-primary, #ffffff);
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
		transition: all 0.2s;
	}

	.profile-header__button:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.profile-header__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.profile-header__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
		border-color: var(--primary-color, #1d9bf0);
	}

	.profile-header__button--primary:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.profile-header__button--following {
		background: transparent;
		border-color: var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.profile-header__button--icon {
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-header__button--icon svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* More Menu */
	.profile-header__more {
		position: relative;
	}

	.profile-header__menu {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.5rem;
		min-width: 16rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		overflow: hidden;
		z-index: 10;
	}

	.profile-header__menu-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.875rem 1rem;
		border: none;
		background: transparent;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.profile-header__menu-item:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.profile-header__menu-item svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.profile-header__menu-item--warning {
		color: #f59e0b;
	}

	.profile-header__menu-item--danger {
		color: #f4211e;
	}

	.profile-header__menu-divider {
		margin: 0;
		border: none;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	/* Info */
	.profile-header__info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.profile-header__name {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.profile-header__username {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
	}

	.profile-header__bio {
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.profile-header__bio :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.profile-header__bio :global(a:hover) {
		text-decoration: underline;
	}

	/* Fields */
	.profile-header__fields {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.75rem;
	}

	.profile-header__field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.75rem;
		font-size: 0.9375rem;
	}

	.profile-header__field-name {
		margin: 0;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	.profile-header__field-value {
		margin: 0;
		color: var(--text-primary, #0f1419);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		word-break: break-word;
	}

	.profile-header__field-value-content :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.profile-header__field-value-content :global(a:hover) {
		text-decoration: underline;
	}

	.profile-header__field-verified {
		width: 1.125rem;
		height: 1.125rem;
		color: var(--success-color, #00ba7c);
		flex-shrink: 0;
	}

	/* Meta */
	.profile-header__meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
	}

	.profile-header__meta svg {
		width: 1.125rem;
		height: 1.125rem;
	}
</style>
