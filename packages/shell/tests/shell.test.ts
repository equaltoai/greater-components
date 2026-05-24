import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Shell from '../src/components/Shell.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('Shell.svelte', () => {
	it('renders root with gr-shell class and a single <main> landmark', () => {
		const { container } = render(Shell, {
			children: snippetOf('<p>content</p>'),
		});
		expect(container.querySelector('.gr-shell')).toBeTruthy();
		const mains = container.querySelectorAll('main');
		expect(mains.length).toBe(1);
		expect(mains[0]?.classList.contains('gr-shell__main')).toBe(true);
	});

	it('applies the main accessible name when mainLabel is provided', () => {
		const { container } = render(Shell, {
			mainLabel: 'Dashboard',
			children: snippetOf('<p>content</p>'),
		});
		const main = container.querySelector('main');
		expect(main?.getAttribute('aria-label')).toBe('Dashboard');
	});

	it('does not set aria-label on main when mainLabel is omitted', () => {
		const { container } = render(Shell, {
			children: snippetOf('<p>content</p>'),
		});
		const main = container.querySelector('main');
		expect(main?.hasAttribute('aria-label')).toBe(false);
	});

	it('renders the topbar slot when provided', () => {
		const { container } = render(Shell, {
			topbar: snippetOf('<header data-test="topbar">topbar</header>'),
			children: snippetOf('<p>content</p>'),
		});
		expect(container.querySelector('.gr-shell__topbar')).toBeTruthy();
		expect(container.querySelector('[data-test="topbar"]')).toBeTruthy();
		expect(container.querySelector('.gr-shell')?.classList.contains('gr-shell--has-topbar')).toBe(
			true
		);
	});

	it('renders the sidebar slot when provided', () => {
		const { container } = render(Shell, {
			sidebar: snippetOf('<nav data-test="sidebar" aria-label="Primary">links</nav>'),
			children: snippetOf('<p>content</p>'),
		});
		expect(container.querySelector('.gr-shell__sidebar')).toBeTruthy();
		expect(container.querySelector('[data-test="sidebar"]')).toBeTruthy();
		expect(container.querySelector('.gr-shell')?.classList.contains('gr-shell--has-sidebar')).toBe(
			true
		);
	});

	it('omits the sidebar wrapper when showSidebar=false', () => {
		const { container } = render(Shell, {
			showSidebar: false,
			sidebar: snippetOf('<nav data-test="sidebar" aria-label="Primary">links</nav>'),
			children: snippetOf('<p>content</p>'),
		});
		expect(container.querySelector('.gr-shell__sidebar')).toBeNull();
		expect(container.querySelector('.gr-shell')?.classList.contains('gr-shell--has-sidebar')).toBe(
			false
		);
	});

	it('applies sidebarPlacement modifier', () => {
		const { container } = render(Shell, {
			sidebarPlacement: 'right',
			sidebar: snippetOf('<nav aria-label="Primary"></nav>'),
			children: snippetOf('<p>content</p>'),
		});
		expect(container.querySelector('.gr-shell--sidebar-right')).toBeTruthy();
	});

	it('applies width modifier', () => {
		const { container } = render(Shell, {
			sidebarWidth: 'lg',
			sidebar: snippetOf('<nav aria-label="Primary"></nav>'),
			children: snippetOf('<p>content</p>'),
		});
		expect(container.querySelector('.gr-shell--sidebar-width-lg')).toBeTruthy();
	});

	it('forwards custom class names', () => {
		const { container } = render(Shell, {
			class: 'app-shell',
			children: snippetOf('<p>content</p>'),
		});
		expect(container.querySelector('.gr-shell.app-shell')).toBeTruthy();
	});

	it('does not emit inline style attribute on root', () => {
		const { container } = render(Shell, {
			class: 'app-shell',
			children: snippetOf('<p>content</p>'),
		});
		const root = container.querySelector('.gr-shell');
		expect(root?.hasAttribute('style')).toBe(false);
	});
});
