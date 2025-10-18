<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import SearchIcon from '@greater/icons/icons/search.svelte';
	import XIcon from '@greater/icons/icons/x.svelte';
	import FileTextIcon from '@greater/icons/icons/file-text.svelte';
	import HashIcon from '@greater/icons/icons/hash.svelte';
	import { searchIndex } from '$lib/utils/search';
	import type { SearchDocument } from '$lib/utils/search';
	
	export let open = false;
	
	let searchQuery = '';
	let searchResults: SearchDocument[] = [];
	let selectedIndex = 0;
	let searchInput: HTMLInputElement;
	
	$: if (searchQuery) {
		searchResults = searchIndex.search(searchQuery, 10);
	} else {
		searchResults = [];
	}
	
	$: if (open && searchInput) {
		searchInput.focus();
	}
	
	$: {
		if (searchResults.length === 0) {
			selectedIndex = 0;
		} else if (selectedIndex >= searchResults.length) {
			selectedIndex = searchResults.length - 1;
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
		} else if (e.key === 'ArrowDown' && searchResults.length > 0) {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
		} else if (e.key === 'ArrowUp' && searchResults.length > 0) {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter' && searchResults[selectedIndex]) {
			e.preventDefault();
			navigateToResult(searchResults[selectedIndex]);
		}
	}
	
	function navigateToResult(result: SearchDocument) {
		goto(result.href);
		open = false;
		searchQuery = '';
	}
	
	function getIcon(type: SearchDocument['type']) {
		switch (type) {
			case 'component':
				return FileTextIcon;
			case 'guide':
				return FileTextIcon;
			case 'token':
				return HashIcon;
			default:
				return FileTextIcon;
		}
	}
	
	onMount(() => {
		document.body.style.overflow = 'hidden';
	});
	
	onDestroy(() => {
		document.body.style.overflow = '';
	});
</script>

{#if open}
	<div class="search-modal-overlay" on:pointerdown={() => open = false}>
		<div class="search-modal" on:pointerdown|stopPropagation>
			<div class="search-header">
				<SearchIcon size={20} />
				<input
					bind:this={searchInput}
					bind:value={searchQuery}
					type="text"
					placeholder="Search documentation..."
					class="search-input"
					on:keydown={handleKeydown}
				/>
				<button class="close-btn" on:click={() => open = false}>
					<XIcon size={20} />
				</button>
			</div>
			
			{#if searchResults.length > 0}
				<div class="search-results">
					{#each searchResults as result, i (result.id)}
						<button
							class="search-result"
							class:selected={i === selectedIndex}
							on:click={() => navigateToResult(result)}
							on:mouseenter={() => selectedIndex = i}
						>
							<div class="result-icon">
								<svelte:component this={getIcon(result.type)} size={16} />
							</div>
							<div class="result-content">
								<div class="result-title">{result.title}</div>
								<div class="result-path">{result.category} › {result.section}</div>
							</div>
							{#if result.status}
								<span class="status-badge {result.status}">{result.status}</span>
							{/if}
						</button>
					{/each}
				</div>
			{:else if searchQuery}
				<div class="no-results">
					<p>No results found for "{searchQuery}"</p>
					<p>Try searching for components, guides, or tokens</p>
				</div>
			{:else}
				<div class="search-suggestions">
					<p>Popular searches:</p>
					<div class="suggestion-chips">
						<button on:click={() => searchQuery = 'button'}>Button</button>
						<button on:click={() => searchQuery = 'theme'}>Theming</button>
						<button on:click={() => searchQuery = 'accessibility'}>Accessibility</button>
						<button on:click={() => searchQuery = 'typescript'}>TypeScript</button>
					</div>
				</div>
			{/if}
			
			<div class="search-footer">
				<div class="search-hint">
					<kbd>↵</kbd> to select
				</div>
				<div class="search-hint">
					<kbd>↑</kbd> <kbd>↓</kbd> to navigate
				</div>
				<div class="search-hint">
					<kbd>esc</kbd> to close
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.search-modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		z-index: 1000;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 10vh;
	}
	
	.search-modal {
		width: 90%;
		max-width: 600px;
		max-height: 70vh;
		background: var(--doc-bg);
		border: 1px solid var(--doc-border);
		border-radius: 0.75rem;
		box-shadow: var(--doc-shadow-lg);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.search-header {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--doc-border);
		gap: 0.75rem;
	}
	
	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--doc-text);
		font-size: 1rem;
		outline: none;
	}
	
	.close-btn {
		background: transparent;
		border: none;
		color: var(--doc-text);
		cursor: pointer;
		padding: 0.25rem;
		opacity: 0.6;
		transition: opacity 0.2s;
	}
	
	.close-btn:hover {
		opacity: 1;
	}
	
	.search-results {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}
	
	.search-result {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		color: var(--doc-text);
		text-align: left;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.search-result:hover,
	.search-result.selected {
		background: var(--doc-surface-secondary);
	}
	
	.result-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--doc-surface-tertiary);
		border-radius: 0.375rem;
		opacity: 0.8;
	}
	
	.result-content {
		flex: 1;
		min-width: 0;
	}
	
	.result-title {
		font-weight: 500;
		margin-bottom: 0.125rem;
	}
	
	.result-path {
		font-size: 0.875rem;
		opacity: 0.6;
	}
	
	.no-results,
	.search-suggestions {
		padding: 2rem;
		text-align: center;
		opacity: 0.6;
	}
	
	.suggestion-chips {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		margin-top: 1rem;
		flex-wrap: wrap;
	}
	
	.suggestion-chips button {
		padding: 0.375rem 0.75rem;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		border-radius: 0.375rem;
		color: var(--doc-text);
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.suggestion-chips button:hover {
		background: var(--doc-surface-tertiary);
		border-color: var(--doc-link);
	}
	
	.search-footer {
		display: flex;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--doc-border);
		font-size: 0.875rem;
		opacity: 0.6;
	}
	
	.search-hint {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	
	.search-hint kbd {
		padding: 0.125rem 0.375rem;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
	}
</style>
