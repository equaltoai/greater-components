<!--
  Auth.WebAuthnSetup - Biometric/Security Key Setup
  
  Allows users to register WebAuthn credentials (fingerprint, face ID, security keys)
  for passwordless authentication.
  
  @component
  @example
  ```svelte
  <Auth.Root {handlers}>
    <Auth.WebAuthnSetup email="user@example.com" />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAuthContext } from './context.js';

	interface Props {
		/**
		 * User's email for WebAuthn registration
		 */
		email: string;

		/**
		 * Custom title
		 * @default "Set Up Biometric Authentication"
		 */
		title?: string;

		/**
		 * Show option to skip setup
		 * @default true
		 */
		showSkip?: boolean;

		/**
		 * Callback when setup is skipped
		 */
		onSkip?: () => void;

		/**
		 * Callback when setup is complete
		 */
		onComplete?: () => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		email,
		title = 'Set Up Biometric Authentication',
		showSkip = true,
		onSkip,
		onComplete,
		class: className = '',
	}: Props = $props();

	const { state: authState, handlers, updateState, clearError } = getAuthContext();

	let registrationStep = $state<'intro' | 'registering' | 'success' | 'error'>('intro');

	const setupButton = createButton({
		onClick: () => handleSetup(),
	});

	const skipButton = createButton({
		onClick: () => handleSkip(),
	});

	const doneButton = createButton({
		onClick: () => handleDone(),
	});

	/**
	 * Check if WebAuthn is available
	 */
	const isWebAuthnAvailable = typeof window !== 'undefined' && 'credentials' in navigator;

	/**
	 * Handle WebAuthn setup
	 */
	async function handleSetup() {
		if (authState.loading || !isWebAuthnAvailable) return;

		clearError();
		registrationStep = 'registering';
		updateState({ loading: true });

		try {
			await handlers.onWebAuthnRegister?.(email);
			registrationStep = 'success';
			onComplete?.();
		} catch (err) {
			registrationStep = 'error';
			updateState({
				error: err instanceof Error ? err.message : 'WebAuthn registration failed',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle skip
	 */
	function handleSkip() {
		if (authState.loading) return;
		onSkip?.();
	}

	/**
	 * Handle done after success
	 */
	function handleDone() {
		onComplete?.();
	}
</script>

<div class={`auth-webauthn ${className}`}>
	<h2 class="auth-webauthn__title">{title}</h2>

	{#if !isWebAuthnAvailable}
		<div class="auth-webauthn__unavailable">
			<svg class="auth-webauthn__unavailable-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			<p>
				WebAuthn is not available in your browser. Please use a modern browser like Chrome, Firefox,
				Safari, or Edge.
			</p>
		</div>
	{:else if registrationStep === 'intro'}
		<div class="auth-webauthn__intro">
			<div class="auth-webauthn__icon-container">
				<svg class="auth-webauthn__icon" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
					/>
				</svg>
			</div>

			<div class="auth-webauthn__content">
				<h3 class="auth-webauthn__subtitle">Sign in faster and more securely</h3>
				<p class="auth-webauthn__description">
					Use your fingerprint, face ID, or security key to sign in without typing your password.
				</p>

				<ul class="auth-webauthn__benefits">
					<li>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
						More secure than passwords
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
						Sign in with a tap or glance
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
						Works across all your devices
					</li>
				</ul>
			</div>

			{#if authState.error}
				<div class="auth-webauthn__error" role="alert">
					{authState.error}
				</div>
			{/if}

			<button
				use:setupButton.actions.button
				class="auth-webauthn__setup"
				disabled={authState.loading}
			>
				{#if authState.loading}
					<span class="auth-webauthn__spinner"></span>
					Setting up...
				{:else}
					Set Up Now
				{/if}
			</button>

			{#if showSkip}
				<button
					use:skipButton.actions.button
					class="auth-webauthn__skip"
					disabled={authState.loading}
				>
					Skip for now
				</button>
			{/if}
		</div>
	{:else if registrationStep === 'registering'}
		<div class="auth-webauthn__registering">
			<div class="auth-webauthn__spinner-large"></div>
			<p class="auth-webauthn__registering-text">
				Please follow the prompts on your device to register your biometric or security key...
			</p>
		</div>
	{:else if registrationStep === 'success'}
		<div class="auth-webauthn__success">
			<div class="auth-webauthn__success-icon">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
				</svg>
			</div>
			<h3 class="auth-webauthn__subtitle">You're all set!</h3>
			<p class="auth-webauthn__description">
				Your biometric authentication has been set up successfully. You can now sign in with a tap
				or glance.
			</p>
			<button use:doneButton.actions.button class="auth-webauthn__setup">Done</button>
		</div>
	{:else if registrationStep === 'error'}
		<div class="auth-webauthn__error-state">
			<svg class="auth-webauthn__error-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			<h3 class="auth-webauthn__subtitle">Setup Failed</h3>
			<p class="auth-webauthn__description">
				{authState.error || "We couldn't set up your biometric authentication. Please try again."}
			</p>
			<button use:setupButton.actions.button class="auth-webauthn__setup">Try Again</button>
			{#if showSkip}
				<button use:skipButton.actions.button class="auth-webauthn__skip">Skip for now</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.auth-webauthn {
		width: 100%;
		max-width: 28rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.auth-webauthn__title {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		color: var(--text-primary, #0f1419);
	}

	/* Unavailable State */
	.auth-webauthn__unavailable {
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}

	.auth-webauthn__unavailable-icon {
		width: 3rem;
		height: 3rem;
		margin: 0 auto 1rem;
		color: rgba(244, 33, 46, 0.7);
	}

	.auth-webauthn__unavailable p {
		margin: 0;
		line-height: 1.5;
	}

	/* Intro State */
	.auth-webauthn__intro {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		text-align: center;
	}

	.auth-webauthn__icon-container {
		display: flex;
		justify-content: center;
	}

	.auth-webauthn__icon {
		width: 4rem;
		height: 4rem;
		color: var(--primary-color, #1d9bf0);
	}

	.auth-webauthn__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-webauthn__subtitle {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-webauthn__description {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		line-height: 1.5;
	}

	.auth-webauthn__benefits {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0.5rem 0 0 0;
		padding: 0;
		list-style: none;
		text-align: left;
	}

	.auth-webauthn__benefits li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.auth-webauthn__benefits svg {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--success-color, #00ba7c);
		flex-shrink: 0;
	}

	/* Error Alert */
	.auth-webauthn__error {
		padding: 0.875rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid rgba(244, 33, 46, 0.3);
		border-radius: 0.5rem;
		color: #f4211e;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	/* Buttons */
	.auth-webauthn__setup {
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

	.auth-webauthn__setup:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-webauthn__setup:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.auth-webauthn__skip {
		width: 100%;
		padding: 0.875rem;
		background: transparent;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		transition: color 0.2s;
	}

	.auth-webauthn__skip:hover:not(:disabled) {
		color: var(--text-primary, #0f1419);
	}

	.auth-webauthn__skip:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Registering State */
	.auth-webauthn__registering {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 3rem 1rem;
		text-align: center;
	}

	.auth-webauthn__spinner-large {
		width: 3rem;
		height: 3rem;
		border: 3px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.auth-webauthn__registering-text {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		line-height: 1.5;
	}

	/* Loading Spinner */
	.auth-webauthn__spinner {
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

	/* Success State */
	.auth-webauthn__success {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		text-align: center;
		padding: 1rem 0;
	}

	.auth-webauthn__success-icon {
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--success-color, #00ba7c);
		border-radius: 50%;
		color: white;
	}

	.auth-webauthn__success-icon svg {
		width: 2.5rem;
		height: 2.5rem;
	}

	/* Error State */
	.auth-webauthn__error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		text-align: center;
		padding: 1rem 0;
	}

	.auth-webauthn__error-icon {
		width: 4rem;
		height: 4rem;
		color: #f4211e;
	}
</style>
