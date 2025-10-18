<script lang="ts">
	import CopyIcon from '@greater/icons/icons/copy.svelte';
	import CheckIcon from '@greater/icons/icons/check.svelte';
	
	export let code: string;
	export let language: string = 'javascript';
	export let title: string = '';
	export let showLineNumbers: boolean = false;
	
	let copied = false;
	
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
	
	function highlightCode(rawCode: string): string {
		// This would be replaced with actual syntax highlighting
		// For now, we'll just escape HTML
		return rawCode
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}
	
	$: highlightedCode = highlightCode(code);
	$: lines = code.split('\n');
</script>

<div class="code-example">
	{#if title}
		<div class="code-header">
			<span class="code-title">{title}</span>
			<span class="code-language">{language}</span>
		</div>
	{/if}
	
	<div class="code-container">
		<button 
			class="copy-button"
			on:click={copyToClipboard}
			aria-label="Copy code"
			title={copied ? 'Copied!' : 'Copy code'}
		>
			{#if copied}
				<CheckIcon size={16} />
			{:else}
				<CopyIcon size={16} />
			{/if}
		</button>
		
		<pre class="code-pre">
			<code class="language-{language}" class:line-numbers={showLineNumbers}>
				{#if showLineNumbers}
					<span class="line-numbers-rows">
						{#each lines as line, lineIndex (`${lineIndex}-${line}`)}
							<span>{lineIndex + 1}</span>
						{/each}
					</span>
				{/if}
				{highlightedCode}
			</code>
		</pre>
	</div>
</div>

<style>
	.code-example {
		margin: 1rem 0;
		border: 1px solid var(--doc-border);
		border-radius: 0.5rem;
		overflow: hidden;
	}
	
	.code-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		background: var(--doc-surface-tertiary);
		border-bottom: 1px solid var(--doc-border);
	}
	
	.code-title {
		font-weight: 500;
		font-size: 0.875rem;
	}
	
	.code-language {
		padding: 0.125rem 0.5rem;
		background: var(--doc-bg);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		text-transform: uppercase;
		opacity: 0.6;
	}
	
	.code-container {
		position: relative;
		background: var(--doc-surface-secondary);
	}
	
	.copy-button {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		padding: 0.5rem;
		background: var(--doc-bg);
		border: 1px solid var(--doc-border);
		border-radius: 0.375rem;
		color: var(--doc-text);
		cursor: pointer;
		opacity: 0.7;
		transition: all 0.2s;
		z-index: 1;
	}
	
	.copy-button:hover {
		opacity: 1;
		background: var(--doc-surface-tertiary);
	}
	
	.code-pre {
		margin: 0;
		padding: 1rem;
		padding-right: 3rem;
		overflow-x: auto;
		background: transparent;
	}
	
	.code-pre code {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.6;
		background: transparent;
		padding: 0;
	}
	
	.code-pre code.line-numbers {
		padding-left: 3rem;
		position: relative;
	}
	
	.line-numbers-rows {
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		width: 2.5rem;
		text-align: right;
		opacity: 0.4;
		user-select: none;
	}
	
	.line-numbers-rows span {
		padding-right: 0.75rem;
		line-height: 1.6;
	}
</style>
