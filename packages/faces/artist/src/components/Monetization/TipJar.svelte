<!--
Monetization.TipJar - Pay-what-you-want contribution component

REQ-ECON-002: Pay-what-you-want contributions
REQ-PHIL-007: No algorithmic promotion tied to payment
REQ-ECON-005: Fair visibility for all artists

Features:
- Preset amount buttons
- Custom amount input
- Optional message support
- Anonymous tipping option
- Clear voluntary messaging
- Recognition for supporters (artist-controlled)

@component
@example
```svelte
<script>
  import { TipJar } from '@equaltoai/greater-components/faces/artist/Monetization';
  
  const config = {
    presets: [
      { id: '1', amount: 5, currency: 'USD', label: 'Coffee', emoji: '☕' },
      { id: '2', amount: 10, currency: 'USD', label: 'Lunch', emoji: '🍕' },
      { id: '3', amount: 25, currency: 'USD', label: 'Support', emoji: '💖' }
    ],
    allowCustomAmount: true,
    allowMessages: true,
    allowAnonymous: true
  };
  
  async function handleTip(amount, currency, message, isAnonymous) {
    // Process tip payment
  }
</script>

<TipJar {config} onTip={handleTip} />
```
-->

<script lang="ts">
	import type { TipPreset, TipJarConfig, TipJarHandlers, ArtistData } from '../../types/index.js';

	interface Props {
		/** Artist receiving tips */
		artist: ArtistData;
		/** Tip jar configuration */
		config?: TipJarConfig;
		/** Event handlers */
		handlers?: TipJarHandlers;
		/** Recent tips to display */
		recentTips?: Array<{
			amount: number;
			currency: string;
			tipperName?: string;
			message?: string;
			isAnonymous: boolean;
			createdAt: Date | string;
		}>;
		/** Custom CSS class */
		class?: string;
	}

	let {
		artist,
		config = {},
		handlers = {},
		recentTips = [],
		class: className = '',
	}: Props = $props();

	// Default configuration
	const defaultPresets: TipPreset[] = [
		{ id: 'tip-5', amount: 5, currency: 'USD', label: 'Coffee', emoji: '☕' },
		{ id: 'tip-10', amount: 10, currency: 'USD', label: 'Lunch', emoji: '🍕' },
		{ id: 'tip-25', amount: 25, currency: 'USD', label: 'Support', emoji: '💖' },
		{ id: 'tip-50', amount: 50, currency: 'USD', label: 'Champion', emoji: '🏆' },
	];

	const presets = $derived(config.presets ?? defaultPresets);
	const allowCustomAmount = $derived(config.allowCustomAmount ?? true);
	const allowMessages = $derived(config.allowMessages ?? true);
	const allowAnonymous = $derived(config.allowAnonymous ?? true);
	const minAmount = $derived(config.minAmount ?? 1);
	const maxAmount = $derived(config.maxAmount ?? 500);
	const currency = $derived(config.currency ?? 'USD');
	const showRecentTips = $derived(config.showRecentTips ?? false);
	const thankYouMessage = $derived(
		config.thankYouMessage ?? 'Thank you for supporting my work! 💖'
	);

	// Component state
	let selectedPreset = $state<string | null>(null);
	let customAmount = $state<number | null>(null);
	let message = $state('');
	let isAnonymous = $state(false);
	let isProcessing = $state(false);
	let showSuccess = $state(false);
	let error = $state<string | null>(null);

	// Computed values
	const selectedAmount = $derived(() => {
		if (customAmount !== null && customAmount > 0) {
			return customAmount;
		}
		if (selectedPreset) {
			const preset = presets.find((p) => p.id === selectedPreset);
			return preset?.amount ?? 0;
		}
		return 0;
	});

	const isValidAmount = $derived(selectedAmount() >= minAmount && selectedAmount() <= maxAmount);

	// Format currency
	function formatCurrency(amount: number, curr: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: curr,
		}).format(amount);
	}

	// Format relative time
	function formatRelativeTime(date: Date | string): string {
		const now = new Date();
		const then = new Date(date);
		const diffMs = now.getTime() - then.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return then.toLocaleDateString();
	}

	// Handle preset selection
	function selectPreset(presetId: string) {
		selectedPreset = presetId;
		customAmount = null;
		error = null;
	}

	// Handle custom amount change
	function handleCustomAmountChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseFloat(target.value);
		if (!isNaN(value) && value > 0) {
			customAmount = value;
			selectedPreset = null;
		} else {
			customAmount = null;
		}
		error = null;
	}

	// Handle tip submission
	async function handleSubmit() {
		const amount = selectedAmount();
		if (!isValidAmount || isProcessing) return;

		isProcessing = true;
		error = null;

		try {
			if (handlers.onTip) {
				await handlers.onTip(
					amount,
					currency,
					allowMessages && message ? message : undefined,
					allowAnonymous ? isAnonymous : false
				);
			}

			// Show success state
			showSuccess = true;

			// Reset form after delay
			setTimeout(() => {
				showSuccess = false;
				selectedPreset = null;
				customAmount = null;
				message = '';
				isAnonymous = false;
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to process tip. Please try again.';
			if (handlers.onPaymentError) {
				handlers.onPaymentError(err instanceof Error ? err : new Error(String(err)));
			}
		} finally {
			isProcessing = false;
		}
	}

	// Handle keyboard submission
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}

	// Compute CSS classes
	const containerClass = $derived(
		['gr-monetization-tipjar', showSuccess && 'gr-monetization-tipjar--success', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={containerClass}>
	{#if showSuccess}
		<!-- Success State -->
		<div class="gr-monetization-tipjar-success" role="status" aria-live="polite">
			<div class="gr-monetization-tipjar-success-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			</div>
			<p class="gr-monetization-tipjar-success-message">{thankYouMessage}</p>
		</div>
	{:else}
		<!-- Header -->
		<div class="gr-monetization-tipjar-header">
			<h3 class="gr-monetization-tipjar-title">Support {artist.name}</h3>
			<p class="gr-monetization-tipjar-subtitle">
				Your support is completely voluntary and helps me continue creating.
			</p>
		</div>

		<!-- Preset Amounts -->
		<div class="gr-monetization-tipjar-presets" role="group" aria-label="Preset tip amounts">
			{#each presets as preset (preset.id)}
				<button
					type="button"
					class="gr-monetization-tipjar-preset"
					class:gr-monetization-tipjar-preset--selected={selectedPreset === preset.id}
					onclick={() => selectPreset(preset.id)}
					aria-pressed={selectedPreset === preset.id}
				>
					{#if preset.emoji}
						<span class="gr-monetization-tipjar-preset-emoji" aria-hidden="true"
							>{preset.emoji}</span
						>
					{/if}
					<span class="gr-monetization-tipjar-preset-amount">
						{formatCurrency(preset.amount, preset.currency)}
					</span>
					{#if preset.label}
						<span class="gr-monetization-tipjar-preset-label">{preset.label}</span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Custom Amount -->
		{#if allowCustomAmount}
			<div class="gr-monetization-tipjar-custom">
				<label for="custom-amount" class="gr-monetization-tipjar-custom-label">
					Or enter a custom amount
				</label>
				<div class="gr-monetization-tipjar-custom-input-wrapper">
					<span class="gr-monetization-tipjar-custom-currency" aria-hidden="true">$</span>
					<input
						id="custom-amount"
						type="number"
						class="gr-monetization-tipjar-custom-input"
						placeholder="0.00"
						min={minAmount}
						max={maxAmount}
						step="0.01"
						value={customAmount ?? ''}
						oninput={handleCustomAmountChange}
						onkeydown={handleKeydown}
						aria-describedby="amount-hint"
					/>
				</div>
				<span id="amount-hint" class="gr-monetization-tipjar-hint">
					{formatCurrency(minAmount, currency)} - {formatCurrency(maxAmount, currency)}
				</span>
			</div>
		{/if}

		<!-- Message -->
		{#if allowMessages}
			<div class="gr-monetization-tipjar-message">
				<label for="tip-message" class="gr-monetization-tipjar-message-label">
					Add a message (optional)
				</label>
				<textarea
					id="tip-message"
					class="gr-monetization-tipjar-message-input"
					placeholder="Say something nice..."
					rows="2"
					maxlength="280"
					bind:value={message}
				></textarea>
				<span class="gr-monetization-tipjar-message-count">
					{message.length}/280
				</span>
			</div>
		{/if}

		<!-- Anonymous Option -->
		{#if allowAnonymous}
			<label class="gr-monetization-tipjar-anonymous">
				<input
					type="checkbox"
					class="gr-monetization-tipjar-anonymous-checkbox"
					bind:checked={isAnonymous}
				/>
				<span class="gr-monetization-tipjar-anonymous-label"> Tip anonymously </span>
			</label>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="gr-monetization-tipjar-error" role="alert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Submit Button -->
		<button
			type="button"
			class="gr-monetization-tipjar-submit"
			disabled={!isValidAmount || isProcessing}
			onclick={handleSubmit}
		>
			{#if isProcessing}
				<span class="gr-monetization-tipjar-spinner" aria-hidden="true"></span>
				Processing...
			{:else if isValidAmount}
				Send {formatCurrency(selectedAmount(), currency)}
			{:else}
				Select an amount
			{/if}
		</button>

		<!-- Voluntary Notice -->
		<p class="gr-monetization-tipjar-notice">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="16" x2="12" y2="12" />
				<line x1="12" y1="8" x2="12.01" y2="8" />
			</svg>
			Tips are voluntary and don't affect visibility or features.
		</p>

		<!-- Recent Tips -->
		{#if showRecentTips && recentTips.length > 0}
			<div class="gr-monetization-tipjar-recent">
				<h4 class="gr-monetization-tipjar-recent-title">Recent Supporters</h4>
				<ul class="gr-monetization-tipjar-recent-list">
					{#each recentTips.slice(0, config.recentTipsCount ?? 5) as tip (tip)}
						<li class="gr-monetization-tipjar-recent-item">
							<span class="gr-monetization-tipjar-recent-name">
								{tip.isAnonymous ? 'Anonymous' : (tip.tipperName ?? 'Someone')}
							</span>
							<span class="gr-monetization-tipjar-recent-amount">
								{formatCurrency(tip.amount, tip.currency)}
							</span>
							<span class="gr-monetization-tipjar-recent-time">
								{formatRelativeTime(tip.createdAt)}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}
</div>

<style>
	.gr-monetization-tipjar {
		font-family: var(--gr-typography-fontFamily-sans);
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
	}

	/* Header */
	.gr-monetization-tipjar-header {
		text-align: center;
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-tipjar-title {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.gr-monetization-tipjar-subtitle {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		margin: 0;
	}

	/* Presets */
	.gr-monetization-tipjar-presets {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--gr-spacing-scale-3);
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-tipjar-preset {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-850);
		border: 2px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-monetization-tipjar-preset:hover {
		border-color: var(--gr-color-gray-600);
		background: var(--gr-color-gray-800);
	}

	.gr-monetization-tipjar-preset--selected {
		border-color: var(--gr-color-primary-500);
		background: var(--gr-color-primary-500/10);
	}

	.gr-monetization-tipjar-preset-emoji {
		font-size: var(--gr-typography-fontSize-2xl);
	}

	.gr-monetization-tipjar-preset-amount {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
	}

	.gr-monetization-tipjar-preset-label {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	/* Custom Amount */
	.gr-monetization-tipjar-custom {
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-tipjar-custom-label {
		display: block;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.gr-monetization-tipjar-custom-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.gr-monetization-tipjar-custom-currency {
		position: absolute;
		left: var(--gr-spacing-scale-3);
		color: var(--gr-color-gray-400);
		font-size: var(--gr-typography-fontSize-lg);
	}

	.gr-monetization-tipjar-custom-input {
		width: 100%;
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-3) var(--gr-spacing-scale-3)
			var(--gr-spacing-scale-8);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-typography-fontSize-lg);
	}

	.gr-monetization-tipjar-custom-input:focus {
		outline: none;
		border-color: var(--gr-color-primary-500);
		box-shadow: 0 0 0 3px var(--gr-color-primary-500/20);
	}

	.gr-monetization-tipjar-hint {
		display: block;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		margin-top: var(--gr-spacing-scale-1);
	}

	/* Message */
	.gr-monetization-tipjar-message {
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.gr-monetization-tipjar-message-label {
		display: block;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.gr-monetization-tipjar-message-input {
		width: 100%;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-typography-fontSize-sm);
		resize: vertical;
		min-height: 60px;
	}

	.gr-monetization-tipjar-message-input:focus {
		outline: none;
		border-color: var(--gr-color-primary-500);
	}

	.gr-monetization-tipjar-message-count {
		display: block;
		text-align: right;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		margin-top: var(--gr-spacing-scale-1);
	}

	/* Anonymous */
	.gr-monetization-tipjar-anonymous {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-4);
		cursor: pointer;
	}

	.gr-monetization-tipjar-anonymous-checkbox {
		width: 18px;
		height: 18px;
		accent-color: var(--gr-color-primary-500);
	}

	.gr-monetization-tipjar-anonymous-label {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
	}

	/* Error */
	.gr-monetization-tipjar-error {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-error-500/10);
		border: 1px solid var(--gr-color-error-500/30);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-error-400);
		font-size: var(--gr-typography-fontSize-sm);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.gr-monetization-tipjar-error svg {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	/* Submit */
	.gr-monetization-tipjar-submit {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		font-size: var(--gr-typography-fontSize-base);
		font-weight: var(--gr-typography-fontWeight-semibold);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-monetization-tipjar-submit:hover:not(:disabled) {
		background: var(--gr-color-primary-500);
	}

	.gr-monetization-tipjar-submit:disabled {
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-400);
		cursor: not-allowed;
	}

	.gr-monetization-tipjar-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Notice */
	.gr-monetization-tipjar-notice {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-4);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	.gr-monetization-tipjar-notice svg {
		width: 14px;
		height: 14px;
	}

	/* Success */
	.gr-monetization-tipjar-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--gr-spacing-scale-8);
		text-align: center;
	}

	.gr-monetization-tipjar-success-icon {
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-success-500/20);
		border-radius: 50%;
		color: var(--gr-color-success-400);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.gr-monetization-tipjar-success-icon svg {
		width: 32px;
		height: 32px;
	}

	.gr-monetization-tipjar-success-message {
		font-size: var(--gr-typography-fontSize-lg);
		color: var(--gr-color-gray-100);
		margin: 0;
	}

	/* Recent Tips */
	.gr-monetization-tipjar-recent {
		margin-top: var(--gr-spacing-scale-6);
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-800);
	}

	.gr-monetization-tipjar-recent-title {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-300);
		margin: 0 0 var(--gr-spacing-scale-3) 0;
	}

	.gr-monetization-tipjar-recent-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.gr-monetization-tipjar-recent-item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) 0;
		font-size: var(--gr-typography-fontSize-sm);
	}

	.gr-monetization-tipjar-recent-name {
		flex: 1;
		color: var(--gr-color-gray-300);
	}

	.gr-monetization-tipjar-recent-amount {
		color: var(--gr-color-success-400);
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	.gr-monetization-tipjar-recent-time {
		color: var(--gr-color-gray-500);
		font-size: var(--gr-typography-fontSize-xs);
	}
</style>
