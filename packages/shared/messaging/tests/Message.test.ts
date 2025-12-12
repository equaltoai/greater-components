import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount } from 'svelte';
import Message from '../src/Message.svelte';

// Mock context helpers
vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		formatMessageTime: () => '10:00 AM',
	};
});

describe('Message', () => {
	const alice = { id: 'u1', username: 'alice', displayName: 'Alice', avatar: 'https://example.com/a.jpg' };
	const bob = { id: 'u2', username: 'bob', displayName: 'Bob', avatar: '' };

	it('renders own message correctly', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm1',
			conversationId: 'c1',
			sender: alice,
			content: 'My message',
			createdAt: new Date().toISOString(),
			read: true
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

	it('renders other user message correctly', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm2',
			conversationId: 'c1',
			sender: bob,
			content: 'Hello',
			createdAt: new Date().toISOString(),
			read: true
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
			read: true
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u2' } }); // Alice is 'other'

		const img = target.querySelector('.message__avatar img') as HTMLImageElement;
		expect(img).toBeTruthy();
		expect(img.src).toBe('https://example.com/a.jpg');

		unmount(instance);
	});
});