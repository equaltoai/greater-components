<script lang="ts">
	import StreamingText from '../../src/components/StreamingText.svelte';

	let {
		content = '',
		streaming = true,
		onComplete,
	} = $props<{
		content?: string;
		streaming?: boolean;
		onComplete?: () => void;
	}>();

	import { untrack } from 'svelte';
	let currentContent = $state(untrack(() => content));
	let isStreaming = $state(untrack(() => streaming));

	export function setStreaming(val: boolean) {
		isStreaming = val;
	}

	export function setContent(val: string) {
		currentContent = val;
	}
</script>

<StreamingText content={currentContent} streaming={isStreaming} {onComplete} />
