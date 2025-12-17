import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Queue from '../../../../src/components/Community/CritiqueCircle/Queue.svelte';
import * as ContextModule from '../../../../src/components/Community/CritiqueCircle/context.js';

vi.mock('../../../../src/components/Community/CritiqueCircle/context.js', async () => {
	const actual = await vi.importActual(
		'../../../../src/components/Community/CritiqueCircle/context.js'
	);
	return {
		...actual,
		getCritiqueCircleContext: vi.fn(),
		canSubmit: vi.fn(),
		formatWaitTime: vi.fn((m) => `${m} min`),
		calculateEstimatedWaitTime: vi.fn((pos) => pos * 10),
	};
});

describe('CritiqueCircle.Queue', () => {
	const mockHandlers = {
		onSubmit: vi.fn(),
	};

	const mockQueue = [
		{
			id: 'sub-1',
			artwork: {
				id: 'art-1',
				title: 'Artwork 1',
				altText: 'Alt 1',
				artist: { name: 'Artist 1' },
				images: { thumbnail: 'thumb1.jpg' },
			},
		},
	];

	const defaultContext = {
		circle: {
			queue: mockQueue,
		},
		config: {
			showQueue: true,
		},
		handlers: mockHandlers,
		isSubmitting: false,
		queue: {
			userPosition: null,
			estimatedWaitTime: null,
			hasPriority: false,
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(defaultContext);
		vi.mocked(ContextModule.canSubmit).mockReturnValue(true);
	});

	it('renders queue list items', () => {
		render(Queue);
		expect(screen.getByText('Critique Queue')).toBeInTheDocument();
		expect(screen.getByText('Artwork 1')).toBeInTheDocument();
		expect(screen.getByText('by Artist 1')).toBeInTheDocument();
		expect(screen.getByText('10 min')).toBeInTheDocument(); // 1 * 10
	});

	it('renders empty state when queue is empty', () => {
		const emptyContext = {
			...defaultContext,
			circle: { queue: [] },
		};
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(emptyContext);

		render(Queue);
		expect(screen.getByText('No artworks in queue. Be the first to submit!')).toBeInTheDocument();
	});

	it('hides component when showQueue is false', () => {
		const hiddenContext = {
			...defaultContext,
			config: { showQueue: false },
		};
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(hiddenContext);

		const { container } = render(Queue);
		expect(container.querySelector('.critique-queue')).not.toBeInTheDocument();
	});

	it('renders submission form when user can submit', () => {
		render(Queue);
		expect(screen.getByLabelText('Select Artwork')).toBeInTheDocument();
		expect(screen.getByText('Submit for Critique')).toBeInTheDocument();
	});

	it('hides submission form when user cannot submit', () => {
		vi.mocked(ContextModule.canSubmit).mockReturnValue(false);
		render(Queue);
		expect(screen.queryByLabelText('Select Artwork')).not.toBeInTheDocument();
	});

	it('handles valid submission', async () => {
		render(Queue);

		// Select artwork (manually setting value since options are not populated in this test)
		const select = screen.getByLabelText('Select Artwork');
		// Add an option to select
		const option = document.createElement('option');
		option.value = 'art-1';
		option.text = 'My Art';
		select.appendChild(option);

		await fireEvent.change(select, { target: { value: 'art-1' } });
		await fireEvent.input(screen.getByLabelText(/feedback/i), {
			target: { value: 'Feedback pls' },
		});

		await fireEvent.click(screen.getByText('Submit for Critique'));

		expect(mockHandlers.onSubmit).toHaveBeenCalledWith(
			defaultContext.circle,
			{ id: 'art-1' },
			'Feedback pls'
		);
	});

	it('prevents submission if no artwork selected', async () => {
		render(Queue);
		await fireEvent.click(screen.getByText('Submit for Critique'));
		expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
	});

	it('disables submit button while submitting', () => {
		const submittingContext = {
			...defaultContext,
			isSubmitting: true,
		};
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(submittingContext);

		render(Queue);
		const btn = screen.getByRole('button', { name: 'Submitting...' });
		expect(btn).toBeDisabled();
	});

	it('prevents submission if already submitting (double click prevention)', async () => {
		// We simulate isSubmitting being true in context
		const submittingContext = {
			...defaultContext,
			isSubmitting: true,
		};
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(submittingContext);

		render(Queue);
		// Even if we could click it (disabled attribute aside, maybe via enter key on form)
		// But the button is disabled.
		// Let's test the logic in handleSubmit directly by firing submit on form?
		const form = screen.getByRole('button', { name: 'Submitting...' }).closest('form');
		if (form) await fireEvent.submit(form);

		expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
	});

	it('renders user queue status', () => {
		const statusContext = {
			...defaultContext,
			queue: {
				userPosition: 5,
				estimatedWaitTime: 45,
				hasPriority: true,
			},
		};
		vi.mocked(ContextModule.getCritiqueCircleContext).mockReturnValue(statusContext);

		render(Queue);
		expect(screen.getByText('Your position:')).toBeInTheDocument();
		expect(screen.getByText('#5')).toBeInTheDocument();
		expect(screen.getByText('45 min')).toBeInTheDocument();
		expect(screen.getByText('Priority Queue')).toBeInTheDocument();
	});

	it('handles submit without feedback (optional)', async () => {
		render(Queue);

		const select = screen.getByLabelText('Select Artwork');
		const option = document.createElement('option');
		option.value = 'art-1';
		option.text = 'My Art';
		select.appendChild(option);
		await fireEvent.change(select, { target: { value: 'art-1' } });

		await fireEvent.click(screen.getByText('Submit for Critique'));

		expect(mockHandlers.onSubmit).toHaveBeenCalledWith(
			defaultContext.circle,
			{ id: 'art-1' },
			undefined
		);
	});

	it('handles styles', () => {
		const { container } = render(Queue, { props: { class: 'custom-class' } });
		expect(container.querySelector('.critique-queue')).toHaveClass('custom-class');
	});
});
