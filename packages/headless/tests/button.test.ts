/**
 * Button Primitive Tests
 * 
 * Comprehensive test suite for the Button headless primitive.
 * Tests click handlers, keyboard navigation, loading states, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createButton } from '../src/primitives/button';

describe('Button Primitive', () => {
	let buttonElement: HTMLButtonElement;

	beforeEach(() => {
		buttonElement = document.createElement('button');
		document.body.appendChild(buttonElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe('Initialization', () => {
		it('should create with default config', () => {
			const button = createButton();

			expect(button.state.disabled).toBe(false);
			expect(button.state.loading).toBe(false);
			expect(button.state.pressed).toBe(false);
			expect(button.state.focused).toBe(false);
			expect(button.state.id).toMatch(/^button-/);
		});

		it('should initialize with custom config', () => {
			const button = createButton({
				disabled: true,
				loading: true,
				pressed: true,
				id: 'custom-button',
				label: 'Custom Button'
			});

			expect(button.state.disabled).toBe(true);
			expect(button.state.loading).toBe(true);
			expect(button.state.pressed).toBe(true);
			expect(button.state.id).toBe('custom-button');
		});

		it('should generate unique IDs', () => {
			const button1 = createButton();
			const button2 = createButton();

			expect(button1.state.id).not.toBe(button2.state.id);
		});
	});

	describe('Button Action', () => {
		it('should set type attribute', () => {
			const button = createButton({ type: 'submit' });
			const action = button.actions.button(buttonElement);

			expect(buttonElement.getAttribute('type')).toBe('submit');

			action.destroy?.();
		});

		it('should set id attribute', () => {
			const button = createButton({ id: 'test-button' });
			const action = button.actions.button(buttonElement);

			expect(buttonElement.id).toBe('test-button');

			action.destroy?.();
		});

		it('should set aria-label', () => {
			const button = createButton({ label: 'Test Button' });
			const action = button.actions.button(buttonElement);

			expect(buttonElement.getAttribute('aria-label')).toBe('Test Button');

			action.destroy?.();
		});

		it('should set aria-disabled when disabled', () => {
			const button = createButton({ disabled: true });
			const action = button.actions.button(buttonElement);

			expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

			action.destroy?.();
		});

		it('should set aria-busy when loading', () => {
			const button = createButton({ loading: true });
			const action = button.actions.button(buttonElement);

			expect(buttonElement.getAttribute('aria-busy')).toBe('true');

			action.destroy?.();
		});

		it('should set aria-pressed for toggle buttons', () => {
			const button = createButton({ pressed: true });
			const action = button.actions.button(buttonElement);

			expect(buttonElement.getAttribute('aria-pressed')).toBe('true');

			action.destroy?.();
		});
	});

	describe('Click Handling', () => {
		it('should call onClick handler', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			buttonElement.click();

			expect(onClick).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});

		it('should not call onClick when disabled', () => {
			const onClick = vi.fn();
			const button = createButton({ disabled: true, onClick });
			const action = button.actions.button(buttonElement);

			buttonElement.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy?.();
		});

		it('should not call onClick when loading', () => {
			const onClick = vi.fn();
			const button = createButton({ loading: true, onClick });
			const action = button.actions.button(buttonElement);

			buttonElement.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy?.();
		});

		it('should trigger click via helper', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			button.helpers.click();

			expect(onClick).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});
	});

	describe('Keyboard Navigation', () => {
		it('should trigger onClick on Enter key', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
			buttonElement.dispatchEvent(event);

			expect(onClick).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});

		it('should trigger onClick on Space key', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
			buttonElement.dispatchEvent(event);

			expect(onClick).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});

		it('should not trigger onClick on other keys', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
			buttonElement.dispatchEvent(event);

			expect(onClick).not.toHaveBeenCalled();

			action.destroy?.();
		});

		it('should call onKeyDown handler', () => {
			const onKeyDown = vi.fn();
			const button = createButton({ onKeyDown });
			const action = button.actions.button(buttonElement);

			const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
			buttonElement.dispatchEvent(event);

			expect(onKeyDown).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});

		it('should not trigger keyboard events when disabled', () => {
			const onClick = vi.fn();
			const button = createButton({ disabled: true, onClick });
			const action = button.actions.button(buttonElement);

			const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
			buttonElement.dispatchEvent(event);

			expect(onClick).not.toHaveBeenCalled();

			action.destroy?.();
		});
	});

	describe('Focus Management', () => {
		it('should track focused state', () => {
			const button = createButton();
			const action = button.actions.button(buttonElement);

			expect(button.state.focused).toBe(false);

			buttonElement.focus();
			expect(button.state.focused).toBe(true);

			buttonElement.blur();
			expect(button.state.focused).toBe(false);

			action.destroy?.();
		});

		it('should call onFocus handler', () => {
			const onFocus = vi.fn();
			const button = createButton({ onFocus });
			const action = button.actions.button(buttonElement);

			buttonElement.focus();

			expect(onFocus).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});

		it('should call onBlur handler', () => {
			const onBlur = vi.fn();
			const button = createButton({ onBlur });
			const action = button.actions.button(buttonElement);

			buttonElement.focus();
			buttonElement.blur();

			expect(onBlur).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});

		it('should focus via helper', () => {
			const button = createButton();
			const action = button.actions.button(buttonElement);

			button.helpers.focus();

			expect(button.state.focused).toBe(true);
			expect(document.activeElement).toBe(buttonElement);

			action.destroy?.();
		});

		it('should blur via helper', () => {
			const button = createButton();
			const action = button.actions.button(buttonElement);

			button.helpers.focus();
			expect(button.state.focused).toBe(true);

			button.helpers.blur();
			expect(button.state.focused).toBe(false);

			action.destroy?.();
		});
	});

	describe('Toggle Buttons', () => {
		it('should toggle pressed state', () => {
			const button = createButton({ pressed: false });
			const action = button.actions.button(buttonElement);

			expect(button.state.pressed).toBe(false);
			expect(buttonElement.getAttribute('aria-pressed')).toBe('false');

			button.helpers.toggle();

			expect(button.state.pressed).toBe(true);
			expect(buttonElement.getAttribute('aria-pressed')).toBe('true');

			action.destroy?.();
		});

		it('should call onPressedChange when toggled', () => {
			const onPressedChange = vi.fn();
			const button = createButton({ pressed: false, onPressedChange });
			const action = button.actions.button(buttonElement);

			button.helpers.toggle();

			expect(onPressedChange).toHaveBeenCalledWith(true);

			button.helpers.toggle();

			expect(onPressedChange).toHaveBeenCalledWith(false);

			action.destroy?.();
		});

		it('should set pressed state directly', () => {
			const button = createButton();
			const action = button.actions.button(buttonElement);

			button.helpers.setPressed(true);

			expect(button.state.pressed).toBe(true);
			expect(buttonElement.getAttribute('aria-pressed')).toBe('true');

			action.destroy?.();
		});
	});

	describe('Loading State', () => {
		it('should update loading state', () => {
			const button = createButton();
			const action = button.actions.button(buttonElement);

			expect(button.state.loading).toBe(false);
			expect(buttonElement.getAttribute('aria-busy')).toBe('false');

			button.helpers.setLoading(true);

			expect(button.state.loading).toBe(true);
			expect(buttonElement.getAttribute('aria-busy')).toBe('true');

			action.destroy?.();
		});

		it('should prevent clicks when loading', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			button.helpers.setLoading(true);
			buttonElement.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy?.();
		});
	});

	describe('Disabled State', () => {
		it('should update disabled state', () => {
			const button = createButton();
			const action = button.actions.button(buttonElement);

			expect(button.state.disabled).toBe(false);
			expect(buttonElement.getAttribute('aria-disabled')).toBe('false');

			button.helpers.setDisabled(true);

			expect(button.state.disabled).toBe(true);
			expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

			action.destroy?.();
		});

		it('should prevent clicks when disabled', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			button.helpers.setDisabled(true);
			buttonElement.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy?.();
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const button = createButton({ onDestroy });
			const action = button.actions.button(buttonElement);

			action.destroy?.();

			expect(onDestroy).toHaveBeenCalledTimes(1);
		});

		it('should call onDestroy via helpers.destroy', () => {
			const onDestroy = vi.fn();
			const button = createButton({ onDestroy });
			const action = button.actions.button(buttonElement);

			button.helpers.destroy();

			expect(onDestroy).toHaveBeenCalledTimes(1);

			// Action destroy should have been called internally
			action.destroy?.();
		});

		it('should clean up event listeners', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonElement);

			action.destroy?.();

			// Click should not be handled after destroy
			buttonElement.click();
			expect(onClick).not.toHaveBeenCalled();
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid state changes', () => {
			const button = createButton();
			const action = button.actions.button(buttonElement);

			button.helpers.setDisabled(true);
			button.helpers.setDisabled(false);
			button.helpers.setLoading(true);
			button.helpers.setLoading(false);
			button.helpers.setPressed(true);
			button.helpers.setPressed(false);

			expect(button.state.disabled).toBe(false);
			expect(button.state.loading).toBe(false);
			expect(button.state.pressed).toBe(false);

			action.destroy?.();
		});

		it('should handle multiple button instances', () => {
			const button1 = createButton({ id: 'button-1' });
			const button2 = createButton({ id: 'button-2' });

			const el1 = document.createElement('button');
			const el2 = document.createElement('button');
			document.body.appendChild(el1);
			document.body.appendChild(el2);

			const action1 = button1.actions.button(el1);
			const action2 = button2.actions.button(el2);

			button1.helpers.setDisabled(true);
			expect(button1.state.disabled).toBe(true);
			expect(button2.state.disabled).toBe(false);

			action1.destroy?.();
			action2.destroy?.();
		});

		it('should handle button action applied to non-button element', () => {
			const button = createButton();
			const divElement = document.createElement('div') as unknown as HTMLButtonElement;
			document.body.appendChild(divElement);

			// Should not throw
			expect(() => {
				const action = button.actions.button(divElement);
				action.destroy?.();
			}).not.toThrow();
		});
	});
});
