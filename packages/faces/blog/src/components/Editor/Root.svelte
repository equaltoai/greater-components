<!--
Editor.Root - Blog editor container

Provides a minimal authoring experience for markdown/HTML drafts with optional autosave.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { MarkdownRenderer } from '@equaltoai/greater-components-content';
	import type { DraftData, EditorConfig, EditorContext } from '../../types.js';
	import { createEditorContext, DEFAULT_EDITOR_CONFIG } from './context.js';
	import Toolbar from './Toolbar.svelte';

	interface Props {
		draft: DraftData;
		config?: Partial<EditorConfig>;
		onChange?: (draft: DraftData) => void;
		onSave?: (draft: DraftData) => Promise<void> | void;
		children?: Snippet;
	}

	let { draft, config = {}, onChange, onSave, children }: Props = $props();

	const initialDraft = untrack(() => draft);
	const initialConfig = untrack(() => config);

	const state = $state<EditorContext>({
		draft: initialDraft,
		config: {
			...DEFAULT_EDITOR_CONFIG,
			...initialConfig,
		},
		isDirty: false,
		isSaving: false,
		lastSaved: initialDraft.savedAt ? new Date(initialDraft.savedAt) : null,
	});

	createEditorContext(state);

	$effect(() => {
		state.config = {
			...DEFAULT_EDITOR_CONFIG,
			...config,
		};
	});

	$effect(() => {
		// Sync draft only when the identity changes to avoid clobbering edits.
		if (draft.id !== state.draft.id) {
			state.draft = draft;
			state.isDirty = false;
			state.lastSaved = draft.savedAt ? new Date(draft.savedAt) : null;
		}
	});

	let textarea: HTMLTextAreaElement | null = $state(null);

	const wordCount = $derived(
		state.config.showWordCount
			? (state.draft.content.trim().match(/\S+/g)?.length ?? 0)
			: undefined
	);
	const readingMinutes = $derived(
		state.config.showReadingTime && wordCount !== undefined ? Math.max(1, Math.ceil(wordCount / 200)) : undefined
	);

	function emitChange() {
		state.isDirty = true;
		onChange?.({ ...state.draft });
	}

	async function saveDraft() {
		if (!onSave || state.isSaving) return;
		state.isSaving = true;
		try {
			await onSave({ ...state.draft });
			state.isDirty = false;
			state.lastSaved = new Date();
			state.draft.savedAt = state.lastSaved.toISOString();
		} finally {
			state.isSaving = false;
		}
	}

	$effect(() => {
		if (!onSave) return;
		const interval = state.config.autoSaveInterval;
		if (!interval || interval <= 0) return;

		const id = setInterval(() => {
			if (state.isDirty && !state.isSaving) {
				void saveDraft();
			}
		}, interval);

		return () => clearInterval(id);
	});

	function wrapSelection(prefix: string, suffix: string) {
		if (!textarea) return;

		const start = textarea.selectionStart ?? 0;
		const end = textarea.selectionEnd ?? 0;
		const value = state.draft.content;
		const before = value.slice(0, start);
		const selected = value.slice(start, end);
		const after = value.slice(end);

		state.draft.content = `${before}${prefix}${selected}${suffix}${after}`;
		emitChange();

		queueMicrotask(() => {
			textarea?.focus();
			const nextStart = start + prefix.length;
			const nextEnd = end + prefix.length;
			textarea?.setSelectionRange(nextStart, nextEnd);
		});
	}

	function prefixLines(prefix: string) {
		if (!textarea) return;

		const start = textarea.selectionStart ?? 0;
		const end = textarea.selectionEnd ?? 0;
		const value = state.draft.content;
		const selection = value.slice(start, end) || value;
		const next = selection
			.split('\n')
			.map((line) => (line.trim() ? `${prefix}${line}` : line))
			.join('\n');

		if (value.slice(start, end)) {
			state.draft.content = `${value.slice(0, start)}${next}${value.slice(end)}`;
		} else {
			state.draft.content = next;
		}

		emitChange();
	}

	function handleToolbarAction(actionId: string) {
		switch (actionId) {
			case 'bold':
				wrapSelection('**', '**');
				break;
			case 'italic':
				wrapSelection('*', '*');
				break;
			case 'code':
				wrapSelection('`', '`');
				break;
			case 'quote':
				prefixLines('> ');
				break;
			case 'link': {
				const href = prompt('Enter link URL');
				if (!href) return;
				if (!textarea) return;
				const start = textarea.selectionStart ?? 0;
				const end = textarea.selectionEnd ?? 0;
				const value = state.draft.content;
				const selected = value.slice(start, end) || 'link text';
				const before = value.slice(0, start);
				const after = value.slice(end);
				state.draft.content = `${before}[${selected}](${href})${after}`;
				emitChange();
				break;
			}
			default:
				break;
		}
	}
</script>

<section class={state.config.class} aria-label="Editor">
	{#if children}
		{@render children?.()}
	{:else}
		<Toolbar disabled={state.isSaving} onAction={handleToolbarAction} />

		<div class="gr-blog-editor__body">
			<textarea
				bind:this={textarea}
				placeholder={state.config.placeholder}
				bind:value={state.draft.content}
				oninput={emitChange}
				disabled={state.isSaving}
			></textarea>

			{#if state.config.mode === 'split'}
				<div class="gr-blog-editor__preview" aria-label="Preview">
					{#if state.draft.contentFormat === 'markdown'}
						<MarkdownRenderer content={state.draft.content} />
					{:else}
						{@html state.draft.content}
					{/if}
				</div>
			{/if}
		</div>

		<div class="gr-blog-editor__meta" aria-live="polite">
			{#if wordCount !== undefined}
				<span>{wordCount} words</span>
			{/if}
			{#if readingMinutes !== undefined}
				<span>{readingMinutes} min read</span>
			{/if}
			{#if state.isSaving}
				<span>Saving…</span>
			{:else if state.lastSaved}
				<span>Saved</span>
			{:else if state.isDirty}
				<span>Unsaved changes</span>
			{/if}
			{#if onSave && state.isDirty && !state.isSaving}
				<button type="button" onclick={saveDraft}>Save</button>
			{/if}
		</div>
	{/if}
</section>
