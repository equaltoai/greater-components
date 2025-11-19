import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
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
		expect(el?.classList.contains('gr-text--clamp')).toBe(true);
		expect(el?.getAttribute('style')).toContain('--gr-text-clamp-lines: 3');
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
