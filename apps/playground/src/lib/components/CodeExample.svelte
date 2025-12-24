<script lang="ts">
	import { Button } from '@equaltoai/greater-components-primitives';

	interface Props {
		code: string;
		title?: string;
		description?: string;
		language?: string;
	}

	let { code, title = 'Usage snippet', description, language = 'javascript' }: Props = $props();

	let copyState = $state<'idle' | 'copied'>('idle');

	const formattedCode = $derived(() => {
		const trimmed = code.replace(/^\n+/, '').replace(/\s+$/, '');
		const lines = trimmed.split('\n');
		const indent = lines.reduce(
			(acc, line) => {
				if (!line.trim()) return acc;
				const match = line.match(/^\s*/);
				const current = match ? match[0].length : 0;
				return acc === null ? current : Math.min(acc, current);
			},
			null as number | null
		);
		if (!indent) return trimmed;
		return lines.map((line) => line.slice(indent!)).join('\n');
	});

	const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;

	async function copyCode() {
		if (!clipboard?.writeText) {
			return;
		}

		try {
			await clipboard.writeText(formattedCode());
			copyState = 'copied';
			setTimeout(() => (copyState = 'idle'), 2000);
		} catch (error) {
			console.error('Unable to copy snippet', error);
		}
	}
</script>

```
<div class="code-example">
	<div class="code-example__header">
		<div>
			<p class="label">
				{title}
				{#if language}
					<span class="language-badge">{language}</span>
				{/if}
			</p>
			{#if description}
				<p class="description">{description}</p>
			{/if}
		</div>
		<Button variant="ghost" size="sm" onclick={copyCode} aria-label="Copy code snippet">
			{copyState === 'copied' ? 'Copied!' : 'Copy'}
		</Button>
	</div>
	<pre><code>{formattedCode()}</code></pre>
</div>

<style>
	.code-example {
		background: var(--gr-semantic-background-secondary);
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.code-example__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.language-badge {
		font-size: 0.7em;
		padding: 0.1em 0.4em;
		border-radius: 4px;
		background-color: var(--gr-semantic-background-tertiary);
		color: var(--gr-semantic-foreground-secondary);
	}

	.description {
		margin: 0.25rem 0 0;
		color: var(--gr-semantic-foreground-secondary);
		font-size: var(--gr-typography-fontSize-sm);
	}

	pre {
		margin: 0;
		padding: 1rem;
		background: var(--gr-semantic-background-primary);
		border-radius: var(--gr-radii-lg);
		overflow-x: auto;
		font-size: var(--gr-typography-fontSize-sm);
		line-height: 1.5;
	}

	code {
		font-family: var(
			--gr-typography-fontFamily-mono,
			'Fira Code',
			'SFMono-Regular',
			Menlo,
			monospace
		);
		color: var(--gr-semantic-foreground-primary);
		white-space: pre;
	}
</style>
