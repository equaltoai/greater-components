import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CollectionCard from '@equaltoai/greater-components-artist/components/Curation/CollectionCard.svelte';
import { createMockCollection } from '../../mocks/mockCuration.js';
import { createMockArtist } from '../../mocks/mockArtist.js';

describe('CollectionCard', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders correctly', () => {
		const collection = createMockCollection('1');
		render(CollectionCard, { props: { collection } });

		expect(screen.getByText(collection.name)).toBeInTheDocument();
		if (collection.description) {
			expect(screen.getByText(collection.description)).toBeInTheDocument();
		}
		expect(screen.getByText(collection.ownerName)).toBeInTheDocument();
	});

	it('handles click', async () => {
		const onClick = vi.fn();
		const collection = createMockCollection('1');

		render(CollectionCard, { props: { collection, onClick } });

		const card = screen.getByLabelText(`View collection ${collection.name}`);
		await fireEvent.click(card);

		expect(onClick).toHaveBeenCalledWith(collection);
	});

	it('handles save', async () => {
		const onSave = vi.fn();
		const collection = createMockCollection('1');

		render(CollectionCard, { props: { collection, onSave } });

		const saveButton = screen.getByLabelText('Save collection');
		await fireEvent.click(saveButton);

		expect(onSave).toHaveBeenCalledWith(collection);
	});

	it('toggles saved state', async () => {
		const collection = createMockCollection('1');

		render(CollectionCard, { props: { collection, isSaved: false, onSave: vi.fn() } });

		const saveButton = screen.getByLabelText('Save collection');
		await fireEvent.click(saveButton);

		expect(await screen.findByLabelText('Unsave collection')).toBeInTheDocument();
	});

	it('shows loading state during save', async () => {
		const collection = createMockCollection('1');
		let resolveSave: () => void = () => {};
		const onSave = vi.fn().mockReturnValue(new Promise<void>((r) => (resolveSave = r)));

		render(CollectionCard, { props: { collection, onSave } });

		const saveButton = screen.getByLabelText('Save collection');
		await fireEvent.click(saveButton);

		expect(saveButton).toBeDisabled();
		resolveSave();

		await screen.findByLabelText('Unsave collection');
	});

	it('handles error during save', async () => {
		const collection = createMockCollection('1');
		const onSave = vi.fn().mockRejectedValue(new Error('Failed'));

		render(CollectionCard, { props: { collection, onSave } });

		const saveButton = screen.getByLabelText('Save collection');
		await fireEvent.click(saveButton);

		// Should remain unsaved
		expect(saveButton).not.toBeDisabled();
		expect(screen.getByLabelText('Save collection')).toBeInTheDocument();
	});

	it('shows collaborative indicators', () => {
		const collection = createMockCollection('1');
		render(CollectionCard, { props: { collection, collaborative: true } });

		expect(screen.getByTitle('Collaborative collection')).toBeInTheDocument();
	});

	it('renders correctly with limited preview', () => {
		const collection = createMockCollection('1');
		render(CollectionCard, { props: { collection, preview: 2 } });

		// Images with alt="" have role="presentation"
		const images = screen.getAllByRole('presentation');
		// 2 preview + 1 owner avatar
		expect(images.length).toBe(3);
	});

	it('renders empty state correctly', () => {
		const collection = createMockCollection('1', { artworks: [] });
		render(CollectionCard, { props: { collection } });

		expect(screen.getByText('No artworks yet')).toBeInTheDocument();
	});

	it('shows privacy icons', () => {
		const collection = createMockCollection('1', { visibility: 'private' });
		const { rerender } = render(CollectionCard, { props: { collection } });

		expect(screen.getByTitle('private')).toBeInTheDocument();

		collection.visibility = 'unlisted';
		rerender({ props: { collection } });
		expect(screen.getByTitle('unlisted')).toBeInTheDocument();
	});

	it('shows contributors', () => {
		const collection = createMockCollection('1');
		const contributors = [createMockArtist('1'), createMockArtist('2')];
		render(CollectionCard, { props: { collection, collaborative: true, contributors } });

		expect(screen.getByText('2 contributors')).toBeInTheDocument();
	});
});
