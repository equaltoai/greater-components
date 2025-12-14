/**
 * Commission Store Tests
 *
 * Tests for commission store including:
 * - Step progression
 * - Status updates
 * - Validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCommissionStore } from '../../src/stores/commissionStore.js';
import { createMockAdapter, createMockTransportManager } from '../mocks/mockAdapter.js';
import { createMockCommission, createMockCommissionList } from '../mocks/mockCommission.js';

describe('CommissionStore', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;
	let mockTransport: ReturnType<typeof createMockTransportManager>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		mockTransport = createMockTransportManager();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('creates store with default state', () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'client',
				userId: 'user-1'
			});
			const state = store.get();

			expect(state.commissions).toEqual([]);
			expect(state.activeCommission).toBeNull();
			expect(state.role).toBe('client');
		});

		it('creates store with artist role', () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'artist',
				userId: 'user-1'
			});
			expect(store.get().role).toBe('artist');
		});
	});

	describe('Loading', () => {
		it('loads commissions', async () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'client',
				userId: 'user-1'
			});

			const commissions = createMockCommissionList(3);
			mockAdapter.query.mockResolvedValue({
				data: { commissions: { edges: commissions.map(c => ({ node: c })) } }
			});

			await store.loadCommissions();

			expect(store.get().commissions).toHaveLength(3);
			expect(mockAdapter.query).toHaveBeenCalledWith(expect.objectContaining({
				query: 'GetClientCommissions',
				variables: { userId: 'user-1' }
			}));
		});

		it('loads artist commissions', async () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'artist',
				userId: 'artist-1'
			});

			await store.loadCommissions();

			expect(mockAdapter.query).toHaveBeenCalledWith(expect.objectContaining({
				query: 'GetArtistCommissions'
			}));
		});
	});

	describe('Status Updates', () => {
		it('updates commission status', async () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'client',
				userId: 'user-1'
			});
			
			const commission = createMockCommission('1', { status: 'inquiry' });
			// Preload state
			mockAdapter.query.mockResolvedValueOnce({
				data: { commissions: { edges: [{ node: commission }] } }
			});
			await store.loadCommissions();

			mockAdapter.mutate.mockResolvedValue({ data: { success: true } });

			await store.updateStatus('1', 'quoted');

			expect(store.get().commissions[0].status).toBe('quoted');
			expect(mockAdapter.mutate).toHaveBeenCalledWith(expect.objectContaining({
				mutation: 'UpdateCommissionStatus',
				variables: { id: '1', status: 'quoted' }
			}));
		});

		it('rolls back on error', async () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'client',
				userId: 'user-1'
			});
			
			const commission = createMockCommission('1', { status: 'inquiry' });
			mockAdapter.query.mockResolvedValueOnce({
				data: { commissions: { edges: [{ node: commission }] } }
			});
			await store.loadCommissions();

			mockAdapter.mutate.mockRejectedValue(new Error('Update failed'));
			// Mock reload on rollback
			mockAdapter.query.mockResolvedValueOnce({
				data: { commissions: { edges: [{ node: commission }] } }
			});

			try {
				await store.updateStatus('1', 'quoted');
			} catch {
				// Expected
			}

			expect(store.get().commissions[0].status).toBe('inquiry');
		});
	});

	describe('Messaging', () => {
		it('adds message to commission', async () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'client',
				userId: 'user-1'
			});

			mockAdapter.mutate.mockResolvedValue({ data: { success: true } });
			mockAdapter.query.mockResolvedValue({ data: { commissions: { edges: [] } } }); // Reloads

			await store.addMessage('1', 'Hello');

			expect(mockAdapter.mutate).toHaveBeenCalledWith(expect.objectContaining({
				mutation: 'AddCommissionMessage',
				variables: { commissionId: '1', message: 'Hello' }
			}));
			expect(mockAdapter.query).toHaveBeenCalled(); // Should reload
		});
	});

	describe('Real-time Updates', () => {
		it('subscribes to streaming updates', () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'client',
				userId: 'user-1'
			});

			store.startStreaming();

			expect(mockTransport.subscribe).toHaveBeenCalledWith(
				'client:user-1:commissions',
				expect.any(Function)
			);
		});
		
		it('updates existing commission on event', async () => {
			const store = createCommissionStore({
				adapter: mockAdapter as any,
				transportManager: mockTransport as any,
				role: 'client',
				userId: 'user-1'
			});
			
			const commission = createMockCommission('1', { status: 'inquiry' });
			mockAdapter.query.mockResolvedValue({
				data: { commissions: { edges: [{ node: commission }] } }
			});
			await store.loadCommissions();
			
			// Mock subscribe to capture handler
			let capturedHandler: any;
			mockTransport.subscribe.mockImplementation((_, cb) => {
				capturedHandler = cb;
				return () => {};
			});
			
			store.startStreaming();
			
			const updatedCommission = { ...commission, status: 'quoted' };
			capturedHandler({ type: 'commission.updated', data: updatedCommission });
			
			expect(store.get().commissions[0].status).toBe('quoted');
		});

		                it('stops streaming on destroy', () => {
		                        const store = createCommissionStore({
		                                adapter: mockAdapter as any,
		                                transportManager: mockTransport as any,
		                                role: 'client',
		                                userId: 'user-1'
		                        });
		
		                        const unsubscribe = vi.fn();
		                        mockTransport.subscribe.mockReturnValue(unsubscribe);
		
		                        store.startStreaming();
		                        store.destroy();
		
		                        expect(unsubscribe).toHaveBeenCalled();
		                });
		
		                it('adds new commission on creation event', () => {
		                        const store = createCommissionStore({
		                                adapter: mockAdapter as any,
		                                transportManager: mockTransport as any,
		                                role: 'client',
		                                userId: 'user-1'
		                        });
		                        
		                        let capturedHandler: any;
		                        mockTransport.subscribe.mockImplementation((_, cb) => {
		                                capturedHandler = cb;
		                                return () => {};
		                        });
		
		                        store.startStreaming();
		
		                        const newCommission = createMockCommission('new-1');
		                        capturedHandler({ type: 'commission.created', data: newCommission });
		
		                        expect(store.get().commissions).toHaveLength(1);
		                        expect(store.get().commissions[0].id).toBe('new-1');
		                });
		
		                it('reloads on message event', () => {
		                        const store = createCommissionStore({
		                                adapter: mockAdapter as any,
		                                transportManager: mockTransport as any,
		                                role: 'client',
		                                userId: 'user-1'
		                        });
		                        
		                        let capturedHandler: any;
		                        mockTransport.subscribe.mockImplementation((_, cb) => {
		                                capturedHandler = cb;
		                                return () => {};
		                        });
		
		                        store.startStreaming();
		                        
		                        // Clear mock history from initial load if any
		                        mockAdapter.query.mockClear();
		
		                        capturedHandler({ type: 'commission.message', data: {} });
		
		                        expect(mockAdapter.query).toHaveBeenCalled();
		                });
		        });
		
		        describe('Active Commission', () => {
		                it('sets active commission', async () => {
		                        const store = createCommissionStore({
		                                adapter: mockAdapter as any,
		                                transportManager: mockTransport as any,
		                                role: 'client',
		                                userId: 'user-1'
		                        });
		                        const commission = createMockCommission('1');
		                        mockAdapter.query.mockResolvedValue({
		                                data: { commissions: { edges: [{ node: commission }] } }
		                        });
		                        await store.loadCommissions();
		
		                        store.setActiveCommission('1');
		                        expect(store.get().activeCommission?.id).toBe('1');
		
		                        store.setActiveCommission(null);
		                        expect(store.get().activeCommission).toBeNull();
		                });
		
		                it('updates active commission on status change', async () => {
		                        const store = createCommissionStore({
		                                adapter: mockAdapter as any,
		                                transportManager: mockTransport as any,
		                                role: 'client',
		                                userId: 'user-1'
		                        });
		                        const commission = createMockCommission('1', { status: 'inquiry' });
		                        mockAdapter.query.mockResolvedValue({
		                                data: { commissions: { edges: [{ node: commission }] } }
		                        });
		                        await store.loadCommissions();
		                        
		                        store.setActiveCommission('1');
		                        mockAdapter.mutate.mockResolvedValue({ data: { success: true } });
		
		                        await store.updateStatus('1', 'quoted');
		                        
		                        expect(store.get().activeCommission?.status).toBe('quoted');
		                });
		        });
		
		        describe('Error Handling', () => {
		                it('handles load errors', async () => {
		                        const store = createCommissionStore({
		                                adapter: mockAdapter as any,
		                                transportManager: mockTransport as any,
		                                role: 'client',
		                                userId: 'user-1'
		                        });
		                        mockAdapter.query.mockRejectedValue(new Error('Load failed'));
		
		                        await store.loadCommissions();
		
		                        expect(store.get().error).toBeTruthy();
		                        expect(store.get().loading).toBe(false);
		                });
		
		                it('handles message send errors', async () => {
		                        const store = createCommissionStore({
		                                adapter: mockAdapter as any,
		                                transportManager: mockTransport as any,
		                                role: 'client',
		                                userId: 'user-1'
		                        });
		                        mockAdapter.mutate.mockRejectedValue(new Error('Send failed'));
		
		                        try {
		                                await store.addMessage('1', 'Hi');
		                        } catch {
		                                // expected
		                        }
		
		                        expect(store.get().error).toBeTruthy();
		                        expect(store.get().error?.message).toBe('Send failed');
		                });
		        });});
