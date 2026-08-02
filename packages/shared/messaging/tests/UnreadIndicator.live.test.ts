import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import UnreadIndicatorHarness from './fixtures/UnreadIndicatorHarness.svelte';

const ANNOUNCEMENT_DEBOUNCE_MS = 150;
const ANNOUNCEMENT_MAX_WAIT_MS = 1_000;

describe('UnreadIndicator live announcements', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('keeps the empty live region mounted before announcing the zero-to-one transition', async () => {
		const target = document.createElement('div');
		const instance = mount(UnreadIndicatorHarness, { target });
		const liveRegion = target.querySelector('[role="status"]');

		expect(liveRegion).toBeTruthy();
		expect(liveRegion?.textContent?.trim()).toBe('');

		(target.querySelector('[data-testid="set-one"]') as HTMLButtonElement).click();
		await flushSync();
		expect(target.querySelector('.unread-indicator')?.textContent).toBe('1');
		expect(liveRegion?.textContent?.trim()).toBe('');

		await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DEBOUNCE_MS);
		await flushSync();
		expect(liveRegion?.textContent?.trim()).toBe('1 conversation with unread messages');

		unmount(instance);
	});

	it('announces the dot variant through visually hidden live-region text', async () => {
		const target = document.createElement('div');
		const instance = mount(UnreadIndicatorHarness, { target, props: { variant: 'dot' } });

		(target.querySelector('[data-testid="set-one"]') as HTMLButtonElement).click();
		await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DEBOUNCE_MS);
		await flushSync();

		const indicator = target.querySelector('.unread-indicator');
		const liveRegion = target.querySelector('[role="status"]');
		expect(indicator?.textContent?.trim()).toBe('');
		expect(liveRegion?.querySelector('.gr-sr-only')?.textContent?.trim()).toBe(
			'1 conversation with unread messages'
		);

		unmount(instance);
	});

	it('coalesces a realtime burst into one announcement with the final count', async () => {
		const target = document.createElement('div');
		const instance = mount(UnreadIndicatorHarness, { target });
		const liveRegion = target.querySelector('[role="status"]') as HTMLElement;
		const announcements: string[] = [];
		const observer = new MutationObserver(() => {
			const announcement = liveRegion.textContent?.trim();
			if (announcement) announcements.push(announcement);
		});
		observer.observe(liveRegion, { childList: true, characterData: true, subtree: true });

		(target.querySelector('[data-testid="burst"]') as HTMLButtonElement).click();
		await vi.advanceTimersByTimeAsync(20);
		await flushSync();

		expect(target.querySelector('.unread-indicator')?.textContent).toBe('3');
		expect(liveRegion.textContent?.trim()).toBe('');

		await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DEBOUNCE_MS);
		await flushSync();
		await Promise.resolve();

		expect(liveRegion.textContent?.trim()).toBe('3 conversations with unread messages');
		expect(announcements).toEqual(['3 conversations with unread messages']);

		observer.disconnect();
		unmount(instance);
	});

	it('announces the current count within the max wait during sustained churn', async () => {
		const target = document.createElement('div');
		const instance = mount(UnreadIndicatorHarness, { target });
		const liveRegion = target.querySelector('[role="status"]') as HTMLElement;

		(target.querySelector('[data-testid="sustained-churn"]') as HTMLButtonElement).click();
		await flushSync();

		await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_MAX_WAIT_MS - 1);
		await flushSync();
		expect(liveRegion.textContent?.trim()).toBe('');

		await vi.advanceTimersByTimeAsync(1);
		await flushSync();
		const currentCount = target.querySelector('.unread-indicator')?.textContent?.trim();

		expect(currentCount).toBe('11');
		expect(liveRegion.textContent?.trim()).toBe(
			`${currentCount} conversations with unread messages`
		);

		unmount(instance);
	});

	it('clears pending debounce and max-wait timers on unmount', async () => {
		const target = document.createElement('div');
		const instance = mount(UnreadIndicatorHarness, { target });

		(target.querySelector('[data-testid="set-one"]') as HTMLButtonElement).click();
		await flushSync();
		expect(vi.getTimerCount()).toBe(2);

		unmount(instance);
		expect(vi.getTimerCount()).toBe(0);
	});
});
