import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import HistoryTestWrapper from './HistoryTestWrapper.svelte';
import type { CritiqueCircleContext } from '../../../../src/components/Community/CritiqueCircle/context.js';
import type { CritiqueCircleData } from '../../../../src/types/community.js';

describe('CritiqueCircle.History', () => {
	const mockArtwork = {
		id: '1',
		title: 'Test Artwork',
		description: 'Test Description',
		artist: { id: '1', name: 'Artist 1' },
		images: { thumbnail: 'thumb.jpg', full: 'full.jpg' },
		altText: 'Artwork Alt',
	};

	const mockHistoryItem = {
		id: '1',
		artwork: mockArtwork,
		critiques: [
			{ id: '1', authorName: 'Critic 1', summary: 'Great work', createdAt: '2023-01-01T10:00:00Z' },
			{
				id: '2',
				authorName: 'Critic 2',
				summary: 'Needs improvement',
				createdAt: '2023-01-01T11:00:00Z',
			},
		],
		submittedAt: new Date().toISOString(),
		isComplete: true,
		feedbackRequested: 'Please review lighting',
	};

	const mockHistoryItem2 = {
		id: '2',
		artwork: { ...mockArtwork, title: 'Another Artwork', artist: { id: '2', name: 'Artist 2' } },
		critiques: [],
		submittedAt: new Date().toISOString(),
		isComplete: false,
	};

	const mockCircle: CritiqueCircleData = {
		id: '1',
		name: 'Test Circle',
		description: 'Test Description',
		members: [],
		history: [mockHistoryItem, mockHistoryItem2],
		activeSession: null,
		queue: [],
		rules: [],
		schedule: { frequency: 'weekly', day: 'friday', time: '18:00', timezone: 'UTC' },
		stats: { sessionsHeld: 0, critiquesGiven: 0 },
		createdAt: new Date().toISOString(),
	};

	const mockContext: CritiqueCircleContext = {
		circle: mockCircle,
		config: {
			showQueue: true,
			showSession: true,
			showHistory: true,
			showMembers: true,
			enableAnonymousFeedback: true,
			enableRealtime: true,
			class: '',
		},
		handlers: {},
		membership: 'member',
		currentMember: null,
		session: {
			isActive: false,
			currentSubmission: null,
			timeRemaining: null,
			currentTurnHolder: null,
			canGiveFeedback: false,
		},
		queue: { userPosition: null, estimatedWaitTime: null, hasPriority: false },
		selectedHistoryItem: null,
		isSubmitting: false,
	};

	it('renders history list', () => {
		render(HistoryTestWrapper, { props: { context: mockContext } });
		expect(screen.getByText('Critique History')).toBeInTheDocument();
		expect(screen.getByText('Test Artwork')).toBeInTheDocument();
		expect(screen.getByText('Another Artwork')).toBeInTheDocument();
	});

	it('filters by search query', async () => {
		render(HistoryTestWrapper, { props: { context: mockContext } });
		const searchInput = screen.getByPlaceholderText('Search critiques...');
		await fireEvent.input(searchInput, { target: { value: 'Test Artwork' } });

		expect(screen.getByText('Test Artwork')).toBeInTheDocument();
		expect(screen.queryByText('Another Artwork')).not.toBeInTheDocument();
	});

	it('filters by artist name', async () => {
		render(HistoryTestWrapper, { props: { context: mockContext } });
		const searchInput = screen.getByPlaceholderText('Search critiques...');
		await fireEvent.input(searchInput, { target: { value: 'Artist 2' } });

		expect(screen.queryByText('Test Artwork')).not.toBeInTheDocument();
		expect(screen.getByText('Another Artwork')).toBeInTheDocument();
	});

	it('shows empty state when no matches', async () => {
		render(HistoryTestWrapper, { props: { context: mockContext } });
		const searchInput = screen.getByPlaceholderText('Search critiques...');
		await fireEvent.input(searchInput, { target: { value: 'Nonexistent' } });

		expect(screen.getByText('No critique history found.')).toBeInTheDocument();
	});

	it('renders selected item details', () => {
		const selectedContext = { ...mockContext, selectedHistoryItem: mockHistoryItem };
		render(HistoryTestWrapper, { props: { context: selectedContext } });

		expect(screen.getByRole('heading', { level: 4, name: 'Test Artwork' })).toBeInTheDocument();
		expect(screen.getByText('Please review lighting')).toBeInTheDocument();
		expect(screen.getByText('Great work')).toBeInTheDocument();
		expect(screen.getByText('Needs improvement')).toBeInTheDocument();
	});

	it('hides component when showHistory is false', () => {
		const hiddenContext = { ...mockContext, config: { ...mockContext.config, showHistory: false } };
		render(HistoryTestWrapper, { props: { context: hiddenContext } });
		expect(screen.queryByText('Critique History')).not.toBeInTheDocument();
	});

	it('switches filter tabs', async () => {
		render(HistoryTestWrapper, { props: { context: mockContext } });

		const receivedBtn = screen.getByText('Received');
		await fireEvent.click(receivedBtn);
		expect(receivedBtn).toHaveClass('active');

		const givenBtn = screen.getByText('Given');
		await fireEvent.click(givenBtn);
		expect(givenBtn).toHaveClass('active');
	});
});
