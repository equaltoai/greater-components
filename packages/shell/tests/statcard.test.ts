import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import StatCard from '../src/components/StatCard.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('StatCard.svelte', () => {
	it('renders label and value', () => {
		const { getByText } = render(StatCard, {
			label: 'Active instances',
			value: 42,
		});
		expect(getByText('Active instances')).toBeTruthy();
		expect(getByText('42')).toBeTruthy();
	});

	it('renders with role="group" and aria-labelledby pointing at label + value', () => {
		const { container } = render(StatCard, {
			label: 'Active instances',
			value: 42,
		});
		const root = container.querySelector('.gr-shell-statcard');
		expect(root?.getAttribute('role')).toBe('group');
		const labelledby = root?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		const ids = labelledby!.split(/\s+/);
		// At least two IDs (label + value).
		expect(ids.length).toBeGreaterThanOrEqual(2);
		for (const id of ids) {
			expect(container.ownerDocument.getElementById(id)).toBeTruthy();
		}
	});

	it('respects explicit aria-label override', () => {
		const { container } = render(StatCard, {
			label: 'Active instances',
			value: 42,
			'aria-label': '42 active instances',
		});
		const root = container.querySelector('.gr-shell-statcard');
		expect(root?.getAttribute('aria-label')).toBe('42 active instances');
		expect(root?.hasAttribute('aria-labelledby')).toBe(false);
	});

	it('renders trend with direction modifier and label', () => {
		const { container, getByText } = render(StatCard, {
			label: 'Active instances',
			value: 42,
			trend: { direction: 'up', label: '+8 this week' },
		});
		expect(container.querySelector('.gr-shell-statcard__trend--up')).toBeTruthy();
		expect(getByText('+8 this week')).toBeTruthy();
	});

	it('applies status modifier class', () => {
		const { container } = render(StatCard, {
			label: 'Active instances',
			value: 42,
			status: 'success',
		});
		expect(container.querySelector('.gr-shell-statcard--status-success')).toBeTruthy();
	});

	it('renders description with id referenced by aria-labelledby', () => {
		const { container } = render(StatCard, {
			label: 'Active instances',
			value: 42,
			description: 'Live for the last 30 days.',
		});
		const root = container.querySelector('.gr-shell-statcard');
		const descriptionEl = container.querySelector('.gr-shell-statcard__description');
		expect(descriptionEl).toBeTruthy();
		const descriptionId = descriptionEl?.getAttribute('id');
		expect(descriptionId).toBeTruthy();
		expect(root?.getAttribute('aria-labelledby')).toContain(descriptionId!);
	});

	it('renders icon snippet inside an aria-hidden wrapper', () => {
		const { container } = render(StatCard, {
			label: 'Active instances',
			value: 42,
			icon: snippetOf('<svg data-test="icon"></svg>'),
		});
		const iconWrap = container.querySelector('.gr-shell-statcard__icon');
		expect(iconWrap).toBeTruthy();
		expect(iconWrap?.getAttribute('aria-hidden')).toBe('true');
		expect(container.querySelector('[data-test="icon"]')).toBeTruthy();
	});

	it('does not set inline style attribute', () => {
		const { container } = render(StatCard, {
			label: 'Active instances',
			value: 42,
		});
		expect(container.querySelector('.gr-shell-statcard')?.hasAttribute('style')).toBe(false);
	});
});
