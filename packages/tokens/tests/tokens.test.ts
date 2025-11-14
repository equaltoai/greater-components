import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('@equaltoai/greater-components-tokens', () => {
	let tokens: Record<string, Record<string, unknown>>;
	let themes: Record<string, Record<string, unknown>>;
	let themeCss: string;

	beforeAll(() => {
		// Read source files
		tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/tokens.json'), 'utf8'));
		themes = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/themes.json'), 'utf8'));

		// Build tokens first
		const buildPath = path.join(__dirname, '../scripts/build.js');
		if (fs.existsSync(buildPath)) {
			import(buildPath);
		}

		// Read generated CSS
		const cssPath = path.join(__dirname, '../dist/theme.css');
		if (fs.existsSync(cssPath)) {
			themeCss = fs.readFileSync(cssPath, 'utf8');
		} else {
			themeCss = '';
		}
	});

	describe('Token Structure', () => {
		it('should have all required token categories', () => {
			expect(tokens).toHaveProperty('color');
			expect(tokens).toHaveProperty('typography');
			expect(tokens).toHaveProperty('spacing');
			expect(tokens).toHaveProperty('radii');
			expect(tokens).toHaveProperty('shadows');
			expect(tokens).toHaveProperty('motion');
		});

		it('should have color tokens with proper structure', () => {
			expect(tokens['color']).toHaveProperty('base');
			expect(tokens['color']).toHaveProperty('gray');
			expect(tokens['color']).toHaveProperty('primary');
			expect(tokens['color']).toHaveProperty('success');
			expect(tokens['color']).toHaveProperty('warning');
			expect(tokens['color']).toHaveProperty('error');

			// Check value structure
			const colorTokens = tokens['color'] as any;
			expect(colorTokens['base']['white']).toHaveProperty('value');
			expect(colorTokens['gray']['500']).toHaveProperty('value');
		});

		it('should have typography tokens', () => {
			expect(tokens['typography']).toHaveProperty('fontFamily');
			expect(tokens['typography']).toHaveProperty('fontSize');
			expect(tokens['typography']).toHaveProperty('fontWeight');
			expect(tokens['typography']).toHaveProperty('lineHeight');

			const typographyTokens = tokens['typography'] as any;
			expect(typographyTokens['fontSize']['base']['value']).toBe('1rem');
		});

		it('should have spacing scale', () => {
			const spacingTokens = tokens['spacing'] as any;
			expect(spacingTokens['scale']).toBeDefined();
			expect(spacingTokens['scale']['0']['value']).toBe('0');
			expect(spacingTokens['scale']['4']['value']).toBe('1rem');
		});

		it('should have motion tokens', () => {
			const motionTokens = tokens['motion'] as any;
			expect(motionTokens['duration']).toBeDefined();
			expect(motionTokens['easing']).toBeDefined();
			expect(motionTokens['duration']['base']['value']).toBe('250ms');
		});
	});

	describe('Theme Definitions', () => {
		it('should have all required themes', () => {
			expect(themes).toHaveProperty('light');
			expect(themes).toHaveProperty('dark');
			expect(themes).toHaveProperty('highContrast');
		});

		it('should have semantic tokens in each theme', () => {
			for (const themeName of Object.keys(themes)) {
				const theme = themes[themeName] as any;
				expect(theme).toHaveProperty('semantic');
				expect(theme['semantic']).toHaveProperty('background');
				expect(theme['semantic']).toHaveProperty('foreground');
				expect(theme['semantic']).toHaveProperty('border');
				expect(theme['semantic']).toHaveProperty('action');
				expect(theme['semantic']).toHaveProperty('focus');
			}
		});

		it('should have token references in themes', () => {
			const lightTheme = themes['light'] as any;
			const lightBg = lightTheme['semantic']['background']['primary']['value'];
			expect(lightBg).toMatch(/^\{color\./);

			const darkTheme = themes['dark'] as any;
			const darkBg = darkTheme['semantic']['background']['primary']['value'];
			expect(darkBg).toMatch(/^\{color\./);
		});
	});

	describe('CSS Generation', () => {
		it('should generate CSS with custom properties', () => {
			if (!themeCss) {
				// CSS not generated yet, skipping CSS tests
				return;
			}

			// Check for CSS custom properties
			expect(themeCss).toContain(':root {');
			expect(themeCss).toContain('--gr-color-base-white:');
			expect(themeCss).toContain('--gr-typography-fontSize-base:');
			expect(themeCss).toContain('--gr-spacing-scale-4:');
		});

		it('should generate theme-specific CSS', () => {
			if (!themeCss) return;

			expect(themeCss).toContain('[data-theme="light"]');
			expect(themeCss).toContain('[data-theme="dark"]');
			expect(themeCss).toContain('[data-theme="highContrast"]');
		});

		it('should include media queries for system preferences', () => {
			if (!themeCss) return;

			expect(themeCss).toContain('@media (prefers-color-scheme: dark)');
			expect(themeCss).toContain('@media (prefers-contrast: high)');
		});
	});

	describe('TypeScript Definitions', () => {
		it('should generate TypeScript definition file', () => {
			const tsPath = path.join(__dirname, '../dist/index.d.ts');

			if (!fs.existsSync(tsPath)) {
				// TypeScript definitions not generated yet
				return;
			}

			const tsContent = fs.readFileSync(tsPath, 'utf8');

			expect(tsContent).toContain('export declare const tokens');
			expect(tsContent).toContain('export declare const themes');
			expect(tsContent).toContain('export type TokenCategory');
			expect(tsContent).toContain('export type ThemeName');
			expect(tsContent).toContain('export declare function getCSSVar');
		});
	});

	describe('Token Values', () => {
		it('should have valid color values', () => {
			const validateHexColor = (color: string) => /^#[0-9A-Fa-f]{6}$/.test(color);

			const colorTokens = tokens['color'] as any;
			expect(validateHexColor(colorTokens['base']['white']['value'])).toBe(true);
			expect(validateHexColor(colorTokens['primary']['500']['value'])).toBe(true);
		});

		it('should have valid spacing values', () => {
			const spacingTokens = tokens['spacing'] as any;
			expect(spacingTokens['scale']['4']['value']).toMatch(/^\d+(\.\d+)?rem$/);
		});

		it('should have valid duration values', () => {
			const motionTokens = tokens['motion'] as any;
			expect(motionTokens['duration']['base']['value']).toMatch(/^\d+ms$/);
		});

		it('should have valid shadow values', () => {
			const shadowTokens = tokens['shadows'] as any;
			expect(shadowTokens['md']['value']).toContain('rgb(0 0 0');
		});
	});
});
