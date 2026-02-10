import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimelineVirtualizedReactive from '../../src/components/TimelineVirtualizedReactive.svelte';
import { generateMockStatuses } from '../../src/mockData';
import { tick } from 'svelte';

// Mock svelte-virtual
vi.mock('@tanstack/svelte-virtual', () => ({
	createVirtualizer: vi.fn((options) => {
		return {
			subscribe: (fn: (val: unknown) => void) => {
				fn({
					getVirtualItems: () => {
						const count = options.count || 0;
						return Array.from({ length: count }).map((_, i) => ({
							index: i,
							key: i,
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
					key: i,
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

const mockConnect = vi.fn().mockResolvedValue(undefined);
const mockDisconnect = vi.fn();
const mockLoadNewer = vi.fn().mockResolvedValue(undefined);
const mockLoadOlder = vi.fn().mockResolvedValue(undefined);
const mockRefresh = vi.fn().mockResolvedValue(undefined);

const mockIntegrationState = {
	loadingTop: false,
	loadingBottom: false,
	endReached: false,
	connected: true,
	error: null as string | null,
	unreadCount: 0,
};

const mockIntegration = {
	connect: mockConnect,
	disconnect: mockDisconnect,
	loadNewer: mockLoadNewer,
	loadOlder: mockLoadOlder,
	refresh: mockRefresh,
	state: mockIntegrationState,
	items: generateMockStatuses(10),
};

vi.mock('../../src/lib/integration', async () => {
	return {
		createTimelineIntegration: vi.fn(() => mockIntegration),
		createGraphQLTimelineIntegration: vi.fn(() => mockIntegration),
	};
});

describe('TimelineVirtualizedReactive Interactions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIntegration.state = { ...mockIntegrationState };
		mockIntegration.items = generateMockStatuses(10);
	});

	it('handles sync click (loadNewer)', async () => {
		mockIntegration.state.unreadCount = 5;
		render(TimelineVirtualizedReactive, {
			integration: { baseUrl: 'https://example.com' } as any,
			showRealtimeIndicator: true,
		});

		const unreadButton = screen.getByText('5 new');
		await fireEvent.click(unreadButton);

		expect(mockLoadNewer).toHaveBeenCalled();
	});

	it('handles refresh click (refresh)', async () => {
		mockIntegration.state.error = 'Connection failed';
		mockIntegration.state.connected = false;

		render(TimelineVirtualizedReactive, {
			integration: { baseUrl: 'https://example.com' } as any,
			showRealtimeIndicator: true,
		});

		const retryButton = screen.getByText('Retry');
		await fireEvent.click(retryButton);

		expect(mockRefresh).toHaveBeenCalled();
	});

	it('handles scroll down (loadOlder)', async () => {
		const { container } = render(TimelineVirtualizedReactive, {
			integration: { baseUrl: 'https://example.com' } as any,
		});

		const scrollContainer = container.querySelector('.timeline-scroll');
		expect(scrollContainer).toBeTruthy();

		if (scrollContainer) {
			// Mock scroll properties
			Object.defineProperty(scrollContainer, 'scrollTop', { value: 1000, writable: true });
			Object.defineProperty(scrollContainer, 'scrollHeight', { value: 2000, writable: true });
			Object.defineProperty(scrollContainer, 'clientHeight', { value: 800, writable: true });

			// Trigger scroll event
			await fireEvent.scroll(scrollContainer);

			// Should call loadOlder because distance to bottom (2000 - 1000 - 800 = 200) < 500
			expect(mockLoadOlder).toHaveBeenCalled();
		}
	});

	it('handles scroll up (loadNewer)', async () => {
		const { container } = render(TimelineVirtualizedReactive, {
			integration: { baseUrl: 'https://example.com' } as any,
		});

		const scrollContainer = container.querySelector('.timeline-scroll');
		expect(scrollContainer).toBeTruthy();

		if (scrollContainer) {
			// Initial scroll state (scrolled down)
			// We need to simulate scrolling UP, so prevScrollTop must be higher than current scrollTop
			// The component tracks prevScrollTop internally. We can't easily set it.
			// However, initially prevScrollTop is 0.
			// If we scroll to 100, then scroll back to 50, it should trigger 'up'.

			// First scroll down to set prevScrollTop
			Object.defineProperty(scrollContainer, 'scrollTop', { value: 1000, writable: true });
			await fireEvent.scroll(scrollContainer);

			// Now scroll up to top
			Object.defineProperty(scrollContainer, 'scrollTop', { value: 100, writable: true });
			await fireEvent.scroll(scrollContainer);

			// Should call loadNewer because scrollTop (100) < 500
			expect(mockLoadNewer).toHaveBeenCalled();
		}
	});

	it('preserves scroll position when items are prepended', async () => {
		// This is tricky to test because it relies on $effect and requestAnimationFrame
		// We can verify that requestAnimationFrame is called when items length increases

		const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

		const { rerender } = render(TimelineVirtualizedReactive, {
			items: generateMockStatuses(5),
			integration: undefined,
		});

		// Wait for mount
		await tick();

		// Need to grab the scroll container to verify scrollTop adjustment
		const scrollContainer = document.querySelector('.timeline-scroll') as HTMLDivElement;
		if (scrollContainer) {
			Object.defineProperty(scrollContainer, 'scrollTop', { value: 50, writable: true });
			Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, writable: true });
		}

		// Update with more items
		await rerender({
			items: generateMockStatuses(10),
			integration: undefined,
		});

		await tick();

		expect(rafSpy).toHaveBeenCalled();
	});
});
