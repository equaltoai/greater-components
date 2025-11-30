<script lang="ts">
	import Settings from '../../src/ChatSettings.svelte';
	import type { ChatSettingsState, KnowledgeBaseConfig } from '../../src/types.js';

	interface Props {
		open?: boolean;
		settings: ChatSettingsState;
		availableModels?: Array<{ id: string; name: string }>;
		availableKnowledgeBases?: KnowledgeBaseConfig[];
		onSettingsChange?: (settings: ChatSettingsState) => void;
		onChange?: (settings: ChatSettingsState) => void;
		onSave?: (settings: ChatSettingsState) => void;
		onClose?: () => void;
		class?: string;
	}

	let {
		open = $bindable(false),
		settings,
		availableModels,
		availableKnowledgeBases = [],
		onSettingsChange,
		onChange,
		onSave,
		onClose,
		class: className = '',
	}: Props = $props();
</script>

<Settings
	bind:open
	{settings}
	{availableModels}
	{availableKnowledgeBases}
	{onSettingsChange}
	{onChange}
	{onSave}
	{onClose}
	class={className}
/>
