import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Conversations from '../src/Conversations.svelte';

// Mock context
const { mockHandlers, mockState, mockSelectConversation } = vi.hoisted(() => ({
	mockHandlers: {
		onConversationClick: vi.fn(),
	},
	mockState: {
		selectedConversation: null,
		conversations: [],
		loadingConversations: false,
	},
	mockSelectConversation: vi.fn(),
}));

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getMessagesContext: () => ({
			handlers: mockHandlers,
			state: mockState,
			selectConversation: mockSelectConversation,
		}),
		getConversationName: (conversation: any) => conversation.participants[0]?.displayName || 'Unknown',
		formatMessageTime: () => '10:00 AM',
	};
});

describe('Conversations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.selectedConversation = null;
		mockState.conversations = [];
		mockState.loadingConversations = false;
	});

	it('renders title', () => {
		const target = document.createElement('div');
		const instance = mount(Conversations, { target });
		
		expect(target.querySelector('.messages-conversations__title')?.textContent).toBe('Messages');

		unmount(instance);
	});

	it('renders loading state', async () => {
		mockState.loadingConversations = true;

		const target = document.createElement('div');
		const instance = mount(Conversations, { target });
		await flushSync();

		expect(target.querySelector('.messages-conversations__loading')).toBeTruthy();
		expect(target.querySelector('.messages-conversations__spinner')).toBeTruthy();

		unmount(instance);
	});

	it('renders empty state', async () => {
		mockState.loadingConversations = false;
		mockState.conversations = [];

		const target = document.createElement('div');
		const instance = mount(Conversations, { target });
		await flushSync();

		expect(target.querySelector('.messages-conversations__empty')).toBeTruthy();
		expect(target.textContent).toContain('No messages yet');

		unmount(instance);
	});

	it('renders conversations list', async () => {
		mockState.conversations = [
			{
				id: 'c1',
				participants: [{ id: 'u1', displayName: 'Alice', avatar: '' }],
				unreadCount: 2,
				lastMessage: { content: 'Hello', createdAt: '' }
			},
			{
				id: 'c2',
				participants: [{ id: 'u2', displayName: 'Bob', avatar: '' }],
				unreadCount: 0,
				lastMessage: { content: 'Hi', createdAt: '' }
			}
		];

		const target = document.createElement('div');
		const instance = mount(Conversations, { target });
		await flushSync();

		const items = target.querySelectorAll('.messages-conversations__item');
		expect(items.length).toBe(2);

		expect(items[0].textContent).toContain('Alice');
		expect(items[0].textContent).toContain('Hello');
		expect(items[0].querySelector('.messages-conversations__badge')?.textContent).toBe('2');

		expect(items[1].textContent).toContain('Bob');
		expect(items[1].querySelector('.messages-conversations__badge')).toBeFalsy();

		unmount(instance);
	});

	it('handles selection', async () => {
		mockState.conversations = [
			{
				id: 'c1',
				participants: [{ id: 'u1', displayName: 'Alice', avatar: '' }],
				unreadCount: 0,
			}
		];

		const target = document.createElement('div');
		const instance = mount(Conversations, { target });
		await flushSync();

		const item = target.querySelector('.messages-conversations__item') as HTMLButtonElement;
		item.click();
		await flushSync();

		expect(mockSelectConversation).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));
		expect(mockHandlers.onConversationClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));

		unmount(instance);
	});

	it('highlights selected conversation', async () => {
		const conv = {
			id: 'c1',
			participants: [{ id: 'u1', displayName: 'Alice', avatar: '' }],
			unreadCount: 0,
		};
		mockState.conversations = [conv];
		mockState.selectedConversation = conv;

		const target = document.createElement('div');
		const instance = mount(Conversations, { target });
		await flushSync();

		const item = target.querySelector('.messages-conversations__item');
		expect(item?.classList.contains('messages-conversations__item--selected')).toBe(true);

		unmount(instance);
	});
});