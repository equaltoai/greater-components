import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Panel from '../src/components/Panel.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('Panel.svelte', () => {
	it('renders as <section> with default classes', () => {
		const { container } = render(Panel, {
			children: snippetOf('<p>body</p>'),
		});
		const section = container.querySelector('section.gr-shell-panel');
		expect(section).toBeTruthy();
		expect(section?.classList.contains('gr-shell-panel--variant-default')).toBe(true);
		expect(section?.classList.contains('gr-shell-panel--padding-md')).toBe(true);
	});

	it('renders the title at the requested heading level and links it via aria-labelledby', () => {
		const { container } = render(Panel, {
			title: 'Fleet status',
			headerLevel: 3,
			children: snippetOf('<p>body</p>'),
		});
		const heading = container.querySelector('h3.gr-shell-panel__title');
		expect(heading).toBeTruthy();
		expect(heading?.textContent).toBe('Fleet status');
		const id = heading?.getAttribute('id');
		const section = container.querySelector('section.gr-shell-panel');
		expect(id).toBeTruthy();
		expect(section?.getAttribute('aria-labelledby')).toBe(id);
	});

	it('honors explicit aria-labelledby override', () => {
		const { container } = render(Panel, {
			'aria-labelledby': 'external-id',
			children: snippetOf('<p>body</p>'),
		});
		const section = container.querySelector('section.gr-shell-panel');
		expect(section?.getAttribute('aria-labelledby')).toBe('external-id');
	});

	it('falls back to aria-label when neither title nor aria-labelledby is set', () => {
		const { container } = render(Panel, {
			'aria-label': 'Settings',
			children: snippetOf('<p>body</p>'),
		});
		const section = container.querySelector('section.gr-shell-panel');
		expect(section?.getAttribute('aria-label')).toBe('Settings');
		expect(section?.hasAttribute('aria-labelledby')).toBe(false);
	});

	it('renders actions group with role=group', () => {
		const { container } = render(Panel, {
			title: 'Settings',
			actions: snippetOf('<button>save</button>'),
			children: snippetOf('<p>body</p>'),
		});
		const actions = container.querySelector('.gr-shell-panel__actions');
		expect(actions?.getAttribute('role')).toBe('group');
	});

	it('renders footer slot', () => {
		const { container } = render(Panel, {
			footer: snippetOf('<small data-test="foot">foot</small>'),
			children: snippetOf('<p>body</p>'),
		});
		expect(container.querySelector('[data-test="foot"]')).toBeTruthy();
		expect(container.querySelector('.gr-shell-panel__footer')).toBeTruthy();
	});

	it('applies variant and padding modifier classes', () => {
		const { container } = render(Panel, {
			variant: 'elevated',
			padding: 'lg',
			children: snippetOf('<p>body</p>'),
		});
		expect(container.querySelector('.gr-shell-panel--variant-elevated')).toBeTruthy();
		expect(container.querySelector('.gr-shell-panel--padding-lg')).toBeTruthy();
	});

	it('does not set inline style attribute', () => {
		const { container } = render(Panel, {
			children: snippetOf('<p>body</p>'),
		});
		expect(container.querySelector('.gr-shell-panel')?.hasAttribute('style')).toBe(false);
	});
});
