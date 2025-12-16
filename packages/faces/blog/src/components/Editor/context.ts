/**
 * Editor Component Context
 *
 * Provides shared state for the blog editor components.
 *
 * @module @equaltoai/greater-components/faces/blog/Editor/context
 */

import { getContext, setContext } from 'svelte';
import type { EditorConfig, EditorContext } from '../../types.js';

export const EDITOR_CONTEXT_KEY = Symbol('editor-context');

export const DEFAULT_EDITOR_CONFIG: Required<EditorConfig> = {
	mode: 'markdown',
	autoSaveInterval: 30_000,
	showWordCount: true,
	showReadingTime: true,
	showSEO: false,
	showRevisions: false,
	placeholder: 'Start writing…',
	class: '',
};

export function createEditorContext(context: EditorContext): EditorContext {
	setContext(EDITOR_CONTEXT_KEY, context);
	return context;
}

export function getEditorContext(): EditorContext {
	const context = getContext<EditorContext>(EDITOR_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Editor context not found. Make sure this component is used within an Editor.Root component.'
		);
	}
	return context;
}

export function hasEditorContext(): boolean {
	try {
		return !!getContext<EditorContext>(EDITOR_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { EditorContext, EditorConfig };

