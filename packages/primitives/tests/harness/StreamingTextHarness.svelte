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

	let currentContent = $state(content);
	let isStreaming = $state(streaming);

	export function setStreaming(val: boolean) {
		isStreaming = val;
	}

	export function setContent(val: string) {
		currentContent = val;
	}
</script>

<StreamingText content={currentContent} streaming={isStreaming} {onComplete} />
