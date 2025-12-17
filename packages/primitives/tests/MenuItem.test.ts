import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import MenuItemTestHarness from './harness/MenuItemTestHarness.svelte';

describe('Menu.Item', () => {
	it('renders item with icon', async () => {
		render(MenuItemTestHarness);
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => {
			expect(screen.getByTestId('mock-icon')).toBeTruthy();
		});
	});

	it('renders item with label prop', async () => {
		render(MenuItemTestHarness);
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => {
			expect(screen.getByText('Label Item')).toBeTruthy();
		});
	});

	it('renders item with shortcut', async () => {
		render(MenuItemTestHarness);
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => {
			expect(screen.getByText('⌘K')).toBeTruthy();
		});
	});

	it('selects item on Enter key', async () => {
		const onSelect = vi.fn();
		render(MenuItemTestHarness, { onSelect });
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => expect(screen.getByText('Label Item')).toBeTruthy());

		const item = screen.getByText('Label Item').closest('[role="menuitem"]');
		if (!item) throw new Error('Item not found');

		await fireEvent.keyDown(item, { key: 'Enter' });
		expect(onSelect).toHaveBeenCalledWith('label-item');
	});

	it('selects item on Space key', async () => {
		const onSelect = vi.fn();
		render(MenuItemTestHarness, { onSelect });
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => expect(screen.getByText('Label Item')).toBeTruthy());

		const item = screen.getByText('Label Item').closest('[role="menuitem"]');
		if (!item) throw new Error('Item not found');

		await fireEvent.keyDown(item, { key: ' ' });
		expect(onSelect).toHaveBeenCalledWith('label-item');
	});

	it('does not select disabled item on click', async () => {
		const onSelect = vi.fn();
		render(MenuItemTestHarness, { onSelect });
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => expect(screen.getByText('Disabled Item')).toBeTruthy());

		const item = screen.getByText('Disabled Item').closest('[role="menuitem"]');
		if (!item) throw new Error('Item not found');

		await fireEvent.click(item);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('does not select disabled item on Enter key', async () => {
		const onSelect = vi.fn();
		render(MenuItemTestHarness, { onSelect });
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => expect(screen.getByText('Disabled Item')).toBeTruthy());

		const item = screen.getByText('Disabled Item').closest('[role="menuitem"]');
		if (!item) throw new Error('Item not found');

		await fireEvent.keyDown(item, { key: 'Enter' });
		expect(onSelect).not.toHaveBeenCalledWith('disabled-item');
	});

	it('focuses item on mouse enter', async () => {
		render(MenuItemTestHarness);
		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		await waitFor(() => expect(screen.getByText('Label Item')).toBeTruthy());

		const item = screen.getByText('Label Item').closest('[role="menuitem"]');
		if (!item) throw new Error('Item not found');

		await fireEvent.mouseEnter(item);

		// Check if active class is applied or if it's focused.
		// The component uses class:gr-menu-item--active={isActive}
		await waitFor(() => {
			expect(item.classList.contains('gr-menu-item--active')).toBe(true);
		});
	});
});
