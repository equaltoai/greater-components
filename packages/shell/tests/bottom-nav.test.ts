import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import BottomNav from '../src/components/BottomNav.svelte';

const navigationItems = createRawSnippet(() => ({
	render: () => '<a href="/home" aria-current="page">Home</a><a href="/messages">Messages</a>',
}));

describe('BottomNav.svelte', () => {
	it('renders a named navigation landmark and preserves current-page semantics', () => {
		const { container } = render(BottomNav, {
			label: 'Primary mobile navigation',
			children: navigationItems,
		});
		const nav = container.querySelector('nav.gr-shell-bottom-nav');
		expect(nav?.getAttribute('aria-label')).toBe('Primary mobile navigation');
		expect(nav?.querySelector('[aria-current="page"]')?.textContent).toBe('Home');
	});

	it('is fixed by default and can participate in document flow', () => {
		const fixed = render(BottomNav, { label: 'Mobile', children: navigationItems });
		expect(fixed.container.querySelector('.gr-shell-bottom-nav--fixed')).toBeTruthy();
		fixed.unmount();
		const inline = render(BottomNav, {
			label: 'Mobile',
			fixed: false,
			children: navigationItems,
		});
		expect(inline.container.querySelector('.gr-shell-bottom-nav--fixed')).toBeNull();
	});

	it('does not emit an inline style under strict CSP', () => {
		const { container } = render(BottomNav, { label: 'Mobile', children: navigationItems });
		expect(container.querySelector('nav')?.hasAttribute('style')).toBe(false);
	});
});
