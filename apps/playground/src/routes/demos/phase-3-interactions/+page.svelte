<script lang="ts">
	import {
		CodeBlock,
		DropZone,
		MarkdownRenderer,
		StreamingText,
		Heading,
		Text,
		Container,
		Card,
		Button,
        TextArea
	} from '@equaltoai/greater-components-primitives';
	import type { DroppedItem } from '@equaltoai/greater-components-primitives/components/DropZone.svelte';

	let inputCode = $state('console.log("Hello World");');
	let files = $state<DroppedItem[]>([]);
    let markdownInput = $state('# Hello\n\nTry **editing** this!');
    
    let streamContent = $state('');
    let isStreaming = $state(false);
    
    function startStream() {
        isStreaming = true;
        streamContent = '';
        const text = "This is a simulated AI response streaming in real-time...";
        let i = 0;
        const interval = setInterval(() => {
            streamContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                isStreaming = false;
            }
        }, 50);
    }

	function handleDrop(items: DroppedItem[]) {
		files = items;
	}
</script>

<Container maxWidth="lg" padding="md">
	<div class="mb-8">
		<Heading level={1}>Phase 3: Advanced Interactions</Heading>
	</div>

	<div class="grid gap-8">
		<!-- CodeBlock -->
		<Card padding="md">
			<Heading level={2} size="md" class="mb-4">CodeBlock</Heading>
			<CodeBlock
				code={inputCode}
				language="javascript"
				showLineNumbers
				filename="example.js"
                class="mb-4"
			/>
            <TextArea bind:value={inputCode} label="Edit Code" />
		</Card>

		<!-- DropZone -->
		<Card padding="md">
			<Heading level={2} size="md" class="mb-4">DropZone</Heading>
			<DropZone onDrop={handleDrop} accept={{ files: ['image/*'], text: true }}>
				<div class="p-8 text-center">
					<Text>Drop images or text here</Text>
				</div>
			</DropZone>
            
            {#if files.length > 0}
                <div class="mt-4 p-4 bg-gray-50 rounded">
                    <Heading level={3} size="sm">Dropped Items:</Heading>
                    <ul class="list-disc pl-4">
                        {#each files as file, i (i)}
                            <li>{file.type}: {file.name || 'Content'} ({file.size || file.content.length} bytes)</li>
                        {/each}
                    </ul>
                </div>
            {/if}
		</Card>

        <!-- MarkdownRenderer -->
        <Card padding="md">
            <Heading level={2} size="md" class="mb-4">MarkdownRenderer</Heading>
            <div class="grid md:grid-cols-2 gap-4">
                <TextArea bind:value={markdownInput} rows={6} label="Input Markdown" />
                <div class="border p-4 rounded bg-white">
                    <MarkdownRenderer content={markdownInput} />
                </div>
            </div>
        </Card>
        
        <!-- StreamingText -->
        <Card padding="md">
            <Heading level={2} size="md" class="mb-4">StreamingText</Heading>
            <div class="mb-4 p-4 bg-gray-900 text-green-400 font-mono rounded min-h-[60px]">
                <StreamingText content={streamContent} streaming={isStreaming} />
            </div>
            <Button onclick={startStream} disabled={isStreaming}>
                {isStreaming ? 'Streaming...' : 'Start Stream'}
            </Button>
        </Card>
	</div>
</Container>

<style>
    .grid { display: grid; }
    .gap-8 { gap: 2rem; }
    .gap-4 { gap: 1rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mt-4 { margin-top: 1rem; }
    .p-4 { padding: 1rem; }
    .p-8 { padding: 2rem; }
    .border { border: 1px solid #e5e7eb; }
    .rounded { border-radius: 0.5rem; }
    .bg-white { background-color: white; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-900 { background-color: #111827; }
    .text-green-400 { color: #4ade80; }
    .text-center { text-align: center; }
    .font-mono { font-family: monospace; }
    .min-h-\[60px\] { min-height: 60px; }
    .list-disc { list-style-type: disc; }
    .pl-4 { padding-left: 1rem; }
    
    @media (min-width: 768px) {
        .md\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
    }
</style>
