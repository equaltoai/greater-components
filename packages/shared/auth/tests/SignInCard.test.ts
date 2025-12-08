/**
 * SignInCard Component Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import SignInCard from '../src/SignInCard.svelte';

// Mock icon component
const MockIcon = {
	$$typeof: Symbol.for('svelte.component'),
	render: () => ({ html: '<svg data-testid="mock-icon"></svg>' }),
};

describe('SignInCard', () => {
	const defaultProviders = [
		{ id: 'github', name: 'GitHub', icon: MockIcon },
		{ id: 'google', name: 'Google', icon: MockIcon },
	];

	const defaultProps = {
		providers: defaultProviders,
		onSignIn: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders with default title', () => {
			render(SignInCard, { props: defaultProps });
			expect(screen.getByRole('heading', { name: /sign in to continue/i })).toBeInTheDocument();
		});

		it('renders with custom title', () => {
			render(SignInCard, { props: { ...defaultProps, title: 'Welcome back' } });
			expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
		});

		it('renders description when provided', () => {
			render(SignInCard, { props: { ...defaultProps, description: 'Choose your provider' } });
			expect(screen.getByText('Choose your provider')).toBeInTheDocument();
		});

		it('renders provider buttons', () => {
			render(SignInCard, { props: defaultProps });
			expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
		});

		it('renders provider buttons with correct text', () => {
			render(SignInCard, { props: defaultProps });
			expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
			expect(screen.getByText('Continue with Google')).toBeInTheDocument();
		});
	});

	describe('Interactions', () => {
		it('calls onSignIn with provider id when button is clicked', async () => {
			const onSignIn = vi.fn();
			render(SignInCard, { props: { ...defaultProps, onSignIn } });
			
			await fireEvent.click(screen.getByRole('button', { name: /sign in with github/i }));
			
			expect(onSignIn).toHaveBeenCalledWith('github');
		});

		it('does not call onSignIn when loading', async () => {
			const onSignIn = vi.fn();
			render(SignInCard, { props: { ...defaultProps, onSignIn, loading: true, loadingProvider: 'github' } });
			
			await fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
			
			expect(onSignIn).not.toHaveBeenCalled();
		});
	});

	describe('Loading States', () => {
		it('shows loading state on active provider button', () => {
			render(SignInCard, { props: { ...defaultProps, loading: true, loadingProvider: 'github' } });
			
			const githubButton = screen.getByRole('button', { name: /sign in with github/i });
			expect(githubButton).toHaveAttribute('aria-busy', 'true');
		});

		it('disables other provider buttons when one is loading', () => {
			render(SignInCard, { props: { ...defaultProps, loading: true, loadingProvider: 'github' } });
			
			const googleButton = screen.getByRole('button', { name: /sign in with google/i });
			expect(googleButton).toBeDisabled();
		});
	});

	describe('Error Handling', () => {
		it('displays error message when error prop is set', () => {
			render(SignInCard, { props: { ...defaultProps, error: 'Authentication failed' } });
			
			expect(screen.getByRole('alert')).toBeInTheDocument();
			expect(screen.getByText('Authentication failed')).toBeInTheDocument();
		});

		it('calls onRetry when retry action is clicked', async () => {
			const onRetry = vi.fn();
			render(SignInCard, { props: { ...defaultProps, error: 'Failed', onRetry } });
			
			const retryButton = screen.getByRole('button', { name: /try again/i });
			await fireEvent.click(retryButton);
			
			expect(onRetry).toHaveBeenCalled();
		});

		it('does not show retry button when onRetry is not provided', () => {
			render(SignInCard, { props: { ...defaultProps, error: 'Failed' } });
			
			expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has accessible provider button group', () => {
			render(SignInCard, { props: defaultProps });
			
			expect(screen.getByRole('group', { name: /sign in options/i })).toBeInTheDocument();
		});

		it('provider buttons have accessible labels', () => {
			render(SignInCard, { props: defaultProps });
			
			expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
		});

		it('error alert has correct role', () => {
			render(SignInCard, { props: { ...defaultProps, error: 'Error message' } });
			
			expect(screen.getByRole('alert')).toBeInTheDocument();
		});
	});
});