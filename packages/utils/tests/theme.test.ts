import { describe, it, expect } from 'vitest';
import { hexToHsl, hslToHex, generateColorHarmony } from '../src/theme/color-harmony';
import { getContrastRatio, meetsWCAG, suggestTextColor } from '../src/theme/contrast';
import { generateTheme } from '../src/theme/theme-generator';

describe('Theme Utilities', () => {
	describe('Color Harmony', () => {
		it('converts hex to HSL correctly', () => {
			const white = hexToHsl('#ffffff');
			expect(white).toEqual({ h: 0, s: 0, l: 100 });

			const black = hexToHsl('#000000');
			expect(black).toEqual({ h: 0, s: 0, l: 0 });

			const red = hexToHsl('#ff0000');
			expect(red).toEqual({ h: 0, s: 100, l: 50 });
		});

		it('converts HSL to hex correctly', () => {
			expect(hslToHex({ h: 0, s: 0, l: 100 })).toBe('#ffffff');
			expect(hslToHex({ h: 0, s: 0, l: 0 })).toBe('#000000');
			expect(hslToHex({ h: 0, s: 100, l: 50 })).toBe('#ff0000');
		});

		it('generates complementary harmony', () => {
			const red = '#ff0000'; // Hue 0
			const harmony = generateColorHarmony(red);

			expect(harmony.base).toBe(red);
			expect(harmony.complementary).toHaveLength(1);
			// Complement of Red (0) is Cyan (180) -> #00ffff
			expect(harmony.complementary[0]).toBe('#00ffff');
		});
	});

	describe('Contrast', () => {
		it('calculates contrast ratio', () => {
			const ratio = getContrastRatio('#000000', '#ffffff');
			expect(ratio).toBeCloseTo(21, 1);

			const same = getContrastRatio('#ffffff', '#ffffff');
			expect(same).toBeCloseTo(1, 1);
		});

		it('checks WCAG compliance', () => {
			expect(meetsWCAG('#000000', '#ffffff', 'AA')).toBe(true);
			expect(meetsWCAG('#000000', '#ffffff', 'AAA')).toBe(true);

			// Low contrast gray on white
			expect(meetsWCAG('#cccccc', '#ffffff', 'AA')).toBe(false);
		});

		it('suggests text color', () => {
			expect(suggestTextColor('#000000')).toBe('#FFFFFF');
			expect(suggestTextColor('#ffffff')).toBe('#000000');
		});
	});

	describe('Theme Generator', () => {
		it('generates theme structure', () => {
			const theme = generateTheme('#3b82f6');

			expect(theme.colors).toBeDefined();
			expect(theme.colors.primary).toBeDefined();
			expect(theme.colors.secondary).toBeDefined();
			expect(theme.colors.neutral).toBeDefined();

			// Check scale generation
			expect(theme.colors.primary[500]).toBeDefined();
			expect(theme.colors.primary[900]).toBeDefined();
		});
	});
});
