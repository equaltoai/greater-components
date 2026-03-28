<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import AgentFaceDemo from '../../../../../examples/agent-face-svelte/src/AgentFaceDemo.svelte';
</script>

<DemoPage
	eyebrow="Agent Face"
	title="Agent-First Face Demo"
	description="Local playground route for the canonical Drones-oriented face bundle. This embeds the same demo component used by the standalone example consumption path."
>
	<AgentFaceDemo embedded />
</DemoPage>
