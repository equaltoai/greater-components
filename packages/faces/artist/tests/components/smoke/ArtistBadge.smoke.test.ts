import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ArtistBadge from '../../../src/components/ArtistBadge.svelte';

describe('ArtistBadge', () => {
	it('renders correctly with default props', () => {
		const { container } = render(ArtistBadge, { props: { type: 'verified' } });
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button?.classList.contains('artist-badge--verified')).toBe(true);
	});

	it('renders with different types', () => {
		const { container } = render(ArtistBadge, { props: { type: 'educator' } });
		const button = container.querySelector('button');
		expect(button?.classList.contains('artist-badge--educator')).toBe(true);
	});

	it('shows tooltip on hover', async () => {
		render(ArtistBadge, { props: { type: 'verified', tooltip: 'Custom Tooltip' } });

		const button = screen.getByRole('button');

		// Tooltip hidden initially
		expect(screen.queryByText('Custom Tooltip')).toBeNull();

		// Mouse enter
		await fireEvent.mouseEnter(button);
		expect(screen.getByText('Custom Tooltip')).toBeTruthy();

		// Mouse leave
		await fireEvent.mouseLeave(button);
		expect(screen.queryByText('Custom Tooltip')).toBeNull();
	});

	it('shows tooltip on focus', async () => {
		render(ArtistBadge, { props: { type: 'verified' } });

		const button = screen.getByRole('button');

		// Focus
		await fireEvent.focus(button);
		expect(screen.getByText('Verified artist identity')).toBeTruthy(); // Default tooltip

		// Blur
		await fireEvent.blur(button);
		expect(screen.queryByText('Verified artist identity')).toBeNull();
	});

	it('renders custom class', () => {
		const { container } = render(ArtistBadge, {
			props: { type: 'verified', class: 'custom-class' },
		});
		const button = container.querySelector('button');
		expect(button?.classList.contains('custom-class')).toBe(true);
	});
});
