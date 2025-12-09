import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Spinner from '../src/components/Spinner.svelte';

describe('Spinner.svelte', () => {
	it('renders with default props', () => {
		const { getByRole } = render(Spinner);

		const spinner = getByRole('status');
		expect(spinner).toBeTruthy();
		expect(spinner.getAttribute('aria-label')).toBe('Loading');
		expect(spinner.className).toContain('gr-spinner');
		expect(spinner.className).toContain('gr-spinner--md');
		expect(spinner.className).toContain('gr-spinner--primary');
	});

	describe('size variants', () => {
		const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

		sizes.forEach((size) => {
			it(`applies size ${size} correctly`, () => {
				const { getByRole } = render(Spinner, { props: { size } });
				const spinner = getByRole('status');
				expect(spinner.className).toContain(`gr-spinner--${size}`);
			});
		});
	});

	describe('color variants', () => {
		const colors = ['primary', 'current', 'white', 'gray'] as const;

		colors.forEach((color) => {
			it(`applies color ${color} correctly`, () => {
				const { getByRole } = render(Spinner, { props: { color } });
				const spinner = getByRole('status');
				expect(spinner.className).toContain(`gr-spinner--${color}`);
			});
		});
	});

	it('uses custom label for accessibility', () => {
		const customLabel = 'Fetching data...';
		const { getByRole } = render(Spinner, { props: { label: customLabel } });

		const spinner = getByRole('status');
		expect(spinner.getAttribute('aria-label')).toBe(customLabel);
	});

	it('applies custom class name', () => {
		const { getByRole } = render(Spinner, { props: { class: 'custom-spinner' } });

		const spinner = getByRole('status');
		expect(spinner.className).toContain('custom-spinner');
	});

	it('renders SVG with correct size attributes', () => {
		const { container } = render(Spinner, { props: { size: 'lg' } });

		const svg = container.querySelector('svg');
		expect(svg).toBeTruthy();
		expect(svg?.getAttribute('width')).toBe('32');
		expect(svg?.getAttribute('height')).toBe('32');
	});

	it('has aria-hidden on SVG element', () => {
		const { container } = render(Spinner);

		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('aria-hidden')).toBe('true');
	});

	it('has visually hidden label text', () => {
		const { container } = render(Spinner, { props: { label: 'Loading content' } });

		const labelSpan = container.querySelector('.gr-spinner__label');
		expect(labelSpan).toBeTruthy();
		expect(labelSpan?.textContent).toBe('Loading content');
	});
});
