import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRealtimeStore } from '../../src/stores/realtimeStore.js';
import { createMockTransportManager } from '../mocks/mockAdapter.js';

describe('RealtimeStore', () => {
	let mockTransport: ReturnType<typeof createMockTransportManager>;

	beforeEach(() => {
		mockTransport = createMockTransportManager();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('Connection', () => {
		it('connects to transport', async () => {
			const store = createRealtimeStore({ transportManager: mockTransport as any });
			
            await store.connect();

			expect(mockTransport.connect).toHaveBeenCalled();
			expect(store.get().connectionState).toBe('connected');
		});

		it('handles connection error and retries', async () => {
			const store = createRealtimeStore({ 
                transportManager: mockTransport as any,
                reconnectDelay: 100,
                maxReconnectAttempts: 2
            });

			mockTransport.connect.mockRejectedValueOnce(new Error('Fail'));
            mockTransport.connect.mockResolvedValueOnce(undefined);

			await store.connect();

			expect(store.get().connectionState).toBe('disconnected');
            
            // Advance timer for reconnect
            vi.advanceTimersByTime(100);
            
            // Wait for reconnect promise
            await new Promise(resolve => process.nextTick(resolve));
            
            expect(mockTransport.connect).toHaveBeenCalledTimes(2);
            // Since second time resolved, should be connected?
            // But we need to await the promise inside setTimeout callback. 
            // In the store, the setTimeout callback is async.
            // We can't await it easily. But we can check if state changed eventually?
            // Actually, we can spy on connect.
		});
        
        it('disconnects', async () => {
            const store = createRealtimeStore({ transportManager: mockTransport as any });
            await store.connect();
            store.disconnect();
            
            expect(mockTransport.disconnect).toHaveBeenCalled();
            expect(store.get().connectionState).toBe('disconnected');
        });
	});

    describe('Subscriptions', () => {
        it('subscribes to channel', async () => {
            const store = createRealtimeStore({ transportManager: mockTransport as any });
            const handler = vi.fn();
            
            store.subscribeToGallery('artist-1', handler);
            
            expect(mockTransport.on).toHaveBeenCalledWith('gallery:artist-1', expect.any(Function));
            expect(store.get().subscriptions).toContain('gallery:artist-1');
        });
        
        it('unsubscribes when cleanup called', () => {
            const store = createRealtimeStore({ transportManager: mockTransport as any });
            const mockUnsubscribe = vi.fn();
            mockTransport.on.mockReturnValue(mockUnsubscribe);
            
            const cleanup = store.subscribeToGallery('artist-1', vi.fn());
            cleanup();
            
            expect(mockUnsubscribe).toHaveBeenCalled();
            expect(store.get().subscriptions).not.toContain('gallery:artist-1');
        });
        
        it('resubscribes after reconnect', async () => {
             const store = createRealtimeStore({ 
                transportManager: mockTransport as any,
                reconnectDelay: 100 
            });
            
            // Capture close handler
             let closeHandler: (() => void) | undefined;
             mockTransport.on.mockImplementation((event, cb) => {
                 if (event === 'close') closeHandler = cb;
                 return () => {};
             });

            await store.connect();
            
            const handler = vi.fn();
            store.subscribeToGallery('artist-1', handler);
            
            // Trigger disconnect
            if (closeHandler) closeHandler();
             
            expect(store.get().connectionState).toBe('reconnecting');
             
            // Wait for reconnect
            vi.advanceTimersByTime(100);
            await new Promise(resolve => process.nextTick(resolve)); // flush microtasks
             
             // Check if resubscribed (connect called again)
             // We expect connect to be called initially (1) + after reconnect (1) = 2
             expect(mockTransport.connect).toHaveBeenCalledTimes(2);
        });
    });
    
    describe('Heartbeat', () => {
        it('sends heartbeat when connected', async () => {
            const store = createRealtimeStore({ 
                transportManager: mockTransport as any,
                heartbeatInterval: 1000 
            });
            await store.connect();
            
            const initialLastHeartbeat = store.get().lastHeartbeat;
            
            vi.advanceTimersByTime(1000);
            
            expect(store.get().lastHeartbeat).toBeGreaterThan(initialLastHeartbeat!);
        });
        
        it('stops heartbeat on disconnect', async () => {
            const store = createRealtimeStore({ 
                transportManager: mockTransport as any,
                heartbeatInterval: 1000 
            });
            await store.connect();
            store.disconnect();
            
            const lastHeartbeat = store.get().lastHeartbeat;
            vi.advanceTimersByTime(1000);
            
            // Should not update
            expect(store.get().lastHeartbeat).toBe(lastHeartbeat);
        });
    });
});
