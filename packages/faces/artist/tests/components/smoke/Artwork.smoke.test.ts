import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ArtworkContextWrapper from './ArtworkContextWrapper.svelte';
import { Artwork } from '../../../src/components/Artwork/index.ts';
import { createMockArtwork } from '../../mocks/mockArtwork.ts';

describe('Artwork Component Smoke Tests', () => {
	const mockArtwork = createMockArtwork('smoke-1');

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Subcomponents (with Context)', () => {
		const components = [
			{ name: 'Image', Component: Artwork.Image, role: 'img' },
			{ name: 'Title', Component: Artwork.Title, role: 'heading' },
			{ name: 'Attribution', Component: Artwork.Attribution, role: 'link' }, // Artist link
			{ name: 'Metadata', Component: Artwork.Metadata, role: null }, // might be list or div
			{ name: 'Stats', Component: Artwork.Stats, role: null },
			{ name: 'Actions', Component: Artwork.Actions, role: 'button' }, // Usually has buttons
			{ name: 'AIDisclosure', Component: Artwork.AIDisclosure, role: null },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(ArtworkContextWrapper, {
				props: {
					artwork: mockArtwork,
					Component: Component,
					props: {},
				},
			});

			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Root Component', () => {
		it('renders Root without errors', () => {
			render(Artwork.Root, {
				props: {
					artwork: mockArtwork,
				},
			});

			const article = screen.getByRole('article');
			expect(article).toBeInTheDocument();
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
