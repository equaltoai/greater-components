import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTooltip } from '../src/primitives/tooltip';
import type { TooltipPlacement } from '../src/primitives/tooltip';

describe('Tooltip Positioning', () => {
	let triggerEl: HTMLButtonElement;
	let contentEl: HTMLDivElement;
	let tooltip: ReturnType<typeof createTooltip>;

	beforeEach(() => {
		vi.useFakeTimers();
		triggerEl = document.createElement('button');
		contentEl = document.createElement('div');
		document.body.appendChild(triggerEl);
		document.body.appendChild(contentEl);

		// Mock getBoundingClientRect for trigger
		triggerEl.getBoundingClientRect = vi.fn(() => ({
			top: 500,
			left: 500,
			right: 600,
			bottom: 550,
			width: 100,
			height: 50,
			x: 500,
			y: 500,
			toJSON: () => {},
		}));

		// Mock getBoundingClientRect for tooltip content
		contentEl.getBoundingClientRect = vi.fn(() => ({
			top: 0,
			left: 0,
			right: 200,
			bottom: 100,
			width: 200,
			height: 100,
			x: 0,
			y: 0,
			toJSON: () => {},
		}));

		// Mock window dimensions
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 1920,
		});
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 1080,
		});
	});

	afterEach(() => {
		document.body.removeChild(triggerEl);
		document.body.removeChild(contentEl);
		vi.restoreAllMocks();
	});

	function setupTooltip(placement: TooltipPlacement, smartPositioning = false) {
		tooltip = createTooltip({
			placement,
			smartPositioning,
			offset: 10,
			initialOpen: true,
		});
		tooltip.actions.trigger(triggerEl);
		tooltip.actions.content(contentEl);

		// Force update position
		tooltip.helpers.updatePosition();
		return tooltip;
	}

	describe('Standard Positioning', () => {
		it('should position top', () => {
			const t = setupTooltip('top');
			// Trigger center x: 500 + 50 = 550
			// Tooltip width: 200 -> x = 550 - 100 = 450
			// Trigger top: 500
			// Tooltip height: 100, offset: 10 -> y = 500 - 100 - 10 = 390
			expect(t.state.position).toEqual({ x: 450, y: 390 });
		});

		it('should position top-start', () => {
			const t = setupTooltip('top-start');
			// Trigger left: 500 -> x = 500
			// y = 390 (same as top)
			expect(t.state.position).toEqual({ x: 500, y: 390 });
		});

		it('should position top-end', () => {
			const t = setupTooltip('top-end');
			// Trigger right: 600
			// Tooltip width: 200 -> x = 600 - 200 = 400
			// y = 390 (same as top)
			expect(t.state.position).toEqual({ x: 400, y: 390 });
		});

		it('should position bottom', () => {
			const t = setupTooltip('bottom');
			// x = 450 (same as top)
			// Trigger bottom: 550, offset: 10 -> y = 550 + 10 = 560
			expect(t.state.position).toEqual({ x: 450, y: 560 });
		});

		it('should position bottom-start', () => {
			const t = setupTooltip('bottom-start');
			// x = 500 (same as top-start)
			// y = 560 (same as bottom)
			expect(t.state.position).toEqual({ x: 500, y: 560 });
		});

		it('should position bottom-end', () => {
			const t = setupTooltip('bottom-end');
			// x = 400 (same as top-end)
			// y = 560 (same as bottom)
			expect(t.state.position).toEqual({ x: 400, y: 560 });
		});

		it('should position left', () => {
			const t = setupTooltip('left');
			// Trigger left: 500, offset: 10 -> x = 500 - 200 - 10 = 290
			// Trigger center y: 500 + 25 = 525
			// Tooltip height: 100 -> y = 525 - 50 = 475
			expect(t.state.position).toEqual({ x: 290, y: 475 });
		});

		it('should position left-start', () => {
			const t = setupTooltip('left-start');
			// x = 290 (same as left)
			// Trigger top: 500 -> y = 500
			expect(t.state.position).toEqual({ x: 290, y: 500 });
		});

		it('should position left-end', () => {
			const t = setupTooltip('left-end');
			// x = 290 (same as left)
			// Trigger bottom: 550 -> y = 550 - 100 = 450
			expect(t.state.position).toEqual({ x: 290, y: 450 });
		});

		it('should position right', () => {
			const t = setupTooltip('right');
			// Trigger right: 600, offset: 10 -> x = 600 + 10 = 610
			// y = 475 (same as left)
			expect(t.state.position).toEqual({ x: 610, y: 475 });
		});

		it('should position right-start', () => {
			const t = setupTooltip('right-start');
			// x = 610
			// y = 500 (same as left-start)
			expect(t.state.position).toEqual({ x: 610, y: 500 });
		});

		it('should position right-end', () => {
			const t = setupTooltip('right-end');
			// x = 610
			// y = 450 (same as left-end)
			expect(t.state.position).toEqual({ x: 610, y: 450 });
		});
	});

	describe('Smart Positioning', () => {
		it('should flip right to left if right edge hit', () => {
			window.innerWidth = 700; // Trigger right is 600, tooltip width 200 -> needs 800+ space.
			// x would be 610, + 200 = 810 > 700

			const t = setupTooltip('right', true);

			// Should flip to left: x = 290
			expect(t.state.placement).toBe('left');
			expect(t.state.position.x).toBe(290);
		});

		it('should adjust if right edge hit but not flip (no space left either)', () => {
			// This case is tricky to mock perfectly with just innerWidth, assume flip takes precedence
			// But code has: if (x < margin) adjust to fit

			// Force right edge hit
			window.innerWidth = 650;
			// Normal right: 610

			const t = setupTooltip('top-start', true);
			// x = 500 + 200 = 700 > 650
			// Not a 'right' placement, so it adjusts
			// x = 650 - 200 - 8 = 442

			expect(t.state.position.x).toBe(442);
		});

		it('should flip left to right if left edge hit', () => {
			// Trigger at 100, 500
			triggerEl.getBoundingClientRect = vi.fn(() => ({
				top: 500,
				left: 100,
				right: 200,
				bottom: 550,
				width: 100,
				height: 50,
				x: 100,
				y: 500,
				toJSON: () => {},
			}));

			// Left placement would be: 100 - 200 - 10 = -110 < 8
			const t = setupTooltip('left', true);

			// Should flip to right: x = 200 + 10 = 210
			expect(t.state.placement).toBe('right');
			expect(t.state.position.x).toBe(210);
		});

		it('should flip bottom to top if bottom edge hit', () => {
			window.innerHeight = 600;
			// Trigger bottom 550. Tooltip needs 550 + 10 + 100 = 660 > 600

			const t = setupTooltip('bottom', true);

			// Should flip to top: y = 500 - 100 - 10 = 390
			expect(t.state.placement).toBe('top');
			expect(t.state.position.y).toBe(390);
		});

		it('should flip top to bottom if top edge hit', () => {
			// Trigger at 50, 50
			triggerEl.getBoundingClientRect = vi.fn(() => ({
				top: 50,
				left: 500,
				right: 600,
				bottom: 100,
				width: 100,
				height: 50,
				x: 500,
				y: 50,
				toJSON: () => {},
			}));

			// Top placement: 50 - 100 - 10 = -60 < 8

			const t = setupTooltip('top', true);

			// Should flip to bottom: y = 100 + 10 = 110
			expect(t.state.placement).toBe('bottom');
			expect(t.state.position.y).toBe(110);
		});
	});

	describe('Update on events', () => {
		it('should update position on scroll', () => {
			const t = setupTooltip('top');

			const initialY = t.state.position.y;

			// Change mock rect
			triggerEl.getBoundingClientRect = vi.fn(() => ({
				top: 600,
				left: 500,
				right: 600,
				bottom: 650,
				width: 100,
				height: 50,
				x: 500,
				y: 600,
				toJSON: () => {},
			}));

			window.dispatchEvent(new Event('scroll'));

			expect(t.state.position.y).not.toBe(initialY);
		});

		it('should update position on resize', () => {
			const t = setupTooltip('top');
			const initialY = t.state.position.y;

			// Change mock rect
			triggerEl.getBoundingClientRect = vi.fn(() => ({
				top: 600,
				left: 500,
				right: 600,
				bottom: 650,
				width: 100,
				height: 50,
				x: 500,
				y: 600,
				toJSON: () => {},
			}));

			window.dispatchEvent(new Event('resize'));

			expect(t.state.position.y).not.toBe(initialY);
		});
	});
});
