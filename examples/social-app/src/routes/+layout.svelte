<script lang="ts">
	// Layer 1: Design tokens (colors, spacing, typography)
	import '@equaltoai/greater-components/tokens/theme.css';
	// Layer 2: Primitive component styles
	import '@equaltoai/greater-components/primitives/style.css';
	// Layer 3: Social face styles (if using npm package for CSS)
	// import '@equaltoai/greater-components/faces/social/style.css';

	import { ThemeProvider } from '@equaltoai/greater-components/primitives';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Social App Example</title>
</svelte:head>

<ThemeProvider>
	<div class="app">
		<header class="app-header">
			<nav>
				<a href="/">Home</a>
				<a href="/explore">Explore</a>
				<a href="/notifications">Notifications</a>
				<a href="/profile/me">Profile</a>
			</nav>
		</header>
		<main class="app-main">
			{@render children()}
		</main>
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

	.app-header nav {
		display: flex;
		gap: var(--gr-spacing-4);
		max-width: 600px;
		margin: 0 auto;
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
		max-width: 600px;
		margin: 0 auto;
		padding: var(--gr-spacing-4);
		width: 100%;
	}
</style>
