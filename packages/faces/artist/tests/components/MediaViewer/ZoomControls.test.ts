import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ZoomControls from '../../../src/components/MediaViewer/ZoomControls.svelte';
import * as ContextModule from '../../../src/components/MediaViewer/context.js';

// Mock getMediaViewerContext
vi.mock('../../../src/components/MediaViewer/context.js', async () => {
	const actual = await vi.importActual('../../../src/components/MediaViewer/context.js');
	return {
		...actual,
		getMediaViewerContext: vi.fn(),
	};
});

describe('MediaViewer.ZoomControls', () => {
	const handlers = {
		onZoom: vi.fn(),
	};

	const defaultContext = {
		config: {
			enableZoom: true,
		},
		handlers,
		zoomLevel: 1,
		panOffset: { x: 0, y: 0 },
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock the context return value
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue(defaultContext);
	});

	it('renders zoom controls when enabled', () => {
		render(ZoomControls);
		expect(screen.getByRole('group', { name: 'Zoom controls' })).toBeInTheDocument();
		expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
		expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
		expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument();
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('does not render when disabled in config', () => {
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue({
			...defaultContext,
			config: { enableZoom: false },
		});
		render(ZoomControls);
		expect(screen.queryByRole('group', { name: 'Zoom controls' })).not.toBeInTheDocument();
	});

	it('handles zoom in', async () => {
		// We need a reactive context simulation or just check calls.
		// Since we mock the return value, it's a static object unless we use a getter/setter mock or a proxy.
		// Svelte 5 state is used in the component: `context.zoomLevel`.
		// If we pass a plain object, Svelte might not react to changes in the test if we just mutate it,
		// but the component reads from it.
		// However, for testing the click handler logic:

		// Let's rely on the handler call for verifying logic
		render(ZoomControls);

		const zoomInBtn = screen.getByLabelText('Zoom in');
		await fireEvent.click(zoomInBtn);

		expect(handlers.onZoom).toHaveBeenCalledWith(1.5);
		// Note: the context object mutation might not be reflected in DOM in this test setup
		// unless we use svelte's internal state mechanism or the component re-renders.
		// But we can check if the object was mutated.
		expect(defaultContext.zoomLevel).toBe(1.5);
	});

	it('handles zoom out', async () => {
		// Reset context state manually
		defaultContext.zoomLevel = 2;
		render(ZoomControls);

		const zoomOutBtn = screen.getByLabelText('Zoom out');
		await fireEvent.click(zoomOutBtn);

		expect(handlers.onZoom).toHaveBeenCalled(); // Should call with something less than 2
		expect(defaultContext.zoomLevel).toBeLessThan(2);
	});

	it('handles reset zoom', async () => {
		defaultContext.zoomLevel = 2.5;
		render(ZoomControls);

		const resetBtn = screen.getByLabelText('Reset zoom');
		await fireEvent.click(resetBtn);

		expect(handlers.onZoom).toHaveBeenCalledWith(1);
		expect(defaultContext.zoomLevel).toBe(1);
		expect(defaultContext.panOffset).toEqual({ x: 0, y: 0 });
	});

	it('disables zoom in at max level', () => {
		defaultContext.zoomLevel = 5;
		render(ZoomControls);
		expect(screen.getByLabelText('Zoom in')).toBeDisabled();
	});

	it('disables zoom out at min level', () => {
		defaultContext.zoomLevel = 0.5;
		render(ZoomControls);
		expect(screen.getByLabelText('Zoom out')).toBeDisabled();
	});

	it('disables reset when at default level', () => {
		defaultContext.zoomLevel = 1;
		render(ZoomControls);
		expect(screen.getByLabelText('Reset zoom')).toBeDisabled();
	});
});
