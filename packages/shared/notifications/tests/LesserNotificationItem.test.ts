import { describe, it, expect, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import LesserNotificationItem from '../src/LesserNotificationItem.svelte';

describe('LesserNotificationItem', () => {
	const baseNotification = {
		id: '1',
		title: 'Title',
		message: 'Message',
		timestamp: Date.now(),
		isRead: false,
		priority: 'normal',
		createdAt: new Date().toISOString(),
		account: {
			displayName: 'User',
			username: 'user',
		},
	};

	it('renders quote notification', async () => {
		const notification = {
			...baseNotification,
			type: 'quote',
			metadata: {
				lesser: {
					quoteStatus: {
						id: 'q1',
						content: 'Quote content',
						author: 'Author',
					},
				},
			},
		};

		const target = document.createElement('div');
		const instance = mount(LesserNotificationItem, {
			target,
			props: { notification: notification as any },
		});
		await flushSync();

		expect(target.textContent).toContain('quoted your post');
		expect(target.textContent).toContain('Quote content');

		unmount(instance);
	});

	it('renders community_note notification', async () => {
		const notification = {
			...baseNotification,
			type: 'community_note',
			metadata: {
				lesser: {
					communityNote: {
						id: 'n1',
						content: 'Note content',
						helpful: 5,
						notHelpful: 1,
					},
				},
			},
		};

		const target = document.createElement('div');
		const instance = mount(LesserNotificationItem, {
			target,
			props: { notification: notification as any },
		});
		await flushSync();

		expect(target.textContent).toContain('added a community note');
		expect(target.textContent).toContain('Note content');
		expect(target.textContent).toContain('👍 5');

		unmount(instance);
	});

	it('renders trust_update notification', async () => {
		const notification = {
			...baseNotification,
			type: 'trust_update',
			metadata: {
				lesser: {
					trustUpdate: {
						newScore: 80,
						previousScore: 70,
						reason: 'Good behavior',
					},
				},
			},
		};

		const target = document.createElement('div');
		const instance = mount(LesserNotificationItem, {
			target,
			props: { notification: notification as any },
		});
		await flushSync();

		expect(target.textContent).toContain('trust score changed');
		expect(target.textContent).toContain('70');
		expect(target.textContent).toContain('80');
		expect(target.textContent).toContain('Good behavior');

		unmount(instance);
	});

	it('renders cost_alert notification', async () => {
		const notification = {
			...baseNotification,
			type: 'cost_alert',
			metadata: {
				lesser: {
					costAlert: {
						amount: 2000000, // 2.0
						threshold: 1000000, // 1.0
					},
				},
			},
		};

		const target = document.createElement('div');
		const instance = mount(LesserNotificationItem, {
			target,
			props: { notification: notification as any },
		});
		await flushSync();

		expect(target.textContent).toContain('Cost alert');
		expect(target.textContent).toContain('$2.0000');
		expect(target.textContent).toContain('threshold: $1.0000');

		unmount(instance);
	});

	it('renders moderation_action notification', async () => {
		const notification = {
			...baseNotification,
			type: 'moderation_action',
			metadata: {
				lesser: {
					moderationAction: {
						action: 'warned',
						reason: 'Violation',
					},
				},
			},
		};

		const target = document.createElement('div');
		const instance = mount(LesserNotificationItem, {
			target,
			props: { notification: notification as any },
		});
		await flushSync();

		expect(target.textContent).toContain('Moderation action taken');
		expect(target.textContent).toContain('warned');
		expect(target.textContent).toContain('Violation');

		unmount(instance);
	});

	it('handles click', async () => {
		const notification = {
			...baseNotification,
			type: 'quote',
		};
		const onClick = vi.fn();

		const target = document.createElement('div');
		const instance = mount(LesserNotificationItem, {
			target,
			props: { notification: notification as any, onClick },
		});
		await flushSync();

		const button = target.querySelector('button');
		button?.click();
		await flushSync();

		expect(onClick).toHaveBeenCalledWith(notification);

		unmount(instance);
	});
});
