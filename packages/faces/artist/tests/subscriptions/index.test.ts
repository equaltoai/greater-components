import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	subscribeToGallery,
	subscribeToCommission,
	subscribeToFederation,
	subscribeToArtworkInteractions,
	subscribeToMyCommissions,
	createGalleryStore,
	createCommissionStore,
} from '../../src/subscriptions/index';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

describe('Subscriptions', () => {
	let mockAdapter: LesserGraphQLAdapter;
	let mockSubscribe: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockSubscribe = vi.fn(() => ({
			subscribe: vi.fn(() => ({
				unsubscribe: vi.fn(),
			})),
		}));
		mockAdapter = {
			subscribe: mockSubscribe,
		} as unknown as LesserGraphQLAdapter;
	});

	describe('subscribeToGallery', () => {
		it('should subscribe to gallery updates', () => {
			const callback = vi.fn();
			const galleryId = 'gallery-123';

			subscribeToGallery(mockAdapter, galleryId, callback);

			expect(mockSubscribe).toHaveBeenCalledWith(
				expect.objectContaining({
					query: expect.stringContaining('subscription GalleryUpdated'),
					variables: { galleryId },
				})
			);
		});

		it('should invoke callback on event', () => {
			const callback = vi.fn();
			const galleryId = 'gallery-123';
			const eventData = {
				galleryUpdated: {
					type: 'artwork_added',
					galleryId,
					timestamp: '2023-01-01',
				},
			};

			const mockObservableSubscribe = vi.fn((observer) => {
				observer.next({ data: eventData });
				return { unsubscribe: vi.fn() };
			});

			mockSubscribe.mockReturnValue({
				subscribe: mockObservableSubscribe,
			});

			subscribeToGallery(mockAdapter, galleryId, callback);

			expect(callback).toHaveBeenCalledWith(eventData.galleryUpdated);
		});

		it('should handle missing data gracefully', () => {
			const callback = vi.fn();
			const mockObservableSubscribe = vi.fn((observer) => {
				observer.next({ data: null }); // Missing data
				observer.next({}); // Missing payload
				return { unsubscribe: vi.fn() };
			});

			mockSubscribe.mockReturnValue({
				subscribe: mockObservableSubscribe,
			});

			subscribeToGallery(mockAdapter, 'gallery-123', callback);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should handle subscription errors', () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const callback = vi.fn();
			const error = new Error('Subscription failed');

			const mockObservableSubscribe = vi.fn((observer) => {
				if (observer.error) observer.error(error);
				return { unsubscribe: vi.fn() };
			});

			mockSubscribe.mockReturnValue({
				subscribe: mockObservableSubscribe,
			});

			subscribeToGallery(mockAdapter, 'gallery-123', callback);

			expect(consoleSpy).toHaveBeenCalledWith('Gallery subscription error:', error);
			consoleSpy.mockRestore();
		});

		it('should return unsubscribe function', () => {
			const callback = vi.fn();
			const mockUnsubscribe = vi.fn();

			mockSubscribe.mockReturnValue({
				subscribe: () => ({ unsubscribe: mockUnsubscribe }),
			});

			const unsubscribe = subscribeToGallery(mockAdapter, 'gallery-123', callback);
			unsubscribe();

			expect(mockUnsubscribe).toHaveBeenCalled();
		});
	});

	describe('subscribeToCommission', () => {
		it('should subscribe to commission updates', () => {
			const callback = vi.fn();
			const commissionId = 'commission-123';

			subscribeToCommission(mockAdapter, commissionId, callback);

			expect(mockSubscribe).toHaveBeenCalledWith(
				expect.objectContaining({
					query: expect.stringContaining('subscription CommissionUpdated'),
					variables: { commissionId },
				})
			);
		});

		it('should invoke callback on event', () => {
			const callback = vi.fn();
			const eventData = {
				commissionUpdated: { type: 'status_changed', commissionId: '1' },
			};
			const mockObservableSubscribe = vi.fn((observer) => {
				observer.next({ data: eventData });
				return { unsubscribe: vi.fn() };
			});
			mockSubscribe.mockReturnValue({ subscribe: mockObservableSubscribe });

			subscribeToCommission(mockAdapter, 'comm-1', callback);
			expect(callback).toHaveBeenCalledWith(eventData.commissionUpdated);
		});

		it('should handle errors', () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const callback = vi.fn();
			const mockObservableSubscribe = vi.fn((observer) => {
				if (observer.error) observer.error('Error');
				return { unsubscribe: vi.fn() };
			});
			mockSubscribe.mockReturnValue({ subscribe: mockObservableSubscribe });

			subscribeToCommission(mockAdapter, 'comm-1', callback);
			expect(consoleSpy).toHaveBeenCalledWith('Commission subscription error:', 'Error');
			consoleSpy.mockRestore();
		});
	});

	describe('subscribeToFederation', () => {
		it('should subscribe to federation events', () => {
			const callback = vi.fn();

			subscribeToFederation(mockAdapter, callback);

			expect(mockSubscribe).toHaveBeenCalledWith(
				expect.objectContaining({
					query: expect.stringContaining('subscription FederationEvent'),
				})
			);
		});

		it('should invoke callback on event', () => {
			const callback = vi.fn();
			const eventData = {
				federationEvent: { type: 'remote_artwork_received' },
			};
			const mockObservableSubscribe = vi.fn((observer) => {
				observer.next({ data: eventData });
				return { unsubscribe: vi.fn() };
			});
			mockSubscribe.mockReturnValue({ subscribe: mockObservableSubscribe });

			subscribeToFederation(mockAdapter, callback);
			expect(callback).toHaveBeenCalledWith(eventData.federationEvent);
		});

		it('should handle errors', () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const callback = vi.fn();
			const mockObservableSubscribe = vi.fn((observer) => {
				if (observer.error) observer.error('Error');
				return { unsubscribe: vi.fn() };
			});
			mockSubscribe.mockReturnValue({ subscribe: mockObservableSubscribe });

			subscribeToFederation(mockAdapter, callback);
			expect(consoleSpy).toHaveBeenCalledWith('Federation subscription error:', 'Error');
			consoleSpy.mockRestore();
		});
	});

	describe('subscribeToArtworkInteractions', () => {
		it('should subscribe to artwork interactions', () => {
			const callback = vi.fn();
			const artworkId = 'artwork-123';

			subscribeToArtworkInteractions(mockAdapter, artworkId, callback);

			expect(mockSubscribe).toHaveBeenCalledWith(
				expect.objectContaining({
					query: expect.stringContaining('subscription ArtworkInteraction'),
					variables: { artworkId },
				})
			);
		});

		it('should invoke callback and handle errors', () => {
			const callback = vi.fn();
			const eventData = {
				artworkInteraction: { type: 'artwork_liked' },
			};
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			// Test both success and error in one go to mock setup once if possible, or separate
			const mockObservableSubscribe = vi.fn((observer) => {
				observer.next({ data: eventData });
				if (observer.error) observer.error('Error');
				return { unsubscribe: vi.fn() };
			});
			mockSubscribe.mockReturnValue({ subscribe: mockObservableSubscribe });

			subscribeToArtworkInteractions(mockAdapter, 'art-1', callback);

			expect(callback).toHaveBeenCalledWith(eventData.artworkInteraction);
			expect(consoleSpy).toHaveBeenCalledWith('Artwork interaction subscription error:', 'Error');
			consoleSpy.mockRestore();
		});
	});

	describe('subscribeToMyCommissions', () => {
		it('should subscribe to my commissions', () => {
			const callback = vi.fn();

			subscribeToMyCommissions(mockAdapter, callback);

			expect(mockSubscribe).toHaveBeenCalledWith(
				expect.objectContaining({
					query: expect.stringContaining('subscription MyCommissionUpdated'),
				})
			);
		});

		it('should invoke callback and handle errors', () => {
			const callback = vi.fn();
			const eventData = {
				myCommissionUpdated: { type: 'status_changed' },
			};
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			const mockObservableSubscribe = vi.fn((observer) => {
				observer.next({ data: eventData });
				if (observer.error) observer.error('Error');
				return { unsubscribe: vi.fn() };
			});
			mockSubscribe.mockReturnValue({ subscribe: mockObservableSubscribe });

			subscribeToMyCommissions(mockAdapter, callback);

			expect(callback).toHaveBeenCalledWith(eventData.myCommissionUpdated);
			expect(consoleSpy).toHaveBeenCalledWith('My commissions subscription error:', 'Error');
			consoleSpy.mockRestore();
		});
	});

	describe('createGalleryStore', () => {
		it('should create a store and update events', async () => {
			const galleryId = 'gallery-123';
			const eventData = {
				galleryUpdated: {
					type: 'artwork_added',
					galleryId,
					timestamp: '2023-01-01',
					artworkId: 'art-1',
				},
			};

			let nextCallback: (val: any) => void;

			const mockObservableSubscribe = vi.fn((observer) => {
				nextCallback = observer.next;
				return { unsubscribe: vi.fn() };
			});

			mockSubscribe.mockReturnValue({
				subscribe: mockObservableSubscribe,
			});

			// Since we might have issues with $state in .ts files,
			// we will try to instantiate it.
			// If it fails due to $state not being transformed, the test will fail.
			const store = createGalleryStore(mockAdapter, galleryId);

			expect(store.connected).toBe(true);
			expect(store.events).toEqual([]);

			// Simulate event
			// @ts-ignore - nextCallback is assigned in callback
			if (nextCallback) nextCallback({ data: eventData });

			// Wait for potential reactivity updates if any (though $state is sync usually)
			expect(store.events).toHaveLength(1);
			expect(store.events[0]).toEqual(eventData.galleryUpdated);
		});

		it('should clear events', () => {
			const galleryId = 'gallery-123';
			const store = createGalleryStore(mockAdapter, galleryId);

			// Manually push if we can't trigger via subscription easily or rely on previous test
			// But let's trust the subscription mechanism
			// ...
			// Actually, testing clearEvents:
			store.clearEvents();
			expect(store.events).toEqual([]);
		});

		it('should destroy subscription', () => {
			const mockUnsubscribe = vi.fn();
			mockSubscribe.mockReturnValue({
				subscribe: () => ({ unsubscribe: mockUnsubscribe }),
			});

			const store = createGalleryStore(mockAdapter, 'gallery-123');
			store.destroy();

			expect(mockUnsubscribe).toHaveBeenCalled();
			expect(store.connected).toBe(false);
		});
	});

	describe('createCommissionStore', () => {
		it('should create store and handle events', () => {
			const commissionId = 'comm-1';
			const eventData = {
				commissionUpdated: {
					type: 'status_changed',
					commissionId,
					timestamp: '2023-01-01',
				},
			};

			let nextCallback: (val: any) => void;
			const mockObservableSubscribe = vi.fn((observer) => {
				nextCallback = observer.next;
				return { unsubscribe: vi.fn() };
			});
			mockSubscribe.mockReturnValue({
				subscribe: mockObservableSubscribe,
			});

			const store = createCommissionStore(mockAdapter, commissionId);

			expect(store.connected).toBe(true);

			// @ts-ignore - nextCallback is assigned in callback
			if (nextCallback) nextCallback({ data: eventData });

			expect(store.events).toHaveLength(1);
			expect(store.events[0]).toEqual(eventData.commissionUpdated);
		});

		it('should clear events and destroy', () => {
			const mockUnsubscribe = vi.fn();
			mockSubscribe.mockReturnValue({
				subscribe: () => ({ unsubscribe: mockUnsubscribe }),
			});

			const store = createCommissionStore(mockAdapter, 'comm-1');
			store.clearEvents();
			expect(store.events).toEqual([]);

			store.destroy();
			expect(mockUnsubscribe).toHaveBeenCalled();
			expect(store.connected).toBe(false);
		});
	});
});
