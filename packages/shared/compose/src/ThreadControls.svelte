<!--
  ThreadControls - Settings and controls for thread composition

  Provides UI for managing thread-specific settings like auto-numbering,
  visibility inheritance, and thread preview.

  @component
  @example
  ```svelte
  <Compose.ThreadControls
    autoNumber={true}
    inheritVisibility={true}
    onSettingsChange={(settings) => console.log(settings)}
  />
  ```
-->

<script lang="ts">
	import { Switch, Select, Button } from '@equaltoai/greater-components-primitives';
	import { ListIcon, EyeIcon, LinkIcon } from '@equaltoai/greater-components-icons';

	interface ThreadSettings {
		autoNumber: boolean;
		inheritVisibility: boolean;
		showPreview: boolean;
		separator: 'none' | 'numbered' | 'emoji';
	}

	interface Props {
		/**
		 * Enable automatic post numbering (1/n, 2/n, etc.)
		 */
		autoNumber?: boolean;

		/**
		 * Inherit visibility from first post in thread
		 */
		inheritVisibility?: boolean;

		/**
		 * Show thread preview panel
		 */
		showPreview?: boolean;

		/**
		 * Thread separator style
		 */
		separator?: 'none' | 'numbered' | 'emoji';

		/**
		 * Called when settings change
		 */
		onSettingsChange?: (settings: ThreadSettings) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		autoNumber = $bindable(false),
		inheritVisibility = $bindable(true),
		showPreview = $bindable(false),
		separator = $bindable('numbered'),
		onSettingsChange,
		class: className = '',
	}: Props = $props();

	const separatorOptions = [
		{ value: 'none', label: 'No separator' },
		{ value: 'numbered', label: 'Numbered (1/n)' },
		{ value: 'emoji', label: 'Emoji (🧵)' },
	];

	function handleSettingsChange() {
		onSettingsChange?.({
			autoNumber,
			inheritVisibility,
			showPreview,
			separator,
		});
	}

	$effect(() => {
		// Trigger callback when any setting changes
		handleSettingsChange();
	});
</script>

<div class="thread-controls {className}" role="group" aria-label="Thread settings">
	<div class="thread-controls__row">
		<div class="thread-controls__setting">
			<ListIcon size={16} aria-hidden="true" />
			<span class="thread-controls__label">Auto-number posts</span>
			<Switch bind:checked={autoNumber} aria-describedby="auto-number-desc" />
		</div>
		<span id="auto-number-desc" class="thread-controls__description">
			Adds 1/n, 2/n numbering to each post
		</span>
	</div>

	<div class="thread-controls__row">
		<div class="thread-controls__setting">
			<EyeIcon size={16} aria-hidden="true" />
			<span class="thread-controls__label">Inherit visibility</span>
			<Switch bind:checked={inheritVisibility} aria-describedby="inherit-visibility-desc" />
		</div>
		<span id="inherit-visibility-desc" class="thread-controls__description">
			All posts use the same visibility as the first
		</span>
	</div>

	<div class="thread-controls__row">
		<div class="thread-controls__setting">
			<LinkIcon size={16} aria-hidden="true" />
			<span class="thread-controls__label">Separator style</span>
			<Select bind:value={separator} options={separatorOptions} />
		</div>
	</div>

	<div class="thread-controls__actions">
		<Button variant="ghost" size="sm" onclick={() => (showPreview = !showPreview)}>
			{showPreview ? 'Hide preview' : 'Show preview'}
		</Button>
	</div>
</div>

<style>
	.thread-controls {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-surface-secondary);
		border-radius: var(--gr-radii-md);
	}

	.thread-controls__row {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.thread-controls__setting {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.thread-controls__label {
		flex: 1;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-text-primary);
	}

	.thread-controls__description {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-text-muted);
		padding-left: calc(16px + var(--gr-spacing-scale-2));
	}

	.thread-controls__actions {
		display: flex;
		justify-content: flex-end;
		padding-top: var(--gr-spacing-scale-2);
		border-top: 1px solid var(--gr-color-border-subtle);
	}
</style>
