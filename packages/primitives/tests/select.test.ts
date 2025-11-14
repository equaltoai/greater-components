import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Select from '../src/components/Select.svelte';

const options = [
	{ value: 'alpha', label: 'Alpha' },
	{ value: 'beta', label: 'Beta' },
	{ value: 'gamma', label: 'Gamma', disabled: true },
];

describe('Select.svelte', () => {
	it('calls onchange when selection changes', async () => {
		const handleChange = vi.fn();
		const { getByRole } = render(Select, {
			props: { options, onchange: handleChange },
		});

		const select = getByRole('combobox') as HTMLSelectElement;
		await fireEvent.change(select, { target: { value: 'beta' } });

		expect(handleChange).toHaveBeenCalledWith('beta');
		expect(select.value).toBe('beta');
	});

	it('renders placeholder option when provided', () => {
		const { getByText } = render(Select, {
			props: { options, placeholder: 'Choose one' },
		});

		const placeholder = getByText('Choose one') as HTMLOptionElement;
		expect(placeholder.disabled).toBe(true);
		expect(placeholder.selected).toBe(true);
	});
});
