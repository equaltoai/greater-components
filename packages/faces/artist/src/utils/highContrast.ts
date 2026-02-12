/**
 * High Contrast Mode Utilities
 *
 * Detection and application of high contrast styles while preserving artwork visibility.
 * Implements REQ-A11Y-003 and REQ-A11Y-006.
 *
 * @module @equaltoai/greater-components-artist/utils/highContrast
 */

// ============================================================================
// High Contrast Detection
// ============================================================================

/**
 * High contrast mode types
 */
export type HighContrastMode = 'none' | 'more' | 'less' | 'custom';

/**
 * Detect if user prefers high contrast mode
 * Uses CSS media query prefers-contrast
 */
export function detectHighContrastMode(): HighContrastMode {
	if (typeof window === 'undefined') return 'none';

	// Check for forced-colors (Windows High Contrast)
	if (window.matchMedia('(forced-colors: active)').matches) {
		return 'custom';
	}

	// Check for prefers-contrast
	if (window.matchMedia('(prefers-contrast: more)').matches) {
		return 'more';
	}

	if (window.matchMedia('(prefers-contrast: less)').matches) {
		return 'less';
	}

	return 'none';
}

/**
 * Create observer for high contrast mode changes
 */
export function createHighContrastObserver(callback: (mode: HighContrastMode) => void): () => void {
	if (typeof window === 'undefined') return () => {};

	const queries = [
		window.matchMedia('(forced-colors: active)'),
		window.matchMedia('(prefers-contrast: more)'),
		window.matchMedia('(prefers-contrast: less)'),
	];

	const handleChange = () => {
		callback(detectHighContrastMode());
	};

	queries.forEach((query) => {
		query.addEventListener('change', handleChange);
	});

	return () => {
		queries.forEach((query) => {
			query.removeEventListener('change', handleChange);
		});
	};
}

// ============================================================================
// Contrast Ratio Calculations (REQ-A11Y-003)
// ============================================================================

/**
 * Parse color string to RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
	// Handle hex colors
	const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
	if (hexMatch && hexMatch[1] && hexMatch[2] && hexMatch[3]) {
		return {
			r: parseInt(hexMatch[1], 16),
			g: parseInt(hexMatch[2], 16),
			b: parseInt(hexMatch[3], 16),
		};
	}

	// Handle short hex
	const shortHexMatch = color.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
	if (shortHexMatch && shortHexMatch[1] && shortHexMatch[2] && shortHexMatch[3]) {
		return {
			r: parseInt(shortHexMatch[1] + shortHexMatch[1], 16),
			g: parseInt(shortHexMatch[2] + shortHexMatch[2], 16),
			b: parseInt(shortHexMatch[3] + shortHexMatch[3], 16),
		};
	}

	// Handle rgb/rgba
	const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
		return {
			r: parseInt(rgbMatch[1], 10),
			g: parseInt(rgbMatch[2], 10),
			b: parseInt(rgbMatch[3], 10),
		};
	}

	return null;
}

/**
 * Calculate relative luminance of a color
 * Per WCAG 2.1 formula
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
	const [rs, gs, bs] = [r, g, b].map((c) => {
		const sRGB = c / 255;
		return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
	}) as [number, number, number];
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns ratio as number (e.g., 4.5 for 4.5:1)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
	const rgb1 = parseColor(color1);
	const rgb2 = parseColor(color2);

	if (!rgb1 || !rgb2) return 0;

	const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
	const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);

	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA requirements
 * Normal text: 4.5:1, Large text: 3:1
 */
export function ensureContrastRatio(
	foreground: string,
	background: string,
	isLargeText = false
): boolean {
	const ratio = calculateContrastRatio(foreground, background);
	const requiredRatio = isLargeText ? 3 : 4.5;
	return ratio >= requiredRatio;
}

/**
 * Get suggested color with sufficient contrast
 */
export function getSufficientContrastColor(background: string, preferLight = true): string {
	const bgRgb = parseColor(background);
	if (!bgRgb) return preferLight ? '#ffffff' : '#000000';

	const bgLuminance = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

	// If background is dark, use light text; if light, use dark text
	if (bgLuminance > 0.179) {
		return '#000000';
	}
	return '#ffffff';
}

// ============================================================================
// High Contrast Style Application (REQ-A11Y-003)
// ============================================================================

/**
 * High contrast style overrides
 */
export interface HighContrastStyles {
	/** Text color */
	textColor: string;
	/** Background color */
	backgroundColor: string;
	/** Border color */
	borderColor: string;
	/** Link color */
	linkColor: string;
	/** Focus outline color */
	focusColor: string;
}

/**
 * Default high contrast styles
 */
export const HIGH_CONTRAST_STYLES: HighContrastStyles = {
	textColor: '#000000',
	backgroundColor: '#ffffff',
	borderColor: '#000000',
	linkColor: '#0000ee',
	focusColor: '#000000',
};

/**
 * Dark high contrast styles
 */
export const HIGH_CONTRAST_DARK_STYLES: HighContrastStyles = {
	textColor: '#ffffff',
	backgroundColor: '#000000',
	borderColor: '#ffffff',
	linkColor: '#ffff00',
	focusColor: '#ffffff',
};

let activeHighContrastToken: symbol | null = null;

/**
 * Apply high contrast styles to document
 * Preserves artwork colors per REQ-A11Y-003
 */
export function applyHighContrastStyles(
	styles: HighContrastStyles = HIGH_CONTRAST_STYLES
): () => void {
	const token = Symbol('gr-high-contrast');
	activeHighContrastToken = token;

	document.documentElement.classList.add('gr-high-contrast');

	const variant =
		styles === HIGH_CONTRAST_DARK_STYLES ||
		(styles.textColor === HIGH_CONTRAST_DARK_STYLES.textColor &&
			styles.backgroundColor === HIGH_CONTRAST_DARK_STYLES.backgroundColor &&
			styles.borderColor === HIGH_CONTRAST_DARK_STYLES.borderColor)
			? 'dark'
			: styles === HIGH_CONTRAST_STYLES ||
					(styles.textColor === HIGH_CONTRAST_STYLES.textColor &&
						styles.backgroundColor === HIGH_CONTRAST_STYLES.backgroundColor &&
						styles.borderColor === HIGH_CONTRAST_STYLES.borderColor)
				? 'light'
				: 'custom';

	document.documentElement.setAttribute('data-gr-high-contrast', variant);

	return () => {
		if (activeHighContrastToken !== token) return;
		document.documentElement.classList.remove('gr-high-contrast');
		document.documentElement.removeAttribute('data-gr-high-contrast');
		activeHighContrastToken = null;
	};
}

/**
 * Check if element should preserve original colors
 * Used to protect artwork from high contrast modifications
 */
export function preserveArtworkColors(element: HTMLElement): void {
	element.setAttribute('data-preserve-colors', 'true');
}

/**
 * Remove color preservation from element
 */
export function removeColorPreservation(element: HTMLElement): void {
	element.removeAttribute('data-preserve-colors');
}
