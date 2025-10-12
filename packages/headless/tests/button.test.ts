/**
 * Button Primitive Tests
 * 
 * Comprehensive test suite for the Button headless primitive.
 * Tests behavior, accessibility, keyboard interactions, and disabled states.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createButton, isButton } from '../src/primitives/button';

describe('Button Primitive', () => {
	describe('Initialization', () => {
		it('should create with default config', () => {
			const button = createButton();

			expect(button.state.pressed).toBe(false);
			expect(button.state.disabled).toBe(false);
			expect(button.state.loading).toBe(false);
		});

		it('should initialize with pressed state', () => {
			const button = createButton({ pressed: true });

			expect(button.state.pressed).toBe(true);
		});

		it('should initialize as disabled', () => {
			const button = createButton({ disabled: true });

			expect(button.state.disabled).toBe(true);
		});

		it('should initialize as loading', () => {
			const button = createButton({ loading: true });

			expect(button.state.loading).toBe(true);
		});
	});

	describe('Click Handling', () => {
		let buttonEl: HTMLButtonElement;

		beforeEach(() => {
			buttonEl = document.createElement('button');
			document.body.appendChild(buttonEl);
		});

		afterEach(() => {
			document.body.removeChild(buttonEl);
		});

		it('should call onClick when clicked', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonEl);

			buttonEl.click();

			expect(onClick).toHaveBeenCalledTimes(1);

			action.destroy();
		});

		it('should not call onClick when disabled', () => {
			const onClick = vi.fn();
			const button = createButton({ disabled: true, onClick });
			const action = button.actions.button(buttonEl);

			buttonEl.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy();
		});

		it('should not call onClick when loading', () => {
			const onClick = vi.fn();
			const button = createButton({ loading: true, onClick });
			const action = button.actions.button(buttonEl);

			buttonEl.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy();
		});

		it('should handle async onClick', async () => {
			const onClick = vi.fn().mockResolvedValue(undefined);
			const button = createButton({ onClick });
			const action = button.actions.button(buttonEl);

			buttonEl.click();

			expect(onClick).toHaveBeenCalled();

			action.destroy();
		});
	});

	describe('Keyboard Interactions', () => {
		let buttonEl: HTMLButtonElement;

		beforeEach(() => {
			buttonEl = document.createElement('button');
			document.body.appendChild(buttonEl);
		});

		afterEach(() => {
			document.body.removeChild(buttonEl);
		});

		it('should trigger click on Enter key', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonEl);

			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			buttonEl.dispatchEvent(event);

			expect(onClick).toHaveBeenCalledTimes(1);

			action.destroy();
		});

		it('should trigger click on Space key', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonEl);

			const event = new KeyboardEvent('keydown', { key: ' ' });
			buttonEl.dispatchEvent(event);

			expect(onClick).toHaveBeenCalledTimes(1);

			action.destroy();
		});

		it('should not trigger on other keys', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonEl);

			const event = new KeyboardEvent('keydown', { key: 'a' });
			buttonEl.dispatchEvent(event);

			expect(onClick).not.toHaveBeenCalled();

			action.destroy();
		});

		it('should prevent default on Space key', () => {
			const button = createButton();
			const action = button.actions.button(buttonEl);

			const event = new KeyboardEvent('keydown', { key: ' ' });
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
			buttonEl.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();

			action.destroy();
		});
	});

	describe('Toggle Behavior', () => {
		it('should toggle pressed state', () => {
			const button = createButton({ pressed: false });

			expect(button.state.pressed).toBe(false);

			button.helpers.toggle();
			expect(button.state.pressed).toBe(true);

			button.helpers.toggle();
			expect(button.state.pressed).toBe(false);
		});

		it('should set pressed state', () => {
			const button = createButton();

			button.helpers.setPressed(true);
			expect(button.state.pressed).toBe(true);

			button.helpers.setPressed(false);
			expect(button.state.pressed).toBe(false);
		});

		it('should call onPressedChange when toggled', () => {
			const onPressedChange = vi.fn();
			const button = createButton({ onPressedChange });

			button.helpers.toggle();

			expect(onPressedChange).toHaveBeenCalledWith(true);

			button.helpers.toggle();

			expect(onPressedChange).toHaveBeenCalledWith(false);
		});

		it('should update DOM attribute when pressed changes', () => {
			const button = createButton();
			const buttonEl = document.createElement('button');
			const action = button.actions.button(buttonEl);

			expect(buttonEl.getAttribute('aria-pressed')).toBe('false');

			button.helpers.setPressed(true);

			expect(buttonEl.getAttribute('aria-pressed')).toBe('true');

			action.destroy();
		});
	});

	describe('Disabled State', () => {
		it('should set disabled state', () => {
			const button = createButton();

			button.helpers.setDisabled(true);
			expect(button.state.disabled).toBe(true);

			button.helpers.setDisabled(false);
			expect(button.state.disabled).toBe(false);
		});

		it('should update DOM disabled attribute', () => {
			const button = createButton();
			const buttonEl = document.createElement('button');
			const action = button.actions.button(buttonEl);

			expect(buttonEl.disabled).toBe(false);

			button.helpers.setDisabled(true);

			expect(buttonEl.disabled).toBe(true);

			action.destroy();
		});

		it('should prevent clicks when disabled', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const buttonEl = document.createElement('button');
			const action = button.actions.button(buttonEl);

			button.helpers.setDisabled(true);
			buttonEl.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy();
		});
	});

	describe('Loading State', () => {
		it('should set loading state', () => {
			const button = createButton();

			button.helpers.setLoading(true);
			expect(button.state.loading).toBe(true);

			button.helpers.setLoading(false);
			expect(button.state.loading).toBe(false);
		});

		it('should update DOM aria-busy attribute', () => {
			const button = createButton();
			const buttonEl = document.createElement('button');
			const action = button.actions.button(buttonEl);

			expect(buttonEl.getAttribute('aria-busy')).toBe('false');

			button.helpers.setLoading(true);

			expect(buttonEl.getAttribute('aria-busy')).toBe('true');

			action.destroy();
		});

		it('should prevent clicks when loading', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const buttonEl = document.createElement('button');
			const action = button.actions.button(buttonEl);

			button.helpers.setLoading(true);
			buttonEl.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy();
		});
	});

	describe('DOM Attributes', () => {
		let buttonEl: HTMLButtonElement;

		beforeEach(() => {
			buttonEl = document.createElement('button');
			document.body.appendChild(buttonEl);
		});

		afterEach(() => {
			document.body.removeChild(buttonEl);
		});

		it('should set type attribute', () => {
			const button = createButton({ type: 'submit' });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.type).toBe('submit');

			action.destroy();
		});

		it('should set default type as button', () => {
			const button = createButton();
			const action = button.actions.button(buttonEl);

			expect(buttonEl.type).toBe('button');

			action.destroy();
		});

		it('should set aria-label', () => {
			const button = createButton({ label: 'Close dialog' });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.getAttribute('aria-label')).toBe('Close dialog');

			action.destroy();
		});

		it('should set aria-pressed for toggle buttons', () => {
			const button = createButton({ pressed: true });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.getAttribute('aria-pressed')).toBe('true');

			action.destroy();
		});

		it('should set disabled attribute', () => {
			const button = createButton({ disabled: true });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.disabled).toBe(true);

			action.destroy();
		});

		it('should set aria-busy when loading', () => {
			const button = createButton({ loading: true });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.getAttribute('aria-busy')).toBe('true');

			action.destroy();
		});
	});

	describe('Focus Management', () => {
		let buttonEl: HTMLButtonElement;

		beforeEach(() => {
			buttonEl = document.createElement('button');
			document.body.appendChild(buttonEl);
		});

		afterEach(() => {
			document.body.removeChild(buttonEl);
		});

		it('should focus button element', () => {
			const button = createButton();
			const action = button.actions.button(buttonEl);

			button.helpers.focus();

			expect(document.activeElement).toBe(buttonEl);

			action.destroy();
		});

		it('should blur button element', () => {
			const button = createButton();
			const action = button.actions.button(buttonEl);

			buttonEl.focus();
			expect(document.activeElement).toBe(buttonEl);

			button.helpers.blur();

			expect(document.activeElement).not.toBe(buttonEl);

			action.destroy();
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const button = createButton({ onDestroy });
			const buttonEl = document.createElement('button');

			const action = button.actions.button(buttonEl);
			action.destroy();

			expect(onDestroy).toHaveBeenCalled();
		});

		it('should remove event listeners on destroy', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const buttonEl = document.createElement('button');
			document.body.appendChild(buttonEl);

			const action = button.actions.button(buttonEl);
			action.destroy();

			buttonEl.click();

			expect(onClick).not.toHaveBeenCalled();

			document.body.removeChild(buttonEl);
		});
	});

	describe('isButton Utility', () => {
		it('should identify button elements', () => {
			const buttonEl = document.createElement('button');

			expect(isButton(buttonEl)).toBe(true);
		});

		it('should identify link elements with button role', () => {
			const linkEl = document.createElement('a');
			linkEl.setAttribute('role', 'button');

			expect(isButton(linkEl)).toBe(true);
		});

		it('should not identify regular links', () => {
			const linkEl = document.createElement('a');

			expect(isButton(linkEl)).toBe(false);
		});

		it('should not identify divs', () => {
			const divEl = document.createElement('div');

			expect(isButton(divEl)).toBe(false);
		});

		it('should identify input[type=button]', () => {
			const inputEl = document.createElement('input');
			inputEl.type = 'button';

			expect(isButton(inputEl)).toBe(true);
		});

		it('should identify input[type=submit]', () => {
			const inputEl = document.createElement('input');
			inputEl.type = 'submit';

			expect(isButton(inputEl)).toBe(true);
		});

		it('should not identify input[type=text]', () => {
			const inputEl = document.createElement('input');
			inputEl.type = 'text';

			expect(isButton(inputEl)).toBe(false);
		});
	});

	describe('Accessibility', () => {
		let buttonEl: HTMLButtonElement;

		beforeEach(() => {
			buttonEl = document.createElement('button');
			document.body.appendChild(buttonEl);
		});

		afterEach(() => {
			document.body.removeChild(buttonEl);
		});

		it('should have button role by default', () => {
			const button = createButton();
			const action = button.actions.button(buttonEl);

			expect(buttonEl.tagName).toBe('BUTTON');

			action.destroy();
		});

		it('should support aria-pressed for toggle buttons', () => {
			const button = createButton({ pressed: false });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.getAttribute('aria-pressed')).toBe('false');

			button.helpers.toggle();

			expect(buttonEl.getAttribute('aria-pressed')).toBe('true');

			action.destroy();
		});

		it('should be keyboard accessible', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const action = button.actions.button(buttonEl);

			// Should respond to Enter
			buttonEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
			expect(onClick).toHaveBeenCalledTimes(1);

			// Should respond to Space
			buttonEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
			expect(onClick).toHaveBeenCalledTimes(2);

			action.destroy();
		});

		it('should indicate loading state to screen readers', () => {
			const button = createButton({ loading: true });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.getAttribute('aria-busy')).toBe('true');

			action.destroy();
		});

		it('should indicate disabled state', () => {
			const button = createButton({ disabled: true });
			const action = button.actions.button(buttonEl);

			expect(buttonEl.disabled).toBe(true);

			action.destroy();
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid clicks', () => {
			const onClick = vi.fn();
			const button = createButton({ onClick });
			const buttonEl = document.createElement('button');
			const action = button.actions.button(buttonEl);

			buttonEl.click();
			buttonEl.click();
			buttonEl.click();

			expect(onClick).toHaveBeenCalledTimes(3);

			action.destroy();
		});

		it('should handle both disabled and loading', () => {
			const onClick = vi.fn();
			const button = createButton({ disabled: true, loading: true, onClick });
			const buttonEl = document.createElement('button');
			const action = button.actions.button(buttonEl);

			buttonEl.click();

			expect(onClick).not.toHaveBeenCalled();

			action.destroy();
		});

		it('should handle toggling while disabled', () => {
			const button = createButton({ disabled: true, pressed: false });

			button.helpers.toggle();

			expect(button.state.pressed).toBe(true);
		});

		it('should handle focus without element', () => {
			const button = createButton();

			// Should not throw
			expect(() => button.helpers.focus()).not.toThrow();
		});

		it('should handle blur without element', () => {
			const button = createButton();

			// Should not throw
			expect(() => button.helpers.blur()).not.toThrow();
		});
	});
});

