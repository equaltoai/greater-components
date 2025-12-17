import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Edit from '@equaltoai/greater-components-artist/components/ArtistProfile/Edit.svelte';
import * as contextModule from '@equaltoai/greater-components-artist/components/ArtistProfile/context.js';
import { createMockArtist } from '../../mocks/mockArtist.js';

// Mock getArtistProfileContext
vi.mock(
	'@equaltoai/greater-components-artist/components/ArtistProfile/context.js',
	async (importOriginal) => {
		const actual = await importOriginal<typeof contextModule>();
		return {
			...actual,
			getArtistProfileContext: vi.fn(),
		};
	}
);

describe('ArtistProfile.Edit', () => {
	const mockArtist = createMockArtist('1');
	const mockHandlers = {
		onEdit: vi.fn(),
		onSave: vi.fn(),
		onCancel: vi.fn(),
	};

	let mockContext: any;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		mockContext = {
			artist: mockArtist,
			isOwnProfile: true,
			isEditing: false,
			handlers: mockHandlers,
			config: {},
		};
		vi.mocked(contextModule.getArtistProfileContext).mockReturnValue(mockContext);

		mockHandlers.onEdit.mockClear();
		mockHandlers.onSave.mockClear();
		mockHandlers.onCancel.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('does not render if not own profile', () => {
		mockContext.isOwnProfile = false;
		render(Edit);
		expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
	});

	it('renders edit button if own profile', () => {
		render(Edit);
		expect(screen.getByText('Edit Profile')).toBeInTheDocument();
	});

	it('enters edit mode on click', async () => {
		render(Edit);

		const editButton = screen.getByText('Edit Profile');
		await fireEvent.click(editButton);

		expect(mockHandlers.onEdit).toHaveBeenCalled();
		// Since component updates local state, it should update UI
		expect(screen.getByText('Save Changes')).toBeInTheDocument();
	});

	it('calls onCancel and exits edit mode', async () => {
		mockContext.isEditing = true; // Initial state
		render(Edit);

		const cancelButton = screen.getByText('Cancel');
		await fireEvent.click(cancelButton);

		expect(mockHandlers.onCancel).toHaveBeenCalled();
		expect(screen.getByText('Edit Profile')).toBeInTheDocument();
	});

	it('calls onSave and exits edit mode on success', async () => {
		mockContext.isEditing = true;
		render(Edit);

		const saveButton = screen.getByText('Save Changes');
		await fireEvent.click(saveButton);

		expect(mockHandlers.onSave).toHaveBeenCalled();
		expect(await screen.findByText('Edit Profile')).toBeInTheDocument();
	});

	it('shows loading state during save', async () => {
		mockContext.isEditing = true;
		let resolveSave: () => void = () => {};
		mockHandlers.onSave.mockReturnValue(new Promise<void>((r) => (resolveSave = r)));

		render(Edit);

		const saveButton = screen.getByText('Save Changes');
		await fireEvent.click(saveButton);

		expect(screen.getByText('Saving...')).toBeInTheDocument();
		expect(saveButton).toBeDisabled();

		resolveSave();
		await screen.findByText('Edit Profile');
	});

	it('handles save error', async () => {
		mockContext.isEditing = true;
		mockHandlers.onSave.mockRejectedValue(new Error('Failed'));

		render(Edit);

		const saveButton = screen.getByText('Save Changes');
		await fireEvent.click(saveButton);

		// Should still be in edit mode
		expect(await screen.findByText('Save Changes')).toBeInTheDocument();
		expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
	});
});
