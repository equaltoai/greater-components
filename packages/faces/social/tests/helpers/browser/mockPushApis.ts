import { vi, type Mock } from 'vitest';

const originalNotification = global.Notification;
const originalNavigator = global.navigator;

interface MockPushSubscription {
	endpoint: string;
	keys: {
		auth: string;
		p256dh: string;
	};
	toJSON: () => {
		endpoint: string;
		keys: {
			auth: string;
			p256dh: string;
		};
	};
	unsubscribe: Mock;
}

export const fakePushSubscription: MockPushSubscription = {
	endpoint: 'https://push.example.com/123',
	keys: {
		auth: 'auth-key',
		p256dh: 'p256dh-key',
	},
	toJSON: () => ({
		endpoint: 'https://push.example.com/123',
		keys: {
			auth: 'auth-key',
			p256dh: 'p256dh-key',
		},
	}),
	unsubscribe: vi.fn().mockResolvedValue(true),
};

interface MockRegistration {
	pushManager: {
		subscribe: Mock;
		getSubscription: Mock;
	};
}

export const fakeRegistration: MockRegistration = {
	pushManager: {
		subscribe: vi.fn().mockResolvedValue(fakePushSubscription),
		getSubscription: vi.fn().mockResolvedValue(null),
	},
};

export function installPushApiMocks() {
	// Mock Notification
	global.Notification = {
		permission: 'default',
		requestPermission: vi.fn().mockResolvedValue('granted'),
	} as unknown as typeof Notification;

	// Mock navigator.serviceWorker
	Object.defineProperty(global, 'navigator', {
		value: {
			...originalNavigator,
			serviceWorker: {
				register: vi.fn().mockResolvedValue(fakeRegistration),
				ready: Promise.resolve(fakeRegistration),
				getRegistration: vi.fn().mockResolvedValue(fakeRegistration),
			},
			userAgent: 'test-agent',
		},
		writable: true,
	});

	// Mock atob/btoa if needed (usually present in jsdom but good to be safe)
	if (!global.atob) {
		global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
	}
	if (!global.btoa) {
		global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
	}
}

export function uninstallPushApiMocks() {
	global.Notification = originalNotification;

	// We can't simply restore global.navigator if it was a getter-only property in jsdom
	// But we replaced the whole object, so we can try to restore it if we saved it.
	// However, jsdom's navigator is usually configurable.
	if (originalNavigator) {
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			writable: true,
		});
	}
}
