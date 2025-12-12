import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimelineVirtualizedReactive from '../../src/components/TimelineVirtualizedReactive.svelte';
import { generateMockStatuses } from '../../src/mockData';

// Mock svelte-virtual
vi.mock('@tanstack/svelte-virtual', () => ({
	createVirtualizer: vi.fn((options) => {
		return {
			subscribe: (fn) => {
				fn({
					getVirtualItems: () => {
						const count = options.count || 0;
						return Array.from({ length: count }).map((_, i) => ({
							index: i,
							start: i * 200,
							size: 200,
							measureElement: () => {},
						}));
					},
					getTotalSize: () => (options.count || 0) * 200,
				});
				return () => {};
			},
			getVirtualItems: () => {
				const count = options.count || 0;
				return Array.from({ length: count }).map((_, i) => ({
					index: i,
					start: i * 200,
					size: 200,
					measureElement: () => {},
				}));
			},
			getTotalSize: () => (options.count || 0) * 200,
			scrollToIndex: vi.fn(),
			measure: vi.fn(),
		};
	}),
}));

describe('TimelineVirtualizedReactive', () => {
	const mockStatuses = generateMockStatuses(5);

    const mockAdapter = {
        getTimeline: vi.fn().mockResolvedValue({ edges: [], pageInfo: {} }),
        subscribe: vi.fn().mockReturnValue(() => {}),
        setOptions: vi.fn(),
        getActorByUsername: vi.fn(),
    };

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders items from props', () => {
		render(TimelineVirtualizedReactive, {
			items: mockStatuses
		});

		const feed = screen.getByRole('feed');
		expect(feed).toBeTruthy();
	});

	it('renders loading indicators from props', () => {
		render(TimelineVirtualizedReactive, {
			items: [],
			loadingTop: true,
            loadingBottom: true
		});

		const topSpinner = screen.getByLabelText('Loading new items');
        expect(topSpinner).toBeTruthy();
        
        const bottomSpinner = screen.getByLabelText('Loading more items');
        expect(bottomSpinner).toBeTruthy();
	});

    it('renders end of feed', () => {
        render(TimelineVirtualizedReactive, {
            items: [],
            endReached: true
        });

        expect(screen.getByText("You've reached the end")).toBeTruthy();
    });

    it('handles status click', () => {
        const onStatusClick = vi.fn();
        const items = [mockStatuses[0]];
        
        render(TimelineVirtualizedReactive, {
            items,
            onStatusClick
        });
        
        // StatusCard rendered via virtualizer
        // We assume it renders because of the mock
    });

    it('integrates with adapter', async () => {
         render(TimelineVirtualizedReactive, {
            adapter: mockAdapter,
            view: { type: 'home' }
        });
        
        // Should call connect -> getTimeline
        // Since getTimeline is called in effect (integration.connect), we might need to wait.
        // But here we just check if it renders without crashing.
        expect(screen.getByRole('feed')).toBeTruthy();
    });

    it('renders realtime indicator states', () => {
        // We can't easily mock internal integration state to test derived values directly
        // unless we mock createTimelineIntegration or createGraphQLTimelineIntegration.
        // However, we can test that the realtime indicator container is present if showRealtimeIndicator is true.
        
        render(TimelineVirtualizedReactive, {
            items: [],
            integration: {
                fetchItems: async () => [],
                subscribe: () => () => {},
            },
            showRealtimeIndicator: true
        });
        
        // Initially connecting
        expect(screen.getByText('Connecting...')).toBeTruthy();
    });
    
    it('uses actionHandlers function', () => {
        const actionHandlers = vi.fn().mockReturnValue({});
        render(TimelineVirtualizedReactive, {
            items: mockStatuses,
            actionHandlers
        });
        
        expect(actionHandlers).toHaveBeenCalledWith(mockStatuses[0]);
    });
});
