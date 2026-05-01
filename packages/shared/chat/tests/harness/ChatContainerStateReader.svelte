<script lang="ts">
	import { getChatContext } from '../../src/context.svelte.js';

	const context = getChatContext();
	const contents = $derived(context.state.messages.map((message) => message.content).join('|'));
</script>

<output data-testid="message-count">{context.state.messages.length}</output>
<output data-testid="message-contents">{contents}</output>
