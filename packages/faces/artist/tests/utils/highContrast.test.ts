import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	detectHighContrastMode,
	createHighContrastObserver,
	calculateContrastRatio,
	ensureContrastRatio,
	getSufficientContrastColor,
	applyHighContrastStyles,
	preserveArtworkColors,
	removeColorPreservation,
	HIGH_CONTRAST_STYLES,
	HIGH_CONTRAST_DARK_STYLES,
} from '../../src/utils/highContrast';

describe('highContrast Utils', () => {
	// ========================================================================
	// Detection
	// ========================================================================
	describe('detectHighContrastMode', () => {
		let matchMediaMock: ReturnType<typeof vi.fn>;

		beforeEach(() => {
			matchMediaMock = vi.fn();
			Object.defineProperty(window, 'matchMedia', {
				writable: true,
				value: matchMediaMock,
			});
		});

		it('returns "none" when window is undefined', () => {
			const originalWindow = global.window;
			// @ts-ignore - simulating server-side
			delete global.window;

			expect(detectHighContrastMode()).toBe('none');

			global.window = originalWindow;
		});

		it('detects forced-colors (custom)', () => {
			matchMediaMock.mockImplementation((query) => ({
				matches: query === '(forced-colors: active)',
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}));

			expect(detectHighContrastMode()).toBe('custom');
		});

		it('detects prefers-contrast: more', () => {
			matchMediaMock.mockImplementation((query) => ({
				matches: query === '(prefers-contrast: more)',
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}));

			expect(detectHighContrastMode()).toBe('more');
		});

		it('detects prefers-contrast: less', () => {
			matchMediaMock.mockImplementation((query) => ({
				matches: query === '(prefers-contrast: less)',
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}));

			expect(detectHighContrastMode()).toBe('less');
		});

		it('returns "none" when no preference matches', () => {
			matchMediaMock.mockImplementation(() => ({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}));

			expect(detectHighContrastMode()).toBe('none');
		});
	});

	describe('createHighContrastObserver', () => {
		let matchMediaMock: ReturnType<typeof vi.fn>;
		const addEventListenerMock = vi.fn();
		const removeEventListenerMock = vi.fn();

		beforeEach(() => {
			matchMediaMock = vi.fn().mockReturnValue({
				matches: false,
				addEventListener: addEventListenerMock,
				removeEventListener: removeEventListenerMock,
			});
			Object.defineProperty(window, 'matchMedia', {
				writable: true,
				value: matchMediaMock,
			});
			addEventListenerMock.mockClear();
			removeEventListenerMock.mockClear();
		});

		it('registers listeners for all contrast queries', () => {
			const callback = vi.fn();
			createHighContrastObserver(callback);

			expect(matchMediaMock).toHaveBeenCalledWith('(forced-colors: active)');
			expect(matchMediaMock).toHaveBeenCalledWith('(prefers-contrast: more)');
			expect(matchMediaMock).toHaveBeenCalledWith('(prefers-contrast: less)');
			expect(addEventListenerMock).toHaveBeenCalledTimes(3);
		});

		it('unsubscribes on cleanup', () => {
			const callback = vi.fn();
			const cleanup = createHighContrastObserver(callback);

			cleanup();

			expect(removeEventListenerMock).toHaveBeenCalledTimes(3);
		});

		it('calls callback when media query changes', () => {
			let changeHandler: (e: any) => void = () => {};
			addEventListenerMock.mockImplementation((event, handler) => {
				if (event === 'change') changeHandler = handler;
			});

			const callback = vi.fn();
			createHighContrastObserver(callback);

			// Simulate change
			changeHandler({});
			expect(callback).toHaveBeenCalled();
		});

		it('returns no-op function when window is undefined', () => {
			const originalWindow = global.window;
			// @ts-ignore - Simulate server-side by deleting window
			delete global.window;

			const cleanup = createHighContrastObserver(() => {});
			expect(typeof cleanup).toBe('function');
			cleanup(); // Should not throw

			global.window = originalWindow;
		});
	});

	// ========================================================================
	// Contrast Calculation
	// ========================================================================
	describe('calculateContrastRatio', () => {
		it('calculates ratio correctly for black and white', () => {
			expect(calculateContrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
			expect(calculateContrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 1);
		});

		it('calculates ratio for identical colors', () => {
			expect(calculateContrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
			expect(calculateContrastRatio('#000000', '#000000')).toBe(1);
		});

		it('handles 3-digit hex codes', () => {
			expect(calculateContrastRatio('#000', '#FFF')).toBeCloseTo(21, 1);
		});

		it('handles rgb strings', () => {
			expect(calculateContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBeCloseTo(21, 1);
		});

		it('returns 0 for invalid colors', () => {
			expect(calculateContrastRatio('invalid', '#FFFFFF')).toBe(0);
			expect(calculateContrastRatio('#000000', 'invalid')).toBe(0);
		});
	});

	describe('ensureContrastRatio', () => {
		it('returns true if ratio meets requirements', () => {
			// Black on white is 21:1, passes both
			expect(ensureContrastRatio('#000000', '#FFFFFF')).toBe(true);
			expect(ensureContrastRatio('#000000', '#FFFFFF', true)).toBe(true);
		});

		it('validates normal text (4.5:1)', () => {
			// #777 on white is approx 4.5:1
			expect(ensureContrastRatio('#767676', '#FFFFFF')).toBe(true); // 4.54:1
			expect(ensureContrastRatio('#777777', '#FFFFFF')).toBe(false); // 4.47:1
		});

		it('validates large text (3:1)', () => {
			// #949494 on white is approx 3:1
			expect(ensureContrastRatio('#949494', '#FFFFFF', true)).toBe(true); // 3.03:1
			expect(ensureContrastRatio('#959595', '#FFFFFF', true)).toBe(false); // 2.99:1
		});
	});

	describe('getSufficientContrastColor', () => {
		it('suggests black for light backgrounds', () => {
			expect(getSufficientContrastColor('#FFFFFF')).toBe('#000000');
			expect(getSufficientContrastColor('#CCCCCC')).toBe('#000000');
		});

		it('suggests white for dark backgrounds', () => {
			expect(getSufficientContrastColor('#000000')).toBe('#ffffff');
			expect(getSufficientContrastColor('#333333')).toBe('#ffffff');
		});

		it('handles fallback for invalid background', () => {
			expect(getSufficientContrastColor('invalid', true)).toBe('#ffffff');
			expect(getSufficientContrastColor('invalid', false)).toBe('#000000');
		});
	});

	// ========================================================================
	// Style Application
	// ========================================================================
	describe('applyHighContrastStyles', () => {
		beforeEach(() => {
			document.head.innerHTML = '';
			document.documentElement.classList.remove('gr-high-contrast');
			document.documentElement.removeAttribute('data-gr-high-contrast');
		});

		it('applies styles to document', () => {
			const cleanup = applyHighContrastStyles();

			expect(document.documentElement.classList.contains('gr-high-contrast')).toBe(true);
			expect(document.documentElement.getAttribute('data-gr-high-contrast')).toBe('light');
			expect(document.getElementById('gr-high-contrast-styles')).toBeNull();

			cleanup();
			expect(document.documentElement.classList.contains('gr-high-contrast')).toBe(false);
			expect(document.documentElement.getAttribute('data-gr-high-contrast')).toBeNull();
		});

		it('supports custom styles', () => {
			applyHighContrastStyles(HIGH_CONTRAST_DARK_STYLES);

			expect(document.documentElement.getAttribute('data-gr-high-contrast')).toBe('dark');
			expect(document.getElementById('gr-high-contrast-styles')).toBeNull();
		});

		it('replaces existing styles if called again', () => {
			applyHighContrastStyles();
			expect(document.documentElement.getAttribute('data-gr-high-contrast')).toBe('light');

			applyHighContrastStyles(HIGH_CONTRAST_DARK_STYLES);
			expect(document.documentElement.getAttribute('data-gr-high-contrast')).toBe('dark');

			expect(document.getElementById('gr-high-contrast-styles')).toBeNull();
		});
	});

	describe('preserveArtworkColors', () => {
		it('sets data attribute', () => {
			const el = document.createElement('div');
			preserveArtworkColors(el);
			expect(el.getAttribute('data-preserve-colors')).toBe('true');
		});
	});

	describe('removeColorPreservation', () => {
		it('removes data attribute', () => {
			const el = document.createElement('div');
			el.setAttribute('data-preserve-colors', 'true');
			removeColorPreservation(el);
			expect(el.hasAttribute('data-preserve-colors')).toBe(false);
		});
	});
});
