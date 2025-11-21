import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Heading from '../src/components/Heading.svelte';
import HeadingHarness from './harness/HeadingHarness.svelte';

describe('Heading.svelte', () => {
	// Semantic level tests
	it('renders as h1 when level=1', () => {
		const { container } = render(Heading, { level: 1 });
		expect(container.querySelector('h1')).toBeTruthy();
	});

	it('renders as h2 when level=2', () => {
		const { container } = render(Heading, { level: 2 });
		expect(container.querySelector('h2')).toBeTruthy();
	});

	it('renders as h3 when level=3', () => {
		const { container } = render(Heading, { level: 3 });
		expect(container.querySelector('h3')).toBeTruthy();
	});

	it('renders as h4 when level=4', () => {
		const { container } = render(Heading, { level: 4 });
		expect(container.querySelector('h4')).toBeTruthy();
	});

	it('renders as h5 when level=5', () => {
		const { container } = render(Heading, { level: 5 });
		expect(container.querySelector('h5')).toBeTruthy();
	});

	it('renders as h6 when level=6', () => {
		const { container } = render(Heading, { level: 6 });
		expect(container.querySelector('h6')).toBeTruthy();
	});

	// Size tests
	it('applies default size based on level', () => {
		// h1 -> 5xl
		const { container: c1 } = render(Heading, { level: 1 });
		expect(c1.querySelector('.gr-heading')?.classList.contains('gr-heading--size-5xl')).toBe(true);

		// h2 -> 4xl
		const { container: c2 } = render(Heading, { level: 2 });
		expect(c2.querySelector('.gr-heading')?.classList.contains('gr-heading--size-4xl')).toBe(true);

		// h3 -> 3xl
		const { container: c3 } = render(Heading, { level: 3 });
		expect(c3.querySelector('.gr-heading')?.classList.contains('gr-heading--size-3xl')).toBe(true);

		// h6 -> lg
		const { container: c6 } = render(Heading, { level: 6 });
		expect(c6.querySelector('.gr-heading')?.classList.contains('gr-heading--size-lg')).toBe(true);
	});

	it('overrides size when explicitly set', () => {
		const { container } = render(Heading, { level: 1, size: 'sm' });
		const el = container.querySelector('.gr-heading');
		expect(el?.classList.contains('gr-heading--size-sm')).toBe(true);
		expect(el?.classList.contains('gr-heading--size-5xl')).toBe(false);
	});

	// Weight tests
	it('applies bold weight by default', () => {
		const { container } = render(Heading, { level: 1 });
		const el = container.querySelector('.gr-heading');
		expect(el?.classList.contains('gr-heading--weight-bold')).toBe(true);
	});

	it('applies weight variants correctly', () => {
		const { container } = render(Heading, { level: 1, weight: 'normal' });
		const el = container.querySelector('.gr-heading');
		expect(el?.classList.contains('gr-heading--weight-normal')).toBe(true);
	});

	// Alignment tests
	it('aligns left by default', () => {
		const { container } = render(Heading, { level: 1 });
		const el = container.querySelector('.gr-heading');
		expect(el?.classList.contains('gr-heading--align-left')).toBe(true);
	});

	it('centers text when align=center', () => {
		const { container } = render(Heading, { level: 1, align: 'center' });
		const el = container.querySelector('.gr-heading');
		expect(el?.classList.contains('gr-heading--align-center')).toBe(true);
	});

	// Content tests
	it('renders content using harness', () => {
		const { getByText } = render(HeadingHarness, { level: 1, textContent: 'Test Heading' });
		expect(getByText('Test Heading')).toBeTruthy();
	});

	// Accessibility tests
	it('accepts id for anchor links', () => {
		const { container } = render(Heading, { level: 1, id: 'my-heading' });
		const el = container.querySelector('h1');
		expect(el?.getAttribute('id')).toBe('my-heading');
	});

	it('accepts aria-label override', () => {
		const { getByRole } = render(Heading, { level: 1, 'aria-label': 'Accessible Title' });
		expect(getByRole('heading', { name: 'Accessible Title' })).toBeTruthy();
	});

	it('defaults to base size for unknown level', () => {
		// @ts-expect-error - testing runtime behavior for invalid prop
		const { container } = render(Heading, { level: 7 });
		const el = container.querySelector('.gr-heading');
		expect(el?.classList.contains('gr-heading--size-base')).toBe(true);
	});
});
