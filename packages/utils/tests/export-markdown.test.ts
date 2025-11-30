import { describe, it, expect, vi } from 'vitest';
import { exportChatToMarkdown, exportToMarkdown, downloadMarkdown } from '../src/export-markdown';
// Note: htmlToMarkdown is exported from index, but for unit testing internal functions we can import from index or direct file.
// Using index is better to test public API.
import * as Utils from '../src/index';

describe('htmlToMarkdown', () => {
	it('converts headings', () => {
		const html = '<h1>Title</h1><h2>Subtitle</h2>';
		const md = Utils.htmlToMarkdown(html);

		expect(md).toContain('# Title');
		expect(md).toContain('## Subtitle');
	});

	it('converts lists', () => {
		const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
		const md = Utils.htmlToMarkdown(html);

		expect(md).toMatch(/- +Item 1/);
		expect(md).toMatch(/- +Item 2/);
	});

	it('strips scripts and styles', () => {
		const html = '<p>Content</p><script>alert("xss")</script><style>body { color: red; }</style>';
		const md = Utils.htmlToMarkdown(html);

		expect(md).toContain('Content');
		expect(md).not.toContain('alert');
		expect(md).not.toContain('xss');
		expect(md).not.toContain('body { color: red; }');
	});

	it('preserves code blocks', () => {
		const html = '<pre><code class="language-js">const x = 1;</code></pre>';
		const md = Utils.htmlToMarkdown(html);

		expect(md).toContain('```js');
		expect(md).toContain('const x = 1;');
		expect(md).toContain('```');
	});
});

describe('exportChatToMarkdown', () => {
	it('formats chat messages correctly', async () => {
		const messages = [
			{ id: '1', role: 'user', content: 'Hello', timestamp: new Date('2024-01-01T10:00:00Z') },
			{ id: '2', role: 'assistant', content: 'Hi!', timestamp: new Date('2024-01-01T10:01:00Z') },
		];

		const markdown = await exportChatToMarkdown({
			messages,
			includeMetadata: false,
		});

		expect(markdown).toContain('**User:**');
		expect(markdown).toContain('Hello');
		expect(markdown).toContain('**Assistant:**');
		expect(markdown).toContain('Hi!');
		// Check time formatting roughly (depends on locale)
		// expect(markdown).toContain('10:00');
	});

	it('includes frontmatter when requested', async () => {
		const messages: any[] = [];
		const markdown = await exportChatToMarkdown({
			messages,
			title: 'Test Chat',
			includeMetadata: true,
		});

		expect(markdown).toContain('---');
		expect(markdown).toContain('title: Test Chat');
		expect(markdown).toContain('type: chat-export');
	});
});

describe('exportToMarkdown', () => {
	it('exports element content', async () => {
		const element = document.createElement('div');
		element.innerHTML = '<h1>Test</h1><p>Content</p>';

		const markdown = await exportToMarkdown({
			element,
			includeMetadata: false,
		});

		expect(markdown).toContain('# Test');
		expect(markdown).toContain('Content');
	});

	it('exports element by selector', async () => {
		const element = document.createElement('div');
		element.id = 'export-target';
		element.innerHTML = '<h2>Selector Test</h2>';
		document.body.appendChild(element);

		const markdown = await exportToMarkdown({
			selector: '#export-target',
			includeMetadata: false,
		});

		expect(markdown).toContain('## Selector Test');
		document.body.removeChild(element);
	});

	it('throws error when element not found', async () => {
		await expect(
			exportToMarkdown({
				selector: '#non-existent',
			})
		).rejects.toThrow('Element to export not found');
	});

	it('adds title to content when metadata is disabled', async () => {
		const element = document.createElement('div');
		element.innerHTML = '<p>Content</p>';

		const markdown = await exportToMarkdown({
			element,
			title: 'Document Title',
			includeMetadata: false,
		});

		expect(markdown).toContain('# Document Title');
		expect(markdown).toContain('Content');
	});
});

describe('downloadMarkdown', () => {
	it('triggers download', () => {
		// Mock URL.createObjectURL and revokeObjectURL
		const createObjectURL = vi.fn().mockReturnValue('blob:url');
		const revokeObjectURL = vi.fn();
		global.URL.createObjectURL = createObjectURL;
		global.URL.revokeObjectURL = revokeObjectURL;

		// Mock createElement
		const link = document.createElement('a');
		const clickSpy = vi.spyOn(link, 'click');
		vi.spyOn(document, 'createElement').mockReturnValue(link);
		vi.spyOn(document.body, 'appendChild');
		vi.spyOn(document.body, 'removeChild');

		downloadMarkdown('# Test', 'test.md');

		expect(createObjectURL).toHaveBeenCalled();
		expect(link.href).toBe('blob:url');
		expect(link.download).toBe('test.md');
		expect(document.body.appendChild).toHaveBeenCalledWith(link);
		expect(clickSpy).toHaveBeenCalled();
		expect(document.body.removeChild).toHaveBeenCalledWith(link);
	});
});
