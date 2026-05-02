<script lang="ts">
	import Container from '../../src/ChatContainer.svelte';
	import type { ChatMessage } from '../../src/types.js';
	import ChatContainerStateReader from './ChatContainerStateReader.svelte';

	interface Props {
		messages?: ChatMessage[];
	}

	let { messages = [] }: Props = $props();
</script>

<Container {messages} autoScroll={false}>
	<ChatContainerStateReader />
</Container>
