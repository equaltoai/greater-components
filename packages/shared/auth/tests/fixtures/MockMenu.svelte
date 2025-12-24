<script>
	let { children, ...props } = $props();
</script>

<div data-testid="mock-menu" {...props}>
	{@render children?.()}
</div>
