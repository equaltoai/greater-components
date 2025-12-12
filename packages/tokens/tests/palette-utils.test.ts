import { describe, it, expect } from 'vitest';
import {
    generateColorScaleCSS,
    generateSemanticActionCSS,
    generatePaletteCSS,
    getPresetGrayScale,
    validateColorScale,
    palettes
} from '../src/palette-utils';
import type { ColorScale } from '../src/palette-utils';

describe('palette-utils', () => {
    describe('generateColorScaleCSS', () => {
        it('generates CSS variables for scale', () => {
            const scale: ColorScale = {
                '50': '#f9fafb',
                '100': '#f3f4f6'
            };
            const css = generateColorScaleCSS('gray', scale);
            expect(css).toContain('--gr-color-gray-50: #f9fafb;');
            expect(css).toContain('--gr-color-gray-100: #f3f4f6;');
        });

        it('ignores missing values', () => {
            const scale: ColorScale = {
                '50': '#fff'
            };
            const css = generateColorScaleCSS('gray', scale);
            expect(css).not.toContain('undefined');
        });
    });

    describe('generateSemanticActionCSS', () => {
        it('generates semantic variables from primary scale', () => {
            const scale: ColorScale = {
                '300': '#300',
                '500': '#500',
                '600': '#600',
                '700': '#700',
                '800': '#800',
            };
            const css = generateSemanticActionCSS(scale);
            expect(css).toContain('--gr-semantic-action-primary-default: #600;');
            expect(css).toContain('--gr-semantic-action-primary-hover: #700;');
            expect(css).toContain('--gr-semantic-action-primary-active: #800;');
            expect(css).toContain('--gr-semantic-action-primary-disabled: #300;');
            expect(css).toContain('--gr-semantic-focus-ring: #500;');
        });

        it('handles missing keys gracefully', () => {
            const scale: ColorScale = { '600': '#600' };
            const css = generateSemanticActionCSS(scale);
            expect(css).toContain('default: #600');
            expect(css).not.toContain('hover');
        });
    });

    describe('generatePaletteCSS', () => {
        it('generates complete CSS for gray and primary', () => {
            const palette = {
                gray: { '50': '#fafafa' },
                primary: { '600': '#0066cc' }
            };
            const css = generatePaletteCSS(palette);
            expect(css).toContain('--gr-color-gray-50: #fafafa');
            expect(css).toContain('--gr-color-primary-600: #0066cc');
            expect(css).toContain('--gr-semantic-action-primary-default: #0066cc');
        });

        it('handles missing gray', () => {
            const palette = {
                primary: { '600': '#0066cc' }
            };
            const css = generatePaletteCSS(palette);
            expect(css).not.toContain('gray');
            expect(css).toContain('primary');
        });

        it('handles missing primary', () => {
            const palette = {
                gray: { '50': '#fafafa' }
            };
            const css = generatePaletteCSS(palette);
            expect(css).toContain('gray');
            expect(css).not.toContain('primary');
        });
    });

    describe('getPresetGrayScale', () => {
        it('returns scale for valid preset', () => {
            const scale = getPresetGrayScale('slate');
            expect(scale).toBeDefined();
            expect(scale?.['50']).toBeDefined();
        });

        it('returns undefined for invalid preset', () => {
            const scale = getPresetGrayScale('invalid' as any);
            expect(scale).toBeUndefined();
        });
    });

    describe('validateColorScale', () => {
        it('validates complete scale', () => {
            const scale: ColorScale = {
                '50': '#fff', '100': '#fff', '200': '#fff', '300': '#fff',
                '400': '#fff', '500': '#fff', '600': '#fff', '700': '#fff',
                '800': '#fff', '900': '#fff', '950': '#fff'
            };
            expect(validateColorScale(scale)).toBe(true);
        });

        it('invalidates incomplete scale', () => {
            const scale: ColorScale = { '50': '#fff' };
            expect(validateColorScale(scale)).toBe(false);
        });

        it('allows custom required shades', () => {
            const scale: ColorScale = { '50': '#fff' };
            expect(validateColorScale(scale, ['50'])).toBe(true);
        });
    });
});
