import { describe, it, expect, vi } from 'vitest';
import {
	createCritiquePattern,
	getCritiqueModeDisplayName,
	getAnnotationCategories,
} from '../../src/patterns/critique.js';

describe('Critique Pattern', () => {
	const mockArtwork = { id: 'a1', title: 'Art' } as any;
	const mockAnnotation = {
		type: 'point',
		position: { x: 10, y: 10 },
		content: 'Nice',
		authorId: 'u1',
		authorName: 'User',
	};

	describe('Factory & State', () => {
		it('initializes correctly', () => {
			const pattern = createCritiquePattern({
				artwork: mockArtwork,
				mode: 'provide',
			});

			expect(pattern.state.mode).toBe('provide');
			expect(pattern.state.annotations).toEqual([]);
			expect(pattern.state.activeTool).toBe('point');
			expect(pattern.state.zoomLevel).toBe(1);
		});
	});

	describe('Annotations', () => {
		it('adds annotation', () => {
			const pattern = createCritiquePattern({
				artwork: mockArtwork,
				mode: 'provide',
			});

			const added = pattern.state.addAnnotation(mockAnnotation as any);

			expect(pattern.state.annotations).toHaveLength(1);
			expect(added.id).toBeDefined();
			expect(pattern.state.annotations[0].content).toBe('Nice');
		});

		it('updates annotation', () => {
			const pattern = createCritiquePattern({
				artwork: mockArtwork,
				mode: 'provide',
			});
			const added = pattern.state.addAnnotation(mockAnnotation as any);

			pattern.state.updateAnnotation(added.id, { content: 'Better' });
			expect(pattern.state.annotations[0].content).toBe('Better');
		});

		it('removes annotation', () => {
			const pattern = createCritiquePattern({
				artwork: mockArtwork,
				mode: 'provide',
			});
			const added = pattern.state.addAnnotation(mockAnnotation as any);

			pattern.state.removeAnnotation(added.id);
			expect(pattern.state.annotations).toHaveLength(0);
		});

		it('selects annotation', () => {
			const pattern = createCritiquePattern({
				artwork: mockArtwork,
				mode: 'provide',
			});
			const added = pattern.state.addAnnotation(mockAnnotation as any);

			pattern.state.selectAnnotation(added.id);
			expect(pattern.state.selectedAnnotationId).toBe(added.id);
		});
	});

	describe('Tools & View', () => {
		it('changes tool', () => {
			const pattern = createCritiquePattern({ artwork: mockArtwork, mode: 'provide' });
			pattern.state.setTool('line');
			expect(pattern.state.activeTool).toBe('line');
		});

		it('zooms in and out', () => {
			const pattern = createCritiquePattern({ artwork: mockArtwork, mode: 'provide' });
			pattern.state.zoomIn();
			expect(pattern.state.zoomLevel).toBe(1.25);

			pattern.state.zoomOut();
			expect(pattern.state.zoomLevel).toBe(1);
		});

		it('pans', () => {
			const pattern = createCritiquePattern({ artwork: mockArtwork, mode: 'provide' });
			pattern.state.pan(10, 20);
			expect(pattern.state.panPosition).toEqual({ x: 10, y: 20 });
		});
	});

	describe('Drawing', () => {
		it('handles drawing flow', () => {
			const pattern = createCritiquePattern({ artwork: mockArtwork, mode: 'provide' });
			pattern.state.setTool('line');

			pattern.state.startDrawing({ x: 0, y: 0 });
			expect(pattern.state.isDrawing).toBe(true);

			pattern.state.continueDrawing({ x: 10, y: 10 });
			expect(pattern.state.drawingPoints).toHaveLength(2);

			pattern.state.finishDrawing('u1', 'User');
			expect(pattern.state.isDrawing).toBe(false);
			expect(pattern.state.annotations).toHaveLength(1);
			expect(pattern.state.annotations[0].type).toBe('line');
		});
	});

	describe('Submission', () => {
		it('submits critique', async () => {
			const onSubmit = vi.fn().mockResolvedValue(undefined);
			const pattern = createCritiquePattern(
				{ artwork: mockArtwork, mode: 'provide' },
				{ onSubmit }
			);

			pattern.state.addAnnotation(mockAnnotation as any);
			pattern.state.updateSummary('Good job');

			await pattern.state.submit();

			expect(onSubmit).toHaveBeenCalled();
			expect(pattern.state.submitState.state).toBe('success');
		});

		it('fails if empty', async () => {
			const pattern = createCritiquePattern({ artwork: mockArtwork, mode: 'provide' });
			await expect(pattern.state.submit()).rejects.toThrow();
		});
	});

	describe('Helpers', () => {
		it('returns display names', () => {
			expect(getCritiqueModeDisplayName('request')).toBe('Request Critique');
		});

		it('returns categories', () => {
			const cats = getAnnotationCategories();
			expect(cats.length).toBeGreaterThan(0);
			expect(cats[0].id).toBeDefined();
		});
	});
});
