import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Thread from '../src/Thread.svelte';

// Mock context
const { mockHandlers, mockState } = vi.hoisted(() => ({
	mockHandlers: {},
	mockState: {
		selectedConversation: null,
		messages: [],
		loadingMessages: false,
	},
}));

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getMessagesContext: () => ({
			handlers: mockHandlers,
			state: mockState,
		}),
		// Keep actual formatMessageTime if used by Message.svelte
	};
});

describe('Thread', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.selectedConversation = null;
		mockState.messages = [];
		mockState.loadingMessages = false;
	});

	it('renders no selection state', () => {
		const target = document.createElement('div');
		const instance = mount(Thread, { target });

		expect(target.querySelector('.messages-thread__no-selection')).toBeTruthy();
		expect(target.textContent).toContain('Select a conversation');

		unmount(instance);
	});

	it('renders loading state', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		mockState.loadingMessages = true;

		const target = document.createElement('div');
		const instance = mount(Thread, { target });
		await flushSync();

		expect(target.querySelector('.messages-thread__loading')).toBeTruthy();
		expect(target.querySelector('.messages-thread__spinner')).toBeTruthy();

		unmount(instance);
	});

	it('renders empty state', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		mockState.loadingMessages = false;
		mockState.messages = [];

		const target = document.createElement('div');
		const instance = mount(Thread, { target });
		await flushSync();

		expect(target.querySelector('.messages-thread__empty')).toBeTruthy();
		expect(target.textContent).toContain('No messages yet');

		unmount(instance);
	});

	it('renders messages list', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		mockState.loadingMessages = false;
		mockState.messages = [
			{
				id: 'm1',
				conversationId: 'c1',
				sender: { id: 'u1', displayName: 'Alice', avatar: '' },
				content: 'Hello Alice',
				createdAt: new Date().toISOString(),
				read: true,
			},
			{
				id: 'm2',
				conversationId: 'c1',
				sender: { id: 'me', displayName: 'Me', avatar: '' }, // 'me' is default currentUserId in Message props
				content: 'Hi there',
				createdAt: new Date().toISOString(),
				read: true,
			},
		];

		const target = document.createElement('div');
		const instance = mount(Thread, { target });
		await flushSync();

		const list = target.querySelector('.messages-thread__list');
		expect(list).toBeTruthy();

		const messages = target.querySelectorAll('.message');
		expect(messages.length).toBe(2);

		expect(messages[0].textContent).toContain('Hello Alice');
		expect(messages[0].querySelector('.message__sender')?.textContent).toBe('Alice'); // Other sender shows name

		expect(messages[1].textContent).toContain('Hi there');
		expect(messages[1].classList.contains('message--own')).toBe(true); // Own message

		unmount(instance);
	});
});
