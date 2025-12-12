import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationsFeedReactive from '../../src/components/NotificationsFeedReactive.svelte';
import { generateMockNotifications } from '../../src/mockData';

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
							start: i * 100,
							size: 100,
							measureElement: () => {},
						}));
					},
					getTotalSize: () => (options.count || 0) * 100,
				});
				return () => {};
			},
			getVirtualItems: () => {
				const count = options.count || 0;
				return Array.from({ length: count }).map((_, i) => ({
					index: i,
					start: i * 100,
					size: 100,
					measureElement: () => {},
				}));
			},
			getTotalSize: () => (options.count || 0) * 100,
			scrollToIndex: vi.fn(),
			measure: vi.fn(),
		};
	}),
}));

// Mock integration
const mockIntegration = {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn(),
    loadMore: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    dismiss: vi.fn(),
    toggleGrouping: vi.fn(),
    refresh: vi.fn(),
    items: [],
    groups: [],
    state: {
        loading: false,
        loadingMore: false,
        hasMore: false,
        connected: false,
        error: null,
        unreadCount: 0,
        grouped: true
    }
};

vi.mock('../../src/lib/integration', async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        createNotificationIntegration: vi.fn(() => mockIntegration)
    };
});

describe('NotificationsFeedReactive', () => {
	const mockNotifications = generateMockNotifications(5);
	const mockGroups = [{ 
        id: 'g1', 
        notifications: [mockNotifications[0], mockNotifications[1]], 
        sampleNotification: mockNotifications[0], 
        key: 'k1', 
        type: 'favourite',
        accounts: [mockNotifications[0].account, mockNotifications[1].account],
        count: 2,
        latestCreatedAt: new Date().toISOString(),
        allRead: false
    }];

    const mockAdapter = {
        getNotifications: vi.fn().mockResolvedValue({ edges: [], pageInfo: {} }),
        markAsRead: vi.fn(),
        subscribe: vi.fn().mockReturnValue(() => {}),
        setOptions: vi.fn(),
    };

	beforeEach(() => {
		vi.clearAllMocks();
        // Reset mock integration state
        mockIntegration.items = [];
        mockIntegration.groups = [];
        mockIntegration.state.unreadCount = 0;
        mockIntegration.state.connected = false;
	});

	it('renders empty state when no notifications', () => {
		render(NotificationsFeedReactive, {
			notifications: [],
			loading: false
		});

		expect(screen.getByText('No notifications')).toBeTruthy();
		expect(screen.getByText('No notifications yet')).toBeTruthy();
	});

	it('renders loading state', () => {
		render(NotificationsFeedReactive, {
			notifications: [],
			loading: true
		});

		expect(screen.getByText('Loading notifications...')).toBeTruthy();
	});

	it('renders notifications list', async () => {
		render(NotificationsFeedReactive, {
			notifications: mockNotifications,
			grouped: false
		});
        
        const feed = screen.getByRole('feed');
        expect(feed).toBeTruthy();
	});

    it('renders grouped notifications', async () => {
        render(NotificationsFeedReactive, {
            notifications: [],
            groups: mockGroups as any,
            grouped: true
        });

        const feed = screen.getByRole('feed');
        expect(feed).toBeTruthy();
    });

    it('integrates with adapter', async () => {
        render(NotificationsFeedReactive, {
            adapter: mockAdapter as any,
        });
        
        // Should show empty state as adapter returns empty
        expect(screen.getByText('No notifications')).toBeTruthy();
    });

    it('renders realtime indicator states', () => {
         render(NotificationsFeedReactive, {
            notifications: [],
            integration: {
                fetchNotifications: async () => [],
                subscribe: () => () => {},
            } as any,
            showRealtimeIndicator: true
        });
        
        expect(screen.getByText('Connecting...')).toBeTruthy();
    });

    it('handles mark all as read', async () => {
        // Setup integration mock state
        mockIntegration.items = mockNotifications as any;
        mockIntegration.state.unreadCount = 5;
        
        render(NotificationsFeedReactive, {
            notifications: [],
            integration: {} as any
        });
        
        const button = screen.getByText('Mark all as read');
        await fireEvent.click(button);
        
        expect(mockIntegration.markAllAsRead).toHaveBeenCalled();
    });
});
