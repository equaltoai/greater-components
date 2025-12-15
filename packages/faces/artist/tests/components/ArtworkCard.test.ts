/**
 * ArtworkCard Component Tests
 *
 * Tests for ArtworkCard component behavior (Artwork.Root with displayMode='card')
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ArtworkRoot from '../../src/components/Artwork/Root.svelte';
import { createMockArtwork } from '../mocks/mockArtwork.js';

describe('ArtworkCard Component', () => {
	const mockArtwork = createMockArtwork('card-test-1');

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders as a card', () => {
		render(ArtworkRoot, {
			artwork: mockArtwork,
			config: { displayMode: 'card' },
		});

		const article = screen.getByRole('article');
		expect(article.classList.contains('gr-artist-artwork--card')).toBe(true);
		expect(article.getAttribute('aria-label')).toBe(
			`Artwork: ${mockArtwork.title} by ${mockArtwork.artist.name}`
		);
	});

	// Interaction tests are handled by specific subcomponents (Image, Actions) consuming the context.
	// Root is a layout container and does not handle clicks directly.

	it('supports different densities', () => {
		const { rerender, container } = render(ArtworkRoot, {
			artwork: mockArtwork,
			config: { displayMode: 'card', density: 'compact' },
		});

		expect(container.querySelector('.gr-artist-artwork--compact')).not.toBeNull();

		rerender({
			artwork: mockArtwork,
			config: { displayMode: 'card', density: 'spacious' },
		});

		expect(container.querySelector('.gr-artist-artwork--spacious')).not.toBeNull();
	});
});
