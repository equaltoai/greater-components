import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Session from '../../../../src/components/Community/CritiqueCircle/Session.svelte';
import * as ContextModule from '../../../../src/components/Community/CritiqueCircle/context.js';

vi.mock('../../../../src/components/Community/CritiqueCircle/context.js', async () => {
	const actual = await vi.importActual(
		'../../../../src/components/Community/CritiqueCircle/context.js'
	);
	return {
		...actual,
		getCritiqueCircleContext: vi.fn(),
		canCritique: vi.fn(),
	};
});

describe('CritiqueCircle.Session', () => {
	const mockHandlers = {
		onCritique: vi.fn(),
	};

	const mockSubmission = {
		id: 'sub-1',
		artwork: {
			id: 'art-1',
			title: 'Active Artwork',
			altText: 'Alt 1',
			artist: { name: 'Active Artist' },
			images: { standard: 'active.jpg' },
		},
		feedbackRequested: 'Please check composition',
		critiques: [
			{
				id: 'c1',
				authorName: 'Critic 1',
				createdAt: new Date().toISOString(),
				summary: 'Great work!',
			},
		],
	};

	const defaultContext = {
		session: {
			isActive: true,
			currentSubmission: mockSubmission,
			timeRemaining: 300, // 5 mins
			canGiveFeedback: true,
		},
		config: {
			showSession: true,
			enableAnonymousFeedback: true,
		},
		handlers: mockHandlers,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(defaultContext);
		vi.mocked(ContextModule.canCritique).mockReturnValue(true);
	});

	it('renders active session', () => {
		render(Session);
		expect(screen.getByText('Active Session')).toBeInTheDocument();
		expect(screen.getByText('Active Artwork')).toBeInTheDocument();
		expect(screen.getByText('by Active Artist')).toBeInTheDocument();
		expect(screen.getByText('5:00')).toBeInTheDocument();
		expect(screen.getByText('Please check composition')).toBeInTheDocument();
	});

	it('renders empty state when no active session', () => {
		const emptyContext = {
			...defaultContext,
			session: { ...defaultContext.session, isActive: false, currentSubmission: null },
		};
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(emptyContext);
		render(Session);
		expect(screen.getByText('No active critique session.')).toBeInTheDocument();
	});

	it('submits feedback', async () => {
		render(Session);
		const textarea = screen.getByLabelText('Your Feedback');
		await fireEvent.input(textarea, { target: { value: 'Good composition.' } });
		await fireEvent.click(screen.getByText('Submit Feedback'));

		expect(mockHandlers.onCritique).toHaveBeenCalledWith(mockSubmission, [], 'Good composition.');
	});

	it('displays existing critiques', () => {
		render(Session);
		expect(screen.getByText('Feedback Received (1)')).toBeInTheDocument();
		expect(screen.getByText('Great work!')).toBeInTheDocument();
		expect(screen.getByText('Critic 1')).toBeInTheDocument();
	});

	it('shows checkbox for anonymous feedback', () => {
		render(Session);
		expect(screen.getByLabelText('Submit anonymously')).toBeInTheDocument();
	});
});
