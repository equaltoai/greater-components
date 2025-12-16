import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import CommunityTest from './CommunityTest.svelte';
import type { CritiqueCircleData } from '../../../src/types/community.js';

describe('Community Behavior', () => {
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
			id: 'artist-1',
			name: 'Artist 1',
			username: 'artist1',
		},
		metadata: {},
		stats: { views: 0, likes: 0, collections: 0, comments: 0 },
		altText: 'Art 1',
		createdAt: new Date().toISOString(),
	};

	describe('CritiqueCircle', () => {
		const mockCircle: CritiqueCircleData = {
			id: 'cc1',
			name: 'Test Circle',
			description: 'A test critique circle',
			members: [],
			queue: [],
			activeSession: {
				id: 'sub1',
				artwork: mockArtwork,
				submitterId: 'artist-1',
				submittedAt: new Date().toISOString(),
				critiques: [],
				feedbackRequested: 'Colors',
				isComplete: false,
			},
			history: [],
			isPublic: true,
			createdAt: new Date().toISOString(),
		};

		it('allows submitting feedback when session is active', async () => {
			const onCritique = vi.fn();

			render(CommunityTest, {
				props: {
					component: 'CritiqueCircle',
					circle: mockCircle,
					membership: 'member',
					handlers: { onCritique },
				},
			});

			// Check session active
			expect(screen.getByText('Active Session')).toBeInTheDocument();
			expect(screen.getByText('Art 1')).toBeInTheDocument();

			// Submit feedback
			const textarea = screen.getByLabelText('Your Feedback');
			await fireEvent.input(textarea, { target: { value: 'Great colors!' } });

			const submitBtn = screen.getByText('Submit Feedback');
			await fireEvent.click(submitBtn);

			expect(onCritique).toHaveBeenCalled();
			expect(onCritique.mock.calls[0][2]).toBe('Great colors!');
		});
	});

	describe('MentorMatch', () => {
		it('filters mentors', async () => {
			const onSearch = vi.fn();

			render(CommunityTest, {
				props: {
					component: 'MentorMatch',
					mode: 'find-mentor',
					matches: [],
					handlers: { onSearch },
				},
			});

			const stylesInput = screen.getByLabelText('Art Styles');
			await fireEvent.input(stylesInput, { target: { value: 'digital' } });

			await waitFor(() => {
				expect(onSearch).toHaveBeenCalled();
				expect(onSearch.mock.calls[0][0].styles).toContain('digital');
			});
		});
	});
});
