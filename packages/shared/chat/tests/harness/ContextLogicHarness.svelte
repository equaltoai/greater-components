<script lang="ts">
	import Container from '../../src/ChatContainer.svelte';
	import ContextTester from './ContextTester.svelte';
	import type { ChatHandlers, ChatContextValue } from '../../src/context.svelte.js';
    import type { ChatSettingsState } from '../../src/types.js';

	interface Props {
		handlers?: ChatHandlers;
        initialSettings?: ChatSettingsState;
		onContext: (ctx: ChatContextValue) => void;
	}

	let { handlers = {}, initialSettings = {}, onContext }: Props = $props();
</script>

<Container {handlers} {initialSettings}>
	<ContextTester {onContext} />
</Container>
