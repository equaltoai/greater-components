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
