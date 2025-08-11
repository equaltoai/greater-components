<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import MenuIcon from '@greater/icons/icons/menu.svelte';
	import SearchIcon from '@greater/icons/icons/search.svelte';
	import GitHubIcon from '@greater/icons/icons/github.svelte';
	
	export let isMobileMenuOpen = false;
	
	const dispatch = createEventDispatcher();
	
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	
	function handleSearch() {
		dispatch('search');
	}
</script>

<header class="docs-header">
	<div class="header-container">
		<div class="header-left">
			<button class="mobile-menu-btn" on:click={toggleMobileMenu} aria-label="Toggle menu">
				<MenuIcon size={24} />
			</button>
			
			<a href="/" class="logo">
				<span class="logo-text">Greater Components</span>
				<span class="version-badge">v0.1.0</span>
			</a>
		</div>
		
		<div class="header-center">
			<button class="search-btn" on:click={handleSearch}>
				<SearchIcon size={20} />
				<span>Search documentation...</span>
				<kbd>⌘K</kbd>
			</button>
		</div>
		
		<div class="header-right">
			<nav class="header-nav">
				<a href="/guides">Guides</a>
				<a href="/components">Components</a>
				<a href="/tokens">Tokens</a>
				<a href="/api">API</a>
			</nav>
			
			<div class="header-actions">
				<a href="https://github.com/greater-components/greater-components" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
					<GitHubIcon size={20} />
				</a>
				<slot />
			</div>
		</div>
	</div>
</header>

<style>
	.docs-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--doc-header-height);
		background: var(--doc-bg);
		border-bottom: 1px solid var(--doc-border);
		z-index: 100;
		backdrop-filter: blur(10px);
	}
	
	.header-container {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		max-width: 100%;
	}
	
	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.mobile-menu-btn {
		display: none;
		background: transparent;
		border: none;
		color: var(--doc-text);
		cursor: pointer;
		padding: 0.5rem;
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--doc-text);
		font-weight: 600;
		font-size: 1.125rem;
	}
	
	.version-badge {
		padding: 0.125rem 0.375rem;
		background: var(--doc-surface-secondary);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
	}
	
	.header-center {
		flex: 1;
		max-width: 600px;
		padding: 0 2rem;
	}
	
	.search-btn {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		border-radius: 0.5rem;
		color: var(--doc-text);
		opacity: 0.7;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.search-btn:hover {
		opacity: 1;
		border-color: var(--doc-link);
	}
	
	.search-btn span {
		flex: 1;
		text-align: left;
	}
	
	.search-btn kbd {
		padding: 0.125rem 0.375rem;
		background: var(--doc-bg);
		border: 1px solid var(--doc-border);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
	}
	
	.header-right {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	
	.header-nav {
		display: flex;
		gap: 1.5rem;
	}
	
	.header-nav a {
		color: var(--doc-text);
		text-decoration: none;
		font-weight: 500;
		opacity: 0.8;
		transition: opacity 0.2s;
	}
	
	.header-nav a:hover {
		opacity: 1;
	}
	
	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.header-actions a {
		display: flex;
		align-items: center;
		color: var(--doc-text);
		opacity: 0.7;
		transition: opacity 0.2s;
	}
	
	.header-actions a:hover {
		opacity: 1;
	}
	
	@media (max-width: 768px) {
		.mobile-menu-btn {
			display: block;
		}
		
		.header-center {
			display: none;
		}
		
		.header-nav {
			display: none;
		}
	}
</style>