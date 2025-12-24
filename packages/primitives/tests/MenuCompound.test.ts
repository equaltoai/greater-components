// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import MenuCompoundHarness from './harness/MenuCompoundHarness.svelte';
import MenuHeaderHarness from './harness/MenuHeaderHarness.svelte';

describe('Menu (Compound)', () => {
	it('opens via trigger and renders content', async () => {
		render(MenuCompoundHarness);

		const trigger = screen.getByTestId('menu-trigger');
		expect(screen.queryByTestId('menu-content')).toBeNull();

		await fireEvent.click(trigger);
		await waitFor(() => expect(screen.getByTestId('menu-content')).toBeTruthy());
	});

	it('selects an item and fires onselect', async () => {
		const onSelect = vi.fn();
		render(MenuCompoundHarness, { onSelect });

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		const profileItem = screen.getByText('Profile');
		await fireEvent.click(profileItem);

		expect(onSelect).toHaveBeenCalledWith('profile');
	});

	it('does not select disabled items', async () => {
		const onSelect = vi.fn();
		render(MenuCompoundHarness, { onSelect });

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		const disabledItem = screen.getByText('Disabled');
		await fireEvent.click(disabledItem);

		expect(onSelect).not.toHaveBeenCalled();
	});

	describe('Keyboard Navigation', () => {
		it('opens and focuses first item on ArrowDown', async () => {
			render(MenuCompoundHarness);
			const trigger = screen.getByTestId('menu-trigger');
			trigger.focus();
			await fireEvent.keyDown(trigger, { key: 'ArrowDown' });

			await waitFor(() => expect(screen.getByTestId('menu-content')).toBeTruthy());

			// Should focus first non-disabled item (Profile)
			// The active element is the menuitem div, not the span with text
			const profileItem = screen.getByText('Profile').closest('[role="menuitem"]');
			await waitFor(() => expect(document.activeElement).toBe(profileItem));
		});

		it('navigates with ArrowDown/ArrowUp', async () => {
			render(MenuCompoundHarness);
			const trigger = screen.getByTestId('menu-trigger');
			await fireEvent.click(trigger);
			await waitFor(() => expect(screen.getByTestId('menu-content')).toBeTruthy());

			// Get menu items (the focusable elements)
			const profile = screen.getByText('Profile').closest('[role="menuitem"]') as HTMLElement;
			const settings = screen.getByText('Settings').closest('[role="menuitem"]') as HTMLElement;

			if (!profile || !settings) throw new Error('Could not find menu items');

			// Assume initial focus is on Profile
			profile.focus();

			await fireEvent.keyDown(profile, { key: 'ArrowDown' });
			expect(document.activeElement).toBe(settings);

			await fireEvent.keyDown(settings, { key: 'ArrowUp' });
			expect(document.activeElement).toBe(profile);
		});

		it('navigates to start/end with Home/End', async () => {
			render(MenuCompoundHarness);
			const trigger = screen.getByTestId('menu-trigger');
			await fireEvent.click(trigger);

			const profile = screen.getByText('Profile').closest('[role="menuitem"]') as HTMLElement;
			const settings = screen.getByText('Settings').closest('[role="menuitem"]') as HTMLElement;

			if (!profile || !settings) throw new Error('Could not find menu items');

			profile.focus();

			await fireEvent.keyDown(profile, { key: 'End' });
			expect(document.activeElement).toBe(settings); // Last enabled item

			await fireEvent.keyDown(settings, { key: 'Home' });
			expect(document.activeElement).toBe(profile); // First enabled item
		});

		it.skip('supports typeahead', async () => {
			vi.useFakeTimers();
			render(MenuCompoundHarness);
			const trigger = screen.getByTestId('menu-trigger');
			await fireEvent.click(trigger);

			const profile = screen.getByText('Profile').closest('[role="menuitem"]') as HTMLElement;
			const settings = screen.getByText('Settings').closest('[role="menuitem"]') as HTMLElement;

			if (!profile || !settings) throw new Error('Could not find menu items');

			profile.focus();

			await fireEvent.keyDown(profile, { key: 's', code: 'KeyS' });

			// Advance timers to handle any debouncing or typeahead buffer logic
			// Headless tests suggest it might depend on timers
			await vi.advanceTimersByTimeAsync(100);

			// Should jump to Settings
			expect(document.activeElement).toBe(settings);
			vi.useRealTimers();
		});

		it('closes on Tab', async () => {
			render(MenuCompoundHarness);
			const trigger = screen.getByTestId('menu-trigger');
			await fireEvent.click(trigger);

			const menu = screen.getByTestId('menu-content');
			await fireEvent.keyDown(menu, { key: 'Tab' });

			await waitFor(() => expect(screen.queryByTestId('menu-content')).toBeNull());
		});
	});

	it('closes on Escape', async () => {
		render(MenuCompoundHarness);

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);
		await waitFor(() => expect(screen.getByTestId('menu-content')).toBeTruthy());

		await fireEvent.keyDown(screen.getByTestId('menu-content'), { key: 'Escape' });

		await waitFor(() => expect(screen.queryByTestId('menu-content')).toBeNull());
	});

	it('renders Menu.Header correctly', async () => {
		render(MenuHeaderHarness);
		await waitFor(() => expect(screen.getByText('My Header')).toBeTruthy());

		const header = screen.getByText('My Header');
		expect(header.classList.contains('gr-menu-header')).toBe(true);
		expect(header.classList.contains('custom-header')).toBe(true);
	});
});
