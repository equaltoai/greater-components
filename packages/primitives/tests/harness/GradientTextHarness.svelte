<script lang="ts">
	import GradientText from '../../src/components/GradientText.svelte';
	import type { ComponentProps } from 'svelte';

	let { props = {}, content = 'Text' } = $props<{
		props?: Partial<ComponentProps<typeof GradientText>>;
		content?: string;
	}>();
</script>

<GradientText {...props}>
	{content}
</GradientText>
