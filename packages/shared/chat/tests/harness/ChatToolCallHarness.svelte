<script lang="ts">
	import ToolCall from '../../src/ChatToolCall.svelte';
	import type { ToolCall as ToolCallType } from '../../src/types.js';

	interface Props {
		toolCall: ToolCallType;
		showResult?: boolean;
		collapsible?: boolean;
		defaultCollapsed?: boolean;
		class?: string;
	}

	let {
		toolCall,
		showResult = true,
		collapsible = true,
		defaultCollapsed = true,
		class: className = '',
	}: Props = $props();
</script>

<ToolCall {toolCall} {showResult} {collapsible} {defaultCollapsed} class={className} />
