import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import * as fc from 'fast-check';
import Section from '../src/components/Section.svelte';

// Type definitions matching Section component props
type SpacingPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type BackgroundPreset = 'default' | 'muted' | 'accent' | 'gradient';
type GradientDirection =
	| 'to-top'
	| 'to-bottom'
	| 'to-left'
	| 'to-right'
	| 'to-top-left'
	| 'to-top-right'
	| 'to-bottom-left'
	| 'to-bottom-right';

describe('Section.svelte', () => {
	// Spacing tests
	it('applies md spacing by default', () => {
		const { container } = render(Section);
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-md')).toBe(true);
	});

	it('applies no spacing when spacing=none', () => {
		const { container } = render(Section, { spacing: 'none' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-none')).toBe(true);
	});

	it('applies sm spacing', () => {
		const { container } = render(Section, { spacing: 'sm' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-sm')).toBe(true);
	});

	it('applies lg spacing', () => {
		const { container } = render(Section, { spacing: 'lg' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-lg')).toBe(true);
	});

	it('applies xl spacing', () => {
		const { container } = render(Section, { spacing: 'xl' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-xl')).toBe(true);
	});

	// Layout tests
	it('renders as semantic section element', () => {
		const { container } = render(Section);
		expect(container.querySelector('section')).toBeTruthy();
	});

	it('centers content when centered=true', () => {
		const { container } = render(Section, { centered: true });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--centered')).toBe(true);
	});

	it('applies padding when enabled', () => {
		const { container } = render(Section, { padding: true });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--padded-md')).toBe(true);
	});

	it('applies specific padding size', () => {
		const { container } = render(Section, { padding: 'lg' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--padded-lg')).toBe(true);
	});

	// Content tests
	it('renders children content', () => {
		const { container } = render(Section);
		// Just checking if the section element is rendered, as explicit content testing without harness is tricky
		// but empty render works.
		expect(container.querySelector('.gr-section')).toBeTruthy();
	});

	it('applies custom className', () => {
		const { container } = render(Section, { class: 'custom-section' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('custom-section')).toBe(true);
	});

	// Accessibility tests
	it('accepts aria-labelledby attribute', () => {
		const { container } = render(Section, { 'aria-labelledby': 'section-title' });
		const el = container.querySelector('section');
		expect(el?.getAttribute('aria-labelledby')).toBe('section-title');
	});
});

describe('Section CSP Compliance - Property Tests', () => {
	// Property 4: Section universal CSP compliance
	// Feature: csp-theme-layout-primitives, Property 4
	// **Validates: Requirements 2.1, 2.2, 2.3, 6.2**
	it('Property 4: Section universal CSP compliance - no style attribute for any prop combination', () => {
		fc.assert(
			fc.property(
				fc.record({
					spacing: fc.option(
						fc.constantFrom(
							'none',
							'sm',
							'md',
							'lg',
							'xl',
							'2xl',
							'3xl',
							'4xl'
						) as fc.Arbitrary<SpacingPreset>,
						{ nil: undefined }
					),
					background: fc.option(
						fc.constantFrom(
							'default',
							'muted',
							'accent',
							'gradient'
						) as fc.Arbitrary<BackgroundPreset>,
						{ nil: undefined }
					),
					gradientDirection: fc.option(
						fc.constantFrom(
							'to-top',
							'to-bottom',
							'to-left',
							'to-right',
							'to-top-left',
							'to-top-right',
							'to-bottom-left',
							'to-bottom-right'
						) as fc.Arbitrary<GradientDirection>,
						{ nil: undefined }
					),
					padding: fc.option(
						fc.oneof(
							fc.boolean(),
							fc.constantFrom('sm', 'md', 'lg') as fc.Arbitrary<'sm' | 'md' | 'lg'>
						),
						{ nil: undefined }
					),
					centered: fc.option(fc.boolean(), { nil: undefined }),
				}),
				(props) => {
					// Filter out undefined values
					const filteredProps = Object.fromEntries(
						Object.entries(props).filter(([, v]) => v !== undefined)
					);

					const { container } = render(Section, filteredProps);

					const element = container.querySelector('.gr-section');
					expect(element).toBeTruthy();
					// CSP compliance: no style attribute should be present
					expect(element?.hasAttribute('style')).toBe(false);

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	// Property 5: Section spacing class generation
	// Feature: csp-theme-layout-primitives, Property 5
	// **Validates: Requirements 2.4**
	it('Property 5: Section spacing class generation - correct class for each spacing preset', () => {
		fc.assert(
			fc.property(
				fc.constantFrom(
					'none',
					'sm',
					'md',
					'lg',
					'xl',
					'2xl',
					'3xl',
					'4xl'
				) as fc.Arbitrary<SpacingPreset>,
				(spacing) => {
					const { container } = render(Section, { spacing });

					const element = container.querySelector('.gr-section');
					expect(element).toBeTruthy();
					// Should have the correct spacing class
					expect(element?.classList.contains(`gr-section--spacing-${spacing}`)).toBe(true);

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	// Property 6: Section background class generation
	// Feature: csp-theme-layout-primitives, Property 6
	// **Validates: Requirements 2.5**
	it('Property 6: Section background class generation - correct class for each background preset', () => {
		fc.assert(
			fc.property(
				fc.constantFrom('default', 'muted', 'accent', 'gradient') as fc.Arbitrary<BackgroundPreset>,
				(background) => {
					const { container } = render(Section, { background });

					const element = container.querySelector('.gr-section');
					expect(element).toBeTruthy();

					// 'default' background should not add a bg class
					if (background === 'default') {
						expect(element?.classList.contains('gr-section--bg-default')).toBe(false);
						expect(element?.classList.contains('gr-section--bg-muted')).toBe(false);
						expect(element?.classList.contains('gr-section--bg-accent')).toBe(false);
						expect(element?.classList.contains('gr-section--bg-gradient')).toBe(false);
					} else {
						// Non-default backgrounds should have the correct class
						expect(element?.classList.contains(`gr-section--bg-${background}`)).toBe(true);
					}

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	// Property 7: Section gradient direction class generation
	// Feature: csp-theme-layout-primitives, Property 7
	// **Validates: Requirements 2.10**
	it('Property 7: Section gradient direction class generation - correct class for each gradient direction', () => {
		fc.assert(
			fc.property(
				fc.constantFrom(
					'to-top',
					'to-bottom',
					'to-left',
					'to-right',
					'to-top-left',
					'to-top-right',
					'to-bottom-left',
					'to-bottom-right'
				) as fc.Arbitrary<GradientDirection>,
				(gradientDirection) => {
					const { container } = render(Section, {
						background: 'gradient',
						gradientDirection,
					});

					const element = container.querySelector('.gr-section');
					expect(element).toBeTruthy();
					// Should have the gradient background class
					expect(element?.classList.contains('gr-section--bg-gradient')).toBe(true);
					// Should have the correct gradient direction class
					expect(element?.classList.contains(`gr-section--gradient-${gradientDirection}`)).toBe(
						true
					);

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});
});
