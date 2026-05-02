import { describe, it, expect, vi } from 'vitest';
import { mount, unmount } from 'svelte';
import { flushSync } from 'svelte';
import Message from '../src/Message.svelte';

// Mock context helpers
vi.mock('../src/utils.js', async () => {
	const actual = await vi.importActual('../src/utils.js');
	return {
		...actual,
		formatMessageTime: () => '10:00 AM',
	};
});

describe('Message', () => {
	const alice = {
		id: 'u1',
		username: 'alice',
		displayName: 'Alice',
		avatar: 'https://example.com/a.jpg',
	};
	const bob = { id: 'u2', username: 'bob', displayName: 'Bob', avatar: '' };

	it('renders own message correctly', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm1',
			conversationId: 'c1',
			sender: alice,
			content: 'My message',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		const msg = target.querySelector('.message');
		expect(msg?.classList.contains('message--own')).toBe(true);

		// Own message shouldn't show avatar or name usually (depending on CSS/Design, but based on template logic)
		expect(target.querySelector('.message__avatar')).toBeFalsy();
		expect(target.querySelector('.message__sender')).toBeFalsy();

		expect(target.querySelector('.message__content')?.textContent).toBe('My message');
		expect(target.querySelector('.message__time')?.textContent).toBe('10:00 AM');

		unmount(instance);
	});

	it('matches own messages by original actor id when participant id is normalized', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm1-actor',
			conversationId: 'c1',
			sender: {
				...alice,
				id: 'alice',
				actorId: 'https://dev.simulacrum.greater.website/users/alice',
			},
			content: 'My normalized message',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, {
			target,
			props: { message, currentUserId: 'https://dev.simulacrum.greater.website/users/alice' },
		});

		expect(target.querySelector('.message')?.classList.contains('message--own')).toBe(true);

		unmount(instance);
	});

	it('renders other user message correctly', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm2',
			conversationId: 'c1',
			sender: bob,
			content: 'Hello',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		const msg = target.querySelector('.message');
		expect(msg?.classList.contains('message--own')).toBe(false);

		expect(target.querySelector('.message__avatar')).toBeTruthy();
		// Bob has no avatar, check placeholder
		expect(target.querySelector('.message__avatar-placeholder')?.textContent?.trim()).toBe('B');

		expect(target.querySelector('.message__sender')?.textContent).toBe('Bob');
		expect(target.querySelector('.message__content')?.textContent).toBe('Hello');

		unmount(instance);
	});

	it('renders avatar image when available', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm3',
			conversationId: 'c1',
			sender: alice,
			content: 'Hi',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u2' } }); // Alice is 'other'

		const img = target.querySelector('.message__avatar img') as HTMLImageElement;
		expect(img).toBeTruthy();
		expect(img.src).toBe('https://example.com/a.jpg');

		unmount(instance);
	});

	it('renders workflow moments for async review and approval threads', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm4',
			conversationId: 'c1',
			sender: bob,
			content: 'Please review the declaration thread.',
			createdAt: new Date().toISOString(),
			read: true,
			workflowMoments: [
				{
					id: 'moment-1',
					kind: 'review_request',
					title: 'Review requested',
					summary: 'Please evaluate the declaration and signer memo.',
					phase: 'review',
					requestedBy: 'Drone Zephyr-2',
					actionLabel: 'Open review thread',
				},
			],
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		expect(target.textContent).toContain('Review requested');
		expect(target.textContent).toContain('Open review thread');
		expect(target.querySelector('.workflow-thread-moment')).toBeTruthy();

		unmount(instance);
	});

	it('hides sensitive message content until explicitly revealed', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm-sensitive',
			conversationId: 'c1',
			sender: bob,
			content: 'Hidden message body',
			createdAt: new Date().toISOString(),
			read: true,
			sensitive: true,
			spoilerText: 'CW: private topic',
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		expect(target.textContent).toContain('CW: private topic');
		expect(target.querySelector('.message__content')).toBeNull();

		const button = target.querySelector('.message__content-warning-toggle') as HTMLButtonElement;
		expect(button?.getAttribute('aria-expanded')).toBe('false');
		button.click();
		flushSync();

		expect(button.getAttribute('aria-expanded')).toBe('true');
		expect(target.querySelector('.message__content')?.textContent).toBe('Hidden message body');

		unmount(instance);
	});
});
