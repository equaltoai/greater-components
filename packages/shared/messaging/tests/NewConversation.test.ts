import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import NewConversation from '../src/NewConversation.svelte';

// Mock context
const { mockHandlers, mockSelectConversation } = vi.hoisted(() => ({
	mockHandlers: {
		onSearchParticipants: vi.fn(),
		onCreateConversation: vi.fn(),
	},
	mockSelectConversation: vi.fn(),
}));

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getMessagesContext: () => ({
			handlers: mockHandlers,
			selectConversation: mockSelectConversation,
		}),
	};
});

// Mock headless
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

vi.mock('@equaltoai/greater-components-headless/modal', () => ({
	createModal: () => ({
		helpers: {
			open: vi.fn(),
			close: vi.fn(),
		},
		actions: {
			backdrop: () => {},
			content: () => {},
			close: (_node: HTMLElement) => {},
		},
	}),
}));

describe('NewConversation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders trigger button', () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });

		expect(target.querySelector('.new-conversation__trigger')).toBeTruthy();
		expect(target.querySelector('.new-conversation__modal')).toBeFalsy();

		unmount(instance);
	});

	it('opens modal on trigger click', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		const trigger = target.querySelector('.new-conversation__trigger') as HTMLButtonElement;
		trigger.click();
		await flushSync();

		expect(target.querySelector('.new-conversation__modal')).toBeTruthy();

		unmount(instance);
	});

	it('searches participants', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		// Open
		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u1', displayName: 'Alice', username: 'alice' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));

		// Wait debounce
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		expect(mockHandlers.onSearchParticipants).toHaveBeenCalledWith('Ali');
		expect(target.querySelector('.new-conversation__result')).toBeTruthy();
		expect(target.textContent).toContain('Alice');

		unmount(instance);
	});

	it('selects participant', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		// Open
		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		// Mock result
		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u1', displayName: 'Alice', username: 'alice' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		// Select
		const result = target.querySelector('.new-conversation__result') as HTMLButtonElement;
		result.click();
		await flushSync();

		// Check selected chips
		expect(target.querySelector('.new-conversation__chip-name')?.textContent).toContain('Alice');

		unmount(instance);
	});

	it('creates conversation', async () => {
		const target = document.createElement('div');
		const onConversationCreated = vi.fn();
		const instance = mount(NewConversation, { target, props: { onConversationCreated } });
		await flushSync();

		// Open
		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		// Mock result
		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u1', displayName: 'Alice', username: 'alice' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		// Select
		(target.querySelector('.new-conversation__result') as HTMLButtonElement).click();
		await flushSync();

		// Create
		mockHandlers.onCreateConversation.mockResolvedValue({ id: 'c1' });

		const startBtn = target.querySelector(
			'.new-conversation__button--primary'
		) as HTMLButtonElement;
		startBtn.click();
		await new Promise((resolve) => setTimeout(resolve, 0)); // Async handler
		await flushSync();

		expect(mockHandlers.onCreateConversation).toHaveBeenCalledWith(['u1']);
		expect(mockSelectConversation).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));
		expect(onConversationCreated).toHaveBeenCalledWith('c1');
		expect(target.querySelector('.new-conversation__modal')).toBeFalsy();

		unmount(instance);
	});

	it('handles error during creation', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		// Open
		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		// Mock result & Select
		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u1', displayName: 'A', username: 'a' },
		]);
		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'A';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();
		(target.querySelector('.new-conversation__result') as HTMLButtonElement).click();
		await flushSync();

		// Fail creation
		mockHandlers.onCreateConversation.mockRejectedValue(new Error('Failed'));

		const startBtn = target.querySelector(
			'.new-conversation__button--primary'
		) as HTMLButtonElement;
		startBtn.click();
		await new Promise((resolve) => setTimeout(resolve, 0));
		await flushSync();

		expect(target.querySelector('.new-conversation__error')?.textContent).toContain('Failed');
		expect(target.querySelector('.new-conversation__modal')).toBeTruthy(); // Still open

		unmount(instance);
	});
});
