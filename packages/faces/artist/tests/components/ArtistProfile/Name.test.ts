import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import NameTestWrapper from './NameTestWrapper.svelte';
import type {
	ArtistProfileContext,
	ArtistData,
} from '../../../src/components/ArtistProfile/context.js';

describe('ArtistProfile.Name', () => {
	const mockArtist: ArtistData = {
		id: '1',
		displayName: 'Test Artist',
		username: 'testartist',
		profileUrl: '/artist/testartist',
		verified: false,
		status: 'online',
		badges: [],
		commissionStatus: 'open',
		stats: {
			followers: 0,
			following: 0,
			works: 0,
			exhibitions: 0,
			collaborations: 0,
			totalViews: 0,
		},
		sections: [],
		joinedAt: new Date(),
	};

	const mockContext: ArtistProfileContext = {
		artist: mockArtist,
		isOwnProfile: false,
		config: {
			layout: 'gallery',
			showHeroBanner: true,
			enableParallax: true,
			showSocial: true,
			editable: false,
			class: '',
		},
		handlers: {},
		layout: 'gallery',
		isEditing: false,
		isFollowing: false,
		professionalMode: false,
	};

	it('renders display name', () => {
		render(NameTestWrapper, { props: { context: mockContext } });
		expect(screen.getByText('Test Artist')).toBeInTheDocument();
	});

	it('renders username when showUsername is true', () => {
		render(NameTestWrapper, {
			props: { context: mockContext, componentProps: { showUsername: true } },
		});
		expect(screen.getByText('@testartist')).toBeInTheDocument();
	});

	it('hides username when showUsername is false', () => {
		render(NameTestWrapper, {
			props: { context: mockContext, componentProps: { showUsername: false } },
		});
		expect(screen.queryByText('@testartist')).not.toBeInTheDocument();
	});

	it('renders heading with correct level', () => {
		render(NameTestWrapper, { props: { context: mockContext, componentProps: { level: 2 } } });
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading).toHaveTextContent('Test Artist');
	});

	it('renders verified badge when artist is verified', () => {
		const verifiedContext = { ...mockContext, artist: { ...mockArtist, verified: true } };
		render(NameTestWrapper, { props: { context: verifiedContext } });
		expect(screen.getByTitle('Verified Artist')).toBeInTheDocument();
	});

	it('does not render verified badge when artist is not verified', () => {
		render(NameTestWrapper, { props: { context: mockContext } });
		expect(screen.queryByTitle('Verified Artist')).not.toBeInTheDocument();
	});

	it('renders as link when linkToProfile is true', () => {
		render(NameTestWrapper, {
			props: { context: mockContext, componentProps: { linkToProfile: true } },
		});
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/artist/testartist');
		expect(link).toHaveTextContent('Test Artist');
	});

	it('renders verified badge inside link when linkToProfile is true', () => {
		const verifiedContext = { ...mockContext, artist: { ...mockArtist, verified: true } };
		render(NameTestWrapper, {
			props: { context: verifiedContext, componentProps: { linkToProfile: true } },
		});
		const link = screen.getByRole('link');
		expect(link).toContainElement(screen.getByTitle('Verified Artist'));
	});
});
