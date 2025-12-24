<script>
	let { label, onclick, children, icon, ...props } = $props();
</script>

<button {onclick} data-testid="menu-item" aria-label={label} {...props}>
	{label}
	{@render icon?.()}
	{@render children?.()}
</button>
