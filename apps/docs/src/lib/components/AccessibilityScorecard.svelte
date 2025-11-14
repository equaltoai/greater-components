<script lang="ts">
	import CheckIcon from '@equaltoai/greater-components-icons/icons/check.svelte';
	import XIcon from '@equaltoai/greater-components-icons/icons/x.svelte';
	import AlertCircleIcon from '@equaltoai/greater-components-icons/icons/alert-circle.svelte';

	export let wcagLevel: 'A' | 'AA' | 'AAA' = 'AA';
	export let keyboardNav: boolean = true;
	export let screenReader: boolean = true;
	export let colorContrast: boolean = true;
	export let focusManagement: boolean = true;
	export let ariaSupport: boolean = true;
	export let reducedMotion: boolean = false;
	export let notes: string[] = [];
	export let knownIssues: string[] = [];
	export let axeScore: number | null = null;
</script>

<div class="accessibility-scorecard">
	<div class="scorecard-header">
		<h3>Accessibility Compliance</h3>
		<div class="wcag-level">
			<span class="a11y-indicator wcag-{wcagLevel.toLowerCase()}">
				WCAG {wcagLevel}
			</span>
			{#if axeScore !== null}
				<span class="axe-score">Axe Score: {axeScore}%</span>
			{/if}
		</div>
	</div>

	<div class="features-grid">
		<div class="feature-item">
			<div class="feature-icon" class:supported={keyboardNav}>
				{#if keyboardNav}
					<CheckIcon size={16} />
				{:else}
					<XIcon size={16} />
				{/if}
			</div>
			<span>Keyboard Navigation</span>
		</div>

		<div class="feature-item">
			<div class="feature-icon" class:supported={screenReader}>
				{#if screenReader}
					<CheckIcon size={16} />
				{:else}
					<XIcon size={16} />
				{/if}
			</div>
			<span>Screen Reader Support</span>
		</div>

		<div class="feature-item">
			<div class="feature-icon" class:supported={colorContrast}>
				{#if colorContrast}
					<CheckIcon size={16} />
				{:else}
					<XIcon size={16} />
				{/if}
			</div>
			<span>Color Contrast</span>
		</div>

		<div class="feature-item">
			<div class="feature-icon" class:supported={focusManagement}>
				{#if focusManagement}
					<CheckIcon size={16} />
				{:else}
					<XIcon size={16} />
				{/if}
			</div>
			<span>Focus Management</span>
		</div>

		<div class="feature-item">
			<div class="feature-icon" class:supported={ariaSupport}>
				{#if ariaSupport}
					<CheckIcon size={16} />
				{:else}
					<XIcon size={16} />
				{/if}
			</div>
			<span>ARIA Support</span>
		</div>

		<div class="feature-item">
			<div class="feature-icon" class:supported={reducedMotion}>
				{#if reducedMotion}
					<CheckIcon size={16} />
				{:else}
					<XIcon size={16} />
				{/if}
			</div>
			<span>Reduced Motion</span>
		</div>
	</div>

	{#if notes.length > 0}
		<div class="notes-section">
			<h4>Notes</h4>
			<ul>
				{#each notes as note, noteIndex (note + '-' + noteIndex)}
					<li>{note}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if knownIssues.length > 0}
		<div class="issues-section">
			<div class="issues-header">
				<AlertCircleIcon size={16} />
				<h4>Known Issues</h4>
			</div>
			<ul>
				{#each knownIssues as issue, issueIndex (issue + '-' + issueIndex)}
					<li>{issue}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="keyboard-shortcuts">
		<h4>Keyboard Shortcuts</h4>
		<div class="shortcuts-grid">
			<div class="shortcut">
				<kbd>Tab</kbd>
				<span>Navigate forward</span>
			</div>
			<div class="shortcut">
				<kbd>Shift + Tab</kbd>
				<span>Navigate backward</span>
			</div>
			<div class="shortcut">
				<kbd>Enter</kbd>
				<span>Activate element</span>
			</div>
			<div class="shortcut">
				<kbd>Space</kbd>
				<span>Toggle selection</span>
			</div>
			<div class="shortcut">
				<kbd>Esc</kbd>
				<span>Close/Cancel</span>
			</div>
			<div class="shortcut">
				<kbd>Arrow Keys</kbd>
				<span>Navigate options</span>
			</div>
		</div>
	</div>
</div>

<style>
	.accessibility-scorecard {
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.scorecard-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.scorecard-header h3 {
		margin: 0;
	}

	.wcag-level {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.axe-score {
		padding: 0.25rem 0.5rem;
		background: var(--doc-bg);
		border: 1px solid var(--doc-border);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.feature-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #fee2e2;
		color: #991b1b;
	}

	.feature-icon.supported {
		background: #d1fae5;
		color: #065f46;
	}

	:global(.dark) .feature-icon {
		background: #7f1d1d;
		color: #fee2e2;
	}

	:global(.dark) .feature-icon.supported {
		background: #064e3b;
		color: #d1fae5;
	}

	.notes-section,
	.issues-section {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--doc-border);
	}

	.notes-section h4,
	.issues-section h4 {
		margin-top: 0;
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		opacity: 0.8;
	}

	.issues-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #f59e0b;
	}

	:global(.dark) .issues-header {
		color: #fbbf24;
	}

	.notes-section ul,
	.issues-section ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.notes-section li,
	.issues-section li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	.keyboard-shortcuts {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--doc-border);
	}

	.keyboard-shortcuts h4 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		opacity: 0.8;
	}

	.shortcuts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.shortcut {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.shortcut kbd {
		padding: 0.25rem 0.5rem;
		background: var(--doc-bg);
		border: 1px solid var(--doc-border);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
		white-space: nowrap;
	}

	.shortcut span {
		font-size: 0.875rem;
		opacity: 0.8;
	}
</style>
