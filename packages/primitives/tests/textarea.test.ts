import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TextArea from '../src/components/TextArea.svelte';

describe('TextArea.svelte', () => {
	it('renders with default props', () => {
		const { getByRole } = render(TextArea);
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea).toBeTruthy();
		expect(textarea.disabled).toBe(false);
		expect(textarea.getAttribute('readonly')).toBeNull();
	});

	it('renders label when provided', () => {
		const { getByText, getByRole } = render(TextArea, {
			props: { label: 'Description', id: 'test-id' },
		});
		const label = getByText('Description');
		const textarea = getByRole('textbox');
		expect(label).toBeTruthy();
		expect(label.getAttribute('for')).toBe('test-id');
		expect(textarea.getAttribute('id')).toBe('test-id');
	});

	it('shows required indicator', () => {
		const { getByText } = render(TextArea, {
			props: { label: 'Description', required: true },
		});
		expect(getByText('*')).toBeTruthy();
	});

	it('renders help text and links via aria-describedby', () => {
		const { getByText, getByRole } = render(TextArea, {
			props: { helpText: 'Please enter details', id: 'test-id' },
		});
		const help = getByText('Please enter details');
		const textarea = getByRole('textbox');

		expect(help).toBeTruthy();
		expect(help.id).toBe('test-id-help');
		expect(textarea.getAttribute('aria-describedby')).toBe('test-id-help');
	});

	it('renders error message and links via aria-describedby when invalid', () => {
		const { getByText, getByRole } = render(TextArea, {
			props: {
				errorMessage: 'Invalid input',
				invalid: true,
				id: 'test-id',
				helpText: 'Help',
			},
		});
		const error = getByText('Invalid input');
		const textarea = getByRole('textbox');

		expect(error).toBeTruthy();
		expect(error.id).toBe('test-id-error');
		expect(textarea.getAttribute('aria-describedby')).toBe('test-id-error');
		expect(textarea.getAttribute('aria-invalid')).toBe('true');
	});

	it('handles disabled state', () => {
		const { getByRole } = render(TextArea, {
			props: { disabled: true },
		});
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea.disabled).toBe(true);
	});

	it('handles readonly state', () => {
		const { getByRole } = render(TextArea, {
			props: { readonly: true },
		});
		const textarea = getByRole('textbox');
		expect(textarea.hasAttribute('readonly')).toBe(true);
	});

	it('updates value via input and change handlers', async () => {
		const handleInput = vi.fn();
		const handleChange = vi.fn();
		const { getByRole } = render(TextArea, {
			props: { oninput: handleInput, onchange: handleChange, placeholder: 'Message' },
		});

		const textarea = getByRole('textbox') as HTMLTextAreaElement;

		await fireEvent.input(textarea, { target: { value: 'Hello' } });
		expect(handleInput).toHaveBeenCalledWith('Hello');
		expect(textarea.value).toBe('Hello');

		await fireEvent.change(textarea, { target: { value: 'Hello' } });
		expect(handleChange).toHaveBeenCalledWith('Hello');
	});

	it('generates random ID if not provided', () => {
		const { getByRole } = render(TextArea);
		const textarea = getByRole('textbox');
		expect(textarea.id).toMatch(/^gr-textarea-/);
	});

	it('applies custom classes', () => {
		const { container } = render(TextArea, {
			props: { textareaClass: 'custom-area', class: 'custom-wrapper' },
		});
		expect(container.querySelector('.custom-wrapper')).toBeTruthy();
		expect(container.querySelector('.custom-area')).toBeTruthy();
	});
});
