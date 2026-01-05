import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import * as fc from 'fast-check';
import Text from '../src/components/Text.svelte';
import TextHarness from './harness/TextHarness.svelte';

describe('Text.svelte', () => {
	// Element rendering tests
	it('renders as p by default', () => {
		const { container } = render(Text);
		expect(container.querySelector('p')).toBeTruthy();
	});

	it('renders as span when as=span', () => {
		const { container } = render(Text, { as: 'span' });
		expect(container.querySelector('span')).toBeTruthy();
	});

	it('renders as div when as=div', () => {
		const { container } = render(Text, { as: 'div' });
		expect(container.querySelector('div')).toBeTruthy();
	});

	it('renders as label when as=label', () => {
		const { container } = render(Text, { as: 'label' });
		expect(container.querySelector('label')).toBeTruthy();
	});

	// Size tests
	it('applies base size by default', () => {
		const { container } = render(Text);
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('gr-text--size-base')).toBe(true);
	});

	it('applies all size variants correctly', () => {
		const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const;
		sizes.forEach((size) => {
			const { container } = render(Text, { size });
			const el = container.querySelector('.gr-text');
			expect(el?.classList.contains(`gr-text--size-${size}`)).toBe(true);
		});
	});

	// Weight tests
	it('applies normal weight by default', () => {
		const { container } = render(Text);
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('gr-text--weight-normal')).toBe(true);
	});

	it('applies all weight variants correctly', () => {
		const weights = ['normal', 'medium', 'semibold', 'bold'] as const;
		weights.forEach((weight) => {
			const { container } = render(Text, { weight });
			const el = container.querySelector('.gr-text');
			expect(el?.classList.contains(`gr-text--weight-${weight}`)).toBe(true);
		});
	});

	// Color tests
	it('applies primary color by default', () => {
		const { container } = render(Text);
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('gr-text--color-primary')).toBe(true);
	});

	it('applies all color variants correctly', () => {
		const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'] as const;
		colors.forEach((color) => {
			const { container } = render(Text, { color });
			const el = container.querySelector('.gr-text');
			expect(el?.classList.contains(`gr-text--color-${color}`)).toBe(true);
		});
	});

	// Alignment tests
	it('aligns left by default', () => {
		const { container } = render(Text);
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('gr-text--align-left')).toBe(true);
	});

	it('applies all alignment values correctly', () => {
		const alignments = ['left', 'center', 'right', 'justify'] as const;
		alignments.forEach((align) => {
			const { container } = render(Text, { align });
			const el = container.querySelector('.gr-text');
			expect(el?.classList.contains(`gr-text--align-${align}`)).toBe(true);
		});
	});

	// Truncation tests
	it('truncates text when truncate=true', () => {
		const { container } = render(Text, { truncate: true });
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('gr-text--truncate')).toBe(true);
		expect(el?.classList.contains('gr-text--clamp')).toBe(false);
	});

	it('truncates to specific lines when lines prop set', () => {
		const { container } = render(Text, { truncate: true, lines: 3 });
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('gr-text--truncate')).toBe(true);
		expect(el?.classList.contains('gr-text--clamp-3')).toBe(true);
		expect(el?.hasAttribute('style')).toBe(false);
	});

	it('does not truncate by default', () => {
		const { container } = render(Text);
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('gr-text--truncate')).toBe(false);
	});

	// Content tests
	it('renders content using harness', () => {
		const { getByText } = render(TextHarness, { textContent: 'Hello World' });
		expect(getByText('Hello World')).toBeTruthy();
	});

	it('applies custom className', () => {
		const { container } = render(Text, { class: 'custom-text' });
		const el = container.querySelector('.gr-text');
		expect(el?.classList.contains('custom-text')).toBe(true);
	});

	// Accessibility tests
	it('supports for attribute when as=label', () => {
		const { container } = render(Text, { as: 'label', for: 'input-id' });
		const el = container.querySelector('label');
		expect(el?.getAttribute('for')).toBe('input-id');
	});
});

describe('Text.svelte - CSP Compliance Property Tests', () => {
	// Helper function to check for style attributes
	const hasNoStyleAttribute = (element: Element | null): boolean => {
		if (!element) return false;
		return !element.hasAttribute('style');
	};

	// Helper function to extract getClampClass logic for testing
	const getClampClass = (lines?: number): string => {
		if (!lines) return '';
		if (lines >= 2 && lines <= 6) {
			return `gr-text--clamp-${lines}`;
		}
		return '';
	};

	it('Property 20: Text truncate emits no style attribute', () => {
		// Feature: csp-baseline-and-primitives, Property 20
		// Validates: Requirements 5.1
		fc.assert(
			fc.property(
				fc.integer({ min: 2, max: 6 }),
				(lines) => {
					const { container } = render(Text, { props: { truncate: true, lines } });
					const element = container.querySelector('.gr-text');
					return hasNoStyleAttribute(element);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('Property 21: Text clamp class generation', () => {
		// Feature: csp-baseline-and-primitives, Property 21
		// Validates: Requirements 5.3
		fc.assert(
			fc.property(
				fc.constantFrom(2, 3, 4, 5, 6),
				(lines) => {
					const expectedClass = `gr-text--clamp-${lines}`;
					const generatedClass = getClampClass(lines);
					
					// Also verify the component renders with the correct class
					const { container } = render(Text, { props: { truncate: true, lines } });
					const element = container.querySelector('.gr-text');
					
					return (
						generatedClass === expectedClass &&
						element?.classList.contains(expectedClass) === true
					);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('Property 22: Text removes CSS variable injection', () => {
		// Feature: csp-baseline-and-primitives, Property 22
		// Validates: Requirements 5.5
		fc.assert(
			fc.property(
				fc.integer({ min: 1, max: 10 }),
				(lines) => {
					const { container } = render(Text, { props: { truncate: true, lines } });
					const element = container.querySelector('.gr-text');
					
					// Check that no style attribute exists
					if (element?.hasAttribute('style')) {
						return false;
					}
					
					// Check that the style attribute doesn't contain the CSS variable
					const styleAttr = element?.getAttribute('style');
					if (styleAttr && styleAttr.includes('--gr-text-clamp-lines')) {
						return false;
					}
					
					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	it('Property 23: Text universal CSP compliance', () => {
		// Feature: csp-baseline-and-primitives, Property 23
		// Validates: Requirements 7.3
		fc.assert(
			fc.property(
				fc.record({
					as: fc.constantFrom('p', 'span', 'div', 'label'),
					size: fc.constantFrom('xs', 'sm', 'base', 'lg', 'xl', '2xl'),
					weight: fc.constantFrom('normal', 'medium', 'semibold', 'bold'),
					color: fc.constantFrom('primary', 'secondary', 'tertiary', 'success', 'warning', 'error'),
					align: fc.constantFrom('left', 'center', 'right', 'justify'),
					truncate: fc.boolean(),
					lines: fc.option(fc.integer({ min: 2, max: 6 })),
				}),
				(props) => {
					const { container } = render(Text, { 
						props: {
							...props,
							lines: props.lines ?? undefined,
						}
					});
					
					// Check all elements for style attributes
					const allElements = container.querySelectorAll('*');
					for (const element of allElements) {
						if (element.hasAttribute('style')) {
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
