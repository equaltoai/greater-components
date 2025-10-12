/**
 * TextField Primitive Tests
 * 
 * Comprehensive test suite for the TextField headless primitive.
 * Tests validation, state management, user interactions, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTextField } from '../src/primitives/textfield';

describe('TextField Primitive', () => {
	describe('Initialization', () => {
		it('should create with default config', () => {
			const field = createTextField();

			expect(field.state.value).toBe('');
			expect(field.state.focused).toBe(false);
			expect(field.state.touched).toBe(false);
			expect(field.state.valid).toBe(true);
			expect(field.state.error).toBe(null);
			expect(field.state.length).toBe(0);
			expect(field.state.exceededLength).toBe(false);
			expect(field.state.disabled).toBe(false);
			expect(field.state.required).toBe(false);
			expect(field.state.readonly).toBe(false);
		});

		it('should initialize with provided value', () => {
			const field = createTextField({ value: 'initial value' });

			expect(field.state.value).toBe('initial value');
			expect(field.state.length).toBe(13);
		});

		it('should initialize with config options', () => {
			const field = createTextField({
				value: 'test',
				disabled: true,
				required: true,
				readonly: true,
				maxLength: 100,
			});

			expect(field.state.disabled).toBe(true);
			expect(field.state.required).toBe(true);
			expect(field.state.readonly).toBe(true);
		});
	});

	describe('Validation', () => {
		it('should validate required field', () => {
			const field = createTextField({ required: true });

			field.helpers.markTouched();
			const isValid = field.helpers.validate();

			expect(isValid).toBe(false);
			expect(field.state.error).toBe('This field is required');
			expect(field.state.valid).toBe(false);
		});

		it('should pass validation when required field has value', () => {
			const field = createTextField({ required: true, value: 'test' });

			field.helpers.markTouched();
			const isValid = field.helpers.validate();

			expect(isValid).toBe(true);
			expect(field.state.error).toBe(null);
			expect(field.state.valid).toBe(true);
		});

		it('should validate min length', () => {
			const field = createTextField({ minLength: 5, value: 'abc' });

			field.helpers.markTouched();
			const isValid = field.helpers.validate();

			expect(isValid).toBe(false);
			expect(field.state.error).toBe('Minimum 5 characters required');
		});

		it('should validate max length', () => {
			const field = createTextField({ maxLength: 5, value: 'abcdef' });

			field.helpers.markTouched();
			const isValid = field.helpers.validate();

			expect(isValid).toBe(false);
			expect(field.state.error).toBe('Maximum 5 characters allowed');
		});

		it('should validate pattern', () => {
			const field = createTextField({
				pattern: '^[0-9]+$',
				value: 'abc123',
			});

			field.helpers.markTouched();
			const isValid = field.helpers.validate();

			expect(isValid).toBe(false);
			expect(field.state.error).toBe('Invalid format');
		});

		it('should use custom validation function', () => {
			const field = createTextField({
				value: 'test',
				validate: (value) => (value.includes('@') ? null : 'Must include @'),
			});

			field.helpers.markTouched();
			const isValid = field.helpers.validate();

			expect(isValid).toBe(false);
			expect(field.state.error).toBe('Must include @');
		});

		it('should pass custom validation', () => {
			const field = createTextField({
				value: 'test@example.com',
				validate: (value) => (value.includes('@') ? null : 'Must include @'),
			});

			field.helpers.markTouched();
			const isValid = field.helpers.validate();

			expect(isValid).toBe(true);
			expect(field.state.error).toBe(null);
		});
	});

	describe('State Management', () => {
		it('should update value through helper', () => {
			const field = createTextField();

			field.helpers.setValue('new value');

			expect(field.state.value).toBe('new value');
			expect(field.state.length).toBe(9);
		});

		it('should clear value', () => {
			const field = createTextField({ value: 'test' });

			field.helpers.clear();

			expect(field.state.value).toBe('');
			expect(field.state.length).toBe(0);
		});

		it('should track character length', () => {
			const field = createTextField({ maxLength: 10 });

			field.helpers.setValue('12345');
			expect(field.state.length).toBe(5);
			expect(field.state.exceededLength).toBe(false);

			field.helpers.setValue('12345678901');
			expect(field.state.length).toBe(11);
			expect(field.state.exceededLength).toBe(true);
		});

		it('should mark as touched', () => {
			const field = createTextField();

			expect(field.state.touched).toBe(false);

			field.helpers.markTouched();

			expect(field.state.touched).toBe(true);
		});

		it('should validate on touch when value changes', () => {
			const field = createTextField({ required: true });

			field.helpers.markTouched();
			field.helpers.setValue('');

			expect(field.state.error).toBe('This field is required');
		});
	});

	describe('DOM Integration', () => {
		let input: HTMLInputElement;

		beforeEach(() => {
			input = document.createElement('input');
			document.body.appendChild(input);
		});

		afterEach(() => {
			document.body.removeChild(input);
		});

		it('should attach to DOM element', () => {
			const field = createTextField({ value: 'test', placeholder: 'Enter text' });
			const action = field.actions.field(input);

			expect(input.value).toBe('test');
			expect(input.placeholder).toBe('Enter text');

			action.destroy();
		});

		it('should set attributes', () => {
			const field = createTextField({
				disabled: true,
				required: true,
				maxLength: 100,
				label: 'Test input',
			});
			const action = field.actions.field(input);

			expect(input.disabled).toBe(true);
			expect(input.required).toBe(true);
			expect(input.maxLength).toBe(100);
			expect(input.getAttribute('aria-label')).toBe('Test input');

			action.destroy();
		});

		it('should handle input events', () => {
			const onChange = vi.fn();
			const field = createTextField({ onChange });
			const action = field.actions.field(input);

			input.value = 'new value';
			input.dispatchEvent(new Event('input'));

			expect(field.state.value).toBe('new value');
			expect(onChange).toHaveBeenCalledWith('new value');

			action.destroy();
		});

		it('should handle focus events', () => {
			const onFocus = vi.fn();
			const field = createTextField({ onFocus });
			const action = field.actions.field(input);

			expect(field.state.focused).toBe(false);

			input.dispatchEvent(new Event('focus'));

			expect(field.state.focused).toBe(true);
			expect(onFocus).toHaveBeenCalled();

			action.destroy();
		});

		it('should handle blur events', () => {
			const onBlur = vi.fn();
			const field = createTextField({ onBlur });
			const action = field.actions.field(input);

			input.dispatchEvent(new Event('focus'));
			input.dispatchEvent(new Event('blur'));

			expect(field.state.focused).toBe(false);
			expect(field.state.touched).toBe(true);
			expect(onBlur).toHaveBeenCalled();

			action.destroy();
		});

		it('should validate on blur', () => {
			const field = createTextField({ required: true });
			const action = field.actions.field(input);

			input.value = '';
			input.dispatchEvent(new Event('input'));
			input.dispatchEvent(new Event('blur'));

			expect(field.state.error).toBe('This field is required');
			expect(field.state.valid).toBe(false);

			action.destroy();
		});

		it('should handle Enter key for submit', () => {
			const onSubmit = vi.fn();
			const field = createTextField({ value: 'test', onSubmit });
			const action = field.actions.field(input);

			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
			input.dispatchEvent(event);

			expect(onSubmit).toHaveBeenCalledWith('test');

			action.destroy();
		});

		it('should not submit on Enter for multiline', () => {
			const textarea = document.createElement('textarea');
			document.body.appendChild(textarea);

			const onSubmit = vi.fn();
			const field = createTextField({ multiline: true, onSubmit });
			const action = field.actions.field(textarea);

			textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(onSubmit).not.toHaveBeenCalled();

			action.destroy();
			document.body.removeChild(textarea);
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const field = createTextField({ onDestroy });
			const input = document.createElement('input');

			const action = field.actions.field(input);
			action.destroy();

			expect(onDestroy).toHaveBeenCalled();
		});

		it('should update DOM value when setValue is called', () => {
			const field = createTextField();
			const input = document.createElement('input');
			const action = field.actions.field(input);

			field.helpers.setValue('updated');

			expect(input.value).toBe('updated');

			action.destroy();
		});
	});

	describe('Accessibility', () => {
		let input: HTMLInputElement;

		beforeEach(() => {
			input = document.createElement('input');
			document.body.appendChild(input);
		});

		afterEach(() => {
			document.body.removeChild(input);
		});

		it('should set ARIA label', () => {
			const field = createTextField({ label: 'Username' });
			const action = field.actions.field(input);

			expect(input.getAttribute('aria-label')).toBe('Username');

			action.destroy();
		});

		it('should set ARIA describedby', () => {
			const field = createTextField({ describedBy: 'error-message' });
			const action = field.actions.field(input);

			expect(input.getAttribute('aria-describedby')).toBe('error-message');

			action.destroy();
		});

		it('should support autocomplete', () => {
			const field = createTextField({ autocomplete: 'email' });
			const action = field.actions.field(input);

			expect(input.autocomplete).toBe('email');

			action.destroy();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty string validation', () => {
			const field = createTextField({ minLength: 5 });

			field.helpers.setValue('');
			field.helpers.markTouched();
			field.helpers.validate();

			// Empty string should not trigger minLength validation
			expect(field.state.error).toBe(null);
		});

		it('should handle whitespace for required fields', () => {
			const field = createTextField({ required: true });

			field.helpers.setValue('   ');
			field.helpers.markTouched();
			field.helpers.validate();

			expect(field.state.error).toBe('This field is required');
		});

		it('should handle multiple validations', () => {
			const field = createTextField({
				required: true,
				minLength: 3,
				maxLength: 10,
				pattern: '^[a-z]+$',
			});

			// Test required
			field.helpers.setValue('');
			field.helpers.markTouched();
			let isValid = field.helpers.validate();
			expect(isValid).toBe(false);
			expect(field.state.error).toBe('This field is required');

			// Test minLength
			field.helpers.setValue('ab');
			isValid = field.helpers.validate();
			expect(isValid).toBe(false);
			expect(field.state.error).toBe('Minimum 3 characters required');

			// Test maxLength
			field.helpers.setValue('abcdefghijk');
			isValid = field.helpers.validate();
			expect(isValid).toBe(false);
			expect(field.state.error).toBe('Maximum 10 characters allowed');

			// Test pattern
			field.helpers.setValue('abc123');
			isValid = field.helpers.validate();
			expect(isValid).toBe(false);
			expect(field.state.error).toBe('Invalid format');

			// Test valid
			field.helpers.setValue('abc');
			isValid = field.helpers.validate();
			expect(isValid).toBe(true);
			expect(field.state.error).toBe(null);
		});
	});
});

