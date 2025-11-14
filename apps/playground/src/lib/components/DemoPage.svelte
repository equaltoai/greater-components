<script lang="ts">
  import type { Snippet } from 'svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		description?: string;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		eyebrow = 'Component Demo',
		title,
		description = '',
		children,
		actions
	}: Props = $props();
</script>

<section class="demo-page">
	<header>
		{#if eyebrow}
			<p class="eyebrow">{eyebrow}</p>
		{/if}
		<div class="header-row">
			<div>
				<h1>{title}</h1>
				{#if description}
					<p>{description}</p>
				{/if}
			</div>
			{#if actions}
				<div class="header-actions">
					{@render actions()}
				</div>
			{/if}
		</div>
	</header>
	<div class="demo-grid">
		{#if children}
			{@render children()}
		{/if}
	</div>
</section>

<style>
	.demo-page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	header p {
		margin-top: 0.5rem;
		color: var(--gr-semantic-foreground-secondary);
	}

	.header-row {
		display: flex;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.demo-grid {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin: 0;
	}
</style>
