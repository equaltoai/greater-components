import { describe, it, expect, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import NotificationFilters from '../src/NotificationFilters.svelte';

// Mock Primitives
vi.mock('@equaltoai/greater-components-primitives', async () => {
	const SettingsSection = (await import('./mocks/MockSettingsSection.svelte')).default;
	const SettingsToggle = (await import('./mocks/MockSettingsToggle.svelte')).default;
	return {
		SettingsSection,
		SettingsToggle,
	};
});

describe('NotificationFilters', () => {
	it('renders all toggles', async () => {
		const target = document.createElement('div');
		const filters = {
			mentions: true,
			favorites: true,
			reblogs: true,
			follows: true,
			polls: false,
		};

		const instance = mount(NotificationFilters, {
			target,
			props: { filters },
		});
		await flushSync();

		expect(target.textContent).toContain('Notification Types');
		expect(target.textContent).toContain('Mentions');
		expect(target.textContent).toContain('Favorites');
		expect(target.textContent).toContain('Boosts');
		expect(target.textContent).toContain('Follows');
		expect(target.textContent).toContain('Polls');

		const inputs = target.querySelectorAll('input[type="checkbox"]');
		expect(inputs.length).toBe(5);
		expect((inputs[0] as HTMLInputElement).checked).toBe(true); // Mentions
		expect((inputs[4] as HTMLInputElement).checked).toBe(false); // Polls

		unmount(instance);
	});

	it('updates filters when toggled', async () => {
		const target = document.createElement('div');
		const filters = {
			mentions: true,
			favorites: true,
			reblogs: true,
			follows: true,
			polls: false,
		};
		const onChange = vi.fn();

		const instance = mount(NotificationFilters, {
			target,
			props: { filters, onChange },
		});
		await flushSync();

		const inputs = target.querySelectorAll('input[type="checkbox"]');
		const mentionsInput = inputs[0] as HTMLInputElement; // Mentions

		mentionsInput.checked = false;
		mentionsInput.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();

		// Check if onChange was called (effect runs)
		expect(onChange).toHaveBeenCalled();
		expect(filters.mentions).toBe(false);

		unmount(instance);
	});
});
