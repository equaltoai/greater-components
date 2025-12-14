import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import RootWrapper from './RootWrapper.svelte';
// import * as context from '../src/context.svelte.js';

describe('Notifications.Root', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders children', () => {
		const target = document.createElement('div');
		const instance = mount(RootWrapper, { target });

		expect(target.querySelector('[data-testid="child-content"]')).toBeTruthy();

		unmount(instance);
	});

	it('renders loading state', () => {
		const target = document.createElement('div');
		const instance = mount(RootWrapper, {
			target,
			props: {
				initialState: { loading: true },
			},
		});

		const rootDiv = target.querySelector('.notifications-root');
		expect(rootDiv?.classList.contains('notifications-root--loading')).toBe(true);
		expect(rootDiv?.getAttribute('aria-busy')).toBe('true');

		unmount(instance);
	});

	it('renders error message', () => {
		const target = document.createElement('div');
		const error = new Error('Test error');
		const instance = mount(RootWrapper, {
			target,
			props: {
				initialState: { error },
			},
		});

		expect(target.textContent).toContain('Test error');
		expect(target.querySelector('.notifications-root__error')).toBeTruthy();

		unmount(instance);
	});

	it('shows mark all as read button when unread count > 0', () => {
		const target = document.createElement('div');
		const handlers = {
			onMarkAllRead: vi.fn(),
		};
		const instance = mount(RootWrapper, {
			target,
			props: {
				handlers,
				initialState: { unreadCount: 5 },
			},
		});

		expect(target.textContent).toContain('5 unread');
		expect(target.querySelector('.notifications-root__mark-read')).toBeTruthy();

		unmount(instance);
	});

	it('calls onMarkAllRead when button clicked', async () => {
		const target = document.createElement('div');
		const handlers = {
			onMarkAllRead: vi.fn().mockResolvedValue(undefined),
		};
		const instance = mount(RootWrapper, {
			target,
			props: {
				handlers,
				initialState: { unreadCount: 5 },
			},
		});

		const btn = target.querySelector('.notifications-root__mark-read') as HTMLButtonElement;
		btn.click();
		await flushSync();

		expect(handlers.onMarkAllRead).toHaveBeenCalled();

		// Wait for async operation to complete
		await new Promise((r) => setTimeout(r, 10));
		await flushSync();

		expect(target.textContent).not.toContain('5 unread');

		unmount(instance);
	});

	it('handles error in mark all as read', async () => {
		const target = document.createElement('div');
		const error = new Error('Failed to mark read');
		const handlers = {
			onMarkAllRead: vi.fn().mockRejectedValue(error),
		};
		const instance = mount(RootWrapper, {
			target,
			props: {
				handlers,
				initialState: { unreadCount: 5 },
			},
		});

		const btn = target.querySelector('.notifications-root__mark-read') as HTMLButtonElement;
		btn.click();
		await flushSync();

		await new Promise((r) => setTimeout(r, 10));
		await flushSync();

		expect(target.textContent).toContain('Failed to mark read');

		unmount(instance);
	});
});
