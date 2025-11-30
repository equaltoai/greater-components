<script>
	import { ThemeWorkbench, Card } from '@equaltoai/greater-components-primitives';
</script>

<div class="demo-container">
	<h1 class="demo-title">Theme Workbench</h1>
	<p class="demo-intro">
		Create and test custom themes using color harmony rules and WCAG contrast checking.
	</p>

	<Card>
		<ThemeWorkbench initialColor="#8b5cf6" onSave={(theme) => console.log('Theme saved:', theme)} />
	</Card>
</div>

<style>
	.demo-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.demo-title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.demo-intro {
		font-size: 1.1rem;
		color: var(--gr-color-text-muted);
		margin-bottom: 2rem;
	}
</style>
