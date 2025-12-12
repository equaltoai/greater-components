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

	$effect(() => {
		submitButton.helpers.setLoading(authState.loading);
		submitButton.helpers.setDisabled(!email || !password);
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
