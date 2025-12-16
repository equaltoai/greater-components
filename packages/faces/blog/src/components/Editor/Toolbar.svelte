<!--
Editor.Toolbar - Formatting toolbar for the blog editor
-->

<script lang="ts">
	interface ToolbarAction {
		id: string;
		label: string;
		short: string;
	}

	interface Props {
		disabled?: boolean;
		active?: string[];
		onAction?: (actionId: string) => void;
		class?: string;
	}

	let {
		disabled = false,
		active = [],
		onAction,
		class: className = '',
	}: Props = $props();

	const actions: ToolbarAction[][] = [
		[
			{ id: 'bold', label: 'Bold', short: 'B' },
			{ id: 'italic', label: 'Italic', short: 'I' },
			{ id: 'code', label: 'Inline code', short: '<>' },
		],
		[
			{ id: 'quote', label: 'Blockquote', short: '"' },
			{ id: 'link', label: 'Link', short: 'Link' },
		],
	];
</script>

<div class={`gr-blog-editor-toolbar ${className}`} role="toolbar" aria-label="Editor toolbar">
	{#each actions as group, groupIndex}
		{#if groupIndex > 0}
			<div class="gr-blog-editor-toolbar__divider" aria-hidden="true" />
		{/if}
		{#each group as action (action.id)}
			<button
				type="button"
				class="gr-blog-editor-toolbar__button"
				class:gr-blog-editor-toolbar__button--active={active.includes(action.id)}
				disabled={disabled}
				aria-label={action.label}
				onclick={() => onAction?.(action.id)}
			>
				{action.short}
			</button>
		{/each}
	{/each}
</div>
