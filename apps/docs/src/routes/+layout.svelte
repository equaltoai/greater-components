<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import { page } from '$app/stores';

	let isSearchOpen = false;
	let isMobileMenuOpen = false;

	// Close mobile menu on route change
	$: if ($page) {
		isMobileMenuOpen = false;
	}

	// Handle keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		// Cmd/Ctrl + K for search
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			isSearchOpen = true;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="docs-layout">
	<Header bind:isMobileMenuOpen on:search={() => (isSearchOpen = true)}>
		<ThemeToggle />
	</Header>

	<div class="docs-container">
		<Sidebar {isMobileMenuOpen} />

		<main class="docs-main">
			<slot />
		</main>
	</div>

	<Footer />
</div>

{#if isSearchOpen}
	<SearchModal bind:open={isSearchOpen} />
{/if}

<style>
	.docs-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.docs-container {
		flex: 1;
		display: flex;
		position: relative;
		padding-top: var(--doc-header-height);
	}

	.docs-main {
		flex: 1;
		margin-left: var(--doc-sidebar-width);
		min-width: 0;
		padding: 2rem;
		transition: margin-left 0.3s ease;
	}

	@media (max-width: 768px) {
		.docs-main {
			margin-left: 0;
			padding: 1rem;
		}
	}
</style>
