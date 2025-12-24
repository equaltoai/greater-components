<script>
	let { checked = false, onchange } = $props();
</script>

<input type="checkbox" {checked} {onchange} />
