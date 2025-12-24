import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ExhibitionTest from './ExhibitionTest.svelte';
import type { ExhibitionData } from '../../../src/types/curation.js';

describe('Exhibition Behavior', () => {
	const mockArtwork = {
		id: 'art1',
		title: 'Art 1',
		images: {
			thumbnail: 'thumb.jpg',
			preview: 'img.jpg',
			standard: 'img.jpg',
			full: 'img.jpg',
		},
		artist: {
			id: 'a1',
			name: 'Artist',
			username: 'artist',
		},
		metadata: {},
		stats: { views: 0, likes: 0, collections: 0, comments: 0 },
		altText: 'Art 1',
		createdAt: new Date().toISOString(),
	};

	const mockExhibition: ExhibitionData = {
		id: 'ex1',
		slug: 'expo-1',
		title: 'Expo 1',
		description: 'Desc',
		coverImage: 'cover.jpg',
		curator: { id: 'cur-1', name: 'Curator', isVerified: true },
		startDate: new Date().toISOString(),
		status: 'current',
		artworks: [mockArtwork],
		createdAt: new Date().toISOString(),
	};

	it('handles artwork click', async () => {
		const onArtworkClick = vi.fn();

		render(ExhibitionTest, {
			props: {
				exhibition: mockExhibition,
				handlers: { onArtworkClick },
				layout: 'gallery',
			},
		});

		const artBtn = screen.getByLabelText(/View Art 1/);
		await fireEvent.click(artBtn);

		expect(onArtworkClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'art1' }));
	});
});
