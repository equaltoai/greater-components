<script lang="ts">
	import { onMount } from 'svelte';
	import SunIcon from '@equaltoai/greater-components-icons/icons/sun.svelte';
	import MoonIcon from '@equaltoai/greater-components-icons/icons/moon.svelte';
	
	let theme: 'light' | 'dark' = 'light';
	
	onMount(() => {
		// Get initial theme
		if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			theme = 'dark';
		} else {
			theme = 'light';
		}
	});
	
	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}
</script>

<button 
	class="theme-toggle"
	on:click={toggleTheme}
	aria-label="Toggle theme"
	title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
>
	{#if theme === 'light'}
		<MoonIcon size={20} />
	{:else}
		<SunIcon size={20} />
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		border-radius: 0.5rem;
		color: var(--doc-text);
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.theme-toggle:hover {
		background: var(--doc-surface-tertiary);
		border-color: var(--doc-link);
	}
	
	.theme-toggle:focus-visible {
		outline: 2px solid var(--doc-link);
		outline-offset: 2px;
	}
</style>