import { describe, expect, it, vi } from 'vitest';
import { mount, unmount } from 'svelte';
import ConversationsContextHarness from './fixtures/ConversationsContextHarness.svelte';

describe('Conversations with a real messages context', () => {
	it.each([
		['controlled', true],
		['uncontrolled', false],
	] as const)(
		'keeps %s folder tabs synchronized with the list after accepting a request',
		async (_mode, controlled) => {
			const target = document.createElement('div');
			const instance = mount(ConversationsContextHarness, {
				target,
				props: { controlled },
			});

			await vi.waitFor(() => {
				expect(target.querySelector('.request-action'), target.innerHTML).toBeTruthy();
			});
			const initialTabs = target.querySelectorAll('[role="tab"]');
			expect(initialTabs[0]?.getAttribute('aria-selected')).toBe('false');
			expect(initialTabs[1]?.getAttribute('aria-selected')).toBe('true');

			(target.querySelector('.request-action') as HTMLButtonElement).click();

			await vi.waitFor(() => {
				expect(target.textContent).toContain('Bob');
				expect(target.textContent).not.toContain('Alice');
			});
			const nextTabs = target.querySelectorAll('[role="tab"]');
			expect(nextTabs[0]?.getAttribute('aria-selected')).toBe('true');
			expect(nextTabs[1]?.getAttribute('aria-selected')).toBe('false');
			if (controlled) {
				expect(target.querySelector('output')?.dataset.boundFolder).toBe('INBOX');
			}

			unmount(instance);
		}
	);
});
