<!--
  Auth.RegisterForm - Account Registration
  
  Provides account registration with email, username, and password.
  Includes validation, terms agreement, and optional invite code support.
  
  @component
  @example
  ```svelte
  <Auth.Root {handlers}>
    <Auth.RegisterForm 
      requireInvite={false}
      showLoginLink={true}
    />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getAuthContext, isValidEmail, isValidPassword, isValidUsername } from './context.js';
	import type { RegisterData } from './context.js';

	interface Props {
		/**
		 * Require invite code for registration
		 * @default false
		 */
		requireInvite?: boolean;

		/**
		 * Show link to login page
		 * @default true
		 */
		showLoginLink?: boolean;

		/**
		 * Custom title
		 * @default "Create Account"
		 */
		title?: string;

		/**
		 * Terms of service URL
		 */
		termsUrl?: string;

		/**
		 * Privacy policy URL
		 */
		privacyUrl?: string;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		requireInvite = false,
		showLoginLink = true,
		title = 'Create Account',
		termsUrl,
		privacyUrl,
		class: className = '',
	}: Props = $props();

	const { state, handlers, updateState, clearError } = getAuthContext();

	let email = $state('');
	let username = $state('');
	let displayName = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let inviteCode = $state('');
	let agreeToTerms = $state(false);

	let emailError = $state<string | null>(null);
	let usernameError = $state<string | null>(null);
	let passwordError = $state<string | null>(null);
	let confirmPasswordError = $state<string | null>(null);
	let inviteError = $state<string | null>(null);
	let termsError = $state<string | null>(null);

	const submitButton = createButton({
		onClick: () => handleSubmit(),
	});

	/**
	 * Validate form inputs
	 */
	function validateForm(): boolean {
		emailError = null;
		usernameError = null;
		passwordError = null;
		confirmPasswordError = null;
		inviteError = null;
		termsError = null;
		let valid = true;

		// Email validation
		if (!email.trim()) {
			emailError = 'Email is required';
			valid = false;
		} else if (!isValidEmail(email)) {
			emailError = 'Invalid email format';
			valid = false;
		}

		// Username validation
		if (!username.trim()) {
			usernameError = 'Username is required';
			valid = false;
		} else {
			const usernameValidation = isValidUsername(username);
			if (!usernameValidation.valid) {
				usernameError = usernameValidation.message || 'Invalid username';
				valid = false;
			}
		}

		// Password validation
		if (!password) {
			passwordError = 'Password is required';
			valid = false;
		} else {
			const passwordValidation = isValidPassword(password);
			if (!passwordValidation.valid) {
				passwordError = passwordValidation.message || 'Invalid password';
				valid = false;
			}
		}

		// Confirm password validation
		if (!confirmPassword) {
			confirmPasswordError = 'Please confirm your password';
			valid = false;
		} else if (password !== confirmPassword) {
			confirmPasswordError = 'Passwords do not match';
			valid = false;
		}

		// Invite code validation
		if (requireInvite && !inviteCode.trim()) {
			inviteError = 'Invite code is required';
			valid = false;
		}

		// Terms agreement validation
		if (!agreeToTerms) {
			termsError = 'You must agree to the terms to continue';
			valid = false;
		}

		return valid;
	}

	/**
	 * Handle form submission
	 */
	async function handleSubmit() {
		if (state.loading) return;

		clearError();

		if (!validateForm()) return;

		updateState({ loading: true });

		try {
			const data: RegisterData = {
				email: email.trim(),
				username: username.trim(),
				displayName: displayName.trim() || undefined,
				password,
				agreeToTerms: true,
				inviteCode: requireInvite ? inviteCode.trim() : undefined,
			};

			await handlers.onRegister?.(data);
		} catch (err) {
			updateState({
				error: err instanceof Error ? err.message : 'Registration failed',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle enter key in form
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !state.loading) {
			handleSubmit();
		}
	}
</script>

<div class="auth-register {className}">
	<h2 class="auth-register__title">{title}</h2>

	{#if state.error}
		<div class="auth-register__error" role="alert">
			<svg class="auth-register__error-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{state.error}
		</div>
	{/if}

	<form
		class="auth-register__form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<div class="auth-register__field">
			<label for="register-email" class="auth-register__label">Email</label>
			<input
				id="register-email"
				type="email"
				class="auth-register__input"
				class:auth-register__input--error={emailError}
				bind:value={email}
				placeholder="you@example.com"
				required
				disabled={state.loading}
				autocomplete="email"
				onkeydown={handleKeyDown}
			/>
			{#if emailError}
				<span class="auth-register__field-error">{emailError}</span>
			{/if}
		</div>

		<div class="auth-register__field">
			<label for="register-username" class="auth-register__label">Username</label>
			<input
				id="register-username"
				type="text"
				class="auth-register__input"
				class:auth-register__input--error={usernameError}
				bind:value={username}
				placeholder="username"
				required
				disabled={state.loading}
				autocomplete="username"
				onkeydown={handleKeyDown}
			/>
			{#if usernameError}
				<span class="auth-register__field-error">{usernameError}</span>
			{:else}
				<span class="auth-register__field-hint">Letters, numbers, and underscores only</span>
			{/if}
		</div>

		<div class="auth-register__field">
			<label for="register-display-name" class="auth-register__label">
				Display Name
				<span class="auth-register__optional">(optional)</span>
			</label>
			<input
				id="register-display-name"
				type="text"
				class="auth-register__input"
				bind:value={displayName}
				placeholder="Your Name"
				disabled={state.loading}
				autocomplete="name"
				onkeydown={handleKeyDown}
			/>
			<span class="auth-register__field-hint">How your name appears to others</span>
		</div>

		<div class="auth-register__field">
			<label for="register-password" class="auth-register__label">Password</label>
			<input
				id="register-password"
				type="password"
				class="auth-register__input"
				class:auth-register__input--error={passwordError}
				bind:value={password}
				placeholder="••••••••"
				required
				disabled={state.loading}
				autocomplete="new-password"
				onkeydown={handleKeyDown}
			/>
			{#if passwordError}
				<span class="auth-register__field-error">{passwordError}</span>
			{:else}
				<span class="auth-register__field-hint">
					At least 8 characters with uppercase, lowercase, and number
				</span>
			{/if}
		</div>

		<div class="auth-register__field">
			<label for="register-confirm-password" class="auth-register__label"> Confirm Password </label>
			<input
				id="register-confirm-password"
				type="password"
				class="auth-register__input"
				class:auth-register__input--error={confirmPasswordError}
				bind:value={confirmPassword}
				placeholder="••••••••"
				required
				disabled={state.loading}
				autocomplete="new-password"
				onkeydown={handleKeyDown}
			/>
			{#if confirmPasswordError}
				<span class="auth-register__field-error">{confirmPasswordError}</span>
			{/if}
		</div>

		{#if requireInvite}
			<div class="auth-register__field">
				<label for="register-invite" class="auth-register__label">Invite Code</label>
				<input
					id="register-invite"
					type="text"
					class="auth-register__input"
					class:auth-register__input--error={inviteError}
					bind:value={inviteCode}
					placeholder="Enter invite code"
					required
					disabled={state.loading}
					onkeydown={handleKeyDown}
				/>
				{#if inviteError}
					<span class="auth-register__field-error">{inviteError}</span>
				{/if}
			</div>
		{/if}

		<div class="auth-register__terms">
			<label class="auth-register__checkbox" class:auth-register__checkbox--error={termsError}>
				<input type="checkbox" bind:checked={agreeToTerms} disabled={state.loading} required />
				<span>
					I agree to the
					{#if termsUrl}
						<a href={termsUrl} target="_blank" rel="noopener noreferrer">Terms of Service</a>
					{:else}
						Terms of Service
					{/if}
					{#if privacyUrl}
						and
						<a href={privacyUrl} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
					{/if}
				</span>
			</label>
			{#if termsError}
				<span class="auth-register__field-error">{termsError}</span>
			{/if}
		</div>

		<button
			use:submitButton.actions.button
			class="auth-register__submit"
			disabled={state.loading || !agreeToTerms}
		>
			{#if state.loading}
				<span class="auth-register__spinner"></span>
				Creating account...
			{:else}
				Create Account
			{/if}
		</button>
	</form>

	{#if showLoginLink}
		<div class="auth-register__login">
			Already have an account?
			<button
				class="auth-register__link"
				onclick={() => handlers.onNavigateToLogin?.()}
				disabled={state.loading}
			>
				Sign in
			</button>
		</div>
	{/if}
</div>

<style>
	.auth-register {
		width: 100%;
		max-width: 28rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.auth-register__title {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		color: var(--text-primary, #0f1419);
	}

	/* Error Alert */
	.auth-register__error {
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

	.auth-register__error-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Form */
	.auth-register__form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-register__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.auth-register__label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-register__optional {
		font-weight: 400;
		color: var(--text-secondary, #536471);
	}

	.auth-register__input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 1rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		transition: all 0.2s;
	}

	.auth-register__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.1);
	}

	.auth-register__input--error {
		border-color: #f4211e;
	}

	.auth-register__input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-register__field-error {
		font-size: 0.75rem;
		color: #f4211e;
	}

	.auth-register__field-hint {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	/* Terms */
	.auth-register__terms {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.5rem;
	}

	.auth-register__checkbox {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
		line-height: 1.5;
	}

	.auth-register__checkbox input {
		margin-top: 0.25rem;
		cursor: pointer;
		flex-shrink: 0;
	}

	.auth-register__checkbox--error {
		color: #f4211e;
	}

	.auth-register__checkbox a {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.auth-register__checkbox a:hover {
		text-decoration: underline;
	}

	/* Submit Button */
	.auth-register__submit {
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

	.auth-register__submit:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-register__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Loading Spinner */
	.auth-register__spinner {
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
	.auth-register__login {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.auth-register__link {
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

	.auth-register__link:hover:not(:disabled) {
		text-decoration: underline;
	}

	.auth-register__link:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
