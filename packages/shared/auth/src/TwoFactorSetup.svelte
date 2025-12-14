<!--
  Auth.TwoFactorSetup - Two-Factor Authentication Setup
  
  Allows users to enable TOTP (Time-based One-Time Password) two-factor authentication.
  Displays QR code for authenticator apps and backup codes.
  
  @component
  @example
  ```svelte
  <Auth.Root {handlers}>
    <Auth.TwoFactorSetup onComplete={() => console.log('2FA enabled')} />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAuthContext } from './context.js';

	interface Props {
		/**
		 * Custom title
		 * @default "Enable Two-Factor Authentication"
		 */
		title?: string;

		/**
		 * User's email (for display)
		 */
		email?: string;

		/**
		 * Callback when setup is complete
		 */
		onComplete?: (backupCodes: string[]) => void;

		/**
		 * Callback when setup is cancelled
		 */
		onCancel?: () => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		title = 'Enable Two-Factor Authentication',
		email,
		onComplete,
		onCancel,
		class: className = '',
	}: Props = $props();

	const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
	const hasDocument = typeof document !== 'undefined';

	const { state: authState, handlers, updateState, clearError } = getAuthContext();

	let setupStep = $state<'intro' | 'scan' | 'verify' | 'backup'>('intro');
	let secret = $state<string>('');
	let qrCodeUrl = $state<string>('');
	let backupCodes = $state<string[]>([]);
	let verificationCode = $state('');
	let verificationError = $state<string | null>(null);

	const startButton = createButton({
		onClick: () => handleStart(),
	});

	const verifyButton = createButton({
		onClick: () => handleVerify(),
	});

	const finishButton = createButton({
		onClick: () => handleFinish(),
	});

	const cancelButton = createButton({
		onClick: () => handleCancel(),
	});

	$effect(() => {
		startButton.helpers.setLoading(authState.loading);
		startButton.helpers.setDisabled(authState.loading);

		verifyButton.helpers.setLoading(authState.loading);
		verifyButton.helpers.setDisabled(authState.loading || verificationCode.length !== 6);

		finishButton.helpers.setLoading(authState.loading);

		cancelButton.helpers.setDisabled(authState.loading);
	});

	/**
	 * Start 2FA setup
	 */
	async function handleStart() {
		if (authState.loading) return;

		clearError();
		updateState({ loading: true });

		try {
			const result = await handlers.onTwoFactorSetup?.('totp');
			if (result?.secret) {
				secret = result.secret;
				// Generate QR code URL (would typically be done by backend)
				const issuer = 'Lesser';
				const account = email || 'user@example.com';
				qrCodeUrl = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}`;
				setupStep = 'scan';
			}
		} catch (err) {
			updateState({
				error: err instanceof Error ? err.message : '2FA setup failed',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Verify TOTP code
	 */
	async function handleVerify() {
		if (authState.loading || !verificationCode.trim()) return;

		verificationError = null;
		clearError();
		updateState({ loading: true });

		try {
			await handlers.onTwoFactorVerify?.({
				code: verificationCode.trim(),
				method: 'totp',
			});

			// Generate backup codes
			const result = await handlers.onTwoFactorSetup?.('backup');
			if (result?.codes) {
				backupCodes = result.codes;
			}

			setupStep = 'backup';
		} catch (err) {
			verificationError = err instanceof Error ? err.message : 'Invalid verification code';
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Finish setup
	 */
	function handleFinish() {
		if (authState.loading) return;
		onComplete?.(backupCodes);
	}

	/**
	 * Cancel setup
	 */
	function handleCancel() {
		if (authState.loading) return;
		onCancel?.();
	}

	/**
	 * Copy to clipboard
	 */
	async function copyToClipboard(text: string) {
		if (!clipboard?.writeText) {
			return;
		}

		try {
			await clipboard.writeText(text);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	/**
	 * Download backup codes as text file
	 */
	function downloadBackupCodes() {
		if (!hasDocument) {
			return;
		}

		const text = backupCodes.join('\n');
		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'backup-codes.txt';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class={`auth-2fa ${className}`}>
	<h2 class="auth-2fa__title">{title}</h2>

	{#if authState.error}
		<div class="auth-2fa__error" role="alert">
			<svg class="auth-2fa__error-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{authState.error}
		</div>
	{/if}

	{#if setupStep === 'intro'}
		<div class="auth-2fa__intro">
			<div class="auth-2fa__icon-container">
				<svg class="auth-2fa__icon" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
					/>
				</svg>
			</div>

			<div class="auth-2fa__content">
				<h3 class="auth-2fa__subtitle">Add an extra layer of security</h3>
				<p class="auth-2fa__description">
					Two-factor authentication requires a verification code from your authenticator app in
					addition to your password when signing in.
				</p>

				<ul class="auth-2fa__benefits">
					<li>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
						Protects your account even if your password is compromised
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
						Works with apps like Google Authenticator, Authy, or 1Password
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
						Includes backup codes for device loss scenarios
					</li>
				</ul>
			</div>

			<button use:startButton.actions.button class="auth-2fa__button" disabled={authState.loading}>
				{#if authState.loading}
					<span class="auth-2fa__spinner"></span>
					Setting up...
				{:else}
					Enable Two-Factor Authentication
				{/if}
			</button>

			<button use:cancelButton.actions.button class="auth-2fa__cancel" disabled={authState.loading}>
				Maybe later
			</button>
		</div>
	{:else if setupStep === 'scan'}
		<div class="auth-2fa__scan">
			<p class="auth-2fa__step">Step 1 of 2: Scan QR code</p>

			<div class="auth-2fa__qr-container">
				{#if qrCodeUrl}
					<!-- In production, use a proper QR code library -->
					<div class="auth-2fa__qr-placeholder">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h3v2h-3zm0 4h3v2h-3zm-5 0h2v4h-2z"
							/>
						</svg>
						<span>QR Code</span>
					</div>
				{/if}
			</div>

			<div class="auth-2fa__instructions">
				<p>1. Install an authenticator app like Google Authenticator or Authy</p>
				<p>2. Scan this QR code with your authenticator app</p>
				<p>3. Enter the 6-digit code from your app below</p>
			</div>

			<div class="auth-2fa__manual">
				<p class="auth-2fa__manual-label">Or enter this code manually:</p>
				<div class="auth-2fa__secret">
					<code>{secret}</code>
					<button
						class="auth-2fa__copy"
						onclick={() => copyToClipboard(secret)}
						aria-label="Copy secret code"
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div class="auth-2fa__verify-field">
				<label for="2fa-verify" class="auth-2fa__label">Verification Code</label>
				<input
					id="2fa-verify"
					type="text"
					class="auth-2fa__input"
					class:auth-2fa__input--error={verificationError}
					bind:value={verificationCode}
					placeholder="000000"
					maxlength="6"
					pattern="[0-9]*"
					inputmode="numeric"
					disabled={authState.loading}
				/>
				{#if verificationError}
					<span class="auth-2fa__field-error">{verificationError}</span>
				{/if}
			</div>

			<button
				use:verifyButton.actions.button
				class="auth-2fa__button"
				disabled={authState.loading || verificationCode.length !== 6}
			>
				{#if authState.loading}
					<span class="auth-2fa__spinner"></span>
					Verifying...
				{:else}
					Verify and Continue
				{/if}
			</button>

			<button use:cancelButton.actions.button class="auth-2fa__cancel" disabled={authState.loading}>
				Cancel
			</button>
		</div>
	{:else if setupStep === 'backup'}
		<div class="auth-2fa__backup">
			<div class="auth-2fa__success-icon">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
				</svg>
			</div>

			<h3 class="auth-2fa__subtitle">Two-Factor Authentication Enabled!</h3>

			<p class="auth-2fa__step">Step 2 of 2: Save your backup codes</p>

			<div class="auth-2fa__backup-info">
				<svg class="auth-2fa__backup-icon" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
					/>
				</svg>
				<p>
					Save these backup codes in a safe place. You can use them to sign in if you lose access to
					your authenticator app.
				</p>
			</div>

			<div class="auth-2fa__codes">
				{#each backupCodes as code (code)}
					<code class="auth-2fa__code">{code}</code>
				{/each}
			</div>

			<div class="auth-2fa__backup-actions">
				<button class="auth-2fa__backup-button" onclick={downloadBackupCodes}>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
						/>
					</svg>
					Download codes
				</button>

				<button
					class="auth-2fa__backup-button"
					onclick={() => copyToClipboard(backupCodes.join('\n'))}
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
						/>
					</svg>
					Copy codes
				</button>
			</div>

			<button use:finishButton.actions.button class="auth-2fa__button">Done</button>
		</div>
	{/if}
</div>
