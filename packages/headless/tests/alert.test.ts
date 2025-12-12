/**
 * Alert Primitive Tests
 *
 * Comprehensive test suite for the Alert headless primitive.
 * Tests ARIA attributes, keyboard navigation, visibility, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAlert, isAlertVariant } from '../src/primitives/alert';

describe('Alert Primitive', () => {
	let containerElement: HTMLDivElement;
	let dismissButton: HTMLButtonElement;
	let actionButton: HTMLButtonElement;
	let iconElement: HTMLDivElement;

	beforeEach(() => {
		containerElement = document.createElement('div');
		dismissButton = document.createElement('button');
		actionButton = document.createElement('button');
		iconElement = document.createElement('div');
		document.body.appendChild(containerElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe('Initialization', () => {
		it('should create with default config', () => {
			const alert = createAlert();

			expect(alert.state.variant).toBe('info');
			expect(alert.state.visible).toBe(true);
			expect(alert.state.dismissible).toBe(false);
			expect(alert.state.role).toBe('status');
			expect(alert.state.ariaLive).toBe('polite');
			expect(alert.state.id).toMatch(/^alert-/);
		});

		it('should initialize with custom config', () => {
			const alert = createAlert({
				variant: 'error',
				visible: false,
				dismissible: true,
				id: 'custom-alert',
			});

			expect(alert.state.variant).toBe('error');
			expect(alert.state.visible).toBe(false);
			expect(alert.state.dismissible).toBe(true);
			expect(alert.state.id).toBe('custom-alert');
		});

		it('should generate unique IDs', () => {
			const alert1 = createAlert();
			const alert2 = createAlert();

			expect(alert1.state.id).not.toBe(alert2.state.id);
		});
	});

	describe('ARIA Attributes Based on Variant', () => {
		it('should set role="alert" and aria-live="assertive" for error variant', () => {
			const alert = createAlert({ variant: 'error' });
			const action = alert.actions.container(containerElement);

			expect(alert.state.role).toBe('alert');
			expect(alert.state.ariaLive).toBe('assertive');
			expect(containerElement.getAttribute('role')).toBe('alert');
			expect(containerElement.getAttribute('aria-live')).toBe('assertive');

			action.destroy?.();
		});

		it('should set role="alert" and aria-live="assertive" for warning variant', () => {
			const alert = createAlert({ variant: 'warning' });
			const action = alert.actions.container(containerElement);

			expect(alert.state.role).toBe('alert');
			expect(alert.state.ariaLive).toBe('assertive');
			expect(containerElement.getAttribute('role')).toBe('alert');
			expect(containerElement.getAttribute('aria-live')).toBe('assertive');

			action.destroy?.();
		});

		it('should set role="status" and aria-live="polite" for success variant', () => {
			const alert = createAlert({ variant: 'success' });
			const action = alert.actions.container(containerElement);

			expect(alert.state.role).toBe('status');
			expect(alert.state.ariaLive).toBe('polite');
			expect(containerElement.getAttribute('role')).toBe('status');
			expect(containerElement.getAttribute('aria-live')).toBe('polite');

			action.destroy?.();
		});

		it('should set role="status" and aria-live="polite" for info variant', () => {
			const alert = createAlert({ variant: 'info' });
			const action = alert.actions.container(containerElement);

			expect(alert.state.role).toBe('status');
			expect(alert.state.ariaLive).toBe('polite');
			expect(containerElement.getAttribute('role')).toBe('status');
			expect(containerElement.getAttribute('aria-live')).toBe('polite');

			action.destroy?.();
		});
	});

	describe('Container Action', () => {
		it('should set id attribute', () => {
			const alert = createAlert({ id: 'test-alert' });
			const action = alert.actions.container(containerElement);

			expect(containerElement.id).toBe('test-alert');

			action.destroy?.();
		});

		it('should update ARIA attributes on update', () => {
			const alert = createAlert({ variant: 'info' });
			const action = alert.actions.container(containerElement);

			expect(containerElement.getAttribute('role')).toBe('status');

			// Manually update variant through state
			alert.state.variant = 'error';
			action.update?.();

			expect(containerElement.getAttribute('role')).toBe('alert');

			action.destroy?.();
		});
	});

	describe('Icon Action', () => {
		it('should set aria-hidden attribute', () => {
			const alert = createAlert();
			const action = alert.actions.icon(iconElement);

			expect(iconElement.getAttribute('aria-hidden')).toBe('true');

			action.destroy?.();
		});
	});

	describe('Dismiss Button Action', () => {
		it('should set type attribute', () => {
			const alert = createAlert({ dismissible: true });
			const action = alert.actions.dismiss(dismissButton);

			expect(dismissButton.getAttribute('type')).toBe('button');

			action.destroy?.();
		});

		it('should set aria-label attribute', () => {
			const alert = createAlert({ dismissible: true });
			const action = alert.actions.dismiss(dismissButton);

			expect(dismissButton.getAttribute('aria-label')).toBe('Dismiss alert');

			action.destroy?.();
		});

		it('should call onDismiss when clicked', () => {
			const onDismiss = vi.fn();
			const alert = createAlert({ dismissible: true, onDismiss });
			alert.actions.container(containerElement);
			const action = alert.actions.dismiss(dismissButton);

			dismissButton.click();

			expect(onDismiss).toHaveBeenCalledTimes(1);
			expect(alert.state.visible).toBe(false);

			action.destroy?.();
		});

		it('should not dismiss if not dismissible', () => {
			const onDismiss = vi.fn();
			const alert = createAlert({ dismissible: false, onDismiss });
			alert.actions.container(containerElement);

			// Manually try to dismiss - should be prevented
			alert.helpers.dismiss();

			expect(onDismiss).not.toHaveBeenCalled();
			expect(alert.state.visible).toBe(true);
		});
	});

	describe('Action Button Action', () => {
		it('should set type attribute', () => {
			const alert = createAlert();
			const action = alert.actions.action(actionButton);

			expect(actionButton.getAttribute('type')).toBe('button');

			action.destroy?.();
		});

		it('should call onAction when clicked', () => {
			const onAction = vi.fn();
			const alert = createAlert({ onAction });
			const action = alert.actions.action(actionButton);

			actionButton.click();

			expect(onAction).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});
	});

	describe('Keyboard Navigation', () => {
		it('should dismiss on Escape key when dismissible', () => {
			const onDismiss = vi.fn();
			const alert = createAlert({ dismissible: true, onDismiss });
			const action = alert.actions.container(containerElement);

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			containerElement.dispatchEvent(event);

			expect(onDismiss).toHaveBeenCalledTimes(1);
			expect(alert.state.visible).toBe(false);

			action.destroy?.();
		});

		it('should not dismiss on Escape key when not dismissible', () => {
			const onDismiss = vi.fn();
			const alert = createAlert({ dismissible: false, onDismiss });
			const action = alert.actions.container(containerElement);

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			containerElement.dispatchEvent(event);

			expect(onDismiss).not.toHaveBeenCalled();
			expect(alert.state.visible).toBe(true);

			action.destroy?.();
		});

		it('should call onKeyDown handler', () => {
			const onKeyDown = vi.fn();
			const alert = createAlert({ onKeyDown });
			const action = alert.actions.container(containerElement);

			const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
			containerElement.dispatchEvent(event);

			expect(onKeyDown).toHaveBeenCalledTimes(1);

			action.destroy?.();
		});
	});

	describe('Visibility Helpers', () => {
		it('should show the alert', () => {
			const alert = createAlert({ visible: false });
			alert.actions.container(containerElement);

			expect(alert.state.visible).toBe(false);

			alert.helpers.show();

			expect(alert.state.visible).toBe(true);
		});

		it('should toggle visibility', () => {
			const alert = createAlert({ visible: true });
			alert.actions.container(containerElement);

			alert.helpers.toggle();
			expect(alert.state.visible).toBe(false);

			alert.helpers.toggle();
			expect(alert.state.visible).toBe(true);
		});

		it('should set visibility directly', () => {
			const alert = createAlert();
			alert.actions.container(containerElement);

			alert.helpers.setVisible(false);
			expect(alert.state.visible).toBe(false);

			alert.helpers.setVisible(true);
			expect(alert.state.visible).toBe(true);
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when container action is destroyed', () => {
			const onDestroy = vi.fn();
			const alert = createAlert({ onDestroy });
			const action = alert.actions.container(containerElement);

			action.destroy?.();

			expect(onDestroy).toHaveBeenCalledTimes(1);
		});

		it('should call onDestroy via helpers.destroy', () => {
			const onDestroy = vi.fn();
			const alert = createAlert({ onDestroy });
			alert.actions.container(containerElement);

			alert.helpers.destroy();

			expect(onDestroy).toHaveBeenCalledTimes(1);
		});

		it('should clean up event listeners', () => {
			const onKeyDown = vi.fn();
			const alert = createAlert({ onKeyDown });
			const action = alert.actions.container(containerElement);

			action.destroy?.();

			// Should not trigger after destroy
			const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
			containerElement.dispatchEvent(event);

			expect(onKeyDown).not.toHaveBeenCalled();
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid visibility changes', () => {
			const alert = createAlert();
			alert.actions.container(containerElement);

			alert.helpers.show();
			alert.helpers.toggle();
			alert.helpers.show();
			alert.helpers.setVisible(false);
			alert.helpers.toggle();

			expect(alert.state.visible).toBe(true);
		});

		it('should handle multiple alert instances', () => {
			const alert1 = createAlert({ id: 'alert-1', variant: 'error' });
			const alert2 = createAlert({ id: 'alert-2', variant: 'success' });

			const el1 = document.createElement('div');
			const el2 = document.createElement('div');
			document.body.appendChild(el1);
			document.body.appendChild(el2);

			alert1.actions.container(el1);
			alert2.actions.container(el2);

			expect(el1.getAttribute('role')).toBe('alert');
			expect(el2.getAttribute('role')).toBe('status');
		});
	});

	describe('isAlertVariant Type Guard', () => {
		it('should return true for valid variants', () => {
			expect(isAlertVariant('error')).toBe(true);
			expect(isAlertVariant('warning')).toBe(true);
			expect(isAlertVariant('success')).toBe(true);
			expect(isAlertVariant('info')).toBe(true);
		});

		it('should return false for invalid variants', () => {
			expect(isAlertVariant('invalid')).toBe(false);
			expect(isAlertVariant('')).toBe(false);
			expect(isAlertVariant(null)).toBe(false);
			expect(isAlertVariant(undefined)).toBe(false);
			expect(isAlertVariant(123)).toBe(false);
			expect(isAlertVariant({})).toBe(false);
		});
	});
});
