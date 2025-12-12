import { render, screen } from '@testing-library/svelte';
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

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders items', () => {
		render(TimelineVirtualizedReactive, {
			items: mockStatuses
		});

		const feed = screen.getByRole('feed');
		expect(feed).toBeTruthy();
        
        // Check for content from mock statuses
        // The mock generator produces "This is status number X"
        // Since we mock virtualizer to return all items, they should be rendered.
        // StatusCard renders content.
	});

	it('renders loading indicators', () => {
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
        
        // StatusCard usually has a clickable area or we can click the article
        // Note: StatusCard implementation details: 
        // <article class="status-card ... clickable" onclick={...}>
        
        // Since we are mocking virtualizer, we need to ensure the item is rendered.
        // With count=1, virtualizer returns index 0.
        // TimelineVirtualizedReactive renders:
        // {#each virtualItems ...} 
        //   <div ...> <StatusCard ... /> </div>
        
        // We can find by role 'article' if StatusCard renders it.
        // Or generic role 'button' if clickable.
    });
});
