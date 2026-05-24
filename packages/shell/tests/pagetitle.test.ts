import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import PageTitle from '../src/components/PageTitle.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('PageTitle.svelte', () => {
	it('renders an <h1> by default', () => {
		const { container } = render(PageTitle, { title: 'Overview' });
		const heading = container.querySelector('h1.gr-shell-page-title__heading');
		expect(heading).toBeTruthy();
		expect(heading?.textContent).toBe('Overview');
	});

	it('renders an <h2> when level=2', () => {
		const { container } = render(PageTitle, { title: 'Section', level: 2 });
		expect(container.querySelector('h2.gr-shell-page-title__heading')).toBeTruthy();
		expect(container.querySelector('h1')).toBeNull();
	});

	it('renders eyebrow, subtitle, and description when provided', () => {
		const { getByText } = render(PageTitle, {
			title: 'Overview',
			eyebrow: 'Project 39',
			subtitle: 'Fleet view',
			description: 'Live release readiness across all instances.',
		});
		expect(getByText('Project 39')).toBeTruthy();
		expect(getByText('Fleet view')).toBeTruthy();
		expect(getByText('Live release readiness across all instances.')).toBeTruthy();
	});

	it('renders actions slot inside a role=group', () => {
		const { container } = render(PageTitle, {
			title: 'Overview',
			actions: snippetOf('<button>refresh</button>'),
		});
		const actions = container.querySelector('.gr-shell-page-title__actions');
		expect(actions?.getAttribute('role')).toBe('group');
		expect(actions?.querySelector('button')).toBeTruthy();
	});

	it('renders as a <header> element', () => {
		const { container } = render(PageTitle, { title: 'Overview' });
		expect(container.querySelector('header.gr-shell-page-title')).toBeTruthy();
	});

	it('does not set inline style attribute', () => {
		const { container } = render(PageTitle, { title: 'Overview' });
		expect(container.querySelector('.gr-shell-page-title')?.hasAttribute('style')).toBe(false);
	});
});
