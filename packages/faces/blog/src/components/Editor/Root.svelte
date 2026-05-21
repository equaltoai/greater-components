<!--
Editor.Root - Blog editor container

Provides a minimal authoring experience for markdown/HTML drafts with optional autosave.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { MarkdownRenderer } from '@equaltoai/greater-components-content';
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';
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

	const editorState = $state<EditorContext>({
		draft: initialDraft,
		config: {
			...DEFAULT_EDITOR_CONFIG,
			...initialConfig,
		},
		isDirty: false,
		isSaving: false,
		lastSaved: initialDraft.savedAt ? new Date(initialDraft.savedAt) : null,
	});

	createEditorContext(editorState);

	$effect(() => {
		editorState.config = {
			...DEFAULT_EDITOR_CONFIG,
			...config,
		};
	});

	$effect(() => {
		// Sync draft only when the identity changes to avoid clobbering edits.
		if (draft.id !== editorState.draft.id) {
			editorState.draft = draft;
			editorState.isDirty = false;
			editorState.lastSaved = draft.savedAt ? new Date(draft.savedAt) : null;
		}
	});

	let textarea: HTMLTextAreaElement | null = $state(null);

	const wordCount = $derived(
		editorState.config.showWordCount
			? (editorState.draft.content.trim().match(/\S+/g)?.length ?? 0)
			: undefined
	);
	const readingMinutes = $derived(
		editorState.config.showReadingTime && wordCount !== undefined
			? Math.max(1, Math.ceil(wordCount / 200))
			: undefined
	);

	const previewHtml = $derived(
		editorState.draft.contentFormat !== 'markdown' ? sanitizeHtml(editorState.draft.content) : ''
	);

	function emitChange() {
		editorState.isDirty = true;
		onChange?.({ ...editorState.draft });
	}

	async function saveDraft() {
		if (!onSave || editorState.isSaving) return;
		editorState.isSaving = true;
		try {
			await onSave({ ...editorState.draft });
			editorState.isDirty = false;
			editorState.lastSaved = new Date();
			editorState.draft.savedAt = editorState.lastSaved.toISOString();
		} finally {
			editorState.isSaving = false;
		}
	}

	$effect(() => {
		if (!onSave) return;
		const interval = editorState.config.autoSaveInterval;
		if (!interval || interval <= 0) return;

		const id = setInterval(() => {
			if (editorState.isDirty && !editorState.isSaving) {
				void saveDraft();
			}
		}, interval);

		return () => clearInterval(id);
	});

	function wrapSelection(prefix: string, suffix: string) {
		if (!textarea) return;

		const start = textarea.selectionStart ?? 0;
		const end = textarea.selectionEnd ?? 0;
		const value = editorState.draft.content;
		const before = value.slice(0, start);
		const selected = value.slice(start, end);
		const after = value.slice(end);

		editorState.draft.content = `${before}${prefix}${selected}${suffix}${after}`;
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
		const value = editorState.draft.content;
		const selection = value.slice(start, end) || value;
		const next = selection
			.split('\n')
			.map((line: string) => (line.trim() ? `${prefix}${line}` : line))
			.join('\n');

		if (value.slice(start, end)) {
			editorState.draft.content = `${value.slice(0, start)}${next}${value.slice(end)}`;
		} else {
			editorState.draft.content = next;
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
				const value = editorState.draft.content;
				const selected = value.slice(start, end) || 'link text';
				const before = value.slice(0, start);
				const after = value.slice(end);
				editorState.draft.content = `${before}[${selected}](${href})${after}`;
				emitChange();
				break;
			}
			default:
				break;
		}
	}
</script>

<section class={editorState.config.class} aria-label="Editor">
	{#if children}
		{@render children?.()}
	{:else}
		<Toolbar disabled={editorState.isSaving} onAction={handleToolbarAction} />

		<div class="gr-blog-editor__body">
			<textarea
				bind:this={textarea}
				placeholder={editorState.config.placeholder}
				bind:value={editorState.draft.content}
				oninput={emitChange}
				disabled={editorState.isSaving}
			></textarea>

			{#if editorState.config.mode === 'split'}
				<div class="gr-blog-editor__preview" aria-label="Preview">
					{#if editorState.draft.contentFormat === 'markdown'}
						<MarkdownRenderer content={editorState.draft.content} />
					{:else}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html previewHtml}
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
			{#if editorState.isSaving}
				<span>Saving…</span>
			{:else if editorState.isDirty}
				<span>Unsaved changes</span>
			{:else if editorState.lastSaved}
				<span>Saved</span>
			{/if}
			{#if onSave && editorState.isDirty && !editorState.isSaving}
				<button type="button" onclick={saveDraft}>Save</button>
			{/if}
		</div>
	{/if}
</section>
