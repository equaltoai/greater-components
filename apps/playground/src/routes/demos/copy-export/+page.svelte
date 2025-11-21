<script lang="ts">
	import {
		CopyButton,
		Button,
		Card,
		Heading,
		Text,
		Section,
		Container,
		TextField,
	} from '@equaltoai/greater-components-primitives';
	import { exportToMarkdown, exportChatToMarkdown } from '@equaltoai/greater-components-utils';

	let textToCopy = $state('npm install @equaltoai/greater-components');
	let chatTitle = $state('My Conversation');

	const sampleChat = [
		{
			id: '1',
			role: 'user',
			content: 'How do I use the CopyButton?',
			timestamp: new Date(Date.now() - 100000),
		},
		{
			id: '2',
			role: 'assistant',
			content: 'You can use it like this:\n```svelte\n<CopyButton text="Hello" />\n```',
			timestamp: new Date(Date.now() - 80000),
		},
		{ id: '3', role: 'user', content: 'Great, thanks!', timestamp: new Date(Date.now() - 60000) },
	];

	async function handleExportPage() {
		try {
			await exportToMarkdown({
				selector: 'main',
				title: 'Copy and Export Demo',
				includeMetadata: true,
				download: true,
				filename: 'demo-export.md',
			});
		} catch (e) {
			alert('Export failed: ' + e);
		}
	}

	async function handleExportChat() {
		try {
			await exportChatToMarkdown({
				messages: sampleChat,
				title: chatTitle,
				includeMetadata: true,
				download: true,
				filename: 'chat-export.md',
			});
		} catch (e) {
			alert('Chat export failed: ' + e);
		}
	}
</script>

<Container maxWidth="lg" padding="md">
	<div class="mb-8">
		<Heading level={1}>Copy & Export Utilities</Heading>
	</div>

	<Section spacing="md">
		<Heading level={2}>Copy Button Variants</Heading>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card padding="md" variant="outlined">
				<Heading level={3} size="sm" class="mb-4">Icon Only (Default)</Heading>
				<div class="flex items-center gap-4">
					<code class="bg-gray-100 p-2 rounded">{textToCopy}</code>
					<CopyButton text={textToCopy} />
				</div>
			</Card>

			<Card padding="md" variant="outlined">
				<Heading level={3} size="sm" class="mb-4">Text Only</Heading>
				<div class="flex items-center gap-4">
					<code class="bg-gray-100 p-2 rounded">{textToCopy}</code>
					<CopyButton text={textToCopy} variant="text" />
				</div>
			</Card>

			<Card padding="md" variant="outlined">
				<Heading level={3} size="sm" class="mb-4">Icon + Text</Heading>
				<div class="flex items-center gap-4">
					<code class="bg-gray-100 p-2 rounded">{textToCopy}</code>
					<CopyButton text={textToCopy} variant="icon-text" />
				</div>
			</Card>

			<Card padding="md" variant="outlined">
				<Heading level={3} size="sm" class="mb-4">Custom Labels</Heading>
				<div class="flex items-center gap-4">
					<code class="bg-gray-100 p-2 rounded">{textToCopy}</code>
					<CopyButton
						text={textToCopy}
						variant="icon-text"
						labels={{ default: 'Copy Command', success: 'Done!' }}
					/>
				</div>
			</Card>
		</div>
	</Section>

	<Section spacing="md">
		<Heading level={2}>Target Selector</Heading>
		<Card padding="md" variant="outlined">
			<Text class="mb-4">Copies content from the code block below using ID selector.</Text>

			<pre id="target-code" class="bg-gray-900 text-white p-4 rounded mb-4"><code
					>const greeting = 'Hello World';
console.log(greeting);</code
				></pre>

			<CopyButton
				targetSelector="#target-code"
				variant="icon-text"
				labels={{ default: 'Copy Code' }}
			/>
		</Card>
	</Section>

	<Section spacing="md">
		<Heading level={2}>Markdown Export</Heading>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<Card padding="md" variant="outlined">
				<Heading level={3} size="md" class="mb-4">Export Page</Heading>
				<Text class="mb-4">Export this entire demo page to Markdown.</Text>
				<Button onclick={handleExportPage}>Export Page to Markdown</Button>
			</Card>

			<Card padding="md" variant="outlined">
				<Heading level={3} size="md" class="mb-4">Export Chat</Heading>
				<TextField label="Chat Title" bind:value={chatTitle} class="mb-4" />

				<div class="bg-gray-50 p-4 rounded mb-4 border border-gray-200 max-h-60 overflow-y-auto">
					{#each sampleChat as msg (msg.id)}
						<div class="mb-2">
							<span class="font-bold">{msg.role}:</span>
							{msg.content}
						</div>
					{/each}
				</div>

				<Button onclick={handleExportChat}>Export Chat to Markdown</Button>
			</Card>
		</div>
	</Section>
</Container>

<style>
	/* Minimal tailwind-like utilities for demo if not available */
	.mb-2 {
		margin-bottom: 0.5rem;
	}
	.mb-4 {
		margin-bottom: 1rem;
	}
	.mb-8 {
		margin-bottom: 2rem;
	}
	.p-2 {
		padding: 0.5rem;
	}
	.p-4 {
		padding: 1rem;
	}
	.gap-4 {
		gap: 1rem;
	}
	.gap-8 {
		gap: 2rem;
	}
	.rounded {
		border-radius: 0.25rem;
	}
	.bg-gray-100 {
		background-color: #f3f4f6;
	}
	.bg-gray-50 {
		background-color: #f9fafb;
	}
	.bg-gray-900 {
		background-color: #111827;
	}
	.text-white {
		color: white;
	}
	.border {
		border-width: 1px;
	}
	.border-gray-200 {
		border-color: #e5e7eb;
	}
	.flex {
		display: flex;
	}
	.items-center {
		align-items: center;
	}
	.grid {
		display: grid;
	}
	.font-bold {
		font-weight: bold;
	}

	@media (min-width: 768px) {
		.md\:grid-cols-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
