/**
 * Spinner Primitive Tests
 *
 * Comprehensive test suite for the Spinner headless primitive.
 * Tests state management, actions, helpers, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSpinner } from '../src/primitives/spinner';

describe('Spinner Primitive', () => {
	let spinnerElement: HTMLSpanElement;

	beforeEach(() => {
		spinnerElement = document.createElement('span');
		document.body.appendChild(spinnerElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe('Initialization', () => {
		it('should create with default config', () => {
			const spinner = createSpinner();

			expect(spinner.state.size).toBe('md');
			expect(spinner.state.color).toBe('primary');
			expect(spinner.state.label).toBe('Loading');
			expect(spinner.state.active).toBe(true);
			expect(spinner.state.disabled).toBe(false);
			expect(spinner.state.class).toBe('');
			expect(spinner.state.id).toMatch(/^spinner-/);
		});

		it('should initialize with custom config', () => {
			const spinner = createSpinner({
				size: 'lg',
				color: 'white',
				label: 'Please wait...',
				active: false,
				id: 'custom-spinner',
				class: 'my-spinner',
			});

			expect(spinner.state.size).toBe('lg');
			expect(spinner.state.color).toBe('white');
			expect(spinner.state.label).toBe('Please wait...');
			expect(spinner.state.active).toBe(false);
			expect(spinner.state.id).toBe('custom-spinner');
			expect(spinner.state.class).toBe('my-spinner');
		});

		it('should generate unique IDs', () => {
			const spinner1 = createSpinner();
			const spinner2 = createSpinner();

			expect(spinner1.state.id).not.toBe(spinner2.state.id);
		});

		it('should accept all size values', () => {
			const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

			sizes.forEach((size) => {
				const spinner = createSpinner({ size });
				expect(spinner.state.size).toBe(size);
			});
		});

		it('should accept all color values', () => {
			const colors: Array<'primary' | 'current' | 'white' | 'gray'> = [
				'primary',
				'current',
				'white',
				'gray',
			];

			colors.forEach((color) => {
				const spinner = createSpinner({ color });
				expect(spinner.state.color).toBe(color);
			});
		});
	});

	describe('Spinner Action', () => {
		it('should set role attribute to status', () => {
			const spinner = createSpinner();
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.getAttribute('role')).toBe('status');

			action.destroy();
		});

		it('should set aria-label attribute', () => {
			const spinner = createSpinner({ label: 'Loading data...' });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.getAttribute('aria-label')).toBe('Loading data...');

			action.destroy();
		});

		it('should set id attribute', () => {
			const spinner = createSpinner({ id: 'test-spinner' });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.id).toBe('test-spinner');

			action.destroy();
		});

		it('should set data-size attribute', () => {
			const spinner = createSpinner({ size: 'lg' });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.getAttribute('data-size')).toBe('lg');

			action.destroy();
		});

		it('should set data-color attribute', () => {
			const spinner = createSpinner({ color: 'white' });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.getAttribute('data-color')).toBe('white');

			action.destroy();
		});

		it('should set data-active attribute', () => {
			const spinner = createSpinner({ active: true });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.getAttribute('data-active')).toBe('true');

			action.destroy();
		});

		it('should set aria-disabled when disabled', () => {
			const spinner = createSpinner({ disabled: true });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.getAttribute('aria-disabled')).toBe('true');

			action.destroy();
		});

		it('should not set aria-disabled when not disabled', () => {
			const spinner = createSpinner({ disabled: false });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinnerElement.getAttribute('aria-disabled')).toBeNull();

			action.destroy();
		});
	});

	describe('Start/Stop Helpers', () => {
		it('should start the spinner', () => {
			const spinner = createSpinner({ active: false });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinner.state.active).toBe(false);

			spinner.helpers.start();

			expect(spinner.state.active).toBe(true);
			expect(spinnerElement.getAttribute('data-active')).toBe('true');

			action.destroy();
		});

		it('should stop the spinner', () => {
			const spinner = createSpinner({ active: true });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinner.state.active).toBe(true);

			spinner.helpers.stop();

			expect(spinner.state.active).toBe(false);
			expect(spinnerElement.getAttribute('data-active')).toBe('false');

			action.destroy();
		});

		it('should toggle the spinner', () => {
			const spinner = createSpinner({ active: true });
			const action = spinner.actions.spinner(spinnerElement);

			expect(spinner.state.active).toBe(true);

			spinner.helpers.toggle();
			expect(spinner.state.active).toBe(false);

			spinner.helpers.toggle();
			expect(spinner.state.active).toBe(true);

			action.destroy();
		});

		it('should set active state directly', () => {
			const spinner = createSpinner();
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.setActive(false);
			expect(spinner.state.active).toBe(false);

			spinner.helpers.setActive(true);
			expect(spinner.state.active).toBe(true);

			action.destroy();
		});
	});

	describe('Callbacks', () => {
		it('should call onStart when spinner starts', () => {
			const onStart = vi.fn();
			const spinner = createSpinner({ active: false, onStart });
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.start();

			expect(onStart).toHaveBeenCalledTimes(1);

			action.destroy();
		});

		it('should call onStop when spinner stops', () => {
			const onStop = vi.fn();
			const spinner = createSpinner({ active: true, onStop });
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.stop();

			expect(onStop).toHaveBeenCalledTimes(1);

			action.destroy();
		});

		it('should not call onStart if already active', () => {
			const onStart = vi.fn();
			const spinner = createSpinner({ active: true, onStart });
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.start();

			expect(onStart).not.toHaveBeenCalled();

			action.destroy();
		});

		it('should not call onStop if already inactive', () => {
			const onStop = vi.fn();
			const spinner = createSpinner({ active: false, onStop });
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.stop();

			expect(onStop).not.toHaveBeenCalled();

			action.destroy();
		});

		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const spinner = createSpinner({ onDestroy });
			const action = spinner.actions.spinner(spinnerElement);

			action.destroy();

			expect(onDestroy).toHaveBeenCalledTimes(1);
		});
	});

	describe('State Setters', () => {
		it('should set size', () => {
			const spinner = createSpinner({ size: 'sm' });
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.setSize('xl');

			expect(spinner.state.size).toBe('xl');
			expect(spinnerElement.getAttribute('data-size')).toBe('xl');

			action.destroy();
		});

		it('should set color', () => {
			const spinner = createSpinner({ color: 'primary' });
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.setColor('gray');

			expect(spinner.state.color).toBe('gray');
			expect(spinnerElement.getAttribute('data-color')).toBe('gray');

			action.destroy();
		});

		it('should set label', () => {
			const spinner = createSpinner({ label: 'Loading' });
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.setLabel('Processing...');

			expect(spinner.state.label).toBe('Processing...');
			expect(spinnerElement.getAttribute('aria-label')).toBe('Processing...');

			action.destroy();
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy via helpers.destroy', () => {
			const onDestroy = vi.fn();
			const spinner = createSpinner({ onDestroy });
			spinner.actions.spinner(spinnerElement);

			spinner.helpers.destroy();

			expect(onDestroy).toHaveBeenCalledTimes(1);
		});

		it('should handle destroy without attached element', () => {
			const onDestroy = vi.fn();
			const spinner = createSpinner({ onDestroy });

			// Call destroy without attaching to element
			expect(() => {
				spinner.helpers.destroy();
			}).not.toThrow();

			expect(onDestroy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid state changes', () => {
			const spinner = createSpinner();
			const action = spinner.actions.spinner(spinnerElement);

			spinner.helpers.start();
			spinner.helpers.stop();
			spinner.helpers.start();
			spinner.helpers.stop();
			spinner.helpers.toggle();
			spinner.helpers.toggle();

			expect(spinner.state.active).toBe(false);

			action.destroy();
		});

		it('should handle multiple spinner instances', () => {
			const spinner1 = createSpinner({ id: 'spinner-1', size: 'sm' });
			const spinner2 = createSpinner({ id: 'spinner-2', size: 'lg' });

			const el1 = document.createElement('span');
			const el2 = document.createElement('span');
			document.body.appendChild(el1);
			document.body.appendChild(el2);

			const action1 = spinner1.actions.spinner(el1);
			const action2 = spinner2.actions.spinner(el2);

			spinner1.helpers.setSize('xl');
			expect(spinner1.state.size).toBe('xl');
			expect(spinner2.state.size).toBe('lg');

			action1.destroy();
			action2.destroy();
		});

		it('should work without element attached', () => {
			const spinner = createSpinner();

			// State should still be mutable without element
			expect(() => {
				spinner.helpers.start();
				spinner.helpers.stop();
				spinner.helpers.setSize('lg');
				spinner.helpers.setColor('white');
				spinner.helpers.setLabel('Test');
			}).not.toThrow();

			expect(spinner.state.active).toBe(false);
			expect(spinner.state.size).toBe('lg');
			expect(spinner.state.color).toBe('white');
			expect(spinner.state.label).toBe('Test');
		});
	});
});
