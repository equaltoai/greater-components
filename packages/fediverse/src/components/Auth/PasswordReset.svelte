<script lang="ts">
	import { createButton } from '@greater/headless/button';
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

	let email = $state(initialEmail);
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

<style>
	.auth-reset {
		width: 100%;
		max-width: 28rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.auth-reset__title {
		margin: 0 0 0.75rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		color: var(--text-primary, #0f1419);
	}

	.auth-reset__description {
		margin: 0 0 1.5rem 0;
		font-size: 0.9375rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		line-height: 1.5;
	}

	.auth-reset__description strong {
		color: var(--text-primary, #0f1419);
		font-weight: 600;
	}

	/* Success State */
	.auth-reset__success {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		text-align: center;
	}

	.auth-reset__success-icon {
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		color: white;
	}

	.auth-reset__success-icon svg {
		width: 2.5rem;
		height: 2.5rem;
	}

	.auth-reset__hint {
		margin: 0;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		line-height: 1.5;
	}

	.auth-reset__actions {
		width: 100%;
	}

	/* Error Alert */
	.auth-reset__error {
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

	.auth-reset__error-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Form */
	.auth-reset__form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-reset__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.auth-reset__label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-reset__input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 1rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		transition: all 0.2s;
	}

	.auth-reset__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.1);
	}

	.auth-reset__input--error {
		border-color: #f4211e;
	}

	.auth-reset__input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-reset__field-error {
		font-size: 0.75rem;
		color: #f4211e;
	}

	.auth-reset__field-hint {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	/* Submit Button */
	.auth-reset__submit {
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

	.auth-reset__submit:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-reset__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Button Variants */
	.auth-reset__button {
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
	}

	.auth-reset__button:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-reset__button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.auth-reset__button--secondary:hover {
		background: var(--bg-hover, #eff3f4);
	}

	/* Loading Spinner */
	.auth-reset__spinner {
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

	/* Login Link */
	.auth-reset__login {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.auth-reset__link {
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

	.auth-reset__link:hover:not(:disabled) {
		text-decoration: underline;
	}

	.auth-reset__link:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
