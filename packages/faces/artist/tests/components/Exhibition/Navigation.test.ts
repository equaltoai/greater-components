import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Navigation from '../../../src/components/Exhibition/Navigation.svelte';
import * as ContextModule from '../../../src/components/Exhibition/context.js';

// Mock the context module
vi.mock('../../../src/components/Exhibition/context.js', async () => {
	const actual = await vi.importActual('../../../src/components/Exhibition/context.js');
	return {
		...actual,
		getExhibitionContext: vi.fn(),
		navigateNext: vi.fn(),
		navigatePrevious: vi.fn(),
		navigateTo: vi.fn(),
	};
});

describe('Exhibition.Navigation', () => {
	const mockArtworks = [
		{ id: '1', title: 'Art 1', images: { thumbnail: 'thumb1.jpg' } },
		{ id: '2', title: 'Art 2', images: { thumbnail: 'thumb2.jpg' } },
		{ id: '3', title: 'Art 3', images: { thumbnail: 'thumb3.jpg' } },
	];

	const defaultNavigationState = {
		currentIndex: 1, // Middle
		totalArtworks: 3,
		isAtStart: false,
		isAtEnd: false,
	};

	const defaultContext = {
		exhibition: { artworks: mockArtworks },
		navigation: defaultNavigationState,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ContextModule.getExhibitionContext).mockReturnValue(defaultContext);
	});

	it('renders progress correctly', () => {
		render(Navigation);
		const progressBar = screen.getByRole('progressbar');
		expect(progressBar).toHaveAttribute('aria-valuenow', '2'); // Index 1 + 1
		expect(progressBar).toHaveAttribute('aria-valuemax', '3');
		expect(screen.getByText('2 of 3')).toBeInTheDocument();

		// Progress fill uses SVG rect width (0–100 scale)
		// 2/3 = 66.666%
		const fill = progressBar.querySelector('.exhibition-nav__progress-fill');
		expect(fill).toBeTruthy();
		const width = parseFloat(fill?.getAttribute('width') || '0');
		expect(width).toBeCloseTo(66.666, 2);
	});

	it('hides progress when showProgress is false', () => {
		render(Navigation, { props: { showProgress: false } });
		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
	});

	it('renders navigation buttons', () => {
		render(Navigation);
		expect(screen.getByLabelText('Previous artwork')).toBeInTheDocument();
		expect(screen.getByLabelText('Next artwork')).toBeInTheDocument();
	});

	it('disables Previous button when at start', () => {
		const contextAtStart = {
			...defaultContext,
			navigation: { ...defaultNavigationState, currentIndex: 0, isAtStart: true },
		};
		vi.mocked(ContextModule.getExhibitionContext).mockReturnValue(contextAtStart);

		render(Navigation);
		expect(screen.getByLabelText('Previous artwork')).toBeDisabled();
		expect(screen.getByLabelText('Next artwork')).not.toBeDisabled();
	});

	it('disables Next button when at end', () => {
		const contextAtEnd = {
			...defaultContext,
			navigation: { ...defaultNavigationState, currentIndex: 2, isAtEnd: true },
		};
		vi.mocked(ContextModule.getExhibitionContext).mockReturnValue(contextAtEnd);

		render(Navigation);
		expect(screen.getByLabelText('Previous artwork')).not.toBeDisabled();
		expect(screen.getByLabelText('Next artwork')).toBeDisabled();
	});

	it('calls navigatePrevious when Previous button is clicked', async () => {
		render(Navigation);
		await fireEvent.click(screen.getByLabelText('Previous artwork'));
		expect(ContextModule.navigatePrevious).toHaveBeenCalledWith(defaultContext);
	});

	it('calls navigateNext when Next button is clicked', async () => {
		render(Navigation);
		await fireEvent.click(screen.getByLabelText('Next artwork'));
		expect(ContextModule.navigateNext).toHaveBeenCalledWith(defaultContext);
	});

	it('renders thumbnails when showThumbnails is true', () => {
		const { container } = render(Navigation, { props: { showThumbnails: true } });
		const listbox = screen.getByRole('listbox', { name: 'Artwork thumbnails' });
		expect(listbox).toBeInTheDocument();
		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(3);

		// Check images using container query selector since alt is empty and image might be aria-hidden?
		// Wait, the button has aria-label, so it is accessible. The img inside has alt="" which is fine.
		const imgs = container.querySelectorAll('.exhibition-nav__thumbnail img');
		expect(imgs.length).toBe(3);
	});

	it('uses preview image if thumbnail is missing', () => {
		const contextWithPreview = {
			...defaultContext,
			exhibition: {
				artworks: [
					{ id: '1', title: 'Art 1', images: { preview: 'preview1.jpg' } }, // No thumbnail
				],
			},
			navigation: { ...defaultNavigationState, totalArtworks: 1, currentIndex: 0 },
		};
		vi.mocked(ContextModule.getExhibitionContext).mockReturnValue(contextWithPreview);

		const { container } = render(Navigation, { props: { showThumbnails: true } });
		const img = container.querySelector('.exhibition-nav__thumbnail img');
		expect(img).toHaveAttribute('src', 'preview1.jpg');
	});

	it('highlights active thumbnail', () => {
		render(Navigation, { props: { showThumbnails: true } });
		const options = screen.getAllByRole('option');
		expect(options[1]).toHaveClass('active');
		expect(options[1]).toHaveAttribute('aria-selected', 'true');
		expect(options[0]).not.toHaveClass('active');
	});

	it('calls navigateTo when thumbnail is clicked', async () => {
		render(Navigation, { props: { showThumbnails: true } });
		const options = screen.getAllByRole('option');
		await fireEvent.click(options[0]);
		expect(ContextModule.navigateTo).toHaveBeenCalledWith(defaultContext, 0);
	});

	it('applies position class', () => {
		const { container } = render(Navigation, { props: { position: 'floating' } });
		expect(container.firstChild).toHaveClass('exhibition-nav--floating');
	});

	it('applies custom class', () => {
		const { container } = render(Navigation, { props: { class: 'custom-class' } });
		expect(container.firstChild).toHaveClass('custom-class');
	});
});
