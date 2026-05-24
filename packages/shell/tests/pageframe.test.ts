import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import PageFrame from '../src/components/PageFrame.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('PageFrame.svelte', () => {
	it('renders root with width modifier class', () => {
		const { container } = render(PageFrame, {
			width: 'wide',
			children: snippetOf('<p>page</p>'),
		});
		expect(container.querySelector('.gr-shell-page-frame--width-wide')).toBeTruthy();
	});

	it('renders header and footer slots when provided', () => {
		const { container } = render(PageFrame, {
			header: snippetOf('<div data-test="h"></div>'),
			footer: snippetOf('<div data-test="f"></div>'),
			children: snippetOf('<p>page</p>'),
		});
		expect(container.querySelector('header.gr-shell-page-frame__header')).toBeTruthy();
		expect(container.querySelector('footer.gr-shell-page-frame__footer')).toBeTruthy();
		expect(container.querySelector('[data-test="h"]')).toBeTruthy();
		expect(container.querySelector('[data-test="f"]')).toBeTruthy();
	});

	it('renders the aside element with the supplied accessible name', () => {
		const { container } = render(PageFrame, {
			aside: snippetOf('<div>filters</div>'),
			asideLabel: 'Filters',
			children: snippetOf('<p>page</p>'),
		});
		const aside = container.querySelector('aside.gr-shell-page-frame__aside');
		expect(aside).toBeTruthy();
		expect(aside?.getAttribute('aria-label')).toBe('Filters');
	});

	it('does not render an aside element when aside snippet is omitted', () => {
		const { container } = render(PageFrame, {
			children: snippetOf('<p>page</p>'),
		});
		expect(container.querySelector('aside.gr-shell-page-frame__aside')).toBeNull();
	});

	it('does not add a <main> landmark (PageFrame is content inside Shell’s main)', () => {
		const { container } = render(PageFrame, {
			children: snippetOf('<p>page</p>'),
		});
		expect(container.querySelector('main')).toBeNull();
	});

	it('does not set inline style attribute', () => {
		const { container } = render(PageFrame, {
			children: snippetOf('<p>page</p>'),
		});
		expect(container.querySelector('.gr-shell-page-frame')?.hasAttribute('style')).toBe(false);
	});
});
