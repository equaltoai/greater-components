import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	detectReducedMotion,
	createReducedMotionObserver,
	createMotionSafeAnimation,
	staticAlternative,
	instantTransition,
	getTransitionCSS,
	getAnimationCSS,
	motionSafe,
	FADE_IN,
} from '../../src/utils/reducedMotion';

describe('reducedMotion Utils', () => {
	let matchMediaMock: ReturnType<typeof vi.fn>;
	let addEventListenerMock: ReturnType<typeof vi.fn>;
	let removeEventListenerMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		addEventListenerMock = vi.fn();
		removeEventListenerMock = vi.fn();
		matchMediaMock = vi.fn().mockReturnValue({
			matches: false,
			addEventListener: addEventListenerMock,
			removeEventListener: removeEventListenerMock,
		});

		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: matchMediaMock,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('detectReducedMotion', () => {
		it('returns true when preference matches', () => {
			matchMediaMock.mockReturnValue({ matches: true });
			expect(detectReducedMotion()).toBe(true);
			expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
		});

		it('returns false when preference does not match', () => {
			matchMediaMock.mockReturnValue({ matches: false });
			expect(detectReducedMotion()).toBe(false);
		});

		it('returns false if window is undefined', () => {
			const originalWindow = global.window;
			// @ts-ignore - Mocking read-only property for testing purposes
			delete global.window;
			expect(detectReducedMotion()).toBe(false);
			global.window = originalWindow;
		});
	});

	describe('createReducedMotionObserver', () => {
		it('notifies on change', () => {
			const callback = vi.fn();
			let changeHandler: (e: any) => void = () => {};
			addEventListenerMock.mockImplementation((event, handler) => {
				if (event === 'change') changeHandler = handler;
			});

			const cleanup = createReducedMotionObserver(callback);

			// Simulate change to true
			changeHandler({ matches: true });
			expect(callback).toHaveBeenCalledWith(true);

			cleanup();
			expect(removeEventListenerMock).toHaveBeenCalled();
		});
	});

	describe('createMotionSafeAnimation', () => {
		it('returns normal animation when reduced motion is false', () => {
			matchMediaMock.mockReturnValue({ matches: false });
			const result = createMotionSafeAnimation({
				duration: 300,
				easing: 'ease',
				properties: { opacity: '1' },
			});

			expect(result.duration).toBe(300);
			expect(result.isReduced).toBe(false);
			expect(result.transition).toContain('opacity 300ms ease');
		});

		it('returns instant animation when reduced motion is true and behavior is instant', () => {
			matchMediaMock.mockReturnValue({ matches: true });
			const result = createMotionSafeAnimation({
				duration: 300,
				easing: 'ease',
				properties: { opacity: '1' },
				reducedMotionBehavior: 'instant',
			});

			expect(result.duration).toBe(0);
			expect(result.isReduced).toBe(true);
			expect(result.transition).toBe('none');
		});

		it('returns subtle animation when reduced motion is true and behavior is subtle', () => {
			matchMediaMock.mockReturnValue({ matches: true });
			const result = createMotionSafeAnimation({
				duration: 300,
				easing: 'ease',
				properties: { opacity: '1' },
				reducedMotionBehavior: 'subtle',
			});

			expect(result.duration).toBe(50);
			expect(result.isReduced).toBe(true);
			expect(result.transition).toContain('50ms');
		});
	});

	describe('staticAlternative', () => {
		it('returns animated value normally', () => {
			matchMediaMock.mockReturnValue({ matches: false });
			expect(staticAlternative('animated', 'static')).toBe('animated');
		});

		it('returns static value when reduced motion', () => {
			matchMediaMock.mockReturnValue({ matches: true });
			expect(staticAlternative('animated', 'static')).toBe('static');
		});
	});

	describe('instantTransition', () => {
		it('returns duration normally', () => {
			matchMediaMock.mockReturnValue({ matches: false });
			expect(instantTransition(500)).toBe(500);
		});

		it('returns 0 when reduced motion', () => {
			matchMediaMock.mockReturnValue({ matches: true });
			expect(instantTransition(500)).toBe(0);
		});
	});

	describe('getTransitionCSS', () => {
		it('returns CSS string normally', () => {
			matchMediaMock.mockReturnValue({ matches: false });
			expect(getTransitionCSS('opacity', 200)).toBe('opacity 200ms ease-out');
		});

		it('returns none when reduced motion', () => {
			matchMediaMock.mockReturnValue({ matches: true });
			expect(getTransitionCSS('opacity', 200)).toBe('none');
		});
	});

	describe('getAnimationCSS', () => {
		it('returns CSS string normally', () => {
			matchMediaMock.mockReturnValue({ matches: false });
			expect(getAnimationCSS('fade', 200)).toBe('fade 200ms ease-out 1');
		});

		it('returns none when reduced motion', () => {
			matchMediaMock.mockReturnValue({ matches: true });
			expect(getAnimationCSS('fade', 200)).toBe('none');
		});
	});

	describe('motionSafe Svelte Action', () => {
		it('applies styles and updates', () => {
			matchMediaMock.mockReturnValue({
				matches: false,
				addEventListener: addEventListenerMock,
				removeEventListener: removeEventListenerMock,
			});
			const node = document.createElement('div');
			node.style.setProperty = vi.fn();

			const action = motionSafe(node, { animation: FADE_IN });

			expect(node.style.transition).toContain('opacity');
			expect(node.style.setProperty).toHaveBeenCalledWith('opacity', '1');

			// Update
			action.update({ animation: FADE_IN, active: false });
			expect(node.style.transition).toBe('');

			action.destroy();
		});
	});
});
