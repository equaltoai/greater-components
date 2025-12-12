/**
 * Popover Positioning Behavior Tests
 *
 * Comprehensive test suite for the Popover headless behavior.
 * Tests positioning, flip/shift logic, and visibility management.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPopover, type PopoverPlacement } from '../src/behaviors/popover';

describe('Popover Behavior', () => {
	let referenceElement: HTMLDivElement;
	let floatingElement: HTMLDivElement;

	beforeEach(() => {
		// Mock viewport dimensions for consistent testing
		Object.defineProperty(document.documentElement, 'clientWidth', {
			value: 1024,
			writable: true,
		});
		Object.defineProperty(document.documentElement, 'clientHeight', {
			value: 768,
			writable: true,
		});

		// Create reference element
		referenceElement = document.createElement('div');
		referenceElement.style.cssText = `
			position: absolute;
			top: 200px;
			left: 200px;
			width: 100px;
			height: 50px;
		`;
		document.body.appendChild(referenceElement);

		// Create floating element
		floatingElement = document.createElement('div');
		floatingElement.style.cssText = `
			width: 80px;
			height: 40px;
		`;
		document.body.appendChild(floatingElement);

		// Mock getBoundingClientRect for predictable testing
		// Position reference in the middle of viewport so flip isn't triggered
		vi.spyOn(referenceElement, 'getBoundingClientRect').mockReturnValue({
			top: 200,
			left: 200,
			right: 300,
			bottom: 250,
			width: 100,
			height: 50,
			x: 200,
			y: 200,
			toJSON: () => ({}),
		});

		vi.spyOn(floatingElement, 'getBoundingClientRect').mockReturnValue({
			top: 0,
			left: 0,
			right: 80,
			bottom: 40,
			width: 80,
			height: 40,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		});
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should create with default config', () => {
			const popover = createPopover();

			expect(popover.state.reference).toBeNull();
			expect(popover.state.floating).toBeNull();
			expect(popover.state.position).toBeNull();
			expect(popover.state.visible).toBe(false);
		});

		it('should accept custom config', () => {
			const onPositionChange = vi.fn();
			const popover = createPopover({
				placement: 'top',
				offset: 16,
				flip: false,
				shift: false,
				onPositionChange,
			});

			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);
			popover.show();

			expect(onPositionChange).toHaveBeenCalled();
		});
	});

	describe('setReference', () => {
		it('should set reference element', () => {
			const popover = createPopover();

			popover.setReference(referenceElement);

			expect(popover.state.reference).toBe(referenceElement);
		});

		it('should update position when visible', () => {
			const popover = createPopover();
			popover.setFloating(floatingElement);
			popover.show();

			popover.setReference(referenceElement);

			expect(popover.state.position).not.toBeNull();
		});

		it('should allow setting null', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);

			popover.setReference(null);

			expect(popover.state.reference).toBeNull();
		});
	});

	describe('setFloating', () => {
		it('should set floating element', () => {
			const popover = createPopover();

			popover.setFloating(floatingElement);

			expect(popover.state.floating).toBe(floatingElement);
		});

		it('should update position when visible', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.show();

			popover.setFloating(floatingElement);

			expect(popover.state.position).not.toBeNull();
		});

		it('should allow setting null', () => {
			const popover = createPopover();
			popover.setFloating(floatingElement);

			popover.setFloating(null);

			expect(popover.state.floating).toBeNull();
		});
	});

	describe('show', () => {
		it('should show the popover', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			popover.show();

			expect(popover.state.visible).toBe(true);
		});

		it('should compute position on show', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			popover.show();

			expect(popover.state.position).not.toBeNull();
		});
	});

	describe('hide', () => {
		it('should hide the popover', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);
			popover.show();

			popover.hide();

			expect(popover.state.visible).toBe(false);
			expect(popover.state.position).toBeNull();
		});
	});

	describe('update', () => {
		it('should return null without reference', () => {
			const popover = createPopover();
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position).toBeNull();
		});

		it('should return null without floating', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);

			const position = popover.update();

			expect(position).toBeNull();
		});

		it('should compute position with both elements', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position).not.toBeNull();
			expect(position?.x).toBeDefined();
			expect(position?.y).toBeDefined();
		});

		it('should apply position to floating element', () => {
			const popover = createPopover({ strategy: 'absolute' });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			popover.update();

			expect(floatingElement.style.position).toBe('absolute');
			expect(floatingElement.style.left).toBeDefined();
			expect(floatingElement.style.top).toBeDefined();
		});

		it('should use fixed strategy when configured', () => {
			const popover = createPopover({ strategy: 'fixed' });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			popover.update();

			expect(floatingElement.style.position).toBe('fixed');
		});
	});

	describe('Placement', () => {
		const placements: PopoverPlacement[] = [
			'top',
			'top-start',
			'top-end',
			'bottom',
			'bottom-start',
			'bottom-end',
			'left',
			'left-start',
			'left-end',
			'right',
			'right-start',
			'right-end',
		];

		placements.forEach((placement) => {
			it(`should compute position with placement: ${placement}`, () => {
				// Disable flip and shift to test raw placement logic
				const popover = createPopover({ placement, flip: false, shift: false });
				popover.setReference(referenceElement);
				popover.setFloating(floatingElement);

				const position = popover.update();

				expect(position).not.toBeNull();
				// Without flip, placement should be preserved
				expect(position?.placement).toBe(placement);
			});
		});

		it('should position below reference for bottom placement', () => {
			// Disable flip to test bottom placement specifically
			const popover = createPopover({ placement: 'bottom', offset: 8, flip: false });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			// Reference bottom is 250, with 8px offset
			expect(position?.y).toBe(258);
		});

		it('should position above reference for top placement', () => {
			// Disable flip to test top placement specifically
			const popover = createPopover({ placement: 'top', offset: 8, flip: false });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			// Reference top is 200, minus floating height 40, minus 8px offset
			expect(position?.y).toBe(152);
		});

		it('should apply custom offset', () => {
			// Disable flip to test offset calculation
			const popover = createPopover({ placement: 'bottom', offset: 16, flip: false });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			// Reference bottom is 250, with 16px offset
			expect(position?.y).toBe(266);
		});
	});

	describe('Flip', () => {
		it('should flip when overflowing', () => {
			// Position reference near top of viewport
			vi.spyOn(referenceElement, 'getBoundingClientRect').mockReturnValue({
				top: 10,
				left: 200,
				right: 300,
				bottom: 60,
				width: 100,
				height: 50,
				x: 200,
				y: 10,
				toJSON: () => ({}),
			});

			const popover = createPopover({ placement: 'top', flip: true });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			// Should flip to bottom since there's not enough space on top
			expect(position?.flipped).toBe(true);
			expect(position?.placement).toBe('bottom');
		});

		it('should not flip when flip is disabled', () => {
			// Position reference near top of viewport
			vi.spyOn(referenceElement, 'getBoundingClientRect').mockReturnValue({
				top: 10,
				left: 200,
				right: 300,
				bottom: 60,
				width: 100,
				height: 50,
				x: 200,
				y: 10,
				toJSON: () => ({}),
			});

			const popover = createPopover({ placement: 'top', flip: false });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position?.flipped).toBe(false);
			expect(position?.placement).toBe('top');
		});
	});

	describe('Shift', () => {
		it('should shift when overflowing horizontally', () => {
			// Position reference at far left edge so floating element would overflow
			// Reference center at 20, floating (80px wide) centered would start at 20-40=-20
			// This would overflow the left viewport padding of 8
			vi.spyOn(referenceElement, 'getBoundingClientRect').mockReturnValue({
				top: 200,
				left: 0,
				right: 40,
				bottom: 250,
				width: 40,
				height: 50,
				x: 0,
				y: 200,
				toJSON: () => ({}),
			});

			const popover = createPopover({
				placement: 'bottom',
				shift: true,
				flip: false, // Disable flip to test shift independently
				viewportPadding: 8,
			});
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			// Should shift to stay within viewport
			expect(position?.shifted).toBe(true);
		});

		it('should not shift when shift is disabled', () => {
			// Position reference near left edge
			vi.spyOn(referenceElement, 'getBoundingClientRect').mockReturnValue({
				top: 200,
				left: 0,
				right: 100,
				bottom: 250,
				width: 100,
				height: 50,
				x: 0,
				y: 200,
				toJSON: () => ({}),
			});

			// Mock viewport
			Object.defineProperty(document.documentElement, 'clientWidth', { value: 800 });
			Object.defineProperty(document.documentElement, 'clientHeight', { value: 600 });

			const popover = createPopover({ placement: 'bottom', shift: false });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position?.shifted).toBe(false);
		});
	});

	describe('Arrow Position', () => {
		it('should compute arrow position for bottom placement', () => {
			const popover = createPopover({ placement: 'bottom' });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position?.arrow).toBeDefined();
			expect(position?.arrow?.y).toBe(0);
		});

		it('should compute arrow position for top placement', () => {
			const popover = createPopover({ placement: 'top' });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position?.arrow).toBeDefined();
			expect(position?.arrow?.y).toBe(40); // floating height
		});
	});

	describe('updateConfig', () => {
		it('should update configuration', () => {
			const popover = createPopover({ placement: 'bottom' });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);
			popover.show();

			popover.updateConfig({ placement: 'top' });

			// Position should be recalculated with new placement
			expect(popover.state.position?.placement).toBe('top');
		});

		it('should update position callback', () => {
			const onPositionChange1 = vi.fn();
			const onPositionChange2 = vi.fn();

			const popover = createPopover({ onPositionChange: onPositionChange1 });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);
			popover.show();

			expect(onPositionChange1).toHaveBeenCalled();

			popover.updateConfig({ onPositionChange: onPositionChange2 });

			// Force update
			popover.update();

			expect(onPositionChange2).toHaveBeenCalled();
		});

		it('should not update position if not visible', () => {
			const popover = createPopover({ placement: 'bottom' });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			expect(popover.state.position).toBeNull();

			popover.updateConfig({ placement: 'top' });

			expect(popover.state.position).toBeNull();
		});
	});

	describe('Boundary', () => {
		it('should use viewport as default boundary', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position).not.toBeNull();
		});

		it('should use custom element as boundary', () => {
			const boundaryElement = document.createElement('div');
			boundaryElement.style.cssText = `
				position: absolute;
				top: 0;
				left: 0;
				width: 500px;
				height: 500px;
			`;
			document.body.appendChild(boundaryElement);

			vi.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
				top: 0,
				left: 0,
				right: 500,
				bottom: 500,
				width: 500,
				height: 500,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			});

			const popover = createPopover({ boundary: boundaryElement });
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			const position = popover.update();

			expect(position).not.toBeNull();
		});
	});

	describe('destroy', () => {
		it('should clean up state', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);
			popover.show();

			popover.destroy();

			expect(popover.state.reference).toBeNull();
			expect(popover.state.floating).toBeNull();
			expect(popover.state.position).toBeNull();
			expect(popover.state.visible).toBe(false);
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid show/hide', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);

			popover.show();
			popover.hide();
			popover.show();
			popover.hide();

			expect(popover.state.visible).toBe(false);
		});

		it('should handle element changes while visible', () => {
			const popover = createPopover();
			popover.setReference(referenceElement);
			popover.setFloating(floatingElement);
			popover.show();

			const newFloating = document.createElement('div');
			newFloating.style.cssText = 'width: 100px; height: 50px;';
			document.body.appendChild(newFloating);

			vi.spyOn(newFloating, 'getBoundingClientRect').mockReturnValue({
				top: 0,
				left: 0,
				right: 100,
				bottom: 50,
				width: 100,
				height: 50,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			});

			popover.setFloating(newFloating);

			expect(popover.state.floating).toBe(newFloating);
			expect(popover.state.position).not.toBeNull();
		});
	});
});
