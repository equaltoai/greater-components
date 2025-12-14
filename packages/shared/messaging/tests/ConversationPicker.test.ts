import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import ConversationPicker from '../src/ConversationPicker.svelte';

// Mock getMessagesContext with hoisted state
const { mockHandlers, mockState } = vi.hoisted(() => ({
	mockHandlers: {
		onSearchParticipants: vi.fn(),
		onCreateConversation: vi.fn(),
	},
	mockState: {
		conversations: [],
		selectedConversation: null,
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
	};
});

describe('ConversationPicker', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.conversations = [];
	});

	it('renders correctly', () => {
		const target = document.createElement('div');
		const instance = mount(ConversationPicker, { target });

		expect(target.querySelector('.conversation-picker')).toBeTruthy();
		expect(target.querySelector('input')).toBeTruthy(); // Search input

		unmount(instance);
	});

	it('renders existing conversations', async () => {
		mockState.conversations = [
			{
				id: 'c1',
				participants: [{ id: 'u1', displayName: 'Alice', username: 'alice', avatar: '' }],
				unreadCount: 2,
				lastMessage: { content: 'Hello there' },
			},
			{
				id: 'c2',
				participants: [{ id: 'u2', displayName: 'Bob', username: 'bob', avatar: '' }],
				unreadCount: 0,
				lastMessage: { content: 'Hi' },
			},
		];

		const target = document.createElement('div');
		const instance = mount(ConversationPicker, { target });
		await flushSync();

		const items = target.querySelectorAll('.conversation-picker__item');
		expect(items.length).toBe(2);
		expect(items[0].textContent).toContain('Alice');
		expect(items[0].textContent).toContain('Hello there');
		expect(items[0].querySelector('.conversation-picker__unread')?.textContent).toBe('2');

		expect(items[1].textContent).toContain('Bob');
		expect(items[1].querySelector('.conversation-picker__unread')).toBeFalsy();

		unmount(instance);
	});

	it('filters existing conversations', async () => {
		mockState.conversations = [
			{
				id: 'c1',
				participants: [{ id: 'u1', displayName: 'Alice', username: 'alice', avatar: '' }],
				unreadCount: 0,
			},
			{
				id: 'c2',
				participants: [{ id: 'u2', displayName: 'Bob', username: 'bob', avatar: '' }],
				unreadCount: 0,
			},
		];

		const target = document.createElement('div');
		const instance = mount(ConversationPicker, { target });
		await flushSync();

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		const items = target.querySelectorAll('.conversation-picker__item');
		expect(items.length).toBe(1);
		expect(items[0].textContent).toContain('Alice');

		unmount(instance);
	});

	it('searches for new participants', async () => {
		const target = document.createElement('div');
		const instance = mount(ConversationPicker, { target });
		await flushSync();

		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u3', displayName: 'Charlie', username: 'charlie', avatar: '' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Cha';
		input.dispatchEvent(new Event('input', { bubbles: true }));

		// Wait for debounce (300ms)
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		expect(mockHandlers.onSearchParticipants).toHaveBeenCalledWith('Cha');

		// Check if results are displayed
		const peopleHeader = Array.from(
			target.querySelectorAll('.conversation-picker__section-title')
		).find((el) => el.textContent === 'People');
		expect(peopleHeader).toBeTruthy();

		const items = target.querySelectorAll('.conversation-picker__item');
		// Should see Charlie
		const charlieItem = Array.from(items).find((item) => item.textContent?.includes('Charlie'));
		expect(charlieItem).toBeTruthy();

		unmount(instance);
	});

	it('handles selecting a participant and creating a conversation', async () => {
		const target = document.createElement('div');
		const onCreateNew = vi.fn();
		const instance = mount(ConversationPicker, { target, props: { onCreateNew } });
		await flushSync();

		// Mock search result
		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u3', displayName: 'Charlie', username: 'charlie', avatar: '' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Cha';
		input.dispatchEvent(new Event('input', { bubbles: true }));

		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		// Select Charlie
		const charlieItem = Array.from(target.querySelectorAll('.conversation-picker__item')).find(
			(item) => item.textContent?.includes('Charlie')
		) as HTMLElement;
		charlieItem.click();
		await flushSync();

		// Check if chip appears
		expect(target.querySelector('.conversation-picker__chip')).toBeTruthy();
		expect(target.querySelector('.conversation-picker__chip')?.textContent).toContain('Charlie');

		// Click "Start conversation"
		const startBtn = Array.from(target.querySelectorAll('button')).find((btn) =>
			btn.textContent?.includes('Start conversation')
		) as HTMLButtonElement;
		expect(startBtn).toBeTruthy();
		startBtn.click();
		await flushSync();

		expect(onCreateNew).toHaveBeenCalledWith([
			expect.objectContaining({ id: 'u3', displayName: 'Charlie' }),
		]);

		// Should reset selection
		expect(target.querySelector('.conversation-picker__chip')).toBeFalsy();

		unmount(instance);
	});

	it('emits select event when clicking an existing conversation', async () => {
		mockState.conversations = [
			{
				id: 'c1',
				participants: [{ id: 'u1', displayName: 'Alice', username: 'alice', avatar: '' }],
				unreadCount: 0,
			},
		];

		const target = document.createElement('div');
		const onSelect = vi.fn();
		const instance = mount(ConversationPicker, { target, props: { onSelect } });
		await flushSync();

		const item = target.querySelector('.conversation-picker__item') as HTMLElement;
		item.click();
		await flushSync();

		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));

		unmount(instance);
	});

	it('allows removing selected participant', async () => {
		const target = document.createElement('div');
		const instance = mount(ConversationPicker, { target });
		await flushSync();

		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u3', displayName: 'Charlie', username: 'charlie', avatar: '' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Cha';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		// Select
		const charlieItem = Array.from(target.querySelectorAll('.conversation-picker__item')).find(
			(item) => item.textContent?.includes('Charlie')
		) as HTMLElement;
		charlieItem.click();
		await flushSync();

		expect(target.querySelectorAll('.conversation-picker__chip').length).toBe(1);

		// Remove
		const chip = target.querySelector('.conversation-picker__chip') as HTMLElement;
		chip.click(); // The whole chip is a button
		await flushSync();

		expect(target.querySelectorAll('.conversation-picker__chip').length).toBe(0);

		unmount(instance);
	});
});
