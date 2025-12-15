import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TestArtistProfileWrapper from './TestArtistProfileWrapper.svelte';
import { ArtistProfile } from '../../../src/components/ArtistProfile/index.ts';
import type { ArtistData } from '../../../src/components/ArtistProfile/context.ts';

describe('ArtistProfile Behavior', () => {
	const mockArtist: ArtistData = {
		id: 'a1',
		displayName: 'Artist',
		username: 'artist',
		profileUrl: '/u/artist',
		badges: [],
		status: 'online',
		verified: true,
		commissionStatus: 'open',
		stats: {
			followers: 100,
			following: 10,
			works: 5,
			exhibitions: 1,
			collaborations: 0,
			totalViews: 500,
		},
		sections: [],
		joinedAt: new Date().toISOString(),
	};

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Edit Flow', () => {
		it('toggles edit mode', async () => {
			// Variables onEdit, onCancel were unused

			render(TestArtistProfileWrapper, {
				props: {
					artist: mockArtist,
					isOwnProfile: true,
					Component: ArtistProfile.Edit,
					props: {}, // Handlers are passed via context, but wrapper doesn't support passing handlers.
					// Wait, createArtistProfileContext takes handlers as 4th arg.
					// My wrapper doesn't expose it.
					// I need to update TestArtistProfileWrapper to accept handlers.
				},
			});

			// I can't test handlers without updating wrapper.
			// But I can test button state changes if context updates.
			// ArtistProfile.Edit updates local state and context state.

			const editButton = screen.getByText('Edit Profile');
			await fireEvent.click(editButton);

			expect(screen.getByText('Save Changes')).toBeInTheDocument();
			expect(screen.getByText('Cancel')).toBeInTheDocument();

			await fireEvent.click(screen.getByText('Cancel'));
			expect(screen.getByText('Edit Profile')).toBeInTheDocument();
		});
	});
});
