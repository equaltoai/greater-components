import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import UserButton from '../src/UserButton.svelte';

// Mock primitives to expose Menu content always
vi.mock('@equaltoai/greater-components-primitives', async () => {
	const MockMenu = (await import('./fixtures/MockMenu.svelte')).default;
	const MockMenuItem = (await import('./fixtures/MockMenuItem.svelte')).default;
	const SlotRenderer = MockMenu;

	return {
		Menu: {
			Root: MockMenu,
			Trigger: MockMenu,
			Content: MockMenu,
			Header: MockMenu,
			Separator: MockMenu,
			Item: MockMenuItem,
		},
		Avatar: SlotRenderer,
		Text: SlotRenderer,
		Spinner: SlotRenderer,
	};
});

describe('UserButton (Mocked)', () => {
	const defaultUser = {
		name: 'Jane Doe',
		email: 'jane@example.com',
		imageUrl: 'https://example.com/avatar.jpg',
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders dropdown content immediately (mocked)', () => {
		render(UserButton, {
			props: {
				user: defaultUser,
				variant: 'dropdown',
			},
		});

		// Check for menu content which should be visible due to mock
		expect(screen.getByText('Jane Doe')).toBeTruthy();
		expect(screen.getByText('jane@example.com')).toBeTruthy();
		expect(screen.getByText('Sign out')).toBeTruthy();
	});

	it('calls onSignOut when clicking sign out item', async () => {
		const onSignOut = vi.fn();
		render(UserButton, {
			props: {
				user: defaultUser,
				variant: 'dropdown',
				onSignOut,
			},
		});

		const signOutBtn = screen.getByText('Sign out');
		await fireEvent.click(signOutBtn);

		expect(onSignOut).toHaveBeenCalled();
	});

	it('renders custom menu items', async () => {
		const onSettings = vi.fn();
		const menuItems = [{ id: 'settings', label: 'Settings', onClick: onSettings }];

		render(UserButton, {
			props: {
				user: defaultUser,
				variant: 'dropdown',
				menuItems,
				onSignOut: vi.fn(),
			},
		});

		const settingsBtn = screen.getByText('Settings');
		expect(settingsBtn).toBeTruthy();

		await fireEvent.click(settingsBtn);
		expect(onSettings).toHaveBeenCalled();
	});

	it('disables menu items', async () => {
		const onSettings = vi.fn();
		const menuItems = [{ id: 'settings', label: 'Settings', onClick: onSettings, disabled: true }];

		render(UserButton, {
			props: {
				user: defaultUser,
				variant: 'dropdown',
				menuItems,
				onSignOut: vi.fn(),
			},
		});

		const settingsBtn = screen.getByText('Settings');
		await fireEvent.click(settingsBtn);

		// With our mock, we check if onclick is not called or if we should simulate disabling.
		// UserButton's handleMenuItemClick checks item.disabled.
		// Our mock calls the handler.
		// UserButton passes `onclick={() => handleMenuItemClick(item)}` to Menu.Item.
		// handleMenuItemClick checks item.disabled and returns early.
		expect(onSettings).not.toHaveBeenCalled();
	});
});
