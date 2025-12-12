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

	it('renders disabled state', () => {
		const { getByRole } = render(Select, {
			props: { options, disabled: true },
		});

		const select = getByRole('combobox') as HTMLSelectElement;
		expect(select.disabled).toBe(true);
	});

	it('renders required attribute', () => {
		const { getByRole } = render(Select, {
			props: { options, required: true },
		});

		const select = getByRole('combobox') as HTMLSelectElement;
		expect(select.required).toBe(true);
	});

	it('renders custom class', () => {
		const { getByRole } = render(Select, {
			props: { options, class: 'custom-class' },
		});

		const select = getByRole('combobox');
		expect(select.classList.contains('custom-class')).toBe(true);
	});

	it('handles change without onchange handler', async () => {
		const { getByRole } = render(Select, {
			props: { options },
		});

		const select = getByRole('combobox') as HTMLSelectElement;
		await fireEvent.change(select, { target: { value: 'beta' } });
		expect(select.value).toBe('beta');
	});
});