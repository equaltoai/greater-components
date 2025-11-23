import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Timeline from '../../../src/components/Profile/Timeline.svelte';
import * as contextModule from '../../../src/components/Profile/context';

// Mock the integration factories
vi.mock('../../../src/lib/integration', () => ({
    createGraphQLTimelineIntegration: vi.fn(() => ({
        store: {
            items: [],
            state: {
                loadingTop: false,
                loadingBottom: false,
                endReached: false,
                connected: true,
                error: null,
                unreadCount: 0
            },
            on: vi.fn(),
            off: vi.fn(),
        },
        state: { // Add state directly to integration mock
            loadingTop: false,
            loadingBottom: false,
            endReached: false,
            connected: true,
            error: null,
            unreadCount: 0
        },
        items: [], // items is also accessed directly
        connect: vi.fn().mockResolvedValue(undefined),
        disconnect: vi.fn(),
        loadNewer: vi.fn(),
        loadOlder: vi.fn(),
        destroy: vi.fn(),
    })),
    createTimelineIntegration: vi.fn(() => ({
        // ... similar mock
    }))
}));

// Mock Virtualizer to avoid issues with ResizeObserver etc
vi.mock('@tanstack/svelte-virtual', () => ({
    createVirtualizer: () => ({
        getVirtualItems: () => [],
        getTotalSize: () => 0,
    })
}));

// Mock adapter
const mockAdapter = {
	id: 'mock-adapter',
} as any;

describe('Profile.Timeline', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
        
        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // deprecated
                removeListener: vi.fn(), // deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
	});

	it('renders with direct props', () => {
		render(Timeline, {
			username: 'alice',
			adapter: mockAdapter,
		});

        // Since we are rendering the real component, we check for its container class
        // or something that indicates it rendered.
		const container = document.querySelector('.profile-timeline');
		expect(container).toBeTruthy();
	});

	it('renders with context', () => {
		vi.spyOn(contextModule, 'tryGetProfileContext').mockReturnValue({
			state: {
				profile: { username: 'bob' } as any,
			} as any,
			adapter: mockAdapter,
		} as any);

		render(Timeline, {});

		const container = document.querySelector('.profile-timeline');
		expect(container).toBeTruthy();
	});

	it('throws error if username missing', () => {
		vi.spyOn(contextModule, 'tryGetProfileContext').mockReturnValue({
			state: { profile: null } as any,
			adapter: mockAdapter,
		} as any);

        // Suppress console error from Svelte error boundary if any
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			render(Timeline, {});
		}).toThrow(/requires username/);
        
        consoleSpy.mockRestore();
	});

    it('throws error if adapter missing', () => {
		vi.spyOn(contextModule, 'tryGetProfileContext').mockReturnValue({
			state: { profile: { username: 'alice' } } as any,
			adapter: undefined,
		} as any);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			render(Timeline, {});
		}).toThrow(/requires adapter/);
        
        consoleSpy.mockRestore();
	});
});
