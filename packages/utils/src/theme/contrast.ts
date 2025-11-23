/**
 * WCAG Contrast Utilities
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1]!, 16),
				g: parseInt(result[2]!, 16),
				b: parseInt(result[3]!, 16),
			}
		: null;
}

function getLuminance(r: number, g: number, b: number): number {
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
	const rgb1 = hexToRgb(color1);
	const rgb2 = hexToRgb(color2);

	if (!rgb1 || !rgb2) return 1;

	const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
	const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);

	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG standards
 */
export function meetsWCAG(
	color1: string,
	color2: string,
	level: 'AA' | 'AAA' = 'AA',
	fontSize: 'small' | 'large' = 'small'
): boolean {
	const ratio = getContrastRatio(color1, color2);

	if (level === 'AA') {
		return fontSize === 'large' ? ratio >= 3.0 : ratio >= 4.5;
	} else {
		return fontSize === 'large' ? ratio >= 4.5 : ratio >= 7.0;
	}
}

/**
 * Suggest a text color (black or white) for a given background
 */
export function suggestTextColor(backgroundColor: string): '#000000' | '#FFFFFF' {
	const contrastWhite = getContrastRatio(backgroundColor, '#FFFFFF');
	const contrastBlack = getContrastRatio(backgroundColor, '#000000');

	return contrastWhite >= contrastBlack ? '#FFFFFF' : '#000000';
}
