<script lang="ts">
	import { Editor } from '../../src/components/Editor/index.js';
	import type { DraftData, EditorConfig } from '../../src/types.js';
	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		draft?: DraftData;
		config?: EditorConfig;
		onChange?: (draft: DraftData) => void;
		onSave?: (draft: DraftData) => Promise<void> | void;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		draft = {
			id: 'd1',
			title: 'Draft',
			content: '',
			contentFormat: 'markdown',
			savedAt: new Date(),
		},
		config = { mode: 'markdown' },
		onChange,
		onSave,
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Editor.Root {draft} {config} {onChange} {onSave}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Editor.Root>
