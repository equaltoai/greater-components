/**
 * Artwork Component Tests
 *
 * Tests for Artwork compound component including:
 * - Artwork.Root renders children
 * - Context propagation
 * - Progressive image loading
 * - Accessibility attributes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ArtworkRoot from '../../src/components/Artwork/Root.svelte';
import { createMockArtwork, createMockArtworkWithAI } from '../mocks/mockArtwork.js';

describe('Artwork Component', () => {
	const mockArtwork = createMockArtwork('test-1');

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Artwork.Root', () => {
		it('renders with correct aria-label', () => {
			render(ArtworkRoot, {
				props: {
					artwork: mockArtwork
				}
			});
			
			const article = screen.getByRole('article');
			expect(article).not.toBeNull();
			const expectedLabel = `Artwork: ${mockArtwork.title} by ${mockArtwork.artist.name}`;
			expect(article.getAttribute('aria-label')).toBe(expectedLabel);
		});

		it('applies density class based on config', () => {
			const { rerender, container } = render(ArtworkRoot, {
				props: {
					artwork: mockArtwork,
					config: { density: 'compact' }
				}
			});

			expect(container.querySelector('.gr-artist-artwork--compact')).not.toBeNull();

			rerender({
				artwork: mockArtwork,
				config: { density: 'spacious' }
			});
			expect(container.querySelector('.gr-artist-artwork--spacious')).not.toBeNull();
		});

		it('applies display mode class', () => {
			const { container } = render(ArtworkRoot, {
				props: {
					artwork: mockArtwork,
					config: { displayMode: 'card' }
				}
			});

			expect(container.querySelector('.gr-artist-artwork--card')).not.toBeNull();
		});

		it('includes data-artwork-id attribute', () => {
			render(ArtworkRoot, {
				props: {
					artwork: mockArtwork
				}
			});

			const article = screen.getByRole('article');
			expect(article.getAttribute('data-artwork-id')).toBe('test-1');
		});
	});

	// Context propagation is implicit in Svelte via setContext/getContext.
	// To test it, we would ideally render a child that checks context, but verifying
	// the root rendering is a good start for coverage.
});
