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

	$effect(() => {
		verifyButton.helpers.setLoading(authState.loading);
		verifyButton.helpers.setDisabled(
			authState.loading || !code.trim() || (method === 'totp' && code.length !== 6)
		);
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
