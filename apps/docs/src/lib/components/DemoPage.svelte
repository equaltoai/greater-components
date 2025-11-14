<script lang="ts">
	export let eyebrow: string = 'Demo Suite';
	export let title: string;
	export let description: string = '';
</script>

<section class="demo-page">
	<header class="demo-header">
		<div>
			{#if eyebrow}
				<p class="eyebrow">{eyebrow}</p>
			{/if}
			<h1>{title}</h1>
			{#if description}
				<p class="description">{description}</p>
			{/if}
		</div>
		<div class="header-actions">
			<slot name="actions" />
		</div>
	</header>

	<div class="demo-content">
		<slot />
	</div>
</section>

<style>
	.demo-page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.demo-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--doc-border);
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 0.75rem;
		color: var(--doc-text);
		opacity: 0.7;
		margin-bottom: 0.25rem;
	}

	.demo-header h1 {
		margin: 0.25rem 0;
		font-size: 2rem;
	}

	.description {
		max-width: 52ch;
		margin: 0;
		color: var(--doc-text);
		opacity: 0.75;
		font-size: 1rem;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.demo-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.demo-content :global(> section) {
		background: var(--doc-bg);
		border: 1px solid var(--doc-border);
		border-radius: 1rem;
		padding: 1.75rem;
		box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
	}

	.demo-content :global(> section h2) {
		margin-top: 0;
	}

	@media (max-width: 768px) {
		.demo-header {
			flex-direction: column;
		}
	}
</style>
