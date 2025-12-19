# Chat Interface Examples

This guide demonstrates how to build a complete AI chat interface using the Phase 3 components: `MarkdownRenderer`, `CodeBlock`, `DropZone`, and `StreamingText`.

## Overview

The chat interface is built by composing these primitives:

- **StreamingText**: For displaying the AI's response as it generates.
- **MarkdownRenderer**: For rendering the final AI response with formatting.
- **CodeBlock**: For displaying code snippets within the chat (used internally by MarkdownRenderer or standalone).
- **DropZone**: For allowing users to attach files or drop context.

## 1. Basic AI Message (Streaming)

When the AI is generating a response, use `StreamingText` to show the cursor effect.

```svelte
<script>
	import { StreamingText } from '$lib/greater/primitives';

	let content = 'Thinking...';
	let isGenerating = true;

	// In a real app, update 'content' as tokens arrive
</script>

<div class="message ai-message">
	<StreamingText {content} streaming={isGenerating} onComplete={() => console.log('Done')} />
</div>
```

## 2. Final AI Message (Markdown)

Once generation is complete, switch to `MarkdownRenderer` to render headings, bold text, links, and code blocks.

````svelte
<script>
  import { MarkdownRenderer } from '$lib/greater/content';

  const finalResponse = `
  # Solution

  You can use the
filter
 method.


```javascript
const numbers = [1, 2, 3, 4];
const evens = numbers.filter(n => n % 2 === 0);
````

`;
</script>

<div class="message ai-message">
  <MarkdownRenderer content={finalResponse} />
</div>
```

## 3. File Upload Area

Use `DropZone` to allow users to upload files for context.

```svelte
<script>
	import { DropZone, IconBadge } from '$lib/greater/primitives';
	import { FileIcon } from '$lib/greater/icons';

	function handleDrop(items) {
		items.forEach((item) => {
			console.log('Uploaded:', item.name, item.type);
			// If text, item.content has the text
			// If binary, item.content has DataURL
		});
	}
</script>

<DropZone
	accept={{ files: ['.txt', '.pdf', '.png'], text: true }}
	onDrop={handleDrop}
	variant="outlined"
>
	<div class="flex flex-col items-center gap-2">
		<IconBadge icon={FileIcon} />
		<p>Drop files to add context</p>
	</div>
</DropZone>
```

## 4. Standalone Code Block

If you want to display code outside of markdown (e.g. a file viewer), use `CodeBlock` directly.

```svelte
<script>
	import { CodeBlock } from '$lib/greater/content';
</script>

<CodeBlock
	code="console.log('Hello')"
	language="javascript"
	filename="script.js"
	showLineNumbers
	showCopy
/>
```

## 5. Full Chat Interface Example

Here is how you can combine them into a simple chat view.

````svelte
<script>
  import { MarkdownRenderer } from '$lib/greater/content';
  import {
    StreamingText,
    DropZone,
    TextField,
    Button,
    Container,
    Card
  } from '$lib/greater/primitives';

  let messages = $state([
    { role: 'user', content: 'How do I use array map?' }
  ]);

  let input = $state('');
  let isStreaming = $state(false);
  let currentStream = $state('');

  function sendMessage() {
    if (!input) return;

    // Add user message
    messages = [...messages, { role: 'user', content: input }];
    input = '';

    // Simulate AI response
    isStreaming = true;
    currentStream = '';

    let i = 0;
    const response = "You can use `Array.prototype.map()` to transform elements.\n\n```js\n[1, 2].map(x => x * 2);\n```";

    const interval = setInterval(() => {
      currentStream += response[i];
      i++;
      if (i >= response.length) {
        clearInterval(interval);
        isStreaming = false;
        messages = [...messages, { role: 'assistant', content: response }];
        currentStream = '';
      }
    }, 50);
  }
</script>

<Container maxWidth="md" class="py-8 h-screen flex flex-col">
  <!-- Chat History -->
  <div class="flex-1 overflow-y-auto space-y-4 mb-4">
    {#each messages as msg}
      <Card padding="sm" variant={msg.role === 'user' ? 'filled' : 'outlined'}>
        <p class="text-xs font-bold mb-1 text-gray-500">
          {msg.role === 'user' ? 'You' : 'AI'}
        </p>
        <MarkdownRenderer content={msg.content} />
      </Card>
    {/each}

    {#if isStreaming}
      <Card padding="sm" variant="outlined">
        <p class="text-xs font-bold mb-1 text-gray-500">AI</p>
        <StreamingText content={currentStream} />
      </Card>
    {/if}
  </div>

  <!-- Input Area -->
  <div class="mt-auto">
    <DropZone onDrop={/* handle files */} class="mb-2 h-24">
      <p class="text-sm text-gray-400">Drop context files</p>
    </DropZone>

    <div class="flex gap-2">
      <TextField bind:value={input} placeholder="Type a message..." class="flex-1" />
      <Button onclick={sendMessage} disabled={isStreaming}>Send</Button>
    </div>
  </div>
</Container>
````
