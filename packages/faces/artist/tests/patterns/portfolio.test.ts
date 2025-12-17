import { describe, it, expect, vi } from 'vitest';
import {
	createPortfolioPattern,
	getSectionTypeDisplayName,
	getDefaultSectionTemplate,
} from '../../src/patterns/portfolio.js';
import type { PortfolioSection } from '../../src/patterns/types.js';

describe('Portfolio Pattern', () => {
	const mockArtist = { id: 'a1', name: 'Artist' } as any;
	const createMockSections = () =>
		[
			{ id: 's1', title: 'S1', type: 'gallery', order: 0, visible: true },
			{ id: 's2', title: 'S2', type: 'about', order: 1, visible: true },
		] as PortfolioSection[];

	describe('Factory & State', () => {
		it('initializes correctly', () => {
			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(),
				isOwner: true,
			});

			expect(pattern.state.sections).toHaveLength(2);
			expect(pattern.state.activeSectionId).toBe('s1');
			expect(pattern.state.professionalMode).toBe(false);
			expect(pattern.state.editMode).toBe(false);
		});

		it('toggles professional mode', () => {
			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(),
				isOwner: true,
			});

			pattern.state.toggleProfessionalMode();
			expect(pattern.state.professionalMode).toBe(true);
		});

		it('toggles edit mode (owner only)', () => {
			const ownerPattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(),
				isOwner: true,
			});
			ownerPattern.state.toggleEditMode();
			expect(ownerPattern.state.editMode).toBe(true);

			const viewerPattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(),
				isOwner: false,
			});
			viewerPattern.state.toggleEditMode();
			expect(viewerPattern.state.editMode).toBe(false);
		});
	});

	describe('Section Management', () => {
		it('adds section', async () => {
			const onSectionAdd = vi.fn().mockResolvedValue(undefined);
			const pattern = createPortfolioPattern(
				{ artist: mockArtist, sections: [], isOwner: true },
				{ onSectionAdd }
			);

			await pattern.state.addSection({
				title: 'New',
				type: 'gallery',
				order: 0,
				visible: true,
			});

			expect(pattern.state.sections).toHaveLength(1);
			expect(pattern.state.sections[0].title).toBe('New');
			expect(pattern.state.operationState.state).toBe('success');
		});

		it('updates section', async () => {
			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(),
				isOwner: true,
			});

			await pattern.state.updateSection('s1', { title: 'Updated' });

			expect(pattern.state.sections[0].title).toBe('Updated');
		});

		it('removes section', async () => {
			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(),
				isOwner: true,
			});

			await pattern.state.removeSection('s1');

			expect(pattern.state.sections).toHaveLength(1);
			expect(pattern.state.sections[0].id).toBe('s2');
			// Active section should update
			expect(pattern.state.activeSectionId).toBe('s2');
		});
	});

	describe('Reordering', () => {
		it('reorders sections via method', async () => {
			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(), // s1 (0), s2 (1)
				isOwner: true,
			});

			// Swap
			await pattern.state.reorderSections(['s2', 's1']);

			expect(pattern.state.sections[0].id).toBe('s2');
			expect(pattern.state.sections[0].order).toBe(0);
			expect(pattern.state.sections[1].id).toBe('s1');
			expect(pattern.state.sections[1].order).toBe(1);
		});

		it('reorders via drag and drop', async () => {
			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections: createMockSections(),
				isOwner: true,
			});

			pattern.state.startDrag('s2');
			expect(pattern.state.dragState.isDragging).toBe(true);
			expect(pattern.state.dragState.draggedSectionId).toBe('s2');

			pattern.state.setDropTarget('s1');
			expect(pattern.state.dragState.dropTargetId).toBe('s1');

			await pattern.state.endDrag();

			// s2 should move before s1
			expect(pattern.state.sections[0].id).toBe('s2');
			expect(pattern.state.dragState.isDragging).toBe(false);
		});
	});

	describe('Helpers', () => {
		it('returns correct display names', () => {
			expect(getSectionTypeDisplayName('gallery')).toBe('Gallery');
			expect(getSectionTypeDisplayName('contact')).toBe('Contact');
		});

		it('returns default templates', () => {
			const template = getDefaultSectionTemplate('about');
			expect(template.type).toBe('about');
			expect(template.title).toBe('About Me');
		});

		it('calculates total artwork count', () => {
			const sections = createMockSections();
			const sectionsWithArt = [
				{ ...sections[0], artworks: [{}, {}] as any },
				{ ...sections[1], artworks: [{}] as any },
			];

			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections: sectionsWithArt,
				isOwner: true,
			});

			expect(pattern.state.getTotalArtworkCount()).toBe(3);
		});
	});

	describe('Error Handling & Utils', () => {
		it('handles addSection error', async () => {
			const onSectionAdd = vi.fn().mockRejectedValue(new Error('Failed'));
			const pattern = createPortfolioPattern(
				{ artist: mockArtist, sections: [], isOwner: true },
				{ onSectionAdd }
			);

			await expect(
				pattern.state.addSection({
					title: 'New',
					type: 'gallery',
					order: 0,
					visible: true,
				})
			).rejects.toThrow('Failed');

			expect(pattern.state.operationState.state).toBe('error');
		});

		it('handles updateSection error', async () => {
			const onSectionUpdate = vi.fn().mockRejectedValue(new Error('Update failed'));
			const pattern = createPortfolioPattern(
				{ artist: mockArtist, sections: createMockSections(), isOwner: true },
				{ onSectionUpdate }
			);

			await expect(pattern.state.updateSection('s1', { title: 'Updated' })).rejects.toThrow(
				'Update failed'
			);
			expect(pattern.state.operationState.state).toBe('error');
		});

		it('handles removeSection error', async () => {
			const onSectionRemove = vi.fn().mockRejectedValue(new Error('Remove failed'));
			const pattern = createPortfolioPattern(
				{ artist: mockArtist, sections: createMockSections(), isOwner: true },
				{ onSectionRemove }
			);

			await expect(pattern.state.removeSection('s1')).rejects.toThrow('Remove failed');
			expect(pattern.state.operationState.state).toBe('error');
		});

		it('handles reorderSections error', async () => {
			const onSectionReorder = vi.fn().mockRejectedValue(new Error('Reorder failed'));
			const pattern = createPortfolioPattern(
				{ artist: mockArtist, sections: createMockSections(), isOwner: true },
				{ onSectionReorder }
			);

			await expect(pattern.state.reorderSections(['s2', 's1'])).rejects.toThrow('Reorder failed');
			expect(pattern.state.operationState.state).toBe('error');
		});

		it('handles exportPortfolio and error', async () => {
			const onExport = vi.fn().mockResolvedValue(undefined);
			const pattern = createPortfolioPattern(
				{ artist: mockArtist, sections: [], isOwner: true },
				{ onExport }
			);

			await pattern.state.exportPortfolio('pdf');
			expect(onExport).toHaveBeenCalledWith('pdf');
			expect(pattern.state.operationState.state).toBe('success');

			// Error case
			onExport.mockRejectedValue(new Error('Export failed'));
			await expect(pattern.state.exportPortfolio('pdf')).rejects.toThrow('Export failed');
			expect(pattern.state.operationState.state).toBe('error');
		});

		it('handles sharePortfolio and error', async () => {
			const onShare = vi.fn().mockResolvedValue(undefined);
			const pattern = createPortfolioPattern(
				{ artist: mockArtist, sections: [], isOwner: true },
				{ onShare }
			);

			await pattern.state.sharePortfolio('twitter');
			expect(onShare).toHaveBeenCalledWith('twitter');
			expect(pattern.state.operationState.state).toBe('success');

			// Error case
			onShare.mockRejectedValue(new Error('Share failed'));
			await expect(pattern.state.sharePortfolio('twitter')).rejects.toThrow('Share failed');
			expect(pattern.state.operationState.state).toBe('error');
		});

		it('filters visible sections', () => {
			const sections = [
				{ id: 's1', title: 'Visible', type: 'gallery', visible: true, order: 0 },
				{ id: 's2', title: 'Hidden', type: 'about', visible: false, order: 1 },
			] as PortfolioSection[];

			const pattern = createPortfolioPattern({
				artist: mockArtist,
				sections,
				isOwner: true,
			});

			const visible = pattern.state.getVisibleSections();
			expect(visible).toHaveLength(1);
			expect(visible[0].id).toBe('s1');
		});
	});
});
