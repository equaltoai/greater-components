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
	import { createButton } from '@equaltoai/greater-components-headless/button';
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

	const { state: authState, handlers, updateState, clearError } = getAuthContext();

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
		if (authState.loading) return;

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
		if (authState.loading) return;
		handlers.onOAuthDeny?.();
	}
</script>

<div class={`auth-oauth ${className}`}>
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

	{#if authState.error}
		<div class="auth-oauth__error" role="alert">
			<svg class="auth-oauth__error-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{authState.error}
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
				{#each scopes as scope (scope.name)}
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
			disabled={authState.loading}
		>
			{#if authState.loading}
				<span class="auth-oauth__spinner"></span>
				Authorizing...
			{:else}
				Authorize {clientInfo.name}
			{/if}
		</button>

		<button use:denyButton.actions.button class="auth-oauth__deny" disabled={authState.loading}>
			Cancel
		</button>
	</div>
</div>
