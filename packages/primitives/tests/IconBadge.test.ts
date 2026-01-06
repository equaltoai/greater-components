import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import IconBadge from '../src/components/IconBadge.svelte';
import { CheckIcon } from '@equaltoai/greater-components-icons';

describe('IconBadge.svelte', () => {
	it('renders icon by default', () => {
		const { container } = render(IconBadge, { props: { icon: CheckIcon } });
		const svg = container.querySelector('svg');
		expect(svg).toBeTruthy();
	});

	it('applies sizes', () => {
		const sizes = ['sm', 'md', 'lg', 'xl'] as const;

		sizes.forEach((size) => {
			const { container } = render(IconBadge, { props: { icon: CheckIcon, size } });
			const badge = container.querySelector('.gr-icon-badge') as HTMLElement;
			expect(badge.classList.contains(`gr-icon-badge--size-${size}`)).toBe(true);
		});
	});

	it('applies colors', () => {
		const colors = ['primary', 'success', 'warning', 'error', 'gray'] as const;
		colors.forEach((color) => {
			const { container } = render(IconBadge, { props: { icon: CheckIcon, color } });
			const badge = container.querySelector('.gr-icon-badge');
			expect(badge?.classList.contains(`gr-icon-badge--${color}`)).toBe(true);
		});
	});

	it('applies shapes', () => {
		const shapes = ['circle', 'rounded', 'square'] as const;
		shapes.forEach((shape) => {
			const { container } = render(IconBadge, { props: { icon: CheckIcon, shape } });
			const badge = container.querySelector('.gr-icon-badge');
			expect(badge?.classList.contains(`gr-icon-badge--${shape}`)).toBe(true);
		});
	});

	it('applies variants', () => {
		const variants = ['filled', 'outlined', 'ghost'] as const;
		variants.forEach((variant) => {
			const { container } = render(IconBadge, { props: { icon: CheckIcon, variant } });
			const badge = container.querySelector('.gr-icon-badge');
			expect(badge?.classList.contains(`gr-icon-badge--${variant}`)).toBe(true);
		});
	});

	it('renders custom icon size', () => {
		// Hard to check SVG props directly without digging deep, but assuming prop passing works.
		// We can check if render doesn't crash.
		const { container } = render(IconBadge, { props: { icon: CheckIcon, iconSize: 50 } });
		const svg = container.querySelector('svg');
		expect(svg).toBeTruthy();
		// Can check attribute if Svelte rendered it
		expect(svg?.getAttribute('width')).toBe('50');
	});
});
