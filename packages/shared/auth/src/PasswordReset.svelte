<script lang="ts">
	import { untrack } from 'svelte';
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAuthContext, isValidEmail, isValidPassword } from './context.js';
	import type { PasswordResetData } from './context.js';

	interface Props {
		/**
		 * Mode: request reset or confirm with token
		 * @default "request"
		 */
		mode?: 'request' | 'confirm';

		/**
		 * Reset token (required for confirm mode)
		 */
		token?: string;

		/**
		 * Pre-filled email
		 */
		email?: string;

		/**
		 * Show link to login page
		 * @default true
		 */
		showLoginLink?: boolean;

		/**
		 * Callback when reset is requested successfully
		 */
		onRequestSuccess?: (email: string) => void;

		/**
		 * Callback when password is reset successfully
		 */
		onResetSuccess?: () => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		mode = 'request',
		token,
		email: initialEmail = '',
		showLoginLink = true,
		onRequestSuccess,
		onResetSuccess,
		class: className = '',
	}: Props = $props();

	const { state: authState, handlers, updateState, clearError } = getAuthContext();

	let email = $state(untrack(() => initialEmail));

	$effect(() => {
		email = initialEmail;
	});
	let newPassword = $state('');
	let confirmPassword = $state('');
	let requestSent = $state(false);

	let emailError = $state<string | null>(null);
	let passwordError = $state<string | null>(null);
	let confirmPasswordError = $state<string | null>(null);

	const requestButton = createButton({
		onClick: () => handleRequest(),
	});

	const resetButton = createButton({
		onClick: () => handleReset(),
	});

	/**
	 * Validate request form
	 */
	function validateRequest(): boolean {
		emailError = null;
		let valid = true;

		if (!email.trim()) {
			emailError = 'Email is required';
			valid = false;
		} else if (!isValidEmail(email)) {
			emailError = 'Invalid email format';
			valid = false;
		}

		return valid;
	}

	/**
	 * Validate reset form
	 */
	function validateReset(): boolean {
		passwordError = null;
		confirmPasswordError = null;
		let valid = true;

		// Password validation
		if (!newPassword) {
			passwordError = 'Password is required';
			valid = false;
		} else {
			const passwordValidation = isValidPassword(newPassword);
			if (!passwordValidation.valid) {
				passwordError = passwordValidation.message || 'Invalid password';
				valid = false;
			}
		}

		// Confirm password validation
		if (!confirmPassword) {
			confirmPasswordError = 'Please confirm your password';
			valid = false;
		} else if (newPassword !== confirmPassword) {
			confirmPasswordError = 'Passwords do not match';
			valid = false;
		}

		return valid;
	}

	/**
	 * Handle password reset request
	 */
	async function handleRequest() {
		if (authState.loading) return;

		clearError();

		if (!validateRequest()) return;

		updateState({ loading: true });

		try {
			await handlers.onPasswordResetRequest?.(email.trim());
			requestSent = true;
			onRequestSuccess?.(email.trim());
		} catch (err) {
			updateState({
				error: err instanceof Error ? err.message : 'Failed to send reset email',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle password reset confirmation
	 */
	async function handleReset() {
		if (authState.loading || !token) return;

		clearError();

		if (!validateReset()) return;

		updateState({ loading: true });

		try {
			const data: PasswordResetData = {
				email: email.trim(),
				token,
				newPassword,
			};

			await handlers.onPasswordResetConfirm?.(data);
			onResetSuccess?.();
		} catch (err) {
			updateState({
				error: err instanceof Error ? err.message : 'Failed to reset password',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle enter key
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !authState.loading) {
			if (mode === 'request') {
				handleRequest();
			} else {
				handleReset();
			}
		}
	}
</script>

<!--
  Auth.PasswordReset - Password Reset/Recovery
  
  Two-step password reset: request reset via email, then confirm with token.
  Supports both requesting a reset and confirming a reset with token.
  
  @component
  @example
  ```svelte
  <Auth.Root {handlers}>
    <Auth.PasswordReset mode="request" />
  </Auth.Root>
  
  Or with token for confirmation:

  <Auth.Root {handlers}>
	<Auth.PasswordReset mode="confirm" token="abc123" />
  </Auth.Root>
``` -->

<div class={`auth-reset ${className}`}>
	{#if mode === 'request'}
		{#if requestSent}
			<div class="auth-reset__success">
				<div class="auth-reset__success-icon">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
						/>
					</svg>
				</div>
				<h2 class="auth-reset__title">Check your email</h2>
				<p class="auth-reset__description">
					We've sent password reset instructions to <strong>{email}</strong>
				</p>
				<p class="auth-reset__hint">
					Click the link in the email to reset your password. The link will expire in 1 hour.
				</p>

				<div class="auth-reset__actions">
					<button
						class="auth-reset__button auth-reset__button--secondary"
						onclick={() => {
							requestSent = false;
							email = '';
						}}
					>
						Send to different email
					</button>
				</div>
			</div>
		{:else}
			<h2 class="auth-reset__title">Reset your password</h2>
			<p class="auth-reset__description">
				Enter your email address and we'll send you instructions to reset your password.
			</p>

			{#if authState.error}
				<div class="auth-reset__error" role="alert">
					<svg class="auth-reset__error-icon" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
						/>
					</svg>
					{authState.error}
				</div>
			{/if}

			<form
				class="auth-reset__form"
				onsubmit={(e) => {
					e.preventDefault();
					handleRequest();
				}}
			>
				<div class="auth-reset__field">
					<label for="reset-email" class="auth-reset__label">Email</label>
					<input
						id="reset-email"
						type="email"
						class="auth-reset__input"
						class:auth-reset__input--error={emailError}
						bind:value={email}
						placeholder="you@example.com"
						required
						disabled={authState.loading}
						autocomplete="email"
						onkeydown={handleKeyDown}
					/>
					{#if emailError}
						<span class="auth-reset__field-error">{emailError}</span>
					{/if}
				</div>

				<button
					use:requestButton.actions.button
					class="auth-reset__submit"
					disabled={authState.loading || !email}
				>
					{#if authState.loading}
						<span class="auth-reset__spinner"></span>
						Sending...
					{:else}
						Send Reset Instructions
					{/if}
				</button>
			</form>
		{/if}
	{:else if mode === 'confirm'}
		<h2 class="auth-reset__title">Create new password</h2>
		<p class="auth-reset__description">Enter your new password below.</p>

		{#if authState.error}
			<div class="auth-reset__error" role="alert">
				<svg class="auth-reset__error-icon" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
					/>
				</svg>
				{authState.error}
			</div>
		{/if}

		<form
			class="auth-reset__form"
			onsubmit={(e) => {
				e.preventDefault();
				handleReset();
			}}
		>
			<div class="auth-reset__field">
				<label for="reset-new-password" class="auth-reset__label">New Password</label>
				<input
					id="reset-new-password"
					type="password"
					class="auth-reset__input"
					class:auth-reset__input--error={passwordError}
					bind:value={newPassword}
					placeholder="••••••••"
					required
					disabled={authState.loading}
					autocomplete="new-password"
					onkeydown={handleKeyDown}
				/>
				{#if passwordError}
					<span class="auth-reset__field-error">{passwordError}</span>
				{:else}
					<span class="auth-reset__field-hint">
						At least 8 characters with uppercase, lowercase, and number
					</span>
				{/if}
			</div>

			<div class="auth-reset__field">
				<label for="reset-confirm-password" class="auth-reset__label">Confirm Password</label>
				<input
					id="reset-confirm-password"
					type="password"
					class="auth-reset__input"
					class:auth-reset__input--error={confirmPasswordError}
					bind:value={confirmPassword}
					placeholder="••••••••"
					required
					disabled={authState.loading}
					autocomplete="new-password"
					onkeydown={handleKeyDown}
				/>
				{#if confirmPasswordError}
					<span class="auth-reset__field-error">{confirmPasswordError}</span>
				{/if}
			</div>

			<button
				use:resetButton.actions.button
				class="auth-reset__submit"
				disabled={authState.loading || !newPassword || !confirmPassword}
			>
				{#if authState.loading}
					<span class="auth-reset__spinner"></span>
					Resetting password...
				{:else}
					Reset Password
				{/if}
			</button>
		</form>
	{/if}

	{#if showLoginLink}
		<div class="auth-reset__login">
			Remember your password?
			<button
				class="auth-reset__link"
				onclick={() => handlers.onNavigateToLogin?.()}
				disabled={authState.loading}
			>
				Sign in
			</button>
		</div>
	{/if}
</div>
