import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import UnreadIndicator from '../src/UnreadIndicator.svelte';

// Mock context
const { mockState } = vi.hoisted(() => ({
	mockState: {
		conversations: [],
	},
}));

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getMessagesContext: () => ({
			state: mockState,
		}),
	};
});

describe('UnreadIndicator', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.conversations = [];
	});

	it('renders nothing when no unread and showZero is false', () => {
		const target = document.createElement('div');
		const instance = mount(UnreadIndicator, { target });

		expect(target.querySelector('.unread-indicator')).toBeFalsy();

		unmount(instance);
	});

	it('renders count when has unread messages', async () => {
		mockState.conversations = [{ unreadCount: 5 }, { unreadCount: 2 }];

		const target = document.createElement('div');
		const instance = mount(UnreadIndicator, { target });
		await flushSync();

		const indicator = target.querySelector('.unread-indicator');
		expect(indicator).toBeTruthy();
		expect(indicator?.textContent).toBe('7');
		expect(indicator?.getAttribute('aria-label')).toBe('7 unread messages');

		unmount(instance);
	});

	it('renders zero when showZero is true', async () => {
		mockState.conversations = [];

		const target = document.createElement('div');
		const instance = mount(UnreadIndicator, { target, props: { showZero: true } });
		await flushSync();

		expect(target.querySelector('.unread-indicator')?.textContent).toBe('0');

		unmount(instance);
	});

	it('formats counts over 99', async () => {
		mockState.conversations = [{ unreadCount: 100 }];

		const target = document.createElement('div');
		const instance = mount(UnreadIndicator, { target });
		await flushSync();

		expect(target.querySelector('.unread-indicator')?.textContent).toBe('99+');

		unmount(instance);
	});

	it('handles variants', async () => {
		mockState.conversations = [{ unreadCount: 1 }];

		const target = document.createElement('div');
		const instance = mount(UnreadIndicator, { target, props: { variant: 'dot' } });
		await flushSync();

		const indicator = target.querySelector('.unread-indicator');
		expect(indicator?.classList.contains('unread-indicator--dot')).toBe(true);
		expect(indicator?.textContent?.trim()).toBe(''); // Dot has no text

		unmount(instance);
	});

	it('handles sizes', async () => {
		mockState.conversations = [{ unreadCount: 1 }];

		const target = document.createElement('div');
		const instance = mount(UnreadIndicator, { target, props: { size: 'small' } });
		await flushSync();

		const indicator = target.querySelector('.unread-indicator');
		expect(indicator?.classList.contains('unread-indicator--small')).toBe(true);

		unmount(instance);
	});
});
