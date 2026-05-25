import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Topbar from '../src/components/Topbar.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('Topbar.svelte', () => {
	it('renders a <header> element', () => {
		const { container } = render(Topbar, {
			children: snippetOf('<strong>brand</strong>'),
		});
		expect(container.querySelector('header.gr-shell-topbar')).toBeTruthy();
	});

	it('renders start/center/end regions when those snippets are provided', () => {
		const { container } = render(Topbar, {
			start: snippetOf('<span data-test="start">start</span>'),
			center: snippetOf('<span data-test="center">center</span>'),
			end: snippetOf('<span data-test="end">end</span>'),
		});
		expect(container.querySelector('[data-test="start"]')).toBeTruthy();
		expect(container.querySelector('[data-test="center"]')).toBeTruthy();
		expect(container.querySelector('[data-test="end"]')).toBeTruthy();
		expect(container.querySelector('.gr-shell-topbar__region--start')).toBeTruthy();
		expect(container.querySelector('.gr-shell-topbar__region--center')).toBeTruthy();
		expect(container.querySelector('.gr-shell-topbar__region--end')).toBeTruthy();
	});

	it('falls back to children when no region snippets are provided', () => {
		const { container } = render(Topbar, {
			children: snippetOf('<span data-test="plain">plain</span>'),
		});
		expect(container.querySelector('[data-test="plain"]')).toBeTruthy();
		expect(container.querySelector('.gr-shell-topbar__region--full')).toBeTruthy();
	});

	it('applies variant modifier class', () => {
		const { container } = render(Topbar, {
			variant: 'elevated',
			children: snippetOf('x'),
		});
		expect(container.querySelector('.gr-shell-topbar--variant-elevated')).toBeTruthy();
	});

	it('applies sticky modifier when sticky=true', () => {
		const { container } = render(Topbar, {
			sticky: true,
			children: snippetOf('x'),
		});
		expect(container.querySelector('.gr-shell-topbar--sticky')).toBeTruthy();
	});

	it('does not set inline style attribute', () => {
		const { container } = render(Topbar, {
			children: snippetOf('x'),
		});
		expect(container.querySelector('.gr-shell-topbar')?.hasAttribute('style')).toBe(false);
	});
});
