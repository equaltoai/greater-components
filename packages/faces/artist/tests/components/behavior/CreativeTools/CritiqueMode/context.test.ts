import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ContextTester from './fixtures/ContextTester.svelte';
import {
	zoomIn,
	zoomOut,
	resetZoom,
	setTool,
} from '../../../../../src/components/CreativeTools/CritiqueMode/context.svelte.js';

describe('CritiqueContext', () => {
	const mockArtwork = { id: '1', title: 'Test Artwork' };

	it('creates and retrieves context', () => {
		let capturedContext: any;
		const hasContextSpy = vi.fn();

		render(ContextTester, {
			props: {
				artwork: mockArtwork,
				config: { enableDrawing: false },
				handlers: { onSave: vi.fn() },
				captureContext: (ctx: any) => {
					capturedContext = ctx;
				},
				checkHasContext: hasContextSpy,
			},
		});

		// First check (before creation) should be false, second (after) should be true
		expect(hasContextSpy).toHaveBeenNthCalledWith(1, false);
		expect(hasContextSpy).toHaveBeenNthCalledWith(2, true);

		expect(capturedContext).toBeDefined();
		expect(capturedContext.artwork).toEqual(mockArtwork);
		expect(capturedContext.config.enableDrawing).toBe(false);
		// Default config
		expect(capturedContext.config.enableAnnotations).toBe(true);
		expect(capturedContext.handlers.onSave).toBeDefined();
	});

	it('throws when accessing context outside provider', () => {
		let capturedError: any;

		render(ContextTester, {
			props: {
				// No artwork means no provider created
				captureContext: (_: any, err: any) => {
					capturedError = err;
				},
			},
		});

		expect(capturedError).toBeDefined();
		expect(capturedError.message).toContain('Critique context not found');
	});

	it('manages zoom state', () => {
		let ctx: any;
		render(ContextTester, {
			props: {
				artwork: mockArtwork,
				captureContext: (c: any) => {
					ctx = c;
				},
			},
		});

		expect(ctx.zoom.level).toBe(1);

		zoomIn(ctx);
		expect(ctx.zoom.level).toBe(1.25);

		zoomIn(ctx, 0.5);
		expect(ctx.zoom.level).toBe(1.75);

		// Max zoom
		zoomIn(ctx, 10);
		expect(ctx.zoom.level).toBe(4);

		resetZoom(ctx);
		expect(ctx.zoom.level).toBe(1);

		zoomOut(ctx);
		expect(ctx.zoom.level).toBe(0.75);

		// Min zoom
		zoomOut(ctx, 10);
		expect(ctx.zoom.level).toBe(0.5);
	});

	it('manages tool state', () => {
		let ctx: any;
		render(ContextTester, {
			props: {
				artwork: mockArtwork,
				captureContext: (c: any) => {
					ctx = c;
				},
			},
		});

		expect(ctx.currentTool).toBe('point');

		setTool(ctx, 'line');
		expect(ctx.currentTool).toBe('line');
		expect(ctx.isAnnotating).toBe(true);

		setTool(ctx, 'select');
		expect(ctx.currentTool).toBe('select');
		expect(ctx.isAnnotating).toBe(false);
	});
});
