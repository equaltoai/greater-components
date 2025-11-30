# @equaltoai/greater-components-content

Rich content rendering components for Greater Components. This package provides components with heavier dependencies (syntax highlighting, markdown parsing) separated from core primitives.

## Components

- **CodeBlock** - Syntax-highlighted code display with copy button (uses [shiki](https://shiki.style/))
- **MarkdownRenderer** - Safe markdown rendering with sanitization (uses [marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify))

## Installation

```bash
pnpm add @equaltoai/greater-components
```

## Usage

```svelte
<script>
	import { CodeBlock, MarkdownRenderer } from '@equaltoai/greater-components/content';
</script>

<CodeBlock code="console.log('Hello, World!')" language="javascript" showLineNumbers />

<MarkdownRenderer content="# Hello\n\nThis is **markdown**." />
```

## Why Separate Package?

These components have heavy dependencies:

- `shiki` (~2MB) - Syntax highlighting
- `marked` - Markdown parsing
- `isomorphic-dompurify` - HTML sanitization

By isolating them in a separate package, apps that only need basic primitives (Button, Card, etc.) don't have to bundle these dependencies.

## License

AGPL-3.0-only
