<script lang="ts">
	import { CodeBlock, MarkdownRenderer } from '@equaltoai/greater-components-content';
	import {
		DropZone,
		StreamingText,
		Container,
		Section,
		Heading,
		Card,
		Button,
	} from '@equaltoai/greater-components-primitives';

	interface DroppedItem {
		type: string;
		name?: string;
		size?: number;
		[key: string]: unknown;
	}

	// Demo states
	let isStreaming = $state(false);
	let streamedText = $state('');
	let droppedFiles = $state<DroppedItem[]>([]);

	const sampleMarkdown = `# Hello World
  
This is **bold** and this is *italic*.

## Code Example

\`\`\`javascript
const greeting = "Hello";
console.log(greeting);
\`\`\`

- List item 1
- List item 2

[Link to Google](https://google.com)
`;

	const fullText =
		'Here is some streaming text that appears like magic! It simulates an AI response generating content token by token.';

	function startStreaming() {
		if (isStreaming) return;
		isStreaming = true;
		streamedText = '';
		let i = 0;
		const interval = setInterval(() => {
			streamedText += fullText[i];
			i++;
			if (i >= fullText.length) {
				clearInterval(interval);
				isStreaming = false;
			}
		}, 50);
	}

	function handleDrop(items: DroppedItem[]) {
		droppedFiles = items;
	}
</script>

<Container maxWidth="lg" padding="md">
	<div class="mb-8">
		<Heading level={1}>Phase 3: Chat Components</Heading>
	</div>

	<!-- CodeBlock Demo -->
	<Section>
		<Heading level={2} class="mb-4">CodeBlock</Heading>
		<Card padding="md">
			<Heading level={3} size="sm" class="mb-4">Basic Usage</Heading>
			<CodeBlock code="npm install @equaltoai/greater-components" language="bash" showCopy />

			<div class="mt-6 mb-4">
				<Heading level={3} size="sm">With Line Numbers & Highlighting</Heading>
			</div>
			<CodeBlock
				code={`const x = 1;
const y = 2;
const z = x + y;
console.log(z);`}
				language="javascript"
				showLineNumbers
				highlightLines={[3]}
				filename="calculation.js"
			/>
		</Card>
	</Section>

	<!-- DropZone Demo -->
	<Section>
		<Heading level={2} class="mb-4">DropZone</Heading>
		<Card padding="md">
			<DropZone accept={{ files: ['.txt', '.md', '.png'], text: true }} onDrop={handleDrop}>
				<div class="flex flex-col items-center gap-2">
					<p class="font-medium">Drag files or text here</p>
					<p class="text-sm text-gray-500">Supports .txt, .md, .png</p>
				</div>
			</DropZone>

			{#if droppedFiles.length > 0}
				<div class="mt-4 p-4 bg-gray-50 rounded">
					<div class="mb-2">
						<Heading level={4} size="xs">Dropped Items:</Heading>
					</div>
					<ul class="list-disc pl-4">
						{#each droppedFiles as file, i (i)}
							<li>
								<strong>{file.type}:</strong>
								{file.name || 'No name'}
								<span class="text-xs text-gray-500"
									>({file.size ? file.size + ' bytes' : 'N/A'})</span
								>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</Card>
	</Section>

	<!-- MarkdownRenderer Demo -->
	<Section>
		<Heading level={2} class="mb-4">MarkdownRenderer</Heading>
		<Card padding="md">
			<MarkdownRenderer content={sampleMarkdown} />
		</Card>
	</Section>

	<!-- StreamingText Demo -->
	<Section>
		<Heading level={2} class="mb-4">StreamingText</Heading>
		<Card padding="md">
			<div class="min-h-[100px] mb-4 p-4 border rounded bg-gray-50">
				<StreamingText content={streamedText} streaming={isStreaming} showCursor />
			</div>
			<Button onclick={startStreaming} disabled={isStreaming}>
				{isStreaming ? 'Streaming...' : 'Start Streaming'}
			</Button>
		</Card>
	</Section>
</Container>

<style>
	/* Demo utilities */
	.mb-2 {
		margin-bottom: 0.5rem;
	}
	.mb-4 {
		margin-bottom: 1rem;
	}
	.mb-8 {
		margin-bottom: 2rem;
	}
	.mt-4 {
		margin-top: 1rem;
	}
	.mt-6 {
		margin-top: 1.5rem;
	}
	.p-4 {
		padding: 1rem;
	}
	.pl-4 {
		padding-left: 1rem;
	}
	.bg-gray-50 {
		background-color: var(--gr-color-gray-50);
	}
	.text-sm {
		font-size: 0.875rem;
	}
	.text-xs {
		font-size: 0.75rem;
	}
	.text-gray-500 {
		color: var(--gr-color-gray-500);
	}
	.font-medium {
		font-weight: 500;
	}
	.rounded {
		border-radius: var(--gr-radii-md);
	}
	.border {
		border: 1px solid var(--gr-semantic-border-subtle);
	}
	.flex {
		display: flex;
	}
	.flex-col {
		flex-direction: column;
	}
	.items-center {
		align-items: center;
	}
	.gap-2 {
		gap: 0.5rem;
	}
	.list-disc {
		list-style-type: disc;
	}
	.min-h-\[100px\] {
		min-height: 100px;
	}
</style>
