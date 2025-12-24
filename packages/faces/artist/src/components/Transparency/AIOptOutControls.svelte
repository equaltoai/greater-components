<!--
Transparency.AIOptOutControls - Granular AI opt-out controls

REQ-AI-011: Granular opt-out controls
REQ-PHIL-006: Full artist control over AI training usage

Features:
- Discovery AI (style/color search) opt-out
- Generative AI (model training) opt-out
- All AI usage opt-out
- Clear explanations of each option
- Retroactive opt-out capability
- Confirmation dialogs for changes
- Status indicators

@component
@example
```svelte
<script>
  import { AIOptOutControls } from '@equaltoai/greater-components/faces/artist/Transparency';
  
  let status = {
    discoveryAI: true,
    generativeAI: false,
    allAI: false
  };
  
  function handleUpdate(newStatus) {
    status = newStatus;
    // Save to backend
  }
</script>

<AIOptOutControls currentStatus={status} onUpdate={handleUpdate} />
```
-->

<script lang="ts">
	import type { AIOptOutStatus } from '../../types/transparency.js'; // eslint-disable-line @typescript-eslint/no-unused-vars

	/**
	 * Granular AI opt-out status
	 */
	interface GranularAIOptOutStatus {
		/** Allow for discovery/search */
		discoveryAI: boolean;
		/** Allow for training generative models */
		generativeAI: boolean;
		/** Opt out of all AI usage */
		allAI: boolean;
	}

	interface Props {
		/** Current opt-out status */
		currentStatus: GranularAIOptOutStatus;
		/** Update handler */
		onUpdate?: (status: GranularAIOptOutStatus) => void | Promise<void>;
		/** Show detailed explanations */
		showExplanations?: boolean;
		/** Enable confirmation dialogs */
		requireConfirmation?: boolean;
		/** Disabled state */
		disabled?: boolean;
		/** Custom CSS class */
		class?: string;
	}

	let {
		currentStatus,
		onUpdate,
		showExplanations = true,
		requireConfirmation = true,
		disabled = false,
		class: className = '',
	}: Props = $props();

	// Local state for pending changes
	let pendingChange: { key: keyof GranularAIOptOutStatus; value: boolean } | null = $state(null);
	let showConfirmDialog = $state(false);
	let isUpdating = $state(false);

	// Control definitions
	const controls = [
		{
			key: 'discoveryAI' as const,
			label: 'Discovery AI',
			description:
				'Allow your artwork to be indexed for style, color, and visual similarity searches. This helps users discover your work through AI-powered search features.',
			icon: '🔍',
			impact: 'low',
			impactText: 'Minimal impact - only affects search visibility',
		},
		{
			key: 'generativeAI' as const,
			label: 'Generative AI Training',
			description:
				'Allow your artwork to be used for training generative AI models. This includes style transfer, image generation, and similar AI systems.',
			icon: '🎨',
			impact: 'high',
			impactText: 'High impact - affects how AI models learn from your work',
		},
		{
			key: 'allAI' as const,
			label: 'All AI Usage',
			description:
				'Completely opt out of all AI-related features. Your artwork will not be processed by any AI systems on this platform.',
			icon: '🚫',
			impact: 'complete',
			impactText: 'Complete opt-out - no AI processing of your work',
		},
	];

	// Handle toggle change
	function handleToggle(key: keyof GranularAIOptOutStatus, newValue: boolean) {
		if (disabled || isUpdating) return;

		if (requireConfirmation) {
			pendingChange = { key, value: newValue };
			showConfirmDialog = true;
		} else {
			applyChange(key, newValue);
		}
	}

	// Apply the change
	async function applyChange(key: keyof GranularAIOptOutStatus, value: boolean) {
		isUpdating = true;

		let newStatus = { ...currentStatus };

		// Handle "all AI" toggle affecting others
		if (key === 'allAI') {
			if (value) {
				// Opting out of all AI disables everything
				newStatus = {
					discoveryAI: false,
					generativeAI: false,
					allAI: true,
				};
			} else {
				newStatus.allAI = false;
			}
		} else {
			newStatus[key] = value;
			// If enabling any specific AI, ensure allAI is false
			if (value) {
				newStatus.allAI = false;
			}
			// If disabling all specific options, set allAI to true
			if (!newStatus.discoveryAI && !newStatus.generativeAI) {
				newStatus.allAI = true;
			}
		}

		try {
			await onUpdate?.(newStatus);
		} finally {
			isUpdating = false;
			showConfirmDialog = false;
			pendingChange = null;
		}
	}

	// Confirm dialog handlers
	function confirmChange() {
		if (pendingChange) {
			applyChange(pendingChange.key, pendingChange.value);
		}
	}

	function cancelChange() {
		showConfirmDialog = false;
		pendingChange = null;
	}

	// Get status for a control
	function getControlStatus(key: keyof GranularAIOptOutStatus): boolean {
		if (key === 'allAI') {
			return currentStatus.allAI;
		}
		// If allAI is true, individual controls are effectively disabled
		if (currentStatus.allAI) {
			return false;
		}
		return currentStatus[key];
	}

	// Check if control is effectively disabled
	function isControlDisabled(key: keyof GranularAIOptOutStatus): boolean {
		if (disabled) return true;
		// Individual controls are disabled when allAI is true
		if (key !== 'allAI' && currentStatus.allAI) {
			return true;
		}
		return false;
	}

	// Compute CSS classes
	const containerClass = $derived(
		['gr-transparency-optout', disabled && 'gr-transparency-optout--disabled', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={containerClass}>
	<header class="gr-transparency-optout-header">
		<h3 class="gr-transparency-optout-title">AI Usage Controls</h3>
		<p class="gr-transparency-optout-subtitle">
			Control how AI systems can interact with your artwork
		</p>
	</header>

	<div class="gr-transparency-optout-controls" role="group" aria-label="AI opt-out controls">
		{#each controls as control (control.key)}
			{@const isEnabled = getControlStatus(control.key)}
			{@const isDisabled = isControlDisabled(control.key)}

			<div
				class="gr-transparency-optout-control gr-transparency-optout-control--{control.impact}"
				class:gr-transparency-optout-control--disabled={isDisabled}
			>
				<div class="gr-transparency-optout-control-header">
					<span class="gr-transparency-optout-control-icon" aria-hidden="true">
						{control.icon}
					</span>
					<div class="gr-transparency-optout-control-info">
						<span class="gr-transparency-optout-control-label">{control.label}</span>
						{#if showExplanations}
							<p class="gr-transparency-optout-control-desc">{control.description}</p>
						{/if}
					</div>

					<!-- Toggle switch -->
					<button
						type="button"
						role="switch"
						aria-checked={isEnabled}
						aria-label="{control.label} - {isEnabled ? 'Enabled' : 'Disabled'}"
						class="gr-transparency-optout-toggle"
						class:gr-transparency-optout-toggle--on={isEnabled}
						disabled={isDisabled || isUpdating}
						onclick={() => handleToggle(control.key, !isEnabled)}
					>
						<span class="gr-transparency-optout-toggle-track">
							<span class="gr-transparency-optout-toggle-thumb"></span>
						</span>
						<span class="gr-transparency-optout-toggle-label">
							{isEnabled ? 'Allowed' : 'Blocked'}
						</span>
					</button>
				</div>

				{#if showExplanations}
					<div class="gr-transparency-optout-control-impact">
						<span
							class="gr-transparency-optout-impact-badge gr-transparency-optout-impact-badge--{control.impact}"
						>
							{control.impact === 'low'
								? 'Low Impact'
								: control.impact === 'high'
									? 'High Impact'
									: 'Complete'}
						</span>
						<span class="gr-transparency-optout-impact-text">{control.impactText}</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Status summary -->
	<div class="gr-transparency-optout-status" role="status" aria-live="polite">
		{#if currentStatus.allAI}
			<div class="gr-transparency-optout-status-badge gr-transparency-optout-status-badge--blocked">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
				</svg>
				<span>All AI usage blocked</span>
			</div>
		{:else if !currentStatus.discoveryAI && !currentStatus.generativeAI}
			<div class="gr-transparency-optout-status-badge gr-transparency-optout-status-badge--blocked">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
				</svg>
				<span>AI usage restricted</span>
			</div>
		{:else}
			<div class="gr-transparency-optout-status-badge gr-transparency-optout-status-badge--partial">
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
				<span>
					{currentStatus.discoveryAI && currentStatus.generativeAI
						? 'All AI features enabled'
						: currentStatus.discoveryAI
							? 'Discovery AI only'
							: 'Generative AI only'}
				</span>
			</div>
		{/if}
	</div>

	<!-- Learn more link -->
	<div class="gr-transparency-optout-footer">
		<a href="#ai-policy" class="gr-transparency-optout-learn-more">
			Learn more about our AI policies
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<line x1="7" y1="17" x2="17" y2="7" />
				<polyline points="7 7 17 7 17 17" />
			</svg>
		</a>
	</div>
</div>

<!-- Confirmation Dialog -->
{#if showConfirmDialog && pendingChange}
	<div
		class="gr-transparency-optout-dialog-overlay"
		onclick={cancelChange}
		onkeydown={(e) => {
			if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				cancelChange();
			}
		}}
		role="button"
		tabindex="0"
		aria-label="Close dialog"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="gr-transparency-optout-dialog"
			role="alertdialog"
			aria-modal="true"
			tabindex="-1"
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-desc"
			onclick={(e) => e.stopPropagation()}
		>
			<h4 id="confirm-dialog-title" class="gr-transparency-optout-dialog-title">Confirm Change</h4>
			<p id="confirm-dialog-desc" class="gr-transparency-optout-dialog-desc">
				{#if pendingChange.key === 'allAI' && pendingChange.value}
					This will block all AI systems from processing your artwork. This change applies
					retroactively.
				{:else if pendingChange.key === 'generativeAI' && !pendingChange.value}
					This will prevent your artwork from being used to train generative AI models.
				{:else}
					Are you sure you want to change this setting?
				{/if}
			</p>
			<div class="gr-transparency-optout-dialog-actions">
				<button
					type="button"
					class="gr-transparency-optout-dialog-btn gr-transparency-optout-dialog-btn--cancel"
					onclick={cancelChange}
				>
					Cancel
				</button>
				<button
					type="button"
					class="gr-transparency-optout-dialog-btn gr-transparency-optout-dialog-btn--confirm"
					onclick={confirmChange}
					disabled={isUpdating}
				>
					{isUpdating ? 'Updating...' : 'Confirm'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.gr-transparency-optout {
		font-family: var(--gr-typography-fontFamily-sans);
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
	}

	.gr-transparency-optout--disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	/* Header */
	.gr-transparency-optout-header {
		margin-bottom: var(--gr-spacing-scale-6);
	}

	.gr-transparency-optout-title {
		margin: 0 0 var(--gr-spacing-scale-1) 0;
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
	}

	.gr-transparency-optout-subtitle {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	/* Controls */
	.gr-transparency-optout-controls {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.gr-transparency-optout-control {
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		transition: border-color 200ms ease-out;
	}

	.gr-transparency-optout-control:hover:not(.gr-transparency-optout-control--disabled) {
		border-color: var(--gr-color-gray-600);
	}

	.gr-transparency-optout-control--disabled {
		opacity: 0.5;
	}

	.gr-transparency-optout-control-header {
		display: flex;
		align-items: flex-start;
		gap: var(--gr-spacing-scale-3);
	}

	.gr-transparency-optout-control-icon {
		font-size: var(--gr-typography-fontSize-xl);
		flex-shrink: 0;
	}

	.gr-transparency-optout-control-info {
		flex: 1;
	}

	.gr-transparency-optout-control-label {
		display: block;
		font-size: var(--gr-typography-fontSize-base);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-100);
		margin-bottom: var(--gr-spacing-scale-1);
	}

	.gr-transparency-optout-control-desc {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		line-height: 1.5;
	}

	/* Toggle */
	.gr-transparency-optout-toggle {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		flex-shrink: 0;
	}

	.gr-transparency-optout-toggle:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.gr-transparency-optout-toggle-track {
		width: 48px;
		height: 26px;
		background: var(--gr-color-gray-600);
		border-radius: var(--gr-radii-full);
		position: relative;
		transition: background 200ms ease-out;
	}

	.gr-transparency-optout-toggle--on .gr-transparency-optout-toggle-track {
		background: var(--gr-color-primary-600);
	}

	.gr-transparency-optout-toggle-thumb {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 20px;
		height: 20px;
		background: var(--gr-color-white);
		border-radius: 50%;
		transition: transform 200ms ease-out;
	}

	.gr-transparency-optout-toggle--on .gr-transparency-optout-toggle-thumb {
		transform: translateX(22px);
	}

	.gr-transparency-optout-toggle-label {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-optout-toggle--on .gr-transparency-optout-toggle-label {
		color: var(--gr-color-primary-400);
	}

	/* Impact badge */
	.gr-transparency-optout-control-impact {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-3);
		padding-top: var(--gr-spacing-scale-3);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.gr-transparency-optout-impact-badge {
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: var(--gr-typography-fontWeight-medium);
		padding: var(--gr-spacing-scale-0-5) var(--gr-spacing-scale-2);
		border-radius: var(--gr-radii-sm);
	}

	.gr-transparency-optout-impact-badge--low {
		background: var(--gr-color-green-900);
		color: var(--gr-color-green-300);
	}

	.gr-transparency-optout-impact-badge--high {
		background: var(--gr-color-amber-900);
		color: var(--gr-color-amber-300);
	}

	.gr-transparency-optout-impact-badge--complete {
		background: var(--gr-color-red-900);
		color: var(--gr-color-red-300);
	}

	.gr-transparency-optout-impact-text {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	/* Status */
	.gr-transparency-optout-status {
		margin-top: var(--gr-spacing-scale-6);
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.gr-transparency-optout-status-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	.gr-transparency-optout-status-badge svg {
		width: 16px;
		height: 16px;
	}

	.gr-transparency-optout-status-badge--blocked {
		background: var(--gr-color-red-900);
		color: var(--gr-color-red-300);
	}

	.gr-transparency-optout-status-badge--partial {
		background: var(--gr-color-primary-900);
		color: var(--gr-color-primary-300);
	}

	/* Footer */
	.gr-transparency-optout-footer {
		margin-top: var(--gr-spacing-scale-4);
	}

	.gr-transparency-optout-learn-more {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-primary-400);
		text-decoration: none;
	}

	.gr-transparency-optout-learn-more:hover {
		text-decoration: underline;
	}

	.gr-transparency-optout-learn-more svg {
		width: 14px;
		height: 14px;
	}

	/* Dialog */
	.gr-transparency-optout-dialog-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.gr-transparency-optout-dialog {
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
		max-width: 400px;
		width: 90%;
	}

	.gr-transparency-optout-dialog-title {
		margin: 0 0 var(--gr-spacing-scale-2) 0;
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
	}

	.gr-transparency-optout-dialog-desc {
		margin: 0 0 var(--gr-spacing-scale-6) 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		line-height: 1.5;
	}

	.gr-transparency-optout-dialog-actions {
		display: flex;
		gap: var(--gr-spacing-scale-3);
		justify-content: flex-end;
	}

	.gr-transparency-optout-dialog-btn {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-transparency-optout-dialog-btn--cancel {
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		color: var(--gr-color-gray-200);
	}

	.gr-transparency-optout-dialog-btn--cancel:hover {
		background: var(--gr-color-gray-600);
	}

	.gr-transparency-optout-dialog-btn--confirm {
		background: var(--gr-color-primary-600);
		border: 1px solid var(--gr-color-primary-500);
		color: var(--gr-color-white);
	}

	.gr-transparency-optout-dialog-btn--confirm:hover {
		background: var(--gr-color-primary-500);
	}

	.gr-transparency-optout-dialog-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
