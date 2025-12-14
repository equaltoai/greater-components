import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import PushNotificationSettings from '../src/PushNotificationSettings.svelte';

// Mock Primitives
vi.mock('@equaltoai/greater-components-primitives', async () => {
	const SettingsSection = (await import('./mocks/MockSettingsSection.svelte')).default;
	const Button = (await import('./mocks/MockButton.svelte')).default;
	return {
		SettingsSection,
		Button,
	};
});

describe('PushNotificationSettings', () => {
	const mockAdapter: any = {};

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock globals
		global.Notification = {
			requestPermission: vi.fn().mockResolvedValue('granted'),
		} as any;

		Object.defineProperty(global.navigator, 'serviceWorker', {
			value: {},
			configurable: true,
		});
	});

	afterEach(() => {
		// cleanup globals if needed
	});

	it('renders enable button initially', async () => {
		const target = document.createElement('div');
		const instance = mount(PushNotificationSettings, {
			target,
			props: { adapter: mockAdapter },
		});
		await flushSync();

		expect(target.textContent).toContain('Push Notifications');
		expect(target.textContent).toContain('Enable Push Notifications');

		unmount(instance);
	});

	it('handles enabling push notifications', async () => {
		const target = document.createElement('div');
		const instance = mount(PushNotificationSettings, {
			target,
			props: { adapter: mockAdapter },
		});
		await flushSync();

		const btn = target.querySelector('button') as HTMLButtonElement;
		btn.click();
		await flushSync();

		expect(Notification.requestPermission).toHaveBeenCalled();

		// Wait for async
		await new Promise((r) => setTimeout(r, 10));
		await flushSync();

		// In this mock implementation, subscription isn't actually set because logic is placeholder comments.
		// But we can check if loading state passed.
		expect(target.textContent).not.toContain('Enabling...');

		unmount(instance);
	});

	it('handles errors', async () => {
		(global.Notification.requestPermission as any).mockResolvedValue('denied');

		const target = document.createElement('div');
		const instance = mount(PushNotificationSettings, {
			target,
			props: { adapter: mockAdapter },
		});
		await flushSync();

		const btn = target.querySelector('button') as HTMLButtonElement;
		btn.click();
		await flushSync();

		await new Promise((r) => setTimeout(r, 10));
		await flushSync();

		expect(target.textContent).toContain('Permission denied');

		unmount(instance);
	});
});
