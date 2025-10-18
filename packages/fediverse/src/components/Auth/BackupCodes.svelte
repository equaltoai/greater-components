<script lang="ts">
	/**
	 * Auth.BackupCodes Component
	 *
	 * Displays and manages 2FA backup recovery codes for account access.
	 * Used when primary authentication methods are unavailable.
	 *
	 * Features:
	 * - Display backup codes in secure format
	 * - Copy all codes to clipboard
	 * - Download codes as text file
	 * - Print codes for offline storage
	 * - Regenerate codes (with confirmation)
	 * - Visual confirmation of code saving
	 *
	 * @component
	 * @example
	 * <Auth.Root>
	 *   <Auth.BackupCodes
	 *     codes={['CODE1', 'CODE2', ...]}
	 *     onRegenerate={handleRegenerate}
	 *     onConfirmed={handleConfirmed}
	 *   />
	 * </Auth.Root>
	 */

	import { createButton } from '@greater/headless/button';
	import { createModal } from '@greater/headless/modal';
	import type { AuthHandlers } from './context.js';

	interface Props {
		/**
		 * Array of backup recovery codes
		 */
		codes: string[];
		/**
		 * Callback when user regenerates codes
		 */
		onRegenerate?: AuthHandlers['onRegenerateBackupCodes'];
		/**
		 * Callback when user confirms they've saved codes
		 */
		onConfirmed?: () => void;
		/**
		 * Whether codes are being used during initial setup
		 * (affects messaging and required confirmation)
		 */
		isSetup?: boolean;
	}

	let { codes = [], onRegenerate, onConfirmed, isSetup = false }: Props = $props();

	// Local state
	let copiedAll = $state(false);
	let downloaded = $state(false);
	let confirmed = $state(false);
	let regenerating = $state(false);
	let error = $state<string | null>(null);

	// Headless button for actions
	const copyButton = createButton();
	const downloadButton = createButton();
	const printButton = createButton();
	const regenerateButton = createButton();

	// Confirmation modal for regeneration
	const regenerateModal = createModal();

	/**
	 * Copy all backup codes to clipboard
	 */
	async function handleCopyAll() {
		try {
			const text = codes.join('\n');
			await navigator.clipboard.writeText(text);
			copiedAll = true;

			// Reset copied state after 3 seconds
			setTimeout(() => {
				copiedAll = false;
			}, 3000);
		} catch (err) {
			error = 'Failed to copy codes to clipboard';
			console.error('Copy failed:', err);
		}
	}

	/**
	 * Download codes as a text file
	 */
	function handleDownload() {
		try {
			const text = [
				'BACKUP RECOVERY CODES',
				'',
				'Keep these codes in a safe place. Each code can only be used once.',
				'',
				...codes,
				'',
				`Generated: ${new Date().toISOString()}`,
			].join('\n');

			const blob = new Blob([text], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `backup-codes-${Date.now()}.txt`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			downloaded = true;
		} catch (err) {
			error = 'Failed to download backup codes';
			console.error('Download failed:', err);
		}
	}

	/**
	 * Print backup codes
	 */
	function handlePrint() {
		try {
			const printWindow = window.open('', '_blank');
			if (!printWindow) {
				error = 'Please allow popups to print backup codes';
				return;
			}

			const content = `
				<!DOCTYPE html>
				<html>
				<head>
					<title>Backup Recovery Codes</title>
					<style>
						body {
							font-family: monospace;
							padding: 40px;
							max-width: 600px;
							margin: 0 auto;
						}
						h1 {
							font-size: 24px;
							margin-bottom: 20px;
						}
						.warning {
							background: #fff3cd;
							border: 1px solid #ffc107;
							padding: 15px;
							margin: 20px 0;
							border-radius: 4px;
						}
						.codes {
							background: #f5f5f5;
							padding: 20px;
							margin: 20px 0;
							border-radius: 4px;
						}
						.code {
							font-size: 16px;
							padding: 8px;
							margin: 4px 0;
						}
						.footer {
							margin-top: 40px;
							font-size: 12px;
							color: #666;
						}
					</style>
				</head>
				<body>
					<h1>🔐 Backup Recovery Codes</h1>
					<div class="warning">
						<strong>⚠️ Keep these codes safe!</strong>
						<p>Store these codes in a secure location. Each code can only be used once to regain access to your account.</p>
					</div>
					<div class="codes">
						${codes.map((code) => `<div class="code">${code}</div>`).join('')}
					</div>
					<div class="footer">
						Generated: ${new Date().toLocaleString()}<br>
						Do not share these codes with anyone.
					</div>
				</body>
				</html>
			`;

			printWindow.document.write(content);
			printWindow.document.close();
			printWindow.focus();
			printWindow.print();
		} catch (err) {
			error = 'Failed to print backup codes';
			console.error('Print failed:', err);
		}
	}

	/**
	 * User confirms they've saved the codes
	 */
	function handleConfirm() {
		confirmed = true;
		onConfirmed?.();
	}

	/**
	 * Open regeneration confirmation modal
	 */
	function handleRegenerateClick() {
		regenerateModal.open();
	}

	/**
	 * Regenerate backup codes (with confirmation)
	 */
	async function handleRegenerateConfirm() {
		if (regenerating) return;

		regenerating = true;
		error = null;

		try {
			await onRegenerate?.();
			regenerateModal.close();
			// Reset saved states since codes are new
			copiedAll = false;
			downloaded = false;
			confirmed = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to regenerate codes';
		} finally {
			regenerating = false;
		}
	}

	/**
	 * Format code for display (split into groups for readability)
	 */
	function formatCode(code: string): string {
		// Split into groups of 4 characters
		return code.match(/.{1,4}/g)?.join('-') ?? code;
	}
</script>

<div class="backup-codes">
	<div class="backup-codes__header">
		<h2 class="backup-codes__title">
			{isSetup ? 'Save Your Backup Codes' : 'Backup Recovery Codes'}
		</h2>
		<p class="backup-codes__description">
			{#if isSetup}
				Keep these codes in a safe place. You'll need them if you lose access to your authentication
				device.
			{:else}
				Use these codes to regain access to your account if you lose your primary authentication
				method.
			{/if}
		</p>
	</div>

	{#if error}
		<div class="backup-codes__error" role="alert">
			<span class="backup-codes__error-icon">⚠️</span>
			<span class="backup-codes__error-text">{error}</span>
		</div>
	{/if}

	<div class="backup-codes__warning">
		<span class="backup-codes__warning-icon">🔒</span>
		<div class="backup-codes__warning-content">
			<strong>Important:</strong>
			Each code can only be used once. Store them securely.
		</div>
	</div>

	<div class="backup-codes__list" role="list" aria-label="Backup recovery codes">
		{#each codes as code, index (code)}
			<div class="backup-codes__item" role="listitem">
				<span class="backup-codes__item-number">{index + 1}.</span>
				<code class="backup-codes__item-code">{formatCode(code)}</code>
			</div>
		{/each}
	</div>

	<div class="backup-codes__actions">
		<button
			{...copyButton.props}
			class="backup-codes__action backup-codes__action--primary"
			onclick={handleCopyAll}
			aria-label="Copy all codes to clipboard"
		>
			<span class="backup-codes__action-icon">{copiedAll ? '✓' : '📋'}</span>
			{copiedAll ? 'Copied!' : 'Copy All'}
		</button>

		<button
			{...downloadButton.props}
			class="backup-codes__action"
			onclick={handleDownload}
			aria-label="Download codes as text file"
		>
			<span class="backup-codes__action-icon">{downloaded ? '✓' : '💾'}</span>
			{downloaded ? 'Downloaded' : 'Download'}
		</button>

		<button
			{...printButton.props}
			class="backup-codes__action"
			onclick={handlePrint}
			aria-label="Print backup codes"
		>
			<span class="backup-codes__action-icon">🖨️</span>
			Print
		</button>
	</div>

	{#if isSetup}
		<div class="backup-codes__confirmation">
			<label class="backup-codes__checkbox">
				<input
					type="checkbox"
					bind:checked={confirmed}
					onchange={handleConfirm}
					aria-label="Confirm codes saved"
				/>
				<span class="backup-codes__checkbox-text">
					I have saved these codes in a secure location
				</span>
			</label>
		</div>
	{/if}

	{#if !isSetup}
		<div class="backup-codes__regenerate">
			<button
				{...regenerateButton.props}
				class="backup-codes__regenerate-button"
				onclick={handleRegenerateClick}
				aria-label="Regenerate backup codes"
			>
				🔄 Regenerate Codes
			</button>
			<p class="backup-codes__regenerate-warning">This will invalidate all existing codes</p>
		</div>
	{/if}
</div>

<!-- Regeneration confirmation modal -->
{#if regenerateModal.isOpen}
	<div class="backup-codes-modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
		<button
			class="backup-codes-modal__backdrop"
			onclick={() => regenerateModal.close()}
			onkeydown={(e) => e.key === 'Escape' && regenerateModal.close()}
			aria-label="Close modal"
			type="button"
		></button>
		<div class="backup-codes-modal__content">
			<h3 id="modal-title" class="backup-codes-modal__title">Regenerate Backup Codes?</h3>
			<p class="backup-codes-modal__text">
				This will invalidate all your existing backup codes. Any codes you've saved will no longer
				work.
			</p>
			<p class="backup-codes-modal__text backup-codes-modal__text--warning">
				You'll need to save the new codes in a secure location.
			</p>
			<div class="backup-codes-modal__actions">
				<button
					class="backup-codes-modal__button backup-codes-modal__button--cancel"
					onclick={() => regenerateModal.close()}
					disabled={regenerating}
				>
					Cancel
				</button>
				<button
					class="backup-codes-modal__button backup-codes-modal__button--danger"
					onclick={handleRegenerateConfirm}
					disabled={regenerating}
				>
					{regenerating ? 'Regenerating...' : 'Regenerate Codes'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.backup-codes {
		max-width: 600px;
		margin: 0 auto;
	}

	.backup-codes__header {
		margin-bottom: 24px;
	}

	.backup-codes__title {
		font-size: 24px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: #1a1a1a;
	}

	.backup-codes__description {
		font-size: 14px;
		color: #666;
		margin: 0;
		line-height: 1.5;
	}

	.backup-codes__error {
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 8px;
		padding: 12px 16px;
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.backup-codes__error-icon {
		flex-shrink: 0;
	}

	.backup-codes__error-text {
		font-size: 14px;
		color: #c00;
	}

	.backup-codes__warning {
		background: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: 8px;
		padding: 12px 16px;
		margin-bottom: 24px;
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.backup-codes__warning-icon {
		flex-shrink: 0;
		font-size: 20px;
	}

	.backup-codes__warning-content {
		font-size: 14px;
		line-height: 1.5;
		color: #856404;
	}

	.backup-codes__list {
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 24px;
		margin-bottom: 24px;
	}

	.backup-codes__item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 0;
		border-bottom: 1px solid #e9ecef;
	}

	.backup-codes__item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.backup-codes__item-number {
		font-size: 14px;
		color: #6c757d;
		min-width: 24px;
	}

	.backup-codes__item-code {
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
		font-size: 16px;
		font-weight: 600;
		color: #212529;
		letter-spacing: 0.5px;
	}

	.backup-codes__actions {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.backup-codes__action {
		flex: 1;
		min-width: 140px;
		padding: 12px 16px;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		background: white;
		color: #495057;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.backup-codes__action:hover {
		background: #f8f9fa;
		border-color: #adb5bd;
	}

	.backup-codes__action--primary {
		background: #007bff;
		color: white;
		border-color: #007bff;
	}

	.backup-codes__action--primary:hover {
		background: #0056b3;
		border-color: #0056b3;
	}

	.backup-codes__action-icon {
		font-size: 16px;
	}

	.backup-codes__confirmation {
		background: #e7f3ff;
		border: 1px solid #b3d9ff;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 24px;
	}

	.backup-codes__checkbox {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		user-select: none;
	}

	.backup-codes__checkbox input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}

	.backup-codes__checkbox-text {
		font-size: 14px;
		color: #004085;
		font-weight: 500;
	}

	.backup-codes__regenerate {
		text-align: center;
		padding-top: 24px;
		border-top: 1px solid #dee2e6;
	}

	.backup-codes__regenerate-button {
		padding: 10px 20px;
		border: 1px solid #dc3545;
		border-radius: 8px;
		background: white;
		color: #dc3545;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.backup-codes__regenerate-button:hover {
		background: #dc3545;
		color: white;
	}

	.backup-codes__regenerate-warning {
		font-size: 12px;
		color: #6c757d;
		margin: 8px 0 0 0;
	}

	/* Modal styles */
	.backup-codes-modal {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.backup-codes-modal__backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.backup-codes-modal__content {
		position: relative;
		background: white;
		border-radius: 12px;
		padding: 24px;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.backup-codes-modal__title {
		font-size: 20px;
		font-weight: 600;
		margin: 0 0 16px 0;
		color: #1a1a1a;
	}

	.backup-codes-modal__text {
		font-size: 14px;
		color: #495057;
		margin: 0 0 12px 0;
		line-height: 1.5;
	}

	.backup-codes-modal__text--warning {
		font-weight: 600;
		color: #dc3545;
	}

	.backup-codes-modal__actions {
		display: flex;
		gap: 12px;
		margin-top: 24px;
	}

	.backup-codes-modal__button {
		flex: 1;
		padding: 10px 16px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.backup-codes-modal__button--cancel {
		background: white;
		border: 1px solid #dee2e6;
		color: #495057;
	}

	.backup-codes-modal__button--cancel:hover {
		background: #f8f9fa;
	}

	.backup-codes-modal__button--danger {
		background: #dc3545;
		border: 1px solid #dc3545;
		color: white;
	}

	.backup-codes-modal__button--danger:hover {
		background: #c82333;
		border-color: #c82333;
	}

	.backup-codes-modal__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
