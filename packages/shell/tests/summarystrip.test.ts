import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import SummaryStrip from '../src/components/SummaryStrip.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('SummaryStrip.svelte', () => {
	it('renders a <section> with required aria-label', () => {
		const { container } = render(SummaryStrip, {
			label: 'Fleet summary',
			children: snippetOf('<div>x</div><div>y</div>'),
		});
		const section = container.querySelector('section.gr-shell-summary-strip');
		expect(section).toBeTruthy();
		expect(section?.getAttribute('aria-label')).toBe('Fleet summary');
	});

	it('renders children inside the strip', () => {
		const { container } = render(SummaryStrip, {
			label: 'Fleet summary',
			children: snippetOf('<div><span data-test="a"></span><span data-test="b"></span></div>'),
		});
		expect(container.querySelector('[data-test="a"]')).toBeTruthy();
		expect(container.querySelector('[data-test="b"]')).toBeTruthy();
	});

	it('applies column modifier classes', () => {
		const { container } = render(SummaryStrip, {
			label: 'Fleet summary',
			columns: 4,
			children: snippetOf('<div></div>'),
		});
		expect(container.querySelector('.gr-shell-summary-strip--columns-4')).toBeTruthy();
	});

	it('applies gap modifier classes', () => {
		const { container } = render(SummaryStrip, {
			label: 'Fleet summary',
			gap: 'lg',
			children: snippetOf('<div></div>'),
		});
		expect(container.querySelector('.gr-shell-summary-strip--gap-lg')).toBeTruthy();
	});

	it('does not set inline style attribute', () => {
		const { container } = render(SummaryStrip, {
			label: 'Fleet summary',
			children: snippetOf('<div></div>'),
		});
		expect(container.querySelector('.gr-shell-summary-strip')?.hasAttribute('style')).toBe(false);
	});
});
