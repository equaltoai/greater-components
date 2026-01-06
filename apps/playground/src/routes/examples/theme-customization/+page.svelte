<script lang="ts">
	import { ThemeWorkbench } from '@equaltoai/greater-components-primitives';
	import type { ThemeTokens } from '@equaltoai/greater-components-utils';

	type SavedTheme = ThemeTokens & { id: number };

	let savedThemes = $state<SavedTheme[]>([]);

	function handleSave(theme: ThemeTokens) {
		savedThemes = [...savedThemes, { ...theme, id: Date.now() }];
	}
</script>

<div class="example-container">
	<h1>Theme Customization</h1>
	<p>Create custom themes with color harmony and contrast checking.</p>

	<ThemeWorkbench initialColor="#3b82f6" onSave={handleSave} />

	{#if savedThemes.length > 0}
		<div class="saved-themes">
			<h2>Saved Themes</h2>
			{#each savedThemes as theme (theme.id)}
				<div class="theme-card">
					<svg class="color-swatch" viewBox="0 0 1 1" role="img" aria-label="Primary color preview">
						<rect x="0" y="0" width="1" height="1" fill={theme.colors.primary[500]} />
					</svg>
					<pre>{JSON.stringify(theme, null, 2)}</pre>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.example-container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.saved-themes {
		margin-top: 2rem;
	}

	.theme-card {
		border: 1px solid var(--gr-color-border);
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: var(--gr-radius-md);
	}

	.color-swatch {
		width: 50px;
		height: 50px;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	pre {
		background: var(--gr-color-surface-subtle);
		padding: 1rem;
		overflow: auto;
		font-size: 0.8rem;
	}
</style>
