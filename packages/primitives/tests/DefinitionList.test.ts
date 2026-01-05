import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import DefinitionListHarness from './harness/DefinitionListHarness.svelte';

describe('DefinitionList', () => {
	it('renders semantic dl/dt/dd markup', () => {
		const { container, getByText } = render(DefinitionListHarness);

		expect(container.querySelector('dl')).toBeTruthy();
		expect(container.querySelectorAll('dt').length).toBeGreaterThan(0);
		expect(container.querySelectorAll('dd').length).toBeGreaterThan(0);

		expect(getByText('API URL')).toBeTruthy();
		expect(getByText('https://api.example.com')).toBeTruthy();
	});

	it('applies density and divider classes', () => {
		const { container } = render(DefinitionListHarness, {
			props: { listProps: { density: 'sm', dividers: false } },
		});

		const dl = container.querySelector('dl');
		expect(dl?.classList.contains('gr-definition-list')).toBe(true);
		expect(dl?.classList.contains('gr-definition-list--density-sm')).toBe(true);
		expect(dl?.classList.contains('gr-definition-list--dividers')).toBe(false);
	});

	it('renders optional actions content and keeps it focusable', () => {
		const { getByTestId, queryByTestId } = render(DefinitionListHarness);

		const action0 = getByTestId('action-0') as HTMLButtonElement;
		expect(action0).toBeTruthy();
		action0.focus();
		expect(document.activeElement).toBe(action0);

		// Second row has no actions in the default harness setup.
		expect(queryByTestId('action-1')).toBeNull();
	});

	it('applies monospace and nowrap classes to the value region', () => {
		const { container } = render(DefinitionListHarness, {
			props: {
				items: [{ label: 'ID', value: 'abcdefghijklmnopqrstuvwxyz', monospace: true, wrap: false }],
			},
		});

		const value = container.querySelector('.gr-definition-item__value');
		expect(value?.classList.contains('gr-definition-item__value--monospace')).toBe(true);
		expect(value?.classList.contains('gr-definition-item__value--nowrap')).toBe(true);
	});
});
