<script lang="ts">
	// Layer 1: Design tokens (colors, spacing, typography)
	import '@equaltoai/greater-components/tokens/theme.css';
	// Layer 2: Primitive component styles
	import '@equaltoai/greater-components/primitives/style.css';

	import { ThemeProvider } from '@equaltoai/greater-components/primitives';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Blog App Example</title>
</svelte:head>

<ThemeProvider>
	<div class="app">
		<header class="app-header">
			<div class="header-content">
				<a href="/" class="logo">My Blog</a>
				<nav>
					<a href="/">Home</a>
					<a href="/archive">Archive</a>
					<a href="/about">About</a>
				</nav>
			</div>
		</header>
		<main class="app-main">
			{@render children()}
		</main>
		<footer class="app-footer">
			<p>Built with Greater Components</p>
		</footer>
	</div>
</ThemeProvider>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.app-header {
		padding: var(--gr-spacing-4);
		border-bottom: 1px solid var(--gr-color-border);
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 800px;
		margin: 0 auto;
	}

	.logo {
		font-size: var(--gr-typography-fontSize-xl);
		font-weight: 700;
		color: var(--gr-color-text-primary);
		text-decoration: none;
	}

	.app-header nav {
		display: flex;
		gap: var(--gr-spacing-4);
	}

	.app-header a {
		color: var(--gr-color-text-primary);
		text-decoration: none;
	}

	.app-header a:hover {
		color: var(--gr-color-primary-600);
	}

	.app-main {
		flex: 1;
		max-width: 800px;
		margin: 0 auto;
		padding: var(--gr-spacing-6);
		width: 100%;
	}

	.app-footer {
		padding: var(--gr-spacing-4);
		text-align: center;
		border-top: 1px solid var(--gr-color-border);
		color: var(--gr-color-text-secondary);
	}
</style>
