import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TextField from '../src/components/TextField.svelte';
import TextFieldWrapper from './fixtures/TextFieldWrapper.svelte';

describe('TextField.svelte', () => {
	it('renders with default props', () => {
		const { getByRole } = render(TextField);
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.disabled).toBe(false);
		expect(input.getAttribute('readonly')).toBeNull();
		expect(input.getAttribute('type')).toBe('text');
	});

	it('renders label when provided', () => {
		const { getByText, getByRole } = render(TextField, {
			props: { label: 'Username', id: 'test-user' },
		});
		const label = getByText('Username');
		const input = getByRole('textbox');
		expect(label).toBeTruthy();
		expect(label.getAttribute('for')).toBe('test-user');
		expect(input.getAttribute('id')).toBe('test-user');
	});

	it('shows required indicator', () => {
		const { getByText } = render(TextField, {
			props: { label: 'Username', required: true },
		});
		expect(getByText('*')).toBeTruthy();
	});

	it('renders help text and links via aria-describedby', () => {
		const { getByText, getByRole } = render(TextField, {
			props: { helpText: 'Enter unique username', id: 'test-user' },
		});
		const help = getByText('Enter unique username');
		const input = getByRole('textbox');

		expect(help).toBeTruthy();
		expect(help.id).toBe('test-user-help');
		expect(input.getAttribute('aria-describedby')).toBe('test-user-help');
	});

	it('renders error message and invalid state', () => {
		const { getByText, getByRole } = render(TextField, {
			props: {
				errorMessage: 'Username taken',
				invalid: true,
				id: 'test-user',
				helpText: 'Help',
			},
		});
		const error = getByText('Username taken');
		const input = getByRole('textbox');

		expect(error).toBeTruthy();
		expect(error.id).toBe('test-user-error');

		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toContain('test-user-help');
		expect(describedBy).toContain('test-user-error');
		expect(input.getAttribute('aria-invalid')).toBe('true');
	});

	it('handles disabled state', () => {
		const { getByRole, container } = render(TextField, {
			props: { disabled: true },
		});
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input.disabled).toBe(true);
		expect(container.querySelector('.gr-textfield--disabled')).toBeTruthy();
	});

	it('handles readonly state', () => {
		const { getByRole, container } = render(TextField, {
			props: { readonly: true },
		});
		const input = getByRole('textbox');
		expect(input.hasAttribute('readonly')).toBe(true);
		expect(container.querySelector('.gr-textfield--readonly')).toBeTruthy();
	});

	it('handles input and keydown events', async () => {
		const handleInput = vi.fn();
		const handleKeydown = vi.fn();
		const { getByRole } = render(TextField, {
			props: { oninput: handleInput, onkeydown: handleKeydown },
		});

		const input = getByRole('textbox');
		await fireEvent.input(input, { target: { value: 'test' } });
		expect(handleInput).toHaveBeenCalled();

		await fireEvent.keyDown(input, { key: 'Enter' });
		expect(handleKeydown).toHaveBeenCalled();
	});

	it('toggles focused state on focus/blur', async () => {
		const onFocus = vi.fn();
		const onBlur = vi.fn();
		const { getByRole, container } = render(TextField, {
			props: { onfocus: onFocus, onblur: onBlur },
		});

		const input = getByRole('textbox');

		await fireEvent.focus(input);
		expect(onFocus).toHaveBeenCalled();
		expect(container.querySelector('.gr-textfield--focused')).toBeTruthy();

		await fireEvent.blur(input);
		expect(onBlur).toHaveBeenCalled();
		expect(container.querySelector('.gr-textfield--focused')).toBeFalsy();
	});

	it('renders prefix and suffix', () => {
		const { getByText } = render(TextFieldWrapper, {
			props: { prefixContent: 'PRE', suffixContent: 'SUF' },
		});

		expect(getByText('PRE')).toBeTruthy();
		expect(getByText('SUF')).toBeTruthy();
	});

	it('adds has-value class when value is present', async () => {
		const { container } = render(TextField, {
			props: { value: 'Initial' },
		});
		expect(container.querySelector('.gr-textfield--has-value')).toBeTruthy();
	});
});
