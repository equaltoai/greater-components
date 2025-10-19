<!--
  Auth.LoginForm - Email/Password Login
  
  Provides email and password login with optional WebAuthn biometric authentication.
  Supports "remember me" and forgot password flows.
  
  @component
  @example
  ```svelte
  <Auth.Root {handlers}>
    <Auth.LoginForm 
      showWebAuthn={true}
      showRememberMe={true}
    />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAuthContext, isValidEmail } from './context.js';
	import type { LoginCredentials } from './context.js';

	interface Props {
		/**
		 * Show WebAuthn (biometric) login option
		 * @default true
		 */
		showWebAuthn?: boolean;

		/**
		 * Show "remember me" checkbox
		 * @default true
		 */
		showRememberMe?: boolean;

		/**
		 * Show "forgot password" link
		 * @default true
		 */
		showForgotPassword?: boolean;

		/**
		 * Show link to registration
		 * @default true
		 */
		showRegisterLink?: boolean;

		/**
		 * Custom title
		 * @default "Sign In"
		 */
		title?: string;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		showWebAuthn = true,
		showRememberMe = true,
		showForgotPassword = true,
		showRegisterLink = true,
		title = 'Sign In',
		class: className = '',
	}: Props = $props();

	const { state: authState, handlers, updateState, clearError } = getAuthContext();

	let email = $state('');
	let password = $state('');
	let remember = $state(false);
	let emailError = $state<string | null>(null);
	let passwordError = $state<string | null>(null);

	const submitButton = createButton({
		onClick: () => handleSubmit(),
	});

	const webAuthnButton = createButton({
		onClick: () => handleWebAuthn(),
	});

	/**
	 * Validate form inputs
	 */
	function validateForm(): boolean {
		emailError = null;
		passwordError = null;
		let valid = true;

		if (!email.trim()) {
			emailError = 'Email is required';
			valid = false;
		} else if (!isValidEmail(email)) {
			emailError = 'Invalid email format';
			valid = false;
		}

		if (!password.trim()) {
			passwordError = 'Password is required';
			valid = false;
		}

		return valid;
	}

	/**
	 * Handle form submission
	 */
	async function handleSubmit() {
		if (authState.loading) return;

		clearError();

		if (!validateForm()) return;

		updateState({ loading: true });

		try {
			const credentials: LoginCredentials = {
				email: email.trim(),
				password,
				remember,
			};

			await handlers.onLogin?.(credentials);
		} catch (err) {
			updateState({
				error: err instanceof Error ? err.message : 'Login failed',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle WebAuthn login
	 */
	async function handleWebAuthn() {
		if (authState.loading) return;

		clearError();

		if (!email.trim()) {
			emailError = 'Email is required for WebAuthn';
			return;
		}

		if (!isValidEmail(email)) {
			emailError = 'Invalid email format';
			return;
		}

		updateState({ loading: true });

		try {
			await handlers.onWebAuthnLogin?.({ email: email.trim() });
		} catch (err) {
			updateState({
				error: err instanceof Error ? err.message : 'WebAuthn login failed',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle enter key in form
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !authState.loading) {
			handleSubmit();
		}
	}
</script>

<div class={`auth-login ${className}`}>
	<h2 class="auth-login__title">{title}</h2>

	{#if authState.error}
		<div class="auth-login__error" role="alert">
			<svg class="auth-login__error-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{authState.error}
		</div>
	{/if}

	<form
		class="auth-login__form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<div class="auth-login__field">
			<label for="login-email" class="auth-login__label">Email</label>
			<input
				id="login-email"
				type="email"
				class="auth-login__input"
				class:auth-login__input--error={emailError}
				bind:value={email}
				placeholder="you@example.com"
				required
				disabled={authState.loading}
				autocomplete="email"
				onkeydown={handleKeyDown}
			/>
			{#if emailError}
				<span class="auth-login__field-error">{emailError}</span>
			{/if}
		</div>

		<div class="auth-login__field">
			<label for="login-password" class="auth-login__label">Password</label>
			<input
				id="login-password"
				type="password"
				class="auth-login__input"
				class:auth-login__input--error={passwordError}
				bind:value={password}
				placeholder="••••••••"
				required
				disabled={authState.loading}
				autocomplete="current-password"
				onkeydown={handleKeyDown}
			/>
			{#if passwordError}
				<span class="auth-login__field-error">{passwordError}</span>
			{/if}
		</div>

		<div class="auth-login__options">
			{#if showRememberMe}
				<label class="auth-login__checkbox">
					<input type="checkbox" bind:checked={remember} disabled={authState.loading} />
					<span>Remember me</span>
				</label>
			{/if}

			{#if showForgotPassword}
				<button
					type="button"
					class="auth-login__link"
					onclick={() => handlers.onNavigateToForgotPassword?.()}
					disabled={authState.loading}
				>
					Forgot password?
				</button>
			{/if}
		</div>

		<button
			use:submitButton.actions.button
			class="auth-login__submit"
			disabled={authState.loading || !email || !password}
		>
			{#if authState.loading}
				<span class="auth-login__spinner"></span>
				Signing in...
			{:else}
				Sign In
			{/if}
		</button>
	</form>

	{#if showWebAuthn}
		<div class="auth-login__divider">
			<span>or</span>
		</div>

		<button
			use:webAuthnButton.actions.button
			class="auth-login__webauthn"
			disabled={authState.loading || !email}
		>
			<svg class="auth-login__webauthn-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
				/>
			</svg>
			Sign in with biometric or security key
		</button>
	{/if}

	{#if showRegisterLink}
		<div class="auth-login__register">
			Don't have an account?
			<button
				class="auth-login__link"
				onclick={() => handlers.onNavigateToRegister?.()}
				disabled={authState.loading}
			>
				Sign up
			</button>
		</div>
	{/if}
</div>

<style>
	.auth-login {
		width: 100%;
		max-width: 28rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.auth-login__title {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		color: var(--text-primary, #0f1419);
	}

	/* Error Alert */
	.auth-login__error {
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

	.auth-login__error-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Form */
	.auth-login__form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-login__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.auth-login__label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-login__input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 1rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		transition: all 0.2s;
	}

	.auth-login__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.1);
	}

	.auth-login__input--error {
		border-color: #f4211e;
	}

	.auth-login__input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-login__field-error {
		font-size: 0.75rem;
		color: #f4211e;
	}

	/* Options Row */
	.auth-login__options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: -0.5rem;
	}

	.auth-login__checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
	}

	.auth-login__checkbox input {
		cursor: pointer;
	}

	/* Submit Button */
	.auth-login__submit {
		width: 100%;
		padding: 0.875rem;
		margin-top: 0.5rem;
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

	.auth-login__submit:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-login__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Loading Spinner */
	.auth-login__spinner {
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

	/* Divider */
	.auth-login__divider {
		display: flex;
		align-items: center;
		margin: 1.5rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.auth-login__divider::before,
	.auth-login__divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--border-color, #e1e8ed);
	}

	.auth-login__divider span {
		padding: 0 1rem;
	}

	/* WebAuthn Button */
	.auth-login__webauthn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.875rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
		transition: all 0.2s;
	}

	.auth-login__webauthn:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.auth-login__webauthn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.auth-login__webauthn-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Register Link */
	.auth-login__register {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.auth-login__link {
		padding: 0;
		background: none;
		border: none;
		color: var(--primary-color, #1d9bf0);
		font-size: inherit;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition: text-decoration 0.2s;
	}

	.auth-login__link:hover:not(:disabled) {
		text-decoration: underline;
	}

	.auth-login__link:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
