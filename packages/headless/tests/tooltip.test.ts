/**
 * Tooltip Primitive Tests
 * 
 * Comprehensive test suite for the Tooltip headless primitive.
 * Tests hover/focus behavior, positioning, delays, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTooltip } from '../src/primitives/tooltip';

describe('Tooltip Primitive', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should create with default config', () => {
			const tooltip = createTooltip();

			expect(tooltip.state.open).toBe(false);
			expect(tooltip.state.openDelay).toBe(300);
			expect(tooltip.state.closeDelay).toBe(0);
			expect(tooltip.state.placement).toBe('top');
			expect(tooltip.state.disabled).toBe(false);
		});

		it('should initialize with custom config', () => {
			const tooltip = createTooltip({
				openDelay: 500,
				closeDelay: 200,
				placement: 'bottom',
				disabled: true,
			});

			expect(tooltip.state.openDelay).toBe(500);
			expect(tooltip.state.closeDelay).toBe(200);
			expect(tooltip.state.placement).toBe('bottom');
			expect(tooltip.state.disabled).toBe(true);
		});

		it('should initialize as open', () => {
			const tooltip = createTooltip({ open: true });

			expect(tooltip.state.open).toBe(true);
		});
	});

	describe('Open and Close', () => {
		it('should open tooltip', () => {
			const tooltip = createTooltip();

			tooltip.helpers.open();

			expect(tooltip.state.open).toBe(true);
		});

		it('should close tooltip', () => {
			const tooltip = createTooltip({ open: true });

			tooltip.helpers.close();

			expect(tooltip.state.open).toBe(false);
		});

		it('should call onOpenChange when opened', () => {
			const onOpenChange = vi.fn();
			const tooltip = createTooltip({ onOpenChange });

			tooltip.helpers.open();

			expect(onOpenChange).toHaveBeenCalledWith(true);
		});

		it('should call onOpenChange when closed', () => {
			const onOpenChange = vi.fn();
			const tooltip = createTooltip({ open: true, onOpenChange });

			tooltip.helpers.close();

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not open when disabled', () => {
			const tooltip = createTooltip({ disabled: true });

			tooltip.helpers.open();

			expect(tooltip.state.open).toBe(false);
		});
	});

	describe('Hover Behavior', () => {
		let triggerEl: HTMLButtonElement;

		beforeEach(() => {
			triggerEl = document.createElement('button');
			document.body.appendChild(triggerEl);
		});

		afterEach(() => {
			document.body.removeChild(triggerEl);
		});

		it('should open on mouseenter', () => {
			const tooltip = createTooltip({ openDelay: 0 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));

			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});

		it('should close on mouseleave', () => {
			const tooltip = createTooltip({ open: true, closeDelay: 0 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseleave'));

			expect(tooltip.state.open).toBe(false);

			action.destroy();
		});

		it('should respect open delay', () => {
			const tooltip = createTooltip({ openDelay: 500 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));

			expect(tooltip.state.open).toBe(false);

			vi.advanceTimersByTime(499);
			expect(tooltip.state.open).toBe(false);

			vi.advanceTimersByTime(1);
			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});

		it('should respect close delay', () => {
			const tooltip = createTooltip({ open: true, closeDelay: 300 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseleave'));

			expect(tooltip.state.open).toBe(true);

			vi.advanceTimersByTime(299);
			expect(tooltip.state.open).toBe(true);

			vi.advanceTimersByTime(1);
			expect(tooltip.state.open).toBe(false);

			action.destroy();
		});

		it('should cancel open delay if mouse leaves before delay completes', () => {
			const tooltip = createTooltip({ openDelay: 500 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			expect(tooltip.state.open).toBe(false);

			vi.advanceTimersByTime(300);

			triggerEl.dispatchEvent(new MouseEvent('mouseleave'));

			vi.advanceTimersByTime(200);

			expect(tooltip.state.open).toBe(false);

			action.destroy();
		});
	});

	describe('Focus Behavior', () => {
		let triggerEl: HTMLButtonElement;

		beforeEach(() => {
			triggerEl = document.createElement('button');
			document.body.appendChild(triggerEl);
		});

		afterEach(() => {
			document.body.removeChild(triggerEl);
		});

		it('should open on focus', () => {
			const tooltip = createTooltip({ openDelay: 0 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new FocusEvent('focus'));

			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});

		it('should close on blur', () => {
			const tooltip = createTooltip({ open: true, closeDelay: 0 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new FocusEvent('blur'));

			expect(tooltip.state.open).toBe(false);

			action.destroy();
		});

		it('should respect open delay on focus', () => {
			const tooltip = createTooltip({ openDelay: 300 });
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new FocusEvent('focus'));

			expect(tooltip.state.open).toBe(false);

			vi.advanceTimersByTime(300);

			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});
	});

	describe('Content Action', () => {
		let contentEl: HTMLDivElement;

		beforeEach(() => {
			contentEl = document.createElement('div');
			document.body.appendChild(contentEl);
		});

		afterEach(() => {
			document.body.removeChild(contentEl);
		});

		it('should set role=tooltip', () => {
			const tooltip = createTooltip();
			const action = tooltip.actions.content(contentEl);

			expect(contentEl.getAttribute('role')).toBe('tooltip');

			action.destroy();
		});

		it('should set data-placement attribute', () => {
			const tooltip = createTooltip({ placement: 'bottom' });
			const action = tooltip.actions.content(contentEl);

			expect(contentEl.getAttribute('data-placement')).toBe('bottom');

			action.destroy();
		});

		it('should keep tooltip open on hover', () => {
			const tooltip = createTooltip({ open: true, closeDelay: 100 });
			const action = tooltip.actions.content(contentEl);

			contentEl.dispatchEvent(new MouseEvent('mouseenter'));

			vi.advanceTimersByTime(200);

			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});

		it('should close when mouse leaves content', () => {
			const tooltip = createTooltip({ open: true, closeDelay: 0 });
			const action = tooltip.actions.content(contentEl);

			contentEl.dispatchEvent(new MouseEvent('mouseleave'));

			expect(tooltip.state.open).toBe(false);

			action.destroy();
		});
	});

	describe('Placement', () => {
		it('should support all placement options', () => {
			const placements: Array<'top' | 'bottom' | 'left' | 'right'> = [
				'top',
				'bottom',
				'left',
				'right',
			];

			placements.forEach((placement) => {
				const tooltip = createTooltip({ placement });
				expect(tooltip.state.placement).toBe(placement);
			});
		});

		it('should update placement dynamically', () => {
			const tooltip = createTooltip({ placement: 'top' });
			const contentEl = document.createElement('div');
			const action = tooltip.actions.content(contentEl);

			expect(contentEl.getAttribute('data-placement')).toBe('top');

			tooltip.helpers.setPlacement('bottom');

			expect(tooltip.state.placement).toBe('bottom');
			expect(contentEl.getAttribute('data-placement')).toBe('bottom');

			action.destroy();
		});
	});

	describe('Disabled State', () => {
		it('should not open when disabled', () => {
			const tooltip = createTooltip({ disabled: true });
			const triggerEl = document.createElement('button');
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			vi.runAllTimers();

			expect(tooltip.state.open).toBe(false);

			action.destroy();
		});

		it('should close when becoming disabled', () => {
			const tooltip = createTooltip({ open: true });

			tooltip.helpers.setDisabled(true);

			expect(tooltip.state.open).toBe(false);
		});

		it('should re-enable tooltip', () => {
			const tooltip = createTooltip({ disabled: true });

			tooltip.helpers.setDisabled(false);

			const triggerEl = document.createElement('button');
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			vi.runAllTimers();

			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});
	});

	describe('Accessibility', () => {
		let triggerEl: HTMLButtonElement;
		let contentEl: HTMLDivElement;

		beforeEach(() => {
			triggerEl = document.createElement('button');
			contentEl = document.createElement('div');
			document.body.appendChild(triggerEl);
			document.body.appendChild(contentEl);
		});

		afterEach(() => {
			document.body.removeChild(triggerEl);
			document.body.removeChild(contentEl);
		});

		it('should set aria-describedby on trigger', () => {
			const tooltip = createTooltip();
			const triggerAction = tooltip.actions.trigger(triggerEl);
			const contentAction = tooltip.actions.content(contentEl);

			const contentId = contentEl.id;
			expect(triggerEl.getAttribute('aria-describedby')).toBe(contentId);

			triggerAction.destroy();
			contentAction.destroy();
		});

		it('should set role=tooltip on content', () => {
			const tooltip = createTooltip();
			const action = tooltip.actions.content(contentEl);

			expect(contentEl.getAttribute('role')).toBe('tooltip');

			action.destroy();
		});

		it('should be keyboard accessible', () => {
			const tooltip = createTooltip({ openDelay: 0 });
			const triggerAction = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new FocusEvent('focus'));

			expect(tooltip.state.open).toBe(true);

			triggerEl.dispatchEvent(new FocusEvent('blur'));

			expect(tooltip.state.open).toBe(false);

			triggerAction.destroy();
		});

		it('should generate unique IDs', () => {
			const tooltip1 = createTooltip();
			const tooltip2 = createTooltip();

			const content1 = document.createElement('div');
			const content2 = document.createElement('div');

			const action1 = tooltip1.actions.content(content1);
			const action2 = tooltip2.actions.content(content2);

			expect(content1.id).not.toBe(content2.id);

			action1.destroy();
			action2.destroy();
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const tooltip = createTooltip({ onDestroy });
			const triggerEl = document.createElement('button');

			const action = tooltip.actions.trigger(triggerEl);
			action.destroy();

			expect(onDestroy).toHaveBeenCalled();
		});

		it('should clean up event listeners', () => {
			const tooltip = createTooltip();
			const triggerEl = document.createElement('button');
			document.body.appendChild(triggerEl);

			const action = tooltip.actions.trigger(triggerEl);
			action.destroy();

			const stateBefore = tooltip.state.open;

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			vi.runAllTimers();

			expect(tooltip.state.open).toBe(stateBefore);

			document.body.removeChild(triggerEl);
		});

		it('should clear timers on destroy', () => {
			const tooltip = createTooltip({ openDelay: 500 });
			const triggerEl = document.createElement('button');

			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));

			action.destroy();

			vi.advanceTimersByTime(500);

			expect(tooltip.state.open).toBe(false);
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid hover on/off', () => {
			const tooltip = createTooltip({ openDelay: 300, closeDelay: 100 });
			const triggerEl = document.createElement('button');
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			vi.advanceTimersByTime(100);
			triggerEl.dispatchEvent(new MouseEvent('mouseleave'));
			vi.advanceTimersByTime(50);
			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			vi.advanceTimersByTime(300);

			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});

		it('should handle open when already open', () => {
			const tooltip = createTooltip({ open: true });

			tooltip.helpers.open();

			expect(tooltip.state.open).toBe(true);
		});

		it('should handle close when already closed', () => {
			const tooltip = createTooltip({ open: false });

			tooltip.helpers.close();

			expect(tooltip.state.open).toBe(false);
		});

		it('should handle zero delays', () => {
			const tooltip = createTooltip({ openDelay: 0, closeDelay: 0 });
			const triggerEl = document.createElement('button');
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			expect(tooltip.state.open).toBe(true);

			triggerEl.dispatchEvent(new MouseEvent('mouseleave'));
			expect(tooltip.state.open).toBe(false);

			action.destroy();
		});

		it('should handle very long delays', () => {
			const tooltip = createTooltip({ openDelay: 10000 });
			const triggerEl = document.createElement('button');
			const action = tooltip.actions.trigger(triggerEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));

			vi.advanceTimersByTime(9999);
			expect(tooltip.state.open).toBe(false);

			vi.advanceTimersByTime(1);
			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});

		it('should handle multiple triggers', () => {
			const tooltip = createTooltip({ openDelay: 0 });
			const trigger1 = document.createElement('button');
			const trigger2 = document.createElement('button');

			const action1 = tooltip.actions.trigger(trigger1);
			const action2 = tooltip.actions.trigger(trigger2);

			trigger1.dispatchEvent(new MouseEvent('mouseenter'));
			expect(tooltip.state.open).toBe(true);

			trigger1.dispatchEvent(new MouseEvent('mouseleave'));
			expect(tooltip.state.open).toBe(false);

			trigger2.dispatchEvent(new MouseEvent('mouseenter'));
			expect(tooltip.state.open).toBe(true);

			action1.destroy();
			action2.destroy();
		});

		it('should handle switching between trigger and content hover', () => {
			const tooltip = createTooltip({ openDelay: 0, closeDelay: 100 });
			const triggerEl = document.createElement('button');
			const contentEl = document.createElement('div');

			const triggerAction = tooltip.actions.trigger(triggerEl);
			const contentAction = tooltip.actions.content(contentEl);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
			expect(tooltip.state.open).toBe(true);

			triggerEl.dispatchEvent(new MouseEvent('mouseleave'));
			contentEl.dispatchEvent(new MouseEvent('mouseenter'));

			vi.advanceTimersByTime(100);

			expect(tooltip.state.open).toBe(true);

			triggerAction.destroy();
			contentAction.destroy();
		});
	});

	describe('Configuration Updates', () => {
		it('should update open delay', () => {
			const tooltip = createTooltip({ openDelay: 300 });

			tooltip.helpers.setOpenDelay(500);

			expect(tooltip.state.openDelay).toBe(500);
		});

		it('should update close delay', () => {
			const tooltip = createTooltip({ closeDelay: 100 });

			tooltip.helpers.setCloseDelay(200);

			expect(tooltip.state.closeDelay).toBe(200);
		});

		it('should respect updated delays', () => {
			const tooltip = createTooltip({ openDelay: 300 });
			const triggerEl = document.createElement('button');
			const action = tooltip.actions.trigger(triggerEl);

			tooltip.helpers.setOpenDelay(500);

			triggerEl.dispatchEvent(new MouseEvent('mouseenter'));

			vi.advanceTimersByTime(400);
			expect(tooltip.state.open).toBe(false);

			vi.advanceTimersByTime(100);
			expect(tooltip.state.open).toBe(true);

			action.destroy();
		});
	});
});

