<script>
	let { title, children } = $props();
</script>

<div class="mock-settings-section">
	<h2>{title}</h2>
	{@render children()}
</div>
