// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { smoothThemeTransition, createSmoothThemeToggle } from '../src/utils/smoothThemeTransition';

describe('smoothThemeTransition', () => {
	let originalMatchMedia: any;

	beforeEach(() => {
		// Mock window.matchMedia
		originalMatchMedia = window.matchMedia;
		window.matchMedia = vi.fn().mockReturnValue({
			matches: false,
		});

		// Clean up classes on documentElement
		document.documentElement.className = '';
	});

	afterEach(() => {
		vi.restoreAllMocks();
		window.matchMedia = originalMatchMedia;
		document.documentElement.className = '';
		const style = document.getElementById('gr-theme-transition-style');
		if (style) style.remove();
	});

	it('should skip transition if running on server (no document)', async () => {
		// Simulate server environment temporarily
		const originalDocument = global.document;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		delete global.document;

		const callback = vi.fn();
		await smoothThemeTransition(callback);
		expect(callback).toHaveBeenCalled();

		// Restore document
		global.document = originalDocument;
	});

	it('should skip transition if prefers-reduced-motion is true', async () => {
		window.matchMedia = vi.fn().mockReturnValue({
			matches: true, // Reduced motion
		});

		const callback = vi.fn();
		await smoothThemeTransition(callback);
		expect(callback).toHaveBeenCalled();
		expect(document.documentElement.classList.contains('gr-theme-transitioning')).toBe(false);
	});

	it('should apply transition class, run callback, then cleanup', async () => {
		const callback = vi.fn();

		// Use a small duration for real timers
		const duration = 50;
		const promise = smoothThemeTransition(callback, { duration });

		// Check if class added to REAL documentElement
		expect(document.documentElement.classList.contains('gr-theme-transitioning')).toBe(true);

		// No runtime <style> injection in strict CSP mode
		expect(document.getElementById('gr-theme-transition-style')).toBeFalsy();

		expect(callback).toHaveBeenCalled();

		await promise;

		// Check cleanup
		expect(document.documentElement.classList.contains('gr-theme-transitioning')).toBe(false);
	});

	it('should create a theme toggle function', async () => {
		const getTheme = vi.fn().mockReturnValue('light');
		const setTheme = vi.fn();
		const toggle = createSmoothThemeToggle(getTheme, setTheme, ['light', 'dark'], { duration: 10 });

		await toggle();

		expect(getTheme).toHaveBeenCalled();
		expect(setTheme).toHaveBeenCalledWith('dark');
	});

	it('should cycle through multiple themes', async () => {
		const getTheme = vi.fn().mockReturnValue('dark');
		const setTheme = vi.fn();
		const toggle = createSmoothThemeToggle(getTheme, setTheme, ['light', 'dark', 'system'], {
			duration: 10,
		});

		await toggle();

		expect(setTheme).toHaveBeenCalledWith('system');
	});
});
