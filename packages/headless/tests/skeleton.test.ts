/**
 * Skeleton Primitive Tests
 *
 * Comprehensive test suite for the Skeleton headless primitive.
 * Tests loading states, animations, delays, and visibility control.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSkeleton } from '../src/primitives/skeleton';

describe('Skeleton Primitive', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should create with default config', () => {
			const skeleton = createSkeleton();

			expect(skeleton.state.loading).toBe(true);
			expect(skeleton.state.visible).toBe(true);
			expect(skeleton.state.animation).toBe('pulse');
			expect(skeleton.state.variant).toBe('text');
			expect(skeleton.state.width).toBe('100%');
			expect(skeleton.state.height).toBe('1em');
			expect(skeleton.state.rows).toBe(1);
			expect(skeleton.state.duration).toBe(1500);
			expect(skeleton.state.class).toBe('');
		});

		it('should initialize with custom config', () => {
			const skeleton = createSkeleton({
				loading: false,
				animation: 'wave',
				variant: 'circular',
				width: 200,
				height: 200,
				rows: 3,
				duration: 2000,
				class: 'custom-skeleton',
			});

			expect(skeleton.state.loading).toBe(false);
			expect(skeleton.state.visible).toBe(false);
			expect(skeleton.state.animation).toBe('wave');
			expect(skeleton.state.variant).toBe('circular');
			expect(skeleton.state.width).toBe(200);
			expect(skeleton.state.height).toBe(200);
			expect(skeleton.state.rows).toBe(3);
			expect(skeleton.state.duration).toBe(2000);
			expect(skeleton.state.class).toBe('custom-skeleton');
		});

		it('should handle text variant default height', () => {
			const textSkeleton = createSkeleton({ variant: 'text' });
			const rectSkeleton = createSkeleton({ variant: 'rectangular' });

			expect(textSkeleton.state.height).toBe('1em');
			expect(rectSkeleton.state.height).toBe('100%');
		});
	});

	describe('Delay Behavior', () => {
		it('should show immediately with no delay', () => {
			const skeleton = createSkeleton({ loading: true, delay: 0 });

			expect(skeleton.state.visible).toBe(true);
		});

		it('should delay showing skeleton', () => {
			const skeleton = createSkeleton({ loading: true, delay: 500 });

			expect(skeleton.state.visible).toBe(false);

			vi.advanceTimersByTime(499);
			expect(skeleton.state.visible).toBe(false);

			vi.advanceTimersByTime(1);
			expect(skeleton.state.visible).toBe(true);
		});

		it('should not show if loading becomes false before delay', () => {
			const skeleton = createSkeleton({ loading: true, delay: 500 });

			expect(skeleton.state.visible).toBe(false);

			// Change loading to false before delay completes
			skeleton.helpers.hide();
			vi.advanceTimersByTime(500);

			expect(skeleton.state.visible).toBe(false);
		});

		it('should clear timeout on destroy', () => {
			const skeleton = createSkeleton({ loading: true, delay: 500 });
			const div = document.createElement('div');

			const action = skeleton.actions.skeleton(div);
			action.destroy();

			vi.advanceTimersByTime(500);
			// Should not crash and visible should remain false
			expect(skeleton.state.visible).toBe(false);
		});
	});

	describe('Animation Types', () => {
		let div: HTMLDivElement;

		beforeEach(() => {
			div = document.createElement('div');
			document.body.appendChild(div);
		});

		afterEach(() => {
			document.body.removeChild(div);
		});

		it('should set pulse animation', () => {
			const skeleton = createSkeleton({ animation: 'pulse' });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-animation')).toBe('pulse');

			action.destroy();
		});

		it('should set wave animation', () => {
			const skeleton = createSkeleton({ animation: 'wave' });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-animation')).toBe('wave');

			action.destroy();
		});

		it('should set no animation', () => {
			const skeleton = createSkeleton({ animation: 'none' });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-animation')).toBe('none');

			action.destroy();
		});

		it('should call onAnimationComplete on animation iteration', () => {
			const onAnimationComplete = vi.fn();
			const skeleton = createSkeleton({ animation: 'pulse', onAnimationComplete });
			const action = skeleton.actions.skeleton(div);

			div.dispatchEvent(new Event('animationiteration'));

			expect(onAnimationComplete).toHaveBeenCalled();

			action.destroy();
		});

		it('should not listen for animation events when animation is none', () => {
			const onAnimationComplete = vi.fn();
			const skeleton = createSkeleton({ animation: 'none', onAnimationComplete });
			const action = skeleton.actions.skeleton(div);

			div.dispatchEvent(new Event('animationiteration'));

			expect(onAnimationComplete).not.toHaveBeenCalled();

			action.destroy();
		});
	});

	describe('Variant Types', () => {
		let div: HTMLDivElement;

		beforeEach(() => {
			div = document.createElement('div');
			document.body.appendChild(div);
		});

		afterEach(() => {
			document.body.removeChild(div);
		});

		it('should set text variant', () => {
			const skeleton = createSkeleton({ variant: 'text' });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-variant')).toBe('text');

			action.destroy();
		});

		it('should set circular variant', () => {
			const skeleton = createSkeleton({ variant: 'circular' });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-variant')).toBe('circular');

			action.destroy();
		});

		it('should set rectangular variant', () => {
			const skeleton = createSkeleton({ variant: 'rectangular' });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-variant')).toBe('rectangular');

			action.destroy();
		});

		it('should set rounded variant', () => {
			const skeleton = createSkeleton({ variant: 'rounded' });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-variant')).toBe('rounded');

			action.destroy();
		});
	});

	describe('Dimensions', () => {
		let div: HTMLDivElement;

		beforeEach(() => {
			div = document.createElement('div');
			document.body.appendChild(div);
		});

		afterEach(() => {
			document.body.removeChild(div);
		});

		it('should set width as string', () => {
			const skeleton = createSkeleton({ width: '300px' });
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-width')).toBe('300px');

			action.destroy();
		});

		it('should set width as number', () => {
			const skeleton = createSkeleton({ width: 300 });
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-width')).toBe('300px');

			action.destroy();
		});

		it('should set height as string', () => {
			const skeleton = createSkeleton({ height: '2em' });
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-height')).toBe('2em');

			action.destroy();
		});

		it('should set height as number', () => {
			const skeleton = createSkeleton({ height: 150 });
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-height')).toBe('150px');

			action.destroy();
		});

		it('should set animation duration', () => {
			const skeleton = createSkeleton({ duration: 2500 });
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-duration')).toBe('2500ms');

			action.destroy();
		});
	});

	describe('Visibility Control', () => {
		let div: HTMLDivElement;

		beforeEach(() => {
			div = document.createElement('div');
			document.body.appendChild(div);
		});

		afterEach(() => {
			document.body.removeChild(div);
		});

		it('should update visible attribute', () => {
			const skeleton = createSkeleton({ loading: true });
			const action = skeleton.actions.skeleton(div);

			expect(div.getAttribute('data-visible')).toBe('true');

			skeleton.helpers.hide();
			vi.runAllTimers(); // Allow $effect to run

			expect(skeleton.state.visible).toBe(false);

			action.destroy();
		});

		it('should show skeleton', () => {
			const skeleton = createSkeleton({ loading: false });

			skeleton.helpers.show();

			expect(skeleton.state.loading).toBe(true);
			expect(skeleton.state.visible).toBe(true);
		});

		it('should hide skeleton', () => {
			const skeleton = createSkeleton({ loading: true });

			skeleton.helpers.hide();

			expect(skeleton.state.loading).toBe(false);
			expect(skeleton.state.visible).toBe(false);
		});

		it('should toggle skeleton', () => {
			const skeleton = createSkeleton({ loading: false });

			skeleton.helpers.toggle();
			expect(skeleton.state.loading).toBe(true);

			skeleton.helpers.toggle();
			expect(skeleton.state.loading).toBe(false);
		});

		it('should set loading state', () => {
			const skeleton = createSkeleton({ loading: false });

			skeleton.helpers.setLoading(true);
			expect(skeleton.state.loading).toBe(true);

			skeleton.helpers.setLoading(false);
			expect(skeleton.state.loading).toBe(false);
		});

		it('should handle show with delay', () => {
			const skeleton = createSkeleton({ loading: false, delay: 300 });

			skeleton.helpers.show();

			expect(skeleton.state.loading).toBe(true);
			expect(skeleton.state.visible).toBe(false);

			vi.advanceTimersByTime(300);

			expect(skeleton.state.visible).toBe(true);
		});

		it('should cancel delayed show when hiding', () => {
			const skeleton = createSkeleton({ loading: false, delay: 300 });

			skeleton.helpers.show();
			expect(skeleton.state.loading).toBe(true);
			expect(skeleton.state.visible).toBe(false);

			skeleton.helpers.hide();
			vi.advanceTimersByTime(300);

			expect(skeleton.state.loading).toBe(false);
			expect(skeleton.state.visible).toBe(false);
		});
	});

	describe('Multi-row Support', () => {
		it('should track number of rows', () => {
			const skeleton = createSkeleton({ rows: 5 });

			expect(skeleton.state.rows).toBe(5);
		});

		it('should support single row', () => {
			const skeleton = createSkeleton({ rows: 1 });

			expect(skeleton.state.rows).toBe(1);
		});

		it('should support many rows', () => {
			const skeleton = createSkeleton({ rows: 10 });

			expect(skeleton.state.rows).toBe(10);
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const skeleton = createSkeleton({ onDestroy });
			const div = document.createElement('div');

			const action = skeleton.actions.skeleton(div);
			action.destroy();

			expect(onDestroy).toHaveBeenCalled();
		});

		it('should clean up timers on destroy', () => {
			const skeleton = createSkeleton({ loading: true, delay: 500 });
			const div = document.createElement('div');

			const action = skeleton.actions.skeleton(div);
			action.destroy();

			// Advance time - should not crash
			vi.advanceTimersByTime(1000);

			expect(skeleton.state.visible).toBe(false);
		});

		it('should remove animation listeners on destroy', () => {
			const onAnimationComplete = vi.fn();
			const skeleton = createSkeleton({ animation: 'pulse', onAnimationComplete });
			const div = document.createElement('div');
			document.body.appendChild(div);

			const action = skeleton.actions.skeleton(div);
			action.destroy();

			div.dispatchEvent(new Event('animationiteration'));

			// Should not be called after destroy
			expect(onAnimationComplete).not.toHaveBeenCalled();

			document.body.removeChild(div);
		});
	});

	describe('CSS Custom Properties', () => {
		let div: HTMLDivElement;

		beforeEach(() => {
			div = document.createElement('div');
			document.body.appendChild(div);
		});

		afterEach(() => {
			document.body.removeChild(div);
		});

		it('should set all CSS custom properties', () => {
			const skeleton = createSkeleton({
				width: '250px',
				height: '180px',
				duration: 2000,
			});
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-width')).toBe('250px');
			expect(div.style.getPropertyValue('--skeleton-height')).toBe('180px');
			expect(div.style.getPropertyValue('--skeleton-duration')).toBe('2000ms');

			action.destroy();
		});

		it('should handle percentage values', () => {
			const skeleton = createSkeleton({
				width: '50%',
				height: '75%',
			});
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-width')).toBe('50%');
			expect(div.style.getPropertyValue('--skeleton-height')).toBe('75%');

			action.destroy();
		});

		it('should handle calc values', () => {
			const skeleton = createSkeleton({
				width: 'calc(100% - 20px)',
				height: 'calc(50vh - 10px)',
			});
			const action = skeleton.actions.skeleton(div);

			expect(div.style.getPropertyValue('--skeleton-width')).toBe('calc(100% - 20px)');
			expect(div.style.getPropertyValue('--skeleton-height')).toBe('calc(50vh - 10px)');

			action.destroy();
		});
	});

	describe('Edge Cases', () => {
		it('should handle zero delay', () => {
			const skeleton = createSkeleton({ loading: true, delay: 0 });

			expect(skeleton.state.visible).toBe(true);
		});

		it('should handle very long delay', () => {
			const skeleton = createSkeleton({ loading: true, delay: 10000 });

			expect(skeleton.state.visible).toBe(false);

			vi.advanceTimersByTime(9999);
			expect(skeleton.state.visible).toBe(false);

			vi.advanceTimersByTime(1);
			expect(skeleton.state.visible).toBe(true);
		});

		it('should handle rapid show/hide cycles', () => {
			const skeleton = createSkeleton({ loading: false });

			skeleton.helpers.show();
			skeleton.helpers.hide();
			skeleton.helpers.show();
			skeleton.helpers.hide();

			expect(skeleton.state.loading).toBe(false);
			expect(skeleton.state.visible).toBe(false);
		});

		it('should handle loading state without delay', () => {
			const skeleton = createSkeleton({ loading: true });

			expect(skeleton.state.visible).toBe(true);
		});

		it('should handle empty class string', () => {
			const skeleton = createSkeleton({ class: '' });

			expect(skeleton.state.class).toBe('');
		});

		it('should handle custom class', () => {
			const skeleton = createSkeleton({ class: 'my-skeleton' });

			expect(skeleton.state.class).toBe('my-skeleton');
		});
	});
});
