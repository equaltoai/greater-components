import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ContextCoverageTest from './fixtures/ContextCoverageTest.svelte';
import { type ArtworkData } from '../../src/types/artwork.js';

describe('Artwork Context Coverage', () => {
	const mockArtwork: ArtworkData = {
		id: '1',
		title: 'Test Art',
		artistId: 'a1',
		medium: 'Oil',
		year: 2024,
		images: [],
	};

	it('provides context and merges config', () => {
		render(ContextCoverageTest, {
			props: {
				artwork: mockArtwork,
				config: { density: 'compact' },
				testMissingContext: false,
			},
		});

		expect(screen.getByTestId('has-context').textContent).toBe('true');
		expect(screen.getByTestId('config-density').textContent).toBe('compact');
		expect(screen.getByTestId('load-state').textContent).toBe('loading');
	});

	it('handles missing context', () => {
		// Suppress expected error log
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(ContextCoverageTest, {
			props: {
				artwork: mockArtwork,
				testMissingContext: true,
			},
		});

		expect(screen.getByTestId('has-context').textContent).toBe('false');

		consoleSpy.mockRestore();
	});

	it('createArtworkContext works with minimal args', () => {
		render(ContextCoverageTest, {
			props: {
				artwork: mockArtwork,
				// config and handlers undefined
			},
		});
		expect(screen.getByTestId('has-context').textContent).toBe('true');
	});

	it('updates context state', async () => {
		const { component } = render(ContextCoverageTest, {
			props: {
				artwork: mockArtwork,
				testMissingContext: false,
			},
		});

		// Use exported methods on the wrapper component
		(component as any).updateLoadState('loaded');

		// Check context object directly
		const ctx = (component as any).getContext();
		expect(ctx.imageLoadState).toBe('loaded');

		// Update resolution
		(component as any).updateResolution('full');
		expect(ctx.currentResolution).toBe('full');
	});
});
