import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import MenuHarness from './harness/MenuHarness.svelte';

const renderMenu = (props?: Record<string, unknown>) =>
	render(MenuHarness, {
		props: { props },
	});

describe('Menu.svelte', () => {
	it('opens via trigger and selects an item', async () => {
		const onItemSelect = vi.fn();
		renderMenu({ onItemSelect });

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		const menu = await screen.findByRole('menu');
		expect(menu).toBeTruthy();

		const settings = screen.getByRole('menuitem', { name: 'Settings' });
		await fireEvent.click(settings);

		expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'settings' }));
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it('supports keyboard navigation and closes on Escape', async () => {
		renderMenu();

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		const menu = await screen.findByRole('menu');

		await fireEvent.keyDown(menu, { key: 'ArrowDown' });
		await fireEvent.keyDown(menu, { key: 'ArrowDown' });

		expect(document.activeElement?.textContent).toContain('Settings');

		await fireEvent.keyDown(menu, { key: 'Escape' });
		expect(screen.queryByRole('menu')).toBeNull();
	});
});
