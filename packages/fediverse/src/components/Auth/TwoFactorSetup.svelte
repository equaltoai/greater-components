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
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	/**
	 * Download backup codes as text file
	 */
	function downloadBackupCodes() {
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

<style>
	.auth-2fa {
		width: 100%;
		max-width: 32rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.auth-2fa__title {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		color: var(--text-primary, #0f1419);
	}

	/* Error Alert */
	.auth-2fa__error {
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

	.auth-2fa__error-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Intro */
	.auth-2fa__intro,
	.auth-2fa__scan,
	.auth-2fa__backup {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		text-align: center;
	}

	.auth-2fa__icon-container {
		display: flex;
		justify-content: center;
	}

	.auth-2fa__icon {
		width: 4rem;
		height: 4rem;
		color: var(--primary-color, #1d9bf0);
	}

	.auth-2fa__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-2fa__subtitle {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-2fa__description {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		line-height: 1.5;
	}

	.auth-2fa__benefits {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0.5rem 0 0 0;
		padding: 0;
		list-style: none;
		text-align: left;
	}

	.auth-2fa__benefits li {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.auth-2fa__benefits svg {
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.125rem;
		color: var(--success-color, #00ba7c);
		flex-shrink: 0;
	}

	/* Scan Step */
	.auth-2fa__step {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.auth-2fa__qr-container {
		display: flex;
		justify-content: center;
		padding: 1rem;
	}

	.auth-2fa__qr-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 12rem;
		height: 12rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 2px dashed var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		color: var(--text-secondary, #536471);
	}

	.auth-2fa__qr-placeholder svg {
		width: 3rem;
		height: 3rem;
	}

	.auth-2fa__instructions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
		text-align: left;
	}

	.auth-2fa__instructions p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.5;
	}

	.auth-2fa__manual {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: left;
	}

	.auth-2fa__manual-label {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-2fa__secret {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
	}

	.auth-2fa__secret code {
		flex: 1;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		word-break: break-all;
	}

	.auth-2fa__copy {
		padding: 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s;
	}

	.auth-2fa__copy:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--text-primary, #0f1419);
	}

	.auth-2fa__copy svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Verify Field */
	.auth-2fa__verify-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: left;
	}

	.auth-2fa__label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.auth-2fa__input {
		width: 100%;
		padding: 0.75rem;
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

	.auth-2fa__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.1);
	}

	.auth-2fa__input--error {
		border-color: #f4211e;
	}

	.auth-2fa__input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-2fa__field-error {
		font-size: 0.75rem;
		color: #f4211e;
	}

	/* Backup Step */
	.auth-2fa__success-icon {
		width: 4rem;
		height: 4rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--success-color, #00ba7c);
		border-radius: 50%;
		color: white;
	}

	.auth-2fa__success-icon svg {
		width: 2.5rem;
		height: 2.5rem;
	}

	.auth-2fa__backup-info {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(255, 173, 31, 0.1);
		border: 1px solid rgba(255, 173, 31, 0.3);
		border-radius: 0.5rem;
		text-align: left;
	}

	.auth-2fa__backup-icon {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
		color: #f59e0b;
	}

	.auth-2fa__backup-info p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.5;
	}

	.auth-2fa__codes {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.auth-2fa__code {
		padding: 0.5rem;
		background: white;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.875rem;
		text-align: center;
		color: var(--text-primary, #0f1419);
	}

	.auth-2fa__backup-actions {
		display: flex;
		gap: 0.75rem;
	}

	.auth-2fa__backup-button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
		transition: all 0.2s;
	}

	.auth-2fa__backup-button:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.auth-2fa__backup-button svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Buttons */
	.auth-2fa__button {
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

	.auth-2fa__button:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.auth-2fa__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.auth-2fa__cancel {
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

	.auth-2fa__cancel:hover:not(:disabled) {
		color: var(--text-primary, #0f1419);
	}

	.auth-2fa__cancel:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Loading Spinner */
	.auth-2fa__spinner {
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
</style>
