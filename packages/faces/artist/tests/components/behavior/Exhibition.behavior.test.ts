import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ExhibitionTest from './ExhibitionTest.svelte';
import type { ExhibitionData } from '../../src/types/exhibition.js';

describe('Exhibition Behavior', () => {
	const mockArtwork = {
		id: 'art1',
		title: 'Art 1',
		artistId: 'a1',
		artistName: 'Artist',
		imageUrl: 'img.jpg',
		thumbnailUrl: 'thumb.jpg',
		createdAt: new Date().toISOString(),
		images: { standard: 'img.jpg' },
	};

	const mockExhibition: ExhibitionData = {
		id: 'ex1',
		title: 'Expo 1',
		description: 'Desc',
		artistId: 'a1',
		artistName: 'Artist',
		coverImage: 'cover.jpg',
		startDate: new Date().toISOString(),
		status: 'published',
		artworks: [mockArtwork],
		layout: 'gallery',
	};

	it('handles artwork click', async () => {
		const onArtworkClick = vi.fn();
		
		render(ExhibitionTest, {
			props: {
				exhibition: mockExhibition,
				handlers: { onArtworkClick },
				layout: 'gallery',
			}
		});

		const artBtn = screen.getByLabelText(/View Art 1/);
		await fireEvent.click(artBtn);

		expect(onArtworkClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'art1' }));
	});
});
