<!--
  Auth.OAuthConsent - OAuth Authorization
  
  Displays OAuth consent screen for third-party application authorization.
  Shows requested permissions and allows users to approve or deny access.
  
  @component
  @example
  ```svelte
  <Auth.Root {handlers}>
    <Auth.OAuthConsent 
      clientName="Example App"
      {scopes}
      {clientInfo}
    />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getAuthContext } from './context.js';
	import type { OAuthData } from './context.js';

	interface ClientInfo {
		name: string;
		website?: string;
		description?: string;
		icon?: string;
	}

	interface Scope {
		id: string;
		name: string;
		description: string;
		icon?: string;
	}

	interface Props {
		/**
		 * OAuth client information
		 */
		clientInfo: ClientInfo;

		/**
		 * Requested scopes/permissions
		 */
		scopes: Scope[];

		/**
		 * OAuth client ID
		 */
		clientId: string;

		/**
		 * Redirect URI after authorization
		 */
		redirectUri: string;

		/**
		 * OAuth state parameter
		 */
		state: string;

		/**
		 * Current user information
		 */
		user?: {
			username: string;
			displayName?: string;
			avatar?: string;
		};

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		clientInfo,
		scopes,
		clientId,
		redirectUri,
		state: oauthState,
		user,
		class: className = '',
	}: Props = $props();

	const { state, handlers, updateState, clearError } = getAuthContext();

	const authorizeButton = createButton({
		onClick: () => handleAuthorize(),
	});

	const denyButton = createButton({
		onClick: () => handleDeny(),
	});

	/**
	 * Handle authorization approval
	 */
	async function handleAuthorize() {
		if (state.loading) return;

		clearError();
		updateState({ loading: true });

		try {
			const data: OAuthData = {
				clientId,
				redirectUri,
				scope: scopes.map((s) => s.id),
				state: oauthState,
			};

			await handlers.onOAuthAuthorize?.(data);
		} catch (err) {
			updateState({
				error: err instanceof Error ? err.message : 'Authorization failed',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle authorization denial
	 */
	function handleDeny() {
		if (state.loading) return;
		handlers.onOAuthDeny?.();
	}
</script>

<div class="auth-oauth {className}">
	<div class="auth-oauth__header">
		{#if clientInfo.icon}
			<img src={clientInfo.icon} alt={clientInfo.name} class="auth-oauth__app-icon" />
		{:else}
			<div class="auth-oauth__app-icon auth-oauth__app-icon--placeholder">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S11.5 8.38 11.5 7s1.12-2.5 2.5-2.5zM18 18H6v-1.53c0-2.5 3.97-3.58 6-3.58s6 1.08 6 3.58V18z"
					/>
				</svg>
			</div>
		{/if}

		<h2 class="auth-oauth__title">Authorize {clientInfo.name}</h2>

		{#if user}
			<div class="auth-oauth__user">
				{#if user.avatar}
					<img src={user.avatar} alt={user.username} class="auth-oauth__user-avatar" />
				{/if}
				<span class="auth-oauth__user-name">
					{user.displayName || user.username}
					<span class="auth-oauth__user-handle">@{user.username}</span>
				</span>
			</div>
		{/if}
	</div>

	{#if state.error}
		<div class="auth-oauth__error" role="alert">
			<svg class="auth-oauth__error-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{state.error}
		</div>
	{/if}

	<div class="auth-oauth__content">
		{#if clientInfo.description}
			<p class="auth-oauth__description">{clientInfo.description}</p>
		{/if}

		{#if clientInfo.website}
			<a
				href={clientInfo.website}
				target="_blank"
				rel="noopener noreferrer"
				class="auth-oauth__website"
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
					/>
				</svg>
				{new URL(clientInfo.website).hostname}
			</a>
		{/if}

		<div class="auth-oauth__permissions">
			<h3 class="auth-oauth__permissions-title">This app will be able to:</h3>
			<ul class="auth-oauth__permissions-list">
				{#each scopes as scope}
					<li class="auth-oauth__permission">
						{#if scope.icon}
							<img src={scope.icon} alt="" class="auth-oauth__permission-icon" />
						{:else}
							<svg class="auth-oauth__permission-icon" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
								/>
							</svg>
						{/if}
						<div class="auth-oauth__permission-content">
							<span class="auth-oauth__permission-name">{scope.name}</span>
							<span class="auth-oauth__permission-desc">{scope.description}</span>
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<div class="auth-oauth__warning">
			<svg class="auth-oauth__warning-icon" viewBox="0 0 24 24" fill="currentColor">
				<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
			</svg>
			<span>Only authorize applications you trust.</span>
		</div>
	</div>

	<div class="auth-oauth__actions">
		<button
			use:authorizeButton.actions.button
			class="auth-oauth__authorize"
			disabled={state.loading}
		>
			{#if state.loading}
				<span class="auth-oauth__spinner"></span>
				Authorizing...
			{:else}
				Authorize {clientInfo.name}
			{/if}
		</button>

		<button use:denyButton.actions.button class="auth-oauth__deny" disabled={state.loading}>
			Cancel
		</button>
	</div>
</div>

<style>
	.auth-oauth {
		width: 100%;
		max-width: 32rem;
		margin: 0 auto;
		padding: 2rem;
	}

	/* Header */
	.auth-oauth__header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.auth-oauth__app-icon {
		width: 4rem;
		height: 4rem;
		border-radius: 1rem;
		object-fit: cover;
	}

	.auth-oauth__app-icon--placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary, #f7f9fa);
		color: var(--text-secondary, #536471);
	}

	.auth-oauth__app-icon--placeholder svg {
		width: 2rem;
		height: 2rem;
	}

	.auth-oauth__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		color: var(--text-primary, #0f1419);
	}

	.auth-oauth__user {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 9999px;
	}

	.auth-oauth__user-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
	}

	.auth-oauth__user-name {
		display: flex;
		flex-direction: column;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-oauth__user-handle {
		font-weight: 400;
		color: var(--text-secondary, #536471);
	}

	/* Error Alert */
	.auth-oauth__error {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem;
		margin-bottom: 1.5rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid rgba(244, 33, 46, 0.3);
		border-radius: 0.5rem;
		color: #f4211e;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.auth-oauth__error-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Content */
	.auth-oauth__content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.auth-oauth__description {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.5;
	}

	.auth-oauth__website {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.auth-oauth__website:hover {
		text-decoration: underline;
	}

	.auth-oauth__website svg {
		width: 1rem;
		height: 1rem;
	}

	/* Permissions */
	.auth-oauth__permissions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-oauth__permissions-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-oauth__permissions-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.auth-oauth__permission {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.auth-oauth__permission-icon {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
		color: var(--primary-color, #1d9bf0);
	}

	.auth-oauth__permission-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.auth-oauth__permission-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-oauth__permission-desc {
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
		line-height: 1.4;
	}

	/* Warning */
	.auth-oauth__warning {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem;
		background: rgba(255, 173, 31, 0.1);
		border: 1px solid rgba(255, 173, 31, 0.3);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: #f59e0b;
	}

	.auth-oauth__warning-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Actions */
	.auth-oauth__actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.auth-oauth__authorize {
		width: 100%;
		padding: 0.875rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		font-size: 1rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.auth-oauth__authorize:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-oauth__authorize:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.auth-oauth__deny {
		width: 100%;
		padding: 0.875rem;
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
		transition: all 0.2s;
	}

	.auth-oauth__deny:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.auth-oauth__deny:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Loading Spinner */
	.auth-oauth__spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
