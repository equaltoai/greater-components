# Copy and Export Examples

These utilities allow you to easily copy content to the clipboard or export it as Markdown files.

## Copy to Clipboard

### Basic Copy Button

The `CopyButton` component handles the entire copy interaction, including the visual feedback state (switching from copy icon to checkmark).

```svelte
<script>
	import { CopyButton } from '$lib/greater/primitives';
</script>

<div class="command-bar">
	<code>npx @equaltoai/greater-components-cli add faces/social</code>
	<CopyButton text="npx @equaltoai/greater-components-cli add faces/social" />
</div>
```

### Copy from Target Element

You can point the button to a DOM element using `targetSelector`.

```svelte
<pre id="code-example"><code
		>const x = 42;
const y = 100;</code
	></pre>

<CopyButton targetSelector="#code-example" variant="icon" />
```

### Custom Labels and Variants

```svelte
<!-- Text only -->
<CopyButton
	text="Hello World"
	variant="text"
	labels={{ default: 'Copy Text', success: 'Copied!' }}
/>

<!-- Icon and Text -->
<CopyButton text="Hello World" variant="icon-text" buttonVariant="outline" />
```

---

## Export to Markdown

### Export Page Content

Export any part of your page (e.g., an article or documentation section) to a Markdown file.

```svelte
<script>
	import { exportToMarkdown } from '$lib/greater/utils';
	import { Button } from '$lib/greater/primitives';

	async function exportArticle() {
		await exportToMarkdown({
			selector: 'article.content',
			title: document.title,
			includeMetadata: true, // Adds YAML frontmatter
			download: true,
			filename: 'article-export.md',
		});
	}
</script>

<Button onclick={exportArticle}>Download as Markdown</Button>
```

### Export Chat Conversation

Format and export chat histories, preserving timestamps and role names.

```svelte
<script>
	import { exportChatToMarkdown } from '$lib/greater/utils';
	import { Button } from '$lib/greater/primitives';

	let messages = [
		{ id: '1', role: 'user', content: 'How does PAI work?', timestamp: new Date() },
		{ id: '2', role: 'assistant', content: 'PAI is a framework...', timestamp: new Date() },
	];

	async function exportChat() {
		await exportChatToMarkdown({
			messages,
			title: 'My Chat Session',
			includeMetadata: true,
			download: true,
			filename: 'chat-history.md',
		});
	}
</script>

<Button onclick={exportChat}>Export Chat</Button>
```
