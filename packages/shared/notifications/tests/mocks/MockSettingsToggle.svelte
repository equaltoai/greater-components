<script>
	let { label, value = $bindable() } = $props();
</script>

<label>
	{label}
	<input type="checkbox" bind:checked={value} />
</label>
