/**
 * UserButton Component Tests
 *
 * Note: Dropdown variant tests are skipped due to a known Svelte 5 + JSDOM compatibility issue.
 * Svelte 5's event delegation system does not work properly in JSDOM environments.
 * These interactions should be tested via E2E/browser tests instead.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import UserButton from '../src/UserButton.svelte';

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
			expect(screen.getByText('Jane Doe')).toBeTruthy();
		});

		it('renders user email', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline' } });
			expect(screen.getByText('jane@example.com')).toBeTruthy();
		});

		it('renders avatar', () => {
			const { container } = render(UserButton, { props: { ...defaultProps, variant: 'inline' } });
			const avatar = container.querySelector('.gr-avatar');
			expect(avatar).toBeTruthy();
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
			expect(button.getAttribute('aria-busy')).toBe('true');
		});

		it('is disabled when loading', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline', loading: true } });

			const button = screen.getByRole('button');
			expect(button.hasAttribute('disabled')).toBe(true);
		});

		it('has accessible label', () => {
			render(UserButton, { props: { ...defaultProps, variant: 'inline' } });

			expect(screen.getByRole('button', { name: /signed in as jane doe/i })).toBeTruthy();
		});
	});

	describe('Dropdown Variant - Static Rendering', () => {
		it('renders avatar trigger button', () => {
			render(UserButton, { props: defaultProps });

			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			expect(trigger).toBeTruthy();
		});

		it('trigger has aria-haspopup attribute', () => {
			render(UserButton, { props: defaultProps });

			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
		});

		it('trigger has aria-controls attribute', () => {
			render(UserButton, { props: defaultProps });

			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			expect(trigger.getAttribute('aria-controls')).toBeTruthy();
		});

		it('trigger starts with aria-expanded false', () => {
			render(UserButton, { props: defaultProps });

			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			expect(trigger.getAttribute('aria-expanded')).toBe('false');
		});
	});

	describe('User without email', () => {
		const userWithoutEmail = {
			name: 'Jane Doe',
			imageUrl: 'https://example.com/avatar.jpg',
		};

		it('renders without email in inline variant', () => {
			render(UserButton, { props: { ...defaultProps, user: userWithoutEmail, variant: 'inline' } });

			expect(screen.getByText('Jane Doe')).toBeTruthy();
			expect(screen.queryByText('jane@example.com')).toBeNull();
		});

		it('renders trigger without email in dropdown variant', () => {
			render(UserButton, {
				props: { ...defaultProps, user: userWithoutEmail, variant: 'dropdown' },
			});

			// Just verify the trigger renders correctly (interaction tests skipped due to JSDOM limitation)
			const trigger = screen.getByRole('button', { name: /user menu for jane doe/i });
			expect(trigger).toBeTruthy();
		});
	});
});
