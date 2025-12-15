import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import CommunityTest from './CommunityTest.svelte';
import type { CritiqueCircleData } from '../../../src/types/community.js';

describe('Community Behavior', () => {
	const mockArtwork = {
		id: 'art1',
		title: 'Art 1',
		artistName: 'Artist 1',
		imageUrl: 'img.jpg',
		thumbnailUrl: 'thumb.jpg',
		createdAt: new Date().toISOString(),
		images: { standard: 'img.jpg' },
	};

	describe('CritiqueCircle', () => {
		const mockCircle: CritiqueCircleData = {
			id: 'cc1',
			name: 'Test Circle',
			members: [],
			queue: [],
			activeSession: {
				id: 'sub1',
				artwork: mockArtwork,
				submittedAt: new Date().toISOString(),
				status: 'critiquing',
				critiques: [],
				feedbackRequested: 'Colors',
			},
			history: [],
			isPublic: true,
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
