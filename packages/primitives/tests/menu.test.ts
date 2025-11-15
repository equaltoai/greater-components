import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
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
		const profile = screen.getByRole('menuitem', { name: 'Profile' });
		await waitFor(() => expect(document.activeElement).toBe(profile));

		await fireEvent.keyDown(menu, { key: 'ArrowDown' });
		await waitFor(() => expect(document.activeElement?.textContent).toContain('Settings'));
		await fireEvent.keyDown(menu, { key: 'ArrowDown' });
		await waitFor(() => expect(document.activeElement?.textContent).toContain('Profile'));

		await fireEvent.keyDown(menu, { key: 'Escape' });
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it('supports horizontal navigation while skipping disabled items', async () => {
		renderMenu({ orientation: 'horizontal' });

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		const menu = await screen.findByRole('menubar');

		await fireEvent.keyDown(menu, { key: 'ArrowRight' });
		await fireEvent.keyDown(menu, { key: 'ArrowRight' });
		expect(document.activeElement?.textContent).toContain('Settings');

		await fireEvent.keyDown(menu, { key: 'ArrowLeft' });
		expect(document.activeElement?.textContent).toContain('Profile');
	});

	it('expands vertical submenus, supports typeahead, and restores focus on close', async () => {
		const onItemSelect = vi.fn();
		const submenuItems = [
			{ id: 'profile', label: 'Profile', submenu: [{ id: 'edit-profile', label: 'Edit Profile' }] },
			{ id: 'disabled', label: 'Disabled', disabled: true },
			{ id: 'logout', label: 'Logout' },
		];

		renderMenu({ items: submenuItems, onItemSelect });

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		const menu = await screen.findByRole('menu');
		const profileLabel = screen.getByText('Profile');
		const profileItem = profileLabel.closest('[role="menuitem"]') as HTMLElement | null;
		expect(profileItem).not.toBeNull();
		if (!profileItem) throw new Error('menu item not found');

		await fireEvent.focus(profileItem);
		await waitFor(() => {
			expect(document.activeElement).toBe(profileItem);
		});

		await fireEvent.keyDown(menu, { key: 'ArrowRight' });
		expect(screen.getByText('Edit Profile')).toBeTruthy();

		await fireEvent.keyDown(menu, { key: 'ArrowLeft' });
		await waitFor(() => {
			expect(screen.queryByText('Edit Profile')).toBeNull();
		});

		await fireEvent.keyDown(menu, { key: 'l' });
		expect(document.activeElement?.textContent).toContain('Logout');
		await fireEvent.keyDown(menu, { key: 'Enter' });
		expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'logout' }));

		await fireEvent.keyDown(menu, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
		expect(document.activeElement).toBe(trigger);
	});

	it('updates active focus vertically, blurs on Tab, and restores focus on close', async () => {
		renderMenu();

		const trigger = screen.getByTestId('menu-trigger');
		await fireEvent.click(trigger);

		const menu = await screen.findByRole('menu');
		const profile = screen.getByRole('menuitem', { name: 'Profile' });
		const settings = screen.getByRole('menuitem', { name: 'Settings' });
		await waitFor(() => expect(document.activeElement).toBe(profile));

		await fireEvent.keyDown(menu, { key: 'ArrowDown' });
		await waitFor(() => expect(document.activeElement).toBe(settings));

		await fireEvent.keyDown(menu, { key: 'ArrowDown' });
		await waitFor(() => expect(document.activeElement).toBe(profile));

		const outsideButton = document.createElement('button');
		outsideButton.textContent = 'Outside';
		document.body.appendChild(outsideButton);

		await fireEvent.keyDown(menu, { key: 'Tab' });
		outsideButton.focus();
		await waitFor(() => expect(document.activeElement).toBe(outsideButton));

		await fireEvent.keyDown(menu, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(trigger));

		document.body.removeChild(outsideButton);
	});
});
