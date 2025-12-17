import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { ArtistProfile } from '../../../src/components/ArtistProfile/index.js';
import type {
	ArtistData,
	PortfolioSectionData,
	ArtistProfileContext,
} from '../../../src/components/ArtistProfile/context.js';
import * as ContextModule from '../../../src/components/ArtistProfile/context.js';

// Mock getArtistProfileContext
vi.mock('../../../src/components/ArtistProfile/context.js', async () => {
	const actual = await vi.importActual('../../../src/components/ArtistProfile/context.js');
	return {
		...actual,
		getArtistProfileContext: vi.fn(),
	};
});

describe('ArtistProfile.Sections', () => {
	const mockSection1: PortfolioSectionData = {
		id: 's1',
		type: 'custom',
		title: 'Section 1',
		items: [],
		layout: 'grid',
		visible: true,
		order: 1,
	};

	const mockSection2: PortfolioSectionData = {
		id: 's2',
		type: 'custom',
		title: 'Section 2',
		items: [],
		layout: 'grid',
		visible: true,
		order: 2,
	};

	const mockArtist: ArtistData = {
		id: 'a1',
		displayName: 'Artist',
		username: 'artist',
		profileUrl: '/u/artist',
		badges: [],
		status: 'online',
		verified: true,
		commissionStatus: 'open',
		stats: {
			followers: 100,
			following: 10,
			works: 5,
			exhibitions: 1,
			collaborations: 0,
			totalViews: 500,
		},
		sections: [mockSection1, mockSection2],
		joinedAt: new Date().toISOString(),
	};

	const handlers = {
		onSectionReorder: vi.fn(),
		onSectionToggle: vi.fn(),
	};

	const defaultContext: ArtistProfileContext = {
		artist: mockArtist,
		isOwnProfile: true,
		config: {
			layout: 'gallery',
			showHeroBanner: true,
			enableParallax: true,
			showSocial: true,
			editable: true,
			class: '',
		},
		handlers,
		layout: 'gallery',
		isEditing: false,
		isFollowing: false,
		professionalMode: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ContextModule.getArtistProfileContext).mockReturnValue(defaultContext);
	});

	it('renders sections in order', () => {
		render(ArtistProfile.Sections);

		const articles = screen.getAllByRole('article');
		expect(articles).toHaveLength(2);
		expect(articles[0]).toHaveTextContent('Section 1');
		expect(articles[1]).toHaveTextContent('Section 2');
	});

	it('hides hidden sections when not editing', () => {
		const hiddenSection = { ...mockSection2, visible: false };
		const artistWithHidden = { ...mockArtist, sections: [mockSection1, hiddenSection] };

		vi.mocked(ContextModule.getArtistProfileContext).mockReturnValue({
			...defaultContext,
			artist: artistWithHidden,
			isEditing: false,
		});

		render(ArtistProfile.Sections);

		expect(screen.queryByText('Section 1')).toBeInTheDocument();
		expect(screen.queryByText('Section 2')).not.toBeInTheDocument();
	});

	it('shows hidden sections when editing', () => {
		const hiddenSection = { ...mockSection2, visible: false };
		const artistWithHidden = { ...mockArtist, sections: [mockSection1, hiddenSection] };

		vi.mocked(ContextModule.getArtistProfileContext).mockReturnValue({
			...defaultContext,
			artist: artistWithHidden,
			isEditing: true,
		});

		render(ArtistProfile.Sections);

		expect(screen.queryByText('Section 1')).toBeInTheDocument();
		expect(screen.queryByText('Section 2')).toBeInTheDocument();
		// Should show opacity for hidden section? The CSS class 'hidden' is applied.
		const section2 = screen.getByLabelText('Section 2');
		expect(section2).toHaveClass('hidden');
	});

	it('toggles visibility when editing', async () => {
		vi.mocked(ContextModule.getArtistProfileContext).mockReturnValue({
			...defaultContext,
			isEditing: true,
		});

		render(ArtistProfile.Sections);

		const toggleButtons = screen.getAllByLabelText('Hide section');
		expect(toggleButtons).toHaveLength(2);

		await fireEvent.click(toggleButtons[0]);
		expect(handlers.onSectionToggle).toHaveBeenCalledWith('s1', false);
	});

	it('handles drag and drop reordering', async () => {
		vi.mocked(ContextModule.getArtistProfileContext).mockReturnValue({
			...defaultContext,
			isEditing: true,
		});

		render(ArtistProfile.Sections);

		const sections = screen.getAllByRole('article');
		const source = sections[0];
		const target = sections[1];

		// Mock dataTransfer
		const dataTransfer = {
			setData: vi.fn(),
			effectAllowed: 'none',
		};

		// Drag start
		await fireEvent.dragStart(source, { dataTransfer });
		expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 's1');

		// Drag over target
		await fireEvent.dragOver(target, { dataTransfer });

		// Drop
		await fireEvent.drop(target, { dataTransfer });

		// Should call reorder handler with new order [s2, s1] (swapped because s1 dragged to s2)
		// Wait, logic is:
		// const [removed] = sections.splice(draggedIndex, 1);
		// sections.splice(targetIndex, 0, removed!);
		// draggedIndex=0 (s1), targetIndex=1 (s2)
		// remove s1 -> [s2]
		// insert s1 at 1 -> [s2, s1]

		expect(handlers.onSectionReorder).toHaveBeenCalledWith(['s2', 's1']);
	});
});
