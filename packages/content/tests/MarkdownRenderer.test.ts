import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import MarkdownRenderer from '../src/components/MarkdownRenderer.svelte';
import { marked } from 'marked';

// Mock marked to test error handling
vi.mock('marked', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		marked: {
			...actual.marked,
			parse: vi.fn((...args) => actual.marked.parse(...args)),
			Renderer: actual.marked.Renderer,
		},
	};
});

describe('MarkdownRenderer.svelte', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders markdown content', () => {
		const { container } = render(MarkdownRenderer, { props: { content: '# Hello' } });
		const h1 = container.querySelector('h1');
		expect(h1).toBeTruthy();
		expect(h1?.textContent).toBe('Hello');
	});

	it('renders bold text', () => {
		const { container } = render(MarkdownRenderer, { props: { content: '**Bold**' } });
		const strong = container.querySelector('strong');
		expect(strong).toBeTruthy();
		expect(strong?.textContent).toBe('Bold');
	});

	it('sanitizes HTML', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '<script>alert("xss")</script>' },
		});
		const script = container.querySelector('script');
		expect(script).toBeFalsy();
	});

	it('renders links with target="_blank"', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '[Link](https://example.com)', openLinksInNewTab: true },
		});
		const link = container.querySelector('a');
		expect(link).toBeTruthy();
		expect(link?.getAttribute('href')).toBe('https://example.com');
		expect(link?.getAttribute('target')).toBe('_blank');
	});

	it('renders links without target="_blank" if openLinksInNewTab is false', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '[Link](https://example.com)', openLinksInNewTab: false },
		});
		const link = container.querySelector('a');
		expect(link).toBeTruthy();
		expect(link?.hasAttribute('target')).toBe(false);
	});

	it('does not render links if enableLinks is false', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '[Link](https://example.com)', enableLinks: false },
		});
		const link = container.querySelector('a');
		expect(link).toBeFalsy();
		expect(container.textContent).toContain('Link');
	});

	it('renders code blocks', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '```js\nconsole.log("hi");\n```' },
		});
		const pre = container.querySelector('pre');
		const code = container.querySelector('code');
		expect(pre).toBeTruthy();
		expect(code).toBeTruthy();
		expect(code?.textContent).toContain('console.log("hi")');
	});

	it('strips dangerous attributes', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '<a href="javascript:alert(1)">Click me</a>' },
		});
		const link = container.querySelector('a');
		// DOMPurify usually strips javascript: links, so href should be missing or safe
		const href = link?.getAttribute('href');
		if (href) {
			expect(href).not.toContain('javascript:');
		} else {
			expect(href).toBeNull();
		}
	});

	it('renders lists', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '- Item 1\n- Item 2' },
		});
		const ul = container.querySelector('ul');
		const lis = container.querySelectorAll('li');
		expect(ul).toBeTruthy();
		expect(lis.length).toBe(2);
	});

	it('supports custom allowed tags', () => {
		// Default strips iframe. Let's allow it? Or safer, try to strip 'strong'
		const { container } = render(MarkdownRenderer, {
			props: { content: '**Bold**', allowedTags: ['p'] }, // Only p allowed
		});
		const strong = container.querySelector('strong');
		expect(strong).toBeFalsy();
		expect(container.textContent).toContain('Bold');
	});

	it('renders unsafe HTML if sanitize is false', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '<div class="unsafe">Unsafe</div>', sanitize: false },
		});
		const div = container.querySelector('.unsafe');
		expect(div).toBeTruthy();
	});

	it('handles empty content', () => {
		const { container } = render(MarkdownRenderer, {
			props: { content: '' },
		});
		expect(container.textContent).toBe('');
	});

	it('calls onRenderComplete', async () => {
		const onRenderComplete = vi.fn();
		render(MarkdownRenderer, {
			props: { content: 'test', onRenderComplete },
		});
		await waitFor(() => {
			expect(onRenderComplete).toHaveBeenCalled();
		});
	});

	it('calls onError when parsing fails', async () => {
		const onError = vi.fn();

		// Mock marked.parse to throw
		vi.mocked(marked.parse).mockImplementationOnce(() => {
			throw new Error('Parse error');
		});

		render(MarkdownRenderer, {
			props: { content: 'fail', onError },
		});

		await waitFor(() => {
			expect(onError).toHaveBeenCalled();
		});
	});
});



