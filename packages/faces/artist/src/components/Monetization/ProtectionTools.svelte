<!--
Monetization.ProtectionTools - Anti-exploitation and protection tools

REQ-ECON-005: Fair visibility - no pay-for-prominence
REQ-ECON-006: Strong protections - DMCA, attribution, watermarking

Features:
- DMCA tools and attribution
- Watermarking options
- Reverse image search integration
- Theft reporting workflow
- Transparent discovery metrics

@component
@example
```svelte
<script>
  import { ProtectionTools } from '@equaltoai/greater-components/faces/artist/Monetization';
</script>

<ProtectionTools 
  {artwork} 
  onReport={handleReport}
  onWatermark={handleWatermark}
/>
```
-->

<script lang="ts">
	import type { ArtworkData } from '../../types/index.js';

	interface ReportData {
		type: 'theft' | 'misattribution' | 'unauthorized_use' | 'ai_training' | 'other';
		url?: string;
		description: string;
		evidence?: string[];
	}

	interface Props {
		/** Artwork to protect */
		artwork: ArtworkData;
		/** Called when report is submitted */
		onReport?: (data: ReportData) => Promise<void> | void;
		/** Called when watermark is requested */
		onWatermark?: (options: {
			type: 'visible' | 'invisible';
			position?: string;
		}) => Promise<string> | void;
		/** Called when DMCA takedown is initiated */
		onDMCA?: (url: string) => Promise<void> | void;
		/** Called when reverse image search is triggered */
		onReverseSearch?: () => Promise<{ url: string; matches: number }[]> | void;
		/** Custom CSS class */
		class?: string;
	}

	let {
		artwork,
		onReport,
		onWatermark,
		onDMCA,
		onReverseSearch,
		class: className = '',
	}: Props = $props();

	// State
	type ActivePanel = 'none' | 'report' | 'watermark' | 'dmca' | 'search';
	let activePanel = $state<ActivePanel>('none');
	let isProcessing = $state(false);
	let searchResults = $state<{ url: string; matches: number }[]>([]);

	// Report form state
	let reportType = $state<ReportData['type']>('theft');
	let reportUrl = $state('');
	let reportDescription = $state('');

	// Watermark state
	let watermarkType = $state<'visible' | 'invisible'>('visible');
	let watermarkPosition = $state('bottom-right');

	// Report type options
	const reportTypes = [
		{
			value: 'theft',
			label: 'Art Theft',
			description: 'Someone is using my work without permission',
		},
		{
			value: 'misattribution',
			label: 'Misattribution',
			description: 'My work is credited to someone else',
		},
		{
			value: 'unauthorized_use',
			label: 'Unauthorized Use',
			description: 'Commercial use without license',
		},
		{
			value: 'ai_training',
			label: 'AI Training',
			description: 'Used in AI training without consent',
		},
		{ value: 'other', label: 'Other', description: 'Other copyright concern' },
	] as const;

	// Watermark positions
	const watermarkPositions = [
		{ value: 'top-left', label: 'Top Left' },
		{ value: 'top-right', label: 'Top Right' },
		{ value: 'bottom-left', label: 'Bottom Left' },
		{ value: 'bottom-right', label: 'Bottom Right' },
		{ value: 'center', label: 'Center' },
		{ value: 'tiled', label: 'Tiled' },
	];

	// Handle report submission
	async function handleReportSubmit() {
		if (!reportDescription.trim() || isProcessing || !onReport) return;

		isProcessing = true;
		try {
			await onReport({
				type: reportType,
				url: reportUrl || undefined,
				description: reportDescription,
			});
			activePanel = 'none';
			reportType = 'theft';
			reportUrl = '';
			reportDescription = '';
		} finally {
			isProcessing = false;
		}
	}

	// Handle watermark
	async function handleWatermarkApply() {
		if (isProcessing || !onWatermark) return;

		isProcessing = true;
		try {
			await onWatermark({
				type: watermarkType,
				position: watermarkType === 'visible' ? watermarkPosition : undefined,
			});
			activePanel = 'none';
		} finally {
			isProcessing = false;
		}
	}

	// Handle reverse image search
	async function handleReverseSearch() {
		if (isProcessing || !onReverseSearch) return;

		isProcessing = true;
		try {
			const results = await onReverseSearch();
			searchResults = results || [];
			activePanel = 'search';
		} finally {
			isProcessing = false;
		}
	}

	// Handle DMCA
	async function handleDMCA(url: string) {
		if (isProcessing || !onDMCA) return;

		isProcessing = true;
		try {
			await onDMCA(url);
		} finally {
			isProcessing = false;
		}
	}

	// Close panel
	function closePanel() {
		activePanel = 'none';
	}

	// Compute CSS classes
	const containerClass = $derived(
		['gr-monetization-protection', className].filter(Boolean).join(' ')
	);
</script>

<div class={containerClass}>
	<!-- Header -->
	<div class="gr-monetization-protection-header">
		<h3 class="gr-monetization-protection-title">
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
			Protection Tools
		</h3>
		<p class="gr-monetization-protection-subtitle">Protect your work and maintain attribution</p>
	</div>

	<!-- Quick Actions -->
	<div class="gr-monetization-protection-actions">
		<button
			type="button"
			class="gr-monetization-protection-action"
			onclick={() => (activePanel = 'report')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
				<line x1="4" y1="22" x2="4" y2="15" />
			</svg>
			<span class="gr-monetization-protection-action-label">Report Theft</span>
		</button>

		<button
			type="button"
			class="gr-monetization-protection-action"
			onclick={() => (activePanel = 'watermark')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
				<circle cx="8.5" cy="8.5" r="1.5" />
				<polyline points="21 15 16 10 5 21" />
			</svg>
			<span class="gr-monetization-protection-action-label">Watermark</span>
		</button>

		<button
			type="button"
			class="gr-monetization-protection-action"
			onclick={handleReverseSearch}
			disabled={isProcessing}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
			<span class="gr-monetization-protection-action-label">Find Copies</span>
		</button>

		<button
			type="button"
			class="gr-monetization-protection-action"
			onclick={() => (activePanel = 'dmca')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
				<polyline points="14 2 14 8 20 8" />
				<line x1="12" y1="18" x2="12" y2="12" />
				<line x1="9" y1="15" x2="15" y2="15" />
			</svg>
			<span class="gr-monetization-protection-action-label">DMCA</span>
		</button>
	</div>

	<!-- Attribution Info -->
	<div class="gr-monetization-protection-attribution">
		<h4 class="gr-monetization-protection-section-title">Attribution</h4>
		<div class="gr-monetization-protection-attribution-content">
			<p class="gr-monetization-protection-attribution-text">
				© {new Date(artwork.createdAt).getFullYear()}
				{artwork.artistName}. All rights reserved.
			</p>
			<button
				type="button"
				class="gr-monetization-protection-copy"
				onclick={() =>
					navigator.clipboard.writeText(
						`© ${new Date(artwork.createdAt).getFullYear()} ${artwork.artistName}. All rights reserved.`
					)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
				Copy
			</button>
		</div>
	</div>

	<!-- Panels -->
	{#if activePanel !== 'none'}
		<div
			class="gr-monetization-protection-panel-overlay"
			role="button"
			tabindex="0"
			onclick={closePanel}
			onkeydown={(e) => e.key === 'Enter' && closePanel()}
		>
			<div
				class="gr-monetization-protection-panel"
				role="none"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					class="gr-monetization-protection-panel-close"
					onclick={closePanel}
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>

				<!-- Report Panel -->
				{#if activePanel === 'report'}
					<h4 class="gr-monetization-protection-panel-title">Report Infringement</h4>

					<div class="gr-monetization-protection-form-group">
						<span id="issue-type-label" class="gr-monetization-protection-label">Type of Issue</span
						>
						<div
							class="gr-monetization-protection-radio-group"
							role="radiogroup"
							aria-labelledby="issue-type-label"
						>
							{#each reportTypes as type (type.value)}
								<label class="gr-monetization-protection-radio">
									<input
										type="radio"
										name="reportType"
										value={type.value}
										checked={reportType === type.value}
										onchange={() => (reportType = type.value)}
									/>
									<div class="gr-monetization-protection-radio-content">
										<span class="gr-monetization-protection-radio-label">{type.label}</span>
										<span class="gr-monetization-protection-radio-desc">{type.description}</span>
									</div>
								</label>
							{/each}
						</div>
					</div>

					<div class="gr-monetization-protection-form-group">
						<label for="report-url" class="gr-monetization-protection-label">
							URL where infringement found (optional)
						</label>
						<input
							id="report-url"
							type="url"
							class="gr-monetization-protection-input"
							placeholder="https://..."
							bind:value={reportUrl}
						/>
					</div>

					<div class="gr-monetization-protection-form-group">
						<label for="report-desc" class="gr-monetization-protection-label"> Description </label>
						<textarea
							id="report-desc"
							class="gr-monetization-protection-textarea"
							placeholder="Describe the issue..."
							rows="4"
							bind:value={reportDescription}
						></textarea>
					</div>

					<button
						type="button"
						class="gr-monetization-protection-submit"
						disabled={!reportDescription.trim() || isProcessing}
						onclick={handleReportSubmit}
					>
						{isProcessing ? 'Submitting...' : 'Submit Report'}
					</button>
				{/if}

				<!-- Watermark Panel -->
				{#if activePanel === 'watermark'}
					<h4 class="gr-monetization-protection-panel-title">Add Watermark</h4>

					<div class="gr-monetization-protection-form-group">
						<span class="gr-monetization-protection-label">Watermark Type</span>
						<div class="gr-monetization-protection-toggle-group">
							<button
								type="button"
								class="gr-monetization-protection-toggle"
								class:gr-monetization-protection-toggle--active={watermarkType === 'visible'}
								onclick={() => (watermarkType = 'visible')}
							>
								Visible
							</button>
							<button
								type="button"
								class="gr-monetization-protection-toggle"
								class:gr-monetization-protection-toggle--active={watermarkType === 'invisible'}
								onclick={() => (watermarkType = 'invisible')}
							>
								Invisible
							</button>
						</div>
						<p class="gr-monetization-protection-hint">
							{watermarkType === 'visible'
								? 'A visible watermark will be added to your image'
								: 'An invisible digital signature will be embedded'}
						</p>
					</div>

					{#if watermarkType === 'visible'}
						<div class="gr-monetization-protection-form-group">
							<label class="gr-monetization-protection-label">
								Position
								<select class="gr-monetization-protection-select" bind:value={watermarkPosition}>
									{#each watermarkPositions as pos (pos.value)}
										<option value={pos.value}>{pos.label}</option>
									{/each}
								</select>
							</label>
						</div>
					{/if}

					<button
						type="button"
						class="gr-monetization-protection-submit"
						disabled={isProcessing}
						onclick={handleWatermarkApply}
					>
						{isProcessing ? 'Applying...' : 'Apply Watermark'}
					</button>
				{/if}

				<!-- Search Results Panel -->
				{#if activePanel === 'search'}
					<h4 class="gr-monetization-protection-panel-title">Reverse Image Search Results</h4>

					{#if searchResults.length === 0}
						<p class="gr-monetization-protection-empty">
							No copies found. Your artwork appears to be unique online.
						</p>
					{:else}
						<ul class="gr-monetization-protection-results">
							{#each searchResults as result (result.url)}
								<li class="gr-monetization-protection-result">
									<a
										href={result.url}
										target="_blank"
										rel="noopener noreferrer"
										class="gr-monetization-protection-result-url"
									>
										{result.url}
									</a>
									<span class="gr-monetization-protection-result-matches">
										{result.matches} match{result.matches !== 1 ? 'es' : ''}
									</span>
									<button
										type="button"
										class="gr-monetization-protection-result-action"
										onclick={() => handleDMCA(result.url)}
									>
										File DMCA
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}

				<!-- DMCA Panel -->
				{#if activePanel === 'dmca'}
					<h4 class="gr-monetization-protection-panel-title">DMCA Takedown</h4>

					<p class="gr-monetization-protection-info">
						A DMCA takedown notice is a legal request to remove infringing content. We'll help you
						prepare and submit the notice.
					</p>

					<div class="gr-monetization-protection-steps">
						<div class="gr-monetization-protection-step">
							<span class="gr-monetization-protection-step-num">1</span>
							<span class="gr-monetization-protection-step-text">Identify the infringing URL</span>
						</div>
						<div class="gr-monetization-protection-step">
							<span class="gr-monetization-protection-step-num">2</span>
							<span class="gr-monetization-protection-step-text">Provide proof of ownership</span>
						</div>
						<div class="gr-monetization-protection-step">
							<span class="gr-monetization-protection-step-num">3</span>
							<span class="gr-monetization-protection-step-text">Submit the takedown request</span>
						</div>
					</div>

					<button
						type="button"
						class="gr-monetization-protection-submit"
						onclick={() => (activePanel = 'report')}
					>
						Start DMCA Process
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.gr-monetization-protection {
		font-family: var(--gr-typography-fontFamily-sans);
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
	}

	.gr-monetization-protection-header {
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-protection-title {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.gr-monetization-protection-title svg {
		width: 20px;
		height: 20px;
		color: var(--gr-color-success-400);
	}

	.gr-monetization-protection-subtitle {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		margin: 0;
	}

	/* Actions */
	.gr-monetization-protection-actions {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--gr-spacing-scale-3);
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-protection-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-300);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-monetization-protection-action:hover:not(:disabled) {
		background: var(--gr-color-gray-800);
		border-color: var(--gr-color-gray-600);
		color: var(--gr-color-gray-100);
	}

	.gr-monetization-protection-action:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.gr-monetization-protection-action svg {
		width: 24px;
		height: 24px;
	}

	.gr-monetization-protection-action-label {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	/* Attribution */
	.gr-monetization-protection-section-title {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-300);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.gr-monetization-protection-attribution-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-850);
		border-radius: var(--gr-radii-md);
	}

	.gr-monetization-protection-attribution-text {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
		margin: 0;
	}

	.gr-monetization-protection-copy {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border: none;
		border-radius: var(--gr-radii-sm);
		color: var(--gr-color-gray-300);
		font-size: var(--gr-typography-fontSize-xs);
		cursor: pointer;
	}

	.gr-monetization-protection-copy svg {
		width: 14px;
		height: 14px;
	}

	/* Panel Overlay */
	.gr-monetization-protection-panel-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--gr-spacing-scale-4);
	}

	.gr-monetization-protection-panel {
		position: relative;
		width: 100%;
		max-width: 480px;
		max-height: 80vh;
		overflow-y: auto;
		background: var(--gr-color-gray-900);
		border: 1px solid var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-6);
	}

	.gr-monetization-protection-panel-close {
		position: absolute;
		top: var(--gr-spacing-scale-4);
		right: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-2);
		background: none;
		border: none;
		color: var(--gr-color-gray-400);
		cursor: pointer;
	}

	.gr-monetization-protection-panel-close svg {
		width: 20px;
		height: 20px;
	}

	.gr-monetization-protection-panel-title {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-5) 0;
	}

	/* Form Elements */
	.gr-monetization-protection-form-group {
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.gr-monetization-protection-label {
		display: block;
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-300);
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.gr-monetization-protection-input,
	.gr-monetization-protection-textarea,
	.gr-monetization-protection-select {
		width: 100%;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.gr-monetization-protection-input:focus,
	.gr-monetization-protection-textarea:focus,
	.gr-monetization-protection-select:focus {
		outline: none;
		border-color: var(--gr-color-primary-500);
	}

	.gr-monetization-protection-hint {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		margin-top: var(--gr-spacing-scale-2);
	}

	/* Radio Group */
	.gr-monetization-protection-radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-monetization-protection-radio {
		display: flex;
		align-items: flex-start;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		cursor: pointer;
	}

	.gr-monetization-protection-radio input {
		margin-top: 2px;
		accent-color: var(--gr-color-primary-500);
	}

	.gr-monetization-protection-radio-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.gr-monetization-protection-radio-label {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-200);
	}

	.gr-monetization-protection-radio-desc {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	/* Toggle Group */
	.gr-monetization-protection-toggle-group {
		display: flex;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-monetization-protection-toggle {
		flex: 1;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-400);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: all 200ms ease-out;
	}

	.gr-monetization-protection-toggle--active {
		background: var(--gr-color-primary-500/20);
		border-color: var(--gr-color-primary-500);
		color: var(--gr-color-primary-400);
	}

	/* Submit */
	.gr-monetization-protection-submit {
		width: 100%;
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		font-size: var(--gr-typography-fontSize-base);
		font-weight: var(--gr-typography-fontWeight-semibold);
		cursor: pointer;
		transition: background 200ms ease-out;
	}

	.gr-monetization-protection-submit:hover:not(:disabled) {
		background: var(--gr-color-primary-500);
	}

	.gr-monetization-protection-submit:disabled {
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-400);
		cursor: not-allowed;
	}

	/* Results */
	.gr-monetization-protection-empty {
		text-align: center;
		color: var(--gr-color-gray-400);
		padding: var(--gr-spacing-scale-6);
	}

	.gr-monetization-protection-results {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.gr-monetization-protection-result {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3);
		border-bottom: 1px solid var(--gr-color-gray-800);
	}

	.gr-monetization-protection-result-url {
		flex: 1;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-typography-fontSize-sm);
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.gr-monetization-protection-result-matches {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	.gr-monetization-protection-result-action {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-error-500/20);
		border: none;
		border-radius: var(--gr-radii-sm);
		color: var(--gr-color-error-400);
		font-size: var(--gr-typography-fontSize-xs);
		cursor: pointer;
	}

	/* Info & Steps */
	.gr-monetization-protection-info {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-protection-steps {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
		margin-bottom: var(--gr-spacing-scale-5);
	}

	.gr-monetization-protection-step {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
	}

	.gr-monetization-protection-step-num {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-primary-500/20);
		border-radius: 50%;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-semibold);
	}

	.gr-monetization-protection-step-text {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
	}
</style>
