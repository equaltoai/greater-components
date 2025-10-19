<!--
  Auth.TwoFactorVerify - Two-Factor Verification During Login
  
  Used during login when 2FA is enabled. Allows users to enter TOTP code
  or use backup codes to complete authentication.
  
  @component
  @example
  ```svelte
  <Auth.Root {handlers} {initialState}>
    <Auth.TwoFactorVerify />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAuthContext } from './context.js';

	interface Props {
		/**
		 * Custom title
		 * @default "Enter Verification Code"
		 */
		title?: string;

		/**
		 * Show option to use backup code
		 * @default true
		 */
		showBackupOption?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		title = 'Enter Verification Code',
		showBackupOption = true,
		class: className = '',
	}: Props = $props();

	const { state: authState, handlers, updateState, clearError } = getAuthContext();

	let method = $state<'totp' | 'backup'>('totp');
	let code = $state('');
	let codeError = $state<string | null>(null);

	const verifyButton = createButton({
		onClick: () => handleVerify(),
	});

	/**
	 * Handle verification
	 */
	async function handleVerify() {
		if (authState.loading || !code.trim()) return;

		codeError = null;
		clearError();

		// Validate code length
		if (method === 'totp' && code.length !== 6) {
			codeError = 'Code must be 6 digits';
			return;
		}

		updateState({ loading: true });

		try {
			await handlers.onTwoFactorVerify?.({
				code: code.trim(),
				method,
			});
		} catch (err) {
			codeError = err instanceof Error ? err.message : 'Invalid verification code';
			updateState({
				error:
					method === 'totp'
						? 'Invalid verification code. Please check your authenticator app and try again.'
						: 'Invalid backup code. Please check and try again.',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Switch method
	 */
	function switchMethod(newMethod: 'totp' | 'backup') {
		method = newMethod;
		code = '';
		codeError = null;
		clearError();
	}

	/**
	 * Handle enter key
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !authState.loading) {
			handleVerify();
		}
	}
</script>

<div class={`auth-verify ${className}`}>
	<div class="auth-verify__icon">
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
			/>
		</svg>
	</div>

	<h2 class="auth-verify__title">{title}</h2>

	{#if authState.twoFactorSession}
		<p class="auth-verify__description">
			Enter the verification code for <strong>{authState.twoFactorSession.email}</strong>
		</p>
	{/if}

	{#if authState.error}
		<div class="auth-verify__error" role="alert">
			<svg class="auth-verify__error-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{authState.error}
		</div>
	{/if}

	{#if showBackupOption && authState.twoFactorSession?.methods.includes('backup')}
		<div class="auth-verify__tabs">
			<button
				class="auth-verify__tab"
				class:auth-verify__tab--active={method === 'totp'}
				onclick={() => switchMethod('totp')}
				disabled={authState.loading}
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
					/>
				</svg>
				Authenticator App
			</button>

			<button
				class="auth-verify__tab"
				class:auth-verify__tab--active={method === 'backup'}
				onclick={() => switchMethod('backup')}
				disabled={authState.loading}
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
					/>
				</svg>
				Backup Code
			</button>
		</div>
	{/if}

	<div class="auth-verify__content">
		{#if method === 'totp'}
			<div class="auth-verify__field">
				<label for="verify-code" class="auth-verify__label">6-Digit Code</label>
				<input
					id="verify-code"
					type="text"
					class="auth-verify__input"
					class:auth-verify__input--error={codeError}
					bind:value={code}
					placeholder="000000"
					maxlength="6"
					pattern="[0-9]*"
					inputmode="numeric"
					disabled={authState.loading}
					onkeydown={handleKeyDown}
				/>
				{#if codeError}
					<span class="auth-verify__field-error">{codeError}</span>
				{:else}
					<span class="auth-verify__field-hint">Enter the code from your authenticator app</span>
				{/if}
			</div>
		{:else}
			<div class="auth-verify__field">
				<label for="verify-backup" class="auth-verify__label">Backup Code</label>
				<input
					id="verify-backup"
					type="text"
					class="auth-verify__input"
					class:auth-verify__input--error={codeError}
					bind:value={code}
					placeholder="XXXX-XXXX-XXXX"
					disabled={authState.loading}
					onkeydown={handleKeyDown}
				/>
				{#if codeError}
					<span class="auth-verify__field-error">{codeError}</span>
				{:else}
					<span class="auth-verify__field-hint">
						Enter one of your backup codes saved during setup
					</span>
				{/if}
			</div>

			<div class="auth-verify__warning">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
				</svg>
				<span>Each backup code can only be used once</span>
			</div>
		{/if}

		<button
			use:verifyButton.actions.button
			class="auth-verify__submit"
			disabled={authState.loading || !code.trim() || (method === 'totp' && code.length !== 6)}
		>
			{#if authState.loading}
				<span class="auth-verify__spinner"></span>
				Verifying...
			{:else}
				Verify
			{/if}
		</button>
	</div>

	<div class="auth-verify__help">
		<p>
			Lost access to your authentication method?
			<a href="/help/2fa" class="auth-verify__link">Get help</a>
		</p>
	</div>
</div>

<style>
	.auth-verify {
		width: 100%;
		max-width: 28rem;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
	}

	.auth-verify__icon {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.auth-verify__icon svg {
		width: 3rem;
		height: 3rem;
		color: var(--primary-color, #1d9bf0);
	}

	.auth-verify__title {
		margin: 0 0 0.75rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.auth-verify__description {
		margin: 0 0 1.5rem 0;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		line-height: 1.5;
	}

	.auth-verify__description strong {
		color: var(--text-primary, #0f1419);
		font-weight: 600;
	}

	/* Error Alert */
	.auth-verify__error {
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
		text-align: left;
	}

	.auth-verify__error-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Tabs */
	.auth-verify__tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding: 0.25rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 9999px;
	}

	.auth-verify__tab {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: transparent;
		border: none;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		transition: all 0.2s;
	}

	.auth-verify__tab svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.auth-verify__tab--active {
		background: white;
		color: var(--text-primary, #0f1419);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.auth-verify__tab:not(.auth-verify__tab--active):hover:not(:disabled) {
		color: var(--text-primary, #0f1419);
	}

	.auth-verify__tab:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Content */
	.auth-verify__content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		text-align: left;
	}

	.auth-verify__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.auth-verify__label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-verify__input {
		width: 100%;
		padding: 0.875rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 1.25rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		text-align: center;
		letter-spacing: 0.25em;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		transition: all 0.2s;
	}

	.auth-verify__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.1);
	}

	.auth-verify__input--error {
		border-color: #f4211e;
	}

	.auth-verify__input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-verify__field-error {
		font-size: 0.75rem;
		color: #f4211e;
	}

	.auth-verify__field-hint {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	/* Warning */
	.auth-verify__warning {
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

	.auth-verify__warning svg {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Submit Button */
	.auth-verify__submit {
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

	.auth-verify__submit:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-verify__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Loading Spinner */
	.auth-verify__spinner {
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

	/* Help */
	.auth-verify__help {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.auth-verify__help p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.auth-verify__link {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
		font-weight: 600;
	}

	.auth-verify__link:hover {
		text-decoration: underline;
	}
</style>
