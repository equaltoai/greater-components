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

	it('supports keyboard navigation (ArrowDown)', async () => {
		render(MenuCompoundHarness);

		const trigger = screen.getByTestId('menu-trigger');
		trigger.focus();
		await fireEvent.keyDown(trigger, { key: 'ArrowDown' });

		await waitFor(() => expect(screen.getByTestId('menu-content')).toBeTruthy());
		
		// Wait for focus to move into the menu
		// This depends on the implementation details of how focus is managed in the new Menu
		// Often it focuses the first item or the container
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
