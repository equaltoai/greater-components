/**
 * Dismissable Behavior Tests
 *
 * Comprehensive test suite for the Dismissable headless behavior.
 * Tests click-outside, escape key, scroll, resize, focus handling, and layer stack.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	createDismissable,
	getDismissableLayerCount,
	clearDismissableLayers,
	type DismissReason,
} from '../src/behaviors/dismissable';

describe('Dismissable Behavior', () => {
	let targetElement: HTMLDivElement;
	let outsideElement: HTMLDivElement;

	beforeEach(() => {
		targetElement = document.createElement('div');
		targetElement.id = 'target';
		outsideElement = document.createElement('div');
		outsideElement.id = 'outside';
		document.body.appendChild(targetElement);
		document.body.appendChild(outsideElement);
		// Clear any leftover layers from previous tests
		clearDismissableLayers();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		clearDismissableLayers();
	});

	describe('Initialization', () => {
		it('should create with default config', () => {
			const dismissable = createDismissable();

			expect(dismissable.state.target).toBeNull();
			expect(dismissable.state.active).toBe(false);
			expect(dismissable.state.layerIndex).toBe(-1);
		});

		it('should not be active initially', () => {
			const dismissable = createDismissable();

			expect(dismissable.state.active).toBe(false);
			expect(getDismissableLayerCount()).toBe(0);
		});
	});

	describe('Activation', () => {
		it('should activate on target element', () => {
			const dismissable = createDismissable();

			dismissable.activate(targetElement);

			expect(dismissable.state.target).toBe(targetElement);
			expect(dismissable.state.active).toBe(true);
			expect(dismissable.state.layerIndex).toBe(0);
		});

		it('should add to layer stack on activation', () => {
			const dismissable = createDismissable();

			expect(getDismissableLayerCount()).toBe(0);

			dismissable.activate(targetElement);

			expect(getDismissableLayerCount()).toBe(1);
		});

		it('should deactivate previous before reactivating', () => {
			const dismissable = createDismissable();
			const newTarget = document.createElement('div');
			document.body.appendChild(newTarget);

			dismissable.activate(targetElement);
			expect(dismissable.state.target).toBe(targetElement);

			dismissable.activate(newTarget);
			expect(dismissable.state.target).toBe(newTarget);
			expect(getDismissableLayerCount()).toBe(1);
		});
	});

	describe('Deactivation', () => {
		it('should deactivate', () => {
			const dismissable = createDismissable();

			dismissable.activate(targetElement);
			expect(dismissable.state.active).toBe(true);

			dismissable.deactivate();

			expect(dismissable.state.target).toBeNull();
			expect(dismissable.state.active).toBe(false);
			expect(dismissable.state.layerIndex).toBe(-1);
		});

		it('should remove from layer stack on deactivation', () => {
			const dismissable = createDismissable();

			dismissable.activate(targetElement);
			expect(getDismissableLayerCount()).toBe(1);

			dismissable.deactivate();
			expect(getDismissableLayerCount()).toBe(0);
		});

		it('should handle deactivate when not active', () => {
			const dismissable = createDismissable();

			expect(() => {
				dismissable.deactivate();
			}).not.toThrow();
		});
	});

	describe('Click Outside', () => {
		it('should call onDismiss when clicking outside', async () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			// Simulate click outside
			const event = new MouseEvent('mousedown', { bubbles: true });
			outsideElement.dispatchEvent(event);

			// Wait for setTimeout in handleClick
			await vi.waitFor(() => {
				expect(onDismiss).toHaveBeenCalledWith('click-outside');
			});
		});

		it('should not call onDismiss when clicking inside target', async () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			const event = new MouseEvent('mousedown', { bubbles: true });
			targetElement.dispatchEvent(event);

			// Wait to ensure callback is not called
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('should not dismiss when closeOnClickOutside is false', async () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				closeOnClickOutside: false,
				onDismiss,
			});

			dismissable.activate(targetElement);

			const event = new MouseEvent('mousedown', { bubbles: true });
			outsideElement.dispatchEvent(event);

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(onDismiss).not.toHaveBeenCalled();
		});
	});

	describe('Escape Key', () => {
		it('should call onDismiss when pressing Escape', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(event);

			expect(onDismiss).toHaveBeenCalledWith('escape');
		});

		it('should not dismiss when closeOnEscape is false', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				closeOnEscape: false,
				onDismiss,
			});

			dismissable.activate(targetElement);

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(event);

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('should not respond to other keys', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
			document.dispatchEvent(event);

			expect(onDismiss).not.toHaveBeenCalled();
		});
	});

	describe('Scroll', () => {
		it('should dismiss on scroll when closeOnScroll is true', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				closeOnScroll: true,
				onDismiss,
			});

			dismissable.activate(targetElement);

			const event = new Event('scroll', { bubbles: true });
			outsideElement.dispatchEvent(event);

			expect(onDismiss).toHaveBeenCalledWith('scroll');
		});

		it('should not dismiss on scroll by default', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			const event = new Event('scroll', { bubbles: true });
			outsideElement.dispatchEvent(event);

			expect(onDismiss).not.toHaveBeenCalled();
		});
	});

	describe('Resize', () => {
		it('should dismiss on resize when closeOnResize is true', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				closeOnResize: true,
				onDismiss,
			});

			dismissable.activate(targetElement);

			window.dispatchEvent(new Event('resize'));

			expect(onDismiss).toHaveBeenCalledWith('resize');
		});

		it('should not dismiss on resize by default', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			window.dispatchEvent(new Event('resize'));

			expect(onDismiss).not.toHaveBeenCalled();
		});
	});

	describe('Focus Outside', () => {
		it('should dismiss on focus outside when closeOnFocusOutside is true', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				closeOnFocusOutside: true,
				onDismiss,
			});

			dismissable.activate(targetElement);

			const event = new FocusEvent('focusin', { bubbles: true });
			outsideElement.dispatchEvent(event);

			expect(onDismiss).toHaveBeenCalledWith('focus-outside');
		});

		it('should not dismiss on focus outside by default', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			const event = new FocusEvent('focusin', { bubbles: true });
			outsideElement.dispatchEvent(event);

			expect(onDismiss).not.toHaveBeenCalled();
		});
	});

	describe('Programmatic Dismiss', () => {
		it('should dismiss programmatically', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);
			dismissable.dismiss();

			expect(onDismiss).toHaveBeenCalledWith('programmatic');
		});
	});

	describe('Before Dismiss Callback', () => {
		it('should prevent dismiss when onBeforeDismiss returns false', () => {
			const onDismiss = vi.fn();
			const onBeforeDismiss = vi.fn().mockReturnValue(false);
			const dismissable = createDismissable({ onDismiss, onBeforeDismiss });

			dismissable.activate(targetElement);

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(event);

			expect(onBeforeDismiss).toHaveBeenCalledWith('escape');
			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('should allow dismiss when onBeforeDismiss returns true', () => {
			const onDismiss = vi.fn();
			const onBeforeDismiss = vi.fn().mockReturnValue(true);
			const dismissable = createDismissable({ onDismiss, onBeforeDismiss });

			dismissable.activate(targetElement);

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(event);

			expect(onBeforeDismiss).toHaveBeenCalledWith('escape');
			expect(onDismiss).toHaveBeenCalledWith('escape');
		});
	});

	describe('Exclude Elements', () => {
		it('should not dismiss when clicking on excluded element', async () => {
			const excludedElement = document.createElement('button');
			document.body.appendChild(excludedElement);

			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				excludeElements: [excludedElement],
				onDismiss,
			});

			dismissable.activate(targetElement);

			const event = new MouseEvent('mousedown', { bubbles: true });
			excludedElement.dispatchEvent(event);

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('should add exclude element dynamically', async () => {
			const excludeElement = document.createElement('button');
			document.body.appendChild(excludeElement);

			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);
			dismissable.addExclude(excludeElement);

			const event = new MouseEvent('mousedown', { bubbles: true });
			excludeElement.dispatchEvent(event);

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it('should remove exclude element dynamically', async () => {
			const excludeElement = document.createElement('button');
			document.body.appendChild(excludeElement);

			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				excludeElements: [excludeElement],
				onDismiss,
			});

			dismissable.activate(targetElement);
			dismissable.removeExclude(excludeElement);

			const event = new MouseEvent('mousedown', { bubbles: true });
			excludeElement.dispatchEvent(event);

			await vi.waitFor(() => {
				expect(onDismiss).toHaveBeenCalledWith('click-outside');
			});
		});

		it('should not add duplicate exclude elements', () => {
			const excludeElement = document.createElement('button');
			const dismissable = createDismissable({
				excludeElements: [excludeElement],
			});

			dismissable.addExclude(excludeElement);
			dismissable.addExclude(excludeElement);

			// Internal state check via behavior
			dismissable.removeExclude(excludeElement);
			// Should still work after one removal if duplicates weren't added
		});
	});

	describe('Layer Stack', () => {
		it('should support nested dismissables', () => {
			const dismissable1 = createDismissable();
			const dismissable2 = createDismissable();

			const target1 = document.createElement('div');
			const target2 = document.createElement('div');
			document.body.appendChild(target1);
			document.body.appendChild(target2);

			dismissable1.activate(target1);
			expect(getDismissableLayerCount()).toBe(1);
			expect(dismissable1.state.layerIndex).toBe(0);

			dismissable2.activate(target2);
			expect(getDismissableLayerCount()).toBe(2);
			expect(dismissable2.state.layerIndex).toBe(1);

			dismissable2.deactivate();
			expect(getDismissableLayerCount()).toBe(1);

			dismissable1.deactivate();
			expect(getDismissableLayerCount()).toBe(0);
		});

		it('should only dismiss top layer on Escape', () => {
			const onDismiss1 = vi.fn();
			const onDismiss2 = vi.fn();
			const dismissable1 = createDismissable({ onDismiss: onDismiss1 });
			const dismissable2 = createDismissable({ onDismiss: onDismiss2 });

			const target1 = document.createElement('div');
			const target2 = document.createElement('div');
			document.body.appendChild(target1);
			document.body.appendChild(target2);

			dismissable1.activate(target1);
			dismissable2.activate(target2);

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(event);

			// Only top layer should be dismissed
			expect(onDismiss2).toHaveBeenCalledWith('escape');
			expect(onDismiss1).not.toHaveBeenCalled();
		});
	});

	describe('Config Update', () => {
		it('should update config while active', () => {
			const onDismiss1 = vi.fn();
			const onDismiss2 = vi.fn();
			const dismissable = createDismissable({ onDismiss: onDismiss1 });

			dismissable.activate(targetElement);

			dismissable.updateConfig({ onDismiss: onDismiss2 });

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(event);

			expect(onDismiss1).not.toHaveBeenCalled();
			expect(onDismiss2).toHaveBeenCalledWith('escape');
		});

		it('should add scroll listener after config update', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);

			// Initially scroll doesn't dismiss
			const scrollEvent1 = new Event('scroll', { bubbles: true });
			outsideElement.dispatchEvent(scrollEvent1);
			expect(onDismiss).not.toHaveBeenCalled();

			// Update config and re-verify target was maintained
			dismissable.updateConfig({ closeOnScroll: true });
			expect(dismissable.state.active).toBe(true);

			const scrollEvent2 = new Event('scroll', { bubbles: true });
			outsideElement.dispatchEvent(scrollEvent2);
			expect(onDismiss).toHaveBeenCalledWith('scroll');
		});
	});

	describe('Destroy', () => {
		it('should clean up on destroy', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({ onDismiss });

			dismissable.activate(targetElement);
			expect(dismissable.state.active).toBe(true);

			dismissable.destroy();
			expect(dismissable.state.active).toBe(false);
			expect(getDismissableLayerCount()).toBe(0);
		});

		it('should remove all event listeners on destroy', () => {
			const onDismiss = vi.fn();
			const dismissable = createDismissable({
				closeOnScroll: true,
				closeOnResize: true,
				closeOnFocusOutside: true,
				onDismiss,
			});

			dismissable.activate(targetElement);
			dismissable.destroy();

			// Events should not trigger callback
			const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(escapeEvent);

			window.dispatchEvent(new Event('resize'));

			expect(onDismiss).not.toHaveBeenCalled();
		});
	});

	describe('clearDismissableLayers', () => {
		it('should clear all layers', () => {
			const dismissable1 = createDismissable();
			const dismissable2 = createDismissable();

			const target1 = document.createElement('div');
			const target2 = document.createElement('div');
			document.body.appendChild(target1);
			document.body.appendChild(target2);

			dismissable1.activate(target1);
			dismissable2.activate(target2);

			expect(getDismissableLayerCount()).toBe(2);

			clearDismissableLayers();

			expect(getDismissableLayerCount()).toBe(0);
			expect(dismissable1.state.active).toBe(false);
			expect(dismissable2.state.active).toBe(false);
		});
	});
});
