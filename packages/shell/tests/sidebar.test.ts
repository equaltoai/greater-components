import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Sidebar from '../src/components/Sidebar.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('Sidebar.svelte', () => {
	it('renders a <nav> landmark with the required label', () => {
		const { container } = render(Sidebar, {
			label: 'Primary navigation',
			children: snippetOf('<a href="/">Home</a>'),
		});
		const nav = container.querySelector('nav.gr-shell-sidebar');
		expect(nav).toBeTruthy();
		expect(nav?.getAttribute('aria-label')).toBe('Primary navigation');
	});

	it('exposes the children body with sidebar links', () => {
		const { container } = render(Sidebar, {
			label: 'Primary',
			children: snippetOf('<div><a href="/x">X</a><a href="/y">Y</a></div>'),
		});
		expect(container.querySelectorAll('.gr-shell-sidebar__body a').length).toBe(2);
	});

	it('respects the aria-current="page" indicator on child links', () => {
		const { container } = render(Sidebar, {
			label: 'Primary',
			children: snippetOf('<div><a href="/x" aria-current="page">X</a><a href="/y">Y</a></div>'),
		});
		const current = container.querySelector('a[aria-current="page"]');
		expect(current).toBeTruthy();
		expect(current?.getAttribute('href')).toBe('/x');
	});

	it('renders header and footer slots when provided', () => {
		const { container } = render(Sidebar, {
			label: 'Primary',
			header: snippetOf('<div data-test="brand">Brand</div>'),
			footer: snippetOf('<div data-test="user">User</div>'),
			children: snippetOf('<a href="/">Home</a>'),
		});
		expect(container.querySelector('[data-test="brand"]')).toBeTruthy();
		expect(container.querySelector('[data-test="user"]')).toBeTruthy();
		expect(container.querySelector('.gr-shell-sidebar__header')).toBeTruthy();
		expect(container.querySelector('.gr-shell-sidebar__footer')).toBeTruthy();
	});

	it('applies the variant modifier class', () => {
		const { container } = render(Sidebar, {
			label: 'Primary',
			variant: 'compact',
			children: snippetOf('<a href="/">Home</a>'),
		});
		expect(container.querySelector('.gr-shell-sidebar--variant-compact')).toBeTruthy();
	});

	it('applies the width modifier class', () => {
		const { container } = render(Sidebar, {
			label: 'Primary',
			width: 'lg',
			children: snippetOf('<a href="/">Home</a>'),
		});
		expect(container.querySelector('.gr-shell-sidebar--width-lg')).toBeTruthy();
	});

	it('does not set inline style on root', () => {
		const { container } = render(Sidebar, {
			label: 'Primary',
			children: snippetOf('<a href="/">Home</a>'),
		});
		const root = container.querySelector('.gr-shell-sidebar');
		expect(root?.hasAttribute('style')).toBe(false);
	});
});
