import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Composer from '../src/Composer.svelte';

// Mock context
const { mockHandlers, mockState, mockSendMessage } = vi.hoisted(() => ({
	mockHandlers: {},
	mockState: {
		selectedConversation: null,
		loading: false,
	},
	mockSendMessage: vi.fn(),
}));

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getMessagesContext: () => ({
			handlers: mockHandlers,
			state: mockState,
			sendMessage: mockSendMessage,
		}),
	};
});

// Mock headless button
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: (config: any) => ({
		actions: {
			button: (node: HTMLElement) => {
				const handler = (e: Event) => {
					if (!(node as HTMLButtonElement).disabled) {
						config.onClick?.(e);
					}
				};
				node.addEventListener('click', handler);
				return {
					destroy: () => node.removeEventListener('click', handler),
				};
			},
		},
	}),
}));

describe('Composer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.selectedConversation = null;
		mockState.loading = false;
	});

	it('does not render when no conversation is selected', () => {
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		
		expect(target.querySelector('.messages-composer')).toBeFalsy();
		
		unmount(instance);
	});

	it('renders when conversation is selected', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		expect(target.querySelector('.messages-composer')).toBeTruthy();
		expect(target.querySelector('textarea')).toBeTruthy();
		expect(target.querySelector('button')).toBeTruthy();

		unmount(instance);
	});

	it('disables send button when empty', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		const button = target.querySelector('button') as HTMLButtonElement;
		expect(button.disabled).toBe(true);

		const textarea = target.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = '   '; // Whitespace only
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		expect(button.disabled).toBe(true);

		unmount(instance);
	});

	it('enables send button when content exists', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		const textarea = target.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = 'Hello';
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		const button = target.querySelector('button') as HTMLButtonElement;
		expect(button.disabled).toBe(false);

		unmount(instance);
	});

	it('sends message on button click', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		const textarea = target.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = 'Hello world';
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		const button = target.querySelector('button') as HTMLButtonElement;
		button.click();
		await new Promise((resolve) => setTimeout(resolve, 0));
		await flushSync();

		expect(mockSendMessage).toHaveBeenCalledWith('Hello world');
		expect(textarea.value).toBe(''); // Should clear after send

		unmount(instance);
	});

	it('sends message on Enter key (without Shift)', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		const textarea = target.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = 'Hello Enter';
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
		textarea.dispatchEvent(event);
		await new Promise((resolve) => setTimeout(resolve, 0));
		await flushSync();

		expect(mockSendMessage).toHaveBeenCalledWith('Hello Enter');
		expect(event.defaultPrevented).toBe(true);
		expect(textarea.value).toBe('');

		unmount(instance);
	});

	it('does not send on Shift+Enter', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		const textarea = target.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = 'Line 1';
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true });
		textarea.dispatchEvent(event);
		await flushSync();

		expect(mockSendMessage).not.toHaveBeenCalled();
		// Content should remain
		expect(textarea.value).toBe('Line 1');

		unmount(instance);
	});

	it('handles loading state', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		mockState.loading = true;
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		const textarea = target.querySelector('textarea') as HTMLTextAreaElement;
		const button = target.querySelector('button') as HTMLButtonElement;

		expect(textarea.disabled).toBe(true);
		expect(button.disabled).toBe(true);
		expect(button.textContent).toContain('Sending...');

		unmount(instance);
	});

	it('handles send error', async () => {
		mockState.selectedConversation = { id: 'c1', participants: [], unreadCount: 0 };
		const target = document.createElement('div');
		const instance = mount(Composer, { target });
		await flushSync();

		mockSendMessage.mockRejectedValueOnce(new Error('Send failed'));

		const textarea = target.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = 'Fail me';
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		const button = target.querySelector('button') as HTMLButtonElement;
		button.click();
		await flushSync();

		expect(mockSendMessage).toHaveBeenCalledWith('Fail me');
		// Should NOT clear content on error
		expect(textarea.value).toBe('Fail me');

		unmount(instance);
	});
});