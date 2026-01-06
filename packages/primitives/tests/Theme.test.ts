import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import fc from 'fast-check';
import ContrastChecker from '../src/components/Theme/ContrastChecker.svelte';
import ColorHarmonyPicker from '../src/components/Theme/ColorHarmonyPicker.svelte';
import ThemeWorkbench from '../src/components/Theme/ThemeWorkbench.svelte';

describe('Theme Components', () => {
	describe('ContrastChecker', () => {
		it('renders contrast metrics with preset', () => {
			render(ContrastChecker, {
				preset: 'text-on-surface',
			});

			// Should show contrast ratio and compliance badges
			expect(screen.getAllByText(/Pass|Fail/).length).toBeGreaterThan(0);
		});

		it('renders with custom preset', () => {
			render(ContrastChecker, {
				preset: 'custom',
				foreground: '#000000',
				background: '#ffffff',
			});

			expect(screen.getByText('21.00:1')).toBeTruthy();
			expect(screen.getAllByText('Pass').length).toBeGreaterThan(0);
		});
	});

	describe('ColorHarmonyPicker', () => {
		it('renders base color swatch', () => {
			render(ColorHarmonyPicker, {
				seedColor: '#ff0000',
				harmonyType: 'complementary',
			});

			// Base color
			expect(screen.getByTitle('Base Color: #ff0000')).toBeTruthy();
			// Harmony color (cyan for red)
			expect(screen.getByTitle('complementary: #00ffff')).toBeTruthy();
		});

		it('calls onSelect when base color is clicked', async () => {
			const onSelect = vi.fn();
			render(ColorHarmonyPicker, {
				seedColor: '#ff0000',
				harmonyType: 'complementary',
				onSelect,
			});

			const baseSwatch = screen.getByTitle('Base Color: #ff0000');
			await fireEvent.click(baseSwatch);

			expect(onSelect).toHaveBeenCalled();
		});

		it('calls onSelect when harmony color is clicked', async () => {
			const onSelect = vi.fn();
			render(ColorHarmonyPicker, {
				seedColor: '#ff0000',
				harmonyType: 'complementary',
				onSelect,
			});

			const harmonySwatch = screen.getByTitle('complementary: #00ffff');
			await fireEvent.click(harmonySwatch);

			expect(onSelect).toHaveBeenCalled();
		});

		it('calls onSelect when Enter key is pressed on base color', async () => {
			const onSelect = vi.fn();
			render(ColorHarmonyPicker, {
				seedColor: '#ff0000',
				harmonyType: 'complementary',
				onSelect,
			});

			const baseSwatch = screen.getByTitle('Base Color: #ff0000');
			await fireEvent.keyDown(baseSwatch, { key: 'Enter' });

			expect(onSelect).toHaveBeenCalled();
		});

		it('calls onSelect when Enter key is pressed on harmony color', async () => {
			const onSelect = vi.fn();
			render(ColorHarmonyPicker, {
				seedColor: '#ff0000',
				harmonyType: 'complementary',
				onSelect,
			});

			const harmonySwatch = screen.getByTitle('complementary: #00ffff');
			await fireEvent.keyDown(harmonySwatch, { key: 'Enter' });

			expect(onSelect).toHaveBeenCalled();
		});
	});

	describe('ThemeWorkbench', () => {
		it('renders workbench interface', () => {
			render(ThemeWorkbench, {
				initialColor: '#3b82f6',
			});

			expect(screen.getByText('Theme Controls')).toBeTruthy();
			expect(screen.getByText('Contrast Check')).toBeTruthy();
			expect(screen.getByText('Component Preview')).toBeTruthy();
		});
	});
});

describe('Theme Tooling CSP Compliance - Property Tests', () => {
	// Property 14: Theme tooling universal CSP compliance
	// Feature: csp-theme-layout-primitives, Property 14
	// **Validates: Requirements 5.1, 5.2, 5.3, 6.5**
	it('Property 14: Theme tooling universal CSP compliance - no style attribute for any prop combination', () => {
		// Test ContrastChecker
		fc.assert(
			fc.property(
				fc.record({
					preset: fc.constantFrom('text-on-surface', 'primary-on-surface', 'text-on-primary', 'custom'),
				}),
				(props) => {
					const { container } = render(ContrastChecker, { props });
					const element = container.querySelector('.gr-contrast-checker');
					expect(element).toBeTruthy();
					
					// CSP compliance: no style attribute should be present on any element
					const allElements = container.querySelectorAll('*');
					for (const el of allElements) {
						if (el.hasAttribute('style')) {
							return false;
						}
					}
					return true;
				}
			),
			{ numRuns: 100 }
		);

		// Test ColorHarmonyPicker
		fc.assert(
			fc.property(
				fc.record({
					harmonyType: fc.constantFrom('complementary', 'analogous', 'triadic', 'tetradic', 'splitComplementary', 'monochromatic'),
				}),
				(props) => {
					// Use a valid hex color
					const validProps = {
						seedColor: '#ff0000', // Use fixed color to avoid invalid hex issues
						harmonyType: props.harmonyType,
					};
					const { container } = render(ColorHarmonyPicker, { props: validProps });
					const element = container.querySelector('.gr-color-harmony-picker');
					expect(element).toBeTruthy();
					
					// CSP compliance: no inline style attributes
					const allElements = container.querySelectorAll('*');
					for (const el of allElements) {
						if (el.hasAttribute('style')) {
							return false;
						}
					}
					return true;
				}
			),
			{ numRuns: 100 }
		);

		// Test ThemeWorkbench
		fc.assert(
			fc.property(
				fc.record({
					initialColor: fc.constant('#3b82f6'),
				}),
				(props) => {
					const { container } = render(ThemeWorkbench, { props });
					const element = container.querySelector('.gr-theme-workbench');
					expect(element).toBeTruthy();
					
					// CSP compliance: no inline style attributes
					const allElements = container.querySelectorAll('*');
					for (const el of allElements) {
						if (el.hasAttribute('style')) {
							return false;
						}
					}
					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	// Property 15: Theme tooling uses preset color classes
	// Feature: csp-theme-layout-primitives, Property 15
	// **Validates: Requirements 5.5, 5.7, 5.9**
	it('Property 15: Theme tooling uses preset color classes', () => {
		// Test ContrastChecker uses preset classes
		fc.assert(
			fc.property(
				fc.constantFrom('text-on-surface', 'primary-on-surface', 'text-on-primary'),
				(preset) => {
					const { container } = render(ContrastChecker, { props: { preset } });
					const preview = container.querySelector('.gr-contrast-checker__preview');
					expect(preview).toBeTruthy();
					
					// Should have the preset class
					expect(preview?.classList.contains(`gr-contrast-checker__preview--${preset}`)).toBe(true);
					return true;
				}
			),
			{ numRuns: 100 }
		);

		// Test ColorHarmonyPicker uses CSS custom properties for swatches
		fc.assert(
			fc.property(
				fc.constantFrom('complementary', 'analogous', 'triadic'),
				(harmonyType) => {
					const { container } = render(ColorHarmonyPicker, { 
						props: { seedColor: '#ff0000', harmonyType } 
					});
					
					// Base swatch should have the base class
					const baseSwatch = container.querySelector('.gr-color-harmony-picker__swatch--base');
					expect(baseSwatch).toBeTruthy();
					
					// Harmony swatches should have the harmony class
					const harmonySwatches = container.querySelectorAll('.gr-color-harmony-picker__swatch--harmony');
					expect(harmonySwatches.length).toBeGreaterThan(0);
					
					return true;
				}
			),
			{ numRuns: 100 }
		);

		// Test ThemeWorkbench swatch grid uses preset classes
		fc.assert(
			fc.property(
				fc.constant('#3b82f6'),
				(initialColor) => {
					const { container } = render(ThemeWorkbench, { props: { initialColor } });
					
					// Swatch grid should contain preset swatch classes
					const swatchGrid = container.querySelector('.gr-theme-workbench__swatch-grid');
					expect(swatchGrid).toBeTruthy();
					
					// Should have primary color scale swatches
					const swatches = swatchGrid?.querySelectorAll('.gr-swatch');
					expect(swatches?.length).toBeGreaterThan(0);
					
					// Each swatch should have a preset class
					for (const swatch of swatches || []) {
						const hasPresetClass = Array.from(swatch.classList).some(
							cls => cls.startsWith('gr-swatch--primary-')
						);
						if (!hasPresetClass) {
							return false;
						}
					}
					
					return true;
				}
			),
			{ numRuns: 100 }
		);
	});
});
