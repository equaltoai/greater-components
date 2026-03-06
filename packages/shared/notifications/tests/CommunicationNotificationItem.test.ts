import { describe, it, expect, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import CommunicationNotificationItem from '../src/CommunicationNotificationItem.svelte';

describe('CommunicationNotificationItem', () => {
	it('renders inbound email with subject, preview, and attachments', async () => {
		const notification = {
			id: 'notif-1',
			type: 'communication:inbound',
			created_at: new Date().toISOString(),
			read: false,
			communication: {
				channel: 'email',
				from: {
					address: 'alice@example.com',
					display_name: 'Alice',
					soul_agent_id: '0x' + '0'.repeat(64),
				},
				subject: 'Re: Project collaboration',
				body: '<p>Hello <strong>world</strong></p>',
				received_at: new Date().toISOString(),
				message_id: 'comm-msg-001',
				thread_id: 'comm-thread-001',
				attachments: [
					{
						id: 'att-1',
						filename: 'notes.txt',
						content_type: 'text/plain',
						size_bytes: 2048,
						sha256: 'sha256',
					},
				],
			},
		};

		const target = document.createElement('div');
		const instance = mount(CommunicationNotificationItem, {
			target,
			props: { notification: notification as any },
		});
		await flushSync();

		expect(target.textContent).toContain('Inbound email');
		expect(target.textContent).toContain('Re: Project collaboration');
		expect(target.textContent).toContain('Hello world');
		expect(target.textContent).toContain('Attachments');
		expect(target.textContent).toContain('notes.txt');

		unmount(instance);
	});

	it('handles click', async () => {
		const notification = {
			id: 'notif-2',
			type: 'communication:inbound',
			created_at: new Date().toISOString(),
			read: false,
			communication: {
				channel: 'sms',
				from: { address: '+15550142', display_name: 'Alice' },
				body: 'hi',
				received_at: new Date().toISOString(),
				message_id: 'comm-msg-002',
				thread_id: 'comm-thread-002',
			},
		};
		const onClick = vi.fn();

		const target = document.createElement('div');
		const instance = mount(CommunicationNotificationItem, {
			target,
			props: { notification: notification as any, onClick },
		});
		await flushSync();

		target.querySelector('button')?.click();
		await flushSync();

		expect(onClick).toHaveBeenCalledWith(notification);

		unmount(instance);
	});
});
