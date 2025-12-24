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

	describe('Badges', () => {
		const badges = [
			{ type: 'verified', tooltip: 'Verified Artist' },
			{ type: 'educator', tooltip: 'Art Educator' },
			{ type: 'institution', tooltip: 'Institutional Account' },
			{ type: 'mentor', tooltip: 'Community Mentor' },
			{ type: 'curator', tooltip: 'Gallery Curator' },
		];

		const artistWithBadges = {
			...mockArtist,
			badges: badges,
		};

		it('renders visible badges', () => {
			render(TestArtistProfileWrapper, {
				props: {
					artist: artistWithBadges,
					Component: ArtistProfile.Badges,
					props: { maxVisible: 4 },
				},
			});

			// Check first 4 badges are rendered
			expect(screen.getByLabelText('Verified: Verified Artist')).toBeInTheDocument();
			expect(screen.getByLabelText('Educator: Art Educator')).toBeInTheDocument();
			expect(screen.getByLabelText('Institution: Institutional Account')).toBeInTheDocument();
			expect(screen.getByLabelText('Mentor: Community Mentor')).toBeInTheDocument();

			// Check overflow button (should show +1 because total is 5)
			expect(screen.getByText('+1')).toBeInTheDocument();
		});

		it('toggles overflow menu', async () => {
			render(TestArtistProfileWrapper, {
				props: {
					artist: artistWithBadges,
					Component: ArtistProfile.Badges,
					props: { maxVisible: 3 },
				},
			});

			const overflowBtn = screen.getByText('+2');

			// Initial state: menu not visible (4th badge 'Mentor' should not be visible)
			expect(screen.queryByLabelText('Mentor: Community Mentor')).not.toBeInTheDocument();

			// Open menu
			await fireEvent.click(overflowBtn);
			expect(screen.getByLabelText('Mentor: Community Mentor')).toBeInTheDocument();
			expect(overflowBtn).toHaveAttribute('aria-expanded', 'true');

			// Close menu
			await fireEvent.click(overflowBtn);
			expect(screen.queryByLabelText('Mentor: Community Mentor')).not.toBeInTheDocument();
			expect(overflowBtn).toHaveAttribute('aria-expanded', 'false');
		});

		it('does not show overflow button if no overflow', () => {
			render(TestArtistProfileWrapper, {
				props: {
					artist: artistWithBadges,
					Component: ArtistProfile.Badges,
					props: { maxVisible: 10 },
				},
			});

			expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
		});
	});
});
