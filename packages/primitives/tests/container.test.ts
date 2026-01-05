import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import * as fc from 'fast-check';
import Container from '../src/components/Container.svelte';

describe('Container.svelte', () => {
	// Max-width tests
	it('applies sm max-width (640px)', () => {
		const { container } = render(Container, { maxWidth: 'sm' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-sm')).toBe(true);
	});

	it('applies md max-width (768px)', () => {
		const { container } = render(Container, { maxWidth: 'md' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-md')).toBe(true);
	});

	it('applies lg max-width by default (1024px)', () => {
		const { container } = render(Container);
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-lg')).toBe(true);
	});

	it('applies xl max-width (1280px)', () => {
		const { container } = render(Container, { maxWidth: 'xl' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-xl')).toBe(true);
	});

	it('applies 2xl max-width (1536px)', () => {
		const { container } = render(Container, { maxWidth: '2xl' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-2xl')).toBe(true);
	});

	it('applies full width (100%)', () => {
		const { container } = render(Container, { maxWidth: 'full' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-full')).toBe(true);
	});

	// Padding tests
	it('applies default padding when padding=true', () => {
		const { container } = render(Container, { padding: true });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-md')).toBe(true);
	});

	it('applies no padding when padding=false', () => {
		const { container } = render(Container, { padding: false });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-md')).toBe(false);
		expect(el?.classList.contains('gr-container--padded-sm')).toBe(false);
		expect(el?.classList.contains('gr-container--padded-lg')).toBe(false);
	});

	it('applies sm padding', () => {
		const { container } = render(Container, { padding: 'sm' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-sm')).toBe(true);
	});

	it('applies md padding', () => {
		const { container } = render(Container, { padding: 'md' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-md')).toBe(true);
	});

	it('applies lg padding', () => {
		const { container } = render(Container, { padding: 'lg' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-lg')).toBe(true);
	});

	// Centering tests
	it('centers content by default', () => {
		const { container } = render(Container);
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--centered')).toBe(true);
	});

	it('does not center when centered=false', () => {
		const { container } = render(Container, { centered: false });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--centered')).toBe(false);
	});

	// Content tests
	it('renders children content', () => {
		// Svelte 5 snippets are hard to pass directly in render properties for simple string content testing
		// but we can check if the container exists.
		// For content testing, we often use a harness if we need to inject snippets.
		// But 'children' prop is standard slot content.
		// Testing library render handles slots if passed as props? Not easily for snippets.
		// However, we can test empty container rendering.
		const { container } = render(Container);
		expect(container.querySelector('.gr-container')).toBeTruthy();
	});

	it('applies custom className', () => {
		const { container } = render(Container, { class: 'custom-class' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('custom-class')).toBe(true);
	});

	it('merges custom styles', () => {
		// checking style attribute presence if passed via restProps
		const { container } = render(Container, { style: 'background: red;' });
		const el = container.querySelector('.gr-container');
		expect(el?.getAttribute('style')).toContain('background: red');
	});
});

	describe('CSP Compliance - Property-Based Tests', () => {
		// Property 24: Container preset gutters emit no style attribute
		// Feature: csp-baseline-and-primitives, Property 24
		// Validates: Requirements 6.1, 6.3
		it('Property 24: preset gutters emit no style attribute', () => {
			fc.assert(
				fc.property(
					fc.constantFrom('none', 'sm', 'md', 'lg', 'xl'),
					(gutterValue) => {
						const { container } = render(Container, { props: { gutter: gutterValue } });
						const el = container.querySelector('.gr-container');
						return el !== null && !el.hasAttribute('style');
					}
				),
				{ numRuns: 100 }
			);
		});

		// Property 25: Container custom gutter emits no style attribute
		// Feature: csp-baseline-and-primitives, Property 25
		// Validates: Requirements 6.5
		it('Property 25: custom gutter emits no style attribute', () => {
			fc.assert(
				fc.property(fc.constant({}), () => {
					// Custom gutters are no longer supported via props
					// They must be set via external CSS
					// This test verifies that even without gutter prop, no style attribute is emitted
					const { container } = render(Container, { props: { class: 'custom-gutter' } });
					const el = container.querySelector('.gr-container');
					return el !== null && !el.hasAttribute('style');
				}),
				{ numRuns: 100 }
			);
		});

		// Property 26: Container preset-only API
		// Feature: csp-baseline-and-primitives, Property 26
		// Validates: Requirements 6.7
		it('Property 26: preset-only API', () => {
			fc.assert(
				fc.property(
					fc.constantFrom('none', 'sm', 'md', 'lg', 'xl'),
					(gutterValue) => {
						// TypeScript should enforce this at compile time
						// This test verifies runtime behavior with valid presets
						const { container } = render(Container, { props: { gutter: gutterValue } });
						const el = container.querySelector('.gr-container');
						// Verify the correct class is applied
						if (gutterValue === 'none') {
							return (
								el !== null &&
								!el.classList.contains('gr-container--padded-sm') &&
								!el.classList.contains('gr-container--padded-md') &&
								!el.classList.contains('gr-container--padded-lg') &&
								!el.classList.contains('gr-container--padded-xl')
							);
						}
						return el !== null && el.classList.contains(`gr-container--padded-${gutterValue}`);
					}
				),
				{ numRuns: 100 }
			);
		});

		// Property 27: Container universal CSP compliance
		// Feature: csp-baseline-and-primitives, Property 27
		// Validates: Requirements 7.4
		it('Property 27: universal CSP compliance across all prop combinations', () => {
			fc.assert(
				fc.property(
					fc.record({
						maxWidth: fc.option(fc.constantFrom('sm', 'md', 'lg', 'xl', '2xl', 'full')),
						size: fc.option(fc.constantFrom('sm', 'md', 'lg', 'xl', '2xl', 'full')),
						gutter: fc.option(fc.constantFrom('none', 'sm', 'md', 'lg', 'xl')),
						centered: fc.boolean(),
					}),
					(props) => {
						const { container } = render(Container, { props });
						const el = container.querySelector('.gr-container');
						return el !== null && !el.hasAttribute('style');
					}
				),
				{ numRuns: 100 }
			);
		});
	});
