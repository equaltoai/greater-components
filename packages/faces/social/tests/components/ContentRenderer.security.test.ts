import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ContentRenderer from '../../src/components/ContentRenderer.svelte';

describe('ContentRenderer security', () => {
	it('does not render javascript: links from mentions/tags', () => {
		const { container } = render(ContentRenderer, {
			content: 'Hello @evil #bad',
			mentions: [
				{
					id: 'm1',
					username: 'evil',
					acct: 'evil@example.com',
					url: 'javascript:alert(1)',
				},
			],
			tags: [{ name: 'bad', url: 'javascript:alert(1)' }],
		});

		expect(container.querySelector('a')).toBeNull();
		expect(container.innerHTML).not.toContain('javascript:');
	});

	it('renders safe mention/tag links', () => {
		const { container } = render(ContentRenderer, {
			content: 'Hello @alice #hello',
			mentions: [
				{
					id: 'm1',
					username: 'alice',
					acct: 'alice@example.com',
					url: 'https://example.com/@alice',
				},
			],
			tags: [{ name: 'hello', url: 'https://example.com/tags/hello' }],
		});

		const mention = container.querySelector('a.mention') as HTMLAnchorElement | null;
		const hashtag = container.querySelector('a.hashtag') as HTMLAnchorElement | null;

		expect(mention?.getAttribute('href')).toBe('https://example.com/@alice');
		expect(hashtag?.getAttribute('href')).toBe('https://example.com/tags/hello');
	});
});
