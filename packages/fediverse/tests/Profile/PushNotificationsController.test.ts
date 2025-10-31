import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PushNotificationsController } from '../../src/components/Profile/PushNotificationsController.js';
import type { PushSubscription } from '../../src/components/Profile/PushNotificationsController.js';

// Mock browser APIs
const mockPushSubscription = {
	endpoint: 'https://push.example.com/subscription/123',
	toJSON: vi.fn(() => ({
		endpoint: 'https://push.example.com/subscription/123',
		keys: {
			auth: 'mock-auth-key',
			p256dh: 'mock-p256dh-key',
		},
	})),
	unsubscribe: vi.fn().mockResolvedValue(true),
};

const mockPushManager = {
	subscribe: vi.fn().mockResolvedValue(mockPushSubscription),
};

const mockServiceWorkerRegistration = {
	pushManager: mockPushManager,
};

// Setup global mocks
global.navigator = {
	serviceWorker: {
		register: vi.fn().mockResolvedValue(mockServiceWorkerRegistration),
		ready: Promise.resolve(mockServiceWorkerRegistration),
	},
} as any;

global.Notification = {
	requestPermission: vi.fn().mockResolvedValue('granted'),
	permission: 'default',
} as any;

global.window = {} as any;

// Mock LesserGraphQLAdapter
const createMockAdapter = () => ({
	getPushSubscription: vi.fn(),
	registerPushSubscription: vi.fn(),
	updatePushSubscription: vi.fn(),
	deletePushSubscription: vi.fn(),
});

describe('PushNotificationsController', () => {
	let adapter: ReturnType<typeof createMockAdapter>;
	let controller: PushNotificationsController;

	beforeEach(() => {
		adapter = createMockAdapter();
		vi.clearAllMocks();

		controller = new PushNotificationsController({
			adapter: adapter as any,
			vapidPublicKey: 'BNakbN1x3K7hdBqRBZjKJJ2Q_4r1r_6K7EJLs3K7fGY',
		});
	});

	describe('initialization', () => {
		it('should check browser support on creation', () => {
			const state = controller.getState();
			expect(state.supported).toBe(true); // Mocked to be supported
		});

		it('should load existing subscription on initialize', async () => {
			const mockSub: PushSubscription = {
				id: 'sub-123',
				endpoint: 'https://push.example.com/subscription/123',
				keys: {
					auth: 'mock-auth',
					p256dh: 'mock-p256dh',
				},
				alerts: {
					follow: true,
					favourite: true,
					reblog: true,
					mention: true,
					poll: true,
					followRequest: true,
					status: true,
					update: true,
					adminSignUp: false,
					adminReport: false,
				},
				policy: 'all',
			};

			adapter.getPushSubscription.mockResolvedValue(mockSub);

			await controller.initialize();

			const state = controller.getState();
			expect(state.subscription).toEqual(mockSub);
			expect(state.loading).toBe(false);
		});

		it('should handle missing subscription gracefully', async () => {
			adapter.getPushSubscription.mockRejectedValue(new Error('Not found'));

			await controller.initialize();

			const state = controller.getState();
			expect(state.subscription).toBeNull();
			expect(state.loading).toBe(false);
		});
	});

	describe('register', () => {
		it('should register a new push subscription', async () => {
			const alerts: PushSubscription['alerts'] = {
				follow: true,
				favourite: true,
				reblog: true,
				mention: true,
				poll: true,
				followRequest: true,
				status: false,
				update: false,
				adminSignUp: false,
				adminReport: false,
			};

			const mockRegistered: PushSubscription = {
				id: 'sub-123',
				endpoint: 'https://push.example.com/subscription/123',
				keys: {
					auth: 'mock-auth-key',
					p256dh: 'mock-p256dh-key',
				},
				alerts,
				policy: 'all',
			};

			adapter.registerPushSubscription.mockResolvedValue(mockRegistered);

			await controller.register(alerts);

			expect(global.Notification.requestPermission).toHaveBeenCalled();
			expect(navigator.serviceWorker.register).toHaveBeenCalled();
			expect(mockPushManager.subscribe).toHaveBeenCalledWith({
				userVisibleOnly: true,
				applicationServerKey: expect.any(Uint8Array),
			});

			expect(adapter.registerPushSubscription).toHaveBeenCalledWith({
				endpoint: 'https://push.example.com/subscription/123',
				keys: {
					auth: 'mock-auth-key',
					p256dh: 'mock-p256dh-key',
				},
				alerts,
			});

			const state = controller.getState();
			expect(state.subscription).toEqual(mockRegistered);
			expect(state.registering).toBe(false);
		});

		it('should handle permission denied', async () => {
			(global.Notification.requestPermission as any).mockResolvedValueOnce('denied');

			const alerts: PushSubscription['alerts'] = {
				follow: true,
				favourite: true,
				reblog: true,
				mention: true,
				poll: true,
				followRequest: true,
				status: true,
				update: true,
				adminSignUp: false,
				adminReport: false,
			};

			await expect(controller.register(alerts)).rejects.toThrow(
				'Notification permission denied'
			);

			const state = controller.getState();
			expect(state.error).toBe('Notification permission denied');
		});
	});

	describe('updateAlerts', () => {
		it('should update alert preferences', async () => {
			const mockSub: PushSubscription = {
				id: 'sub-123',
				endpoint: 'https://push.example.com/subscription/123',
				keys: {
					auth: 'mock-auth',
					p256dh: 'mock-p256dh',
				},
				alerts: {
					follow: true,
					favourite: true,
					reblog: true,
					mention: true,
					poll: true,
					followRequest: true,
					status: true,
					update: true,
					adminSignUp: false,
					adminReport: false,
				},
				policy: 'all',
			};

			adapter.getPushSubscription.mockResolvedValue(mockSub);
			await controller.initialize();

			const updatedAlerts = {
				follow: false,
				mention: false,
			};

			const mockUpdated: PushSubscription = {
				...mockSub,
				alerts: {
					...mockSub.alerts,
					...updatedAlerts,
				},
			};

			adapter.updatePushSubscription.mockResolvedValue(mockUpdated);

			await controller.updateAlerts(updatedAlerts);

			expect(adapter.updatePushSubscription).toHaveBeenCalledWith({
				alerts: expect.objectContaining(updatedAlerts),
			});

			const state = controller.getState();
			expect(state.subscription?.alerts.follow).toBe(false);
			expect(state.subscription?.alerts.mention).toBe(false);
		});

		it('should throw if no active subscription', async () => {
			await expect(
				controller.updateAlerts({ follow: false })
			).rejects.toThrow('No active push subscription');
		});
	});

	describe('unregister', () => {
		it('should unregister push subscription', async () => {
			const mockSub: PushSubscription = {
				id: 'sub-123',
				endpoint: 'https://push.example.com/subscription/123',
				keys: {
					auth: 'mock-auth',
					p256dh: 'mock-p256dh',
				},
				alerts: {
					follow: true,
					favourite: true,
					reblog: true,
					mention: true,
					poll: true,
					followRequest: true,
					status: true,
					update: true,
					adminSignUp: false,
					adminReport: false,
				},
				policy: 'all',
			};

			adapter.getPushSubscription.mockResolvedValue(mockSub);
			adapter.deletePushSubscription.mockResolvedValue(true);

			await controller.initialize();

			// Mock browser subscription
			(controller as any).state.browserSubscription = mockPushSubscription;

			await controller.unregister();

			expect(adapter.deletePushSubscription).toHaveBeenCalled();
			expect(mockPushSubscription.unsubscribe).toHaveBeenCalled();

			const state = controller.getState();
			expect(state.subscription).toBeNull();
			expect(state.browserSubscription).toBeNull();
		});
	});

	describe('state subscription', () => {
		it('should notify listeners on state changes', async () => {
			const listener = vi.fn();
			const unsubscribe = controller.subscribe(listener);

			const mockSub: PushSubscription = {
				id: 'sub-123',
				endpoint: 'https://push.example.com/subscription/123',
				keys: {
					auth: 'mock-auth',
					p256dh: 'mock-p256dh',
				},
				alerts: {
					follow: true,
					favourite: true,
					reblog: true,
					mention: true,
					poll: true,
					followRequest: true,
					status: true,
					update: true,
					adminSignUp: false,
					adminReport: false,
				},
				policy: 'all',
			};

			adapter.getPushSubscription.mockResolvedValue(mockSub);
			await controller.initialize();

			expect(listener).toHaveBeenCalled();
			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({
					subscription: mockSub,
					loading: false,
				})
			);

			unsubscribe();
		});
	});

	describe('destroy', () => {
		it('should clean up resources when destroyed', () => {
			const listener = vi.fn();
			controller.subscribe(listener);

			controller.destroy();

			expect(() => controller.initialize()).rejects.toThrow(
				'PushNotificationsController has been destroyed'
			);
		});
	});
});





