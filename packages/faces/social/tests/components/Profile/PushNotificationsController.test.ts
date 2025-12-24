import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PushNotificationsController } from '@equaltoai/greater-components-fediverse/components/Profile/PushNotificationsController';
import { createFakeLesserAdapter } from '../../helpers/fakes/createFakeLesserAdapter';
import {
	installPushApiMocks,
	uninstallPushApiMocks,
	fakeRegistration,
	fakePushSubscription,
} from '../../helpers/browser/mockPushApis';

describe('PushNotificationsController', () => {
	let adapter: any;
	let controller: PushNotificationsController;
	const vapidKey = 'test-vapid-key';

	beforeEach(() => {
		installPushApiMocks();
		adapter = createFakeLesserAdapter();
	});

	afterEach(() => {
		uninstallPushApiMocks();
	});

	function createController(overrides: any = {}) {
		return new PushNotificationsController({
			adapter,
			vapidPublicKey: vapidKey,
			...overrides,
		});
	}

	describe('Support Detection', () => {
		it('detects support correctly', () => {
			controller = createController();
			expect(controller.getState().supported).toBe(true);
			expect(controller.getState().permission).toBe('default');
		});

		it('handles missing ServiceWorker support', () => {
			// Uninstall mock to simulate missing API
			uninstallPushApiMocks();
			// Mock minimal window without SW
			Object.defineProperty(global, 'navigator', {
				value: {},
				writable: true,
			});
			Object.defineProperty(global, 'Notification', {
				value: undefined,
				writable: true,
			});

			controller = createController();
			expect(controller.getState().supported).toBe(false);
		});
	});

	describe('Initialization', () => {
		it('initialize() loads subscription from server', async () => {
			const serverSub = {
				id: '1',
				endpoint: 'https://test.com',
				keys: { auth: 'a', p256dh: 'p' },
				alerts: { mention: true },
			};
			adapter.getPushSubscription.mockResolvedValue(serverSub);

			controller = createController();
			await controller.initialize();

			expect(controller.getState().subscription?.id).toBe('1');
			expect(controller.getState().subscription?.alerts.mention).toBe(true);
		});

		it('initialize() handles no subscription', async () => {
			adapter.getPushSubscription.mockRejectedValue(new Error('Not found'));

			controller = createController();
			await controller.initialize();

			expect(controller.getState().subscription).toBeNull();
			expect(controller.getState().error).toBeNull();
		});
	});

	describe('Registration', () => {
		it('register() requests permission and registers', async () => {
			controller = createController();

			// Mock server registration response
			const registeredSub = {
				id: 'new',
				endpoint: fakePushSubscription.endpoint,
				keys: fakePushSubscription.keys,
				alerts: { mention: true },
			};
			adapter.registerPushSubscription.mockResolvedValue(registeredSub);

			const alerts = { mention: true } as any;
			await controller.register(alerts);

			// Check permission request
			expect(Notification.requestPermission).toHaveBeenCalled();

			// Check SW registration
			expect(navigator.serviceWorker.register).toHaveBeenCalled();

			// Check push subscription
			expect(fakeRegistration.pushManager.subscribe).toHaveBeenCalledWith(
				expect.objectContaining({
					userVisibleOnly: true,
				})
			);

			// Check adapter call
			expect(adapter.registerPushSubscription).toHaveBeenCalledWith(
				expect.objectContaining({
					endpoint: fakePushSubscription.endpoint,
					alerts,
				})
			);

			// Check state
			expect(controller.getState().subscription?.id).toBe('new');
			expect(controller.getState().browserSubscription).toBeTruthy();
		});

		it('register() throws if permission denied', async () => {
			(Notification.requestPermission as any).mockResolvedValue('denied');
			controller = createController();

			await expect(controller.register({} as any)).rejects.toThrow('permission denied');
			expect(controller.getState().permission).toBe('denied');
		});

		it('register() falls back to ready if register fails', async () => {
			(navigator.serviceWorker.register as any).mockRejectedValue(new Error('Register failed'));

			controller = createController();
			adapter.registerPushSubscription.mockResolvedValue({});

			await controller.register({} as any);

			// Should have used .ready fallback, so process continues
			expect(fakeRegistration.pushManager.subscribe).toHaveBeenCalled();
		});
	});

	describe('Update & Unregister', () => {
		beforeEach(async () => {
			controller = createController();
			// Seed with subscription
			adapter.getPushSubscription.mockResolvedValue({
				id: '1',
				alerts: { mention: true },
			});
			await controller.initialize();
		});

		it('updateAlerts() updates server subscription', async () => {
			adapter.updatePushSubscription.mockResolvedValue({
				id: '1',
				alerts: { mention: false },
			});

			await controller.updateAlerts({ mention: false });

			expect(adapter.updatePushSubscription).toHaveBeenCalledWith({
				alerts: expect.objectContaining({ mention: false }),
			});
			expect(controller.getState().subscription?.alerts.mention).toBe(false);
		});

		it('updateAlerts() throws if no subscription', async () => {
			// Clear subscription
			adapter.getPushSubscription.mockRejectedValue(new Error());
			controller = createController();
			await controller.initialize();

			await expect(controller.updateAlerts({})).rejects.toThrow('No active push subscription');
		});

		it('unregister() removes server and browser subscription', async () => {
			// Set browser subscription
			await controller.register({} as any);

			await controller.unregister();

			expect(adapter.deletePushSubscription).toHaveBeenCalled();
			expect(fakePushSubscription.unsubscribe).toHaveBeenCalled();

			expect(controller.getState().subscription).toBeNull();
			expect(controller.getState().browserSubscription).toBeNull();
		});
	});
});
