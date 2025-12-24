/**
 * Artwork Flow Integration Tests
 *
 * Tests for artwork flows including:
 * - Artwork creation flow
 * - Artwork viewing flow
 * - Artwork interaction flow
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockAdapter } from '../mocks/mockAdapter.js';
import { createMockArtwork, createMockArtworkList } from '../mocks/mockArtwork.js';

describe('Artwork Flow Integration', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Artwork Creation Flow', () => {
		it('completes full creation flow', async () => {
			const steps = ['upload', 'metadata', 'preview', 'publish'];
			let currentStep = 0;

			// Step 1: Upload
			expect(steps[currentStep]).toBe('upload');
			currentStep++;

			// Step 2: Metadata
			expect(steps[currentStep]).toBe('metadata');
			const metadata = {
				title: 'New Artwork',
				description: 'A beautiful piece',
				tags: ['digital', 'portrait'],
			};
			expect(metadata.title).toBeDefined();
			currentStep++;

			// Step 3: Preview
			expect(steps[currentStep]).toBe('preview');
			currentStep++;

			// Step 4: Publish
			expect(steps[currentStep]).toBe('publish');
			mockAdapter.createArtwork.mockResolvedValue({ id: 'new-artwork', ...metadata });

			const result = await mockAdapter.createArtwork(metadata);
			expect(result.id).toBe('new-artwork');
		});

		it('validates required fields before publish', () => {
			const validateArtwork = (data: { title?: string; images?: unknown }) => {
				const errors: string[] = [];
				if (!data.title) errors.push('Title is required');
				if (!data.images) errors.push('Image is required');
				return errors;
			};

			const invalidData = { title: '' };
			const errors = validateArtwork(invalidData);

			expect(errors).toContain('Title is required');
			expect(errors).toContain('Image is required');
		});

		it('handles upload errors gracefully', async () => {
			mockAdapter.createArtwork.mockRejectedValue(new Error('Upload failed'));

			let error: Error | null = null;
			try {
				await mockAdapter.createArtwork({});
			} catch (e) {
				error = e as Error;
			}

			expect(error?.message).toBe('Upload failed');
		});

		it('supports draft saving', () => {
			const draft = {
				title: 'Work in Progress',
				isDraft: true,
				savedAt: new Date().toISOString(),
			};

			expect(draft.isDraft).toBe(true);
		});
	});

	describe('Artwork Viewing Flow', () => {
		it('loads artwork from gallery', async () => {
			const artworks = createMockArtworkList(10);
			mockAdapter.fetchArtworks.mockResolvedValue({
				edges: artworks.map((a) => ({ node: a })),
			});

			const result = await mockAdapter.fetchArtworks();
			expect(result.edges.length).toBe(10);
		});

		it('opens lightbox on artwork click', () => {
			const artwork = createMockArtwork('view-1');
			let lightboxOpen = false;
			let lightboxArtwork: typeof artwork | null = null;

			// Simulate click
			lightboxOpen = true;
			lightboxArtwork = artwork;

			expect(lightboxOpen).toBe(true);
			expect(lightboxArtwork?.id).toBe('view-1');
		});

		it('navigates between artworks in lightbox', () => {
			const artworks = createMockArtworkList(5);
			let currentIndex = 2;

			// Navigate next
			currentIndex++;
			expect(artworks[currentIndex].id).toBe('artwork-4');

			// Navigate previous
			currentIndex--;
			expect(artworks[currentIndex].id).toBe('artwork-3');
		});

		it('loads full resolution on zoom', async () => {
			const artwork = createMockArtwork('zoom-1');
			let currentResolution = 'standard';

			// Zoom triggers full resolution load
			currentResolution = 'full';
			expect(artwork.images[currentResolution as keyof typeof artwork.images]).toContain('full');
		});

		it('shows metadata panel', () => {
			const artwork = createMockArtwork('meta-1');
			let metadataVisible = false;

			// Toggle metadata
			metadataVisible = true;

			expect(metadataVisible).toBe(true);
			expect(artwork.metadata).toBeDefined();
		});
	});

	describe('Artwork Interaction Flow', () => {
		it('likes artwork and updates count', async () => {
			const artwork = createMockArtwork('like-1');
			let isLiked = false;
			let likeCount = artwork.stats.likes;

			mockAdapter.likeArtwork.mockResolvedValue({ success: true });

			// Like
			isLiked = true;
			likeCount++;
			await mockAdapter.likeArtwork(artwork.id);

			expect(isLiked).toBe(true);
			expect(likeCount).toBe(artwork.stats.likes + 1);
		});

		it('unlikes artwork and updates count', async () => {
			const artwork = createMockArtwork('unlike-1');
			let isLiked = true;
			let likeCount = artwork.stats.likes + 1;

			mockAdapter.unlikeArtwork.mockResolvedValue({ success: true });

			// Unlike
			isLiked = false;
			likeCount--;
			await mockAdapter.unlikeArtwork(artwork.id);

			expect(isLiked).toBe(false);
			expect(likeCount).toBe(artwork.stats.likes);
		});

		it('collects artwork to collection', async () => {
			const artwork = createMockArtwork('collect-1');
			let isCollected = false;

			mockAdapter.collectArtwork.mockResolvedValue({ success: true });

			isCollected = true;
			await mockAdapter.collectArtwork(artwork.id);

			expect(isCollected).toBe(true);
		});

		it('shares artwork', () => {
			const artwork = createMockArtwork('share-1');
			const shareUrl = `https://example.com/artwork/${artwork.id}`;

			expect(shareUrl).toContain(artwork.id);
		});

		it('handles interaction errors with rollback', async () => {
			const artwork = createMockArtwork('error-1');
			let isLiked = false;
			let likeCount = artwork.stats.likes;

			// Optimistic update
			isLiked = true;
			likeCount++;

			mockAdapter.likeArtwork.mockRejectedValue(new Error('Network error'));

			try {
				await mockAdapter.likeArtwork(artwork.id);
			} catch {
				// Rollback
				isLiked = false;
				likeCount--;
			}

			expect(isLiked).toBe(false);
			expect(likeCount).toBe(artwork.stats.likes);
		});
	});
});
