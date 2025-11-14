import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Checkbox from '../src/components/Checkbox.svelte';

describe('Checkbox.svelte', () => {
	it('toggles checked state and calls onchange', async () => {
		const handleChange = vi.fn();
		const { container } = render(Checkbox, { props: { onchange: handleChange } });
		const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

		expect(checkbox.checked).toBe(false);
		await fireEvent.click(checkbox);
		expect(handleChange).toHaveBeenCalledWith(true);
		expect(checkbox.checked).toBe(true);
	});

	it('honors indeterminate prop', () => {
		const { container } = render(Checkbox, { props: { indeterminate: true } });
		const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

		expect(checkbox.indeterminate).toBe(true);
	});
});
