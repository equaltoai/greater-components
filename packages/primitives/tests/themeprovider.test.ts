import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import * as fc from 'fast-check';
import ThemeProviderHarness from './harness/ThemeProviderHarness.svelte';
import { preferencesStore } from '../src/stores/preferences';

afterEach(() => {
	vi.restoreAllMocks();
	preferencesStore.reset();
});

describe('ThemeProvider.svelte', () => {
	it('applies provided theme via preferences store and renders children', () => {
		const spy = vi.spyOn(preferencesStore, 'setColorScheme');
		const { getByTestId } = render(ThemeProviderHarness, {
			props: { props: { theme: 'dark' } },
		});

		expect(getByTestId('theme-provider-child')).toBeTruthy();
		expect(spy).toHaveBeenCalledWith('dark');
	});

	it('still mounts when preventFlash is disabled', () => {
		const spy = vi.spyOn(preferencesStore, 'setColorScheme');
		const { getByTestId } = render(ThemeProviderHarness, {
			props: { props: { preventFlash: false, theme: 'light' } },
		});

		expect(getByTestId('theme-provider-child')).toBeTruthy();
		expect(spy).toHaveBeenCalledWith('light');
	});
});

describe('ThemeProvider CSP Compliance - Property Tests', () => {
	// Property 1: ThemeProvider universal CSP compliance
	// Feature: csp-theme-layout-primitives, Property 1
	// **Validates: Requirements 1.1, 1.2, 1.3, 6.1**
	it('Property 1: ThemeProvider universal CSP compliance - no style attribute for any prop combination', () => {
		fc.assert(
			fc.property(
				fc.record({
					theme: fc.option(
						fc.constantFrom('light', 'dark', 'high-contrast', 'auto') as fc.Arbitrary<
							'light' | 'dark' | 'high-contrast' | 'auto'
						>,
						{ nil: undefined }
					),
					palette: fc.option(
						fc.constantFrom('slate', 'stone', 'neutral', 'zinc', 'gray') as fc.Arbitrary<
							'slate' | 'stone' | 'neutral' | 'zinc' | 'gray'
						>,
						{ nil: undefined }
					),
					headingFontPreset: fc.option(
						fc.constantFrom('system', 'sans', 'serif', 'mono') as fc.Arbitrary<
							'system' | 'sans' | 'serif' | 'mono'
						>,
						{ nil: undefined }
					),
					bodyFontPreset: fc.option(
						fc.constantFrom('system', 'sans', 'serif', 'mono') as fc.Arbitrary<
							'system' | 'sans' | 'serif' | 'mono'
						>,
						{ nil: undefined }
					),
				}),
				(props) => {
					// Filter out undefined values
					const filteredProps = Object.fromEntries(
						Object.entries(props).filter(([, v]) => v !== undefined)
					);

					const { container } = render(ThemeProviderHarness, {
						props: { props: filteredProps },
					});

					const element = container.querySelector('.gr-theme-provider');
					expect(element).toBeTruthy();
					// CSP compliance: no style attribute should be present
					expect(element?.hasAttribute('style')).toBe(false);

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	// Property 2: ThemeProvider palette class generation
	// Feature: csp-theme-layout-primitives, Property 2
	// **Validates: Requirements 1.4**
	it('Property 2: ThemeProvider palette class generation - correct class for each palette preset', () => {
		fc.assert(
			fc.property(
				fc.constantFrom('slate', 'stone', 'neutral', 'zinc', 'gray') as fc.Arbitrary<
					'slate' | 'stone' | 'neutral' | 'zinc' | 'gray'
				>,
				(palette) => {
					const { container } = render(ThemeProviderHarness, {
						props: { props: { palette } },
					});

					const element = container.querySelector('.gr-theme-provider');
					expect(element).toBeTruthy();
					// Should have the correct palette class
					expect(element?.classList.contains(`gr-theme-provider--palette-${palette}`)).toBe(true);

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	// Property 3: ThemeProvider typography class generation
	// Feature: csp-theme-layout-primitives, Property 3
	// **Validates: Requirements 1.5**
	it('Property 3: ThemeProvider typography class generation - correct classes for font presets', () => {
		fc.assert(
			fc.property(
				fc.record({
					headingFontPreset: fc.option(
						fc.constantFrom('system', 'sans', 'serif', 'mono') as fc.Arbitrary<
							'system' | 'sans' | 'serif' | 'mono'
						>,
						{ nil: undefined }
					),
					bodyFontPreset: fc.option(
						fc.constantFrom('system', 'sans', 'serif', 'mono') as fc.Arbitrary<
							'system' | 'sans' | 'serif' | 'mono'
						>,
						{ nil: undefined }
					),
				}),
				(props) => {
					// Filter out undefined values
					const filteredProps = Object.fromEntries(
						Object.entries(props).filter(([, v]) => v !== undefined)
					);

					const { container } = render(ThemeProviderHarness, {
						props: { props: filteredProps },
					});

					const element = container.querySelector('.gr-theme-provider');
					expect(element).toBeTruthy();

					// Check heading font preset class
					if (props.headingFontPreset) {
						expect(
							element?.classList.contains(`gr-theme-provider--heading-${props.headingFontPreset}`)
						).toBe(true);
					}

					// Check body font preset class
					if (props.bodyFontPreset) {
						expect(
							element?.classList.contains(`gr-theme-provider--body-${props.bodyFontPreset}`)
						).toBe(true);
					}

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});
});
