<!--
Monetization.DirectPurchase - Direct artist-to-collector purchase component

REQ-ECON-001: Direct transactions with no platform commission
REQ-PHIL-007: No algorithmic promotion tied to payment
REQ-ECON-005: Fair visibility for all artists

Features:
- Direct artist-to-collector payment routing
- No platform commission on sales
- Pricing display (original, prints, licenses)
- License selection (personal, commercial, exclusive)
- Payment processor integration
- Transparent pricing display

@component
@example
```svelte
<script>
  import { DirectPurchase } from '@equaltoai/greater-components/faces/artist/Monetization';
  
  const pricing = {
    original: { price: 2500, currency: 'USD', available: true },
    prints: [
      { id: 'sm', size: '8x10"', price: 45, currency: 'USD', description: 'Archival print' }
    ],
    licenses: [
      { id: 'personal', type: 'personal', price: 25, currency: 'USD', terms: 'Personal use only' }
    ]
  };
</script>

<DirectPurchase {artwork} {pricing} onPurchase={handlePurchase} />
```
-->

<script lang="ts">
	import type { ArtworkData } from '../../types/index.js';

	/**
	 * Print option for artwork
	 */
	interface PrintOption {
		id: string;
		size: string;
		price: number;
		currency: string;
		description?: string;
		available?: boolean;
		edition?: { current: number; total: number };
	}

	/**
	 * License option for artwork
	 */
	interface LicenseOption {
		id: string;
		type: 'personal' | 'commercial' | 'exclusive';
		price: number;
		currency: string;
		terms: string;
		available?: boolean;
	}

	/**
	 * Pricing data structure
	 */
	interface PricingData {
		original?: {
			price: number;
			currency: string;
			available: boolean;
			inquiryOnly?: boolean;
		};
		prints?: PrintOption[];
		licenses?: LicenseOption[];
	}

	/**
	 * Purchase options passed to handler
	 */
	interface PurchaseOptions {
		type: 'original' | 'print' | 'license';
		itemId?: string;
		price: number;
		currency: string;
		quantity?: number;
		shippingAddress?: {
			name: string;
			address: string;
			city: string;
			country: string;
			postalCode: string;
		};
	}

	interface Props {
		/** Artwork being purchased */
		artwork: ArtworkData;
		/** Pricing configuration */
		pricing: PricingData;
		/** Called when purchase is initiated */
		onPurchase?: (options: PurchaseOptions) => Promise<void> | void;
		/** Called when inquiry is submitted */
		onInquiry?: (message: string) => Promise<void> | void;
		/** Custom CSS class */
		class?: string;
	}

	let { artwork, pricing, onPurchase, onInquiry, class: className = '' }: Props = $props();

	// Component state
	type TabType = 'original' | 'prints' | 'licenses';
	let activeTab = $state<TabType>('original');
	let selectedPrint = $state<string | null>(null);
	let selectedLicense = $state<string | null>(null);
	let quantity = $state(1);
	let isProcessing = $state(false);
	let showInquiryForm = $state(false);
	let inquiryMessage = $state('');
	let error = $state<string | null>(null);

	// Determine available tabs
	const availableTabs = $derived(() => {
		const tabs: TabType[] = [];
		if (pricing.original) tabs.push('original');
		if (pricing.prints && pricing.prints.length > 0) tabs.push('prints');
		if (pricing.licenses && pricing.licenses.length > 0) tabs.push('licenses');
		return tabs;
	});

	// Set initial tab
	$effect(() => {
		const tabs = availableTabs();
		if (tabs.length > 0 && !tabs.includes(activeTab)) {
			activeTab = tabs[0];
		}
	});

	// Format currency
	function formatCurrency(amount: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
		}).format(amount);
	}

	// Get license type label
	function getLicenseLabel(type: string): string {
		const labels: Record<string, string> = {
			personal: 'Personal Use',
			commercial: 'Commercial Use',
			exclusive: 'Exclusive Rights',
		};
		return labels[type] || type;
	}

	// Get license type description
	function getLicenseDescription(type: string): string {
		const descriptions: Record<string, string> = {
			personal: 'For personal, non-commercial use only',
			commercial: 'For commercial projects and publications',
			exclusive: 'Full exclusive rights transfer',
		};
		return descriptions[type] || '';
	}

	// Calculate total
	const total = $derived(() => {
		if (activeTab === 'original' && pricing.original) {
			return { price: pricing.original.price, currency: pricing.original.currency };
		}
		if (activeTab === 'prints' && selectedPrint && pricing.prints) {
			const print = pricing.prints.find((p) => p.id === selectedPrint);
			if (print) {
				return { price: print.price * quantity, currency: print.currency };
			}
		}
		if (activeTab === 'licenses' && selectedLicense && pricing.licenses) {
			const license = pricing.licenses.find((l) => l.id === selectedLicense);
			if (license) {
				return { price: license.price, currency: license.currency };
			}
		}
		return null;
	});

	// Check if can purchase
	const canPurchase = $derived(() => {
		if (activeTab === 'original') {
			return pricing.original?.available && !pricing.original?.inquiryOnly;
		}
		if (activeTab === 'prints') {
			if (!selectedPrint || !pricing.prints) return false;
			const print = pricing.prints.find((p) => p.id === selectedPrint);
			return print?.available !== false;
		}
		if (activeTab === 'licenses') {
			if (!selectedLicense || !pricing.licenses) return false;
			const license = pricing.licenses.find((l) => l.id === selectedLicense);
			return license?.available !== false;
		}
		return false;
	});

	// Handle purchase
	async function handlePurchase() {
		if (!canPurchase() || isProcessing || !onPurchase) return;

		isProcessing = true;
		error = null;

		try {
			const totalValue = total();
			if (!totalValue) throw new Error('Invalid selection');

			const options: PurchaseOptions = {
				type: activeTab,
				price: totalValue.price,
				currency: totalValue.currency,
			};

			if (activeTab === 'prints' && selectedPrint) {
				options.itemId = selectedPrint;
				options.quantity = quantity;
			}
			if (activeTab === 'licenses' && selectedLicense) {
				options.itemId = selectedLicense;
			}

			await onPurchase(options);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to process purchase. Please try again.';
		} finally {
			isProcessing = false;
		}
	}

	// Handle inquiry
	async function handleInquiry() {
		if (!inquiryMessage.trim() || isProcessing || !onInquiry) return;

		isProcessing = true;
		error = null;

		try {
			await onInquiry(inquiryMessage);
			showInquiryForm = false;
			inquiryMessage = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to send inquiry. Please try again.';
		} finally {
			isProcessing = false;
		}
	}

	// Compute CSS classes
	const containerClass = $derived(
		['gr-monetization-purchase', className].filter(Boolean).join(' ')
	);
</script>

<div class={containerClass}>
	<!-- Header -->
	<div class="gr-monetization-purchase-header">
		<h3 class="gr-monetization-purchase-title">Purchase Options</h3>
		<p class="gr-monetization-purchase-notice">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			</svg>
			Direct to artist — no platform fees
		</p>
	</div>

	<!-- Tabs -->
	{#if availableTabs().length > 1}
		<div class="gr-monetization-purchase-tabs" role="tablist">
			{#if pricing.original}
				<button
					type="button"
					role="tab"
					class="gr-monetization-purchase-tab"
					class:gr-monetization-purchase-tab--active={activeTab === 'original'}
					aria-selected={activeTab === 'original'}
					onclick={() => (activeTab = 'original')}
				>
					Original
				</button>
			{/if}
			{#if pricing.prints && pricing.prints.length > 0}
				<button
					type="button"
					role="tab"
					class="gr-monetization-purchase-tab"
					class:gr-monetization-purchase-tab--active={activeTab === 'prints'}
					aria-selected={activeTab === 'prints'}
					onclick={() => (activeTab = 'prints')}
				>
					Prints
				</button>
			{/if}
			{#if pricing.licenses && pricing.licenses.length > 0}
				<button
					type="button"
					role="tab"
					class="gr-monetization-purchase-tab"
					class:gr-monetization-purchase-tab--active={activeTab === 'licenses'}
					aria-selected={activeTab === 'licenses'}
					onclick={() => (activeTab = 'licenses')}
				>
					Licenses
				</button>
			{/if}
		</div>
	{/if}

	<!-- Tab Content -->
	<div class="gr-monetization-purchase-content" role="tabpanel">
		<!-- Original -->
		{#if activeTab === 'original' && pricing.original}
			<div class="gr-monetization-purchase-original">
				<div class="gr-monetization-purchase-original-info">
					<span class="gr-monetization-purchase-original-label">Original Artwork</span>
					<span class="gr-monetization-purchase-original-price">
						{formatCurrency(pricing.original.price, pricing.original.currency)}
					</span>
				</div>
				{#if !pricing.original.available}
					<p class="gr-monetization-purchase-sold">This original has been sold</p>
				{:else if pricing.original.inquiryOnly}
					<p class="gr-monetization-purchase-inquiry-note">Price on inquiry</p>
				{/if}
			</div>
		{/if}

		<!-- Prints -->
		{#if activeTab === 'prints' && pricing.prints}
			<div class="gr-monetization-purchase-prints">
				{#each pricing.prints as print (print.id)}
					<label
						class="gr-monetization-purchase-print"
						class:gr-monetization-purchase-print--selected={selectedPrint === print.id}
						class:gr-monetization-purchase-print--unavailable={print.available === false}
					>
						<input
							type="radio"
							name="print"
							value={print.id}
							checked={selectedPrint === print.id}
							disabled={print.available === false}
							onchange={() => (selectedPrint = print.id)}
							class="gr-monetization-purchase-print-radio"
						/>
						<div class="gr-monetization-purchase-print-info">
							<span class="gr-monetization-purchase-print-size">{print.size}</span>
							{#if print.description}
								<span class="gr-monetization-purchase-print-desc">{print.description}</span>
							{/if}
							{#if print.edition}
								<span class="gr-monetization-purchase-print-edition">
									Edition {print.edition.current}/{print.edition.total}
								</span>
							{/if}
						</div>
						<span class="gr-monetization-purchase-print-price">
							{formatCurrency(print.price, print.currency)}
						</span>
					</label>
				{/each}

				{#if selectedPrint}
					<div class="gr-monetization-purchase-quantity">
						<label for="quantity" class="gr-monetization-purchase-quantity-label">Quantity</label>
						<div class="gr-monetization-purchase-quantity-controls">
							<button
								type="button"
								class="gr-monetization-purchase-quantity-btn"
								disabled={quantity <= 1}
								onclick={() => (quantity = Math.max(1, quantity - 1))}
								aria-label="Decrease quantity"
							>
								−
							</button>
							<input
								id="quantity"
								type="number"
								min="1"
								max="10"
								bind:value={quantity}
								class="gr-monetization-purchase-quantity-input"
							/>
							<button
								type="button"
								class="gr-monetization-purchase-quantity-btn"
								disabled={quantity >= 10}
								onclick={() => (quantity = Math.min(10, quantity + 1))}
								aria-label="Increase quantity"
							>
								+
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Licenses -->
		{#if activeTab === 'licenses' && pricing.licenses}
			<div class="gr-monetization-purchase-licenses">
				{#each pricing.licenses as license (license.id)}
					<label
						class="gr-monetization-purchase-license"
						class:gr-monetization-purchase-license--selected={selectedLicense === license.id}
						class:gr-monetization-purchase-license--unavailable={license.available === false}
					>
						<input
							type="radio"
							name="license"
							value={license.id}
							checked={selectedLicense === license.id}
							disabled={license.available === false}
							onchange={() => (selectedLicense = license.id)}
							class="gr-monetization-purchase-license-radio"
						/>
						<div class="gr-monetization-purchase-license-info">
							<span class="gr-monetization-purchase-license-type">
								{getLicenseLabel(license.type)}
							</span>
							<span class="gr-monetization-purchase-license-desc">
								{getLicenseDescription(license.type)}
							</span>
							<span class="gr-monetization-purchase-license-terms">{license.terms}</span>
						</div>
						<span class="gr-monetization-purchase-license-price">
							{formatCurrency(license.price, license.currency)}
						</span>
					</label>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Error -->
	{#if error}
		<div class="gr-monetization-purchase-error" role="alert">
			{error}
		</div>
	{/if}

	<!-- Total & Actions -->
	{#if total()}
		<div class="gr-monetization-purchase-total">
			<span class="gr-monetization-purchase-total-label">Total</span>
			<span class="gr-monetization-purchase-total-amount">
				{formatCurrency(total()!.price, total()!.currency)}
			</span>
		</div>
	{/if}

	<div class="gr-monetization-purchase-actions">
		{#if activeTab === 'original' && pricing.original?.inquiryOnly}
			<button
				type="button"
				class="gr-monetization-purchase-btn gr-monetization-purchase-btn--primary"
				onclick={() => (showInquiryForm = true)}
			>
				Inquire About This Work
			</button>
		{:else}
			<button
				type="button"
				class="gr-monetization-purchase-btn gr-monetization-purchase-btn--primary"
				disabled={!canPurchase() || isProcessing}
				onclick={handlePurchase}
			>
				{#if isProcessing}
					<span class="gr-monetization-purchase-spinner"></span>
					Processing...
				{:else}
					Purchase Now
				{/if}
			</button>
		{/if}

		<button
			type="button"
			class="gr-monetization-purchase-btn gr-monetization-purchase-btn--secondary"
			onclick={() => (showInquiryForm = true)}
		>
			Contact Artist
		</button>
	</div>

	<!-- Inquiry Form Modal -->
	{#if showInquiryForm}
		<div
			class="gr-monetization-purchase-inquiry-overlay"
			role="button"
			tabindex="0"
			onclick={() => (showInquiryForm = false)}
			onkeydown={(e) => e.key === 'Enter' && (showInquiryForm = false)}
		>
			<div
				class="gr-monetization-purchase-inquiry"
				role="none"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<h4 class="gr-monetization-purchase-inquiry-title">Contact {artwork.artistName}</h4>
				<textarea
					class="gr-monetization-purchase-inquiry-input"
					placeholder="Your message..."
					rows="4"
					bind:value={inquiryMessage}
				></textarea>
				<div class="gr-monetization-purchase-inquiry-actions">
					<button
						type="button"
						class="gr-monetization-purchase-btn gr-monetization-purchase-btn--secondary"
						onclick={() => (showInquiryForm = false)}
					>
						Cancel
					</button>
					<button
						type="button"
						class="gr-monetization-purchase-btn gr-monetization-purchase-btn--primary"
						disabled={!inquiryMessage.trim() || isProcessing}
						onclick={handleInquiry}
					>
						Send Message
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.gr-monetization-purchase {
		font-family: var(--gr-typography-fontFamily-sans);
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
	}

	.gr-monetization-purchase-header {
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-purchase-title {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.gr-monetization-purchase-notice {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-success-400);
		margin: 0;
	}

	.gr-monetization-purchase-notice svg {
		width: 16px;
		height: 16px;
	}

	/* Tabs */
	.gr-monetization-purchase-tabs {
		display: flex;
		gap: var(--gr-spacing-scale-1);
		margin-bottom: var(--gr-spacing-scale-5);
		border-bottom: 1px solid var(--gr-color-gray-800);
	}

	.gr-monetization-purchase-tab {
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--gr-color-gray-400);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-monetization-purchase-tab:hover {
		color: var(--gr-color-gray-200);
	}

	.gr-monetization-purchase-tab--active {
		color: var(--gr-color-primary-400);
		border-bottom-color: var(--gr-color-primary-500);
	}

	/* Content */
	.gr-monetization-purchase-content {
		margin-bottom: var(--gr-spacing-scale-5);
	}

	/* Original */
	.gr-monetization-purchase-original-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-850);
		border-radius: var(--gr-radii-md);
	}

	.gr-monetization-purchase-original-label {
		font-size: var(--gr-typography-fontSize-base);
		color: var(--gr-color-gray-200);
	}

	.gr-monetization-purchase-original-price {
		font-size: var(--gr-typography-fontSize-xl);
		font-weight: var(--gr-typography-fontWeight-bold);
		color: var(--gr-color-gray-100);
	}

	.gr-monetization-purchase-sold,
	.gr-monetization-purchase-inquiry-note {
		margin-top: var(--gr-spacing-scale-3);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		text-align: center;
	}

	/* Prints & Licenses */
	.gr-monetization-purchase-prints,
	.gr-monetization-purchase-licenses {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.gr-monetization-purchase-print,
	.gr-monetization-purchase-license {
		display: flex;
		align-items: flex-start;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-850);
		border: 2px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-monetization-purchase-print:hover,
	.gr-monetization-purchase-license:hover {
		border-color: var(--gr-color-gray-600);
	}

	.gr-monetization-purchase-print--selected,
	.gr-monetization-purchase-license--selected {
		border-color: var(--gr-color-primary-500);
		background: var(--gr-color-primary-500/10);
	}

	.gr-monetization-purchase-print--unavailable,
	.gr-monetization-purchase-license--unavailable {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.gr-monetization-purchase-print-radio,
	.gr-monetization-purchase-license-radio {
		margin-top: 2px;
		accent-color: var(--gr-color-primary-500);
	}

	.gr-monetization-purchase-print-info,
	.gr-monetization-purchase-license-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.gr-monetization-purchase-print-size,
	.gr-monetization-purchase-license-type {
		font-size: var(--gr-typography-fontSize-base);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-100);
	}

	.gr-monetization-purchase-print-desc,
	.gr-monetization-purchase-license-desc {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	.gr-monetization-purchase-print-edition {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	.gr-monetization-purchase-license-terms {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		font-style: italic;
	}

	.gr-monetization-purchase-print-price,
	.gr-monetization-purchase-license-price {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
	}

	/* Quantity */
	.gr-monetization-purchase-quantity {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: var(--gr-spacing-scale-4);
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-800);
	}

	.gr-monetization-purchase-quantity-label {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
	}

	.gr-monetization-purchase-quantity-controls {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-monetization-purchase-quantity-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-200);
		font-size: var(--gr-typography-fontSize-lg);
		cursor: pointer;
	}

	.gr-monetization-purchase-quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.gr-monetization-purchase-quantity-input {
		width: 50px;
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-100);
		text-align: center;
		font-size: var(--gr-typography-fontSize-base);
	}

	/* Error */
	.gr-monetization-purchase-error {
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-error-500/10);
		border: 1px solid var(--gr-color-error-500/30);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-error-400);
		font-size: var(--gr-typography-fontSize-sm);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	/* Total */
	.gr-monetization-purchase-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-850);
		border-radius: var(--gr-radii-md);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.gr-monetization-purchase-total-label {
		font-size: var(--gr-typography-fontSize-base);
		color: var(--gr-color-gray-300);
	}

	.gr-monetization-purchase-total-amount {
		font-size: var(--gr-typography-fontSize-2xl);
		font-weight: var(--gr-typography-fontWeight-bold);
		color: var(--gr-color-gray-100);
	}

	/* Actions */
	.gr-monetization-purchase-actions {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.gr-monetization-purchase-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		border: none;
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-typography-fontSize-base);
		font-weight: var(--gr-typography-fontWeight-semibold);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-monetization-purchase-btn--primary {
		background: var(--gr-color-primary-600);
		color: white;
	}

	.gr-monetization-purchase-btn--primary:hover:not(:disabled) {
		background: var(--gr-color-primary-500);
	}

	.gr-monetization-purchase-btn--primary:disabled {
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-400);
		cursor: not-allowed;
	}

	.gr-monetization-purchase-btn--secondary {
		background: var(--gr-color-gray-800);
		color: var(--gr-color-gray-200);
		border: 1px solid var(--gr-color-gray-700);
	}

	.gr-monetization-purchase-btn--secondary:hover {
		background: var(--gr-color-gray-700);
	}

	.gr-monetization-purchase-spinner {
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

	/* Inquiry Modal */
	.gr-monetization-purchase-inquiry-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--gr-spacing-scale-4);
	}

	.gr-monetization-purchase-inquiry {
		width: 100%;
		max-width: 400px;
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
	}

	.gr-monetization-purchase-inquiry-title {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.gr-monetization-purchase-inquiry-input {
		width: 100%;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-typography-fontSize-sm);
		resize: vertical;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.gr-monetization-purchase-inquiry-actions {
		display: flex;
		gap: var(--gr-spacing-scale-3);
	}
</style>
