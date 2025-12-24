<script>
	let { onclick, disabled, children } = $props();
</script>

<button {onclick} {disabled}>
	{@render children()}
</button>
