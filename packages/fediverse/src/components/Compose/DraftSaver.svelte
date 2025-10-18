<!--
Compose.DraftSaver - Auto-save drafts to localStorage

Automatically saves compose drafts and provides manual save/load controls.

@component
@example
```svelte
<Compose.Root>
  <Compose.Editor />
  <Compose.DraftSaver autoSave intervalSeconds={30} />
</Compose.Root>
```
-->

<script lang="ts">
	import { getComposeContext, type PostVisibility } from './context.js';
	import {
		saveDraft,
		loadDraft,
		deleteDraft,
		hasDraft,
		getDraftAge,
		formatDraftAge,
		type Draft,
	} from './DraftManager.js';

	interface Props {
		/**
		 * Draft key (for multiple drafts)
		 */
		draftKey?: string;

		/**
		 * Enable auto-save
		 */
		autoSave?: boolean;

		/**
		 * Auto-save interval in seconds
		 */
		intervalSeconds?: number;

		/**
		 * Show draft indicator
		 */
		showIndicator?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		draftKey = 'default',
		autoSave = true,
		intervalSeconds = 30,
		showIndicator = true,
		class: className = '',
	}: Props = $props();

	const context = getComposeContext();

	let lastSaved = $state<number | null>(null);
	let hasSavedDraft = $state(false);
	let draftAge = $state<number | null>(null);

	const VALID_VISIBILITIES: PostVisibility[] = ['public', 'unlisted', 'private', 'direct'];

	function normalizeVisibility(value?: string | null): PostVisibility {
		if (!value) return 'public';
		return VALID_VISIBILITIES.includes(value as PostVisibility)
			? (value as PostVisibility)
			: 'public';
	}

	/**
	 * Save current state as draft
	 */
	function save() {
		const draft: Draft = {
			content: context.state.content,
			contentWarning: context.state.contentWarning,
			visibility: context.state.visibility,
			savedAt: Date.now(),
			inReplyTo: context.state.inReplyTo,
			mediaIds: context.state.mediaAttachments.map((m) => m.id).filter(Boolean) as string[],
			metadata: {
				sensitive: context.state.contentWarningEnabled,
			},
		};

		const success = saveDraft(draft, draftKey);
		if (success) {
			lastSaved = Date.now();
			hasSavedDraft = true;
		}
		return success;
	}

	/**
	 * Load draft and restore state
	 */
	function load() {
		const draft = loadDraft(draftKey);
		if (draft) {
			context.updateState({
				content: draft.content || '',
				contentWarning: draft.contentWarning || '',
				visibility: normalizeVisibility(draft.visibility),
				inReplyTo: draft.inReplyTo,
				contentWarningEnabled: draft.metadata?.sensitive ?? false,
			});
			return true;
		}
		return false;
	}

	/**
	 * Clear draft
	 */
	function clear() {
		deleteDraft(draftKey);
		hasSavedDraft = false;
		lastSaved = null;
	}

	/**
	 * Auto-save effect
	 */
	$effect(() => {
		if (!autoSave) return;

		const interval = setInterval(() => {
			// Only save if there's content
			if (context.state.content.trim().length > 0) {
				save();
			}
		}, intervalSeconds * 1000);

		return () => clearInterval(interval);
	});

	/**
	 * Load draft on mount if exists
	 */
	$effect(() => {
		if (hasDraft(draftKey)) {
			hasSavedDraft = true;
			const age = getDraftAge(draftKey);
			if (age) {
				draftAge = age;
			}
		}
	});

	/**
	 * Update draft age periodically
	 */
	$effect(() => {
		if (!hasSavedDraft || !lastSaved) return;

		const interval = setInterval(() => {
			draftAge = Date.now() - lastSaved!;
		}, 1000);

		return () => clearInterval(interval);
	});

	/**
	 * Clear draft when submitted
	 */
	$effect(() => {
		if (context.state.submitting) {
			clear();
		}
	});
</script>

{#if showIndicator}
	<div class={`draft-saver ${className}`}>
		{#if hasSavedDraft && !context.state.content}
			<button type="button" class="draft-saver__load" onclick={() => load()}>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
					/>
				</svg>
				Load draft from {draftAge ? formatDraftAge(draftAge) : 'earlier'}
			</button>
		{/if}

		{#if lastSaved && context.state.content}
			<div class="draft-saver__indicator">
				<svg viewBox="0 0 24 24" fill="currentColor" class="draft-saver__icon">
					<path
						d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
					/>
				</svg>
				<span class="draft-saver__text">
					Draft saved {formatDraftAge(Date.now() - lastSaved)}
				</span>
			</div>
		{/if}
	</div>
{/if}

<style>
	.draft-saver {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
	}

	.draft-saver__load {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--draft-load-bg, #e8f5fd);
		border: 1px solid var(--draft-load-border, #1d9bf0);
		border-radius: var(--draft-radius, 6px);
		color: var(--draft-load-color, #1d9bf0);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.draft-saver__load:hover {
		background: var(--draft-load-hover, #d5eef9);
	}

	.draft-saver__load svg {
		width: 16px;
		height: 16px;
	}

	.draft-saver__indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary, #536471);
	}

	.draft-saver__icon {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.draft-saver__text {
		white-space: nowrap;
	}
</style>
