/**
 * UserButton Component Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import UserButton from '../src/UserButton.svelte';

// Mock icon component
const MockIcon = {
	$$typeof: Symbol.for('svelte.component'),
	render: () => ({ html: '<svg data-testid="mock-icon"></svg>' }),
};

describe('UserButton', () => {
	const defaultUser = {
		name: 'Jane Doe',
		email: 'jane@example.com',
		imageUrl: 'https://example.com/avatar.jpg',
	};

	const defaultProps = {
		user: defaultUser,
		onSignOut: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Inline Variant', () => {
		it('renders user name', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline' } });
			expect(screen.getByText('Jane Doe')).toBeInTheDocument();
		});

		it('renders user email', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline' } });
			expect(screen.getByText('jane@example.com')).toBeInTheDocument();
		});

		it('renders avatar', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline' } });
			const avatar = screen.getByRole('img', { hidden: true });
			expect(avatar).toBeInTheDocument();
		});

		it('calls onSignOut when clicked', async () => {
			const onSignOut = vi.fn();
			render(UserButton, { props: { ...defaultProps, variant: 'inline', onSignOut } });
			
			const button = screen.getByRole('button');
			await fireEvent.click(button);
			
			expect(onSignOut).toHaveBeenCalled();
		});

		it('shows loading state during sign out', async () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline', loading: true } });
			
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-busy', 'true');
		});

		it('is disabled when loading', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline', loading: true } });
			
			const button = screen.getByRole('button');
			expect(button).toBeDisabled();
		});

		it('has accessible label', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline' } });
			
			expect(screen.getByRole('button', { name: /signed in as jane doe/i })).toBeInTheDocument();
		});
	});

	describe('Dropdown Variant', () => {
		it('renders avatar trigger button', () => {
			render(UserButton, { props: defaultProps });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			expect(trigger).toBeInTheDocument();
		});

		it('opens menu when trigger is clicked', async () => {
			render(UserButton, { props: defaultProps });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			// Menu should be visible
			expect(screen.getByRole('menu')).toBeInTheDocument();
		});

		it('displays user info in menu header', async () => {
			render(UserButton, { props: defaultProps });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			expect(screen.getByText('Jane Doe')).toBeInTheDocument();
			expect(screen.getByText('jane@example.com')).toBeInTheDocument();
		});

		it('renders custom menu items', async () => {
			const menuItems = [
				{ id: 'profile', label: 'Profile', onClick: vi.fn() },
				{ id: 'settings', label: 'Settings', onClick: vi.fn() },
			];
			
			render(UserButton, { props: { ...defaultProps, menuItems } });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
		});

		it('calls menu item onClick when clicked', async () => {
			const onClick = vi.fn();
			const menuItems = [{ id: 'profile', label: 'Profile', onClick }];
			
			render(UserButton, { props: { ...defaultProps, menuItems } });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			const profileItem = screen.getByRole('menuitem', { name: /profile/i });
			await fireEvent.click(profileItem);
			
			expect(onClick).toHaveBeenCalled();
		});

		it('renders sign out menu item', async () => {
			render(UserButton, { props: defaultProps });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			expect(screen.getByRole('menuitem', { name: /sign out/i })).toBeInTheDocument();
		});

		it('calls onSignOut when sign out item is clicked', async () => {
			const onSignOut = vi.fn();
			render(UserButton, { props: { ...defaultProps, onSignOut } });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			const signOutItem = screen.getByRole('menuitem', { name: /sign out/i });
			await fireEvent.click(signOutItem);
			
			expect(onSignOut).toHaveBeenCalled();
		});

		it('shows loading text during sign out', async () => {
			render(UserButton, { props: { ...defaultProps, loading: true } });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			expect(screen.getByRole('menuitem', { name: /signing out/i })).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('trigger has aria-haspopup for dropdown variant', () => {
			render(UserButton, { props: defaultProps });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
		});

		it('menu has correct role', async () => {
			render(UserButton, { props: defaultProps });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			expect(screen.getByRole('menu')).toBeInTheDocument();
		});

		it('menu items have menuitem role', async () => {
			const menuItems = [{ id: 'profile', label: 'Profile' }];
			render(UserButton, { props: { ...defaultProps, menuItems } });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
		});
	});

	describe('User without email', () => {
		it('renders without email in inline variant', () => {
			const userWithoutEmail = { name: 'Jane Doe' };
			render(UserButton, { props: { ...defaultProps, user: userWithoutEmail, variant: 'inline' } });
			
			expect(screen.getByText('Jane Doe')).toBeInTheDocument();
			expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
		});

		it('renders without email in dropdown variant', async () => {
			const userWithoutEmail = { name: 'Jane Doe' };
			render(UserButton, { props: { ...defaultProps, user: userWithoutEmail } });
			
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			await fireEvent.click(trigger);
			
			expect(screen.getByText('Jane Doe')).toBeInTheDocument();
			expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
		});
	});
});