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
			close: (node: HTMLElement) => {
				// Mock close action click handler if needed, usually handled by button helper
				// but here let's just make it do nothing or simulate click if we test it specifically
				return { destroy: () => {} };
			},
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

	it('closes modal on cancel', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		const cancelBtn = target.querySelector('.new-conversation__button--secondary') as HTMLButtonElement;
		cancelBtn.click();
		await flushSync();

		expect(target.querySelector('.new-conversation__modal')).toBeFalsy();

		unmount(instance);
	});

	it('searches participants', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u1', displayName: 'Alice', username: 'alice' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));

		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		expect(mockHandlers.onSearchParticipants).toHaveBeenCalledWith('Ali');
		expect(target.querySelector('.new-conversation__result')).toBeTruthy();
		expect(target.textContent).toContain('Alice');

		unmount(instance);
	});

	it('handles empty search results', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onSearchParticipants.mockResolvedValue([]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Unknown';
		input.dispatchEvent(new Event('input', { bubbles: true }));

		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		expect(target.querySelector('.new-conversation__empty')).toBeTruthy();
		expect(target.textContent).toContain('No users found matching "Unknown"');

		unmount(instance);
	});

	it('handles search error', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onSearchParticipants.mockRejectedValue(new Error('Search failed'));

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Fail';
		input.dispatchEvent(new Event('input', { bubbles: true }));

		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		expect(target.querySelector('.new-conversation__error')).toBeTruthy();
		expect(target.textContent).toContain('Search failed');

		unmount(instance);
	});

	it('selects and removes participant', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

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

		expect(target.querySelector('.new-conversation__chip-name')?.textContent).toContain('Alice');
		
		// Search query should be cleared
		expect(input.value).toBe('');

		// Remove
		const removeBtn = target.querySelector('.new-conversation__chip-remove') as HTMLButtonElement;
		removeBtn.click();
		await flushSync();

		expect(target.querySelector('.new-conversation__chip-name')).toBeFalsy();

		unmount(instance);
	});

	it('prevents selecting same participant twice', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		const user = { id: 'u1', displayName: 'Alice', username: 'alice' };
		mockHandlers.onSearchParticipants.mockResolvedValue([user]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		// Select
		const result = target.querySelector('.new-conversation__result') as HTMLButtonElement;
		result.click();
		await flushSync();

		// Search again (mocking same result)
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		// Result should be disabled or marked
		const resultAgain = target.querySelector('.new-conversation__result') as HTMLButtonElement;
		expect(resultAgain.disabled).toBe(true);

		// Click anyway (shouldn't add duplicate)
		resultAgain.click();
		await flushSync();

		const chips = target.querySelectorAll('.new-conversation__chip');
		expect(chips.length).toBe(1);

		unmount(instance);
	});

	it('creates conversation', async () => {
		const target = document.createElement('div');
		const onConversationCreated = vi.fn();
		const instance = mount(NewConversation, { target, props: { onConversationCreated } });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u1', displayName: 'Alice', username: 'alice' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		(target.querySelector('.new-conversation__result') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onCreateConversation.mockResolvedValue({ id: 'c1' });

		const startBtn = target.querySelector('.new-conversation__button--primary') as HTMLButtonElement;
		startBtn.click();
		await new Promise((resolve) => setTimeout(resolve, 0));
		await flushSync();

		expect(mockHandlers.onCreateConversation).toHaveBeenCalledWith(['u1']);
		expect(mockSelectConversation).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));
		expect(onConversationCreated).toHaveBeenCalledWith('c1');
		expect(target.querySelector('.new-conversation__modal')).toBeFalsy();

		unmount(instance);
	});

	it('handles create conversation returning null', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onSearchParticipants.mockResolvedValue([
			{ id: 'u1', displayName: 'Alice', username: 'alice' },
		]);

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'Ali';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 350));
		await flushSync();

		(target.querySelector('.new-conversation__result') as HTMLButtonElement).click();
		await flushSync();

		mockHandlers.onCreateConversation.mockResolvedValue(null);

		const startBtn = target.querySelector('.new-conversation__button--primary') as HTMLButtonElement;
		startBtn.click();
		await new Promise((resolve) => setTimeout(resolve, 0));
		await flushSync();

		// Should stay open
		expect(target.querySelector('.new-conversation__modal')).toBeTruthy();
		expect(target.querySelector('.new-conversation__error')).toBeFalsy(); // No error displayed, just nothing happens
		expect(mockSelectConversation).not.toHaveBeenCalled();

		unmount(instance);
	});

	it('handles error during creation', async () => {
		const target = document.createElement('div');
		const instance = mount(NewConversation, { target });
		await flushSync();

		(target.querySelector('.new-conversation__trigger') as HTMLButtonElement).click();
		await flushSync();

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

		mockHandlers.onCreateConversation.mockRejectedValue(new Error('Failed'));

		const startBtn = target.querySelector('.new-conversation__button--primary') as HTMLButtonElement;
		startBtn.click();
		await new Promise((resolve) => setTimeout(resolve, 0));
		await flushSync();

		expect(target.querySelector('.new-conversation__error')?.textContent).toContain('Failed');
		expect(target.querySelector('.new-conversation__modal')).toBeTruthy();

		unmount(instance);
	});
});