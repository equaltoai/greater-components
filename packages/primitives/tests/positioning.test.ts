// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	calculatePosition,
	getScrollParent,
	createPositionObserver,
	type PositionConfig,
} from '../src/components/Menu/positioning';

describe('Menu Positioning', () => {
	// Mock window dimensions
	beforeEach(() => {
		vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const triggerRect = {
		left: 100,
		top: 100,
		right: 200,
		bottom: 140,
		width: 100,
		height: 40,
	} as DOMRect;

	const contentRect = {
		width: 200,
		height: 300,
	} as DOMRect;

	describe('calculatePosition', () => {
		// Use a centered trigger for basic tests to avoid edge overflows
		const centerTrigger = {
			left: 400,
			top: 400,
			right: 500,
			bottom: 440,
			width: 100,
			height: 40,
		} as DOMRect;

		it('positions bottom-start correctly', () => {
			const config: PositionConfig = {
				triggerRect: centerTrigger,
				contentRect,
				placement: 'bottom-start',
				offset: 8,
			};
			const pos = calculatePosition(config);
			expect(pos).toEqual({
				x: 400,
				y: 440 + 8,
				placement: 'bottom-start',
			});
		});

		it('positions bottom-end correctly', () => {
			const config: PositionConfig = {
				triggerRect: centerTrigger,
				contentRect,
				placement: 'bottom-end',
				offset: 8,
			};
			const pos = calculatePosition(config);
			expect(pos).toEqual({
				x: 500 - 200, // 300
				y: 440 + 8,
				placement: 'bottom-end',
			});
		});

		it('positions top-start correctly', () => {
			const config: PositionConfig = {
				triggerRect: centerTrigger,
				contentRect,
				placement: 'top-start',
				offset: 8,
			};
			const pos = calculatePosition(config);
			expect(pos).toEqual({
				x: 400,
				y: 400 - 300 - 8, // 92
				placement: 'top-start',
			});
		});

		it('positions top-end correctly', () => {
			const config: PositionConfig = {
				triggerRect: centerTrigger,
				contentRect,
				placement: 'top-end',
				offset: 8,
			};
			const pos = calculatePosition(config);
			expect(pos).toEqual({
				x: 500 - 200, // 300
				y: 400 - 300 - 8, // 92
				placement: 'top-end',
			});
		});

		it('flips to top if bottom overflows', () => {
			// Place trigger at bottom of screen
			const bottomTrigger = { ...triggerRect, top: 700, bottom: 740, left: 400, right: 500 };
			const config: PositionConfig = {
				triggerRect: bottomTrigger,
				contentRect, // height 300
				placement: 'bottom-start',
				offset: 8,
			};
			// 740 + 8 + 300 = 1048 > 800 (overflows)
			// Flip to top: 700 - 300 - 8 = 392 (fits)
			const pos = calculatePosition(config);
			expect(pos.y).toBe(392);
			expect(pos.placement).toBe('top-start');
		});

		it('flips to bottom if top overflows', () => {
			// Place trigger at top of screen
			const topTrigger = { ...triggerRect, top: 50, bottom: 90, left: 400, right: 500 };
			const config: PositionConfig = {
				triggerRect: topTrigger,
				contentRect, // height 300
				placement: 'top-start',
				offset: 8,
			};
			// 50 - 300 - 8 = -258 (overflows)
			// Flip to bottom: 90 + 8 = 98 (fits)
			const pos = calculatePosition(config);
			expect(pos.y).toBe(98);
			expect(pos.placement).toBe('bottom-start');
		});

		it('adjusts horizontal position if overflows right', () => {
			// Trigger near right edge
			const rightTrigger = { ...triggerRect, left: 900, right: 1000, top: 400, bottom: 440 };
			const config: PositionConfig = {
				triggerRect: rightTrigger,
				contentRect, // width 200
				placement: 'bottom-start',
				offset: 8,
			};
			// x = 900. 900 + 200 = 1100 > 1000.
			// Should clamp to 1000 - 200 - margin(8) = 792
			const pos = calculatePosition(config);
			expect(pos.x).toBe(792);
			// Should also flip alignment if applicable? Logic says:
			// if (wouldOverflowRight) ... if (finalPlacement.endsWith('-start')) replace with '-end'
			expect(pos.placement).toBe('bottom-end');
		});

		it('adjusts horizontal position if overflows left', () => {
			// Trigger near left edge with end alignment
			const leftTrigger = { ...triggerRect, left: 0, right: 100, top: 400, bottom: 440 };
			const config: PositionConfig = {
				triggerRect: leftTrigger,
				contentRect, // width 200
				placement: 'bottom-end',
				offset: 8,
			};
			// x = 100 - 200 = -100. Overflows left.
			// Should clamp to margin (8)
			const pos = calculatePosition(config);
			expect(pos.x).toBe(8);
			expect(pos.placement).toBe('bottom-start');
		});
	});

	describe('getScrollParent', () => {
		it('returns null if no scroll parent', () => {
			const div = document.createElement('div');
			document.body.appendChild(div);
			expect(getScrollParent(div)).toBeNull(); // body is parent, but typically not counted unless styled?
			document.body.removeChild(div);
		});

		it('returns scroll parent', () => {
			const parent = document.createElement('div');
			parent.style.overflow = 'auto';
			const child = document.createElement('div');
			parent.appendChild(child);
			document.body.appendChild(parent);

			expect(getScrollParent(child)).toBe(parent);
			document.body.removeChild(parent);
		});
	});

	describe('createPositionObserver', () => {
		it('sets up observers and returns cleanup', () => {
			const trigger = document.createElement('div');
			const onUpdate = vi.fn();

			// Mock ResizeObserver
			const observe = vi.fn();
			const disconnect = vi.fn();
			global.ResizeObserver = vi.fn().mockImplementation(function () {
				return {
					observe,
					disconnect,
				};
			});

			const addEventListener = vi.spyOn(window, 'addEventListener');
			const removeEventListener = vi.spyOn(window, 'removeEventListener');

			const cleanup = createPositionObserver(trigger, onUpdate);

			expect(global.ResizeObserver).toHaveBeenCalled();
			expect(observe).toHaveBeenCalledWith(document.body);
			expect(addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
				passive: true,
			});
			expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), {
				passive: true,
			});

			cleanup();

			expect(disconnect).toHaveBeenCalled();
			expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
			expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
		});
	});
});
