import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Callout from '../src/components/Callout.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('Callout.svelte', () => {
	it('renders with role=status and aria-live=polite for non-danger tones', () => {
		const { container } = render(Callout, {
			tone: 'info',
			children: snippetOf('<p>info</p>'),
		});
		const root = container.querySelector('.gr-shell-callout');
		expect(root?.getAttribute('role')).toBe('status');
		expect(root?.getAttribute('aria-live')).toBe('polite');
		expect(root?.getAttribute('aria-atomic')).toBe('true');
	});

	it('renders with role=alert and aria-live=assertive for danger tone', () => {
		const { container } = render(Callout, {
			tone: 'danger',
			children: snippetOf('<p>danger</p>'),
		});
		const root = container.querySelector('.gr-shell-callout');
		expect(root?.getAttribute('role')).toBe('alert');
		expect(root?.getAttribute('aria-live')).toBe('assertive');
	});

	it('renders with role=alert and aria-live=assertive for warning tone', () => {
		const { container } = render(Callout, {
			tone: 'warning',
			children: snippetOf('<p>warning</p>'),
		});
		const root = container.querySelector('.gr-shell-callout');
		expect(root?.getAttribute('role')).toBe('alert');
	});

	it('honors explicit role override', () => {
		const { container } = render(Callout, {
			tone: 'info',
			role: 'note',
			children: snippetOf('<p>info</p>'),
		});
		const root = container.querySelector('.gr-shell-callout');
		expect(root?.getAttribute('role')).toBe('note');
		// role=note is non-live -> no aria-live
		expect(root?.getAttribute('aria-live')).toBeNull();
	});

	it('renders the title and tone modifier class', () => {
		const { container, getByText } = render(Callout, {
			tone: 'success',
			title: 'All clear',
			children: snippetOf('<p>good</p>'),
		});
		expect(getByText('All clear')).toBeTruthy();
		expect(container.querySelector('.gr-shell-callout--tone-success')).toBeTruthy();
	});

	it('renders dismiss button with accessible label and fires ondismiss', async () => {
		const ondismiss = vi.fn();
		const { container } = render(Callout, {
			tone: 'info',
			dismissible: true,
			dismissLabel: 'Close notification',
			ondismiss,
			children: snippetOf('<p>info</p>'),
		});
		const button = container.querySelector('button.gr-shell-callout__dismiss');
		expect(button).toBeTruthy();
		expect(button?.getAttribute('aria-label')).toBe('Close notification');
		expect(button?.getAttribute('type')).toBe('button');
		await fireEvent.click(button!);
		expect(ondismiss).toHaveBeenCalledTimes(1);
	});

	it('does not render dismiss button when dismissible=false', () => {
		const { container } = render(Callout, {
			tone: 'info',
			children: snippetOf('<p>info</p>'),
		});
		expect(container.querySelector('.gr-shell-callout__dismiss')).toBeNull();
	});

	it('renders icon with aria-hidden=true', () => {
		const { container } = render(Callout, {
			tone: 'info',
			icon: snippetOf('<svg data-test="icon"></svg>'),
			children: snippetOf('<p>info</p>'),
		});
		const iconWrap = container.querySelector('.gr-shell-callout__icon');
		expect(iconWrap?.getAttribute('aria-hidden')).toBe('true');
	});

	it('renders actions group with role=group', () => {
		const { container } = render(Callout, {
			tone: 'info',
			actions: snippetOf('<button>retry</button>'),
			children: snippetOf('<p>info</p>'),
		});
		const actions = container.querySelector('.gr-shell-callout__actions');
		expect(actions?.getAttribute('role')).toBe('group');
	});

	it('does not set inline style attribute', () => {
		const { container } = render(Callout, {
			tone: 'info',
			children: snippetOf('<p>info</p>'),
		});
		expect(container.querySelector('.gr-shell-callout')?.hasAttribute('style')).toBe(false);
	});
});
