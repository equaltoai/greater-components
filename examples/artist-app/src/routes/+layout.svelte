<script lang="ts">
	import type { Snippet } from 'svelte';

	// CSS imports (added by Greater CLI)
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';
	import '$lib/styles/greater/artist.css';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="app">
	<header class="app-header">
		<nav class="app-nav">
			<a href="/" class="app-logo">
				<span class="app-logo__text">Artist Portfolio</span>
			</a>
			<div class="app-nav__links">
				<a href="/">Gallery</a>
				<a href="/discover">Discover</a>
				<a href="/artist/demo">Profile</a>
			</div>
		</nav>
	</header>

	<main class="app-main">
		{@render children()}
	</main>

	<footer class="app-footer">
		<p>Built with Greater Components Artist Face</p>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--gr-semantic-surface-default);
		color: var(--gr-semantic-foreground-default);
	}

	.app-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--gr-semantic-surface-elevated);
		border-bottom: 1px solid var(--gr-semantic-border-default);
	}

	.app-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.app-logo {
		text-decoration: none;
		color: inherit;
	}

	.app-logo__text {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.app-nav__links {
		display: flex;
		gap: 1.5rem;
	}

	.app-nav__links a {
		color: var(--gr-semantic-foreground-secondary);
		text-decoration: none;
		transition: color 0.2s;
	}

	.app-nav__links a:hover {
		color: var(--gr-semantic-foreground-default);
	}

	.app-main {
		flex: 1;
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.app-footer {
		padding: 2rem;
		text-align: center;
		color: var(--gr-semantic-foreground-muted);
		border-top: 1px solid var(--gr-semantic-border-default);
	}
</style>
