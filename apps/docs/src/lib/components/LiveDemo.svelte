<script lang="ts">
	import CodeIcon from '@greater/icons/icons/code.svelte';
	import EyeIcon from '@greater/icons/icons/eye.svelte';
	import type { ComponentType } from 'svelte';
	
	export let component: ComponentType;
	export let props: Record<string, unknown> = {};
	export let showCode: boolean = false;
	export let height: string = 'auto';
	
	let showCodeView = showCode;
	let demoContainer: HTMLElement;
</script>

<div class="live-demo">
	<div class="demo-header">
		<div class="demo-tabs">
			<button 
				class="tab-button"
				class:active={!showCodeView}
				on:click={() => showCodeView = false}
			>
				<EyeIcon size={16} />
				Preview
			</button>
			<button 
				class="tab-button"
				class:active={showCodeView}
				on:click={() => showCodeView = true}
			>
				<CodeIcon size={16} />
				Code
			</button>
		</div>
	</div>
	
	<div class="demo-content" style="height: {height}">
		{#if !showCodeView}
			<div class="demo-preview" bind:this={demoContainer}>
				<svelte:component this={component} {...props} />
			</div>
		{:else}
			<div class="demo-code">
				<slot name="code" />
			</div>
		{/if}
	</div>
</div>

<style>
	.live-demo {
		border: 1px solid var(--doc-border);
		border-radius: 0.5rem;
		overflow: hidden;
		margin: 1rem 0;
	}
	
	.demo-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--doc-surface-secondary);
		border-bottom: 1px solid var(--doc-border);
		padding: 0.5rem 1rem;
	}
	
	.demo-tabs {
		display: flex;
		gap: 0.25rem;
	}
	
	.tab-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		background: transparent;
		border: none;
		color: var(--doc-text);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		opacity: 0.6;
		transition: all 0.2s;
		border-radius: 0.375rem;
	}
	
	.tab-button:hover {
		opacity: 1;
		background: var(--doc-bg);
	}
	
	.tab-button.active {
		opacity: 1;
		background: var(--doc-bg);
		color: var(--doc-link);
	}
	
	.demo-content {
		background: var(--doc-bg);
		min-height: 200px;
		position: relative;
	}
	
	.demo-preview {
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: inherit;
	}
	
	.demo-code {
		height: 100%;
		overflow: auto;
	}
</style>
