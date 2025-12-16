/**
 * Editor Compound Component
 *
 * Minimal authoring components for blog drafts.
 *
 * @module @equaltoai/greater-components/faces/blog/Editor
 */

export { default as Root } from './Root.svelte';
export { default as Toolbar } from './Toolbar.svelte';

export {
	EDITOR_CONTEXT_KEY,
	DEFAULT_EDITOR_CONFIG,
	createEditorContext,
	getEditorContext,
	hasEditorContext,
} from './context.js';

export type { EditorContext, EditorConfig } from './context.js';

export const Editor = {
	Root: {} as typeof import('./Root.svelte').default,
	Toolbar: {} as typeof import('./Toolbar.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import Toolbar from './Toolbar.svelte';

Editor.Root = Root;
Editor.Toolbar = Toolbar;

