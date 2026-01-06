import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import * as fc from 'fast-check';
import Skeleton from '../src/components/Skeleton.svelte';
import SkeletonHarness from './harness/SkeletonHarness.svelte';

describe('Skeleton.svelte', () => {
	it('applies sizing styles and animation classes', () => {
		const { getByRole } = render(Skeleton, {
			props: { variant: 'rectangular', width: 'full', height: 'md', animation: 'wave' },
		});

		const skeleton = getByRole('status', { hidden: true });
		expect(skeleton.className).toContain('gr-skeleton--rectangular');
		expect(skeleton.className).toContain('gr-skeleton--wave');
		expect(skeleton.className).toContain('gr-skeleton--width-full');
		expect(skeleton.className).toContain('gr-skeleton--height-md');
		expect(skeleton.getAttribute('style')).toBeNull();
	});

	it('renders children when loading is false', () => {
		const { getByTestId } = render(SkeletonHarness, {
			props: { props: { loading: false } },
		});

		expect(getByTestId('skeleton-children').textContent).toContain('Loaded content');
	});

	describe('CSP Compliance - Property-Based Tests', () => {
		// Property 7: Skeleton default usage emits no style attribute
		// Feature: csp-baseline-and-primitives, Property 7
		// Validates: Requirements 3.1
		it('Property 7: default usage emits no style attribute', () => {
			fc.assert(
				fc.property(fc.constant({}), () => {
					const { container } = render(Skeleton);
					const skeleton = container.querySelector('.gr-skeleton');
					return skeleton !== null && !skeleton.hasAttribute('style');
				}),
				{ numRuns: 100 }
			);
		});

		// Property 8: Skeleton preset widths emit no style attribute
		// Feature: csp-baseline-and-primitives, Property 8
		// Validates: Requirements 3.2, 3.4
		it('Property 8: preset widths emit no style attribute', () => {
			fc.assert(
				fc.property(
					fc.constantFrom('full', '1/2', '1/3', '2/3', '1/4', '3/4', 'content', 'auto'),
					(width) => {
						const { container } = render(Skeleton, { props: { width } });
						const skeleton = container.querySelector('.gr-skeleton');
						return skeleton !== null && !skeleton.hasAttribute('style');
					}
				),
				{ numRuns: 100 }
			);
		});

		// Property 9: Skeleton preset heights emit no style attribute
		// Feature: csp-baseline-and-primitives, Property 9
		// Validates: Requirements 3.3, 3.5
		it('Property 9: preset heights emit no style attribute', () => {
			fc.assert(
				fc.property(fc.constantFrom('xs', 'sm', 'md', 'lg', 'xl', '2xl'), (height) => {
					const { container } = render(Skeleton, { props: { height } });
					const skeleton = container.querySelector('.gr-skeleton');
					return skeleton !== null && !skeleton.hasAttribute('style');
				}),
				{ numRuns: 100 }
			);
		});

		// Property 10: Skeleton ignores style prop
		// Feature: csp-baseline-and-primitives, Property 10
		// Validates: Requirements 3.7
		it('Property 10: ignores style prop', () => {
			fc.assert(
				fc.property(fc.string(), (styleValue) => {
					const { container } = render(Skeleton, { props: { style: styleValue } as any });
					const skeleton = container.querySelector('.gr-skeleton');
					return skeleton !== null && !skeleton.hasAttribute('style');
				}),
				{ numRuns: 100 }
			);
		});

		// Property 11: Skeleton universal CSP compliance
		// Feature: csp-baseline-and-primitives, Property 11
		// Validates: Requirements 7.1
		it('Property 11: universal CSP compliance across all prop combinations', () => {
			fc.assert(
				fc.property(
					fc.record({
						variant: fc.constantFrom('text', 'circular', 'rectangular', 'rounded'),
						width: fc.option(
							fc.constantFrom('full', '1/2', '1/3', '2/3', '1/4', '3/4', 'content', 'auto')
						),
						height: fc.option(fc.constantFrom('xs', 'sm', 'md', 'lg', 'xl', '2xl')),
						animation: fc.constantFrom('pulse', 'wave', 'none'),
						loading: fc.constant(true), // Only test when loading=true (skeleton is rendered)
					}),
					(props) => {
						const { container } = render(Skeleton, { props });
						const skeleton = container.querySelector('.gr-skeleton');
						return skeleton !== null && !skeleton.hasAttribute('style');
					}
				),
				{ numRuns: 100 }
			);
		});
	});
});
