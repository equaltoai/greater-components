import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Attribution from '../../../src/components/Artwork/Attribution.svelte';
import * as ContextModule from '../../../src/components/Artwork/context.js';

// Mock the context module
vi.mock('../../../src/components/Artwork/context.js', async () => {
	const actual = await vi.importActual('../../../src/components/Artwork/context.js');
	return {
		...actual,
		getArtworkContext: vi.fn(),
	};
});

describe('Artwork.Attribution', () => {
	const mockHandlers = {
		onArtistClick: vi.fn(),
	};

	const mockArtist = {
		id: 'artist-123',
		name: 'Jane Doe',
		username: 'janedoe',
		avatar: 'https://example.com/avatar.jpg',
		verified: true,
	};

	const mockArtwork = {
		id: 'art-1',
		title: 'Masterpiece',
		artist: mockArtist,
	};

	const defaultContext = {
		artwork: mockArtwork,
		handlers: mockHandlers,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue(defaultContext);
	});

	it('renders artist information correctly', () => {
		const { container } = render(Attribution);
		expect(screen.getByText('Jane Doe')).toBeInTheDocument();
		expect(screen.getByText('@janedoe')).toBeInTheDocument();
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('src', mockArtist.avatar);
		expect(screen.getByLabelText('Verified artist')).toBeInTheDocument();
	});

	it('renders avatar fallback when no avatar is provided', () => {
		const contextWithoutAvatar = {
			...defaultContext,
			artwork: {
				...mockArtwork,
				artist: { ...mockArtist, avatar: undefined },
			},
		};
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue(contextWithoutAvatar);

		const { container } = render(Attribution);
		expect(container.querySelector('img')).not.toBeInTheDocument();
		expect(screen.getByText('J')).toBeInTheDocument(); // First letter of Jane Doe
	});

	it('hides avatar when showAvatar is false', () => {
		const { container } = render(Attribution, { props: { showAvatar: false } });
		expect(container.querySelector('img')).not.toBeInTheDocument();
		// Fallback should also not be there
		expect(
			screen.queryByText('J', { selector: '.gr-artist-artwork-attribution-avatar-fallback' })
		).not.toBeInTheDocument();
	});

	it('does not render verified badge if artist is not verified', () => {
		const contextUnverified = {
			...defaultContext,
			artwork: {
				...mockArtwork,
				artist: { ...mockArtist, verified: false },
			},
		};
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue(contextUnverified);

		render(Attribution);
		expect(screen.queryByLabelText('Verified artist')).not.toBeInTheDocument();
	});

	it('renders as a link when linkToProfile is true (default)', () => {
		render(Attribution);
		const link = screen.getByRole('link', { name: /Jane Doe/ });
		expect(link).toHaveAttribute('href', '/artist/janedoe');
	});

	it('renders custom profile base url', () => {
		render(Attribution, { props: { profileBaseUrl: '/users' } });
		const link = screen.getByRole('link', { name: /Jane Doe/ });
		expect(link).toHaveAttribute('href', '/users/janedoe');
	});

	it('renders as span when linkToProfile is false', () => {
		render(Attribution, { props: { linkToProfile: false } });
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.getByText('Jane Doe')).toBeInTheDocument();
	});

	it('calls onArtistClick handler when link is clicked', async () => {
		render(Attribution);
		const link = screen.getByRole('link', { name: /Jane Doe/ });
		await fireEvent.click(link);
		expect(mockHandlers.onArtistClick).toHaveBeenCalledWith(mockArtist.id);
	});

	it('renders verified badge correctly when not a link', () => {
		render(Attribution, { props: { linkToProfile: false } });
		expect(screen.getByLabelText('Verified artist')).toBeInTheDocument();
	});

	it('does not crash if handlers.onArtistClick is missing', async () => {
		const contextNoHandlers = {
			...defaultContext,
			handlers: {},
		};
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue(contextNoHandlers);

		render(Attribution);
		const link = screen.getByRole('link', { name: /Jane Doe/ });
		await fireEvent.click(link);
		// Should not throw
		expect(true).toBe(true);
	});

	it('applies custom class', () => {
		const { container } = render(Attribution, { props: { class: 'custom-class' } });
		expect(container.firstChild).toHaveClass('custom-class');
	});
});
